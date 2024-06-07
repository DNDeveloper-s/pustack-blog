/**
 *
 * @param description Trim the description to the nearest sentence ending within the word limit
 * @param wordLimit Word limit for the description
 * @returns {string} Trimmed description
 */
export function trimToSentence(description: string, wordLimit = 150) {
  // Split the description into words
  const words = description.split(/\s+/);

  // If the description is within the word limit, return it as is
  if (words.length <= wordLimit) {
    return description;
  }

  // Otherwise, take only the first 'wordLimit' words
  const limitedWords = words.slice(0, wordLimit).join(" ");

  // Find the position of the last sentence-ending period within the limited words
  const lastSentenceEnd = limitedWords.lastIndexOf(".");
  if (lastSentenceEnd !== -1) {
    return limitedWords.substring(0, lastSentenceEnd + 1);
  } else {
    // If no sentence ending found, return the limited words
    return limitedWords;
  }
}
