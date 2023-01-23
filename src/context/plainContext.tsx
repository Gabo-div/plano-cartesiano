import { useEffect, useState, useRef, useContext, createContext } from "react";
import type {
	MouseEvent,
	WheelEvent,
	FunctionComponent,
	ReactNode,
} from "react";
import { MathFunctionContext } from "../context/mathFunctionContext";

type RefPoint = {
	x: number;
	y: number;
};

export enum ScreenModes {
	default = "DEFAULT",
	large = "LARGE",
}

interface IPlainConfigs {
	screen: ScreenModes;
	grid: boolean;
	smallGrid: boolean;
	numbers: boolean;
}

interface IPlainContext {
	setCanvasSize: (width: number, height: number) => void;
	handleMouseDown: () => void;
	handleMouseUp: () => void;
	handleMouseMove: (e: MouseEvent) => void;
	handleWheel: (e: WheelEvent) => void;
	print: () => void;
	zoomIn: () => void;
	zoomOut: () => void;
	reset: () => void;
	canvasImage: HTMLCanvasElement | null;
	refPoint: RefPoint;
	gridSize: number;
	configs: IPlainConfigs;
	setConfigs: (configs: IPlainConfigs) => void;
}

interface PlainProviderProps {
	children?: ReactNode;
}

export const PlainContext = createContext<IPlainContext | null>(null);

