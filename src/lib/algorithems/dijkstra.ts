import type { Square } from '../Square';

let stopped = false;

export const dijstra = (grid: Square[][], start: Square, target: Square) => {
	const squares = [...grid.flat()];
	const unvisitedSquares = [...grid.flat()];
	const visitedInOrder = [];
	start.distance = 0;

	while (unvisitedSquares.length) {
		sortByDistance(squares);
		const closestNode = squares.shift();
		if (closestNode) {
			if (closestNode.isWall) continue;
			if (closestNode.distance === Infinity) return visitedInOrder;
			closestNode.visited = true;
			visitedInOrder.push(closestNode);
			if (closestNode == target) return visitedInOrder;
			updateNearbyNodes(closestNode, grid);
		}
	}
};

export function findShortestPath(grid: Square[][] | Square[], target: Square) {
	const shortestNodes = [];
	let currNode = target;
	while (currNode !== null) {
		shortestNodes.unshift(currNode);
		currNode = currNode.prevSquare!;
	}
	return shortestNodes;
}

function updateNearbyNodes(square: Square, gridy: Square[][]) {
	const nearSquares = getNearestUnvisitedNodes(square, gridy);
	nearSquares.forEach((nearNode) => {
		nearNode.distance = square.distance + 1;
		nearNode.prevSquare = square;
	});
}
function getNearestUnvisitedNodes(square: Square, gridy: Square[][]) {
	const res: Square[] = [];
	const { i, j } = square;
	if (gridy[i + 1]) res.push(gridy[i + 1][j]);
	if (gridy[i - 1]) res.push(gridy[i - 1][j]);
	if (gridy[i][j + 1]) res.push(gridy[i][j + 1]);
	if (gridy[i][j - 1]) res.push(gridy[i][j - 1]);
	return res.filter((s) => !s.visited);
}

function sortByDistance(unvisitedNodes: Square[]) {
	return unvisitedNodes.sort((a, b) => a.distance - b.distance);
}
