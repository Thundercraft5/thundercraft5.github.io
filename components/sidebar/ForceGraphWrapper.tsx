"use client";
import styles from './ForceGraphWrapper.module.scss'
// components/ForceGraphWrapper.js
import React, { useRef, useEffect, useReducer, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { graphData } from '../../src/data';
import type { GraphData, ForceGraphMethods, LinkObject, NodeObject, NodeType } from 'react-force-graph-2d';
import useWindowSize from '../hooks/useWindowSize';
import { useRouter } from 'next/router';
import ForceGraph2D from 'react-force-graph-2d';
import * as d3 from 'd3-force';

const gData = structuredClone(graphData);

gData.nodes.forEach((node: any) => {
    if (node.external && node.icon) {
        const img = new Image();
        img.src = node.icon;
        node.img = img;
    }
})

export default ({ ...props }) => {
    const { width, height } = useWindowSize();
    const fgRef = React.useRef<ForceGraphMethods>(null);
    const router = useRouter();
    const currentPath = router.pathname;
    const [hasInitializedForces, setHasInitializedForces] = React.useState(false);
    const [tick, incrementTick] = useReducer(v => v + 1, 0);

    // ✅ SOLUTION: The Callback Ref
    // This function runs automatically once, the moment the graph is mounted.
    // We do not need state, effects, or ticks to wait for it.
    const handleRef = useCallback((node: ForceGraphMethods) => {
        // 1. Check if node exists and has the method we need
        if (node && typeof node.d3Force === 'function') {

            // 2. Apply your forces immediately
            node.d3Force('link')
                .distance(30)
                .strength(1);
            // node.d3Force("charge").strength(0.5);

            // Optional: Re-heat the simulation so it adapts to new forces instantly
            // node.d3ReheatSimulation(); 
            node.d3Force('charge-orphans', d3.forceRadial(
                150,               // Radius: Pull orphans to ~150px from center
                width / 10,        // X Center (Adjust based on your container width)
                width / 10         // Y Center
            ).strength((d) => {
                // Determine if node is an orphan (has no neighbors)
                const isOrphan = !gData.links.some(l =>
                    l.source.id === d.id || l.target.id === d.id
                );
                // Apply strong force (0.8) to orphans, ignore (0) others
                return isOrphan ? 0.8 : 0;
            }));

            // 4. Collision Force
            // Essential to stop the orphans from collapsing into a single dot
            node.d3Force('collide', d3.forceCollide(
                (d) => 10 // Collision radius (slightly larger than visual node size)
            ).strength(0.7));
        }
    }, []);
    return (
        <ForceGraph2D
            graphData={gData satisfies GraphData}
            ref={handleRef}
            width={width / 5}
            height={width / 5}
            // onEngineTick={() => { !hasInitializedForces && incrementTick() }}

            backgroundColor="#1a1a1a"

            nodeRelSize={4}

            // Only show tooltip on hover (Standard behavior)
            nodeLabel={() => ""}

            // Use a canvas object for the "Obsidian" dot style
            nodeCanvasObject={(node: any, ctx, globalScale) => {
                const label = node.title;
                const isCurrent = node.id === currentPath;
                const fontSize = 12 / globalScale;

                if (node.external) {
                    try {
                        const size = 16;
                        ctx.drawImage(
                            node.img,
                            node.x - size / 2,
                            node.y - size / 2,
                            size,
                            size
                        );
                    } catch (err) {
                        console.warn(err);
                        // Faillback to default dot if image fails
                        ctx.beginPath();
                        ctx.arc(node.x, node.y, isCurrent ? 8 : 3, 0, 2 * Math.PI, false);
                        ctx.fillStyle = isCurrent ? '#9dd7e3' : '#4a90e2';
                    }
                } else {
                    // Draw the Node Dot
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, isCurrent ? 8 : 3, 0, 2 * Math.PI, false);
                    ctx.fillStyle = isCurrent ? '#ff4e4e' : '#4a90e2';
                }
                ctx.fill();

                // OPTIONAL: Only draw text labels if zoomed in enough (Prevents the "Black Smear")
                if (globalScale > 2) {
                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                    ctx.fillText(node.title || node.name, node.x, node.y + (30 / globalScale));
                }
            }}

            // Link Styling
            linkColor={() => 'rgba(255, 255, 255, 0.1)'}
            linkWidth={1}

            // Interaction
            nodePointerAreaPaint={(node: any, color, ctx, globalScale) => {
                ctx.fillStyle = color;
                const fontSize = 12 / globalScale;

                // Draw a hit area for the DOT
                ctx.beginPath();
                ctx.arc(node.x, node.y, 10 / globalScale, 0, 2 * Math.PI, false);
                ctx.fill();

                // Draw a hit area for the LABEL (a rectangle where the text is)
                // This ensures that clicking the text also triggers the link
                if (globalScale > 2.5) {
                    ctx.font = `${fontSize}px Sans-Serif`;
                    const textWidth = ctx.measureText(node.title).width;
                    const textHeight = fontSize; // Approximate height

                    // Draw a rectangle around the text area
                    ctx.fillRect(
                        node.x - textWidth / 2,
                        node.y + (7 / globalScale), // Match your text offset
                        textWidth,
                        textHeight
                    );
                }
            }}

            // 2. DISABLE NATIVE TOOLTIPS (Optional)
            // If you are drawing labels on the canvas, the native "nodeLabel" 
            // tooltip can sometimes pop up and block the mouse cursor.

            // 3. ENFORCE CURSOR
            // Makes it obvious what is clickable
            onNodeHover={(node) => {
                document.body.style.cursor = node ? 'pointer' : 'default';
            }}

            onNodeClick={(node: any) => {
                router.push(node.id);
            }}

        />
    );
};


