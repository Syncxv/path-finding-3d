import type { Grid } from '../main';

export const flatten = (grid: Grid) => {
	const flat = [];
	for (const row of grid) {
		for (const square of row) {
			flat.push(square);
		}
	}
	return flat;
};
