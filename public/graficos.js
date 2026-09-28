// Captura o elemento Canvas na tela
const ctx = document.getElementById("graficoCursos").getContext("2d");

// Função para buscar dados e montar o gráfico
function carregarGrafico() {
  // Ajustado para buscar na rota que já funciona
  fetch("/api/alunos")
    .then((resposta) => resposta.json())
    .then((dados) => {
      
      // Conta quantos alunos há em cada curso dinamicamente
      const contagemCursos = {};
      
      dados.forEach(aluno => {
        if (contagemCursos[aluno.curso]) {
          contagemCursos[aluno.curso]++;
        } else {
          contagemCursos[aluno.curso] = 1;
        }
      });

      // Extrai os nomes dos cursos (Labels) e as quantidades (Data)
      const labelsCursos = Object.keys(contagemCursos);
      const dadosQuantidades = Object.values(contagemCursos);

      // Instanciação do Gráfico (Chart.js)
      new Chart(ctx, {
        type: "doughnut", // Tipo do gráfico (Rosca)
        data: {
          labels: labelsCursos,
          datasets: [
            {
              label: "Número de Alunos",
              data: dadosQuantidades,
              backgroundColor: [
                "rgba(13, 110, 253, 0.7)", // Azul Bootstrap
                "rgba(25, 135, 84, 0.7)", // Verde Bootstrap
                "rgba(255, 193, 7, 0.7)", // Amarelo Bootstrap
              ],
              borderColor: [
                "rgba(13, 110, 253, 1)",
                "rgba(25, 135, 84, 1)",
                "rgba(255, 193, 7, 1)",
              ],
              borderWidth: 2,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { position: "bottom" },
          },
        },
      });
    })
    .catch((erro) => console.error("Erro ao carregar estatísticas:", erro));
}

// Inicializa a renderização quando a página abrir
carregarGrafico();