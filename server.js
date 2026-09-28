// Importações de dependências externas
require("dotenv").config(); // Carrega as variáveis do arquivo .env
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
// Importação das rotas

const alunoRoutes = require("./src/routes/alunoRoutes");
const app = express();
// === MIDDLEWARES GLOBAIS DE ROBUSTEZ E SEGURANÇA ===
// 1. CORS: Permite que outros Front-ends (como em outra porta ou servidor) consumam sua API
app.use(cors());
// 2. Morgan: Cria logs automáticos no terminal para cada requisição HTTP recebida
app.use(morgan("dev"));
// 3. Parser JSON e Arquivos Estáticos
app.use(express.json());
app.use(express.static("public"));
// === INJEÇÃO DE ROTAS ===
app.use("/api/alunos", alunoRoutes);
// === INICIALIZAÇÃO SEGURA ===
// Puxa a porta do arquivo .env, ou usa 3000 como fallback de segurança
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(
    `✅ Servidor rodando na porta ${PORT}. Protegido por CORS e monitorado por Morgan!`,
  );
});
