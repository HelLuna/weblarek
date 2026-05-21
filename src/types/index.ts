export type ApiPostMethods = "POST" | "PUT" | "DELETE";

export interface IApi {
  get<T extends object>(uri: string): Promise<T>;
  post<T extends object>(
    uri: string,
    data: object,
    method?: ApiPostMethods,
  ): Promise<T>;
}

export type TProductListResponse = {
  total: number;
  items: IProduct[];
};

export type TOrderRequest = IBuyer & {
  total: number;
  items: string[];
};

export type TOrderResponse = {
  id: string;
  total: number;
};

export interface IProduct {
  id: string;
  description: string;
  image: string;
  title: string;
  category: string;
  price: number | null;
}

export type TPayment = "card" | "cash" | "";
export interface IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;
}

export type TBuyerError = {
  payment?: string;
  email?: string;
  phone?: string;
  address?: string;
};
