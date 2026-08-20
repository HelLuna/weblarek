import "./scss/styles.scss";
import { Catalog } from "./components/models/Catalog.ts";
import { Basket as BasketModel } from "./components/models/Basket.ts";
import { Buyer } from "./components/models/Buyer.ts";
import { Communicator } from "./components/models/Communicator.ts";
import { Api } from "./components/base/Api.ts";
import { API_URL, CDN_URL } from "./utils/constants.ts";

import { Header } from "./components/views/Header.ts";
import { EventEmitter } from "./components/base/Events.ts";
import { ensureElement, createElement, ensureAllElements, cloneTemplate } from "./utils/utils.ts";
import { Gallery } from "./components/views/Gallery.ts";
import { Modal } from "./components/views/Modal.ts";
import { CardCatalog } from "./components/views/Card/CardCatalog.ts";
import { CardPreview } from "./components/views/Card/CardPreview.ts";
import { CardBasket } from "./components/views/Card/CardBasket.ts";
import { Basket } from "./components/views/Basket.ts";
import { IProduct, TPayment } from "./types/index.ts";
import { OrderSuccess } from "./components/views/OrderSuccess.ts";
import { OrderPaymentForm } from "./components/views/OrderForm/OrderPaymentForm.ts";
import { OrderContactsForm } from "./components/views/OrderForm/OrderContactsForm.ts";

const events = new EventEmitter();
const api = new Api(API_URL);
const catalogModel = new Catalog(events);
const basketModel = new BasketModel(events);
const buyerModel = new Buyer(events);
const communicator = new Communicator(api);

// console.log("\n\n------Проверка класса Communicator------");
// await communicator
//   .getProductList()
//   .then((res) => {
//     catalogModel.setProducts(res.items);
//     console.log("Каталог, загруженный с сервера: ", catalogModel.getProducts());
//     console.log("Всего товаров: ", res.total);
//   })
//   .catch((err) => {
//     console.log("Ошибка при загрузке данных: ", err);
//   });

// console.log("Объект, отправляемый на сервер: ", order);

// // communicator
// //   .postOrderData(order)
// //   .then((res) => {
// //     console.log("Заказ создан: ", res);
// //   })
// //   .catch((err) => {
// //     console.log("Ошибка при создании заказа: ", err);
// //   });

// Проверка работы представлений
console.log("\n\n------Проверка работы представлений------");
const headerContainer = ensureElement<HTMLElement>(".header");
const header = new Header(events, headerContainer);

const galleryContainer = ensureElement<HTMLElement>(".gallery");
const gallery = new Gallery(galleryContainer);

const modalContainer = ensureElement<HTMLElement>(".modal");
const modal = new Modal(events, modalContainer);

const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");

const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basket = new Basket(events, cloneTemplate(basketTemplate));

const orderPaymentTemplate = ensureElement<HTMLTemplateElement>("#order");
const orderContactsTemplate = ensureElement<HTMLTemplateElement>("#contacts");
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

const orderSuccessTemplate = ensureElement<HTMLTemplateElement>("#success");
const orderSuccess = new OrderSuccess(events, cloneTemplate(orderSuccessTemplate));

basketModel.clear();
buyerModel.clear();

console.log("------Проверка Header------");

events.on("basket:open", () => {
  modal.render({ content: renderBasket() });
  modalContainer.classList.add("modal_active");
  console.log("open basket!");
});

console.log("\n\n------Проверка Gallery------");
console.log(gallery.render());

const card1 = createElement<HTMLElement>("div");
card1.className = "gallery__item card";
card1.textContent = "Товар №1";
const card2 = createElement<HTMLElement>("div");
card2.className = "gallery__item card";
card2.textContent = "Товар №2";
const firstCards = [card1, card2];
gallery.catalog = firstCards;
console.log("Карточки: ", ensureAllElements(".gallery__item", galleryContainer));

const card3 = createElement<HTMLElement>("div");
card3.className = "gallery__item card";
card3.textContent = "Новый товар А";
const card4 = createElement<HTMLElement>("div");
card4.className = "gallery__item card";
card4.textContent = "Новый товар Б";
const card5 = createElement<HTMLElement>("div");
card5.className = "gallery__item card";
card5.textContent = "Новый товар В";
const secondCards = [card3, card4, card5];
gallery.catalog = secondCards;
console.log("Изменили карточки: ", ensureAllElements(".gallery__item", galleryContainer));

console.log("\n\n------Проверка Modal------");

events.on("modal:close", () => {
  modalContainer.classList.remove("modal_active");
  console.log("close modal!");
});

console.log(modal.render());

console.log("\n\n------Проверка CardCatalog------");
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

console.log("\n\n------Проверка CardPreview------");
function renderPreviewCard(item: IProduct): HTMLElement {
  const isUnavailable = item.price === null;
  const isInBasket = basketModel.hasItem(item.id);

  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit(isInBasket ? "card:delete" : "card:buy", item),
  });

  return card.render({
    title: item.title,
    price: item.price,
    category: item.category,
    image: `${CDN_URL}/${item.image}`,
    description: item.description,
    btnLabel: isUnavailable ? "Недоступно" : isInBasket ? "Удалить из корзины" : "Купить",
    isBtnDisabled: isUnavailable,
  });
}

