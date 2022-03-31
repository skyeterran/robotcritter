import {Image} from 'https://deno.land/x/imagescript@v1.2.12/mod.ts';
import { resize } from "https://deno.land/x/deno_image@0.0.4/mod.ts";

async function getThumbnail(inPath: string): Promise<string> {
    const thumbPath = makeThumbnailPath(inPath);
    
    // If the thumbnail doesn't exist yet, generate it
    try {
        //
        const thumbFile = await Deno.open(thumbPath, { read: true });
        const stat = await thumbFile.stat();
    } catch {
        await generateThumbnail(inPath, 512);
        console.log(`Generated thumbnail for ${inPath}`);
    }

    return thumbPath;
}

function makeThumbnailPath(inPath: string): string {
    const inFilename = inPath.split("/").slice(-1)[0].split(".").slice(0, -1).join(".");
    const inDirectory = inPath.split("/").slice(0, -1).join("/");
    const outPath = `assets/thumbnails/${inDirectory.split("/").join("_")}_${inFilename}_thumbnail.jpg`;
    return outPath;
}

async function generateThumbnail(inPath: string, resolution: number) {
    const binary = await Deno.readFile(inPath);
    const image = await Image.decode(binary);
    
    let shortest_side = image.width;
    let x_offset = 0;
    let y_offset = 0;
    if (image.width >= image.height) {
        shortest_side = image.height;
        x_offset = Math.floor((image.width - image.height) / 2);
    } else {
        y_offset = Math.floor((image.height - image.width) / 2);
    }
    
    // Crop the image into a square
    image.crop(x_offset, y_offset, shortest_side, shortest_side);
    const cropped_binary = await image.encodeJPEG(100);
    
    // Resize the square image
    const thumbnail = await resize(cropped_binary, {
        width: resolution,
        height: resolution,
    });

    const outPath = makeThumbnailPath(inPath);
    await Deno.writeFile(outPath, thumbnail);
}

export { getThumbnail };