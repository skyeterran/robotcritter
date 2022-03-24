// @deno-types="https://denopkg.com/soremwar/deno_types/react/v16.13.1/react.d.ts"
import React from "https://jspm.dev/react@17.0.2";
// @deno-types="https://denopkg.com/soremwar/deno_types/react-dom/v16.13.1/server.d.ts"
import ReactDOMServer from "https://jspm.dev/react-dom@17.0.2/server";
// @deno-types="https://denopkg.com/soremwar/deno_types/react-dom/v16.13.1/react-dom.d.ts"
import ReactDOM from "https://jspm.dev/react-dom@17.0.2";

async function listDir(dirPath: string): Promise<string[]> {
    let files: string[] = [];
    for await (let fileOrFolder of Deno.readDir(dirPath)) {
        if (fileOrFolder.isFile) {
            files.push(`${dirPath}/${fileOrFolder.name}`);
        }
    }
    return files;
}

export { React, ReactDOM, ReactDOMServer, listDir };