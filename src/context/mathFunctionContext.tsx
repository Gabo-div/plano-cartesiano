import { createContext, useState } from "react";
import type { FunctionComponent, ReactNode } from "react";

import { evaluate } from "mathjs";

interface FunctionPoint {
	x: number;
	y: number;
}

interface addMathFunctionReturn {
	error: string | null;
}

interface IFunction {
	name: string;
	points: FunctionPoint[];
	color: string;
}

interface IMathFunctionContext {
	addMathFunction: (functionString: string) => addMathFunctionReturn;
	removeMathFunction: (functionString: string) => void;
	changeFunctionColor: (functionString: string, color: string) => void;
	functions: IFunction[];
}

interface MathFunctionProviderProps {
	children?: ReactNode;
}

export const MathFunctionContext = createContext<IMathFunctionContext | null>(
	null
);

export const MathFunctionProvider: FunctionComponent<
	MathFunctionProviderProps
> = ({ children }) => {
	const [functions, setFunctions] = useState<IFunction[]>([]);

	const addMathFunction = (functionString: string): addMathFunctionReturn => {
		const isIn = functions.find((value) => value.name === functionString);

		if (isIn) return { error: "Está función ya está en el plano." };

		const points = [];

		for (let x = -10; x < 10; x += 0.01) {
			try {
				let scope = {
					x,
				};

				const y = evaluate(functionString, scope);

				points.push({ x, y });
			} catch (err) {
				return {
					error: "Ha ocurrido un error a la hora de evaluar la función. Asegurese que la sintaxis es correcta.",
				};
			}
		}

		setFunctions([
			...functions,
			{ name: functionString, points, color: "#f73b3b" },
		]);
		return { error: null };
	};

	const removeMathFunction = (functionString: string) => {
		setFunctions(functions.filter(({ name }) => name !== functionString));
	};

	const changeFunctionColor = (functionString: string, color: string) => {
		setFunctions(
			functions.map((funct) =>
				funct.name === functionString ? { ...funct, color } : funct
			)
		);
	};

	const data = {
		addMathFunction,
		removeMathFunction,
		functions,
		changeFunctionColor,
	};

	return (
		<MathFunctionContext.Provider value={data}>
			{children}
		</MathFunctionContext.Provider>
	);
};
