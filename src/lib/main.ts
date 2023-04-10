import * as THREE from 'three';
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

import { CubeMesh } from './classes/CubeMesh';
import { SimpleSquare } from './classes/SimpleSquare';

export type Grid = SimpleSquare[][];

export class PathVisualzer {
	camera: THREE.PerspectiveCamera;
	scene: THREE.Scene;
	stats!: Stats;
	controls?: OrbitControls;
	dragControls: DragControls;
	renderer: THREE.WebGLRenderer;
	container: HTMLDivElement;
	raycaster: THREE.Raycaster;
	mouse: THREE.Vector2;
	planeObjectArr: THREE.Object3D[];
	cubeObjectArr: CubeMesh[];
	targets: CubeMesh[];

	rollOverMesh!: CubeMesh;

	initalized = false;
	isMouseDown = false;
	isShiftDown = false;
	isDraging = false;

	gridSettings = {
		size: 5000,
		division: 40,
		get squareSize() {
			return this.size / this.division;
		}
	};
	grid: Grid;
	constructor(container: HTMLDivElement) {
		this.container = container;
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.planeObjectArr = [];
		this.cubeObjectArr = [];
		this.targets = [];

		this.camera = new THREE.PerspectiveCamera(
			45,
			window.innerWidth / window.innerHeight,
			1,
			100000
		);
		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.scene = new THREE.Scene();
		this.controls = new OrbitControls(this.camera, this.renderer.domElement);
		this.controls.mouseButtons = {
			MIDDLE: THREE.MOUSE.MIDDLE,
			RIGHT: THREE.MOUSE.LEFT
		};
		this.dragControls = new DragControls(this.targets, this.camera, this.renderer.domElement);

		this.grid = [];
		for (let i = 0; i < this.gridSettings.division; ++i) {
			const currRow = [];
			for (let j = 0; j < this.gridSettings.division; ++j) {
				currRow.push(new SimpleSquare(this, i, j));
			}
			this.grid.push(currRow);
		}

		this.onWindowResize = this.onWindowResize.bind(this);
		this.onMouseMove = this.onMouseMove.bind(this);
		this.onMouseDown = this.onMouseDown.bind(this);
		this.onMouseUp = this.onMouseUp.bind(this);
		this.onDocumentKeyDown = this.onDocumentKeyDown.bind(this);
		this.onDocumentKeyUp = this.onDocumentKeyUp.bind(this);
	}

	init() {
		// Camera
		this.camera.position.set(500, 800, 1300);
		this.camera.lookAt(0, 0, 0);
		// Scene
		this.scene.background = new THREE.Color(0xf0f0f0f);

		// Stats
		this.stats = Stats();
		document.body.appendChild(this.stats.dom);

		// lights
		const ambientLight = new THREE.AmbientLight(0x606060);
		this.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, 0.75, 0.5).normalize();
		this.scene.add(directionalLight);

		// Renderer
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(
			this.container.getBoundingClientRect().width,
			this.container.getBoundingClientRect().height
		);
		this.renderer.domElement.id = 'main-canvas';
		this.container.appendChild(this.renderer.domElement);

		this.setUpGrid();
		this.render();

		// events
		window.addEventListener('resize', this.onWindowResize);
		window.addEventListener('mousemove', this.onMouseMove);
		window.addEventListener('mousedown', this.onMouseDown);
		window.addEventListener('mouseup', this.onMouseUp);
		document.addEventListener('keydown', this.onDocumentKeyDown);
		document.addEventListener('keyup', this.onDocumentKeyUp);

		this.dragControls.addEventListener('dragstart', this.onDragStart);
		this.dragControls.addEventListener('drag', this.onDrag);
		this.dragControls.addEventListener('dragend', this.onDragEnd);

