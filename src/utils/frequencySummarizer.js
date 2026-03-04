export function frequencySummarize(text, mode = "medium") {

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    if (sentences.length < 2) {
        return {
            summary: text,
            indexes: [0]
        };
    }

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

        let normalizedScore = count > 0 ? score / count : 0;

        // position boost
        if (index === 0) normalizedScore += 0.2;
        if (index === sentences.length - 1) normalizedScore += 0.1;

        return {
            sentence,
            score: normalizedScore,
            index
        };

    });


    scores.sort((a, b) => b.score - a.score);

    const total = sentences.length;

    let summaryLength;

    if (total <= 5) {

        if (mode === "short") summaryLength = 1;
        else if (mode === "medium") summaryLength = 2;
        else summaryLength = 3;

    } else {

        const config = {
            short: { ratio: 0.15, min: 1, max: 3 },
            medium: { ratio: 0.30, min: 3, max: 6 },
            detailed: { ratio: 0.55, min: 5, max: 12 }
        };

        const { ratio, min, max } = config[mode];

        const target = Math.round(total * ratio);

        summaryLength = Math.max(min, Math.min(target, max));
    }


    const selected = scores.slice(0, summaryLength);

    const indexes = selected.map(s => s.index);

    selected.sort((a, b) => a.index - b.index);

    const summary = selected.map(s => s.sentence).join(" ");

    return {
        summary,
        indexes
    };
}