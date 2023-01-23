import type { NextComponentType } from "next";

import React, { useRef, useEffect, useContext } from "react";
import { PlainContext } from "../context/plainContext";

import { usePlain } from "../hooks/usePlain";

const Plain: NextComponentType = () => {
	const mainCanvas = useRef<HTMLCanvasElement | null>(null);
	const mainContext = useRef<CanvasRenderingContext2D | null>(null);

	const draw = (imageCanvas: HTMLCanvasElement) => {
		if (!mainContext.current) return;
		mainContext.current.drawImage(imageCanvas, 0, 0);
	};

	const plainContext = usePlain(draw);

	const resizeCanvas = () => {
		if (!mainCanvas.current || !plainContext) return;

		mainCanvas.current.width = document.body.clientWidth;
		mainCanvas.current.height = document.body.clientHeight;

		plainContext.setCanvasSize(
			mainCanvas.current.width,
			mainCanvas.current.height
		);
	};

	useEffect(() => {
		if (!mainCanvas.current) return;
		mainContext.current = mainCanvas.current.getContext("2d");

		resizeCanvas();
		window.addEventListener("resize", resizeCanvas);
	}, [plainContext?.canvasImage]);

	return (
		<div className="canvas-container">
			<canvas
				onMouseDown={plainContext?.handleMouseDown}
				onMouseUp={plainContext?.handleMouseUp}
				onMouseLeave={plainContext?.handleMouseUp}
				onMouseMove={plainContext?.handleMouseMove}
				onWheel={plainContext?.handleWheel}
				ref={mainCanvas}
				id="main-canvas"
			></canvas>
		</div>
	);
};

export default Plain;
