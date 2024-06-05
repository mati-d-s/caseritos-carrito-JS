let cartProducts = {}
let cartProductsLS = localStorage.getItem("cartProducts")
if (cartProductsLS) {
    cartProducts = JSON.parse(cartProductsLS)
} else {
    cartProducts = {}
}

let empanada = document.getElementById("empanada-container")

fetch("../db/data2.json")
    .then(response => response.json())
    .then(data => {
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


            empanada.appendChild(card)
        });
        addToCartButton(data)
        removeFromCartButton(data)
    })

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

            localStorage.setItem("cartProducts", JSON.stringify(cartProducts))

            let countElement = document.getElementById(`count-${productId}`)
            countElement.innerText = cartProducts[productId]
            countElement.classList.remove('hidden')

            Toastify({
                text: "Product with ID " + productId + " added to cart. Total items in cart: " + Object.values(cartProducts).reduce((a, b) => a + b, 0),
                duration: 3000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top",
                position: "left",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function () { }
            }).showToast();
        }
    })
}

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

            localStorage.setItem("cartProducts", JSON.stringify(cartProducts))

            let countElement = document.getElementById(`count-${productId}`)
            countElement.innerText = cartProducts[productId] || 0
            if (cartProducts[productId] === undefined) {
                countElement.classList.add('hidden')
            }

            Toastify({
                text: "Product with ID " + productId + " removed from cart. Total items in cart: " + Object.values(cartProducts).reduce((a, b) => a + b, 0),
                duration: 3000,
                destination: "https://github.com/apvarun/toastify-js",
                newWindow: true,
                close: true,
                gravity: "top",
                position: "left",
                stopOnFocus: true,
                style: {
                    background: "linear-gradient(to right, #00b09b, #96c93d)",
                },
                onClick: function () { }
            }).showToast();
        }
    })
}
