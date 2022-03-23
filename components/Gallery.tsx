import { React } from "../dep.ts";

export interface Pic {
    paths: string[];
}

export default function Gallery(props: Pic) {
    console.log("Rendering gallery");
    return (
        <div>
            {props.paths.map((pic) => (
                <img key={pic} src={pic} className="gallery-pic" />
            ))}
        </div>
    );
};

async function listDir(dirPath: string): Promise<string[]> {
    let files: string[] = [];
    for await (let fileOrFolder of Deno.readDir(dirPath)) {
        if (fileOrFolder.isFile) {
            files.push(`${dirPath}/${fileOrFolder.name}`);
        }
    }
    console.log(files);
    return files;
}