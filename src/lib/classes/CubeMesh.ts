import * as THREE from 'three';

import type { PathVisualzer } from '../main';
import type { CubeProps } from '../types';
import { SimpleSquare } from './SimpleSquare';

export class CubeMesh extends THREE.Mesh {
	instance: PathVisualzer;
	_geometry: THREE.BoxGeometry;
	squareSize: number;
	isWall: boolean;
	isTarget: boolean;
	isStart: boolean;
	isHidden: boolean;

	shouldAddToGrid: boolean;
	distance = Infinity;
	visited = false;
	prevSquare?: CubeMesh | SimpleSquare;

	options: CubeProps;
	constructor(
		instance: PathVisualzer,
		material: THREE.Material,
		size: number,
		options?: CubeProps
	) {
		const geometry = new THREE.BoxGeometry(size, size, size);
		super(geometry, material);
		this.instance = instance;
		this.options = options ?? ({} as CubeProps);
		this.isWall = this.options.isWall ?? false;
		this.isTarget = this.options.isTarget ?? false;
		this.isStart = this.options.isStart ?? false;
		this.isHidden = this.options.isHidden ?? true;
		this.shouldAddToGrid = this.options.shouldAddToGrid ?? true;
		this.squareSize = size;
		this._geometry = geometry;
		this.type = 'CubeMesh';
	}
	setSize(size: number) {
		this._geometry.dispose();
		this._geometry = new THREE.BoxGeometry(size, size, size);
		this.geometry = this._geometry;
		return this;
	}

	setPosition() {
		const squareSize = this._geometry.parameters.width;
		this.position
			.divideScalar(squareSize)
			.floor()
			.multiplyScalar(squareSize)
			.addScalar(squareSize / 2);

		return this;
	}

	add() {
		this.instance.scene.add(this);
		// this.instance.objects.push(this);
		if (this.shouldAddToGrid) {
			const [i, j] = this.getIndex();
			this.instance.grid[i][j] = this.toSimpleSquare();
		}
		return this;
	}

	getIndex() {
		const { size } = this.instance.gridSettings;
		const { x, z: y } = this.position;

		const column = Math.floor((x + size / 2) / this.squareSize);

		// Calculate the row of the square
		const row = Math.floor((y + size / 2) / this.squareSize);
		// console.log(`The row and column of the square are: (${row}, ${column})`);
		return [column, row];
	}

	toSimpleSquare() {
		const [i, j] = this.getIndex();
		return new SimpleSquare(this.instance, i, j, this.options, this);
	}
}
