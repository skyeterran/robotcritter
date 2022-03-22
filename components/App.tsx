import { React } from "../dep.ts";
import ListValue from "./ListItem.tsx";
import ListItem from "./ListItem.tsx";

let items = [
    {
        name: "Goblin",
        description: "A strange little creature"
    },
    {
        name: "Dragon",
        description: "Terachad fr"
    },
    {
        name: "Kobold",
        description: "Simps HARD for dragons"
    },
]

export default function App() {
    return (
        <div>
            <h1>Skye's Cool Website 🥴💦</h1>
            <h2>No JavaScript, no cookies, just vibes.</h2>
            <ul>
                {items.map((item) => (
                    <ListItem name={item.name} description={item.description} />
                ))}
            </ul>
        </div>
    );
};
