import { TPayment, IBuyer, TValidationErrors } from "../../types/index.ts";
import { IEvents } from "../base/Events.ts";

export class Buyer {
  private payment: TPayment | "";
  private email: string;
  private phone: string;
  private address: string;

  constructor(
    protected events: IEvents,
    payment: TPayment | "" = "",
    email: string = "",
    phone: string = "",
    address: string = "",
  ) {
    this.payment = payment;
    this.email = email;
    this.phone = phone;
    this.address = address;
  }

  setInfo(newData: Partial<IBuyer>): void {
    if (newData.payment !== undefined) {
      this.payment = newData.payment;
    }

    if (newData.email !== undefined) {
      this.email = newData.email;
    }

    if (newData.phone !== undefined) {
      this.phone = newData.phone;
    }

    if (newData.address !== undefined) {
      this.address = newData.address;
    }

    this.events.emit("buyer:changed");
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

    this.events.emit("buyer:changed");
  }

  validateInfo(): TValidationErrors {
    const errors: TValidationErrors = {};

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
