<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { PathVisualzer } from '../lib/main';
	import * as THREE from 'three';
	import { browser } from '$app/environment';
	import * as algo from '../lib/algorithems/dijkstra';
	import type { SimpleSquare } from '../lib/classes/SimpleSquare';

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

		const target = instance.grid.flat().find((s) => s.isTarget)!;

		let visited = algo.dijstra(
			instance.grid,
			instance.grid.flat().find((s) => s.isStart)!,
			target
		)!;
		const shortest = algo.findShortestPath(target);
		await animate(visited, 'visited');
		await animate(shortest, 'shortest');
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
		{/if}
	</nav>

	<div bind:this={container} class="canvas-container" />
</main>
