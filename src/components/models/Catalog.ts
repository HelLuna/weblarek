import { IProduct } from "../../types/index.ts";

export class Catalog {
  private products: IProduct[];
  private selectedProduct: IProduct | null;

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

  getProductById(id: string): IProduct | undefined {
    return this.products.find((product) => product.id === id);
  }

  setSelectedProduct(product: IProduct): void {
    this.selectedProduct = product;
  }

  getSelectedProduct(): IProduct | null {
    return this.selectedProduct;
  }
}
