export function textRankSummarize(text, mode = "medium") {

    const sentences =
        text.match(/[^.!?]+[.!?]+/g) ||
        text.split(/[.!?]/).filter(s => s.trim().length > 0);

    if (sentences.length <= 1) {
        return {
            summary: text,
            indexes: [0]
        };
    }

    const tokenize = sentence =>
        sentence
            .toLowerCase()
            .replace(/[^\w\s]/g, "")
            .split(/\s+/)
            .filter(Boolean);


    const similarity = (s1, s2) => {

        const words1 = tokenize(s1);
        const words2 = tokenize(s2);

        const set1 = new Set(words1);
        const set2 = new Set(words2);

        if (set1.size === 0 || set2.size === 0) return 0;

        const intersection = [...set1].filter(w => set2.has(w)).length;

        return intersection / (Math.sqrt(set1.size) * Math.sqrt(set2.size));
    };


    const n = sentences.length;

    const scores = new Array(n).fill(1);


    /* ----------- BUILD SIMILARITY MATRIX (OPTIMIZATION) ----------- */

    const matrix = Array.from({ length: n }, () => new Array(n).fill(0));

    for (let i = 0; i < n; i++) {
        for (let j = i + 1; j < n; j++) {

            const sim = similarity(sentences[i], sentences[j]);

            matrix[i][j] = sim;
            matrix[j][i] = sim;

        }
    }


    /* ----------- PAGERANK ITERATIONS ----------- */

    for (let iter = 0; iter < 10; iter++) {

        const newScores = new Array(n).fill(0);

        for (let i = 0; i < n; i++) {

            let sum = 0;

            for (let j = 0; j < n; j++) {

                if (i === j) continue;

                const sim = matrix[i][j];

                if (sim === 0) continue;

                let denom = 0;

                for (let k = 0; k < n; k++) {
                    if (j !== k) denom += matrix[j][k];
                }

                if (denom !== 0) {
                    sum += (sim / denom) * scores[j];
                }
            }

            newScores[i] = 0.15 + 0.85 * sum;
        }

        for (let i = 0; i < n; i++) {
            scores[i] = newScores[i];
        }
    }


    /* ----------- RANK SENTENCES ----------- */

    const ranked = sentences.map((sentence, i) => ({
        sentence,
        score: scores[i],
        index: i
    }));


    ranked.sort((a, b) => b.score - a.score);


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


    const selected = ranked.slice(0, summaryLength);

    const indexes = selected.map(s => s.index);

    selected.sort((a, b) => a.index - b.index);

    const summary = selected.map(s => s.sentence.trim()).join(" ");

    return {
        summary,
        indexes
    };
}