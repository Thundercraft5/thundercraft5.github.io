import React, { useEffect } from "react";
import Canvas from "./Graph/Canvas";

export type CanvasProps = { height: number; width: number, manager: Canvas }

export default class CanvasComponent extends React.Component<CanvasProps, {}> {
    #canvasRef: React.RefObject<HTMLCanvasElement | null>;
    #canvas: Canvas;

    get manager() {
        return this.#canvas;
    }

    constructor(props: CanvasProps) {
        super(props);
        this.#canvasRef = React.createRef();
        this.#canvas = props.manager;
    }

    componentDidMount() {

    }

    render() {
        return (
            <div ref={ref => ref ? ref.appendChild(this.manager.element) : undefined} ></div>
        )
    }
}