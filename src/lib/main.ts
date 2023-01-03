import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

export interface CubeProps {
	isWall: boolean;
	isTarget: boolean;
	isStart: boolean;
}

export class CubeMesh extends THREE.Mesh {
	instance: PathVisualzer;
	_geometry: THREE.BoxGeometry;
	squareSize: number;
	isWall: boolean;
	isTarget: boolean;
	isStart: boolean;
	distance = Infinity;
	constructor(
		instance: PathVisualzer,
		material: THREE.Material,
		size: number,
		options: CubeProps = { isWall: false, isStart: false, isTarget: false }
	) {
		const geometry = new THREE.BoxGeometry(size, size, size);
		super(geometry, material);
		this.instance = instance;
		this.isWall = options.isWall;
		this.isTarget = options.isTarget;
		this.isStart = options.isStart;
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
		return this;
	}

	getIndex() {
		const { size } = this.instance.gridSettings;
		const { x, z: y } = this.position;

		let column = Math.floor((x + size / 2) / this.squareSize);

		// Calculate the row of the square
		let row = Math.floor((y + size / 2) / this.squareSize);
		console.log(`The row and column of the square are: (${row}, ${column})`);
		return [column, row];
	}
}

export class PathVisualzer {
	camera: THREE.PerspectiveCamera;
	scene: THREE.Scene;
	stats!: Stats;
	controls?: OrbitControls;
	renderer: THREE.WebGLRenderer;
	container: HTMLDivElement;
	raycaster: THREE.Raycaster;
	mouse: THREE.Vector2;
	objects: any[];

	rollOverMesh!: CubeMesh;

	initalized = false;
	isMouseDown = false;
	isShiftDown = false;

	gridSettings = {
		size: 2000,
		division: 40,
		get squareSize() {
			return this.size / this.division;
		}
	};
	grid: (CubeMesh | string)[][];
	constructor(container: HTMLDivElement) {
		this.container = container;
		this.raycaster = new THREE.Raycaster();
		this.mouse = new THREE.Vector2();
		this.objects = [];

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
		this.grid = [];
		for (let i = 0; i < this.gridSettings.size; ++i) {
			let currRow = [];
			for (let j = 0; j < this.gridSettings.size; ++j) {
				currRow.push(`${i}, ${j}`);
			}
			this.grid.push(currRow);
		}
	}

	init() {
		//Camera
		this.camera.position.set(500, 800, 1300);
		this.camera.lookAt(0, 0, 0);
		//Scene
		this.scene.background = new THREE.Color(0xf0f0f0f);

		//Stats
		this.stats = Stats();
		document.body.appendChild(this.stats.dom);

		// lights
		const ambientLight = new THREE.AmbientLight(0x606060);
		this.scene.add(ambientLight);

		const directionalLight = new THREE.DirectionalLight(0xffffff);
		directionalLight.position.set(1, 0.75, 0.5).normalize();
		this.scene.add(directionalLight);

		//Renderer
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(
			this.container.getBoundingClientRect().width,
			this.container.getBoundingClientRect().height
		);
		this.renderer.domElement.id = 'main-canvas';
		this.container.appendChild(this.renderer.domElement);
		this.setUpGrid();
		this.render();

		//events
		window.addEventListener('resize', this.onWindowResize.bind(this));
		window.addEventListener('mousemove', this.onMouseMove.bind(this));
		window.addEventListener('mousedown', this.onMouseDown.bind(this));
		window.addEventListener('mouseup', this.onMouseUp.bind(this));
		document.addEventListener('keydown', this.onDocumentKeyDown.bind(this));
		document.addEventListener('keyup', this.onDocumentKeyUp.bind(this));

		this.initalized = true;
	}

	onWindowResize() {
		this.camera.aspect =
			this.container.getBoundingClientRect().width / this.container.getBoundingClientRect().height;
		this.camera.updateProjectionMatrix();

		this.renderer.setSize(
			this.container.getBoundingClientRect().width,
			this.container.getBoundingClientRect().height
		);
		this.render();
	}
	onMouseMove(event: MouseEvent) {
		this.mouse.set(
			(event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 + 1
		);

		this.raycaster.setFromCamera(this.mouse.clone(), this.camera);

		const intersects = this.raycaster.intersectObjects(this.objects, false);
		if (intersects.length > 0) {
			if (this.isMouseDown && this.isShiftDown) {
				this.removeCube();
			} else if (this.isMouseDown) {
				this.addCube();
			} else {
				const intersect = intersects[0];

				this.rollOverMesh.position.copy(intersect.point).add(intersect.face!.normal);
				this.rollOverMesh.setPositon();
				// this.render();
			}
		}
	}

	onMouseDown(event: MouseEvent) {
		this.isMouseDown = event.button === 0;
		this.mouse.set(
			(event.clientX / window.innerWidth) * 2 - 1,
			-(event.clientY / window.innerHeight) * 2 + 1
		);
		this.raycaster.setFromCamera(this.mouse.clone(), this.camera);

		const intersects = this.raycaster.intersectObjects(this.objects, false);
		if (intersects.length > 0) {
			if (this.isShiftDown && this.isMouseDown) this.removeCube();
			else if (this.isMouseDown) this.addCube();
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

	addCube() {
		this.raycaster.setFromCamera(this.mouse.clone(), this.camera);

		const intersects = this.raycaster.intersectObjects(this.objects, false);

		if (intersects.length > 0 && !(intersects.length > 1)) {
			const [intersect] = intersects;
			const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
			const cube = new CubeMesh(this, material, this.gridSettings.squareSize);
			cube.position.copy(intersect.point).add(intersect.face!.normal);
			cube.setPositon();
			this.scene.add(cube);
			this.objects.push(cube);
			let [i, j] = cube.getIndex();
			if (typeof this.grid[i][j] === 'string') this.grid[i][j] = cube;
		}
	}

	removeCube() {
		this.raycaster.setFromCamera(this.mouse.clone(), this.camera);

		const intersects = this.raycaster.intersectObjects(this.objects, false);

		const [intersect] = intersects;
		if ((intersect.object.type = 'CubeMesh')) {
			const cube = intersect.object as CubeMesh;
			if (typeof cube.getIndex === 'function') {
				let [i, j] = cube.getIndex();

				this.scene.remove(cube);
				this.objects.splice(this.objects.indexOf(intersect.object), 1);
				this.grid[i][j] = `${i}, ${j}`;
			}
		}
	}

	setUpGrid() {
		const geometry = new THREE.PlaneGeometry(this.gridSettings.size, this.gridSettings.size);
		geometry.rotateX(-Math.PI / 2);

		const plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({ visible: false }));
		this.scene.add(plane);

		this.objects.push(plane);

		const rollOverMaterial = new THREE.MeshBasicMaterial({
			color: 0xff0000,
			opacity: 0.5,
			transparent: true
		});
		this.rollOverMesh = new CubeMesh(this, rollOverMaterial, this.gridSettings.squareSize).add();
		const gridHelper = new THREE.GridHelper(this.gridSettings.size, this.gridSettings.division);
		this.scene.add(gridHelper);
	}

	render() {
		this.renderer.render(this.scene, this.camera);
		this.stats.update();
		requestAnimationFrame(this.render.bind(this));
	}

	dispose() {
		try {
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
			debugger;
		}
	}
}
