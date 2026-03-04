import { motion } from "framer-motion";

function Stats({ wordCount, sentenceCount, readingTime, compression }) {

    const safeCompression = Math.max(0, Math.min(100, compression));

    const readingDisplay =
        readingTime < 1
            ? "< 1 min"
            : `${readingTime} min`;

    const isEmpty = wordCount === 0;

    const card =
        "bg-gray-900 p-4 rounded-lg shadow border border-gray-800";

    return (

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">

            {/* WORDS */}
            <motion.div
                whileHover={{ y: -4 }}
                className={card}
            >
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Words
                </p>

                <p className="text-2xl font-semibold mt-1">
                    {isEmpty ? "-" : wordCount}
                </p>
            </motion.div>


            {/* SENTENCES */}
            <motion.div
                whileHover={{ y: -4 }}
                className={card}
            >
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Sentences
                </p>

                <p className="text-2xl font-semibold mt-1">
                    {isEmpty ? "-" : sentenceCount}
                </p>
            </motion.div>


            {/* READING TIME */}
            <motion.div
                whileHover={{ y: -4 }}
                className={card}
            >
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Reading Time
                </p>

                <p className="text-2xl font-semibold mt-1">
                    {isEmpty ? "-" : readingDisplay}
                </p>
            </motion.div>


            {/* COMPRESSION */}
            <motion.div
                whileHover={{ y: -4 }}
                className={card}
            >
                <p className="text-xs text-gray-400 uppercase tracking-wide">
                    Compression
                </p>

                <p className="text-2xl font-semibold mt-1">
                    {isEmpty ? "-" : `${safeCompression}%`}
                </p>

                {!isEmpty && (
                    <div className="w-full bg-gray-700 h-2 rounded mt-2">

                        <motion.div
                            className="bg-blue-500 h-2 rounded"
                            initial={{ width: 0 }}
                            animate={{ width: `${safeCompression}%` }}
                            transition={{ duration: 0.6 }}
                        />

                    </div>
                )}

            </motion.div>

        </div>
    );
}

export default Stats;