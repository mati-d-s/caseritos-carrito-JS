// Inicializamos un objeto vacío para almacenar los productos del carrito
let cartProducts = {}

// Función para cargar el carrito cuando se carga la página
function loadCartOnPageLoad() {
    // Obtenemos los productos del carrito desde el almacenamiento local
    let cartProductsLS = localStorage.getItem("cartProducts")
    // Si hay productos en el almacenamiento local, los parseamos al objeto cartProducts
    if (cartProductsLS) {
        cartProducts = JSON.parse(cartProductsLS)
    } else {
        // Si no hay productos en el almacenamiento local, inicializamos un objeto vacío
        cartProducts = {}
    }

    // Para cada producto en el carrito, actualizamos el contador en la página
    for (let productId in cartProducts) {
        let countElement = document.getElementById(`count-${productId}`)
        if (countElement) {
            countElement.innerText = cartProducts[productId]
            countElement.classList.remove('hidden')
        }
    }
}

// Cargamos el carrito cuando se carga la página
loadCartOnPageLoad();

// Obtenemos el contenedor de las pizzas
let pizza = document.getElementById("pizza-container")

// Cuando se carga la ventana, hacemos una petición a la base de datos
window.onload = function() {
    fetch("../db/data1.json")
        .then(response => response.json())
        .then(data => {
            // Para cada producto en la base de datos, creamos una tarjeta
            data.forEach(product => {
                const card = document.createElement("div")
                card.innerHTML = `<div class="max-w-full rounded overflow-hidden shadow-lg mt-11 pt-4 flex-container flex flex-col md:flex-row items-center justify-center">
                <img class="w-full h-auto md:w-1/2" src="${product.img}" alt="Pizza" style="image-rendering: auto;">
            
                <div class="px-6 py-4 flex flex-col justify-between items-center md:flex-row">
                    <div class="font-bold text-4xl mb-2">${product.name}</div>
                    <p class="text-yellow-400 font-bold text-4xl p-4 pr-2">$${product.price}</p>
                </div>
            
                <div class="px-6 pt-4 pb-2 transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110">
                    <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto productoAgregar transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110" id=${product.id}>Agregar</button>
                    <button class="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto productoEliminar transition duration-500 ease-in-out transform hover:-translate-y-1 hover:scale-110" id=${product.id}>Eliminar</button>
                    <p id="count-${product.id}" class="hidden bg-yellow-400 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto">${cartProducts[product.id] || 0}</p>
                </div>
            </div>`

                // Agregamos la tarjeta al contenedor de las pizzas
                pizza.appendChild(card)
                let countElement = document.getElementById(`count-${product.id}`);
                if (cartProducts[product.id]) {
                    countElement.innerText = cartProducts[product.id];
                    countElement.classList.remove('hidden');
                }
            });
            // Agregamos los eventos a los botones de agregar y eliminar del carrito
            addToCartButton(data);
            removeFromCartButton(data);
        });
}

// Función para agregar eventos a los botones de agregar al carrito
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

            // Guardamos los productos del carrito en el almacenamiento local
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts))

            let countElement = document.getElementById(`count-${productId}`)
            countElement.innerText = cartProducts[productId]
            countElement.classList.remove('hidden')
        }
    })
}

// Función para agregar eventos a los botones de eliminar del carrito
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

            // Guardamos los productos del carrito en el almacenamiento local
            localStorage.setItem("cartProducts", JSON.stringify(cartProducts))

            let countElement = document.getElementById(`count-${productId}`)
            countElement.innerText = cartProducts[productId] || 0
            if (cartProducts[productId] === undefined) {
                countElement.classList.add('hidden')
            }
        }
    })
}
