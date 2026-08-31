// === LIFTING STATE UP: ESTADO GLOBAL DA APLICAÇÃO ===
const estadoApp = {
    alunos: [],
    carregando: false
};

// === MANIPULAÇÃO DOS ELEMENTOS HTML ===
const DOM = {
    lista: document.getElementById('listaAlunos'),
    inputNome: document.getElementById('inputNome'),
    selectCurso: document.getElementById('selectCurso'),
    btnCadastrar: document.getElementById('btnCadastrar'),
    alerta: document.getElementById('alertaSistema')
};

// === FUNÇÃO PARA RENDERIZAR A TELA ===
function renderizarTela() {
    DOM.lista.innerHTML = '';

    estadoApp.alunos.forEach(aluno => {
        const li = document.createElement('li');

        li.className =
            'list-group-item d-flex justify-content-between align-items-center';

        li.innerHTML = `
            <span>
                <strong>${aluno.nome}</strong> - ${aluno.curso}
            </span>

            <button
                class="btn btn-danger btn-sm btn-delete"
                data-id="${aluno.id}">
                Remover
            </button>
        `;

        DOM.lista.appendChild(li);
    });
}

// === EVENT DELEGATION ===
DOM.lista.addEventListener('click', function (evento) {

    if (evento.target.classList.contains('btn-delete')) {
        const id = evento.target.getAttribute('data-id');

        deletarAluno(id);
    }
});

// === EVENTO DO BOTÃO DE CADASTRO ===
DOM.btnCadastrar.addEventListener('click', cadastrarAluno);

// === CADASTRAR ALUNO ===
function cadastrarAluno() {

    const nome = DOM.inputNome.value.trim();
    const curso = DOM.selectCurso.value;

    // Validação no Front-end
    if (!nome || !curso) {
        exibirErro('Nome e curso são obrigatórios!');
        return;
    }

    estadoApp.carregando = true;
    DOM.btnCadastrar.disabled = true;

    fetch('/api/alunos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            nome: nome,
            curso: curso
        })
    })
        .then(resposta => {

            if (!resposta.ok) {
                throw new Error(
                    'Erro ao cadastrar aluno. Código: ' +
                    resposta.status
                );
            }

            return resposta.json();
        })
        .then(dados => {

            console.log(dados.mensagem);

            // Limpa os campos
            DOM.inputNome.value = '';
            DOM.selectCurso.value = '';

            // Esconde alerta
            DOM.alerta.classList.add('d-none');

            // Atualiza a lista
            carregarAlunos();
        })
        .catch(erro => {
            exibirErro(erro.message);
        })
        .finally(() => {
            estadoApp.carregando = false;
            DOM.btnCadastrar.disabled = false;
        });
}

// === DELETAR ALUNO ===
function deletarAluno(id) {

    fetch(`/api/alunos/${id}`, {
        method: 'DELETE'
    })
        .then(resposta => {

            if (!resposta.ok) {
                throw new Error(
                    'Erro ao excluir aluno. Código: ' +
                    resposta.status
                );
            }

            return resposta.json();
        })
        .then(dados => {

            console.log(dados.mensagem);

            // Atualiza a lista depois da exclusão
            carregarAlunos();
        })
        .catch(erro => {
            exibirErro(erro.message);
        });
}

// === CARREGAR ALUNOS ===
function carregarAlunos() {

    estadoApp.carregando = true;

    fetch('/api/alunos/pipeline-simulador')
        .then(resposta => {

            if (!resposta.ok) {
                throw new Error(
                    'Falha no servidor. Código: ' +
                    resposta.status
                );
            }

            return resposta.json();
        })
        .then(dados => {

            // Esconde mensagem de erro
            DOM.alerta.classList.add('d-none');

            // Atualiza o estado global
            estadoApp.alunos = dados;

            // Renderiza a tela
            renderizarTela();
        })
        .catch(erro => {

            exibirErro(
                'Falha em Cascata detectada: ' +
                erro.message
            );
        })
        .finally(() => {
            estadoApp.carregando = false;
        });
}

// === EXIBIR ERRO ===
function exibirErro(mensagem) {

    DOM.alerta.textContent = mensagem;

    DOM.alerta.classList.remove('d-none');
}

// === INICIALIZAÇÃO DA APLICAÇÃO ===
carregarAlunos();