import { IProduct, TCategoryKey } from "../../../types";
import { categoryMap } from "../../../utils/constants";
import { ensureElement } from "../../../utils/utils";
import { Card, ICardActions } from "./Card";

type TButtonLabel = "Купить" | "Удалить из корзины" | "Недоступно";
type TCardPreview = Pick<IProduct, "image" | "category" | "description"> & {
  buttonLabel: TButtonLabel;
  isBuyButtonDisabled: boolean;
};

export class CardPreview extends Card<TCardPreview> {
  protected buyButton: HTMLButtonElement;
  protected imageElement: HTMLImageElement;
  protected categoryElement: HTMLElement;
  protected descriptionElement: HTMLElement;

  constructor(container: HTMLElement, actions?: ICardActions) {
    super(container);

    this.buyButton = ensureElement<HTMLButtonElement>(".card__button", this.container);
    this.imageElement = ensureElement<HTMLImageElement>(".card__image", this.container);
    this.categoryElement = ensureElement<HTMLElement>(".card__category", this.container);
    this.descriptionElement = ensureElement<HTMLElement>(".card__text", this.container);

    if (actions?.onClick) {
      this.buyButton.addEventListener("click", actions.onClick);
    }
  }

  set image(value: string) {
    this.setImage(this.imageElement, value);
  }

  set category(value: string) {
    this.categoryElement.textContent = value;

    for (const key in categoryMap) {
      this.categoryElement.classList.toggle(categoryMap[key as TCategoryKey], key === value);
    }
  }

  set description(value: string) {
    this.descriptionElement.textContent = value;
  }

  set buttonLabel(value: TButtonLabel) {
    this.buyButton.textContent = value;
  }

  set isBuyButtonDisabled(value: boolean) {
    this.buyButton.disabled = value;
  }
}
