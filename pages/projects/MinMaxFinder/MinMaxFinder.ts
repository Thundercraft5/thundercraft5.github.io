import dynamic from "next/dynamic";

export default dynamic(() => import("./MinMaxFinder.tsx").catch(console.error), { ssr: false });