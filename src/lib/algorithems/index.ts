import * as astar from './aStar';
import * as dijkstra from './dijkstra';
import type { SimpleSquare } from '$lib/classes/SimpleSquare';
import type { PathVisualzer } from '$lib/main';

export function getPaths(
	instance: PathVisualzer,
	algo: 'dijkstra' | 'astar',
	start: SimpleSquare,
	target: SimpleSquare
) {
	switch (algo) {
		case 'astar': {
			const visited = astar.astar(instance.grid, start, target)!;
			const shortest = astar.getShortestPtah(start, target);

			return [visited, shortest];
		}
		case 'dijkstra': {
			const visited = dijkstra.dijstra(instance.grid, start, target)!;
			const shortest = dijkstra.getShortestPtah(target);

			return [visited, shortest];
		}

		default: {
			return [[], []];
		}
	}
}

export async function animatePaths(visited: SimpleSquare[], shortest: SimpleSquare[]) {
	await animate(visited!, 'visited');
	await animate(shortest, 'shortest');
}

const animate = (path: SimpleSquare[], type: 'shortest' | 'visited') => {
	return new Promise((res) => {
		for (let i = 0; i < path.length; ++i) {
			setTimeout(() => {
				path[i].createCube(type);
				if (i == path.length - 1) res(true);
			}, 4 * i);
		}
	});
};
