import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IOrderSuccess {
  total: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
  protected orderCloseButton: HTMLButtonElement;
  protected totalElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.orderCloseButton = ensureElement<HTMLButtonElement>(
      ".order-success__close",
      this.container,
    );
    this.totalElement = ensureElement<HTMLElement>(".order-success__description", this.container);

    this.orderCloseButton.addEventListener("click", () => {
      this.events.emit("order:complete");
    });
  }

  set total(value: number) {
    this.totalElement.textContent = `Списано ${value.toLocaleString("ru-RU")} синапсов`;
  }
}
