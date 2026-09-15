// === 2.4.6 DOM (Document Object Model) ===
// Capturando os elementos estruturais da tela
const DOM = {
  lista: document.getElementById("listaAlunos"),
  inputNome: document.getElementById("inputNome"),
  selectCurso: document.getElementById("selectCurso"),
  btnCadastrar: document.getElementById("btnCadastrar"),
  alerta: document.getElementById("alertaSistema"),
  metricaTotal: document.getElementById("metricaTotal"),
  relogio: document.getElementById("relogioSistema"),
};

// Estado Centralizado
const estadoApp = { alunos: [] };
let idEdicao = null;

// === 2.4.3 Interações: Relógio em Tempo Real ===
setInterval(() => {
  const agora = new Date();
  DOM.relogio.textContent = agora.toLocaleTimeString("pt-BR");
}, 1000);

// === RENDERIZAÇÃO E ATUALIZAÇÃO DO DASHBOARD ===
const renderizarDashboard = () => {
  DOM.lista.innerHTML = "";

  // Atualiza a Métrica (Contador Dinâmico)
  DOM.metricaTotal.textContent = estadoApp.alunos.length;

  // Constrói as linhas da Tabela (Objetos HTML)
  estadoApp.alunos.forEach((aluno) => {
    const tr = document.createElement("tr");

    tr.className = "linha-nova"; // Dispara a animação CSS ao nascer
    tr.innerHTML = `
<td class="fw-bold text-secondary">#${aluno.id}</td>
<td>${aluno.nome}</td>
<td><span class="badge bg-info text-dark">${aluno.curso}</span></td>
<td class="text-end">
<!-- NOVO BOTÃO DE EDITAR -->
<button class="btn btn-outline-warning btn-sm btn-edit me-2"
data-id="${aluno.id}" data-nome="${aluno.nome}" data-curso="${aluno.curso}">
✎ Editar
</button>
<button class="btn btn-outline-danger btn-sm btn-delete" data-id="${aluno.id}">
✖ Excluir
</button>
</td>
`;

    DOM.lista.appendChild(tr);

    // Remove a cor de "novo" após 2 segundos
    setTimeout(() => tr.classList.remove("linha-nova"), 2000);
  });
};

// === 2.4.5 Manipulação de Eventos (Event Delegation) ===
DOM.lista.addEventListener("click", (evento) => {
  // Lógica de Deletar existente...
  if (evento.target.classList.contains("btn-delete")) {
    const id = evento.target.getAttribute("data-id");
    deletarAluno(id);
  }
  // NOVIDADE: Lógica de Editar
  if (evento.target.classList.contains("btn-edit")) {
    const id = evento.target.getAttribute("data-id");
    const nome = evento.target.getAttribute("data-nome");
    const curso = evento.target.getAttribute("data-curso");
    // Preenche o formulário com os dados do aluno clicado
    DOM.inputNome.value = nome;
    DOM.selectCurso.value = curso;
    idEdicao = id; // Marca que o formulário agora está em modo de edição
    // Muda a cor e texto do botão para dar feedback visual
    DOM.btnCadastrar.textContent = "Atualizar";
    DOM.btnCadastrar.classList.replace("btn-success", "btn-warning");
  }
});

DOM.btnCadastrar.addEventListener("click", cadastrarAluno);

// === INTEGRAÇÃO COM BACK-END (Funções) ===
function carregarAlunos() {
  fetch("/api/alunos")
    .then((resposta) => {
      if (!resposta.ok) {
        throw new Error("Falha Crítica no Banco de Dados (503).");
      }
      return resposta.json();
    })
    .then((dados) => {
      DOM.alerta.classList.add("d-none");
      estadoApp.alunos = dados;
      renderizarDashboard();
    })
    .catch((erro) => {
      DOM.alerta.textContent = erro.message;
      DOM.alerta.classList.remove("d-none");
    });
}

// 2.4.4 Funções: Cadastro
function cadastrarAluno() {
  const dados = { nome: DOM.inputNome.value, curso: DOM.selectCurso.value };
  if (!dados.nome) return alert("O nome é obrigatório!");
  // Se temos um idEdicao, a URL e o Método mudam (PUT). Se não, é POST.
  const url = idEdicao ? `/api/alunos/${idEdicao}` : "/api/alunos";
  const metodo = idEdicao ? "PUT" : "POST";
  fetch(url, {
    method: metodo,
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(dados),
  }).then((resposta) => {
    if (resposta.ok) {
      // Limpa o formulário e reseta o estado
      DOM.inputNome.value = "";
      idEdicao = null;
      DOM.btnCadastrar.textContent = "Adicionar";
      DOM.btnCadastrar.classList.replace("btn-warning", "btn-success");
      carregarAlunos();
    }
  });
}

const deletarAluno = (id) => {
  // Substitui o confirm() travado do navegador por um modal assíncrono moderno
  Swal.fire({
    title: "Tem certeza?",
    text: "Esta ação apagará o aluno do Banco de Dados!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, excluir!",
    cancelButtonText: "Cancelar",
  }).then((resultado) => {
    // Se o usuário clicou em "Sim"
    if (resultado.isConfirmed) {
      fetch(`/api/alunos/${id}`, { method: "DELETE" }).then((resposta) => {
        if (resposta.status === 200) {
          Swal.fire("Excluído!", "O registro foi removido.", "success");
          carregarAlunos();
        }
      });
    }
  });
};

// Inicializa a aplicação ao abrir
carregarAlunos();
