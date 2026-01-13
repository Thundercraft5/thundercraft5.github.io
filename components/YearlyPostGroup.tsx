import { useMDXComponents } from "../pages/mdx-components";

const components = useMDXComponents({});
const H1 = components.h1 || 'h1'; // Get your custom H1 if it exists

export default function PostGroup({ children, year }: { children: React.ReactNode, year: string }) {
    return <div>
        <H1 id={year}>{year}</H1>
        {children}
    </div>;
}