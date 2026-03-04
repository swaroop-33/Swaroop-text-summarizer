export function extractKeywords(text, limit = 5) {

    const stopwords = new Set([
        "the", "is", "in", "at", "of", "a", "and", "to", "it", "for", "on", "that", "this", "with",
        "as", "are", "was", "were", "be", "by", "an", "or", "from", "into", "about", "around",
        "however", "also", "can", "will", "has", "have", "had", "their", "there", "they",
        "them", "its", "than", "then", "over", "under", "between", "among"
    ]);


    const clean = text
        .toLowerCase()
        .replace(/[^a-zA-Z\s]/g, "");


    const words = clean
        .split(/\s+/)
        .filter(w => w.length > 2 && !stopwords.has(w));


    const normalize = word => {

        if (word.endsWith("ies")) return word.slice(0, -3) + "y";
        if (word.endsWith("s") && word.length > 4) return word.slice(0, -1);

        return word;
    };


    const unigram = {};
    const bigram = {};


    for (let i = 0; i < words.length; i++) {

        const w = normalize(words[i]);

        unigram[w] = (unigram[w] || 0) + 1;

        if (i < words.length - 1) {

            const next = normalize(words[i + 1]);

            if (!stopwords.has(next)) {

                const phrase = w + " " + next;

                bigram[phrase] = (bigram[phrase] || 0) + 1;
            }
        }
    }


    const results = [];


    Object.entries(unigram).forEach(([word, count]) => {
        results.push({
            term: word,
            score: count
        });
    });


    Object.entries(bigram).forEach(([phrase, count]) => {
        results.push({
            term: phrase,
            score: count * 2
        });
    });


    results.sort((a, b) => b.score - a.score);


    const seen = new Set();
    const final = [];

    for (let item of results) {

        const root = item.term.split(" ")[0];

        if (!seen.has(root)) {

            final.push(item.term);
            seen.add(root);

        }

        if (final.length === limit) break;
    }


    return final;
}