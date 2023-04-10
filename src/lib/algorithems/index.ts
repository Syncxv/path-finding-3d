import type { SimpleSquare } from '$lib/classes/SimpleSquare';
import type { PathVisualzer } from '$lib/main';
import type { ALGOS } from '$lib/types';

import * as astar from './aStar';
import * as dijkstra from './dijkstra';

export function getPaths(
	instance: PathVisualzer,
	algo: keyof typeof ALGOS,
	start: SimpleSquare,
	target: SimpleSquare
): [SimpleSquare[], SimpleSquare[]] {
	switch (algo) {
		case 'astar': {
			const visited = astar.astar(instance.grid, start, target);
			const shortest = astar.getShortestPath(start, target);

			return [visited, shortest];
		}
		case 'dijkstra': {
			const visited = dijkstra.dijstra(instance.grid, start, target);
			if (!visited) return [[], []];
			const shortest = dijkstra.getShortestPath(target);

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

	constructor(visited: SimpleSquare[], shortest: SimpleSquare[]) {
		this.visited = visited;
		this.shortest = shortest;
		return this;
	}

	async start() {
		await this.animate(this.visited, 'visited');
		await this.animate(this.shortest, 'shortest');
	}

	stop() {
		this.hasStopped = true;
	}
	animate(path: SimpleSquare[], type: 'shortest' | 'visited') {
		return new Promise((res, rej) => {
			for (let i = 0; i < path.length; ++i) {
				setTimeout(() => {
					if (this.hasStopped) {
						rej(false);
						return;
					}
					path[i].createCube(type);
					if (i === path.length - 1) res(true);
				}, 4 * i);
			}
		});
	}
}
export const algorithems = [astar, dijkstra];
