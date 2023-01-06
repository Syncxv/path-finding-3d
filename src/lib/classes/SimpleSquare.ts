import * as THREE from 'three';
import type { PathVisualzer } from '../main';
import type { CubeProps } from '../types';
import { CubeMesh } from './CubeMesh';

export class SimpleSquare {
	cubeMesh?: CubeMesh;
	instance: PathVisualzer;
	i: number;
	j: number;
	distance: number;
	isStart: boolean;
	isTarget: boolean;
	isWall: boolean;
	isHidden: boolean;
	visited: boolean;
	shouldAddToGrid: boolean;
	prevSquare: SimpleSquare | null;
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
		this.i = i;
		this.j = j;
		this.instance = instance;
		this.distance = Infinity;
		this.isStart = options.isStart;
		this.isTarget = options.isTarget;
		this.isWall = options.isWall;
		this.shouldAddToGrid = options.shouldAddToGrid;
		this.isHidden = false;
		this.visited = false;
		this.prevSquare = null;
		this.cubeMesh = cubeMesh;
	}

	getIndex() {
		return [this.i, this.j];
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
}
