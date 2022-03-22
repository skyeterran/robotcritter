import { React } from "../dep.ts";
import ListItem from "./ListItem.tsx";

export default function App() {
    return (
        <div>
            <h1>Skye's Cool Website</h1>
            <h2>No JavaScript, no cookies, just vibes.</h2>
            <ul>
                <ListItem name="Goblin" description="A strange little creature" />
                <ListItem name="Dragon" description="TeraChad" />
                <ListItem name="Kobold" description="Simps hard for dragons" />
            </ul>
        </div>
    );
};