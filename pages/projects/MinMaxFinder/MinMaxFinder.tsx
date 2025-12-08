
import React from 'react';
import { controls, minmaxRoot, params } from './css/index.module.scss';
import Canvas from './js/Graph/Canvas';

import * as math from "mathjs";

// import Canvas from "./Graph/Canvas.js";
// import Graph from "./Graph/index.js";
// import ScaledGraphPoint from "./Graph/Point/ScaledGraphPoint.js";
// import { distance, shiftToPositive } from "./utils.js";

// console.log(math);

// // Ensure variables are defined before use

// // Fix function `getPointAt` to use defined variables
// function getPointAt({ x, y }) {
//     x = x * scaling + halfScaledDist;
//     y = -y * scaling + halfScaledDist;

//     return { x, y };
// }

// // Fix `plotFunction` to ensure variables are properly scoped
// function plotFunction(func, targetVariable = "x", color = "#f00", includeDerivative = false) {
//     const expr = math.parse(func),
//         compiledExpr = expr.compile(),
//         plots = [];

//     console.log(func);

//     // Plot function
//     for (let input = -maxDist, i = 0; input < maxDist; input += stepSize, i++) {
//         let x = input,
//             y = compiledExpr.evaluate({ [targetVariable]: x });

//         plots.push({ x, y });

//         if (plots[i - 1] && Math.floor(y) <= maxDist) {
//             const { x: lastX, y: lastY } = getPointAt(plots[i - 1]);

//             ({ x, y } = getPointAt({ x, y }));

//             canvas.fillLine(lastX, lastY, x, y, color, 3);
//         }
//     }

//     if (includeDerivative) {
//         const derivativePlots = plotFunction(math.derivative(expr.value, targetVariable).toString(), targetVariable, "blue", false);

//         return {
//             plots,
//             derivative: derivativePlots,
//         };
//     }

//     return plots;
// }

// // Fix `taylorExpansion` to ensure proper variable usage
// function taylorExpansion(func, derivativeCount = 10, a = 0, symbol = "x") {
//     const expr = math.parse(func);
//     let derivative;
//     const terms = [],
//         derivatives = [];

//     for (let k = 0; k++ < derivativeCount;) {
//         derivative = math.derivative(derivative || expr?.value || expr, symbol);
//         derivatives.push(derivative);
//         console.log(derivative.toString());

//         terms.push(new math.OperatorNode("*", "multiply", [
//             new math.OperatorNode("/", "divide", [
//                 new math.ConstantNode(derivative.compile().evaluate({ x: a })),
//                 new math.ConstantNode(math.factorial(k)),
//             ]),
//             new math.OperatorNode("^", "pow", [
//                 new math.OperatorNode("-", "subtract", [
//                     new math.SymbolNode("x"),
//                     new math.ConstantNode(a),
//                 ]),
//                 new math.ConstantNode(k),
//             ]),
//         ]));

//         console.log(math.simplify(terms[k - 1]).toString());
//     }

//     console.log(derivatives);

//     return new math.OperatorNode("+", "add", terms);
// }

// canvas.attach(".minMaxFinder-canvas-wrapper");

// // Draw X/Y graph divisions
// for (let x = -maxDist; x < maxDist; x += graphDivisionDist) {
//     if (x === 0) continue;
//     const { x: startX, y: startY } = getPointAt({ x, y: -maxDist }),
//         { x: endX, y: endY } = getPointAt({ x, y: maxDist });

//     canvas.fillLine(startX, startY, endX, endY, "#ccc");
// }

// for (let y = -maxDist; y < maxDist; y += graphDivisionDist) {
//     if (y === 0) continue;
//     const { x: startX, y: startY } = getPointAt({ x: -maxDist, y }),
//         { x: endX, y: endY } = getPointAt({ x: maxDist, y });

//     canvas.fillLine(startX, startY, endX, endY, "#ccc");
// }

// console.log(-maxDist * scaling, scaling);
// // Draw X/Y Axis
// canvas.fillLine(-maxDist * scaling, halfScaledDist, maxDist * scaling, halfScaledDist, "#000", 2);
// canvas.fillLine(halfScaledDist, -maxDist * scaling, halfScaledDist, maxDist * scaling, "#000", 2);
// console.log(-maxDist * scaling);

// {
//     const { x, y } = getPointAt({ x: 5, y: 5 });

//     canvas.fillCircle("#000", x, y, 5);
// }

// const { plots } = plotFunction("y = x^2", "x", "#f00", true);
// let [lastPlot] = plots,
//     min,
//     orig = "sin(x)",
//     taylor = taylorExpansion(orig, 10, 3, "x").toString();

// $("#original").text(`Original function: ${orig}`);
// $("#derivative").text(`Taylor Expansion: ${taylor}`);

// plotFunction(taylor, "x", "#ccc");
// plotFunction("sin(x)", "x", "#ee0");

// canvas.attach(".minMaxFinder-canvas-wrapper");

// for (const [i, { x, y }] of plots.slice(1).entries()) {
//     const { x: lastX, y: lastY } = lastPlot;

//     if (Math.abs(math.abs(y) - math.abs(lastY)) < xThreshold) {
//         min = { x, y };
//         break;
//     }

//     lastPlot = plots[i];
// }

// console.log(`x: ${min.x}, y: ${min.y}`);

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
        <div><code id="derivative"></code></div>
        <div><code id="original"></code></div>
    </div>
}

export default () => {

    return <div className={minmaxRoot}>
        <div id="minmax-app">
            <Controls />
        </div>
    </div>
}