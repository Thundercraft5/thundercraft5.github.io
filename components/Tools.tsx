import { plainlist } from "./Links.module.scss";
import CopyPage from "./tools/CopyPage";

export default function Tools() {
    return <ul className={plainlist}>
        <li><CopyPage /></li>
    </ul>
}