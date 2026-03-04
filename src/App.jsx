import { useState, useEffect } from "react";
import { motion } from "framer-motion";

import { frequencySummarize } from "./utils/frequencySummarizer";
import { textRankSummarize } from "./utils/textrank";
import { extractKeywords } from "./utils/keywordExtractor";

import FileUpload from "./components/FileUpload";
import Stats from "./components/Stats";
import SummaryBox from "./components/SummaryBox";
import HighlightBox from "./components/HighlightBox";

function App() {

  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [highlightedText, setHighlightedText] = useState(null);
  const [comparison, setComparison] = useState(null);
  const [keywords, setKeywords] = useState([]);

  const [algorithm, setAlgorithm] = useState("frequency");
  const [summaryLength, setSummaryLength] = useState("medium");
  const [mode, setMode] = useState("paragraph");

  const [title, setTitle] = useState("");
  const [quality, setQuality] = useState(null);
  const [shareLink, setShareLink] = useState("");

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const shared = params.get("summary");

    if (shared) {
      const decoded = decodeURIComponent(shared);
      setSummary(decoded);
    }
  }, []);

  const wordCount = text.trim()
    ? text.trim().split(/\s+/).length
    : 0;

  const sentenceCount = text.trim()
    ? text.split(/[.!?]+/).filter(Boolean).length
    : 0;

  const readingTime = Math.ceil(wordCount / 200);

  const summaryWordCount = summary.trim()
    ? summary.trim().split(/\s+/).length
    : 0;

  const compression = wordCount > 0
    ? Math.min(95, Math.round((1 - summaryWordCount / wordCount) * 100))
    : 0;

  const exampleText =
    `Artificial intelligence (AI) refers to the simulation of human intelligence in machines that are programmed to think and learn like humans. AI technologies are widely used in modern applications such as recommendation systems, autonomous vehicles, medical diagnostics, and financial analysis.`;

  const loadExample = () => {
    setText(exampleText);
    setSummary("");
    setComparison(null);
    setHighlightedText(null);
    setKeywords([]);
    setTitle("");
    setQuality(null);
  };

  const formatOutput = (text) => {
    if (mode === "bullet") {
      const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
      return sentences.map(s => "• " + s.trim()).join("\n");
    }
    return text;
  };

  const highlightSentences = (text, indexes) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    const html = sentences
      .map((s, i) => {
        if (indexes.includes(i)) {
          return `<span style="background:linear-gradient(90deg,#2563eb33,#22c55e33);padding:2px 4px;border-radius:4px">${s}</span>`;
        }
        return s;
      })
      .join(" ");

    return html;
  };

  const generateTitle = (text) => {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];
    if (sentences.length === 0) return "Generated Summary";

    return sentences[0]
      .replace(/[^\w\s]/g, "")
      .split(" ")
      .slice(0, 8)
      .join(" ") + "...";
  };

  const calculateQuality = (originalWords, summaryWords) => {
    if (!originalWords || !summaryWords) return 0;

    const compression = 1 - summaryWords / originalWords;
    let score = compression * 100;

    if (score > 90) score = 90;
    if (score < 20) score = 20;

    return Math.round(score);
  };

  const generateShareLink = () => {
    if (!summary) return;

    const encoded = encodeURIComponent(summary);
    const link = window.location.origin + "?summary=" + encoded;

    setShareLink(link);
    navigator.clipboard.writeText(link);
  };

  const handleSummarize = () => {

    if (!text.trim()) {
      alert("Please paste some text first.");
      return;
    }

    setLoading(true);

    setTimeout(() => {

      let result;

      if (algorithm === "textrank") {
        result = textRankSummarize(text, summaryLength);
      } else {
        result = frequencySummarize(text, summaryLength);
      }

      const formatted = formatOutput(result.summary);

      setSummary(formatted);
      setHighlightedText(highlightSentences(text, result.indexes));
      setComparison(null);
      setKeywords(extractKeywords(text, 5));

      setTitle(generateTitle(result.summary));

      setQuality(
        calculateQuality(
          wordCount,
          result.summary.split(/\s+/).length
        )
      );

      setLoading(false);

    }, 400);
  };

  const handleCompare = () => {

    if (!text.trim()) {
      alert("Please paste some text first.");
      return;
    }

    setSummary("");
    setHighlightedText(null);
    setLoading(true);

    setTimeout(() => {

      const freqResult = frequencySummarize(text, summaryLength);
      const rankResult = textRankSummarize(text, summaryLength);

      const freq = formatOutput(freqResult.summary);
      const rank = formatOutput(rankResult.summary);

      setComparison({
        frequency: freq,
        textrank: rank
      });

      setKeywords(extractKeywords(text, 5));

      setLoading(false);

    }, 400);
  };

  const clearAll = () => {
    setText("");
    setSummary("");
    setComparison(null);
    setHighlightedText(null);
    setKeywords([]);
    setTitle("");
    setQuality(null);
    setShareLink("");
  };

  const copySummary = () => {
    navigator.clipboard.writeText(summary);
  };

  const downloadTXT = () => {
    const blob = new Blob([summary], { type: "text/plain" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "summary.txt";
    link.click();

    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {

    const win = window.open("", "_blank");

    win.document.write(`
      <html>
      <body style="font-family:Arial;padding:40px">
        <h2>Summary</h2>
        <pre>${summary}</pre>
      </body>
      </html>
    `);

    win.print();
  };

  return (

    <div className="min-h-screen bg-black text-white flex justify-center">

      <div className="w-full max-w-6xl p-10">

        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold mb-2"
        >
          Swaroop's Text Summarizer
        </motion.h1>

        <p className="text-gray-400 mb-6">
          Extractive text summarization using Frequency and TextRank algorithms
        </p>

        <FileUpload setText={setText} />

        <textarea
          className="w-full h-48 p-4 text-black rounded mt-4"
          placeholder="Paste text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.ctrlKey && e.key === "Enter") {
              handleSummarize();
            }
          }}
        />

        <button
          onClick={loadExample}
          className="mt-3 px-4 py-2 bg-purple-600 rounded"
        >
          Load Example
        </button>

        <Stats
          wordCount={wordCount}
          sentenceCount={sentenceCount}
          readingTime={readingTime}
          compression={compression}
        />

        {quality && (

          <div className="mt-4 bg-gray-900 p-4 rounded border border-gray-800">

            <p className="text-sm text-gray-400">
              Summary Quality Score
            </p>

            <div className="w-full bg-gray-700 h-3 rounded mt-2">

              <div
                className="bg-green-500 h-3 rounded"
                style={{ width: `${quality}%` }}
              />

            </div>

            <p className="text-xs mt-1">
              {quality}/100
            </p>

          </div>

        )}

        <div className="flex gap-6 mt-6 flex-wrap items-center">

          <select
            className="p-2 text-black rounded"
            value={algorithm}
            onChange={(e) => setAlgorithm(e.target.value)}
          >
            <option value="frequency">Frequency</option>
            <option value="textrank">TextRank</option>
          </select>

          <select
            className="p-2 text-black rounded"
            value={summaryLength}
            onChange={(e) => setSummaryLength(e.target.value)}
          >
            <option value="short">Short</option>
            <option value="medium">Medium</option>
            <option value="detailed">Detailed</option>
          </select>

          <select
            className="p-2 text-black rounded"
            value={mode}
            onChange={(e) => setMode(e.target.value)}
          >
            <option value="paragraph">Paragraph</option>
            <option value="bullet">Bullet</option>
          </select>

        </div>

        <div className="flex gap-4 mt-6 flex-wrap">

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleSummarize}
            disabled={loading}
            className="px-6 py-2 bg-blue-500 rounded"
          >
            {loading ? "Processing..." : "Summarize"}
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleCompare}
            className="px-6 py-2 bg-purple-600 rounded"
          >
            Compare Algorithms
          </motion.button>

          <button
            onClick={clearAll}
            className="px-6 py-2 bg-gray-700 rounded"
          >
            Clear
          </button>

          <button
            onClick={generateShareLink}
            className="px-6 py-2 bg-green-600 rounded"
          >
            Share Summary
          </button>

        </div>

        {shareLink && (

          <div className="mt-4 text-sm text-green-400">
            Shareable Link Copied:

            <div className="break-all text-gray-300">
              {shareLink}
            </div>
          </div>

        )}

        {title && (
          <h2 className="text-2xl font-semibold mt-8">
            {title}
          </h2>
        )}

        {summary && (

          <SummaryBox
            title="Summary"
            summary={summary}
            copySummary={copySummary}
            downloadTXT={downloadTXT}
            downloadPDF={downloadPDF}
          />

        )}

        {highlightedText && (
          <HighlightBox highlightedText={highlightedText} />
        )}

        {comparison && (

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <SummaryBox
              title="Frequency Summary"
              summary={comparison.frequency}
              copySummary={() =>
                navigator.clipboard.writeText(comparison.frequency)
              }
            />

            <SummaryBox
              title="TextRank Summary"
              summary={comparison.textrank}
              copySummary={() =>
                navigator.clipboard.writeText(comparison.textrank)
              }
            />

          </div>

        )}

        {keywords.length > 0 && (

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-6"
          >

            <h2 className="text-xl mb-2">Keywords</h2>

            <div className="flex flex-wrap gap-2">

              {keywords.map((k, i) => (

                <motion.span
                  key={i}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="bg-blue-600 px-3 py-1 rounded text-sm"
                >
                  {k}
                </motion.span>

              ))}

            </div>

          </motion.div>

        )}

      </div>

    </div>
  );
}

export default App;