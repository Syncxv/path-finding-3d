import type { SimpleSquare } from '../classes/SimpleSquare';
import type { Grid } from '../main';
import { flatten } from '../utils/flatten';
export const dijstra = (grid: Grid, start: SimpleSquare, target: SimpleSquare) => {
	const squares = flatten(grid);
	const unvisitedSquares = [...squares];
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

export function findShortestPath(target: SimpleSquare) {
	const shortestNodes = [];
	let currNode = target;
	while (currNode !== null) {
		shortestNodes.unshift(currNode);
		currNode = currNode.prevSquare!;
	}
	return shortestNodes;
}

function updateNearbyNodes(square: SimpleSquare | SimpleSquare, gridy: Grid) {
	const nearSquares = getNearestUnvisitedNodes(square, gridy);
	nearSquares.forEach((nearNode) => {
		nearNode.distance = square.distance + 1;
		nearNode.prevSquare = square;
	});
}
function getNearestUnvisitedNodes(square: SimpleSquare | SimpleSquare, gridy: Grid) {
	const res: (SimpleSquare | SimpleSquare)[] = [];
	const [i, j] = square.getIndex();
	if (gridy[i + 1]) res.push(gridy[i + 1][j]);
	if (gridy[i - 1]) res.push(gridy[i - 1][j]);
	if (gridy[i][j + 1]) res.push(gridy[i][j + 1]);
	if (gridy[i][j - 1]) res.push(gridy[i][j - 1]);
	return res.filter((s) => !s.visited);
}

function sortByDistance(unvisitedNodes: (SimpleSquare | SimpleSquare)[]) {
	return unvisitedNodes.sort((a, b) => a.distance - b.distance);
}
