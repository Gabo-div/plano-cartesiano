import { useEffect, useRef, useState } from "react";
import type { FC } from "react";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
	Box,
	Button,
	Checkbox,
	Flex,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
} from "@chakra-ui/react";

interface CanvasCropperProps {
	canvasURL: string;
	isOpen: boolean;
	onClose: () => void;
}

const CanvasCropperModal: FC<CanvasCropperProps> = ({
	canvasURL,
	isOpen,
	onClose,
}) => {
	const cropperRef = useRef<HTMLImageElement>(null);
	const [cropURL, setCropURL] = useState<string | undefined>(undefined);

	const [isCrop, setIsCrop] = useState<boolean>(false);

	const onCrop = () => {
		const imageElement: any = cropperRef?.current;
		const cropper: any = imageElement?.cropper;

		setCropURL(cropper.getCroppedCanvas().toDataURL());
	};

	return (
		<Modal size="4xl" isOpen={isOpen} onClose={onClose}>
			<ModalOverlay />
			<ModalContent>
				<ModalHeader>Guardar Plano</ModalHeader>
				<ModalCloseButton />
				<ModalBody>
					{isCrop ? (
						<Cropper
							src={canvasURL}
							style={{ height: "auto", width: "100%" }}
							initialAspectRatio={16 / 9}
							guides={true}
							crop={onCrop}
							ref={cropperRef}
							viewMode={3}
							dragMode="move"
						/>
					) : (
						<Box as="img" src={canvasURL} w="100%" h="auto"></Box>
					)}
				</ModalBody>
				<ModalFooter>
					<Stack
						w="100%"
						direction="row"
						justify="space-between"
						align="center"
					>
						<Checkbox
							isChecked={isCrop}
							onChange={(e) => setIsCrop(e.target.checked)}
						>
							Recortar
						</Checkbox>

						<Stack direction="row">
							<Button variant="outline">Cancelar</Button>
							<Button as="a" href={cropURL} download="plain.png">
								Descargar
							</Button>
						</Stack>
					</Stack>
				</ModalFooter>
			</ModalContent>
		</Modal>
	);
};

export default CanvasCropperModal;
