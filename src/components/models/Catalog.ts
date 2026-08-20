import { IProduct } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class Catalog {
  private products: IProduct[];
  private selectedProduct: IProduct | null;

  constructor(protected events: IEvents, products: IProduct[] = [], selectedProduct: IProduct | null = null) {
    this.products = [...products];
    this.selectedProduct = selectedProduct;
  }

  setProducts(products: IProduct[]): void {
    this.products = [...products];
    this.events.emit("catalog:changed");
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
    this.events.emit("catalog:selected-changed");
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
