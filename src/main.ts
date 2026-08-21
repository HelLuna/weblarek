import "./scss/styles.scss";
import { API_URL, CDN_URL } from "./utils/constants.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { ensureElement, cloneTemplate } from "./utils/utils.ts";

import { Catalog } from "./components/models/Catalog.ts";
import { IProduct, TPayment } from "./types/index.ts";
import { Basket as BasketModel } from "./components/models/Basket.ts";
import { Buyer } from "./components/models/Buyer.ts";
import { Communicator } from "./components/communicator/Communicator.ts";
import { Api } from "./components/base/Api.ts";

import { Header } from "./components/views/Header.ts";
import { Gallery } from "./components/views/Gallery.ts";
import { Modal } from "./components/views/Modal.ts";
import { CardCatalog } from "./components/views/Card/CardCatalog.ts";
import { CardPreview } from "./components/views/Card/CardPreview.ts";
import { CardBasket } from "./components/views/Card/CardBasket.ts";
import { Basket } from "./components/views/Basket.ts";
import { OrderPaymentForm } from "./components/views/OrderForm/OrderPaymentForm.ts";
import { OrderContactsForm } from "./components/views/OrderForm/OrderContactsForm.ts";
import { OrderSuccess } from "./components/views/OrderSuccess.ts";

const events = new EventEmitter();
const api = new Api(API_URL);
const catalogModel = new Catalog(events);
const basketModel = new BasketModel(events);
const buyerModel = new Buyer(events);
const communicator = new Communicator(api);

// Поиск всех шаблонов
const headerContainer = ensureElement<HTMLElement>(".header");
const galleryContainer = ensureElement<HTMLElement>(".gallery");
const modalContainer = ensureElement<HTMLElement>(".modal");
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const orderPaymentTemplate = ensureElement<HTMLTemplateElement>("#order");
const orderContactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
const orderSuccessTemplate = ensureElement<HTMLTemplateElement>("#success");

// Компоненты представления
const header = new Header(events, headerContainer);
const gallery = new Gallery(galleryContainer);
const modal = new Modal(events, modalContainer);
const basket = new Basket(events, cloneTemplate(basketTemplate));
const orderSuccess = new OrderSuccess(events, cloneTemplate(orderSuccessTemplate));
const orderPaymentForm = new OrderPaymentForm(
  events,
  cloneTemplate<HTMLFormElement>(orderPaymentTemplate),
  {
    onPaymentChange: (payment) => events.emit("order:payment-change", { payment }),
    onAddressChange: (address) => events.emit("order:address-change", { address }),
  },
);
const orderContactsForm = new OrderContactsForm(
  events,
  cloneTemplate<HTMLFormElement>(orderContactsTemplate),
  {
    onEmailChange: (email) => events.emit("order:email-change", { email }),
    onPhoneChange: (phone) => events.emit("order:phone-change", { phone }),
  },
);

// Функции для рендера некоторых компонентов
const cardPreview = new CardPreview(cloneTemplate(cardPreviewTemplate), {
  onClick: () => {
    const item = catalogModel.getSelectedProduct();
    if (item === null) return;

    events.emit(basketModel.hasItem(item.id) ? "card:delete" : "card:buy", item);
  },
});

function renderPreviewCard(): HTMLElement {
  const item = catalogModel.getSelectedProduct();
  if (item === null) return cardPreview.render();

  const isUnavailable = item.price === null;
  const isInBasket = basketModel.hasItem(item.id);

  return cardPreview.render({
    title: item.title,
    price: item.price,
    category: item.category,
    image: `${CDN_URL}/${item.image}`,
    description: item.description,
    buttonLabel: isUnavailable ? "Недоступно" : isInBasket ? "Удалить из корзины" : "Купить",
    isBuyButtonDisabled: isUnavailable,
  });
}

