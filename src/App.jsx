import { useEffect, useState } from "react";
import * as utils from "./utils.jsx";
import { SettingsContent, Grid, ConfigGrid, SelectorGrid } from "./grid.jsx";
import { abpruning } from "./engine.jsx";
import "./App.css";
import { Button, useDisclosure, useToast } from "@chakra-ui/react";
import { ArrowDownIcon, ArrowForwardIcon } from "@chakra-ui/icons";
import { Modal, ModalOverlay } from "@chakra-ui/react";

function Board({ grids }) {
	return (
		<div className='flex flex-col border-2 border-solid border-violet-200 rounded-md'>
			{grids}
		</div>
	);
}

function App() {
	const re = [
		0xffn,
		0xff00n,
		0xff0000n,
		0xff000000n,
		0xff00000000n,
		0xff0000000000n,
		0xff000000000000n,
		0xff00000000000000n,
	];
	const ce = [
		0x0101010101010101n,
		0x0202020202020202n,
		0x0404040404040404n,
		0x0808080808080808n,
		0x1010101010101010n,
		0x2020202020202020n,
		0x4040404040404040n,
		0x8080808080808080n,
	];
	const toast = useToast();
	const [width, setWidth] = useState(8);
	const [height, setHeight] = useState(8);
	const [score1, setScore1] = useState(0);
	const [score2, setScore2] = useState(0);
	const [isAuto, setIsAuto] = useState(true);
	const [turn, setTurn] = useState(0);
	const [analyzer, setAnalyzer] = useState("");
	const [grids, setGrids] = useState(utils.generateRandomArray(width, height));
	const { isOpen, onOpen, onClose } = useDisclosure();

	async function handleAiMove(newGrids) {
		let r = 0,
			c = 0;
		const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
		await sleep(1000);
		let startTime = performance.now();
		let [score, idx] = abpruning({
			grids: newGrids,
			isMax: true,
			curScore: 0,
			vis: {},
			alpha: -Infinity,
			beta: Infinity,
		});
		let endTime = performance.now();
		if (idx < 8) (r = idx + 1), (c = 0);
		else (c = idx - 7), (r = 0);
		handleGridElimination(r, c);
		if (c == 0)
			setAnalyzer(
				`ROW # : ${r}\n+${score} points\nTotal run time: ${
					endTime - startTime
				} ms\n`
			);
		else
			setAnalyzer(
				`COL # : ${c}\n+${score} points\nTotal run time: ${
					endTime - startTime
				} ms\n`
			);
	}

	function handleGridElimination(r, c) {
		let score = 0;
		let newScore1 = score1;
		let newScore2 = score2;
		let newGrids = grids;
		let newTurn = turn;
		if (r == 0) {
			newGrids &= ~ce[c - 1];
		} else if (c == 0) {
			newGrids &= ~re[r - 1];
		}
		setGrids(newGrids);
		score = utils.bitCnt(grids ^ newGrids);
		if (score == 0) return;
		if (turn == 1) {
			newScore1 += score;
			newTurn = 2;
		} else if (turn == 2) {
			newScore2 += score;
			newTurn = 1;
		} else return;

		if (newGrids == 0n) {
			if (newScore1 > newScore2) {
				toast({
					title: "Game Over!",
					description: "AI wins! Alpha-Beta pruning the best!",
					status: "info",
					duration: 5000,
					isClosable: true,
				});
			} else if (newScore1 < newScore2) {
				toast({
					title: "Game Over!",
					description: "Bruv. You win.",
					status: "info",
					duration: 5000,
					isClosable: true,
				});
			} else {
				toast({
					title: "Game Over!",
					description: `Draw! Lucky!`,
					status: "info",
					duration: 5000,
					isClosable: true,
				});
			}
			newTurn = 0;
		}
		setScore1(newScore1);
		setScore2(newScore2);
		setTurn(newTurn);
	}

	function handleConfigDone(w, h, isAuto, input) {
		let [newW, newH, newGrids] = utils.parseInput(input);
		setIsAuto(isAuto);
		if (newGrids == null) {
			if (w != width || h != height) {
				setWidth(w);
				setHeight(h);
				setGrids(utils.generateRandomArray(w, h));
			}
			onClose();
			return;
		}
		setGrids(newGrids);
		setWidth(newW);
		setHeight(newH);
		onClose();
	}

	function handleResetClick() {
		setScore1(0);
		setScore2(0);
		setTurn(0);
		setAnalyzer("");
	}

	function handleStartClick() {
		handleResetClick();
		setTurn(1);
	}

	useEffect(() => {
		if (turn == 1 && isAuto) {
			handleAiMove(grids);
		}
	}, [turn]);

	let grid = [];
	let row = [];
	row.push(<ConfigGrid onGridClick={onOpen} key={0} />);
	for (let i = 0; i < width; i++) {
		row.push(
			<SelectorGrid
				icon={<ArrowDownIcon w={6} h={6} />}
				onGridClick={() => handleGridElimination(0, i + 1)}
				isDisabled={turn == 1 && isAuto}
				key={i + 1}
			/>
		);
	}
	grid.push(
		<div className='flex flex-row' key={0}>
			{row}
		</div>
	);
	for (let i = 0; i < height; i++) {
		row = [];
		row.push(
			<SelectorGrid
				icon={<ArrowForwardIcon w={6} h={6} />}
				onGridClick={() => handleGridElimination(i + 1, 0)}
				isDisabled={turn == 1 && isAuto}
				key={0}
			/>
		);
		for (let j = 0; j < width; j++) {
			row.push(
				<Grid
					hasPiece={Boolean(grids & (1n << (BigInt(i) * 8n + BigInt(j))))}
					key={j + 1}
				/>
			);
		}
		grid.push(
			<div className='flex flex-row' key={i + 1}>
				{row}
			</div>
		);
	}

	return (
		<div className='w-full h-full flex justify-center items-center'>
			<div className='w-full flex flex-col gap-8 justify-center items-center'>
				<div className='font-black text-4xl'>縱橫殺棋對抗賽</div>
				<div className='w-full h-full flex justify-around items-center'>
					<div className='w-full h-full flex flex-col gap-16 justify-center items-center'>
						<div
							className={`h-full font-black text-6xl ${
								turn == 1 ? "animate-bounce" : ""
							}`}
						>
							AI
						</div>
						<div className='h-full font-black text-6xl'>{score1}</div>
						<div className='w-full flex gap-8 justify-center items-center'>
							<Button
								colorScheme='blue'
								size='lg'
								onClick={() => handleStartClick()}
							>
								Start
							</Button>
							<Button
								colorScheme='blue'
								size='lg'
								onClick={() => handleResetClick()}
							>
								Reset
							</Button>
						</div>
					</div>
					<Board grids={grid} />
					<div className='w-full h-full flex flex-col gap-16 justify-center items-center'>
						<div
							className={`h-full font-black text-6xl ${
								turn == 2 ? "animate-bounce" : ""
							}`}
						>
							You
						</div>
						<div className='h-full font-black text-6xl'>{score2}</div>
						<div className='w-full flex gap-8 justify-center items-center'>
							<Button
								colorScheme='blue'
								size='lg'
								isDisabled={turn != 0}
								onClick={() =>
									setGrids(utils.generateRandomArray(width, height))
								}
							>
								Random Generate
							</Button>
						</div>
					</div>
				</div>
				<div className='h-12 flex justify-center items-center'>
					<pre>{analyzer}</pre>
				</div>
				<Modal isOpen={isOpen} onClose={onClose}>
					<ModalOverlay />
					<SettingsContent
						w={width}
						h={height}
						auto={isAuto}
						onClose={onClose}
						onDone={handleConfigDone}
					/>
				</Modal>
			</div>
		</div>
	);
}

export default App;
