import { ensureElement } from "../../../utils/utils";
import { Card, ICardActions } from "./Card";

type TCardBasket = {
  index: number;
};

export class CardBasket extends Card<TCardBasket> {
  protected deleteButton: HTMLButtonElement;
  protected indexElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.deleteButton = ensureElement<HTMLButtonElement>(".card__button", this.container);
    this.indexElement = ensureElement<HTMLElement>(".basket__item-index", this.container);

    if (actions?.onClick) {
      this.deleteButton.addEventListener("click", actions.onClick);
    }
  }

  set index(value: number) {
    this.indexElement.textContent = String(value);
  }
}
