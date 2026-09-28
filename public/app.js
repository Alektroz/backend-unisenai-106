import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

// ============================================================================
// BLOCO 1: MOTOR DE BIG DATA (SIMULADOR DO BACK-END)
// ============================================================================
const gerarBigData = () => {
  const banco = {
    instituicao: "Centro Universitário Senai Vila Leopoldina",
    codigo: 106,
    cursos: [
      { id: 1, nome: "Análise e Desenvol. de Sistemas" },
      { id: 2, nome: "Automação Industrial" },
      { id: 3, nome: "Gestão de Projetos de TI" },
    ],
    periodos: [
      { numero: 1, nome: "1º Semestre" },
      { numero: 2, nome: "2º Semestre" },
      { numero: 3, nome: "3º Semestre" },
      { numero: 4, nome: "4º Semestre" },
    ],
    disciplinas: [
      { id: 101, nome: "Linguagem de Programação", semestre: 1 },
      { id: 102, nome: "Banco de Dados", semestre: 1 },
      { id: 103, nome: "Desenvolvimento Web", semestre: 1 },
      { id: 104, nome: "Ciência de Dados", semestre: 1 },
      { id: 105, nome: "Automação Industrial", semestre: 1 },
      { id: 106, nome: "Metodologia Científica", semestre: 1 },
      { id: 107, nome: "Projeto Integrador I", semestre: 1 },
      { id: 201, nome: "Tl e Conectividade", semestre: 2 },
      { id: 202, nome: "Engenharia de Software", semestre: 2 },
      { id: 203, nome: "Desenvolvimento Front-end", semestre: 2 },
      { id: 204, nome: "Desenvolvimento Back-end", semestre: 2 },
      { id: 205, nome: "IA e Big Data", semestre: 2 },
      { id: 206, nome: "Relações Humanas", semestre: 2 },
      { id: 207, nome: "Projeto Integrador II", semestre: 2 },
      { id: 301, nome: "Desenvolvimento Mobile", semestre: 3 },
      { id: 302, nome: "Integração Vert. e Horiz.", semestre: 3 },
      { id: 303, nome: "Computação em Nuvem", semestre: 3 },
      { id: 304, nome: "Integração com lloT", semestre: 3 },
      { id: 305, nome: "Interfaces Industriais", semestre: 3 },
      { id: 306, nome: "Gestão de Pessoas", semestre: 3 },
      { id: 307, nome: "Eletiva I", semestre: 3 },
      { id: 308, nome: "Projeto Integrador III", semestre: 3 },
      { id: 401, nome: "Cibersegurança", semestre: 4 },
      { id: 402, nome: "Aplicações Mobile", semestre: 4 },
      { id: 403, nome: "Aplicações Web", semestre: 4 },
      { id: 404, nome: "Gestão de Projetos", semestre: 4 },
      { id: 405, nome: "Empreendedorismo", semestre: 4 },
      { id: 406, nome: "Eletiva II", semestre: 4 },
      { id: 407, nome: "Projeto Integrador IV", semestre: 4 },
    ],
    alunos: [],
    notas: [],
  };

  const nomes = [
    "Carlos",
    "Mariana",
    "Pedro",
    "Ana",
    "Rafael",
    "Beatriz",
    "João",
    "Julia",
    "Felipe",
    "Larissa",
  ];
  const sobrenomes = [
    "Silva",
    "Santos",
    "Oliveira",
    "Souza",
    "Rodrigues",
    "Ferreira",
    "Alves",
    "Lima",
    "Gomes",
    "Costa",
  ];
  const turnos = ["Matutino", "Vespertino", "Noturno"];
  let notaldCount = 1;

  for (let i = 1; i <= 10000; i++) {
    const cursold = Math.floor(Math.random() * 3) + 1;
    const semestreld = Math.floor(Math.random() * 4) + 1;
    const aluno = {
      id: i,
      ra: `106${cursold}${semestreld}${i.toString().padStart(5, "0")}`,
      nome: `${nomes[Math.floor(Math.random() * nomes.length)]} ${sobrenomes[Math.floor(Math.random() * sobrenomes.length)]} ${i}`,
      cursold,
      semestreld,
      turno: turnos[Math.floor(Math.random() * turnos.length)],
    };
    banco.alunos.push(aluno);
    banco.disciplinas
      .filter((d) => d.semestre === semestreld)
      .forEach((disc) => {
        banco.notas.push({
          id: notaldCount++,
          alunold: aluno.id,
          disciplinald: disc.id,
          valor: parseFloat((Math.random() * 6 + 4).toFixed(1)),
          faltas: Math.floor(Math.random() * 12),
        });
      });
  }
  return banco;
};

