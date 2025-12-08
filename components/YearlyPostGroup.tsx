export default function PostGroup({ children, year }: { children: React.ReactNode, year: string }) {
    return <div>
        <h1>{year}</h1>
        {children}
    </div>;
}