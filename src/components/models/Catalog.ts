import { IProduct } from "../../types/index.ts";

export class Catalog {
  protected products: IProduct[];
  protected selectedProduct: IProduct | null;

  constructor(
    products: IProduct[] = [],
    selectedProduct: IProduct | null = null,
  ) {
    this.products = [...products];
    this.selectedProduct = selectedProduct;
  }

  setProducts(products: IProduct[]): void {
    this.products = [...products];
  }

  getProducts(): IProduct[] {
    return this.products;
  }

  getProductById(id: string): IProduct {
    const product = this.products.find((product) => product.id === id);

    if (product) {
      return product;
    }

    throw new Error(`Товар с id ${id} не найден.`);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
