import "./scss/styles.scss";
import { Catalog } from "./components/models/Catalog.ts";
import { Basket as BasketModel } from "./components/models/Basket.ts";
import { Buyer } from "./components/models/Buyer.ts";
import { Communicator } from "./components/models/Communicator.ts";
import { Api } from "./components/base/Api.ts";
import { apiProducts } from "./utils/data.ts";
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
import { IProduct } from "./types/index.ts";

const api = new Api(API_URL);
const catalogModel = new Catalog();
const basketModel = new BasketModel();
const buyerModel = new Buyer();
const communicator = new Communicator(api);

// Проверка модели данных Catalog
console.log("------Проверка модели Catalog------");
catalogModel.setProducts(apiProducts.items);
console.log("Массив товаров из каталога: ", catalogModel.getProducts());

console.log(
  "Товар с id 'b06cde61-912f-4663-9751-09956c0eed67': ",
  catalogModel.getProductById("b06cde61-912f-4663-9751-09956c0eed67"),
);

console.log("Текущий выбранный элемент: ", catalogModel.getSelectedProduct());
let catalogProduct = catalogModel.getProductById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
if (catalogProduct !== undefined) {
  catalogModel.setSelectedProduct(catalogProduct);
}

console.log("Изменили выбранный элемент: ", catalogModel.getSelectedProduct());

// Проверка модели данных Basket
console.log("\n------Проверка модели Basket------");
let basketProduct = catalogModel.getProductById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
if (basketProduct !== undefined) {
  basketModel.addItem(basketProduct);
}

basketProduct = catalogModel.getProductById("b06cde61-912f-4663-9751-09956c0eed67");
if (basketProduct !== undefined) {
  basketModel.addItem(basketProduct);
}

basketProduct = catalogModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390");
if (basketProduct !== undefined) {
  basketModel.addItem(basketProduct);
}

console.log("Сейчас в корзине: ", basketModel.getItems());
console.log("Общая цена: ", basketModel.getTotalPrice());
console.log("Количество товаров: ", basketModel.getAmount());

basketProduct = catalogModel.getProductById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9");
if (basketProduct !== undefined) {
  basketModel.removeItem(basketProduct);
}
console.log("Удалили один из товаров: ", basketModel.getItems());
console.log("Общая цена: ", basketModel.getTotalPrice());
console.log("Количество товаров: ", basketModel.getAmount());

console.log(
  "Есть ли товар с id 'c101ab44-ed99-4a54-990d-47aa2bb4e7d9'? Ответ: ",
  basketModel.hasItem("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"),
);
console.log(
  "Есть ли товар с id '854cef69-976d-4c2a-a18c-2aa45046c390'? Ответ: ",
  basketModel.hasItem("854cef69-976d-4c2a-a18c-2aa45046c390"),
);

basketModel.clear();
console.log("Корзина очищена: ", basketModel.getItems());

// Проверка модели данных Buyer
console.log("\n------Проверка модели Buyer------");
console.log("Данные покупателя в начале: ", buyerModel.getInfo());
console.log("Результат валидации: ", buyerModel.validateInfo());

buyerModel.setInfo({
  payment: "card",
});
console.log("Добавили способ оплаты: ", buyerModel.getInfo());
console.log("Результат валидации: ", buyerModel.validateInfo());

buyerModel.setInfo({
  phone: "+7 (999) 123-45-67",
  address: "191036, г Санкт-Петербург, пр-кт Лиговский, д. 50 литера Е",
});
console.log("Добавили телефон и адрес: ", buyerModel.getInfo());
console.log("Результат валидации: ", buyerModel.validateInfo());

buyerModel.setInfo({
  email: "xxx@example.com ",
  phone: "+7 (812) 765 43-21",
  payment: "cash",
});
console.log("Добавили email, изменили телефон и способ оплаты: ", buyerModel.getInfo());
console.log("Результат валидации: ", buyerModel.validateInfo());

buyerModel.clear();
console.log("Очистили данные: ", buyerModel.getInfo());

// Проверка работы с сервером
console.log("\n\n------Проверка класса Communicator------");
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

basketProduct = catalogModel.getProductById("54df7dcb-1213-4b3c-ab61-92ed5f845535");
if (basketProduct !== undefined) {
  basketModel.addItem(basketProduct);
}

basketProduct = catalogModel.getProductById("6a834fb8-350a-440c-ab55-d0e9b959b6e3");
if (basketProduct !== undefined) {
  basketModel.addItem(basketProduct);
}

