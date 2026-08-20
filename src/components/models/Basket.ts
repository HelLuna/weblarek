import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class Basket {
  private items: IProduct[];

  constructor(protected events: IEvents, items: IProduct[] = []) {
    this.items = [...items];
  }

  getItems(): IProduct[] {
    return this.items;
  }

  addItem(item: IProduct): void {
    this.items.push(item);
    this.events.emit("basket:changed");
  }

  removeItem(item: IProduct): void {
    const index = this.items.findIndex((product) => product.id === item.id);

    if (index !== -1) {
      this.items.splice(index, 1);
      this.events.emit("basket:changed");
    }
  }

  clear(): void {
    this.items = [];
    this.events.emit("basket:changed");
  }

  getTotalPrice(): number {
    return this.items.reduce((total, item) => total + (item.price ?? 0), 0);
  }

  getAmount(): number {
    return this.items.length;
  }

  hasItem(id: string): boolean {
    const item = this.items.find((item) => item.id === id);

    if (item) {
      return true;
    }

    return false;
  }
}
