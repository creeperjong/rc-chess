function getRandomBoolean(chance) {
	return Math.random() < chance;
}

export function generateRandomArray(width, height) {
	let ret = 0n;
	let chance = Math.random();
	for (let i = 0; i < height; i++) {
		for (let j = width; j < 8; j++) {
			ret <<= 1n;
		}
		for (let j = 0; j < width; j++) {
			ret <<= 1n;
			ret |= BigInt(getRandomBoolean(chance));
		}
	}
	return ret;
}

export function parseInput(input) {
	if (input == "") return [0, 0, null];
	let ret = 0n;
	let rows = input.split("\n");
	let width = rows[0].trim().split(" ").length;
	let height = rows.length;
	for (let i = height - 1; i >= 0; --i) {
		let cols = rows[i].trim().split(" ");
		for (let j = width; j < 8; ++j) {
			ret <<= 1n;
		}
		for (let j = width - 1; j >= 0; --j) {
			ret <<= 1n;
			ret |= BigInt(cols[j]);
		}
	}
	return [width, height, ret];
}

export function bitCnt(n) {
	let ret = 0;
	for (; n; n &= n - 1n) ++ret;
	return ret;
}