		this.initalized = true;
	}

	onDragStart = () => {
		console.log('DRAG SSTART');
		this.rollOverMesh.visible = false;
		this.isDraging = true;
	};

	onDrag = (event: THREE.Event) => {
		console.log('DRAGGING');
		const intersects = this.raycaster.intersectObjects(this.planeObjectArr, false);

		const intersect = intersects[0];
		const intersectObj = intersect.object as CubeMesh;
		const object = event.object as CubeMesh;

		if ((intersect && !intersectObj.isTarget) || !intersectObj.isStart) {
			if (intersect.face) {
				object.position.copy(intersect.point).add(intersect.face.normal);
				object.setPosition();
			}
		}
	};

	onDragEnd = (event: THREE.Event) => {
		const intersects = this.raycaster.intersectObjects(this.planeObjectArr, false);

		const intersect = intersects[0];
		const intersectObj = intersect.object as CubeMesh;
		const object = event.object as CubeMesh;

		if ((intersect && !intersectObj.isTarget) || !intersectObj.isStart) {
			if (intersect.face) {
				object.position.copy(intersect.point).add(intersect.face.normal);
				object.setPosition();
			}
			// reset that square
			const [i, j] = object.getIndex();
			const gridPos = this.grid[i][j];

			if (object.isTarget) {
				const previousCube = this.grid.flat().find(m => m.isTarget);
				if (!previousCube) return;
				previousCube.isTarget = false;
				previousCube.cubeMesh = null;
				object.isTarget = true;
				gridPos.isTarget = true;
				gridPos.cubeMesh = object;
				gridPos.cubeMesh.isTarget = true;
			} else {
				const previousCube = this.grid.flat().find(m => m.isStart);
				if (!previousCube) return;
				previousCube.isStart = false;
				previousCube.cubeMesh = null;
				object.isStart = true;
				gridPos.isStart = true;
				gridPos.cubeMesh = object;
				gridPos.cubeMesh.isStart = true;
			}
		}
		this.isDraging = false;
		this.rollOverMesh.visible = true;
	};

	onWindowResize() {
		this.camera.aspect =
			this.container.getBoundingClientRect().width / this.container.getBoundingClientRect().height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(
			this.container.getBoundingClientRect().width,
			this.container.getBoundingClientRect().height
		);
		// this.render();
	}
	onMouseMove(event: MouseEvent) {
		this.mouse.set(
			(event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 + 1
		);

		this.raycaster.setFromCamera(this.mouse.clone(), this.camera);

		const planeIntersects = this.raycaster.intersectObjects(this.planeObjectArr, false);
		const cubeIntersects = this.raycaster.intersectObjects(this.cubeObjectArr, false);
		if (planeIntersects.length > 0) {
			const intersect = planeIntersects[0];
			// console.log(intersect.point, intersect.face?.normal);
			if (intersect.face) {
				this.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
				this.rollOverMesh.setPosition();
			}
			if (this.isMouseDown && this.isShiftDown) {
				this.removeCube(cubeIntersects);
			} else if (this.isMouseDown) {
				this.addCube(cubeIntersects);
			}
		}
	}

	onMouseDown(event: MouseEvent) {
		if (this.isDraging) return;
		this.isMouseDown = event.button === 0;
		this.mouse.set(
			(event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 + 1
		);
		this.raycaster.setFromCamera(this.mouse, this.camera);

		const intersects = this.raycaster.intersectObjects(this.planeObjectArr, false);
		if (intersects.length > 0) {
			if (this.isShiftDown && this.isMouseDown) this.removeCube(intersects);
			else if (this.isMouseDown) this.addCube(intersects);
		}
	}

	onMouseUp(event: MouseEvent) {
		this.isMouseDown = false;
		this.mouse.set(
			(event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 + 1
		);
	}

	onDocumentKeyDown(event: KeyboardEvent) {
		switch (event.key) {
			case 'Shift':
				this.isShiftDown = true;
				break;
		}
	}

	onDocumentKeyUp(event: KeyboardEvent) {
		switch (event.key) {
			case 'Shift':
				this.isShiftDown = false;
				break;
		}
	}

	addCube(intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) {
		if (this.isDraging) return;
		if (intersects.length > 0 && intersects.length < 2) {
			console.log('adding cube');
			const [intersect] = intersects;
			const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
			const cube = new CubeMesh(this, material, this.gridSettings.squareSize, {
				isWall: true,
			});
			if (intersect.face) {
				cube.position.copy(intersect.point).add(intersect.face.normal);
				cube.setPosition();
			}
			this.cubeObjectArr.push(cube);
			this.scene.add(cube);
			const [i, j] = cube.getIndex();
			const gridItem = this.grid[i][j];
			gridItem.cubeMesh = cube;
			gridItem.isWall = true;
		}
	}

	// TODO: fix this. currently intersects only has plane object in it
	removeCube(intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) {
		const [intersect] = intersects;
		if (intersect.object.type === 'CubeMesh') {
			const cube = intersect.object as CubeMesh;
			if (typeof cube.getIndex === 'function') {
				const [i, j] = cube.getIndex();

				this.scene.remove(cube);
				this.grid[i][j].removeCube();
			}
		}
	}

	moveRollOverThingy(intersects: THREE.Intersection<THREE.Object3D<THREE.Event>>[]) {
		const intersect = intersects[0];
		if (intersect.face) {
			this.rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
			this.rollOverMesh.setPosition();
		}
	}

	setUpGrid() {
		const geometry = new THREE.PlaneGeometry(this.gridSettings.size, this.gridSettings.size);
		geometry.rotateX(-Math.PI / 2);
		const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
		this.scene.add(plane);
		this.planeObjectArr.push(plane);
		this.cubeObjectArr.push(plane as any);

		// RollOverThingy
		const rollOverMaterial = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			opacity: 0.5,
			transparent: true
		});
		this.rollOverMesh = new CubeMesh(this, rollOverMaterial, this.gridSettings.squareSize, {
			shouldAddToGrid: false,
			isHidden: true,
		}).add();

		// Target Cube
		const targetCubeMat = new THREE.MeshBasicMaterial({
			color: 0x0000ff
		});
		const targetCube = new CubeMesh(this, targetCubeMat, this.gridSettings.squareSize, {
			isTarget: true
		});
		targetCube.position.set(this.gridSettings.size / 4, 0, 0);
		targetCube.setPosition();
		targetCube.add();
		this.targets.push(targetCube);

		const startCubeMat = new THREE.MeshBasicMaterial({
			color: 0xff00000
		});
		const startCube = new CubeMesh(this, startCubeMat, this.gridSettings.squareSize, {
			isStart: true
		});
		startCube.position.set(-this.gridSettings.size / 4, 0, 0);
		startCube.setPosition();
		startCube.add();
		this.targets.push(startCube);

		// Add Grid Helper
		const gridHelper = new THREE.GridHelper(this.gridSettings.size, this.gridSettings.division);
		this.scene.add(gridHelper);
	}

	render() {
		this.renderer.render(this.scene, this.camera);
		this.stats.update();
		requestAnimationFrame(this.render.bind(this));
	}

	dispose() {
		window.removeEventListener('resize', this.onWindowResize);
		window.removeEventListener('mousemove', this.onMouseMove);
		window.removeEventListener('mousedown', this.onMouseDown);
		window.removeEventListener('mouseup', this.onMouseUp);
		document.removeEventListener('keydown', this.onDocumentKeyDown);
		document.removeEventListener('keyup', this.onDocumentKeyUp);
		try {
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			this.scene.traverse((obj: any) => {
				if (obj.geometry) {
					obj.geometry.dispose();
				}
				if (obj.material) {
					if (obj.material.length) {
						for (let i = 0; i < obj.material.length; ++i) {
							obj.material[i].dispose();
						}
					} else {
						obj.material.dispose();
					}
				}
			});
			this.renderer.dispose();
		} catch (err) {
			console.error(err);
			// debugger;
		}
	}
}
