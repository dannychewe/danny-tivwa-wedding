export async function readJsonResponse<T>(response: Response): Promise<T> {
  const text = await response.text();

  if (!text) {
    throw new Error(
      response.ok
        ? "The server returned an empty response."
        : `Request failed with status ${response.status}.`
    );
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(text || `Request failed with status ${response.status}.`);
  }
}
