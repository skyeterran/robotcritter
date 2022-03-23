import { React, ReactDOMServer } from "./dep.ts";
import { serve } from "https://deno.land/std@0.130.0/http/server.ts";
import { readableStreamFromReader } from "https://deno.land/std@0.130.0/streams/mod.ts"
import { writeCacheFile, makeHash } from "./cache.ts";

import App from "./components/App.tsx";
import Gallery from "./components/Gallery.tsx";

const port = 8000;
console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);

serve(async (request) => {
    const url = new URL(request.url);
    const filepath = decodeURIComponent(url.pathname);
    
    // Handle asset requests
    // TODO: Come up with a better routing solution than this; this hardcodes assets/ as the static resource root
    if (filepath.startsWith("/assets/")) {
        // Try opening the file
        let file;
        try {
            file = await Deno.open("." + filepath, { read: true });
            const stat = await file.stat();
        } catch {
            // If the file cannot be opened, return a "404 Not Found" response
            return new Response("404 Not Found", { status: 404 });
        }

        // Build a readable stream so the file doesn't have to be fully loaded into
        // memory while we send it
        const readableStream = readableStreamFromReader(file);
        
        // Build and send the response
        return new Response(readableStream);
    } else {
        // Generate HTML via the current route's corresponding React element
        let startTime = performance.now();
        switch (filepath) {
            case "/": {
                return new Response(new TextEncoder().encode(await generateHTML(<App />)), { status: 200 });
            }
            case "/gallery": {
                const pics = await listDir("assets/gallery/");
                
                // SeedHash is used to identify which cached data (if any) corresponds with the desired page state
                const seedHash = makeHash(JSON.stringify({ url: filepath, props: pics }));
                
                let html = "";

                // Check if cached HTML exists for this page
                let file;
                try {
                    file = await Deno.open(`./cache/${seedHash}.json`, { read: true });
                    const stat = await file.stat();
                    console.log(`Found cache file for ${seedHash}! Loading...`);

                    // Load the cache file's payload
                    const cacheData = await Deno.readFile(`./cache/${seedHash}.json`);
                    html = JSON.parse(new TextDecoder('utf-8').decode(cacheData));
                } catch {
                    // If no cached HTML exists, generate it now and save it
                    console.log(`No corresponding cache file exists for ${seedHash}. Generating...`)
                    html = await generateHTML(<Gallery paths={pics}/>);
                    await writeCacheFile(seedHash, html);
                }

                // Return the generated HTML
                let endTime = performance.now();
                console.log(`Delivered content in ${endTime - startTime}ms.`);
                return new Response(new TextEncoder().encode(html), { status: 200 });
            }
            default:
                // If that's not a valid route, return a 404 error
                return new Response("404 Not Found", { status: 404 });
        }
    }
});

async function generateHTML(element: JSX.Element): Promise<string> {
    let startTime = performance.now();
    const innerHTML = ReactDOMServer.renderToStaticMarkup(element);
    const style = await Deno.readTextFile("./resources/styles/app.css");
    let endTime = performance.now();
    console.log(`Static HTML content generated in ${endTime - startTime}ms.`);
    const buildMsg = `This page was generated in ${endTime - startTime} milliseconds.`;

    const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Server-Side Rendering Test</title>
    <style>
${style}
    </style>
</head>
<body >
    <div id="root">
        ${innerHTML}
        <p>${buildMsg}</p>
    </div>
</body>
</html>`;

    return html;
}

async function listDir(dirPath: string): Promise<string[]> {
    let files: string[] = [];
    for await (let fileOrFolder of Deno.readDir(dirPath)) {
        if (fileOrFolder.isFile) {
            files.push(`${dirPath}/${fileOrFolder.name}`);
        }
    }
    return files;
}

async function writeJson(filePath: string, o: any) {
    await Deno.writeTextFile(filePath, JSON.stringify(o));
}