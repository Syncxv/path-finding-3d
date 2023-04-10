import type { CallbackFunctionVariadic } from '$lib/types';

import type { SimpleSquare } from '../classes/SimpleSquare';
import type { Grid } from '../main';
import { flatten } from '../utils/flatten';

export default class PriorityQueue<T extends object> {
	private _queue: Array<T>;
	private _size = 0;
	private _comparator: CallbackFunctionVariadic<number> | null;

	constructor(initialCapacity?: number, comparator?: CallbackFunctionVariadic<number>) {
		const cap = initialCapacity ?? 11;
		const com = comparator ?? null;
		if (cap < 1) {
			throw new Error('initial capacity must be greater than or equal to 1');
		}
		this._queue = new Array<T>(cap);
		this._comparator = com;
	}

	private grow() {
		const oldCapacity = this._size;
		// Double size if small; else grow by 50%
		const newCapacity = oldCapacity + (oldCapacity < 64 ? oldCapacity + 2 : oldCapacity >> 1);
		if (!Number.isSafeInteger(newCapacity)) {
			throw new Error('capacity out of range');
		}
		this._queue.length = newCapacity;
	}

	private siftup(k: number, item: T): void {
		if (this._comparator !== null) {
			this.siftupUsingComparator(k, item);
		} else {
			this.siftupComparable(k, item);
		}
	}

	/**
	 * siftup of heap
	 */
	private siftupUsingComparator(k: number, item: T): void {
		while (k > 0) {
			// find the parent
			const parent = (k - 1) >>> 1;
			const e = this._queue[parent] as T;
			// compare item with it parent, if item's priority less, break siftup and insert
			if (this._comparator!(item, e) >= 0) {
				break;
			}
			// if item's priority more, make it's parent sink and proceed siftup
			this._queue[k] = e;
			k = parent;
		}
		// if k === 0, then we directly insert it
		this._queue[k] = item;
	}

	private siftupComparable(k: number, item: T): void {
		while (k > 0) {
			const parent = (k - 1) >>> 1;
			const e = this._queue[parent] as T;
			if (item.toString().localeCompare(e.toString()) >= 0) {
				break;
			}
			this._queue[k] = e;
			k = parent;
		}
		this._queue[k] = item;
	}

	private sink(k: number, item: T): void {
		if (this._comparator !== null) {
			this.sinkUsingComparator(k, item);
		} else {
			this.sinkComparable(k, item);
		}
	}

	private sinkUsingComparator(k: number, item: T): void {
		const half = this._size >>> 1;
		while (k < half) {
			let child = (k << 1) + 1;
			let object = this._queue[child];
			const right = child + 1;
			// compare left right child, assgn child the bigger one
			if (right < this._size && this._comparator!(object, this._queue[right]) > 0) {
				object = this._queue[(child = right)];
			}
			// compare item and child if bigger is item, break
			if (this._comparator!(item, object) <= 0) {
				break;
			}
			this._queue[k] = object!;
			k = child;
		}
		this._queue[k] = item;
	}

	private sinkComparable(k: number, item: T): void {
		const half = this._size >>> 1;
		while (k < half) {
			let child = (k << 1) + 1;
			let object = this._queue[child];
			const right = child + 1;

			if (right < this._size && object!.toString().localeCompare(this._queue[right]!.toString())) {
				object = this._queue[(child = right)];
			}
			if (item.toString().localeCompare(object!.toString()) <= 0) {
				break;
			}
			// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
			this._queue[k] = object!;
			k = child;
		}
		this._queue[k] = item;
	}

	private indexOf(item: T): number {
		for (let i = 0; i < this._queue.length; i++) {
			if (this._queue[i] === item) {
				return i;
			}
		}
		return -1;
	}

	public add(item: T): boolean {
		const i = this._size;
		if (i >= this._queue.length) {
			this.grow();
		}
		this._size = i + 1;
		if (i === 0) {
			this._queue[0] = item;
		} else {
			this.siftup(i, item);
		}
		return true;
	}

	public poll(): T | null {
		if (this._size === 0) {
			return null;
		}
		const s = --this._size;
		const result = <T>this._queue[0];
		const x = <T>this._queue[s];
		this._queue.slice(s, 1);
		if (s !== 0) {
			this.sink(0, x);
		}
		return result;
	}

	public peek(): T | null {
		return this._size === 0 ? null : <T>this._queue[0];
	}

	public contains(item: T): boolean {
		return this.indexOf(item) !== -1;
	}

	public clear(): void {
		for (let item of this._queue) {
			(item as unknown) = null;
		}
		this._size = 0;
	}

	public size(): number {
		return this._size;
	}

	public empty(): boolean {
		return this._size === 0;
	}

	public toArray(): Array<T> {
		return this._queue.filter(item => item);
	}

	public toString(): string {
		return this.toArray().toString();
	}

	public [Symbol.iterator]() {
		let i = 0;
		return {
			next: () => {
				return {
					done: i === this._size,
					value: <T>this._queue[i++]
				};
			}
		};
	}
}

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
			if (closestNode === target) return visitedInOrder;
			updateNearbyNodes(closestNode, grid);
		}
	}

	return [];
};

export function getShortestPath(target: SimpleSquare): SimpleSquare[] {
	const shortestNodes = [];
	let currNode = target;
	while (currNode !== null) {
		shortestNodes.unshift(currNode);
		currNode = currNode.prevSquare!;
	}
	return shortestNodes;
}

function updateNearbyNodes(square: SimpleSquare | SimpleSquare, gridy: Grid): void {
	const nearSquares = getNearestUnvisitedNodes(square, gridy);
	nearSquares.forEach(nearNode => {
		nearNode.distance = square.distance + 1;
		nearNode.prevSquare = square;
	});
}
function getNearestUnvisitedNodes(
	square: SimpleSquare | SimpleSquare,
	gridy: Grid
): SimpleSquare[] {
	const res: SimpleSquare[] = [];
	const [i, j] = square.getIndex();
	if (gridy[i + 1]) res.push(gridy[i + 1][j]);
	if (gridy[i - 1]) res.push(gridy[i - 1][j]);
	if (gridy[i][j + 1]) res.push(gridy[i][j + 1]);
	if (gridy[i][j - 1]) res.push(gridy[i][j - 1]);
	return res.filter(s => !s.visited);
}

function sortByDistance(unvisitedNodes: (SimpleSquare | SimpleSquare)[]) {
	return unvisitedNodes.sort((a, b) => a.distance - b.distance);
}

export const name = 'dijkstra';
