import { React, ReactDOMServer } from "./dep.ts";
import App from "./components/App.tsx";
import { serve } from "https://deno.land/std@0.130.0/http/server.ts";

/*
// Write the output HTML to disk
try {
    await Deno.writeTextFile("./build/index.html", stringDOM);
    console.log("Successfully rendered HTML to /build");
} catch (error) {
    console.log(error);
}
*/

const port = 8000;

const handler = async (request: Request): Promise<Response> => {
  let body = "Your user-agent is:\n\n";
  body += request.headers.get("user-agent") || "Unknown";

  return new Response(new TextEncoder().encode(await generateHTML()), { status: 200 });
};

console.log(`HTTP webserver running. Access it at: http://localhost:${port}/`);
await serve(handler, { port });

async function generateHTML(): Promise<string> {
    var startTime = performance.now();
    const innerHTML = ReactDOMServer.renderToStaticMarkup(<App />);
    const style = await Deno.readTextFile("./resources/styles/app.css");
    var endTime = performance.now();
    //console.log(`Static HTML content generated in ${endTime - startTime}ms.`);
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