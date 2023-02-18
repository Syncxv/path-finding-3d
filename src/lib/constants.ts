export interface Tuto {
	heading: string;
	description: string;
}
export const TutorialPages: Tuto[] = [
	{
		heading: 'Welcome to path finding 3d',
		description:
			'This web app lets you see how pathfinding algorithms find a target using easy-to-follow visualizations.'
	},

	{
		heading: 'LOOK!',
		description: 'You can use your right mouse button to look around'
	},
	{
		heading: 'Place walls',
		description: 'You can place walls with your left mouse buttton.'
	},
	{
		heading: 'Move Target and Start Nodes',
		description: 'You can move the target / start node by dragging them to another square.'
	},
	{
		heading: 'Almost there',
		description: 'Pick an algorithem to viualize and watch how as it tries to find the target node'
	}
];
