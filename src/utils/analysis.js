export function generateTitle(text) {

    const sentences = text.match(/[^.!?]+[.!?]+/g) || [];

    if (sentences.length === 0) return "Generated Summary";

    const first = sentences[0]
        .replace(/[^\w\s]/g, "")
        .split(" ")
        .slice(0, 8)
        .join(" ");

    return first + "...";
}



export function summaryQuality(originalWords, summaryWords) {

    if (!originalWords || !summaryWords) return 0;

    const compression = 1 - summaryWords / originalWords;

    let score = compression * 100;

    if (score > 90) score = 90;
    if (score < 20) score = 20;

    return Math.round(score);
}