import { listDir } from "./dep.ts";
import { createHash } from "https://deno.land/std@0.77.0/hash/mod.ts";

async function flushCache() {
    const cacheFiles = await listDir("./cache");
    console.log("Flushing cache...");
    for (let i in cacheFiles) {
        await Deno.remove(cacheFiles[i]);
    }
}

async function writeCacheFile(seed: string, o: any) {
    await Deno.writeTextFile(`./cache/${seed}.json`, JSON.stringify(o));
}

function makeHash(o: any): string {
    const hash = createHash("md5");
    hash.update(JSON.stringify(o));
    return bufferToHex(hash.digest());
}

function bufferToHex(buffer: ArrayBuffer): string {
    return [...new Uint8Array (buffer)]
        .map (b => b.toString (16).padStart (2, "0"))
        .join ("");
}

export { flushCache, writeCacheFile, makeHash };