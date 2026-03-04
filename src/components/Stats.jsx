function Stats({ wordCount, sentenceCount, readingTime, compression }) {
    return (<div className="grid grid-cols-4 gap-4 mt-6 text-center">

        ```
        <div className="bg-gray-900 p-4 rounded">
            <p className="text-sm text-gray-400">Words</p>
            <p className="text-xl">{wordCount}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded">
            <p className="text-sm text-gray-400">Sentences</p>
            <p className="text-xl">{sentenceCount}</p>
        </div>

        <div className="bg-gray-900 p-4 rounded">
            <p className="text-sm text-gray-400">Reading Time</p>
            <p className="text-xl">{readingTime} min</p>
        </div>

        <div className="bg-gray-900 p-4 rounded">
            <p className="text-sm text-gray-400">Compression</p>
            <p className="text-xl">{compression}%</p>
        </div>

    </div>


    );
}

export default Stats;
