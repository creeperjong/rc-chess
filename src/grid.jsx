import { useEffect, useState } from "react";
import "./App.css";
import {
	Button,
	Input,
	useNumberInput,
	HStack,
	Textarea,
	Checkbox,
} from "@chakra-ui/react";
import { SettingsIcon } from "@chakra-ui/icons";
import {
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
} from "@chakra-ui/react";

function SizeSettings({ defaultValue, onChange }) {
	const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } =
		useNumberInput({
			step: 1,
			defaultValue: defaultValue,
			min: 1,
			max: 8,
			precision: 0,
		});

	const inc = getIncrementButtonProps();
	const dec = getDecrementButtonProps();
	const input = getInputProps();

	useEffect(() => {
		onChange(input.value);
	}, [input]);

	return (
		<HStack maxW='320px'>
			<Button {...dec}>-</Button>
			<Input {...input} />
			<Button {...inc}>+</Button>
		</HStack>
	);
}

export function SettingsContent({ w, h, auto, onClose, onDone }) {
	const [width, setWidth] = useState(w);
	const [height, setHeight] = useState(h);
	const [isAuto, setIsAuto] = useState(auto);
	const [input, setInput] = useState("");

	return (
		<ModalContent>
			<ModalHeader>Board Settings</ModalHeader>
			<ModalCloseButton />
			<ModalBody className='flex flex-col gap-4 text-lg font-medium'>
				<div className='flex flex-row gap-2 justify-start items-center'>
					<p className='w-3/12'>AI mode:</p>
					<Checkbox
						isChecked={isAuto}
						onChange={(e) => setIsAuto(e.target.checked)}
					></Checkbox>
				</div>
				<div className='flex flex-row gap-4 justify-center items-center'>
					<p className='w-3/12'>Width:</p>
					<SizeSettings
						defaultValue={width}
						onChange={(value) => setWidth(parseInt(value))}
					/>
				</div>
				<div className='flex flex-row gap-4 justify-center items-center'>
					<p className='w-3/12'>Height:</p>
					<SizeSettings
						defaultValue={height}
						onChange={(value) => setHeight(parseInt(value))}
					/>
				</div>
				<div className='flex flex-row gap-4 justify-center'>
					<p className='w-3/12'>Input:</p>
					<Textarea
						placeholder='Enter your test case here...'
						maxW='295px'
						onChange={(e) => setInput(e.target.value)}
					/>
				</div>
			</ModalBody>
			<ModalFooter>
				<Button
					colorScheme='purple'
					mr={3}
					onClick={() => onDone(width, height, isAuto, input)}
				>
					Confirm
				</Button>
				<Button variant='outline' colorScheme='purple' onClick={onClose}>
					Cancel
				</Button>
			</ModalFooter>
		</ModalContent>
	);
}

export function ConfigGrid({ onGridClick }) {
	return (
		<div className='w-14 h-14 border-2 border-solid border-purple-200'>
			<Button
				colorScheme='purple'
				variant='solid'
				rounded='none'
				width='100%'
				height='100%'
				onClick={onGridClick}
			>
				<SettingsIcon />
			</Button>
		</div>
	);
}

export function SelectorGrid({ icon, onGridClick, isDisabled }) {
	return (
		<div className='w-14 h-14 border-2 border-solid border-purple-200'>
			<Button
				colorScheme='purple'
				variant='solid'
				rounded='none'
				width='100%'
				height='100%'
				onClick={onGridClick}
				isDisabled={isDisabled}
			>
				{icon}
			</Button>
		</div>
	);
}

export function Grid({ hasPiece }) {
	return (
		<div className='w-14 h-14 border-2 border-solid border-purple-200'>
			<div className='w-full h-full flex justify-center items-center'>
				{hasPiece && (
					<div className='w-2/3 h-2/3 rounded-full bg-violet-500'></div>
				)}
			</div>
		</div>
	);
}
