import { React } from "../dep.ts";
import Header from "./Header.tsx";

export interface Pic {
    fullsize: string;
    thumbnail: string;
}

export default function Gallery(props: Pic[]) {
    console.log("Rendering gallery");
    return (
        <div>
            <Header />
            <div className="gallery-grid">
                {props.map((pic) => (
                    <a href={pic.fullsize}><img key={pic.fullsize} src={pic.thumbnail} className="gallery-pic" /></a>
                ))}
            </div>
        </div>
    );
};