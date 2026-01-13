import styles from './Sidebar.module.scss'
// components/ForceGraphWrapper.js
import React, { useRef, useEffect, useReducer } from 'react';
import dynamic from 'next/dynamic';
import { graphData } from '../../src/data';
import type { GraphData } from 'react-force-graph-2d';
import useWindowSize from '../hooks/useWindowSize';
import { useRouter } from 'next/router';

const ForceGraphWrapper = dynamic(() => import('../sidebar/ForceGraphWrapper'), { ssr: false });

export default function Sidebar() {

    // const onRender = React.useCallback((node) => {
    //     if (node && typeof node.d3Force === 'function') {
    //         fgRef.current = node;
    //         // You could even set your forces right here!
    //     }
    // }, []);

    return <aside className={styles.sidebar}>
        <h4 style={{ textAlign: "center" }}>Link Graph</h4>
        <div className={styles.forceGraphContainer}>
            <ForceGraphWrapper />
        </div>
    </aside >;
}   