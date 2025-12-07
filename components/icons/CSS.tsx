import { Icon, type IconProps } from "./Icon";

export function CssIcon(props: IconProps) {
    return <Icon {...props} alt="CSS Logo" src="/icons/CSS3_logo_and_wordmark.svg" />;
}

function Test<T extends "test" | "test3", C extends any[]>({ test, children }: { test: T, children: C }) {
    return <div className={test}>{test}</div>;
}

const k = <Test test="test"><div></div><div></div></Test>
