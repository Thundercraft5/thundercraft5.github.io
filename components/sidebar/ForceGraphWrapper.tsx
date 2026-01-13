// components/ForceGraphWrapper.js
import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

const ForceGraphWrapper = ({ data }) => {
    const graphRef = useRef();

    useEffect(() => {
        // You can access internal d3 forces or other methods via the ref
        if (graphRef.current) {
            // graphRef.current.d3Force('charge').strength(-400);
        }
    }, []); // Run once on mount

    return (
        <ForceGraph2D
            ref={graphRef}
            graphData={data}
            nodeLabel="id"
        // Add other props for customization (e.g., nodeColor, linkColor)
        // Refer to the documentation for a full list of props
        />
    );
};

export default ForceGraphWrapper;