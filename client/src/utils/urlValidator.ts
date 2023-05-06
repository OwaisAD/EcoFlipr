export function isValidHttpUrl(imgUrl: string) {
  let url;

  try {
    url = new URL(imgUrl);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
}
