import {
  ProductListResponse,
  OrderRequest,
  OrderResponse,
  IApi,
} from "../../types/index.ts";

export class Communicator {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  get(): Promise<ProductListResponse> {
    return this.api.get<ProductListResponse>("/product/");
  }

  post(orderData: OrderRequest): Promise<OrderResponse> {
    return this.api.post<OrderResponse>("/order/", orderData);
  }
}
