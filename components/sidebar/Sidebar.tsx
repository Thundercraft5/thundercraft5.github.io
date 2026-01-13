import styles from './Sidebar.module.scss'
// components/ForceGraphWrapper.js
import React, { useRef, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { graphData } from '../../src/data';
import type { GraphData } from 'react-force-graph-2d';
import useWindowSize from '../hooks/useWindowSize';
import * as d3 from 'd3-force';
import { useRouter } from 'next/router';

// const SizeMe = dynamic(() => import("react-sizeme").then(mod => mod.SizeMe), { ssr: false });
const ForceGraph2D = dynamic(() => import("react-force-graph-2d"), { ssr: false });

const ForceGraphWrapper = ({ data, ...props }) => {
    const graphRef = useRef();

    useEffect(() => {
        // You can access internal d3 forces or other methods via the ref
        if (graphRef.current) {


        }
    }, []); // Run once on mount

    return (
        <ForceGraph2D
            ref={graphRef}
            graphData={structuredClone(data)}
            nodeLabel="name"

            {...props}
        // Add other props for customization (e.g., nodeColor, linkColor)
        // Refer to the documentation for a full list of props
        />
    );
};




export default function Sidebar() {
    const { width, height } = useWindowSize();
    const fgRef = React.useRef<typeof ForceGraph2D>(null);
    const router = useRouter();
    const currentPath = router.pathname;

    useEffect(() => {
        if (!fgRef.current || !fgRef.current.d3Simulation) return;
        const force = fgRef.current.d3Simulation();
        // 1. Pull every node toward the horizontal center
        // 1. Repulsion (Charge)
        force.force('charge', d3.forceManyBody().strength(-40));

        // 2. Gravity (Pulls orphans to center)
        force.force('x', d3.forceX(0).strength(0.08));
        force.force('y', d3.forceY(0).strength(0.08));

        // 3. Link Distance
        force.force('link', d3.forceLink(graphData.links).distance(30));
    }, [fgRef])

    return <aside className={styles.sidebar}>
        <h4 style={{ textAlign: "center" }}>Link Graph</h4>
        <div className={styles.forceGraphContainer}>
            <ForceGraphWrapper data={graphData satisfies GraphData}
                width={width / 5}
                ref={fgRef}
                height={width / 5}

                backgroundColor="#1a1a1a"
                style={{
                    borderRadius: "5px"
                }}
                nodeRelSize={4}

                // Only show tooltip on hover (Standard behavior)
                nodeLabel="title"

                // Use a canvas object for the "Obsidian" dot style
                nodeCanvasObject={(node: any, ctx, globalScale) => {
                    const label = node.title;
                    const isCurrent = node.id === currentPath;
                    const fontSize = 12 / globalScale;

                    // Draw the Node Dot
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, isCurrent ? 5 : 3, 0, 2 * Math.PI, false);
                    ctx.fillStyle = isCurrent ? '#ff4e4e' : '#4a90e2';
                    ctx.fill();

                    // OPTIONAL: Only draw text labels if zoomed in enough (Prevents the "Black Smear")
                    if (globalScale > 2.5) {
                        ctx.font = `${fontSize}px Sans-Serif`;
                        ctx.textAlign = 'center';
                        ctx.textBaseline = 'middle';
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                        ctx.fillText(node.title || node.name, node.x, node.y + (7 / globalScale));
                    }
                }}

                // Link Styling
                linkColor={() => 'rgba(255, 255, 255, 0.1)'}
                linkWidth={1}

                // Interaction
                onNodeClick={(node: any) => {
                    console.warn(node.id)
                    router.push(node.id);
                }}
            />
        </div>
    </aside >;
}