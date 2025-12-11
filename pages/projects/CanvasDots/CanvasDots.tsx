'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { AbstractTree, Tree } from './ts/DotTree';
import { distance } from './ts/utils';
import styles from './scss/index.module.scss';
import type { TreeWorker } from './ts/Workers';

export interface CanvasDotsOptions {
    SAMPLE_SIZE: number;
    MAX_NODES: number;
    MAX_DIST: number;
    MIN_DIST: number;
    MAX_CHILDREN: number;
    MAX_DEPTH: number;
    SHOW_LINES: boolean;
    SHOW_COLORS: boolean;
}

const DEFAULT_OPTIONS: CanvasDotsOptions = {
    SAMPLE_SIZE: 10,
    MAX_NODES: 300,
    MAX_DIST: 200,
    MIN_DIST: 10,
    MAX_CHILDREN: 10,
    MAX_DEPTH: 10,
    SHOW_LINES: true,
    SHOW_COLORS: true,
};

const CONSTANTS = {
    MARGIN: 10,
    POINT_SIZE: 5,
};

function RangeInput({ label, min, max, id, className, onChange, disabled = false, value = 0 }: { label: string; min: number; max: number; id: string; className?: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled?: boolean, value?: number }) {
    return <div className={`${className} ${styles.flexInput}`}>
        <input id={id} type="range" min={min} max={max} value={value} onChange={onChange} disabled={disabled} />
        <label htmlFor={id}>{label}:&nbsp;</label><span className={styles['value']}>{value}</span>
    </div>
}

function CheckboxInput({ label, id, className, onChange, disabled = false, checked = false }: { label: string; id: string; className?: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, disabled?: boolean, checked?: boolean }) {
    return <div className={`${className} ${styles.flexInput}`}>
        <input id={id} type="checkbox" checked={checked} onChange={onChange} disabled={disabled} />
        <label htmlFor={id}>{label}:&nbsp;</label><span className={styles['value']}>{checked.toString()}</span>
    </div>
}

