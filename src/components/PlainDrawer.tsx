import type { NextComponentType } from "next";
import { ChangeEvent, useRef, useState, useContext, FormEvent } from "react";

import {
	IconButton,
	useDisclosure,
	Drawer,
	DrawerOverlay,
	DrawerContent,
	DrawerCloseButton,
	DrawerHeader,
	DrawerBody,
	Input,
	Divider,
	InputGroup,
	InputLeftAddon,
	Stack,
	Text,
	Heading,
	Box,
} from "@chakra-ui/react";

import {
	HamburgerIcon,
	AddIcon,
	CloseIcon,
	DownloadIcon,
} from "@chakra-ui/icons";
import { MathFunctionContext } from "../context/mathFunctionContext";
import CanvasCropper from "./CanvasCropperModal";

interface IFunctionInputControl {
	function: string;
	error: string | null;
}

const PlainDrawer: NextComponentType = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	const btnRef = useRef<HTMLButtonElement | null>(null);

	const {
		isOpen: isModalOpen,
		onOpen: onModalOpen,
		onClose: onModalClose,
	} = useDisclosure();

	const mathFunctionContext = useContext(MathFunctionContext);

	const [functionInputControl, setFunctionInputControl] =
		useState<IFunctionInputControl>({ function: "", error: null });

	const [imageURL, setImageURL] = useState<string | null>(null);

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		setFunctionInputControl({
			...functionInputControl,
			function: e.target.value,
		});
	};

	const handleClick = () => {
		if (!mathFunctionContext) return;

		const { error } = mathFunctionContext.addMathFunction(
			functionInputControl.function
		);

		if (error) {
			setFunctionInputControl({ ...functionInputControl, error });
		} else {
			setFunctionInputControl({ function: "", error: null });
		}
	};

	const handleClose = (functionString: string) => {
		if (!mathFunctionContext) return;

		mathFunctionContext.removeMathFunction(functionString);
	};

	const handleColorChange = (e: FormEvent<HTMLInputElement>) => {
		if (!mathFunctionContext) return;

		mathFunctionContext.changeFunctionColor(
			e.currentTarget.name,
			e.currentTarget.value
		);
	};

	const saveCanvas = () => {
		const canvas = document.getElementById(
			"main-canvas"
		) as HTMLCanvasElement;

		if (!canvas) return;

		setImageURL(canvas.toDataURL("image/jpeg", 1));
		onModalOpen();
	};

	return (
		<>
			<Stack position="absolute" m="2">
				<IconButton
					ref={btnRef}
					onClick={onOpen}
					variant="solid"
					colorScheme="green"
					icon={<HamburgerIcon />}
					aria-label="Abrir menu"
				/>
				<IconButton
					onClick={saveCanvas}
					variant="solid"
					colorScheme="green"
					icon={<DownloadIcon />}
					aria-label="Abrir menu"
				/>
			</Stack>

			{imageURL && (
				<CanvasCropper
					isOpen={isModalOpen}
					onClose={onModalClose}
					canvasURL={imageURL}
				/>
			)}

			<Drawer
				isOpen={isOpen}
				placement="left"
				onClose={onClose}
				finalFocusRef={btnRef}
				size="sm"
			>
				<DrawerOverlay />
				<DrawerContent>
					<DrawerCloseButton />
					<DrawerHeader>Funciones</DrawerHeader>
					<Divider mb="6" />

					<DrawerBody>
						<Stack spacing="4">
							{mathFunctionContext?.functions &&
								mathFunctionContext.functions.map(
									({ name, color }) => (
										<Stack
											key={name}
											direction="row"
											align="center"
											justify="space-between"
										>
											<Box
												as="input"
												name={name}
												type="color"
												width="50px"
												height="50px"
												border="none"
												cursor="pointer"
												appearance="none"
												background="transparent"
												sx={{
													"&::-webkit-color-swatch": {
														borderRadius: "7px",
														border: "none",
													},
												}}
												value={color}
												onChange={handleColorChange}
											/>

											<Heading size="md">
												{`f(x) = ${name}`}
											</Heading>
											<IconButton
												variant="ghost"
												aria-label="Eliminar función"
												fontSize="sm"
												icon={<CloseIcon />}
												onClick={() =>
													handleClose(name)
												}
											/>
										</Stack>
									)
								)}
						</Stack>
						<Divider my="6" />
						<Stack spacing="4" align="center">
							<InputGroup>
								<InputLeftAddon
									fontWeight="700"
									children="f(x)"
								/>
								<Input
									value={functionInputControl.function}
									onChange={(e) => handleChange(e)}
								/>
							</InputGroup>
							{functionInputControl.error && (
								<Text textAlign="center" color="red.300">
									{functionInputControl.error}
								</Text>
							)}
							<IconButton
								borderRadius="100%"
								variant="solid"
								colorScheme="red"
								icon={<AddIcon />}
								aria-label="Agregar function"
								onClick={handleClick}
							/>
						</Stack>
					</DrawerBody>
				</DrawerContent>
			</Drawer>
		</>
	);
};

export default PlainDrawer;
