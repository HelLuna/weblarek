import { IProduct } from "../../../types";
import { ensureElement } from "../../../utils/utils";
import { Component } from "../../base/Component";

type TCard = Pick<IProduct, "title" | "price">;

export interface ICardActions {
  onClick: (evt: MouseEvent) => void;
}

export abstract class Card<T extends object> extends Component<TCard & T> {
  protected titleElement: HTMLElement;
  protected priceElement: HTMLElement;

  constructor(container: HTMLElement) {
    super(container);

    this.titleElement = ensureElement<HTMLElement>(".card__title", this.container);
    this.priceElement = ensureElement<HTMLElement>(".card__price", this.container);
  }

  set title(value: string) {
    this.titleElement.textContent = value;
  }

  set price(value: number | null) {
    this.priceElement.textContent =
      typeof value === "number" ? `${value.toLocaleString("ru-RU")} синапсов` : "Бесценно";
  }
}
