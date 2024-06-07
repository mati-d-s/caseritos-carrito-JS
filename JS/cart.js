let data = []; // Definimos un arreglo vacío llamado 'data' que usaremos más adelante.

// Esta función se ejecuta cuando la página se carga.
window.onload = async function () {
    try {
      // Obtenemos los datos de los archivos JSON y los almacenamos en 'data'.
      data = await fetchDataFromJSON();
      // Cargamos los productos que están en el carrito en la página.
      await loadCartOnPageLoad(data);
      // Mostramos el costo total en la página.
      displayTotalCost();
    } catch (error) {
      // Si hay algún error, lo mostramos en la consola.
      console.error("Error:", error);
    }
};

// Esta función obtiene los datos de los archivos JSON.
async function fetchDataFromJSON() {
    // Obtenemos los datos del primer archivo JSON.
    const response1 = await fetch("../db/data1.json");
    const data1 = await response1.json();
  
    // Obtenemos los datos del segundo archivo JSON.
    const response2 = await fetch("../db/data2.json");
    const data2 = await response2.json();
  
    // Combinamos los datos de ambos archivos en un solo arreglo y lo retornamos.
    return [...data1, ...data2];
}

// Esta función carga los productos que están en el carrito en la página.
async function loadCartOnPageLoad(data) {
    // Obtenemos los productos que están en el carrito del almacenamiento local.
    const cartProducts = getCartProductsFromLocalStorage();
    // Seleccionamos el contenedor donde se mostrarán los productos.
    const cartContainer = document.getElementById("cart-container");
  
    // Limpiamos el contenedor antes de agregar las tarjetas de los productos.
    cartContainer.innerHTML = "";
  
    // Para cada producto en 'data', si el producto está en el carrito, creamos una tarjeta para él.
    data.forEach(product => {
      if (cartProducts[product.id]) {
        createProductCard(product, cartProducts[product.id], cartContainer);
      }
    });
}

// Esta función crea una tarjeta para un producto y la agrega al contenedor.
function createProductCard(product, quantity, container) {
    // Creamos un nuevo elemento div para la tarjeta.
    const card = document.createElement("div");
    // Definimos el contenido HTML de la tarjeta.
    card.innerHTML = `
      <div class="max-w-full rounded overflow-hidden shadow-lg mt-11 pt-4 flex-container flex flex-col md:flex-row items-center justify-center">
        <img class="w-full h-auto md:w-1/2" src="${product.img}" alt="Producto" style="image-rendering: auto;">
        
        <div class="px-6 py-4 flex flex-col justify-between items-center md:flex-row">
          <div class="font-bold text-4xl mb-2">${product.name}</div>
          <p class="text-yellow-400 font-bold text-4xl p-4 pr-2">$${product.price}</p>
        </div>
        
        <div class="px-6 pt-4 pb-2">
          <button class="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded ml-auto productoAgregar" id=${product.id}>Agregar</button>
          <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto productoEliminar" id=${product.id}>Eliminar</button>
          <p id="count-${product.id}" class="bg-yellow-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto">${quantity}</p>
        </div>
      </div>
    `;
  
    // Agregamos la tarjeta al contenedor.
    container.appendChild(card);
  
    // Agregamos los event listeners para los botones de agregar y eliminar.
    const addButton = card.querySelector(".productoAgregar");
    addButton.addEventListener("click", () => {
      addToCart(product.id);
      displayTotalCost(); // Actualizamos el costo total cuando se agrega un producto.
    });
    
    const removeButton = card.querySelector(".productoEliminar");
    removeButton.addEventListener("click", () => {
      removeFromCart(product.id);
      displayTotalCost(); // Actualizamos el costo total cuando se elimina un producto.
    });
}

// Esta función disminuye la cantidad de un producto en el carrito o lo elimina si su cantidad es 1 o menos.
function removeFromCart(productId) {
    // Obtenemos los productos que están en el carrito del almacenamiento local.
    const cartProducts = getCartProductsFromLocalStorage();
  
    // Disminuimos la cantidad del producto en el carrito.
    if (cartProducts[productId] > 1) {
      cartProducts[productId]--;
    } else {
      // Si la cantidad es 1 o menos, eliminamos el producto del carrito.
      delete cartProducts[productId];
    }
  
    // Guardamos los productos del carrito en el almacenamiento local.
    saveCartProductsToLocalStorage(cartProducts);
  
    // Actualizamos la cantidad mostrada en la tarjeta del producto.
    const countElement = document.querySelector(`#count-${productId}`);
    countElement.textContent = cartProducts[productId] || 0;
  
    // Si el producto fue eliminado del carrito, también eliminamos su tarjeta.
    if (!cartProducts[productId]) {
      const card = document.querySelector(`#${productId}`);
      if (card) {
        card.parentNode.removeChild(card);
      }
    }
}

// Esta función obtiene los productos que están en el carrito del almacenamiento local.
function getCartProductsFromLocalStorage() {
    const cartProductsString = localStorage.getItem("cartProducts");
    return cartProductsString ? JSON.parse(cartProductsString) : {};
}

// Esta función guarda los productos del carrito en el almacenamiento local.
function saveCartProductsToLocalStorage(cartProducts) {
    localStorage.setItem("cartProducts", JSON.stringify(cartProducts));
}

// Esta función calcula el costo total de los productos en el carrito.
function calculateTotalCost() {
    const cartProducts = getCartProductsFromLocalStorage();
    let totalCost = 0;

    // Para cada producto en el carrito, sumamos su precio multiplicado por su cantidad al costo total.
    for (const productId in cartProducts) {
      const product = data.find(item => item.id == productId);
      if (product) {
        totalCost += product.price * cartProducts[productId];
      }
    }

    return totalCost;
}

// Esta función muestra el costo total en la página.
function displayTotalCost() {
    const totalCost = calculateTotalCost();
    const totalCostContainer = document.getElementById("total-cost-container");

    // Definimos el contenido HTML del contenedor del costo total.
    totalCostContainer.innerHTML = `
      <div class="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-md flex items-center space-x-4">
        <div>
          <div class="text-xl font-medium text-black">Total</div>
          <p class="text-gray-500">$${totalCost.toFixed(2)}</p>
        </div>
      </div>
    `;
}