function renderBasket(): HTMLElement {
  const items = basketModel.getItems();

  const cards = items.map((item, index) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit("basket:delete", item),
    });

    return card.render({
      index: index + 1,
      title: item.title,
      price: item.price,
    });
  });

  return basket.render({
    list: cards,
    total: basketModel.getTotalPrice(),
    isButtonDisabled: items.length === 0,
  });
}

function renderOrderPaymentForm(): HTMLElement {
  const { payment, address } = buyerModel.getInfo();
  const errors = buyerModel.validateInfo();
  const error = errors.payment ?? errors.address;
  const withError = errors.payment && errors.address ? false : true;

  return orderPaymentForm.render({
    payment,
    address,
    error: withError ? (error ?? "") : "",
    isButtonDisabled: error !== undefined,
  });
}

function renderOrderContactsForm(): HTMLElement {
  const { email, phone } = buyerModel.getInfo();
  const errors = buyerModel.validateInfo();
  const error = errors.email ?? errors.phone;
  const withError = errors.email && errors.phone ? false : true;

  return orderContactsForm.render({
    email,
    phone,
    error: withError ? (error ?? "") : "",
    isButtonDisabled: error !== undefined,
  });
}

// Обработка событий моделей данных
events.on("catalog:changed", () => {
  const itemCards = catalogModel.getProducts().map((item) => {
    const card = new CardCatalog(cloneTemplate(cardCatalogTemplate), {
      onClick: () => events.emit("card:select", item),
    });

    return card.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: `${CDN_URL}/${item.image}`,
    });
  });

  gallery.render({ catalog: itemCards });
});

events.on("catalog:selected-changed", () => {
  modal.render({ content: renderPreviewCard(), isActive: true });
});

events.on("basket:changed", () => {
  header.render({ counter: basketModel.getAmount() });
  renderBasket();
});

events.on("buyer:changed", () => {
  renderOrderPaymentForm();
  renderOrderContactsForm();
});

// Обработка событий представлений
events.on("basket:open", () => {
  modal.render({ content: renderBasket(), isActive: true });
});

events.on("modal:close", () => {
  modal.render({ isActive: false });
});

events.on("card:select", (item: IProduct) => {
  catalogModel.setSelectedProduct(item);
});

events.on("card:buy", (item: IProduct) => {
  basketModel.addItem(item);
  modal.render({ isActive: false });
});

events.on("card:delete", (item: IProduct) => {
  basketModel.removeItem(item);
  modal.render({ isActive: false });
});

events.on("basket:delete", (item: IProduct) => {
  basketModel.removeItem(item);
});

events.on("order:open", () => {
  modal.render({ content: renderOrderPaymentForm(), isActive: true });
});

events.on("order:payment-change", ({ payment }: { payment: TPayment }) => {
  buyerModel.setInfo({ payment });
});

events.on("order:address-change", ({ address }: { address: string }) => {
  buyerModel.setInfo({ address });
});

events.on("order:next", () => {
  modal.render({ content: renderOrderContactsForm() });
});

events.on("order:email-change", ({ email }: { email: string }) => {
  buyerModel.setInfo({ email });
});

events.on("order:phone-change", ({ phone }: { phone: string }) => {
  buyerModel.setInfo({ phone });
});

events.on("order:pay", () => {
  const order = {
    ...buyerModel.getInfo(),
    total: basketModel.getTotalPrice(),
    items: basketModel.getItems().map((item) => item.id),
  };

  communicator
    .postOrderData(order)
    .then((res) => {
      modal.render({ content: orderSuccess.render({ total: res.total }), isActive: true });
      basketModel.clear();
      buyerModel.clear();
    })
    .catch((err) => {
      console.error("Ошибка при создании заказа: ", err);
    });
});

events.on("order:complete", () => {
  modal.render({ isActive: false });
});

// Загрузка данных с сервера
await communicator
  .getProductList()
  .then((res) => {
    catalogModel.setProducts(res.items);
  })
  .catch((err) => {
    console.error("Ошибка при загрузке данных: ", err);
  });
