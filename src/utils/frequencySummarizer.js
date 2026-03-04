export function frequencySummarize(text, ratio = 0.3) {

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    if (sentences.length < 2) return text;

    const stopwords = new Set([
        "the", "is", "in", "at", "of", "a", "and", "to", "it", "for", "on", "that", "this",
        "with", "as", "are", "was", "were", "be", "by", "an", "or", "from", "into", "about"
    ]);

    const words = text
        .toLowerCase()
        .replace(/[^a-zA-Z\s]/g, "")
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopwords.has(w));

    const freq = {};

    words.forEach(word => {
        freq[word] = (freq[word] || 0) + 1;
    });

    const maxFreq = Math.max(...Object.values(freq));

    Object.keys(freq).forEach(word => {
        freq[word] = freq[word] / maxFreq;
    });

    const scores = sentences.map((sentence, index) => {

        const sentenceWords = sentence
            .toLowerCase()
            .replace(/[^a-zA-Z\s]/g, "")
            .split(/\s+/);

        let score = 0;
        let count = 0;

        sentenceWords.forEach(word => {
            if (freq[word]) {
                score += freq[word];
                count++;
            }
        });

        const normalizedScore = count > 0 ? score / count : 0;

        return {
            sentence,
            score: normalizedScore,
            index
        };

    });

    scores.sort((a, b) => b.score - a.score);

    const summaryLength = Math.max(1, Math.floor(sentences.length * ratio));

    const selected = scores.slice(0, summaryLength);

    selected.sort((a, b) => a.index - b.index);

    return selected.map(s => s.sentence).join(" ");
}