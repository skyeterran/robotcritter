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