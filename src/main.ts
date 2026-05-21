import "./scss/styles.scss";
import { Catalog } from "./components/models/Catalog.ts";
import { Basket } from "./components/models/Basket.ts";
import { Buyer } from "./components/models/Buyer.ts";
import { Communicator } from "./components/models/Communicator.ts";
import { Api } from "./components/base/Api.ts";
import { apiProducts } from "./utils/data.ts";
import { API_URL } from "./utils/constants.ts";

const api = new Api(API_URL);
const catalogModel = new Catalog();
const basketModel = new Basket();
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
catalogModel.setSelectedProduct(
  catalogModel.getProductById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"),
);
console.log("Изменили выбранный элемент: ", catalogModel.getSelectedProduct());

// Проверка модели данных Basket
console.log("\n------Проверка модели Basket------");
basketModel.addItem(
  catalogModel.getProductById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"),
);
basketModel.addItem(
  catalogModel.getProductById("b06cde61-912f-4663-9751-09956c0eed67"),
);
basketModel.addItem(
  catalogModel.getProductById("854cef69-976d-4c2a-a18c-2aa45046c390"),
);
console.log("Сейчас в корзине: ", basketModel.getItems());
console.log("Общая цена: ", basketModel.getTotalPrice());
console.log("Количество товаров: ", basketModel.getAmount());

basketModel.removeItem(
  catalogModel.getProductById("c101ab44-ed99-4a54-990d-47aa2bb4e7d9"),
);
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
console.log(
  "Добавили email, изменили телефон и способ оплаты: ",
  buyerModel.getInfo(),
);
console.log("Результат валидации: ", buyerModel.validateInfo());

buyerModel.clear();
console.log("Очистили данные: ", buyerModel.getInfo());

// Проверка работы с сервером
console.log("\n\n------Проверка класса Communicator------");

await communicator
  .get()
  .then((res) => {
    catalogModel.setProducts(res.items);
    console.log("Каталог, загруженный с сервера: ", catalogModel.getProducts());
    console.log("Всего товаров: ", res.total);
  })
  .catch((err) => {
    console.log("Ошибка при загрузке данных: ", err);
  });

basketModel.addItem(
  catalogModel.getProductById("54df7dcb-1213-4b3c-ab61-92ed5f845535"),
);
basketModel.addItem(
  catalogModel.getProductById("6a834fb8-350a-440c-ab55-d0e9b959b6e3"),
);
basketModel.addItem(
  catalogModel.getProductById("90973ae5-285c-4b6f-a6d0-65d1d760b102"),
);
basketModel.addItem(
  catalogModel.getProductById("48e86fc0-ca99-4e13-b164-b98d65928b53"),
);
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

communicator
  .post(order)
  .then((res) => {
    console.log("Заказ создан: ", res);
  })
  .catch((err) => {
    console.log("Ошибка при создании заказа: ", err);
  });