// Componente Auxiliar: Chart.js
const Grafico = ({ tipo, dados, opcoes }) => {
  const canvasRef = useRef(null);
  const chartInstance = useRef(null);
  useEffect(() => {
    if (chartInstance.current) chartInstance.current.destroy();
    chartInstance.current = new Chart(canvasRef.current.getContext("2d"), {
      type: tipo,
      data: dados,
      options: opcoes,
    });
    return () => {
      if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [dados, tipo, opcoes]);
  return <canvas ref={canvasRef}></canvas>;
};

// ============================================================================
// BLOCO 2: TELA DE AUTENTICAÇÃO (LOGIN)
// ============================================================================
const TelaLogin = () => {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState("");

  const navigate = useNavigate(); // Hook de navegação adicionado na Fase 1[cite: 3]

  const processarLogin = (e) => {
    e.preventDefault();
    setCarregando(true);
    setErro("");

    // Simula o tempo de requisição até a API Back-end
    setTimeout(() => {
      if (email === "admin@senai.br" && senha === "senai106") {
        // Grava o token no localStorage e navega para o dashboard[cite: 3]
        localStorage.setItem("jwt_token", "token_simulado_123");
        navigate("/dashboard");
      } else {
        setErro("Credenciais inválidas. Tente admin@senai.br / senai106");
        setCarregando(false);
      }
    }, 1200);
  };

  return (
    <div
      className="vh-100 d-flex align-items-center justify-content-center"
      style={{
        background:
          "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1920&q=80') center/cover",
        backgroundColor: "rgba(15, 23, 42, 0.85)",
        backgroundBlendMode: "overlay",
      }}
    >
      <div
        className="glass-effect p-5 fade-in w-100 mx-3"
        style={{ maxWidth: "450px" }}
      >
        <div className="text-center mb-4">
          <div
            className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto mb-3 shadow"
            style={{ width: "70px", height: "70px", fontSize: "2rem" }}
          >
            <i className="fa-solid fa-shield-halved"></i>
          </div>
          <h3 className="fw-bold text-dark mb-0">Central de Acesso</h3>
          <p className="text-muted small fw-semibold mt-1">
            UniSENAI 106 - Módulo Administrativo
          </p>
        </div>
        <form onSubmit={processarLogin}>
          <div className="mb-3">
            <label className="form-label fw-bold small text-secondary">
              E-mail Corporativo
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white">
                <i className="fa-solid fa-envelope text-muted"></i>
              </span>
              <input
                type="email"
                className="form-control py-2 border-start-0 ps-0"
                placeholder="admin@senai.br"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={carregando}
                required
              />
            </div>
          </div>
          <div className="mb-4">
            <label className="form-label fw-bold small text-secondary">
              Senha
            </label>
            <div className="input-group shadow-sm">
              <span className="input-group-text bg-white">
                <i className="fa-solid fa-lock text-muted"></i>
              </span>
              <input
                type="password"
                className="form-control py-2 border-start-0 ps-0"
                placeholder="........"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                disabled={carregando}
                required
              />
            </div>
          </div>
          {erro && (
            <div
              className="alert alert-danger d-flex align-items-center py-2 px-3 small fw-bold fade-in"
              role="alert"
            >
              <i className="fa-solid fa-triangle-exclamation me-2 fs-5"></i>{" "}
              {erro}
            </div>
          )}
          <button
            type="submit"
            className="btn btn-primary w-100 py-3 fw-bold shadow-sm d-flex justify-content-center align-items-center gap-2"
            disabled={carregando}
          >
            {carregando ? (
              <>
                <div
                  className="spinner-border spinner-border-sm text-light"
                  role="status"
                ></div>{" "}
                Autenticando...
              </>
            ) : (
              <>
                <i className="fa-solid fa-arrow-right-to-bracket"></i> Acessar
                Cluster
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================================================
// BLOCO 3: DASHBOARD E BIG DATA
// ============================================================================
const Dashboard = ({ db }) => {
  const [cursoSelecionado, setCursoSelecionado] = useState(1);
  const [semestreSelecionado, setSemestreSelecionado] = useState(1);
  const [turnoSelecionado, setTurnoSelecionado] = useState("Todos");
  const [abaAtiva, setAbaAtiva] = useState("tabela");
  const [ordenacao, setOrdenacao] = useState({
    coluna: "nome",
    direcao: "asc",
    disciplinald: null,
  });

  const navigate = useNavigate();

  const fazerLogout = () => {
    localStorage.removeItem("jwt_token");
    navigate("/");
  };

  const dadosFiltrados = useMemo(() => {
    let alunos = db.alunos.filter(
      (a) =>
        a.cursold === cursoSelecionado && a.semestreld === semestreSelecionado,
    );
    if (turnoSelecionado !== "Todos")
      alunos = alunos.filter((a) => a.turno === turnoSelecionado);
    alunos.sort((a, b) => {
      if (ordenacao.coluna === "nome")
        return ordenacao.direcao === "asc"
          ? a.nome.localeCompare(b.nome)
          : b.nome.localeCompare(a.nome);
      if (ordenacao.coluna === "nota" && ordenacao.disciplinald) {
        const notaA =
          db.notas.find(
            (n) =>
              n.alunold === a.id && n.disciplinald === ordenacao.disciplinald,
          )?.valor || 0;
        const notaB =
          db.notas.find(
            (n) =>
              n.alunold === b.id && n.disciplinald === ordenacao.disciplinald,
          )?.valor || 0;
        return ordenacao.direcao === "asc" ? notaA - notaB : notaB - notaA;
      }
      return 0;
    });
    const disciplinas = db.disciplinas.filter(
      (d) => d.semestre === semestreSelecionado,
    );
    return { alunos, disciplinas };
  }, [cursoSelecionado, semestreSelecionado, turnoSelecionado, ordenacao, db]);

  const alternarOrdenacao = (coluna, disciplinald = null) => {
    setOrdenacao({
      coluna,
      direcao:
        ordenacao.coluna === coluna && ordenacao.direcao === "asc"
          ? "desc"
          : "asc",
      disciplinald,
    });
  };

  const renderlcone = (coluna, disciplinald = null) => {
    if (ordenacao.coluna !== coluna || ordenacao.disciplinald !== disciplinald)
      return <i className="fa-solid fa-sort text-muted ms-2 opacity-25"></i>;
    return ordenacao.direcao === "asc" ? (
      <i className="fa-solid fa-sort-up text-primary ms-2"></i>
    ) : (
      <i className="fa-solid fa-sort-down text-primary ms-2"></i>
    );
  };

  const labelsDisciplinas = dadosFiltrados.disciplinas.map((d) => d.nome);
  const mediasNotas = [];
  dadosFiltrados.disciplinas.forEach((disc) => {
    let soma = 0,
      count = 0;
    dadosFiltrados.alunos.forEach((aluno) => {
      const n = db.notas.find(
        (x) => x.alunold === aluno.id && x.disciplinald === disc.id,
      );
      if (n) {
        soma += n.valor;
        count++;
      }
    });
    mediasNotas.push(count > 0 ? (soma / count).toFixed(2) : 0);
  });

  return (
    <div className="d-flex flex-column min-vh-100 bg-light fade-in">
      <nav className="navbar navbar-dark bg-dark shadow-sm px-4 py-3">
        <div className="d-flex align-items-center gap-3">
          <i className="fa-solid fa-server text-primary fs-3"></i>
          <div>
            <h1 className="navbar-brand mb-0 fw-bold fs-5">{db.instituicao}</h1>
            <small
              className="text-secondary fw-semibold"
              style={{ fontSize: "0.75rem" }}
            >
              Engine de Big Data SQLite Emulado
            </small>
          </div>
        </div>
        <button
          onClick={fazerLogout}
          className="btn btn-outline-light btn-sm fw-bold"
        >
          <i className="fa-solid fa-power-off me-2"></i>Sair
        </button>
      </nav>
      <main
        className="container-fluid py-4 flex-grow-1"
        style={{ maxWidth: "1400px" }}
      >
        <div className="card shadow-sm border-0 mb-4 p-3 rounded-4 bg-white">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <label className="form-label small fw-bold text-muted mb-1">
                Selecione o Curso
              </label>
              <select
                className="form-select bg-light"
                value={cursoSelecionado}
                onChange={(e) => setCursoSelecionado(Number(e.target.value))}
              >
                {db.cursos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label small fw-bold text-muted mb-1">
                Semestre
              </label>
              <select
                className="form-select bg-light"
                value={semestreSelecionado}
                onChange={(e) => setSemestreSelecionado(Number(e.target.value))}
              >
                {db.periodos.map((p) => (
                  <option key={p.numero} value={p.numero}>
                    {p.nome}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <label className="form-label small fw-bold text-muted mb-1">
                <i className="fa-regular fa-clock me-1"></i> Filtrar por Turno
              </label>
              <select
                className="form-select bg-light border-primary"
                value={turnoSelecionado}
                onChange={(e) => setTurnoSelecionado(e.target.value)}
              >
                <option value="Todos">Todos os Turnos</option>
                <option value="Matutino">Matutino</option>
                <option value="Vespertino">Vespertino</option>
                <option value="Noturno">Noturno</option>
              </select>
            </div>
            <div className="col-md-3 text-end mt-4">
              <div className="badge bg-primary-subtle text-primary border border-primary-subtle px-3 py-2 fs-6 rounded-pill">
                <i className="fa-solid fa-filter me-1"></i>
                {dadosFiltrados.alunos.length.toLocaleString()} Alunos no Filtro
              </div>
            </div>
          </div>
        </div>
        <ul className="nav nav-pills mb-4">
          <li className="nav-item">
            <button
              onClick={() => setAbaAtiva("tabela")}
              className={`nav-link px-4 ${abaAtiva === "tabela" ? "active shadow-sm" : "bg-white shadow-sm"}`}
            >
              <i className="fa-solid fa-table-list me-2"></i> Tabela Analítica
              (Sortable)
            </button>
          </li>
          <li className="nav-item">
            <button
              onClick={() => setAbaAtiva("analytics")}
              className={`nav-link px-4 ${abaAtiva === "analytics" ? "active shadow-sm" : "bg-white shadow-sm"}`}
            >
              <i className="fa-solid fa-chart-pie me-2"></i> Dashboard Analytics
            </button>
          </li>
        </ul>

        {abaAtiva === "tabela" && (
          <div className="card shadow-sm border-0 rounded-4 overflow-hidden fade-in">
            <div className="bg-primary-subtle p-3 border-bottom border-primary d-flex align-items-center justify-content-between">
              <div>
                <h6 className="fw-bold text-primary-emphasis mb-0">
                  <i className="fa-solid fa-sort me-2"></i>Ordene os dados
                  clicando no cabeçalho
                </h6>
                <small className="text-primary-emphasis">
                  Amostragem: Visualizando os 100 primeiros registros.
                </small>
              </div>
            </div>
            <div className="table-responsive" style={{ maxHeight: "600px" }}>
              <table className="table table-hover align-middle mb-0 text-sm">
                <thead className="table-light sticky-top shadow-sm">
                  <tr>
                    <th
                      className="px-4 cursor-pointer bg-white"
                      onClick={() => alternarOrdenacao("nome")}
                      title="Clique para ordenar por nome"
                    >
                      Aluno / RA {renderlcone("nome")}
                    </th>
                    <th className="px-4 bg-white">Turno</th>
                    {dadosFiltrados.disciplinas.slice(0, 4).map((d) => (
                      <th
                        key={d.id}
                        className="text-center cursor-pointer bg-white"
                        onClick={() => alternarOrdenacao("nota", d.id)}
                      >
                        <div
                          className="text-truncate"
                          style={{ maxWidth: "120px" }}
                          title={d.nome}
                        >
                          {d.nome}
                        </div>
                        <div className="text-muted small fw-normal">
                          (Nota) {renderlcone("nota", d.id)}
                        </div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {dadosFiltrados.alunos.slice(0, 100).map((aluno) => (
                    <tr key={aluno.id}>
                      <td className="px-4">
                        <div className="fw-bold text-dark">{aluno.nome}</div>
                        <div
                          className="text-muted"
                          style={{
                            fontSize: "0.8rem",
                            fontFamily: "monospace",
                          }}
                        >
                          RA: {aluno.ra}
                        </div>
                      </td>
                      <td className="px-4">
                        <span className="badge bg-secondary-subtle text-secondary">
                          {aluno.turno}
                        </span>
                      </td>
                      {dadosFiltrados.disciplinas.slice(0, 4).map((disc) => {
                        const nota = db.notas.find(
                          (n) =>
                            n.alunold === aluno.id &&
                            n.disciplinald === disc.id,
                        );
                        const isSorted =
                          ordenacao.coluna === "nota" &&
                          ordenacao.disciplinald === disc.id;
                        return (
                          <td
                            key={disc.id}
                            className={`text-center fw-bold ${isSorted ? "bg-light" : ""}`}
                          >
                            <span
                              className={
                                nota && nota.valor >= 6
                                  ? "text-success"
                                  : "text-danger"
                              }
                            >
                              {nota ? nota.valor.toFixed(1) : "-"}
                            </span>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                  {dadosFiltrados.alunos.length === 0 && (
                    <tr>
                      <td colSpan="10" className="text-center py-5 text-muted">
                        Nenhum aluno encontrado para este filtro.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {abaAtiva === "analytics" && (
          <div className="card shadow-sm border-0 rounded-4 p-4 fade-in">
            <h5 className="fw-bold text-dark mb-1">
              <i className="fa-solid fa-chart-line text-primary me-2"></i> Média
              Geral das Disciplinas
            </h5>
            <small className="text-muted d-block mb-4">
              Cálculo matemático executado em tempo real baseado no filtro
              atual.
            </small>
            <div style={{ height: "400px" }}>
              <Grafico
                tipo="bar"
                dados={{
                  labels: labelsDisciplinas,
                  datasets: [
                    {
                      label: "Média de Notas",
                      data: mediasNotas,
                      backgroundColor: "#0d6efd",
                      borderRadius: 4,
                    },
                  ],
                }}
                opcoes={{
                  maintainAspectRatio: false,
                  scales: { y: { max: 10 } },
                }}
              />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

// ============================================================================
// BLOCO 4: INICIALIZAÇÃO DA APLICAÇÃO (O CONTROLADOR PRINCIPAL)
// ============================================================================

// Componente Interceptador (Guardião de Rota) adicionado na Fase 1[cite: 3]
const RotaPrivada = ({ children }) => {
  const token = localStorage.getItem("jwt_token");
  return token ? children : <Navigate to="/" />;
};

const App = () => {
  const [bancoDeDados, setBancoDeDados] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setBancoDeDados(gerarBigData());
    }, 100);
  }, []);

  if (!bancoDeDados)
    return (
      <div className="vh-100 d-flex flex-column justify-content-center align-items-center bg-dark text-white">
        <div
          className="spinner-border text-primary mb-3"
          style={{ width: "3rem", height: "3rem" }}
          role="status"
        ></div>
        <h4 className="fw-bold">Provisionando Cluster de Big Data...</h4>
      </div>
    );

  // Sistema de roteamento (React Router) substituindo a antiga lógica ternária (!autenticado)[cite: 3, 5]
  return (
    <Router>
      <Routes>
        {/* Rota Pública */}
        <Route path="/" element={<TelaLogin />} />

        {/* Rota Protegida */}
        <Route
          path="/dashboard"
          element={
            <RotaPrivada>
              <Dashboard db={bancoDeDados} />
            </RotaPrivada>
          }
        />

        {/* Rota Coringa (404 - Redireciona para o login se a URL não existir) */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
