import { Heap } from '../classes/Heap';
import PriorityQueue from '../classes/PriorityQueue';
import type { SimpleSquare } from '../classes/SimpleSquare';
import type { Grid } from '../main';

export const astar = (grid: Grid, start: SimpleSquare, target: SimpleSquare): SimpleSquare[] => {
	let openList: PriorityQueue<SimpleSquare> = new PriorityQueue();
	let closedList: SimpleSquare[] = [];

	start.gCost = 0;
	start.hCost = 0;
	openList.add(start);
	while (openList.size() > 0) {
		let currentNode = openList.peek()!;

		closedList.push(currentNode);

		if (currentNode === target) {
			return reConstruct(start, target);
		}

		const neighbours = getNeighbours(grid, currentNode);
		for (const neighbour of neighbours) {
			if (neighbour.isWall || closedList.includes(neighbour)) continue;

			const newMovementCost = currentNode.gCost + getDistance(currentNode, neighbour);

			if (newMovementCost < neighbour.gCost || !openList.contains(neighbour)) {
				neighbour.gCost = newMovementCost;
				neighbour.hCost = getDistance(neighbour, target);
				neighbour.parent = currentNode;

				if (!openList.contains(neighbour)) openList.add(neighbour);
			}
		}
	}
	return [] as SimpleSquare[];
};

const reConstruct = (start: SimpleSquare, target: SimpleSquare) => {
	let path: SimpleSquare[] = [];
	let currentNode = target;

	while (currentNode != start) {
		path.push(currentNode.parent!);
		currentNode = currentNode.parent!;
	}

	return path.reverse();
};

const getDistance = (nodeA: SimpleSquare, nodeB: SimpleSquare) => {
	const distX = Math.abs(nodeA.x - nodeB.x);
	const distY = Math.abs(nodeA.y - nodeB.y);

	return distX > distY ? 14 * distY + 10 * (distX - distY) : 14 * distX + 10 * (distY - distX);
};

const getNeighbours = (grid: Grid, node: SimpleSquare): SimpleSquare[] => {
	var ret: SimpleSquare[] = [];
	var x = node.x;
	var y = node.y;

	if (grid[x - 1] && grid[x - 1][y]) {
		ret.push(grid[x - 1][y]);
	}
	if (grid[x + 1] && grid[x + 1][y]) {
		ret.push(grid[x + 1][y]);
	}
	if (grid[x][y - 1] && grid[x][y - 1]) {
		ret.push(grid[x][y - 1]);
	}
	if (grid[x][y + 1] && grid[x][y + 1]) {
		ret.push(grid[x][y + 1]);
	}
	return ret;
};
