import type { NextComponentType } from "next";

import {
	Box,
	Button,
	ButtonGroup,
	Checkbox,
	Divider,
	Heading,
	IconButton,
	Popover,
	PopoverArrow,
	PopoverBody,
	PopoverContent,
	PopoverTrigger,
	Stack,
} from "@chakra-ui/react";

import { MdAdd, MdHome, MdRemove, MdBuild } from "react-icons/md";
import { ChangeEvent, useContext, useState } from "react";
import type { MouseEvent } from "react";
import { PlainContext } from "../context/plainContext";

import { ScreenModes } from "../context/plainContext";

const PlainConfigs: NextComponentType = () => {
	const plainContext = useContext(PlainContext);

	const handleZoomIn = () => {
		if (!plainContext) return;
		plainContext.zoomIn();
	};

	const handleZoomOut = () => {
		if (!plainContext) return;
		plainContext.zoomOut();
	};

	const handleReset = () => {
		if (!plainContext) return;
		plainContext.reset();
	};

	const handleScreen = (e: MouseEvent<HTMLElement>) => {
		if (!plainContext) return;

		plainContext.setConfigs({
			...plainContext.configs,
			screen: ScreenModes[
				e.currentTarget.dataset.screen as keyof typeof ScreenModes
			],
		});
	};

	const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
		if (!plainContext) return;
		plainContext.setConfigs({
			...plainContext.configs,
			[e.currentTarget.name]: e.currentTarget.checked,
		});
	};

	return (
		<>
			<Stack position="absolute" right="0" m="2">
				<IconButton
					variant="solid"
					colorScheme="green"
					icon={<MdHome />}
					aria-label="resetesar plano"
					onClick={handleReset}
				/>
				<Stack spacing="0">
					<IconButton
						variant="solid"
						colorScheme="green"
						icon={<MdAdd />}
						aria-label="hacer zoom"
						borderBottomRadius="0"
						onClick={handleZoomIn}
					/>
					<Divider bgColor="black" />
					<IconButton
						variant="solid"
						colorScheme="green"
						icon={<MdRemove />}
						aria-label="deshacer zoom"
						borderTopRadius="0"
						onClick={handleZoomOut}
					/>
				</Stack>

				<Popover strategy="fixed" placement="left-start">
					<PopoverTrigger>
						<IconButton
							variant="solid"
							colorScheme="green"
							icon={<MdBuild />}
							aria-label="abrir configuraciones"
						/>
					</PopoverTrigger>

					<PopoverContent>
						<PopoverArrow />
						<PopoverBody>
							<Box>
								<Heading size="sm">Pantalla</Heading>

								<Divider my="2" />

								<ButtonGroup w="100%" isAttached>
									<Button
										w="50%"
										data-screen="default"
										variant={
											plainContext &&
											plainContext.configs.screen ===
												ScreenModes.default
												? "solid"
												: "outline"
										}
										onClick={handleScreen}
									>
										A
									</Button>
									<Button
										w="50%"
										data-screen="large"
										variant={
											plainContext &&
											plainContext.configs.screen ===
												ScreenModes.large
												? "solid"
												: "outline"
										}
										onClick={handleScreen}
									>
										A
									</Button>
								</ButtonGroup>

								<Divider my="2" />
								<Stack spacing="4">
									<Stack spacing="4" direction="row">
										<Checkbox
											name="grid"
											isChecked={Boolean(
												plainContext?.configs.grid
											)}
											onChange={handleChange}
										>
											Rejilla
										</Checkbox>
										<Checkbox
											name="smallGrid"
											isDisabled={Boolean(
												!plainContext?.configs.grid
											)}
											isChecked={Boolean(
												plainContext?.configs.smallGrid
											)}
											onChange={handleChange}
										>
											Rejilla pequeña
										</Checkbox>
									</Stack>

									<Checkbox
										name="numbers"
										isChecked={Boolean(
											plainContext?.configs.numbers
										)}
										onChange={handleChange}
									>
										Números guia
									</Checkbox>
								</Stack>
							</Box>
						</PopoverBody>
					</PopoverContent>
				</Popover>
			</Stack>
		</>
	);
};

export default PlainConfigs;