export const PlainProvider: FunctionComponent<PlainProviderProps> = ({
	children,
}) => {
	const [configs, setConfigs] = useState<IPlainConfigs>({
		screen: ScreenModes.default,
		grid: true,
		smallGrid: true,
		numbers: true,
	});

	const [refPoint, setRefPoint] = useState<RefPoint>({ x: 0, y: 0 });
	const [gridSize, setGridSize] = useState<number>(100);
	const [pointInterval, setPointInterval] = useState<number>(1);
	const [gridLimit, setGridLimit] = useState<number>(100);
	const [lineSize, setLineSize] = useState<number>(1);
	const [textSize, setTextSize] = useState<number>(13);

	const mathFunctionContext = useContext(MathFunctionContext);

	const [isMouseDown, setIsMouseDown] = useState<boolean>(false);

	const canvas = useRef<HTMLCanvasElement | null>(null);
	const ctx = useRef<CanvasRenderingContext2D | null>(null);

	const setCanvasSize = (width: number, height: number) => {
		if (!canvas.current) return;
		canvas.current.width = width;
		canvas.current.height = height;

		setRefPoint({ x: width / 2, y: height / 2 });
	};

	const printFullLineX = (y: number, lineWidth: number, color: string) => {
		if (!ctx.current) return;

		ctx.current.lineWidth = lineWidth;
		ctx.current.strokeStyle = color;

		ctx.current.moveTo(refPoint.x, y);
		ctx.current.lineTo(refPoint.x + gridSize * gridLimit, y);

		ctx.current.moveTo(refPoint.x, y);
		ctx.current.lineTo(refPoint.x + gridSize * gridLimit * -1, y);
	};

	const printFullLineY = (x: number, lineWidth: number, color: string) => {
		if (!ctx.current) return;
		ctx.current.lineWidth = lineWidth;
		ctx.current.strokeStyle = color;

		ctx.current.moveTo(x, refPoint.y);
		ctx.current.lineTo(x, refPoint.y + gridSize * gridLimit);

		ctx.current.moveTo(x, refPoint.y);
		ctx.current.lineTo(x, refPoint.y + gridSize * gridLimit * -1);
	};

	const printWhiteBackgroundText = (text: string, x: number, y: number) => {
		if (!ctx.current) return;
		ctx.current.strokeText(text, x, y);
		ctx.current.fillText(text, x, y);
	};

	const truncateFloat = (number: number) => {
		return parseFloat(number.toPrecision(2));
	};

	const printGrid = () => {
		if (!canvas.current) return;
		if (!ctx.current) return;
		//fondo
		ctx.current.fillStyle = "#fff";
		ctx.current.fillRect(0, 0, canvas.current.width, canvas.current.height);

		//Rejilla pequeña
		if (configs.smallGrid && configs.grid) {
			ctx.current.beginPath();

			for (let y = 1; y < gridLimit * 4; y++) {
				printFullLineX(
					refPoint.y + (gridSize * y) / 4,
					lineSize,
					configs.screen === ScreenModes.default ? "#E6E6E6" : "#9999"
				);
				printFullLineX(
					refPoint.y + (gridSize * y * -1) / 4,
					lineSize,
					configs.screen === ScreenModes.default ? "#E6E6E6" : "#999"
				);
			}

			for (let x = 1; x < gridLimit * 4; x++) {
				printFullLineY(
					refPoint.x + (gridSize * x) / 4,
					lineSize,
					configs.screen === ScreenModes.default ? "#E6E6E6" : "#9999"
				);
				printFullLineY(
					refPoint.x + (gridSize * x * -1) / 4,
					lineSize,
					configs.screen === ScreenModes.default ? "#E6E6E6" : "#999"
				);
			}
			ctx.current.stroke();
		}

		//Rejilla
		if (configs.grid) {
			ctx.current.beginPath();

			//Eje x
			for (let y = 0; y < gridLimit + 1; y++) {
				printFullLineX(
					refPoint.y + gridSize * y,
					lineSize,
					configs.screen === ScreenModes.default ? "#999" : "#000"
				);
				printFullLineX(
					refPoint.y + gridSize * y * -1,
					lineSize,
					configs.screen === ScreenModes.default ? "#999" : "#000"
				);
			}

			//Eje y
			for (let x = 0; x < gridLimit + 1; x++) {
				printFullLineY(
					refPoint.x + gridSize * x,
					lineSize,
					configs.screen === ScreenModes.default ? "#999" : "#000"
				);
				printFullLineY(
					refPoint.x + gridSize * x * -1,
					lineSize,
					configs.screen === ScreenModes.default ? "#999" : "#000"
				);
			}

			ctx.current.stroke();
		}

		//Lineas guia
		ctx.current.beginPath();
		printFullLineX(refPoint.y, lineSize * 1.5, "#000");
		printFullLineY(refPoint.x, lineSize * 1.5, "#000");
		ctx.current.stroke();

		//Numeros Guia
		if (configs.numbers) {
			for (let i = 1; i < gridLimit + 1; i++) {
				const numberString = truncateFloat(
					i * pointInterval
				).toString();

				ctx.current.fillStyle = "#000";
				const textPadding =
					configs.screen === ScreenModes.default
						? textSize * 1
						: textSize * 1.2;

				ctx.current.font = `${
					configs.screen === ScreenModes.default
						? textSize
						: textSize * 1.2
				}px Arial`;
				ctx.current.textAlign = "center";
				ctx.current.strokeStyle = "white";
				ctx.current.lineWidth = 4;

				//Centro
				printWhiteBackgroundText(
					"0",
					refPoint.x + textPadding,
					refPoint.y + textPadding
				);

				//Eje x
				printWhiteBackgroundText(
					numberString,
					refPoint.x + gridSize * i,
					refPoint.y + textPadding
				);
				printWhiteBackgroundText(
					numberString,
					refPoint.x + gridSize * i * -1,
					refPoint.y + textPadding
				);

				//eje y
				ctx.current.textAlign = "right";
				printWhiteBackgroundText(
					numberString,
					refPoint.x + textPadding - textSize * 2,
					refPoint.y + gridSize * i * -1
				);
				printWhiteBackgroundText(
					numberString,
					refPoint.x + textPadding - textSize * 2,
					refPoint.y + gridSize * i + 5
				);
			}
		}
	};

	const getNextInterval = (currentInterval: number) => {
		const numberString = currentInterval.toString();

		if (currentInterval < 1) {
			const lastDigit = numberString.charAt(numberString.length - 1);
			return lastDigit === "2"
				? currentInterval * 2.5
				: currentInterval * 2;
		}

		const firstDigit = numberString.charAt(0);
		return firstDigit === "2" ? currentInterval * 2.5 : currentInterval * 2;
	};

	const getPrevInterval = (currentInterval: number) => {
		const numberString = currentInterval.toString();

		if (currentInterval < 1) {
			const lastDigit = numberString.charAt(numberString.length - 1);

			console.log(
				lastDigit === "5" ? currentInterval / 2.5 : currentInterval / 2
			);

			return lastDigit === "5"
				? currentInterval / 2.5
				: currentInterval / 2;
		}

		const firstDigit = numberString.charAt(0);
		return firstDigit === "5" ? currentInterval / 2.5 : currentInterval / 2;
	};

	const zoomIn = () => {
		if (gridSize >= 200) {
			setGridSize(100);
			setTextSize(13);
			setPointInterval(getPrevInterval(pointInterval));
			return;
		}
		setGridSize(gridSize + 10);
		setTextSize(textSize + 1);
	};

	const zoomOut = () => {
		if (gridSize <= 100) {
			setGridSize(200);
			setTextSize(23);
			setPointInterval(getNextInterval(pointInterval));
			return;
		}
		setGridSize(gridSize - 10);
		setTextSize(textSize - 1);
	};

	const adjustGridPosition = () => {
		if (!canvas.current) return;

		const gridLimitPx = gridLimit * gridSize;
		const diffX = refPoint.x + gridLimitPx;
		const diffY = refPoint.y + gridLimitPx;

		const diffNegativeX = refPoint.x - gridLimitPx;
		const diffNegativeY = refPoint.y - gridLimitPx;

		if (diffX < canvas.current.width) {
			setRefPoint({
				...refPoint,
				x: (refPoint.x += canvas.current.width - diffX),
			});
		}

		if (diffY < canvas.current.height) {
			setRefPoint({
				...refPoint,
				y: (refPoint.y += canvas.current.height - diffY),
			});
		}

		if (diffNegativeX > 0 && diffNegativeX < canvas.current.width) {
			setRefPoint({
				...refPoint,
				x: (refPoint.x -= diffNegativeX),
			});
		}

		if (diffNegativeY > 0 && diffNegativeY < canvas.current.height) {
			setRefPoint({
				...refPoint,
				y: (refPoint.y -= diffNegativeY),
			});
		}
	};

	const handleMouseDown = () => {
		setIsMouseDown(true);
	};

	const handleMouseUp = () => {
		setIsMouseDown(false);
		adjustGridPosition();
	};

	const handleMouseMove = ({ movementX, movementY }: MouseEvent) => {
		if (!isMouseDown) return;

		setRefPoint({
			x: refPoint.x + movementX,
			y: refPoint.y + movementY,
		});
	};

	const handleWheel = (e: WheelEvent) => {
		if (e.deltaY < 0) {
			//UP
			zoomIn();
		} else {
			//DOWN
			zoomOut();
		}

		adjustGridPosition();
	};

	const printPoint = (pointX: number, pointY: number) => {
		if (!ctx.current) return;
		ctx.current.arc(
			refPoint.x + (pointX / pointInterval) * gridSize,
			refPoint.y - (pointY / pointInterval) * gridSize,
			0,
			0,
			Math.PI * 2,
			true
		);
	};

	const printFunctions = () => {
		if (!mathFunctionContext) return;

		mathFunctionContext.functions.forEach(({ points, color }) => {
			if (!ctx.current) return;
			ctx.current.beginPath();
			ctx.current.strokeStyle = color;
			ctx.current.lineWidth = 3;

			points.forEach(({ x, y }) => {
				printPoint(x, y);
			});

			ctx.current.stroke();
		});
	};

	const print = () => {
		printGrid();
		printFunctions();
	};

	const reset = () => {
		if (!canvas.current) return;

		setRefPoint({ x: 0, y: 0 });
		setGridSize(100);
		setPointInterval(1);
		setGridLimit(100);
		setLineSize(1);
		setTextSize(13);

		setRefPoint({
			x: canvas.current.width / 2,
			y: canvas.current.height / 2,
		});
	};

	useEffect(() => {
		canvas.current = document.createElement("canvas");
		ctx.current = canvas.current.getContext("2d");
	}, []);

	const data = {
		setCanvasSize,
		handleMouseDown,
		handleMouseMove,
		handleMouseUp,
		handleWheel,
		print,
		canvasImage: canvas.current,
		refPoint,
		gridSize,
		zoomIn,
		zoomOut,
		reset,
		configs,
		setConfigs,
	};

	return (
		<PlainContext.Provider value={data}>{children}</PlainContext.Provider>
	);
};
