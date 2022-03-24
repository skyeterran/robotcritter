import { React, ReactDOMServer, listDir } from "./dep.ts";
import { serve } from "https://deno.land/std@0.130.0/http/server.ts";
import { readableStreamFromReader } from "https://deno.land/std@0.130.0/streams/mod.ts"
import { flushCache, writeCacheFile, makeHash } from "./cache.ts";

import App from "./components/App.tsx";
import Gallery from "./components/Gallery.tsx";

// Before we do anything else, flush the damn cache
await flushCache();

const port = 8000;
console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);

const routes = {
    "/": App,
    "/gallery": Gallery
};

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
        // We need to get the apropos props
        let props: string[] = [];

        // Generate HTML via the current route's corresponding React element
        let startTime = performance.now();
        switch (filepath) {
            case "/": {
                break;
            }
            case "/gallery": {
                props = await listDir("assets/gallery/");
                break;
            }
            default:
                // If that's not a valid route, return a 404 error
                return new Response("404 Not Found", { status: 404 });
        }

        // Now that we have our props initialized, let's get the HTML
        let html = "";
        
        // SeedHash is used to identify which cached data (if any) corresponds with the desired page state
        const seedHash = makeHash({ url: filepath, props: props });
        
        // Check if cached HTML exists for this page
        let file;
        try {
            // Load the cache file's payload
            const cacheData = await Deno.readFile(`./cache/${seedHash}.json`);
            console.log(`Found cache file for ${seedHash}! Loading...`);
            html = JSON.parse(new TextDecoder('utf-8').decode(cacheData));
        } catch {
            // If no cached HTML exists, generate it now and save it
            console.log(`No corresponding cache file exists for ${seedHash}. Generating...`)
            html = await generateHTML(routes[filepath](props));
            await writeCacheFile(seedHash, html);
        }

        // Return the generated HTML
        let endTime = performance.now();
        console.log(`Delivered content in ${endTime - startTime}ms.`);
        return new Response(new TextEncoder().encode(html), { status: 200 });
    }
});

async function generateHTML(element: JSX.Element): Promise<string> {
    let startTime = performance.now();
    const innerHTML = ReactDOMServer.renderToStaticMarkup(element);
    const style = await Deno.readTextFile("./resources/styles/app.css");
    let endTime = performance.now();
    console.log(`Static HTML content generated in ${Math.round((endTime - startTime) * 100) / 100}ms.`);
    const buildMsg = `This page was generated in ${Math.round((endTime - startTime) * 100) / 100} milliseconds.`;

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