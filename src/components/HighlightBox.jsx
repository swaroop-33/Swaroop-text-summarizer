function HighlightBox({ highlightedText }) {

    if (!highlightedText) return null;

    return (

        <div className="mt-8 bg-gray-900 p-5 rounded-xl shadow-lg border border-gray-800">

            <h2 className="text-xl font-semibold mb-4">
                Important Sentences
            </h2>

            <div className="max-h-96 overflow-y-auto bg-black p-4 rounded text-gray-200 leading-relaxed">

                <div
                    dangerouslySetInnerHTML={{ __html: highlightedText }}
                />

            </div>

        </div>
    );
}

export default HighlightBox;