export const extractCategoryName = (fullText: string): string => {
  const match = fullText.match(/(?:\(\d+\)\s*•\s*)?(.+?)(?:\s*\(\d+\))?$/)
  return match ? match[1].trim() : fullText.trim()
}