basketProduct = catalogModel.getProductById("90973ae5-285c-4b6f-a6d0-65d1d760b102");
if (basketProduct !== undefined) {
  basketModel.addItem(basketProduct);
}

basketProduct = catalogModel.getProductById("48e86fc0-ca99-4e13-b164-b98d65928b53");
if (basketProduct !== undefined) {
  basketModel.addItem(basketProduct);
}
console.log("Заполнили корзину: ", basketModel.getItems());

buyerModel.setInfo({
  payment: "cash",
  email: "example@example.com",
  phone: "+7 900 321 54 76",
  address: "190000, Санкт-Петербург, Европейский пр-кт, 4 к 2",
});
console.log("Создали покупателя: ", buyerModel.getInfo());

const order = {
  ...buyerModel.getInfo(),
  total: basketModel.getTotalPrice(),
  items: basketModel.getItems().map((item) => item.id),
};

console.log("Объект, отправляемый на сервер: ", order);

// communicator
//   .postOrderData(order)
//   .then((res) => {
//     console.log("Заказ создан: ", res);
//   })
//   .catch((err) => {
//     console.log("Ошибка при создании заказа: ", err);
//   });

// Проверка работы представлений
console.log("\n\n------Проверка работы представлений------");
basketModel.clear();

console.log("------Проверка Header------");
const events = new EventEmitter();

const headerContainer = ensureElement<HTMLElement>(".header");
events.on("basket:open", () => {
  modal.render({ content: renderBasket() });
  modalContainer.classList.add("modal_active");
  console.log("open basket!");
});
const header = new Header(events, headerContainer);
console.log(header.render());

console.log(
  `Текущее значение счётчика: ${ensureElement<HTMLElement>(".header__basket-counter").textContent}`,
);
header.counter = 4;
console.log(
  `Изменили счётчик: ${ensureElement<HTMLElement>(".header__basket-counter").textContent}`,
);

console.log("\n\n------Проверка Gallery------");
const galleryContainer = ensureElement<HTMLElement>(".gallery");
const gallery = new Gallery(galleryContainer);
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
const modalContainer = ensureElement<HTMLElement>(".modal");

events.on("modal:close", () => {
  modalContainer.classList.remove("modal_active");
  console.log("close modal!");
});

const modal = new Modal(events, modalContainer);
console.log(modal.render());

console.log("\n\n------Проверка CardCatalog------");
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>("#card-catalog");

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
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>("#card-preview");

events.on("card:select", (item: IProduct) => {
  const isUnavailable = item.price === null;
  const isInBasket = basketModel.hasItem(item.id);

  const card = new CardPreview(cloneTemplate(cardPreviewTemplate), {
    onClick: () => events.emit(isInBasket ? "card:delete" : "card:buy", item),
  });

  modal.render({
    content: card.render({
      title: item.title,
      price: item.price,
      category: item.category,
      image: `${CDN_URL}/${item.image}`,
      description: item.description,
      btnLabel: isUnavailable ? "Недоступно" : isInBasket ? "Удалить из корзины" : "Купить",
      isBtnDisabled: isUnavailable,
    }),
  });

  modalContainer.classList.add("modal_active");
  console.log("Открыли карточку: ", item.title, "| в корзине: ", isInBasket);
});

events.on("card:buy", (item: IProduct) => {
  basketModel.addItem(item);
  header.render({ counter: basketModel.getAmount() });
  modalContainer.classList.remove("modal_active");
  console.log("Купили: ", item.title, "| товары в корзине: ", basketModel.getItems());
});

events.on("card:delete", (item: IProduct) => {
  basketModel.removeItem(item);
  header.render({ counter: basketModel.getAmount() });
  modalContainer.classList.remove("modal_active");
  console.log("Убрали из корзины: ", item.title, "| осталось: ", basketModel.getItems());
});

console.log("\n\n------Проверка CardBasket и Basket------");
const cardBasketTemplate = ensureElement<HTMLTemplateElement>("#card-basket");
const basketTemplate = ensureElement<HTMLTemplateElement>("#basket");
const basket = new Basket(events, cloneTemplate(basketTemplate));

events.on("basket:delete", (item: IProduct) => {
  basketModel.removeItem(item);
  header.render({ counter: basketModel.getAmount() });
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
    events.emit("catalog:changed");
    console.log("Каталог, загруженный с сервера: ", catalogModel.getProducts());
    console.log("Всего товаров: ", res.total);
  })
  .catch((err) => {
    console.log("Ошибка при загрузке данных: ", err);
  });