export default function CanvasDots() {
    const containerRef = useRef<HTMLDivElement>(null);
    const treeWorkerRef = useRef<TreeWorker | null>(null);
    const [isRunning, setIsRunning] = useState(false);
    const [options, setOptions] = useState<CanvasDotsOptions>(DEFAULT_OPTIONS);
    const { promise: workerReady, resolve, reject } = Promise.withResolvers<void>();

    // Lazy-load TreeWorker on client-side only
    useEffect(() => {
        const initWorker = async () => {
            try {
                const { TreeWorker } = await import('./ts/Workers');
                treeWorkerRef.current = new TreeWorker(new Worker(new URL('./ts/Workers/TreeWorker/TreeWorker.worker.ts', import.meta.url)));
                resolve();
            } catch (error) {
                console.error('Failed to load TreeWorker:', error);
                reject(error)
            }
        };
        initWorker();
    }, []);

    const run = useCallback(
        async (runOptions: CanvasDotsOptions) => {
            const treeWorker = treeWorkerRef.current;

            if (!containerRef.current || !treeWorker) return;

            setIsRunning(true);

            try {
                containerRef.current.innerHTML = '';

                const canvasHeight = 800;
                const canvasWidth = containerRef.current.clientWidth;

                const tree = await treeWorker
                    .send('process', {
                        canvasHeight,
                        canvasWidth,
                        SAMPLE_SIZE: runOptions.SAMPLE_SIZE,
                        MAX_NODES: runOptions.MAX_NODES,
                        MAX_DIST: runOptions.MAX_DIST,
                        MIN_DIST: runOptions.MIN_DIST,
                        MAX_CHILDREN: runOptions.MAX_CHILDREN,
                        MAX_DEPTH: runOptions.MAX_DEPTH,
                        CONSTANTS,
                    })
                    .then(([t]) => {
                        return Tree.fromAbstract(
                            AbstractTree.deserialize(t),
                            {
                                height: canvasHeight,
                                width: canvasWidth,
                                selector: containerRef.current!,
                                attrs: {
                                    id: 'canvasDots-canvas',
                                },
                            }
                        );
                    });

                tree.setCenter();

                const { canvas } = tree;

                tree.setCenter();
                tree.root.draw('#000000', 10);

                tree.traverse((node) => {
                    if (!node.parent) return;
                    const { parent } = node;

                    if (runOptions.SHOW_LINES) {
                        canvas.fillLine(parent.x, parent.y, node.x, node.y);
                    }

                    if (runOptions.SHOW_COLORS) {
                        const color = `#${(parent.depth * 1000)
                            .toString(16)
                            .split('.')[0]
                            .padEnd(6, '0')}`;

                        node.draw(color);
                    } else {
                        node.draw();
                    }

                    parent.redraw();
                });

                // Expose globals for debugging
                Object.assign(window, {
                    canvas,
                    tree,
                    distance,
                    run: run,
                    treeWorker,
                });
            } finally {
                setIsRunning(false);
            }
        },
        [treeWorkerRef]
    );

    // Initial render - wait for worker to be ready
    useEffect(() => {
        if (treeWorkerRef.current) {
            run(DEFAULT_OPTIONS);
        }
    }, [run]);

    const createOptionUpdater = (key: keyof CanvasDotsOptions) => (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : parseFloat(e.target.value);
        setOptions((prev) => ({
            ...prev,
            [key]: value,
        }));
    };

    const handleRun = () => {
        run(options);
    };

    return (
        <div>
            <div className={styles['canvasDots-controls']}>
                <RangeInput
                    label="Sample Size"
                    min={1}
                    max={100}
                    id="sampleSize"
                    onChange={createOptionUpdater('SAMPLE_SIZE')}
                    disabled={isRunning}
                    value={options.SAMPLE_SIZE}
                />
                <RangeInput
                    label="Max Nodes"
                    min={10}
                    max={1000}
                    id="maxNodes"
                    onChange={createOptionUpdater('MAX_NODES')}
                    disabled={isRunning}
                    value={options.MAX_NODES}
                />
                <RangeInput
                    label="Max Distance"
                    min={10}
                    max={500}
                    id="maxDist"
                    onChange={createOptionUpdater('MAX_DIST')}
                    disabled={isRunning}
                    value={options.MAX_DIST}
                />
                <RangeInput
                    label="Min Distance"
                    min={1}
                    max={100}
                    id="minDist"
                    onChange={createOptionUpdater('MIN_DIST')}
                    disabled={isRunning}
                    value={options.MIN_DIST}
                />
                <RangeInput
                    label="Max Children"
                    min={1}
                    max={50}
                    id="maxChildren"
                    onChange={createOptionUpdater('MAX_CHILDREN')}
                    disabled={isRunning}
                    value={options.MAX_CHILDREN}
                />
                <RangeInput
                    label="Max Depth"
                    min={1}
                    max={20}
                    id="maxDepth"
                    onChange={createOptionUpdater('MAX_DEPTH')}
                    disabled={isRunning}
                    value={options.MAX_DEPTH}
                />
                <CheckboxInput
                    label="Show Lines"
                    id="showLines"
                    onChange={createOptionUpdater('SHOW_LINES')}
                    disabled={isRunning}
                    checked={options.SHOW_LINES}
                />
                <CheckboxInput
                    label="Show Colors"
                    id="showColors"
                    onChange={createOptionUpdater('SHOW_COLORS')}
                    disabled={isRunning}
                    checked={options.SHOW_COLORS}
                />
            </div>

            <button
                className={styles['canvasDots-reset']}
                onClick={handleRun}
                disabled={isRunning}
            >
                <span className={styles['text']}>{isRunning ? 'Running...' : 'Re-run'}</span>
            </button>
            <div className={styles['canvasDots-wrapper']} ref={containerRef} />
        </div>
    );
}
