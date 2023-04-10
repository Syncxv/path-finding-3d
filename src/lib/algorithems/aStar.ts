import type { SimpleSquare } from '../classes/SimpleSquare';
import type { Grid } from '../main';

export const astar = (grid: Grid, start: SimpleSquare, target: SimpleSquare): SimpleSquare[] => {
	const openList: SimpleSquare[] = [];
	const closedList: SimpleSquare[] = [];

	start.gCost = 0;
	start.hCost = 0;
	openList.push(start);
	while (openList.length > 0) {
		console.log('loopijg', openList, closedList);
		let currentNode = openList[0];
		for (const node of openList) {
			if (
				node.fCost < currentNode.fCost ||
				(node.fCost === currentNode.fCost && node.hCost < currentNode.hCost)
			)
				currentNode = node;
		}

		const index = openList.indexOf(currentNode);
		console.log(index);
		openList.splice(index, 1);
		closedList.push(currentNode);

		if (currentNode === target) {
			return closedList;
		}

		const neighbours = getNeighbours(grid, currentNode);
		for (const neighbour of neighbours) {
			if (neighbour.isWall || closedList.includes(neighbour)) continue;

			const newMovementCost = currentNode.gCost + getDistance(currentNode, neighbour);

			if (newMovementCost < neighbour.gCost || !openList.includes(neighbour)) {
				neighbour.gCost = newMovementCost;
				neighbour.hCost = getDistance(neighbour, target);
				neighbour.parent = currentNode;

				if (!openList.includes(neighbour)) openList.push(neighbour);
			}
		}
	}
	return [];
};

export const getShortestPath = (start: SimpleSquare, target: SimpleSquare): SimpleSquare[] => {
	const path: SimpleSquare[] = [];
	let currentNode: SimpleSquare | null = target;

	while (currentNode !== start && currentNode !== null && currentNode.parent !== null) {
		path.push(currentNode.parent);
		currentNode = currentNode.parent;
	}

	return path.reverse();
};

const getDistance = (nodeA: SimpleSquare, nodeB: SimpleSquare): number => {
	const distX = Math.abs(nodeA.x - nodeB.x);
	const distY = Math.abs(nodeA.y - nodeB.y);

	return distX > distY ? 14 * distY + 10 * (distX - distY) : 14 * distX + 10 * (distY - distX);
};

const getNeighbours = (grid: Grid, node: SimpleSquare): SimpleSquare[] => {
	const ret: SimpleSquare[] = [];
	const { x, y } = node;

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

export const name = 'astar';
