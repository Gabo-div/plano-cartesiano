import { useEffect, useState, useRef, useContext } from "react";
import type { MouseEvent, WheelEvent } from "react";
import { MathFunctionContext } from "../context/mathFunctionContext";
import { PlainContext } from "../context/plainContext";

type RefPoint = {
	x: number;
	y: number;
};

type DrawCallback = (canvasImage: HTMLCanvasElement) => void;

export const usePlain = (drawCallback: DrawCallback) => {
	const plainContext = useContext(PlainContext);
	const mathFunctionContext = useContext(MathFunctionContext);

	const draw = () => {
		if (!plainContext || !plainContext.canvasImage) return;

		plainContext.print();
		drawCallback(plainContext.canvasImage);
	};

	useEffect(() => {
		draw();
	}, [
		plainContext?.refPoint,
		plainContext?.gridSize,
		mathFunctionContext?.functions,
		plainContext?.configs,
	]);

	return plainContext;
};
