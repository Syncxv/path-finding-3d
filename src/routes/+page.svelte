<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { PathVisualzer } from '../lib/main';
	import * as THREE from 'three';
	import { browser } from '$app/environment';
	import * as algo from '../lib/algorithems/aStar';
	import type { SimpleSquare } from '../lib/classes/SimpleSquare';
	import { animatePaths, getPaths } from '$lib/algorithems';

	let container!: HTMLDivElement;

	let instance: PathVisualzer;

	onMount(() => {
		(window as any).THREE = THREE;
		instance = (window as any).instance = new PathVisualzer(container);
		instance.init();
	});

	onDestroy(() => {
		if (browser) {
			instance.dispose();
		}
	});

	const onBruh = (e: Event) => {
		instance.camera.position.z = parseInt((e.target as HTMLInputElement).value);
	};

	const animate = (path: SimpleSquare[], type: 'shortest' | 'visited') => {
		return new Promise((res) => {
			for (let i = 0; i < path.length; ++i) {
				setTimeout(() => {
					path[i].createCube(type);
					if (i == path.length - 1) res(true);
				}, 4 * i);
			}
		});
	};

	async function onClick() {
		(window as any).algo = algo;

		console.log('-----------------------------');
		const target = instance.grid.flat().find((s) => s.isTarget)!;
		const start = instance.grid.flat().find((s) => s.isStart)!;
		console.log(target, start);

		const [visited, shortest] = getPaths(instance!, 'dijkstra', start, target);

		await animatePaths(visited, shortest);
	}

	function reset() {
		console.log(instance.grid.flat().filter((m) => m.cubeMesh));
		instance.grid
			.flat()
			.filter((m) => !(m.isTarget || m.isStart))
			.forEach((elem) => elem.removeCube());
		console.log(instance.grid.flat().filter((m) => m.cubeMesh));
	}
</script>

<main>
	<nav>
		{#if instance == null || !instance.initalized}
			<div>loading</div>
		{:else}
			<div class="camera-controls">
				<input
					on:input={onBruh}
					type="range"
					min="1"
					max="9000"
					value={instance.camera.position.z}
					class="slider"
					id="myRange"
				/>
			</div>
			<button on:click={onClick}> Run </button>
			<button on:click={reset}> Reset </button>
		{/if}
	</nav>

	<div bind:this={container} class="canvas-container" />
</main>
