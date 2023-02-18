<script lang="ts">
	import { TutorialPages } from '$lib/constants';

	let selectedPage = 0;
	let isOpen = true;
</script>

{#if isOpen}
	<div class="wrapper">
		<div class="header">
			<div class="proggress" />
			<div class="content">
				<h1>{TutorialPages[selectedPage].heading}</h1>
				<p>{TutorialPages[selectedPage].description}</p>
			</div>
		</div>
		<div class="footer">
			<button on:click={() => (isOpen = false)}>Skip</button>

			<button
				on:click={() =>
					selectedPage === TutorialPages.length - 1 ? (isOpen = false) : selectedPage++}
				>{selectedPage === TutorialPages.length - 1 ? 'Finish' : 'Next'}</button
			>
		</div>
	</div>
{/if}

<style lang="scss">
	.wrapper {
		position: absolute;
		top: 50%;
		left: 50%;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		justify-content: space-between;
		align-items: start;
		background-color: rgb(238, 238, 238);
		padding: 0.5rem;
		border-radius: 4px;
		width: 30%;
		height: 15%;

		.footer {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
