import type { CubeMesh } from '../main';

export const dijstra = (grid: CubeMesh[][], start: CubeMesh, target: CubeMesh) => {
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

export function findShortestPath(grid: CubeMesh[][] | CubeMesh[], target: CubeMesh) {
	const shortestNodes = [];
	let currNode = target;
	while (currNode !== null) {
		shortestNodes.unshift(currNode);
		currNode = currNode.prevSquare!;
	}
	return shortestNodes;
}

function updateNearbyNodes(square: CubeMesh, gridy: CubeMesh[][]) {
	const nearSquares = getNearestUnvisitedNodes(square, gridy);
	nearSquares.forEach((nearNode) => {
		nearNode.distance = square.distance + 1;
		nearNode.prevSquare = square;
	});
}
function getNearestUnvisitedNodes(square: CubeMesh, gridy: CubeMesh[][]) {
	const res: CubeMesh[] = [];
	const [i, j] = square.getIndex();
	if (gridy[i + 1]) res.push(gridy[i + 1][j]);
	if (gridy[i - 1]) res.push(gridy[i - 1][j]);
	if (gridy[i][j + 1]) res.push(gridy[i][j + 1]);
	if (gridy[i][j - 1]) res.push(gridy[i][j - 1]);
	return res.filter((s) => !s.visited);
}

function sortByDistance(unvisitedNodes: CubeMesh[]) {
	return unvisitedNodes.sort((a, b) => a.distance - b.distance);
}
