import {
  TProductListResponse,
  TOrderRequest,
  TOrderResponse,
  IApi,
} from "../../types/index.ts";

export class Communicator {
  private api: IApi;

  constructor(api: IApi) {
    this.api = api;
  }

  get(): Promise<TProductListResponse> {
    return this.api.get<TProductListResponse>("/product/");
  }

  post(orderData: TOrderRequest): Promise<TOrderResponse> {
    return this.api.post<TOrderResponse>("/order/", orderData);
  }
}
