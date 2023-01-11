import * as THREE from 'three';
import type { PathVisualzer } from '../main';
import type { CubeProps, Direction } from '../types';
import { CubeMesh } from './CubeMesh';

export class SimpleSquare {
	private _cubeMesh?: CubeMesh | null;
	instance: PathVisualzer;
	x: number;
	y: number;
	distance: number;
	isStart: boolean;
	isTarget: boolean;
	isWall: boolean;
	isHidden: boolean;
	visited: boolean;
	shouldAddToGrid: boolean;
	prevSquare: SimpleSquare | null;

	hCost = Infinity;
	gCost = Infinity;

	parent: SimpleSquare | null = null;
	constructor(
		instance: PathVisualzer,
		i: number,
		j: number,
		options: CubeProps = {
			isWall: false,
			isStart: false,
			isTarget: false,
			isHidden: true,
			shouldAddToGrid: true
		},
		cubeMesh?: CubeMesh
	) {
		this.x = i;
		this.y = j;
		this.instance = instance;
		this.distance = Infinity;
		this.isStart = options.isStart;
		this.isTarget = options.isTarget;
		this.isWall = options.isWall;
		this.shouldAddToGrid = options.shouldAddToGrid;
		this.isHidden = false;
		this.visited = false;
		this.prevSquare = null;
		this._cubeMesh = cubeMesh;
	}

	get fCost() {
		return this.gCost + this.hCost;
	}
	get cubeMesh() {
		return this._cubeMesh;
	}

	set cubeMesh(val: CubeMesh | null | undefined) {
		if (val != null) {
			this.removeCube();
			this._cubeMesh = val;
		} else this._cubeMesh = val;
	}

	getIndex() {
		return [this.x, this.y];
	}

	getPositionFromIndex() {
		const [column, row] = this.getIndex();
		const { squareSize, size } = this.instance.gridSettings;
		const x = column * squareSize - size / 2 + squareSize / 2;
		const y = row * squareSize - size / 2 + squareSize / 2;
		return new THREE.Vector3(x, 0, y);
	}

	createCube(type: 'shortest' | 'visited') {
		if (this.isStart || this.isTarget) return;
		if (this.cubeMesh) this.removeCube();
		const material = new THREE.MeshBasicMaterial({
			color: type === 'visited' ? 0x0356fc : 0xfff424
		});
		const cube = new CubeMesh(this.instance, material, this.instance.gridSettings.squareSize, {
			isHidden: false,
			isWall: true,
			isStart: false,
			isTarget: false,
			shouldAddToGrid: true
		});
		cube.position.copy(this.getPositionFromIndex());
		cube.setPositon();
		this.instance.scene.add(cube);
		this.cubeMesh = cube;
	}

	removeCube() {
		this.gCost = Infinity;
		this.hCost = Infinity;
		this.parent = null;
		this.isWall = false;
		if (this.cubeMesh == null || this.isTarget || this.isStart) return;

		this.instance.scene.remove(this.cubeMesh);
		this.cubeMesh = null;
	}
}
