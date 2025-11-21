// PEGANDO AS CONST
const menu = document.getElementById("menu");
const cartbtn = document.getElementById("cart-btn");
const cartModal = document.getElementById("cart-modal");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotal = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const closeModalBtn = document.getElementById("close-modal-btn");
const cartCounter = document.getElementById("cart-count");
const addressInput = document.getElementById("address");
const addressWarn = document.getElementById("address-warn");

let cart = [];

// ABRIR O MODAL DO CARRINHO
cartbtn.addEventListener("click", function () {
  updateCartModal();
  cartModal.style.display = "flex";
});

// FECHAR O MODAL QUANDO CLICAR FORA
cartModal.addEventListener("click", function (event) {
  if (event.target === cartModal) {
    cartModal.style.display = "none";
  }
});

// FECHAR QUANDO CLICAR NO BOTÃO "FECHAR"
closeModalBtn.addEventListener("click", function () {
  cartModal.style.display = "none";
});

// RECONHECER CLIQUE NOS BOTÕES "ADICIONAR AO CARRINHO"
menu.addEventListener("click", function (event) {
  let parentButton = event.target.closest(".add-to-card-btn");
  if (parentButton) {
    const name = parentButton.getAttribute("data-name");
    const price = parseFloat(parentButton.getAttribute("data-price"));
    addToCart(name, price);
  }
});

// FUNÇÃO PARA ADICIONAR AO CARRINHO
function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      name,
      price,
      quantity: 1,
    });
  }

  updateCartModal();
}

// ATUALIZAR O CARRINHO
function updateCartModal() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item) => {
    const cartItemElement = document.createElement("div");
    cartItemElement.classList.add("flex", "justify-between", "mb-4", "flex-col");

    cartItemElement.innerHTML = `
      <div class="flex items-center justify-between">
        <div>
          <p class="font-bold">${item.name}</p>
          <p>Qtd: ${item.quantity}</p>
          <p class="font-medium mt-2">R$ ${item.price.toFixed(2)}</p>
        </div>
        <div class="remove-from-cart-btn text-red-500 cursor-pointer" data-name="${item.name}">
          Remover
        </div>
      </div>
    `;

    total += item.price * item.quantity;
    cartItemsContainer.appendChild(cartItemElement);
  });

  cartTotal.textContent = total.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });

  cartCounter.textContent = cart.length;
}

// REMOVER ITEM DO CARRINHO
cartItemsContainer.addEventListener("click", function (event) {
  if (event.target.classList.contains("remove-from-cart-btn")) {
    const name = event.target.getAttribute("data-name");
    removerItemCart(name);
  }
});

function removerItemCart(name) {
  const index = cart.findIndex((item) => item.name === name);

  if (index !== -1) {
    const item = cart[index];
    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.splice(index, 1);
    }
    updateCartModal();
  }
}

// REMOVER AVISO DE ENDEREÇO AO DIGITAR
addressInput.addEventListener("input", function (event) {
  let inputValue = event.target.value;

  if (inputValue !== "") {
    addressInput.classList.remove("border-red-500");
    addressWarn.classList.add("hidden");
  }
});

// FINALIZAR PEDIDO (AJUSTADO ✅)
checkoutBtn.addEventListener("click", function () {
  const isOpen = checkRestaurantOpen();
  if (!isOpen) {
    Toastify({
      text: "RESTAURANTE ESTÁ FECHADO",
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      style: {
        background: "#ef4444",
      },
    }).showToast();
    return;
  }

  if (cart.length === 0) return;

  if (addressInput.value.trim() === "") {
    addressWarn.classList.remove("hidden");
    addressInput.classList.add("border-red-500");
    return;
  }

  // 🔹 MONTAR MENSAGEM DOS ITENS
  let mensagemItens = "";
  let total = 0;

  cart.forEach((item) => {
    const subtotal = item.price * item.quantity;
    total += subtotal;
    mensagemItens += `🍰 *${item.name}*\nQuantidade: ${item.quantity}\nPreço: R$${item.price.toFixed(
      2
    )}\nSubtotal: R$${subtotal.toFixed(2)}\n\n`;
  });

  // 🔹 TEXTO FINAL FORMATADO
  const mensagemFinal = `
 *Beco Doce Doceria - Pedido Online* \n
🛍 *NOVO PEDIDO RECEBIDO!*\n
${mensagemItens}
💰 *Total:* R$${total.toFixed(2)}\n
📍 *Endereço:* ${addressInput.value}
`;

  // 🔹 CODIFICAR TEXTO PARA URL
  const mensagemCodificada = encodeURIComponent(mensagemFinal);

  // 🔹 NÚMERO DO WHATSAPP (sem o +)
  const phone = "556292166269";

  // ✅ MELHORIA: tentar abrir direto no app
  const appUrl = `whatsapp://send?phone=${phone}&text=${mensagemCodificada}`;
  const webUrl = `https://wa.me/${phone}?text=${mensagemCodificada}`;

  // Tenta abrir o app, se falhar, cai pro navegador
  window.location.href = appUrl;
  setTimeout(() => {
    window.open(webUrl, "_blank");
  }, 1000);

  // 🔹 LIMPAR CARRINHO APÓS ENVIAR
  cart = [];
  updateCartModal();
});

// VERIFICAR HORÁRIO DE FUNCIONAMENTO
function checkRestaurantOpen() {
  const data = new Date();
  const hora = data.getHours();
  // ABERTO DAS 13H ÀS 23H59
  return hora >= 13 && hora < 24;
}

// MUDAR COR DO SPAN DE STATUS
const spanItem = document.getElementById("date-span");
const isOpen = checkRestaurantOpen();

if (isOpen) {
  spanItem.classList.remove("bg-red-500");
  spanItem.classList.add("bg-green-600");
} else {
  spanItem.classList.remove("bg-green-600");
  spanItem.classList.add("bg-red-500");
}
