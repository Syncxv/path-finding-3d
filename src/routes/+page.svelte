<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { CubeMesh, PathVisualzer } from '../lib/main';
	import * as THREE from 'three';
	import { browser } from '$app/environment';
	import * as algo from '../lib/algorithems/dijkstra';

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

	function onClick() {
		(window as any).algo = algo;
		console.time('algo');
		let res = algo.dijstra(
			instance.grid,
			instance.grid.flat().find((s) => s.isStart)!,
			instance.grid.flat().find((s) => s.isTarget)!
		);
		console.timeEnd('algo');
		console.log(res);
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
