// Inicializamos el carrito de compras como un objeto vacío
let cartProducts = {}

// Intentamos obtener los datos del carrito de localStorage
let cartProductsLS = localStorage.getItem("cartProducts")

// Si hay datos en localStorage, los parseamos y los asignamos a cartProducts
// Si no hay datos, cartProducts permanecerá como un objeto vacío
if (cartProductsLS) {
    cartProducts = JSON.parse(cartProductsLS)
} else {
    cartProducts = {}
}

// Obtenemos el contenedor de productos
let empanada = document.getElementById("empanada-container")

// Cuando la página se carga, ejecutamos la siguiente función
window.onload = function () {
    // Cargamos los datos del carrito al cargar la página
    loadCartOnPageLoad();

    // Obtenemos los datos de los productos desde un archivo JSON
    fetch("../db/data2.json")
        .then(response => response.json())
        .then(data => {
            // Para cada producto, creamos una tarjeta de producto
            data.forEach(product => {
                const card = document.createElement("div")
                card.innerHTML = `<div class="max-w-full rounded overflow-hidden shadow-lg mt-11 pt-4 flex-container flex flex-col md:flex-row items-center justify-center">
                <img class="w-full h-auto md:w-1/2" src="${product.img}" alt="Pizza" style="image-rendering: auto;">
            
                <div class="px-6 py-4 flex flex-col justify-between items-center md:flex-row">
                    <div class="font-bold text-4xl mb-2">${product.name}</div>
                    <p class="text-yellow-400 font-bold text-4xl p-4 pr-2">$${product.price}</p>
                </div>
            
                <div class="px-6 pt-4 pb-2">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto productoAgregar" id=${product.id}>Agregar</button>
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto productoEliminar" id=${product.id}>Eliminar</button>
                    <p id="count-${product.id}" class="hidden bg-yellow-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto">${cartProducts[product.id] || 0}</p>
                </div>
            </div>`

                // Agregamos la tarjeta de producto al contenedor de productos
                empanada.appendChild(card)

                // Actualizamos el contador en la página con el valor de localStorage
                let countElement = document.getElementById(`count-${product.id}`);
                if (cartProducts[product.id]) {
                    countElement.innerText = cartProducts[product.id];
                    countElement.classList.remove('hidden');
                }
            });

            // Agregamos funcionalidad a los botones de agregar y eliminar
            addToCartButton(data);
            removeFromCartButton(data);
        });
}

// Función para agregar funcionalidad al botón de agregar al carrito
function addToCartButton(products) {
    let addButton = document.querySelectorAll(".productoAgregar")
    addButton.forEach(button => {
        button.onclick = (e) => {
            const productId = Number(e.currentTarget.id)
            const selectedProduct = products.find(product => product.id === productId)
            if (cartProducts[productId]) {
                cartProducts[productId]++
            } else {
                cartProducts[productId] = 1
            }
            console.log(cartProducts)

            // Guardamos los datos del carrito en localStorage
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts))

            // Actualizamos el contador en la página
            let countElement = document.getElementById(`count-${productId}`)
            countElement.innerText = cartProducts[productId]
            countElement.classList.remove('hidden')
        }
    })
}

// Función para agregar funcionalidad al botón de eliminar del carrito
function removeFromCartButton(products) {
    let removeButton = document.querySelectorAll(".productoEliminar")
    removeButton.forEach(button => {
        button.onclick = (e) => {
            const productId = Number(e.currentTarget.id)
            if (cartProducts[productId]) {
                cartProducts[productId]--
                if (cartProducts[productId] === 0) {
                    delete cartProducts[productId]
                }
            }
            console.log(cartProducts)

            // Guardamos los datos del carrito en localStorage
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts))

            // Actualizamos el contador en la página
            let countElement = document.getElementById(`count-${productId}`)
            countElement.innerText = cartProducts[productId] || 0
            if (cartProducts[productId] === undefined) {
                countElement.classList.add('hidden')
            }
        }
    })
}

// Función para cargar los datos del carrito al cargar la página
function loadCartOnPageLoad() {
    let cartProductsLS = localStorage.getItem("cartProducts")
    if (cartProductsLS) {
        cartProducts = JSON.parse(cartProductsLS)
    } else {
        cartProducts = {}
    }

    // Actualizamos el contador para cada producto en la página
    for (let productId in cartProducts) {
        let countElement = document.getElementById(`count-${productId}`)
        if (countElement) {
            countElement.innerText = cartProducts[productId]
            countElement.classList.remove('hidden')
        }
    }
}
