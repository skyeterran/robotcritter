import { React } from "../dep.ts";

interface ListValue {
    name: string;
    description: string;
}

export default function ListItem(props: ListValue) {
    return (
        <div>
            <h2>{props.name}</h2>
            <p>{props.description}</p>
        </div>
    );
};