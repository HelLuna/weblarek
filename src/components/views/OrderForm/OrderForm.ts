import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

interface IOrderForm {
  error: string;
  isButtonDisabled: boolean;
}

export abstract class OrderForm<T extends object> extends Component<IOrderForm & T> {
  protected errorElement: HTMLElement;
  protected submitButton: HTMLButtonElement;

  constructor(container: HTMLFormElement) {
    super(container);

    this.errorElement = ensureElement<HTMLElement>(".form__errors", this.container);
    this.submitButton = ensureElement<HTMLButtonElement>(".button[type='submit']", this.container);
  }

  set error(value: string) {
    this.errorElement.textContent = value;
  }

  set isButtonDisabled(value: boolean) {
    this.submitButton.disabled = value;
  }
}
