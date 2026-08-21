import { IBuyer, TPayment } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { OrderForm } from "./OrderForm";

type TOrderPaymentForm = Pick<IBuyer, "payment" | "address"> & {
  isNextButtonDisabled: boolean;
};

export interface IOrderPaymentActions {
  onPaymentChange: (payment: TPayment | "") => void;
  onAddressChange: (address: string) => void;
}

export class OrderPaymentForm extends OrderForm<TOrderPaymentForm> {
  protected onlinePaymentButton: HTMLButtonElement;
  protected cashPaymentButton: HTMLButtonElement;
  protected addressInput: HTMLInputElement;
  protected nextButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLFormElement, actions?: IOrderPaymentActions) {
    super(container);

    this.onlinePaymentButton = ensureElement<HTMLButtonElement>("[name='card']", this.container);
    this.cashPaymentButton = ensureElement<HTMLButtonElement>("[name='cash']", this.container);
    this.addressInput = ensureElement<HTMLInputElement>("[name='address']", this.container);
    this.nextButton = ensureElement<HTMLButtonElement>(".button[type='submit']", this.container);

    this.container.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this.events.emit("order:next");
    });

    if (actions?.onPaymentChange) {
      this.onlinePaymentButton.addEventListener("click", () => {
        actions.onPaymentChange("card");
      });

      this.cashPaymentButton.addEventListener("click", () => {
        actions.onPaymentChange("cash");
      });
    }

    if (actions?.onAddressChange) {
      this.addressInput.addEventListener("input", () => {
        actions.onAddressChange(this.addressInput.value);
      });
    }
  }

  set payment(value: TPayment | "") {
    this.onlinePaymentButton.classList.toggle("button_alt-active", value === "card");
    this.cashPaymentButton.classList.toggle("button_alt-active", value === "cash");
  }

  set address(value: string) {
    this.addressInput.value = value;
  }

  set isNextButtonDisabled(value: boolean) {
    this.nextButton.disabled = value;
  }
}
