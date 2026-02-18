export async function storeImageAndGetUrl(filename: string): Promise<string> {
  // Swap with AWS S3 or Azure Blob implementation in production.
  return `https://storage.example.com/uploads/${encodeURIComponent(filename)}`;
}
