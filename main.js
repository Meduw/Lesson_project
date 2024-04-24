//! Если не работает, то нужно запустить json server
//! npx json-server -w bd.json -p 8000
const API = "http://localhost:8000/products";

let productsList = document.getElementById("products");
let image = document.getElementById("image");
let description = document.getElementById("description");
let firstPrice = document.getElementById("price-1");
let secondPrice = document.getElementById("price-2");

let openAddFormBtn = document.getElementById("open-add-form");
let addModal = document.getElementById("add-modal");
let addModalInner = document.getElementById("add-modal-inner");
let closeAddForm = document.getElementById("close-add-modal");

//? Достаем форму добавления
let inpImage = document.getElementById("add-img");
let inpDescription = document.getElementById("add-description");
let inpFirstPrice = document.getElementById("add-price-1");
let inpSecondPrice = document.getElementById("add-price-2");
let addProductBtn = document.getElementById("add-btn");

//? На кнопку навесили событие что бы открыть модалку
openAddFormBtn.addEventListener("click", () => {
  addModal.style.display = "flex";
});
//? Закрытие модалки при клике на креситик внутри нее
closeAddForm.addEventListener("click", () => {
  addModal.style.display = "none";
});

//? Начало details
let closeDetailsBtn = document.getElementById("close-details");
let detailsParent = document.getElementById("details");
let detailsInner = document.getElementById("details-inner");

closeDetailsBtn.addEventListener("click", () => {
  detailsParent.style.display = "none";
});

//! For edit
let editModal = document.getElementById("edit-modal");
let editModalInner = document.getElementById("edit-modal-inner");
let closeEditModal = document.getElementById("close-edit-modal");
let inpImageEdit = document.getElementById("edit-img");
let inpDescriptionEdit = document.getElementById("edit-description");
let inpFirstPriceEdit = document.getElementById("edit-price-1");
let inpSecondPriceEdit = document.getElementById("edit-price-2");
let editProductBtn = document.getElementById("edit-btn");

//?Кнопки задаем закрыть
closeEditModal.addEventListener("click", () => {
  editModal.style.display = "none";
});

//? При клике на кнопку внутри модалки собираем данные с инпута в объкт и делаем запрос на добавление продукта, после скрываем модалку

addProductBtn.addEventListener("click", async () => {
  //? собираем данные
  let product = {
    image: inpImage.value,
    description: inpDescription.value,
    first_price: inpFirstPrice.value,
    second_price: inpSecondPrice.value,
  };
  //? отправляем данные в бэк энд (АПИ)
  if (
    inpImage.value.trim() &&
    inpDescription.value.trim() &&
    inpFirstPrice.value.trim() &&
    inpSecondPrice.value.trim()
  ) {
    await fetch(API, {
      method: "POST",
      body: JSON.stringify(product),
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
    });
  } else {
    alert("Заполните поля!");
  }

  //? закрываем модалку
  addModal.style.display = "none";
});

//? Создали асинхронную функцию для того что бы достать данные с бэкэнда и затем отобразить

async function showProducts() {
  //? достаем данные из бэк энда
  let products = await fetch(API).then((res) => res.json());

  //? очищаем div что бы туда положить новые данные
  //   productsList.innerHTML = "";

  //? перебираем массив для того что бы создать  div для карточки и поместить его в produtList то есть в родителя карточек
  productsList.innerHTML = "";
  products.forEach((product, id) => {
    let div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `<img src="${product.image}"/>
    <p>${product.description}</p>
    <div class="card-price">
    <p>${product.first_price}сом</p>
    <p>${product.second_price}сом</p></div>`;

    //! details
    div.addEventListener("click", () => {
      detailsInner.innerHTML = "";
      detailsParent.style.display = "flex";

      detailsInner.innerHTML = `<img src='${product.image}'/>
      <div class="details-text" id='details-text'>
      <p>${product.description}</p>
         <div class="card-price">
          <p>${product.first_price} som</p>
          <p>${product.second_price}som</p>
        </div>
      </div>
      `;
      //? Для кнопки удалить
      let detailsText = document.getElementById("details-text");
      let btnDelete = document.createElement("button");
      btnDelete.innerHTML = "Удалить продукт";

      btnDelete.addEventListener("click", (e) => deleteProduct(product.id, e));

      //! Создаем кнопку для редактирования внутри details
      let editBtn = document.createElement("button");
      editBtn.innerHTML = "Редактировать продукт";

      editBtn.addEventListener("click", (e) => {
        editModal.style.display = "flex";
        editModal.style.zIndex = "2";
        editProduct(product);
      });
      detailsText.append(btnDelete, editBtn);
    });

    //! edit

    productsList.append(div);
  });
}

//? вызываем эту функцию один раз в глобальной области видимости для того что бы при загрузки страницы сразу подгрузилис данные
showProducts();

//? Удаление с Бэк энда

async function deleteProduct(id, event) {
  event.stopPropagation();
  await fetch(`${API}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-type": "application/json; charset=utf-8",
    },
  });
  detailsParent.style.display = "none";
}

//! создаем новую функцию

function editProduct(product) {
  inpImageEdit.value = product.image;
  inpDescriptionEdit.value = product.description;
  inpFirstPriceEdit.value = product.first_price;
  inpSecondPriceEdit.value = product.second_price;

  editProductBtn.addEventListener("click", async () => {
    let newProduct = {
      image: inpImageEdit.value,
      description: inpDescriptionEdit.value,
      first_price: inpFirstPriceEdit.value,
      second_price: inpSecondPriceEdit.value,
    };
    await fetch(`${API}/${product.id}`, {
      method: "PATCH",
      body: JSON.stringify(newProduct),
      headers: {
        "Content-type": "application/json; charset=utf-8",
      },
    });
  });
}
