import type { SimpleSquare } from '../classes/SimpleSquare';
import type { Grid } from '../main';

export const astar = (grid: Grid, start: SimpleSquare, target: SimpleSquare) => {
	let openSet: SimpleSquare[] = [];
	let closedList: SimpleSquare[] = [];

	start.gCost = 0;
	start.hCost = 0;
	openSet.push(start);
	while (openSet.length > 0) {
		console.log('loopijg', openSet, closedList);
		let currentNode = openSet[0];
		for (const node of openSet) {
			if (
				node.fCost < currentNode.fCost ||
				(node.fCost === currentNode.fCost && node.hCost < currentNode.hCost)
			)
				currentNode = node;
		}

		const index = openSet.indexOf(currentNode);
		console.log(index);
		openSet.splice(index, 1);
		closedList.push(currentNode);

		if (currentNode === target) {
			console.log('FOUND IT');
			break;
		}

		const neighbours = getNeighbours(grid, currentNode);
		for (const neighbour of neighbours) {
			if (neighbour.isWall || closedList.includes(neighbour)) continue;

			const newMovementCost = currentNode.gCost + getDistance(currentNode, neighbour);

			if (newMovementCost < neighbour.gCost || openSet.includes(neighbour)) {
				neighbour.gCost = newMovementCost;
				neighbour.hCost = getDistance(neighbour, target);
				neighbour.parent = currentNode;

				if (!openSet.includes(neighbour)) openSet.push(neighbour);
			}
		}
	}
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
