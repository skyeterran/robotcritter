import { React } from "../dep.ts";
import Header from "./Header.tsx";

export interface Pic {
    fullsize: string;
    thumbnail: string;
}

export default function Gallery(props: Pic[]) {
    return (
        <div>
            <Header />
            <div className="gallery-grid">
                {props.map((pic) => (
                    <a key={pic.fullsize} href={pic.fullsize}><img src={pic.thumbnail} className="gallery-pic" /></a>
                ))}
            </div>
        </div>
    );
};