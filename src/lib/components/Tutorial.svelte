<script lang="ts">
	import { TutorialPages } from '$lib/constants';

	let selectedPageIndex = 0;
	let selectedPage = TutorialPages[selectedPageIndex];
	let isOpen = true;
</script>

{#if isOpen}
	<div class="wrapper">
		<div class="header">
			<div class="proggress" />
			<div class="content">
				<h1>{selectedPage.heading}</h1>
				<p>{selectedPage.description}</p>
				{#if selectedPage.media?.type === 'img'}
					<div class="img-wrapper"><img src={selectedPage.media?.src} alt="" /></div>
				{/if}
			</div>
		</div>
		<div class="footer">
			<button on:click={() => (isOpen = false)}>Skip</button>

			<button
				on:click={() => {
					if (selectedPageIndex === TutorialPages.length - 1) return (isOpen = false);
					selectedPageIndex++;
					selectedPage = TutorialPages[selectedPageIndex];
				}}>{selectedPageIndex === TutorialPages.length - 1 ? 'Finish' : 'Next'}</button
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
		background-color: white;
		padding: 0.5rem;
		border-radius: 4px;
		width: 40%;
		min-height: 20%;

		.content {
			.img-wrapper {
				border-radius: 8px;
				overflow: hidden;
				padding: 0.6rem;
			}
		}

		.footer {
			width: 100%;
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
	}
</style>
