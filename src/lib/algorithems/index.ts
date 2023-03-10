import * as astar from './aStar';
import * as dijkstra from './dijkstra';
import type { SimpleSquare } from '$lib/classes/SimpleSquare';
import type { PathVisualzer } from '$lib/main';
import type { ALGOS } from '$lib/types';

export function getPaths(
	instance: PathVisualzer,
	algo: keyof typeof ALGOS,
	start: SimpleSquare,
	target: SimpleSquare
) {
	switch (algo) {
		case 'astar': {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const visited = astar.astar(instance.grid, start, target)!;
			const shortest = astar.getShortestPtah(start, target);

			return [visited, shortest];
		}
		case 'dijkstra': {
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			const visited = dijkstra.dijstra(instance.grid, start, target)!;
			const shortest = dijkstra.getShortestPtah(target);

			return [visited, shortest];
		}

		default: {
			return [[], []];
		}
	}
}

export class AnimationHandler {
	hasStopped = false;
	visited: SimpleSquare[];
	shortest: SimpleSquare[];

	constructor(visted: SimpleSquare[], shortest: SimpleSquare[]) {
		this.visited = visted;
		this.shortest = shortest;
		return this;
	}

	async start() {
		// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
		await this.animate(this.visited!, 'visited');
		await this.animate(this.shortest, 'shortest');
	}

	stop() {
		this.hasStopped = true;
	}
	animate(path: SimpleSquare[], type: 'shortest' | 'visited') {
		return new Promise((res, rej) => {
			for (let i = 0; i < path.length; ++i) {
				setTimeout(() => {
					if (this.hasStopped) return rej(false);
					path[i].createCube(type);
					if (i == path.length - 1) res(true);
				}, 4 * i);
			}
		});
	}
}
export const algorithems = [astar, dijkstra];
