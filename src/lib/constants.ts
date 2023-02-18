export interface Tuto {
	heading: string;
	description: string;
	media?: {
		type: 'img' | 'video';
		src: string;
	};
}
export const TutorialPages: Tuto[] = [
	{
		heading: 'Welcome to path finding 3d',
		description:
			'This web app lets you see how pathfinding algorithms find a target using easy-to-follow visualizations.'
	},

	{
		heading: 'LOOK!',
		description: 'You can use your right mouse button to look around',
		media: {
			type: 'img',
			src: 'https://i.imgur.com/Qugy1D4.gif'
		}
	},
	{
		heading: 'Zooming',
		description: 'You can zoom in / out with the scroll wheel',
		media: {
			type: 'img',
			src: 'https://i.imgur.com/KgAycVy.gif'
		}
	},
	{
		heading: 'Place walls',
		description: 'You can place walls with your left mouse buttton.',
		media: {
			type: 'img',
			src: 'https://i.imgur.com/xejXhB1.gif'
		}
	},
	{
		heading: 'Move Target and Start Nodes',
		description: 'You can move the target / start node by dragging them to another square.',
		media: {
			type: 'img',
			src: 'https://i.imgur.com/ZR3bjku.gif'
		}
	},
	{
		heading: 'Almost there',
		description: 'Pick an algorithem to viualize and watch how as it tries to find the target node'
	}
];
