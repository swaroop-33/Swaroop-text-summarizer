import { useState } from "react";
import { frequencySummarize } from "./utils/frequencySummarizer";
import { textRankSummarize } from "./utils/textrank";
import { extractKeywords } from "./utils/keywordExtractor";

function App() {

  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const [keywords, setKeywords] = useState([]);
  const [algorithm, setAlgorithm] = useState("frequency");
  const [length, setLength] = useState("medium");
  const [mode, setMode] = useState("paragraph");

  const ratios = {
    short: 0.2,
    medium: 0.35,
    detailed: 0.5
  };

  const ratio = ratios[length];

  const wordCount = text.trim() ? text.trim().split(/\s+/).length : 0;

  const sentenceCount = text.trim()
    ? text.split(/[.!?]+/).filter(Boolean).length
    : 0;

  const readingTime = Math.ceil(wordCount / 200);

  const summaryWordCount = summary.trim()
    ? summary.trim().split(/\s+/).length
    : 0;

  const compression =
    wordCount > 0
      ? Math.round((1 - summaryWordCount / wordCount) * 100)
      : 0;

  const copySummary = () => {
    if (!summary) return;
    navigator.clipboard.writeText(summary);
    alert("Summary copied!");
  };

  const handleSummarize = () => {

    ```
if (!text.trim()) {
  alert("Please paste some text first.");
  return;
}

let result;

if (algorithm === "textrank") {
  result = textRankSummarize(text, ratio);
} else {
  result = frequencySummarize(text, ratio);
}

if (mode === "bullet") {
  const sentences = result.match(/[^.!?]+[.!?]+/g) || [];
  result = sentences.map(s => "• " + s.trim()).join("\n");
}

setSummary(result);

const kw = extractKeywords(text, 5);
setKeywords(kw);
```

  };

  const clearAll = () => {
    setText("");
    setSummary("");
    setKeywords([]);
  };

  return (

    ```
<div className="min-h-screen bg-black text-white flex justify-center">

  <div className="w-full max-w-6xl p-10">

    <h1 className="text-4xl font-bold mb-2">
      Swaroop's Text Summarizer
    </h1>

    <p className="text-gray-400 mb-8">
      AI-powered text summarization using Frequency and TextRank algorithms
    </p>

    <textarea
      className="w-full h-48 p-4 text-black rounded"
      placeholder="Paste your article text here..."
      value={text}
      onChange={(e) => setText(e.target.value)}
    />

    <div className="grid grid-cols-4 gap-4 mt-6 text-center">

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

    <div className="flex gap-6 mt-6">

      <div>
        <label className="block mb-1">Algorithm</label>
        <select
          className="p-2 text-black rounded"
          value={algorithm}
          onChange={(e) => setAlgorithm(e.target.value)}
        >
          <option value="frequency">Frequency</option>
          <option value="textrank">TextRank</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Summary Length</label>
        <select
          className="p-2 text-black rounded"
          value={length}
          onChange={(e) => setLength(e.target.value)}
        >
          <option value="short">Short</option>
          <option value="medium">Medium</option>
          <option value="detailed">Detailed</option>
        </select>
      </div>

      <div>
        <label className="block mb-1">Output Mode</label>
        <select
          className="p-2 text-black rounded"
          value={mode}
          onChange={(e) => setMode(e.target.value)}
        >
          <option value="paragraph">Paragraph</option>
          <option value="bullet">Bullet Points</option>
        </select>
      </div>

    </div>

    <div className="mt-6 flex gap-4">

      <button
        onClick={handleSummarize}
        className="px-6 py-2 bg-blue-500 rounded hover:bg-blue-600"
      >
        Summarize
      </button>

      <button
        onClick={clearAll}
        className="px-6 py-2 bg-gray-700 rounded hover:bg-gray-600"
      >
        Clear
      </button>

    </div>

    {summary && (

      <div className="mt-8 bg-gray-900 p-4 rounded">

        <div className="flex justify-between items-center mb-2">

          <h2 className="text-xl">Summary</h2>

          <button
            onClick={copySummary}
            className="text-sm bg-blue-600 px-3 py-1 rounded"
          >
            Copy
          </button>

        </div>

        <pre className="whitespace-pre-wrap">{summary}</pre>

      </div>

    )}

    {keywords.length > 0 && (

      <div className="mt-6">

        <h2 className="text-xl mb-2">Keywords</h2>

        <div className="flex flex-wrap gap-2">

          {keywords.map((k, i) => (
            <span
              key={i}
              className="bg-blue-600 px-3 py-1 rounded text-sm"
            >
              {k}
            </span>
          ))}

        </div>

      </div>

    )}

    <footer className="text-center mt-16 text-gray-500">
      Built by Swaroop • React + Vite + Tailwind • NLP Algorithms
    </footer>

  </div>

</div>
```

  );
}

export default App;
