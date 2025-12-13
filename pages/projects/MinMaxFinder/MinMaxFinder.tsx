"use client";

import React from 'react';
import { controls, minmaxRoot, params } from './scss/index.module.scss';
import Canvas from './ts/Graph/Canvas';

import * as math from "mathjs";
import type { PointLike } from '../CanvasDots/types';
import { distance, shiftToPositive } from "./ts/utils.ts";
import CanvasComponent from './ts/CanvasComponent.tsx';


// Configuration constants
const maxDist = 100;
const divisions = 100;
const stepSize = 0.25;
const graphDivisionDist = maxDist / divisions;
const xThreshold = 0.1;

// Get canvas size from DOM
const canvasElement = document.querySelector(".minMaxFinder-canvas-wrapper") as HTMLElement | null;
const canvasSize: number = canvasElement ? canvasElement.clientWidth : 800;

const canvas = new Canvas({
    width: canvasSize,
    height: canvasSize,
});

const scaling: number = canvasSize / maxDist;
const scaledDist: number = scaling * maxDist;
const halfScaledDist: number = scaledDist / 2;

console.log(scaledDist);

interface PlotPoint {
    x: number;
    y: number;
}

// Transform world coordinates to canvas coordinates
function getPointAt({ x, y }: PlotPoint): PlotPoint {
    x = x * scaling + halfScaledDist;
    y = -y * scaling + halfScaledDist;
    return { x, y };
}

interface PlotResult {
    plots: PlotPoint[];
    derivative?: PlotPoint[];
}

// Plot a mathematical function on the canvas
function plotFunction(
    func: string,
    targetVariable: string = "x",
    color: string = "#f00",
    includeDerivative: boolean = false,
): PlotPoint[] | PlotResult {
    const expr = math.parse(func);
    const compiledExpr = expr.compile();
    const plots: PlotPoint[] = [];

    console.log(func);

    // Plot function points
    for (let input = -maxDist, i = 0; input < maxDist; input += stepSize, i++) {
        let x: number = input;
        let y: number = compiledExpr.evaluate({ [targetVariable]: x });

        plots.push({ x, y });

        if (plots[i - 1] && Math.floor(y) <= maxDist) {
            const { x: lastX, y: lastY } = getPointAt(plots[i - 1]);
            const transformed = getPointAt({ x, y });
            x = transformed.x;
            y = transformed.y;
            canvas.fillLine(lastX, lastY, x, y, color, 3);
        }
    }

    if (includeDerivative) {
        console.log(expr.toString())
        const derivativePlots = plotFunction(
            (math.derivative(expr as any, targetVariable) as any).toString(),
            targetVariable,
            "blue",
            false,
        ) as PlotPoint[];

        console.log(derivativePlots);

        return {
            plots,
            derivative: derivativePlots,
        };
    }

    return plots;
}

// Compute Taylor expansion of a function
function taylorExpansion(
    func: string,
    derivativeCount: number = 10,
    a: number = 0,
    symbol: string = "x",
): any {
    const expr = math.parse(func);
    let derivative: any;
    const terms: any[] = [];
    const derivatives: any[] = [];

    for (let k = 0; k++ < derivativeCount;) {
        derivative = math.derivative(derivative || (expr as any).value || expr, symbol);
        derivatives.push(derivative);
        console.log(derivative.toString());

        terms.push(
            new (math as any).OperatorNode("*", "multiply", [
                new (math as any).OperatorNode("/", "divide", [
                    new (math as any).ConstantNode(derivative.compile().evaluate({ x: a })),
                    new (math as any).ConstantNode(math.factorial(k)),
                ]),
                new (math as any).OperatorNode("^", "pow", [
                    new (math as any).OperatorNode("-", "subtract", [
                        new (math as any).SymbolNode("x"),
                        new (math as any).ConstantNode(a),
                    ]),
                    new (math as any).ConstantNode(k),
                ]),
            ]),
        );

        console.log(math.simplify(terms[k - 1]).toString());
    }

    console.log(derivatives);

    return new (math as any).OperatorNode("+", "add", terms);
}

// Attach canvas to DOM
canvas.attach(".minMaxFinder-canvas-wrapper");

// Draw X/Y grid divisions
for (let x = -maxDist; x < maxDist; x += graphDivisionDist) {
    if (x === 0) continue;
    const { x: startX, y: startY } = getPointAt({ x, y: -maxDist });
    const { x: endX, y: endY } = getPointAt({ x, y: maxDist });
    canvas.fillLine(startX, startY, endX, endY, "#ccc");
}

for (let y = -maxDist; y < maxDist; y += graphDivisionDist) {
    if (y === 0) continue;
    const { x: startX, y: startY } = getPointAt({ x: -maxDist, y });
    const { x: endX, y: endY } = getPointAt({ x: maxDist, y });
    canvas.fillLine(startX, startY, endX, endY, "#ccc");
}

