import { useState } from "react";
import * as pdfjsLib from "pdfjs-dist";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { motion } from "framer-motion";

pdfjsLib.GlobalWorkerOptions.workerSrc =
    `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

function FileUpload({ setText }) {

    const [loading, setLoading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [dragActive, setDragActive] = useState(false);

    const MAX_SIZE = 10 * 1024 * 1024;



    const finishExtraction = (text) => {
        setText(text);
        setTimeout(() => {
            setLoading(false);
            setProgress(0);
        }, 400);
    };



    const extractTXT = (file) => {

        const reader = new FileReader();

        reader.onload = (e) => {
            finishExtraction(e.target.result);
        };

        reader.readAsText(file);
    };



    const extractPDF = async (file) => {

        const reader = new FileReader();

        reader.onload = async () => {

            const typedarray = new Uint8Array(reader.result);

            const pdf = await pdfjsLib.getDocument({
                data: typedarray
            }).promise;

            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {

                const page = await pdf.getPage(i);
                const content = await page.getTextContent();

                const pageText =
                    content.items.map(item => item.str).join(" ");

                fullText += pageText + " ";

                setProgress(Math.round((i / pdf.numPages) * 100));
            }

            finishExtraction(fullText);
        };

        reader.readAsArrayBuffer(file);
    };



    const extractDOCX = async (file) => {

        const reader = new FileReader();

        reader.onload = async () => {

            const result = await mammoth.extractRawText({
                arrayBuffer: reader.result
            });

            setProgress(100);

            finishExtraction(result.value);
        };

        reader.readAsArrayBuffer(file);
    };



    const extractImageText = async (file) => {

        const result = await Tesseract.recognize(
            file,
            "eng",
            {
                logger: m => {
                    if (m.status === "recognizing text") {
                        setProgress(Math.round(m.progress * 100));
                    }
                }
            }
        );

        finishExtraction(result.data.text);
    };



    const processFile = (file) => {

        if (!file) return;

        if (file.size > MAX_SIZE) {
            alert("File too large (max 10MB)");
            return;
        }

        setLoading(true);
        setProgress(0);

        const type = file.type;

        if (type === "text/plain") {
            extractTXT(file);
        }

        else if (type === "application/pdf") {
            extractPDF(file);
        }

        else if (
            type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
        ) {
            extractDOCX(file);
        }

        else if (type.startsWith("image/")) {
            extractImageText(file);
        }

        else {
            alert("Unsupported file type");
            setLoading(false);
        }
    };



    const handleDrop = (e) => {

        e.preventDefault();
        setDragActive(false);

        const file = e.dataTransfer.files[0];

        processFile(file);
    };



    return (

        <div className="mt-6">

            <motion.div
                onDragOver={(e) => {
                    e.preventDefault();
                    setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleDrop}
                whileHover={{ scale: 1.02 }}
                className={`border-2 border-dashed p-6 rounded-lg text-center cursor-pointer
        ${dragActive ? "border-blue-500 bg-gray-900" : "border-gray-700"}`}
            >

                <p className="text-gray-400 text-sm mb-2">
                    Drag & Drop TXT, PDF, DOCX or Image
                </p>

                <input
                    type="file"
                    accept=".txt,.pdf,.docx,image/*"
                    onChange={(e) => processFile(e.target.files[0])}
                    className="text-sm"
                />

            </motion.div>



            {loading && (

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-4 bg-gray-900 p-4 rounded"
                >

                    <div className="w-full bg-gray-700 h-3 rounded">

                        <motion.div
                            className="bg-blue-500 h-3 rounded"
                            animate={{ width: `${progress}%` }}
                        />

                    </div>

                    <p className="text-xs text-gray-400 mt-2">
                        Extracting text… {progress}%
                    </p>

                </motion.div>

            )}

        </div>
    );
}

export default FileUpload;