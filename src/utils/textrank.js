export function textRankSummarize(text, ratio = 0.3) {
    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    if (sentences.length <= 1) return text;

    const tokenize = sentence =>
        sentence
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/);

    const similarity = (s1, s2) => {
        const words1 = new Set(tokenize(s1));
        const words2 = new Set(tokenize(s2));

        const intersection = [...words1].filter(w => words2.has(w)).length;

        return intersection / (Math.log(words1.size) + Math.log(words2.size) || 1);
    };

    const scores = new Array(sentences.length).fill(1);

    for (let iter = 0; iter < 10; iter++) {
        for (let i = 0; i < sentences.length; i++) {
            let score = 0;

            for (let j = 0; j < sentences.length; j++) {
                if (i !== j) {
                    score += similarity(sentences[i], sentences[j]) * scores[j];
                }
            }

            scores[i] = 0.85 * score;
        }
    }

    const ranked = sentences.map((sentence, i) => ({
        sentence,
        score: scores[i],
    }));

    ranked.sort((a, b) => b.score - a.score);

    const summaryLength = Math.max(1, Math.floor(sentences.length * ratio));

    return ranked.slice(0, summaryLength).map(s => s.sentence).join(" ");
}