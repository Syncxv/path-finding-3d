export interface IHeapItem<T> {
	heapIndex: number;
	compareTo: (item: T) => number;
}

export class Heap<T extends IHeapItem<T>> {
	items: T[];

	constructor() {
		this.items = [];
	}

	private currentItemCount: number = 0;

	get count() {
		return this.currentItemCount;
	}

	add(item: T): void {
		item.heapIndex = this.currentItemCount;
		this.items[this.currentItemCount] = item;
		this.sortUp(item);
		this.currentItemCount++;
	}

	removeFirst(): T {
		const firstItem = this.items[0];
		this.currentItemCount--;
		this.items[0] = this.items[this.currentItemCount];
		this.items[0].heapIndex = 0;
		this.sortDown(this.items[0]);
		return firstItem;
	}

	updateItem(item: T) {
		this.sortUp(item);
	}

	contains(item: T) {
		return this.items[item.heapIndex] === item;
	}

	sortDown(item: T) {
		while (true) {
			let childIndexLeft = item.heapIndex * 2 + 1;
			let childIndexRight = item.heapIndex * 2 + 2;
			let swapIndex = 0;

			if (childIndexLeft < this.currentItemCount) {
				swapIndex = childIndexLeft;

				if (childIndexRight < this.currentItemCount) {
					if (this.items[childIndexLeft].compareTo(this.items[childIndexRight]) < 0) {
						swapIndex = childIndexRight;
					}
				}

				if (item.compareTo(this.items[swapIndex]) < 0) {
					this.swap(item, this.items[swapIndex]);
				} else return;
			} else return;
		}
	}

	sortUp(item: T) {
		let parentIndex = (item.heapIndex - 1) / 2;

		while (true) {
			let parentItem = this.items[parentIndex];
			if (item?.compareTo(parentItem) > 0) this.swap(item, parentItem);
			else break;
			parentIndex = (item.heapIndex - 1) / 2;
		}
	}

	swap(itemA: T, itemB: T) {
		this.items[itemA.heapIndex] = itemB;
		this.items[itemB.heapIndex] = itemA;
		let itemAIndex = itemA.heapIndex;
		itemA.heapIndex = itemB.heapIndex;
		itemB.heapIndex = itemAIndex;
	}
}
