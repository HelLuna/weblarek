import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/Events";

interface IModal {
  content: HTMLElement;
  isActive: boolean;
}

export class Modal extends Component<IModal> {
  protected closeButton: HTMLButtonElement;
  protected contentElement: HTMLElement;

  constructor(protected events: IEvents, container: HTMLElement) {
    super(container);

    this.closeButton = ensureElement<HTMLButtonElement>(".modal__close", this.container);
    this.contentElement = ensureElement<HTMLElement>(".modal__content", this.container);

    this.closeButton.addEventListener("click", () => {
      this.events.emit("modal:close");
    });

    this.container.addEventListener("click", (evt: MouseEvent) => {
      if (evt.target === evt.currentTarget) {
        this.events.emit("modal:close");
      }
    });
  }

  set content(element: HTMLElement) {
    this.contentElement.replaceChildren(element);
  }

  set isActive(value: boolean) {
    this.container.classList.toggle("modal_active", value);
  }
}
