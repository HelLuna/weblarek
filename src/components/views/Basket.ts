import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IBasket {
  list: HTMLElement[];
  total: number;
  isBtnDisabled: boolean;
}

export class Basket extends Component<IBasket> {
  protected orderButton: HTMLButtonElement;
  protected listElement: HTMLElement;
  protected totalElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.orderButton = ensureElement<HTMLButtonElement>(".basket__button", this.container);
    this.listElement = ensureElement<HTMLElement>(".basket__list", this.container);
    this.totalElement = ensureElement<HTMLElement>(".basket__price", this.container);

    this.orderButton.addEventListener("click", () => {
      this.events.emit("order:open");
    });
  }

  set list(items: HTMLElement[]) {
    this.listElement.replaceChildren(...items);
  }

  set total(value: number) {
    this.totalElement.textContent = `${value.toLocaleString("ru-RU")} синапсов`;
  }

  set isBtnDisabled(value: boolean) {
    this.orderButton.disabled = value;
  }
}