console.log(-maxDist * scaling, scaling);
// Draw X/Y axes
canvas.fillLine(-maxDist * scaling, halfScaledDist, maxDist * scaling, halfScaledDist, "#000", 2);
canvas.fillLine(halfScaledDist, -maxDist * scaling, halfScaledDist, maxDist * scaling, "#000", 2);
console.log(-maxDist * scaling);

// Plot test point
{
    const { x, y } = getPointAt({ x: 5, y: 5 });
    canvas.fillCircle("#000", x, y, 5);
}

// Plot sample functions
const result = plotFunction("x^2", "x", "#f00", true) as PlotResult;
const { plots } = result;
let lastPlot: PlotPoint = plots[0];
let min: PlotPoint | undefined;
const orig: string = "sin(x)";
const taylor: string = taylorExpansion(orig, 10, 3, "x").toString();


plotFunction(taylor, "x", "#ccc");
plotFunction("sin(x)", "x", "#ee0");

// Find minimum point
for (const [i, { x, y }] of plots.slice(1).entries()) {
    const { x: lastX, y: lastY } = lastPlot;

    if (Math.abs((math as any).abs(y) - (math as any).abs(lastY)) < xThreshold) {
        min = { x, y };
        break;
    }

    lastPlot = plots[i];
}

if (min) {
    console.log(`x: ${min.x}, y: ${min.y}`);
}

console.log(min)


export function RangeInput({ label, min, max, id, className, onChange, defaultValue = 0 }: { label: string; min: number; max: number; id: string; className: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, defaultValue?: number }) {
    const [value, setValue] = React.useState<number>(defaultValue);
    return <div className={className}>
        <input id={id} type="range" min={min} max={max} value={value} onChange={e => { onChange(e); setValue(e.target.valueAsNumber) }} />
        <label>{label}:&nbsp;</label><span className="value">{value}</span>
    </div>
}

function CheckboxInput({ label, id, className, onChange, defaultChecked = false }: { label: string; id: string; className: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, defaultChecked?: boolean }) {
    const [checked, setChecked] = React.useState<boolean>(defaultChecked);
    return <div className={className}>
        <input id={id} type="checkbox" checked={checked} onChange={e => { onChange(e); setChecked(e.target.checked) }} />
        <label htmlFor={id}>{label}:&nbsp;</label><span className="value">{checked.toString()}</span>
    </div>
}

export type State = {
    sampleSize: number;
    maxNodes: number;
    maxDist: number;
    minDist: number;
    maxChildren: number;
    maxDepth: number;
    showLines: boolean;
    showColors: boolean;
}

export function Controls({ onChange }: { onChange?: (state: State) => void }) {
    const [state, setState] = React.useState<State>({
        sampleSize: 10,
        maxNodes: 300,
        maxDist: 200,
        minDist: 10,
        maxChildren: 10,
        maxDepth: 10,
        showLines: true,
        showColors: true,
    });

    const createStateUpdater = (stateKey: keyof State) => (value: any) => {
        const newState = { ...state, [stateKey]: value };
        setState(newState);
        onChange?.(newState);
    }

    return <div className={controls}>
        <div className="buttons">
            <button id="reset">Re-run</button>
            <div className="loading-gray hidden" style={{ width: 20, height: 20 }}></div>
        </div>
        <div className={params}>
            <RangeInput className="canvasDots-sampleSize" label="Sample Size" min={1} max={100} id="sampleSize" onChange={createStateUpdater("sampleSize")} />
            <RangeInput className="canvasDots-maxNodes" label="Max Nodes" min={1} max={10000} id="maxNodes" onChange={createStateUpdater("maxNodes")} />
            <RangeInput className="canvasDots-maxDist" label="Max node distance" min={1} max={750} id="maxDist" onChange={createStateUpdater("maxDist")} />
            <RangeInput className="canvasDots-minDist" label="Min node distance" min={1} max={100} id="minDist" onChange={createStateUpdater("minDist")} />
            <RangeInput className="canvasDots-maxChildren" label="Max children per node" min={1} max={100} id="maxChildren" onChange={createStateUpdater("maxChildren")} />
            <RangeInput className="canvasDots-maxDepth" label="Max node depth" min={1} max={100} id="maxDepth" onChange={createStateUpdater("maxDepth")} />
            <CheckboxInput defaultChecked className="canvasDots-showLines" label="Show node lines" id="showLines" onChange={createStateUpdater("showLines")} />
            <CheckboxInput defaultChecked className="canvasDots-showColors" label="Show node color" id="showColors" onChange={createStateUpdater("showColors")} />
        </div>
        <div><code id="derivative">Taylor Expansion: {taylor}</code></div>
        <div><code id="original">Original Expression: {orig}</code></div>
    </div>
}

export default function MinMaxFinder() {
    return <div className={minmaxRoot}>
        <div id="minmax-app">
            <Controls />
            <CanvasComponent height={canvasSize} width={canvasSize} manager={canvas} />
        </div>
    </div>
}