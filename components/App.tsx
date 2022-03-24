import { React } from "../dep.ts";
import Header from "./Header.tsx";
import ListValue from "./ListItem.tsx";
import ListItem from "./ListItem.tsx";

const items = [
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
];

export default function App() {
    return (
        <div>
            <Header />
            <ul>
                {items.map((item) => (
                    <ListItem key={item.name} name={item.name} description={item.description} />
                ))}
            </ul>
        </div>
    );
};
