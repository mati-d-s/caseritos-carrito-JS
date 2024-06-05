document.addEventListener('DOMContentLoaded', (event) => {
    let empanada = document.getElementById("empanada-container")

    fetch("../db/data2.json")
        .then(response => response.json())
        .then(data2 => {
            data2.forEach(product => {
                const card = document.createElement("div")
                card.innerHTML = `<div class="max-w-full rounded overflow-hidden shadow-lg mt-11 pt-4 flex-container flex flex-col md:flex-row items-center justify-center">
                <img class="w-full h-auto md:w-1/2" src="${product.img}" alt="Empanada" style="image-rendering: auto;">
            
                <div class="px-6 py-4 flex flex-col justify-between items-center md:flex-row">
                    <div class="font-bold text-4xl mb-2">${product.name}</div>
                    <p class="text-yellow-400 font-bold text-4xl p-4 pr-2">$${product.price}</p>
                </div>
            
                <div class="px-6 pt-4 pb-2">
                <button class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-auto" id=${product.id}>Agregar</button>
            </div>
        </div>`

                empanada.appendChild(card)
            });
        })
});
