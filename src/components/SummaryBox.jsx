function SummaryBox({ summary, copySummary, downloadTXT, downloadPDF }) {

    if (!summary) return null;

    return (<div className="mt-8 bg-gray-900 p-4 rounded">

        ```
        <div className="flex justify-between items-center mb-2">

            <h2 className="text-xl">Summary</h2>

            <div className="flex gap-2">

                <button
                    onClick={copySummary}
                    className="text-sm bg-blue-600 px-3 py-1 rounded"
                >
                    Copy
                </button>

                <button
                    onClick={downloadTXT}
                    className="text-sm bg-green-600 px-3 py-1 rounded"
                >
                    TXT
                </button>

                <button
                    onClick={downloadPDF}
                    className="text-sm bg-red-600 px-3 py-1 rounded"
                >
                    PDF
                </button>

            </div>

        </div>

        <pre className="whitespace-pre-wrap">{summary}</pre>

    </div>


    );
}

export default SummaryBox;