events.on("card:select", (item: IProduct) => {
  catalogModel.setSelectedProduct(item);
});

events.on("catalog:selected-changed", () => {
  const item = catalogModel.getSelectedProduct();
  if (item === null) return;

  modal.render({ content: renderPreviewCard(item) });
  modalContainer.classList.add("modal_active");
  console.log("Открыли карточку: ", item.title, "| в корзине: ", basketModel.hasItem(item.id));
});

events.on("basket:changed", () => {
  header.render({ counter: basketModel.getAmount() });
});

events.on("card:buy", (item: IProduct) => {
  basketModel.addItem(item);
  modal.render({ content: renderPreviewCard(item) });
  console.log("Купили: ", item.title, "| товары в корзине: ", basketModel.getItems());
});

events.on("card:delete", (item: IProduct) => {
  basketModel.removeItem(item);
  modal.render({ content: renderPreviewCard(item) });
  console.log("Убрали из корзины: ", item.title, "| осталось: ", basketModel.getItems());
});

console.log("\n\n------Проверка CardBasket и Basket------");
events.on("basket:delete", (item: IProduct) => {
  basketModel.removeItem(item);
  modal.render({ content: renderBasket() });
  console.log("Убрали из корзины: ", item.title, "| осталось: ", basketModel.getItems());
});

function renderBasket(): HTMLElement {
  const items = basketModel.getItems();

  const cards = items.map((item, idx) => {
    const card = new CardBasket(cloneTemplate(cardBasketTemplate), {
      onClick: () => events.emit("basket:delete", item),
    });

    return card.render({
      index: idx + 1,
      title: item.title,
      price: item.price,
    });
  });

  return basket.render({
    list: cards,
    total: basketModel.getTotalPrice(),
    isBtnDisabled: items.length === 0,
  });
}

console.log(basket.render());

await communicator
  .getProductList()
  .then((res) => {
    catalogModel.setProducts(res.items);
    console.log("Каталог, загруженный с сервера: ", catalogModel.getProducts());
    console.log("Всего товаров: ", res.total);
  })
  .catch((err) => {
    console.log("Ошибка при загрузке данных: ", err);
  });

console.log("\n\n------Проверка Order------");
function renderOrderPaymentForm(withError = true): HTMLElement {
  const { payment, address } = buyerModel.getInfo();
  const errors = buyerModel.validateInfo();
  const error = errors.payment ?? errors.address;

  return orderPaymentForm.render({
    payment,
    address,
    error: withError ? (error ?? "") : "",
    isBtnDisabled: error !== undefined,
  });
}

function renderOrderContactsForm(withError = true): HTMLElement {
  const { email, phone } = buyerModel.getInfo();
  const errors = buyerModel.validateInfo();
  const error = errors.email ?? errors.phone;

  return orderContactsForm.render({
    email,
    phone,
    error: withError ? (error ?? "") : "",
    isBtnDisabled: error !== undefined,
  });
}

// Оформление заказа
events.on("buyer:changed", () => {
  renderOrderPaymentForm();
  renderOrderContactsForm();
});

events.on("order:open", () => {
  modal.render({ content: renderOrderPaymentForm(false) });
  modalContainer.classList.add("modal_active");
  console.log("Открыта форма оплаты и адреса");
});

events.on("order:payment-change", ({ payment }: { payment: TPayment }) => {
  buyerModel.setInfo({ payment });
  console.log(`Способ оплаты: ${buyerModel.getInfo().payment}`);
});

events.on("order:address-change", ({ address }: { address: string }) => {
  buyerModel.setInfo({ address });
  console.log(`Адрес: ${buyerModel.getInfo().address}`);
});

// Следующая форма
events.on("order:next", () => {
  modal.render({ content: renderOrderContactsForm(false) });
  console.log("Открыта форма эл. почты и телефона");
});

events.on("order:email-change", ({ email }: { email: string }) => {
  buyerModel.setInfo({ email });
  console.log(`Email: ${buyerModel.getInfo().email}`);
});

events.on("order:phone-change", ({ phone }: { phone: string }) => {
  buyerModel.setInfo({ phone });
  console.log(`Телефон: ${buyerModel.getInfo().phone}`);
});

// Оплата заказа
events.on("order:pay", () => {
  const order = {
    ...buyerModel.getInfo(),
    total: basketModel.getTotalPrice(),
    items: basketModel.getItems().map((item) => item.id),
  };

  console.log("Объект, отправляемый на сервер: ", order);
  communicator
    .postOrderData(order)
    .then((res) => {
      modal.render({ content: orderSuccess.render({ total: res.total }) });

      basketModel.clear();
      buyerModel.clear();

      console.log("Заказ создан: ", res);
    })
    .catch((err) => {
      console.log("Ошибка при создании заказа: ", err);
    });
});

console.log("\n\n------Проверка OrderSuccess------");
events.on("order:complete", () => {
  modalContainer.classList.remove("modal_active");
  console.log("Заказ оформлен!");
});
