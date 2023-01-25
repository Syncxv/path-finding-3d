<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { PathVisualzer } from '../lib/main';
	import * as THREE from 'three';
	import { browser } from '$app/environment';
	import type { SimpleSquare } from '../lib/classes/SimpleSquare';
	import { algorithems, AnimationHandler, getPaths } from '$lib/algorithems';
	import type { ALGOS } from '$lib/types';

	let container!: HTMLDivElement;

	let instance: PathVisualzer;
	let algo: keyof typeof ALGOS;
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

	let animation: AnimationHandler;

	async function onClick() {
		resetPaths();
		console.log('-----------------------------');
		const target = instance.grid.flat().find((s) => s.isTarget)!;
		const start = instance.grid.flat().find((s) => s.isStart)!;
		console.log(target, start);

		const [visited, shortest] = getPaths(instance!, algo, start, target);

		animation = new AnimationHandler(visited, shortest);
		animation.start();
	}

	function reset() {
		animation.stop();
		console.log(instance.grid.flat().filter((m) => m.cubeMesh));
		instance.grid
			.flat()
			.filter((m) => !(m.isTarget || m.isStart))
			.forEach((elem) => elem.removeCube());
		console.log(instance.grid.flat().filter((m) => m.cubeMesh));
	}

	function resetPaths() {
		instance.grid
			.flat()
			.filter((m) => m.visited || m.cubeMesh?.visited)
			.forEach((elem) => elem.removeCube());
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
			<select bind:value={algo} name="algo" id="">
				{#each algorithems as algo, i}
					<option value={algo.name}> {algo.name}</option>
				{/each}
			</select>
			<button on:click={onClick}> Run </button>
			<button on:click={reset}> Reset </button>
		{/if}
	</nav>

	<div bind:this={container} class="canvas-container" />
</main>
