import { Uploader } from "uploader";

// https://www.npmjs.com/package/uploader
// Initialize once (at the start of your app).
export const uploader = Uploader({ apiKey: import.meta.env.VITE_IMAGE_UPLOADER_API });