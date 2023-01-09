import type { SimpleSquare } from '../classes/SimpleSquare';
import type { Grid } from '../main';

export const astar = (grid: Grid, start: SimpleSquare, target: SimpleSquare) => {
	// The set of nodes already evaluated
	const closedSet: Set<SimpleSquare> = new Set();

	// The set of currently discovered nodes that are not evaluated yet.
	// Initially, only the start node is known.
	start.totalCost = 0;
	start.distance = 0;
	start;
	const openSet: Set<SimpleSquare> = new Set([start]);

	const movementCost = 1;

	while (openSet.size > 0) {
		// Find the node in the open set with the lowest f value
		let currentNode = getNodeWithLowestF(openSet);

		// If the current node is the goal node, we have found the path
		if (currentNode === target) {
			return reconstructPath(currentNode);
		}

		// Remove the current node from the open set and add it to the closed set
		openSet.delete(currentNode);
		closedSet.add(currentNode);

		// Get the adjacent nodes of the current node
		const neighbors = getNeighbors(grid, currentNode);

		for (const neighbor of neighbors) {
			// Skip this neighbor if it is in the closed set
			if (closedSet.has(neighbor)) {
				continue;
			}

			// Calculate the new cost to move to this neighbor
			const costFromStart = currentNode.costFromStart + movementCost;

			// If the neighbor is not in the open set, or if the new cost is lower than the previous cost,
			// update the neighbor's cost and add it to the open set
			if (!openSet.has(neighbor) || costFromStart < neighbor.costFromStart) {
				neighbor.costFromStart = costFromStart;
				neighbor.estimatedCostToGoal = heuristicCost(neighbor, target);
				neighbor.totalCost = neighbor.costFromStart + neighbor.estimatedCostToGoal;
				neighbor.parent = currentNode;

				if (!openSet.has(neighbor)) {
					openSet.add(neighbor);
				}
			}
		}
	}
};

function getNeighbors(grid: Grid, square: SimpleSquare): SimpleSquare[] {
	const neighbors: SimpleSquare[] = [];
	const [x, y] = square.getIndex();
	const directions = [
		[-1, 0], // up
		[0, 1], // right
		[1, 0], // down
		[0, -1] // left
	];

	for (const [dx, dy] of directions) {
		const x2 = x + dx;
		const y2 = y + dy;
		if (x2 >= 0 && x2 < grid.length && y2 >= 0 && y2 < grid[0].length && !grid[x2][y2].isWall) {
			neighbors.push(grid[x2][y2]);
		}
	}

	return neighbors;
}

function getNodeWithLowestF(nodes: Set<SimpleSquare>): SimpleSquare {
	let lowestFSquare: SimpleSquare | undefined;
	let lowestFValue = Infinity;

	for (const node of nodes) {
		lowestFValue = Infinity;

		if (node.totalCost < lowestFValue) {
			lowestFSquare = node;
			lowestFValue = node.totalCost;
		}
	}

	return lowestFSquare!;
}

function reconstructPath(node: SimpleSquare): SimpleSquare[] {
	const path: SimpleSquare[] = [];
	let currentSquare: SimpleSquare | null = node;
	while (currentSquare !== null) {
		path.unshift(currentSquare);
		currentSquare = currentSquare.parent;
	}
	return path;
}

// function heuristicCost(node: SimpleSquare, target: SimpleSquare): number {
// 	// The heuristic function used here is the Euclidean distance
// 	const [x, y] = node.getIndex();
// 	const dx = x - x;
// 	const dy = y - y;
// 	return Math.sqrt(dx * dx + dy * dy);
// }
function heuristicCost(node: SimpleSquare, goal: SimpleSquare): number {
	// You can usste any heuristic function you like here, such as the Manhattan distance or Euclidean distance
	const [x, y] = node.getIndex();
	return Math.abs(x - x) + Math.abs(y - y);
}
