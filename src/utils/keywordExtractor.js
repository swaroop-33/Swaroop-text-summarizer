export function extractKeywords(text, limit = 5) {

    const stopwords = new Set([
        "the", "is", "in", "at", "of", "a", "and", "to", "it", "for", "on", "that", "this", "with",
        "as", "are", "was", "were", "be", "by", "an", "or", "from", "into", "about", "around",
        "however", "also", "can", "will", "has", "have", "had", "their", "there", "they",
        "them", "its", "than", "then", "over", "under", "between", "among",
        "data"
    ]);

    const clean = text
        .toLowerCase()
        .replace(/[^a-zA-Z\s]/g, "");

    const words = clean.split(/\s+/)
        .filter(w => w.length > 2 && !stopwords.has(w));

    const unigram = {};
    const bigram = {};

    for (let i = 0; i < words.length; i++) {

        const w = words[i];
        unigram[w] = (unigram[w] || 0) + 1;

        if (i < words.length - 1) {

            const next = words[i + 1];

            if (!stopwords.has(next)) {

                const phrase = w + " " + next;

                bigram[phrase] = (bigram[phrase] || 0) + 1;
            }
        }
    }

    const results = [];

    Object.entries(unigram).forEach(([word, count]) => {
        results.push({ term: word, score: count });
    });

    Object.entries(bigram).forEach(([phrase, count]) => {
        if (count > 1) {
            results.push({ term: phrase, score: count * 2 });
        }
    });

    results.sort((a, b) => b.score - a.score);

    return results.slice(0, limit).map(x => x.term);
}