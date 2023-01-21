export interface CubeProps {
	isWall: boolean;
	isTarget: boolean;
	isStart: boolean;
	isHidden: boolean;
	shouldAddToGrid: boolean;
}

export type Direction = 'up' | 'down' | 'right' | 'left';

export type CallbackFunctionVariadic<T> = (...args: any[]) => T;
