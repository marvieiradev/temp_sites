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
    const modal = document.getElementById(modalId || "agendarModal");
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
        case "openModal":
          openModal(target);
          break;
        case "closeModal":
          closeModal(target);
          break;
        case "successDone":
          // Fechar o modal de sucesso e voltar para a tela inicial
          closeModal("successModal");
          setTimeout(() => {
            goHome();
          }, 300);
          break;
      }
    });
  });

  // Simulação de agendamento
  document.getElementById("btnAgendar").addEventListener("click", function (e) {
    e.preventDefault();
    e.stopPropagation();

    const nome = document.getElementById("nome").value;
    const telefone = document.getElementById("telefone").value;
    const data = document.getElementById("data").value;
    const horario = document.getElementById("horario").value;
    const servico = document.getElementById("servico").value;

    // Verificar campos obrigatórios
    if (!nome || !telefone || !data || !horario || !servico) {
      // Feedback visual de erro
      this.classList.add("bg-red-500");
      this.innerHTML =
        '<i class="fas fa-exclamation-circle" style="margin-right: 8px;"></i> PREENCHA OS CAMPOS';

      setTimeout(() => {
        this.classList.remove("bg-red-500");
        this.innerHTML = "AGENDAR AGORA";
      }, 2000);

      return;
    }

    // Mostrar animação de processamento
    this.innerHTML =
      '<i class="fas fa-spinner fa-spin" style="margin-right: 8px;"></i> PROCESSANDO...';
    this.disabled = true;

    // Simular processamento
    setTimeout(() => {
      // Fechar modal atual
      closeModal("agendarModal");

      // Abrir modal de sucesso
      setTimeout(() => {
        openModal("successModal");

        // Resetar formulário
        document.getElementById("agendamentoForm").reset();

        // Restaurar botão
        this.innerHTML = "AGENDAR AGORA";
        this.disabled = false;
      }, 300);
    }, 1500);
  });

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
});
