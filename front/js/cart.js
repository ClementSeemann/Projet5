const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const id = urlParams.get("id");
if (id !=null){
    let itemPrice = 0;
    let imgUrl, altText, articleName;
};

const cart = [];
retrieveItemsFromStorage();

function retrieveItemsFromStorage(){
    const numberOfItems = localStorage.length;
    for (let i = 0; i< numberOfItems; i++){
        const item = localStorage.getItem(localStorage.key(i)) || "";
        const itemObject = JSON.parse(item);
        displayItem(item);
        return;
    };
};


function displayItem(item){
    fetch(`http://localhost:3000/api/products/${id}`)
    .then((response) => response.json())
    .then((res) => makeCartContent(res))
    
    

    const article = makeArticle(item);
    const imageDiv = makeImageDiv(item);
    article.appendChild(imageDiv);
    const cardItemContent = makeCartContent(item);
    article.appendChild(cardItemContent);
    displayArticle(article);
    displayTotalPrice();
    displayTotalQuantity();
};


function makeCartContent(item){
    const cardItemContent = document.createElement("div");
    cardItemContent.classList.add("cart__item__content");

    const description = makeDescription(item);
    const settings = makeSettings(item);

    cardItemContent.appendChild(description);
    cardItemContent.appendChild(settings);
    return cardItemContent;
};

function makeDescription(item){
    const description = document.createElement("div");
    description.classList.add("cart__item__content__description");
    
    const h2 = document.createElement("h2");
    h2.textContent = item.name;
    const p = document.createElement("p");
    p.textContent = item.color;
    const p2 = document.createElement("p");
    p2.textContent = item.price + "€";
    description.appendChild(h2);
    description.appendChild(p);
    description.appendChild(p2);
    return description;
};

function makeSettings(item){
    const settings = document.createElement("div");
    settings.classList.add("cart__item__content__settings");

    addQuantityToSettings(settings, item);
    addDeleteToSettings(settings, item);
    return settings;
};

function displayArticle(article){
    document.querySelector("#cart__items").appendChild(article);
};

function makeArticle(item){
    const article = document.createElement("article");
    article.classList.add("card__item");
    article.dataset.id = item.id;
    article.dataset.color = item.color;
    return article;
};

function makeImageDiv(item){
    const div = document.createElement("div");
    div.classList.add("cart__item__img");
    const image = document.createElement("img");
    image.src = item.imageUrl;
    image.alt = item.altTxt;
    div.appendChild(image);
    console.log(item);
    return div;
};

function addQuantityToSettings(settings, item){
    const quantity = document.createElement("div");
    quantity.classList.add("cart__item__content__settings__quantity");
    const p = document.createElement("p");
    p.textContent = "Qté : ";
    quantity.appendChild(p);
    const input = document.createElement("input");
    input.type = "number";
    input.classList.add("itemQuantity");
    input.name = "itemQuantity";
    input.min = "1";
    input.max = "100";
    input.value = item.quantity;
    input.addEventListener("input", () => updatePriceQuantity(item.id, input.value, item));

    quantity.appendChild(input);
    settings.appendChild(quantity);
};

function addDeleteToSettings(settings, item){
    const div = document.createElement("div");
    div.classList.add("cart__item__content__settings__delete");
    div.addEventListener("click", () => deleteItem(item));

    const p = document.createElement("p");
    p.textContent = "Supprimer";
    div.appendChild(p);
    settings.appendChild(div);
};

function deleteItem(item){
    const itemToDelete = cart.findIndex((product) => product.id === item.id && product.color === item.color);
    cart.splice(itemToDelete, 1);
    displayTotalPrice();
    displayTotalQuantity();
    deleteDataFromCache(item);
    deleteArticleFromPage(item);
};

function displayTotalPrice(){
    const totalPrice = document.querySelector("#totalPrice");
    const total = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    totalPrice.textContent = total;
};

function displayTotalQuantity(){
    const totalQuantity = document.querySelector("#totalQuantity");
    const total = cart.reduce((total, item) => total + item.quantity, 0);
    totalQuantity.textContent = total;
};

function updatePriceQuantity(id, newValue, item){
    const itemUpdate = cart.find(item => item.id === id);
    itemUpdate.quantity = Number(newValue);
    item.quantity = itemUpdate.quantity;
    displayTotalQuantity();
    displayTotalPrice();
    saveNewDataToCache(item);
};

function deleteDataFromCache(item){
    const key = `${item.id}-${item.color}`;
    localStorage.removeItem(key);
};

function saveNewDataToCache(item){
    const dataToSave = JSON.stringify(item);
    const key = `${item.id}-${item.color}`;
    localStorage.setItem(key, dataToSave);
};

function deleteArticleFromPage(item){
    const articleToDelete = document.querySelector(
        `article[data-id="${item.id}"][data-color="${item.color}"]`
    );
    articleToDelete.remove();
};