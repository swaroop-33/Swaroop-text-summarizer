import { useState } from "react";

function SummaryBox({
    title = "Summary",
    summary,
    copySummary,
    downloadTXT,
    downloadPDF
}) {

    const [copied, setCopied] = useState(false);

    if (!summary) return null;

    const handleCopy = () => {

        if (copySummary) copySummary();

        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1500);
    };

    const downloadMarkdown = () => {

        const mdContent = `# ${title}\n\n${summary}`;

        const blob = new Blob([mdContent], {
            type: "text/markdown"
        });

        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");

        link.href = url;
        link.download = "summary.md";
        link.click();

        URL.revokeObjectURL(url);
    };

    return (

        <div className="mt-8 backdrop-blur-md bg-gray-900/70 p-5 rounded-xl shadow-lg border border-gray-700">

            <div className="flex justify-between items-center mb-4">

                <h2 className="text-xl font-semibold">
                    {title}
                </h2>

                <div className="flex gap-2">

                    {copySummary && (
                        <button
                            onClick={handleCopy}
                            className="text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded transition"
                        >
                            {copied ? "Copied!" : "Copy"}
                        </button>
                    )}

                    {downloadTXT && (
                        <button
                            onClick={downloadTXT}
                            className="text-sm bg-green-600 hover:bg-green-700 px-3 py-1.5 rounded transition"
                        >
                            TXT
                        </button>
                    )}

                    {downloadPDF && (
                        <button
                            onClick={downloadPDF}
                            className="text-sm bg-red-600 hover:bg-red-700 px-3 py-1.5 rounded transition"
                        >
                            PDF
                        </button>
                    )}

                    <button
                        onClick={downloadMarkdown}
                        className="text-sm bg-purple-600 hover:bg-purple-700 px-3 py-1.5 rounded transition"
                    >
                        MD
                    </button>

                </div>

            </div>

            <div className="max-h-96 overflow-y-auto bg-black/70 p-4 rounded">

                <pre className="whitespace-pre-wrap text-gray-200 leading-relaxed">
                    {summary}
                </pre>

            </div>

        </div>
    );
}

export default SummaryBox;