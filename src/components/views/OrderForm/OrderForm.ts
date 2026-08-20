import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

interface IOrderForm {
  error: string;
}

export abstract class OrderForm<T extends object> extends Component<IOrderForm & T> {
  protected errorElement: HTMLElement;

  constructor(container: HTMLFormElement) {
    super(container);

    this.errorElement = ensureElement<HTMLElement>(".form__errors", this.container);
  }

  set error(value: string) {
    this.errorElement.textContent = value;
  }
}
