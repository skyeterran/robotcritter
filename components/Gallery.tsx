import { React } from "../dep.ts";

const pics = [
    { url: "assets/gallery/[sleepygills]_Tyler_FN1hBtAVgAEkQTt.jpg" },
    { url: "assets/gallery/20220316_161908460_iOS.png" }
];

export default function Gallery() {
    return (
        <div>
            {pics.map((pic) => (
                <img src={pic.url} />
            ))}
        </div>
    );
};
