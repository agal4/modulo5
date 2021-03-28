
//Constantes
const EURO_SYMB = "\u20AC";
const DISCOUNT_MSG = "Aplicado descuento 5% por compra de más de 100";
const SHIPPING_COSTS_MSG = "Este pedido tiene gastos de envío";
const FREE_SHIPPING_COSTS_MSG = "Este pedido no tiene gastos de envío";
const PREMIUM_MSG = "Artículo premium";

var carrito = [
  {
    id: 198752,
    name: "Tinta DJ27 Color",
    price: 52.95,
    count: 3,
    premium: true,
  },
  {
    id: 75621,
    name: "Impresora ticketera PRO-201",
    price: 32.75,
    count: 2,
    premium: true,
  },
  {
    id: 54657,
    name: "Caja de rollos de papel para ticketera",
    price: 5.95,
    count: 3,
    premium: false,
  },
  {
    id: 3143,
    name: "Caja de folios DIN-A4 80gr",
    price: 9.95,
    count: 2,
    premium: false,
  },
];

var printPage = (cart) => {
    //Muestra el estado inicial del carrito
    printShoppingCart(cart);
    //Asocia el listener al checkbox para filtrar los articulos premium
    document.getElementById("premium-filter").addEventListener("change", applyPremiumFilter);
    //Aplica el descuento
    printDiscountMessage(cart);
    //Aplica gastos de envio
    printShippingMessage(cart);
    //Muestra el total de la compra
    printTotal(cart);
}

//Mostrar carrito compra
var printShoppingCart = (cart) => {
  for (article of cart) {
    //Primera version simple
    // for (const property in article) {
    //   const element = article[property];
    //   console.log(property + " : " + element);
    // }
    printArticle(article, cart.indexOf(article));
  }
};

//Elimina todo los articulos del html
var clearShoppingCart = () => {
    var shoppingBody = document.getElementById("shopping-body");
    if (shoppingBody.hasChildNodes) {
        shoppingBody.innerHTML = "";
    }
}

//Construye el html para cada articulo
var printArticle = (article, articleIndex) => {
    var shoppingBody = document.getElementById("shopping-body");
    //Contenedor general del articulo
    var newArticle = document.createElement("div");
    newArticle.className = "item-info-container";
    newArticle.id = "item-info-container-"+articleIndex;
    //Article ID
    var itemIdContainer = createNewArticleElement("item-id-container","item-id",article.id);
    newArticle.appendChild(itemIdContainer);
    //Article name
    var itemEntryContainer = createNewArticleElement ("item-entry-container","item-name",article.name);
    if (article.premium){
        var premiumSpan = document.createElement("span");
        premiumSpan.className = "item-premium";
        premiumSpan.textContent = PREMIUM_MSG;
        itemEntryContainer.appendChild(premiumSpan)
    }
    newArticle.appendChild(itemEntryContainer);
    //Article Quantity
    var itemQuantityContainer = createNewArticleElement("item-quantity-container","",article.count);
    newArticle.appendChild(itemQuantityContainer);
    //Article price
    var itemValueContainer = createNewArticleElement("item-value-container","",article.price);
    var euroSpan = document.createElement("span");
    euroSpan.textContent = EURO_SYMB;
    itemValueContainer.firstElementChild.appendChild(euroSpan);
    newArticle.appendChild(itemValueContainer);
    //Delete button
    var buttonContainer = addButtonToArticleElement(article.id, articleIndex);
    newArticle.appendChild(buttonContainer);

    shoppingBody.appendChild(newArticle);
};

//Construye sub estructura html para cada propiedad del articulo
var createNewArticleElement = (containerClassName,spanClass,spanContent) => {
    var divContainer = document.createElement("div");
    divContainer.className = containerClassName;
    var innerSpan = document.createElement("span");
    innerSpan.className = spanClass;
    innerSpan.textContent = spanContent;
    divContainer.appendChild(innerSpan);
    return divContainer;
};

//Crea un boton por articulo y asocia el listener para ejecutar deleteProductById
var addButtonToArticleElement = (articleId,articleIndex) => {
    var divContainer = document.createElement("div");
    divContainer.className = "item-delete-container";

    var buttonElement = document.createElement("button");
    buttonElement.id = "item-delete-"+articleIndex;
    buttonElement.setAttribute("art-id",articleId);
    buttonElement.textContent = "Eliminar";

    buttonElement.addEventListener("click", deleteProductById);
    divContainer.appendChild(buttonElement);
    return divContainer;
};

//Eliminar producto con id=54657 del carrito
var deleteProductById = event => {
    var articleId = event.target.getAttribute("art-id");
    for (article of carrito) {
          if (article.id === Number(articleId)){
            carrito.splice(carrito.indexOf(article),1);
            console.log("El artículo " + article.name + " con ID " + article.id + " ha sido eliminado");
          }
    }
    clearShoppingCart();
    printPage(carrito);
};

//Muestra solo los articulos marcados como premium
var applyPremiumFilter = event => {
    if (event.target.checked) {
        clearShoppingCart();
        var filteredCart = listOfPremiumProducts(carrito);
        printPage(filteredCart);
    } else {
        clearShoppingCart();
        printPage(carrito);
    }
}

//Filtrar por 'premium'
var listOfPremiumProducts = (cart) => {
    var premiumList = new Array();
    for (article of cart) {
        if(article.premium){
            premiumList.push(article);
        }
    }
    return premiumList;
};

//Muestra si se ha aplicado el descuento o no en funcion del carrito actual
var printDiscountMessage = (cart) => {
    var discountMessageDiv = document.getElementById("discount-msg"); 
    if (getTotal(cart) > 100) {
        discountMessageDiv.innerHTML = DISCOUNT_MSG + EURO_SYMB;
    } else {
        discountMessageDiv.innerHTML = "";
    }
}

//Calcular total carrito
var getTotal = (cart) => {
    var total = 0;
    for (article of cart) {
        total += article.price*article.count;
    }
    return total;
};

//Aplicar 5% descuento si el total es más de 100 euros
var applyDiscount = (cart) => {
    var total = getTotal(cart);
    if (total > 100){
        return total - total*0.05;
    } else {
        return total;
    }
};

//Muestra si hay que pagar gastos de envio o no en funcion del carrito actual
var printShippingMessage = (cart) => {
    var shippingMessageDiv = document.getElementById("shipping-msg"); 
    if (hasShippingCosts(cart)){
        shippingMessageDiv.innerHTML = SHIPPING_COSTS_MSG;
    } else {
        shippingMessageDiv.innerHTML = FREE_SHIPPING_COSTS_MSG;
    }
}

//Si todos los envios son premium, mostrar 'Pedido sin gastos de envio'
var hasShippingCosts = (cart) => {
    var premiumList = listOfPremiumProducts(cart);
    var hasShippingCosts = false;
    if (cart.length === premiumList.length){
        for (var i=0; i<cart.length; i++){
            if (cart[i].id != premiumList[i].id){
                hasShippingCosts = true;
            } 
        }
    } else {
        hasShippingCosts = true;
    }
    return hasShippingCosts;
};

//Muestra precio actual
var printTotal = (cart) => {
    var total = applyDiscount(cart);
    document.getElementById("total-price").innerHTML = total.toFixed(2) + EURO_SYMB;
}

//Llamada inicial
printPage(carrito);
