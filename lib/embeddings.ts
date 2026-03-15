/**
 * Embeddings and Similarity Search
 *
 * This module provides text embedding generation and similarity search.
 * Previously used Supabase for storage; now stubbed for Firebase migration.
 *
 * TODO: Migrate Firestore collections for conversations and vector search.
 */

// Improved embedding function
export async function getEmbedding(text: string): Promise<number[]> {
  try {
    console.log("Generating embedding for:", text.substring(0, 50) + "...");

    // Normalize and tokenize the text
    const normalizedText = text
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .trim()
      .replace(/\s+/g, " ");

    const words = normalizedText.split(/\s+/);

    // Create a fixed-size embedding (768 dimensions)
    const embedding = new Array(768).fill(0);

    // For each word, create a more sophisticated embedding
    words.forEach((word, wordIndex) => {
      const positionFactor = (wordIndex + 1) / words.length;
      const wordChars = Array.from(word);
      const wordLength = word.length;

      wordChars.forEach((char, charIndex) => {
        const charCode = char.charCodeAt(0);
        const relativePosition = charIndex / wordLength;

        const positions = [
          (wordIndex * 50 + charIndex) % 768,
          (charCode * positionFactor * 10) % 768,
          (wordLength * 20 + charIndex * 3) % 768,
        ];

        positions.forEach((pos) => {
          const idx = Math.floor(pos);
          embedding[idx] =
            (embedding[idx] + (charCode / 255) * (1 - relativePosition)) / 2;
        });
      });
    });

    // Normalize the embedding
    const magnitude = Math.sqrt(
      embedding.reduce((sum: number, val: number) => sum + val * val, 0)
    );
    const normalizedEmbedding = embedding.map(
      (val: number) => val / (magnitude || 1)
    );

    console.log(`Generated embedding of length ${normalizedEmbedding.length}`);
    return normalizedEmbedding;
  } catch (error) {
    console.error("Error generating embedding:", error);
    if (error instanceof Error) {
      console.error("Error details:", error.message);
      console.error("Error stack:", error.stack);
    }
    throw error;
  }
}

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s]/g, "")
    .replace(/\s+/g, " ");
}

function calculateSimilarity(text1: string, text2: string): number {
  const normalized1 = normalizeText(text1);
  const normalized2 = normalizeText(text2);

  if (normalized1 === normalized2) return 1;

  const words1 = normalized1.split(" ");
  const words2 = normalized2.split(" ");

  const lengthDiff = Math.abs(words1.length - words2.length);
  if (lengthDiff > Math.min(words1.length, words2.length)) {
    return 0.1;
  }

  let matchScore = 0;
  const totalScore = Math.max(words1.length, words2.length);

  for (let i = 0; i < words1.length; i++) {
    const word1 = words1[i];
    let bestWordMatch = 0;

    for (let j = 0; j < words2.length; j++) {
      const word2 = words2[j];
      let wordSimilarity = 0;

      if (word1 === word2) {
        const positionDiff = Math.abs(i - j);
        const positionPenalty =
          positionDiff / Math.max(words1.length, words2.length);
        wordSimilarity = 1 - positionPenalty * 0.5;
      } else if (word1.length >= 4 && word2.length >= 4) {
        if (word1.includes(word2) || word2.includes(word1)) {
          wordSimilarity = 0.7;
        } else {
          const commonChars = [...word1].filter((char) =>
            word2.includes(char)
          ).length;
          const charSimilarity =
            commonChars / Math.max(word1.length, word2.length);

          if (charSimilarity > 0.6) {
            wordSimilarity = charSimilarity * 0.5;
          }
        }
      }

      bestWordMatch = Math.max(bestWordMatch, wordSimilarity);
    }

    const positionImportance = 1 - (i / words1.length) * 0.3;
    matchScore += bestWordMatch * positionImportance;
  }

  let similarity = matchScore / totalScore;

  if (words1.length !== words2.length) {
    similarity *= 0.9;
  }

  return similarity < 0.3 ? 0 : similarity;
}

/**
 * Find similar questions from stored conversations.
 * TODO: Migrate to Firebase/Firestore with vector search.
 */
export async function findSimilarQuestions(
  question: string,
  _threshold = 0.3
): Promise<{ question: string; answer: string } | null> {
  try {
    const normalizedQuestion = normalizeText(question);
    console.log("Finding similar questions for:", normalizedQuestion);

    // TODO: Implement Firestore query for similar questions
    console.warn(
      "findSimilarQuestions: Firebase migration pending. Returning null."
    );
    return null;
  } catch (error) {
    console.error("Error finding similar questions:", error);
    return null;
  }
}

/**
 * Store a conversation Q&A pair.
 * TODO: Migrate to Firebase/Firestore.
 */
export async function storeConversation(
  question: string,
  answer: string
): Promise<{ question: string; answer: string } | null> {
  try {
    const normalizedQuestion = normalizeText(question);
    console.warn(
      "storeConversation: Firebase migration pending. Not persisting."
    );

    // Return the data as-is (not persisted yet)
    return { question: normalizedQuestion, answer };
  } catch (error) {
    console.error("Error storing conversation:", error);
    throw error;
  }
}

// Re-export calculateSimilarity for potential use elsewhere
export { calculateSimilarity };
