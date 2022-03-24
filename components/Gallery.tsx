import { React } from "../dep.ts";
import Header from "./Header.tsx";

export interface Pic {
    paths: string[];
}

export default function Gallery(props: string[]) {
    console.log("Rendering gallery");
    return (
        <div>
            <Header />
            {props.map((pic) => (
                <img key={pic} src={pic} className="gallery-pic" />
            ))}
        </div>
    );
};