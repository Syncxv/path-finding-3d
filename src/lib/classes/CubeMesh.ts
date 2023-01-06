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
		options: CubeProps = {
			isWall: false,
			isStart: false,
			isTarget: false,
			isHidden: true,
			shouldAddToGrid: true
		}
	) {
		const geometry = new THREE.BoxGeometry(size, size, size);
		super(geometry, material);
		this.instance = instance;
		this.isWall = options.isWall;
		this.isTarget = options.isTarget;
		this.isStart = options.isStart;
		this.isHidden = options.isHidden;
		this.shouldAddToGrid = options.shouldAddToGrid;
		this.options = options;
		this.squareSize = size;
		this._geometry = geometry;
		this.type = 'CubeMesh';
	}
	setSize(size: number) {
		this._geometry.dispose();
		this._geometry = new THREE.BoxGeometry(size, size, size);
		(this as any).geometry = this._geometry;
		return this;
	}

	setPositon() {
		this.position
			.divideScalar(this.squareSize)
			.floor()
			.multiplyScalar(this.squareSize)
			.addScalar(this.squareSize / 2);

		return this;
	}

	add() {
		this.instance.scene.add(this);
		// this.instance.objects.push(this);
		if (this.shouldAddToGrid) {
			let [i, j] = this.getIndex();
			this.instance.grid[i][j] = this.toSimpleSquare();
		}
		return this;
	}

	getIndex() {
		const { size } = this.instance.gridSettings;
		const { x, z: y } = this.position;

		let column = Math.floor((x + size / 2) / this.squareSize);

		// Calculate the row of the square
		let row = Math.floor((y + size / 2) / this.squareSize);
		// console.log(`The row and column of the square are: (${row}, ${column})`);
		return [column, row];
	}

	toSimpleSquare() {
		let [i, j] = this.getIndex();
		return new SimpleSquare(this.instance, i, j, this.options, this);
	}
}
