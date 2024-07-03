const menu = document.getElementById("menu");
const cartBtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkout = document.getElementById("checkout-bnt");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("card-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = []

// Abrir modal do carrinho
cartBtn.addEventListener("click", () => {
    updateCartModal();
    cartModal.style.display = "flex"
});

// fechar quando clicar fora do modal
cartModal.addEventListener("click",(event) => {
    if(event.target === cartModal) {
        cartModal.style.display = "none"
    }
});

closeModalBtn.addEventListener("click", () => {
     cartModal.style.display = "none"
});

menu.addEventListener("click", (event) => {
    // console.log(event.target)
    let parentButton = event.target.closest(".add-to-card-btn")
    if(parentButton) {
        const name = parentButton.getAttribute("data-name")
        const price = parseFloat(parentButton.getAttribute("data-price"))

        // Adicionar ao carrinho
        addToCart(name, price)
    }
})

// função adicionar ao carrinho

const addToCart = (name,price) => {
    const existItem = cart.find(item => item.name === name)

    if(existItem) {
        // se o item existir só aumenta a quantidade +1
        existItem.quantity += 1;
    }else{
        cart.push({
            name,
            price,
            quantity: 1,
        })
    }

    
    updateCartModal();
}

//Atualiza carrinho

const updateCartModal = () => {
    cartItemsContainer.innerHTML = ""
    let total = 0;

    cart.forEach(item => {
        const cartItemsElement = document.createElement("div");
        cartItemsElement.classList.add("flex", "justify-between", "mb-4", "flex-col")

        cartItemsElement.innerHTML = `
        <div class = "flex items-center justify-between">
            <div>
                <p class = "text-bold">${item.name}</p>
                <p>Qtd: ${item.quantity}</p>
                <p class = "font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
            </div>

                <button class = "removeBtn" data-name = "${item.name}">
                    Remover
                </button>
            
        </div>
        `

        total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemsElement)
    })

    cartTotal.textContent = total.toLocaleString("pt-BR",{
        style: "currency",
        currency: "BRL"
    });

    cartCounter.innerHTML = cart.length;
}

// função remover item do carrinho

cartItemsContainer.addEventListener("click", (event) => {
    if(event.target.classList.contains("removeBtn")) {
        const name = event.target.getAttribute("data-name")

        removeItemCart(name)
    }
})

const removeItemCart = (name) => {
    const index = cart.findIndex(item => item.name === name);
    if(index !== -1) {
        const item = cart[index];

        if(item.quantity > 1) {
            item.quantity -= 1;
            updateCartModal();
            return;
        }

        cart.splice(index, 1);
        updateCartModal();
    }
}

addressInput.addEventListener("input", (event) => {
    let inputValue = event.target.value;
    if(inputValue !== "") {
        addressInput.classList.remove("border-red-500")
        addressWarn.classList.add("hidden")
    }
    // 
})

// finalizar carrinho

checkout.addEventListener("click", () => {
    const isOpen = checkRestaurantOpen();
    if(!isOpen) {
        
        Toastify({
            text: "Ops o restaurante está fechado",
            duration: 3000,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "#ef4444",
            },
        }).showToast();

        return;
    }

    if(cart.length === 0) return;

    if(addressInput.value === "") {
        addressWarn.classList.remove("hidden")
        addressInput.classList.add("border-red-500")
        return;
    }

    //enviar pedido para o API whatsapp

    const cartItems = cart.map((item) => {
        return (
            `${item.name} Quantidade: (${item.quantity}) Preço: R$${item.price} |`
        )
    }).join("")

    const message = encodeURIComponent(cartItems)
    const phone = "11967306594"

    window.open(`https://wa.me/${phone}?text=${message} Endereço: ${addressInput.value}`, "_blank");

    cart.length = 0;
    updateCartModal();
})

// função verificar se o estabelecimento está aberto

const checkRestaurantOpen = () => {
        const data = new Date();
        const hora = data.getHours();
        return hora >= 18 && hora < 23; //true restaurante aberto
}

const spanItem = document.getElementById("date-span")
const isOpen = checkRestaurantOpen();

if(isOpen) {
    spanItem.classList.remove("bg-red-500")
    spanItem.classList.add("bg-green-600")
}else{
    spanItem.classList.remove("bg-green-600")
    spanItem.classList.add("bg-red-500")
}