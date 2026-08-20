import { IBuyer } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { IEvents } from "../../base/Events";
import { OrderForm } from "./OrderForm";

type TOrderContactsForm = Pick<IBuyer, "email" | "phone"> & {
  isBtnDisabled: boolean;
};

export interface IOrderContactsActions {
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
}

export class OrderContactsForm extends OrderForm<TOrderContactsForm> {
  protected emailInput: HTMLInputElement;
  protected phoneInput: HTMLInputElement;
  protected payButton: HTMLButtonElement;

  constructor(protected events: IEvents, container: HTMLFormElement, actions?: IOrderContactsActions) {
    super(container);

    this.emailInput = ensureElement<HTMLInputElement>("[name='email']", this.container);
    this.phoneInput = ensureElement<HTMLInputElement>("[name='phone']", this.container);
    this.payButton = ensureElement<HTMLButtonElement>(".button[type='submit']", this.container);

    this.container.addEventListener("submit", (evt) => {
      evt.preventDefault();
      this.events.emit("order:pay");
    });

    if (actions?.onEmailChange) {
      this.emailInput.addEventListener("input", () => {
        actions.onEmailChange(this.emailInput.value);
      });
    }

    if (actions?.onPhoneChange) {
      this.phoneInput.addEventListener("input", () => {
        actions.onPhoneChange(this.phoneInput.value);
      });
    }
  }

  set email(value: string) {
    this.emailInput.value = value;
  }

  set phone(value: string) {
    this.phoneInput.value = value;
  }

  set isBtnDisabled(value: boolean) {
    this.payButton.disabled = value;
  }
}
