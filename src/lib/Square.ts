export class Square {
	i: number;
	j: number;
	distance: number;
	isStart: boolean;
	isTarget: boolean;
	isWall: boolean;
	isWallHidden: boolean;
	visited: boolean;
	prevSquare: Square | null;
	res?: Square[];
	shortest?: Square[];
	constructor(i: number, j: number) {
		this.i = i;
		this.j = j;
		this.distance = Infinity;
		this.isStart = false;
		this.isTarget = false;
		this.isWall = false;
		this.isWallHidden = false;
		this.visited = false;
		this.prevSquare = null;
	}
}
