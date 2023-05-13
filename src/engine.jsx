import * as utils from "./utils.jsx";

const masks = [
	0xffn,
	0xff00n,
	0xff0000n,
	0xff000000n,
	0xff00000000n,
	0xff0000000000n,
	0xff000000000000n,
	0xff00000000000000n,
	0x0101010101010101n,
	0x0202020202020202n,
	0x0404040404040404n,
	0x0808080808080808n,
	0x1010101010101010n,
	0x2020202020202020n,
	0x4040404040404040n,
	0x8080808080808080n,
];
var mem = [{}, {}];

export function abpruning({ grids, isMax, curScore, vis, alpha, beta }) {
	// Check if the game is over
	if (grids == 0n) return [curScore, 0];
	if (mem[isMax ? 0 : 1][grids] != undefined) {
		let [retScore, retIdx] = mem[isMax ? 0 : 1][grids];
		return [retScore + curScore, retIdx];
	}
	let bestScore = isMax ? -Infinity : Infinity;
	let bestIdx = 0;
	for (let i = 0; i < 16; ++i) {
		// Skip if the grid is visited
		if (vis[i]) continue;
		let mask = masks[i];
		// Eliminate the grid
		let newGrids = grids & ~mask;
		// Skip if the grid is empty
		if (newGrids == grids) continue;
		// Mark the grid as visited
		vis[i] = true;
		// Calculate the score
		let newScore = curScore + utils.bitCnt(grids ^ newGrids) * (isMax ? 1 : -1);

		let [score, idx] = abpruning({
			grids: newGrids,
			isMax: !isMax,
			curScore: newScore,
			vis: vis,
			alpha: alpha,
			beta: beta,
		});

		// Update the best score
		if (isMax) {
			if (score > bestScore) {
				bestScore = score;
				bestIdx = i;
			}
		} else {
			if (score < bestScore) {
				bestScore = score;
				bestIdx = i;
			}
		}
		// Update alpha and beta
		if (isMax) {
			alpha = Math.max(alpha, score);
		} else {
			beta = Math.min(beta, score);
		}
		// Unmark the grid as visited
		vis[i] = false;
		if (alpha > beta) break;
	}
	mem[isMax ? 0 : 1][grids] = [bestScore - curScore, bestIdx];
	return [bestScore, bestIdx];
}
