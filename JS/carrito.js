function renderCarrito (cartItems){
    fetch("../db/data1.json")
        .then(response => response.json())
        .then(products => {
            for (let productId in cartItems) {
                const product = products.find(product => product.id === Number(productId));
                if (product) {
                    const cart = document.createElement("div")
                    cart.innerHTML = `<h3>${product.name}</h3>
                                      <p>${product.price}</p>
                                      <p>Quantity: ${cartItems[productId]}</p>`
                    cartContainer.appendChild(cart)
                }
            }
        });
}
