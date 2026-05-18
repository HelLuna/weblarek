import { TPayment, IBuyer, TBuyerError } from "../../types/index.ts";

export class Buyer implements IBuyer {
  payment: TPayment;
  email: string;
  phone: string;
  address: string;

  constructor(
    payment: TPayment = "",
    email: string = "",
    phone: string = "",
    address: string = "",
  ) {
    this.payment = payment;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

  setInfo(newData: Partial<Buyer>): void {
    if (newData.payment) {
      this.payment = newData.payment;
    }

    if (newData.email) {
      this.email = newData.email;
    }

    if (newData.phone) {
      this.phone = newData.phone;
    }

    if (newData.address) {
      this.address = newData.address;
    }
  }

  getInfo(): IBuyer {
    return {
      payment: this.payment,
      email: this.email,
      phone: this.phone,
      address: this.address,
    };
  }

  clear(): void {
    this.payment = "";
    this.email = "";
    this.phone = "";
    this.address = "";
  }

  validateInfo(): TBuyerError {
    const errors: TBuyerError = {};

    if (!this.payment) {
      errors.payment = "Не выбран способ оплаты";
    }

    if (!this.email) {
      errors.email = "Необходимо указать email";
    }

    if (!this.phone) {
      errors.phone = "Необходимо указать телефон";
    }

    if (!this.address) {
      errors.address = "Необходимо указать адрес";
    }

    return errors;
  }
}
