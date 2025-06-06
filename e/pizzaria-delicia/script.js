// Variáveis globais
let cart = [];
let totalPrice = 0;
const clearCartBtn = document.getElementById("clear-cart");
const sendOrderBtn = document.getElementById("send-order");
const pizzas = document.getElementById("pizzas");
const pizzasEsp = document.getElementById("pizzas-esp");
const bebidas = document.getElementById("bebidas");
const sobremesas = document.getElementById("sobremesas");
const sabor1 = document.getElementById("half1");
const sabor2 = document.getElementById("half2");

// Gerenciamento de navegação e modais
document.addEventListener("DOMContentLoaded", function () {
  // Elementos
  const pages = document.querySelectorAll(".app-page");
  const modals = document.querySelectorAll(".modal");
  const buttons = document.querySelectorAll("[data-action]");

  // Inicializar modais como ocultos
  modals.forEach((modal) => {
    modal.style.display = "none";
  });

  // Função para abrir página
  function openPage(pageId) {
    // Esconder todas as páginas
    pages.forEach((page) => {
      page.classList.remove("active");
    });

    // Mostrar a página selecionada
    const targetPage = document.getElementById(pageId);
    if (targetPage) {
      targetPage.classList.add("active");
      targetPage.classList.add("slide-in-right");

      // Remover classe de animação após conclusão
      setTimeout(() => {
        targetPage.classList.remove("slide-in-right");
      }, 300);
    }
  }

  // Função para voltar à página inicial
  function goHome() {
    // Esconder todas as páginas exceto a home
    pages.forEach((page) => {
      if (page.id !== "homePage") {
        page.classList.add("slide-out-right");

        setTimeout(() => {
          page.classList.remove("active");
          page.classList.remove("slide-out-right");
        }, 300);
      }
    });

    // Mostrar a página inicial
    const homePage = document.getElementById("homePage");
    if (homePage) {
      setTimeout(() => {
        homePage.classList.add("active");
      }, 300);
    }
  }

  // Função para abrir modal
  function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "flex";

      // Forçar reflow
      modal.offsetHeight;

      // Adicionar classe para animação
      setTimeout(() => {
        modal.classList.add("active");

        // Animar conteúdo do modal
        const modalContent = modal.querySelector(".modal-content");
        if (modalContent) {
          modalContent.classList.add("slide-up");
        }
      }, 10);
    }
  }

  // Função para fechar modal
  function closeModal(modalId) {
    const modal = document.getElementById(modalId || "carrinhoModal");
    if (modal) {
      modal.classList.remove("active");

      // Animar saída
      const modalContent = modal.querySelector(".modal-content");
      if (modalContent) {
        modalContent.classList.remove("slide-up");
        modalContent.classList.add("slide-down");
      }

      setTimeout(() => {
        modal.style.display = "none";
        if (modalContent) {
          modalContent.classList.remove("slide-down");
        }
      }, 300);
    }
  }

  // Configurar botões com base em data-action
  buttons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const action = this.getAttribute("data-action");
      const target = this.getAttribute("data-target");

      switch (action) {
        case "openPage":
          openPage(target);
          break;
        case "goHome":
          goHome();
          break;
        case "goWhatsapp":
          goToWhatsapp();
          break;
        case "openModal":
          openModal(target);
          break;
        case "closeModal":
          closeModal(target);
          break;
        case "successDone":
          closeModal("successModal");
          setTimeout(() => {
            goHome();
          }, 300);
          break;
        case "yesOption":
          closeModal("confirmModal");
          cart = [];
          totalPrice = 0;
          updateCartDisplay();
          break;
        case "noOption":
          closeModal("confirmModal");
          break;
        case "infoDone":
          closeModal("infoModal");
          break;
      }
    });
  });

  //Mostrar produtos do cardápio
  produtos.forEach((p) => {
    const prod = document.createElement("div");

    prod.innerHTML = showProduct(
      p.id,
      p.name,
      p.description,
      p.price,
      p.type,
      p.img
    );
    switch (p.type) {
      case "pizza":
        pizzas.appendChild(prod);
        sabor1.options[sabor1.options.length] = new Option(
          `${p.name} - R$ ${p.price}`,
          `${p.id}`
        );
        sabor2.options[sabor2.options.length] = new Option(
          `${p.name} - R$ ${p.price}`,
          `${p.id}`
        );
        break;
      case "bebida":
        bebidas.appendChild(prod);
        break;
      case "sobremesa":
        sobremesas.appendChild(prod);
        break;
    }
  });

  function showProduct(id, name, description, price, type, image) {
    let product = `
                <div class="product-card">
                <div class="product-card-content">
                  <div class="product-image">
                    <img src="img/${image}" alt="" />
                  </div>
                  <div class="product-info">
                    <h3 class="product-title">${name}</h3>
                    <p class="product-description">
                      ${description}
                    </p>
                  </div>
                </div>
                <div class="product-card-footer">
                  <div class="product-price">
                    <span>Preço: R$ ${price},00</span>
                  </div>
                  <button
                    class="btn-add-cart"
                    data-id="${id}"
                    data-name="${name}"
                    data-price="${price}"
                    data-type="${type}"
                   
                  >
                    <i class="fas fa-plus"></i> Adicionar
                  </button>
                </div>
              </div>
            `;
    return product;
  }

  function showHalf(id, name, price) {
    return `
      <option value="${id}">
        ${name} - R$ ${price}
      </option>`;
  }

  // Efeito de toque em botões (estilo app)
  const allButtons = document.querySelectorAll("button");
  allButtons.forEach((button) => {
    button.addEventListener("touchstart", function () {
      this.style.opacity = "0.8";
    });

    button.addEventListener("touchend", function () {
      this.style.opacity = "1";
    });
  });

  // Botão de adicionar ao carrinho
  document.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", function () {
      const id = this.getAttribute("data-id");
      const name = this.getAttribute("data-name");
      const price = parseFloat(this.getAttribute("data-price"));
      const type = this.getAttribute("data-type");

      addToCart(id, name, price, type);

      // Feedback visual
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> Adicionado';
      this.disabled = true;

      openModal("toastModal");
      setTimeout(() => {
        closeModal("toastModal");
      }, 1000);

      setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
      }, 1700);
    });
  });

  // Botão de pizza meio a meio
  const halfPizzaBtn = document.getElementById("add-half-pizza");
  if (halfPizzaBtn) {
    halfPizzaBtn.addEventListener("click", function () {
      const half1Select = document.getElementById("half1");
      const half2Select = document.getElementById("half2");

      const half1Value = half1Select.value;
      const half2Value = half2Select.value;

      if (!half1Value || !half2Value) {
        document.getElementById("info-message").innerText =
          "Por favor, selecione os dois sabores para a pizza meio a meio.";
        openModal("infoModal");
        return;
      }

      // Obter nomes e preços dos sabores selecionados
      const half1Text = half1Select.options[half1Select.selectedIndex].text;
      const half2Text = half2Select.options[half2Select.selectedIndex].text;

      const half1Name = half1Text.split(" - ")[0];
      const half2Name = half2Text.split(" - ")[0];

      const half1Price = parseFloat(half1Text.split("R$ ")[1]);
      const half2Price = parseFloat(half2Text.split("R$ ")[1]);

      // Calcular preço (maior dos dois)
      const price = Math.max(half1Price, half2Price);

      // Adicionar ao carrinho
      addToCart(
        `half_${half1Value}_${half2Value}`,
        `Meio a Meio: ${half1Name} / ${half2Name}`,
        price,
        "pizza"
      );

      // Resetar seleções
      half1Select.value = "";
      half2Select.value = "";

      // Feedback visual
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> Adicionado';
      this.disabled = true;

      openModal("toastModal");
      setTimeout(() => {
        closeModal("toastModal");
      }, 1000);

      setTimeout(() => {
        this.innerHTML = originalText;
        this.disabled = false;
      }, 1500);
    });
  }

  // Adicionar item ao carrinho
  function addToCart(id, name, price, type) {
    // Verificar se o item já existe no carrinho
    const existingItemIndex = cart.findIndex((item) => item.id === id);

    if (existingItemIndex !== -1) {
      // Incrementar quantidade
      cart[existingItemIndex].quantity += 1;
    } else {
      // Adicionar novo item
      if (id && name && price && type) {
        cart.push({
          id: id,
          name: name,
          price: price,
          type: type,
          quantity: 1,
        });
      }
    }

    // Atualizar exibição do carrinho
    updateCartDisplay();
  }

  // Remover item do carrinho
  function removeFromCart(id) {
    cart = cart.filter((item) => item.id !== id);
    updateCartDisplay();
  }

  // Atualizar quantidade de um item
  function updateItemQuantity(id, quantity) {
    const itemIndex = cart.findIndex((item) => item.id === id);

    if (itemIndex !== -1) {
      if (quantity <= 0) {
        // Remover item se quantidade for zero ou negativa
        removeFromCart(id);
      } else {
        // Atualizar quantidade
        cart[itemIndex].quantity = quantity;
        updateCartDisplay();
      }
    }
  }

  // Atualizar exibição do carrinho
  function updateCartDisplay() {
    // Atualizar contador de itens
    const cartCount = document.getElementById("cart-count");
    if (cartCount) {
      const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
      cartCount.textContent = totalItems;
    }

    // Atualizar lista de itens
    const cartItemsContainer = document.getElementById("cart-items");
    if (cartItemsContainer) {
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
                <div class="empty-cart-message">
                    <p style="text-align: center; padding: 20px;">Seu carrinho está vazio</p>
                </div>
            `;
      } else {
        let cartHTML = "";

        cart.forEach((item) => {
          const itemTotal = item.price * item.quantity;

          cartHTML += `
                    <div class="cart-item">
                      <button class="remove-item" data-id="${item.id}">
                        <i class="fas fa-times"></i>
                      </button>
                      <div class="cart-content">
                        <h3>${item.name}</h3>
                      </div>
                      <div
                        style="
                          display: flex;
                          justify-content: space-between;
                          align-items: center;
                        "
                      >
                        <div class="quantity-items">
                          <button class="quantity-btn minus" data-id="${
                            item.id
                          }">-</button>
                          <span>${item.quantity}</span>
                          <button class="quantity-btn plus" data-id="${
                            item.id
                          }">+</button>
                        </div>
                        <div>
                          <span>R$ ${itemTotal.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                `;
        });

        cartItemsContainer.innerHTML = cartHTML;

        // Adicionar event listeners para botões de remover e quantidade
        document.querySelectorAll(".remove-item").forEach((btn) => {
          btn.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            removeFromCart(id);
          });
        });

        document.querySelectorAll(".quantity-btn.minus").forEach((btn) => {
          btn.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const item = cart.find((item) => item.id === id);
            if (item) {
              updateItemQuantity(id, item.quantity - 1);
            }
          });
        });

        document.querySelectorAll(".quantity-btn.plus").forEach((btn) => {
          btn.addEventListener("click", function () {
            const id = this.getAttribute("data-id");
            const item = cart.find((item) => item.id === id);
            if (item) {
              updateItemQuantity(id, item.quantity + 1);
            }
          });
        });
      }
    }

    // Atualizar total
    updateCartTotal();
  }

  // Atualizar total do carrinho
  function updateCartTotal() {
    totalPrice = cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );

    const subtotalElement = document.getElementById("cart-subtotal");
    const totalElement = document.getElementById("cart-total");

    if (subtotalElement) {
      subtotalElement.textContent = `R$ ${totalPrice.toFixed(2)}`;
    }

    if (totalElement) {
      totalElement.textContent = `R$ ${totalPrice.toFixed(2)}`;
    }
  }

  // Formatar pedido para WhatsApp
  function formatOrderForWhatsApp(notes, address) {
    let message = "*🍕 PEDIDO PIZZARIA DELÍCIA 🍕*\n\n";

    message += "*ITENS DO PEDIDO:*\n";

    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      message += `• ${item.quantity}x ${item.name} - R$ ${itemTotal.toFixed(
        2
      )}\n`;
    });

    message += `\n*TOTAL: R$ ${totalPrice.toFixed(2)}*\n\n`;

    if (notes && notes.trim() !== "") {
      message += `*OBSERVAÇÕES:*\n${notes}\n\n`;
    }

    if (address && address.trim() !== "") {
      message += `*ENDEREÇO PARA ENTREGA:*\n${address}\n\n`;
    }

    message += "Confirme meu pedido, por favor! 😋";

    return message;
  }

  //Limpar Carrinho
  clearCartBtn.addEventListener("click", function () {
    openModal("confirmModal");
  });

  //Enviar pedido
  sendOrderBtn.addEventListener("click", function () {
    if (cart.length === 0) {
      document.getElementById("info-message").innerText =
        "Seu carrinho está vazio. Adicione itens antes de enviar o pedido.";
      openModal("infoModal");
      return;
    }

    // Construir mensagem para WhatsApp
    const orderNotes = document.getElementById("order-notes").value;
    const address = document.getElementById("address").value;
    const message = formatOrderForWhatsApp(orderNotes, address);

    const phoneNumber = "5585996380088";
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`;
    openModal("successModal");
    //window.open(whatsappUrl, "_blank");
  });

  //Fale com a gente
  function goToWhatsapp() {
    const text = "Olá gostaria de fazer um pedido";
    const whatsappUrl = `https://wa.me/5585996380088?text=${text}`;
    window.open(whatsappUrl, "_blank");
  }
});
