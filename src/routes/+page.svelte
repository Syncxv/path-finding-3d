<script lang="ts">
	import { onMount } from 'svelte';
	import { PathVisualzer } from '../lib/main';
	import * as THREE from 'three';

	let container!: HTMLDivElement;

	let instance: PathVisualzer;

	onMount(() => {
		(window as any).THREE = THREE;
		instance = (window as any).instance = new PathVisualzer(container);
		instance.init();
	});
</script>

<main>
	<nav>
		{#if instance == null || !instance.initalized}
			<div>loading</div>
		{:else}
			<div class="camera-controls">
				<input
					type="range"
					min="1"
					max="100000"
					value={instance.camera.position.z}
					class="slider"
					id="myRange"
				/>
			</div>
		{/if}
	</nav>

	<div bind:this={container} class="canvas-container" />
</main>
