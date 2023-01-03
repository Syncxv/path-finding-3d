<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { PathVisualzer } from '../lib/main';
	import * as THREE from 'three';
	import { browser } from '$app/environment';
	import { dijstra } from '../lib/algorithems/dijkstra';

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
			<button on:click={() => {
				// dijstra(instance.grid, )
			}}>
				Run
			</button>
		{/if}
	</nav>

	<div bind:this={container} class="canvas-container" />
</main>
