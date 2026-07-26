import { readFileSync } from "node:fs";
import path from "node:path";

const privateKey = process.env.PRIVATE_KEY;

if (!privateKey) {
    throw new Error("PRIVATE_KEY is missing from the environment");
}

export const PRIVATE_KEY = privateKey.replace(/\\n/g, "\n");
export const PUBLIC_KEY = readFileSync(path.resolve("cert/public-key.pub"));
