var adminEmail = "admin@spacecode.com";
var adminSenha = "admin123";

function lerLista(chave) {
  var texto = localStorage.getItem(chave);
  if (texto == null) {
    return [];
  }
  return JSON.parse(texto);
}

function salvarLista(chave, lista) {
  localStorage.setItem(chave, JSON.stringify(lista));
}

function excluirItem(chave, posicao) {
  if (confirm("Deseja excluir este item?")) {
    var lista = lerLista(chave);
    lista.splice(posicao, 1);
    salvarLista(chave, lista);
    window.location.reload();
  }
}

function mostrarMensagem(texto, cor) {
  var m = document.getElementById("mensagem");
  if (m != null) {
    m.style.color = cor;
    m.innerHTML = texto;
  }
}

function cadastrar() {
  var f = document.forms["formCadastro"];
  var nome = f["nome"].value;
  var email = f["email"].value;
  var senha = f["senha"].value;

  if (nome == "") {
    mostrarMensagem("Digite o seu nome!", "red");
    return false;
  }
  var arroba = email.indexOf("@");
  var ponto = email.lastIndexOf(".");
  if (arroba < 1 || ponto < arroba + 2 || ponto + 2 >= email.length) {
    mostrarMensagem("Digite um e-mail válido!", "red");
    return false;
  }
  if (email == adminEmail) {
    mostrarMensagem("Este e-mail é reservado!", "red");
    return false;
  }
  if (senha.length < 4) {
    mostrarMensagem("A senha precisa ter pelo menos 4 caracteres!", "red");
    return false;
  }

  var usuarios = lerLista("usuarios");
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email == email) {
      mostrarMensagem("Este e-mail já está cadastrado!", "red");
      return false;
    }
  }

  usuarios.push({ nome: nome, email: email, senha: senha });
  salvarLista("usuarios", usuarios);
  mostrarMensagem("Cadastro realizado! Agora faça o login.", "white");
  f["nome"].value = "";
  f["email"].value = "";
  f["senha"].value = "";
  return false;
}

function entrar() {
  var f = document.forms["formLogin"];
  var email = f["email"].value;
  var senha = f["senha"].value;

  if (email == adminEmail && senha == adminSenha) {
    localStorage.setItem("usuarioLogado", "Administrador");
    localStorage.setItem("tipoUsuario", "admin");
    atualizarMenu();
    mostrarMensagem("Bem-vindo(a), Administrador!", "white");
    return false;
  }

  var usuarios = lerLista("usuarios");
  for (var i = 0; i < usuarios.length; i++) {
    if (usuarios[i].email == email && usuarios[i].senha == senha) {
      localStorage.setItem("usuarioLogado", usuarios[i].nome);
      localStorage.setItem("tipoUsuario", "cliente");
      atualizarMenu();
      mostrarMensagem("Bem-vindo(a), " + usuarios[i].nome + "!", "white");
      return false;
    }
  }

  mostrarMensagem("E-mail ou senha incorretos!", "red");
  return false;
}

function sair() {
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("tipoUsuario");
  window.location.reload();
}

function atualizarMenu() {
  var nome = localStorage.getItem("usuarioLogado");
  if (nome != null) {
    document.getElementById("link-login").innerHTML = "Olá, " + nome;
  }
  if (localStorage.getItem("tipoUsuario") == "admin") {
    document.getElementById("link-relatorio").style.display = "block";
  }
}

function salvarMateria() {
  var f = document.forms["formMateria"];
  var nome = f["nome"].value;
  var nivel = f["nivel"].value;
  var horas = f["horas"].value;

  if (nome == "") {
    mostrarMensagem("Digite o nome da tecnologia!", "red");
    return false;
  }
  if (horas == "" || horas < 0) {
    mostrarMensagem("Digite as horas estudadas!", "red");
    return false;
  }

  var lista = lerLista("materias");
  lista.push({ nome: nome, nivel: nivel, horas: parseFloat(horas) });
  salvarLista("materias", lista);

  mostrarMaterias();
  mostrarMensagem("Tecnologia adicionada!", "white");
  f["nome"].value = "";
  f["horas"].value = 0;
  return false;
}

function maisUmaHora(posicao) {
  var lista = lerLista("materias");
  lista[posicao].horas = lista[posicao].horas + 1;
  salvarLista("materias", lista);
  mostrarMaterias();
}

function mostrarMaterias() {
  var destino = document.getElementById("lista-materias");
  destino.innerHTML = "";
  var lista = lerLista("materias");

  for (var i = 0; i < lista.length; i++) {
    var card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<span class="selo">${lista[i].nivel}</span>
      <h3>${lista[i].nome}</h3>
      <p>${lista[i].horas}h estudadas</p>
      <button class="pequeno" onclick="maisUmaHora(${i})">+1h</button>
      <button class="pequeno perigo" onclick="excluirItem('materias', ${i})">Excluir</button>`;
    destino.appendChild(card);
  }

  if (lista.length == 0) {
    destino.innerHTML = "<p>Nenhuma tecnologia cadastrada ainda.</p>";
  }
}

function salvarTarefa() {
  var f = document.forms["formTarefa"];
  var titulo = f["titulo"].value;
  var materia = f["materia"].value;
  var prioridade = f["prioridade"].value;

  if (titulo == "") {
    mostrarMensagem("Digite o título da tarefa!", "red");
    return false;
  }
  if (materia == "") {
    materia = "Geral";
  }

  var lista = lerLista("tarefas");
  lista.push({ titulo: titulo, materia: materia, prioridade: prioridade, status: "A fazer" });
  salvarLista("tarefas", lista);

  mostrarTarefas();
  mostrarMensagem("Tarefa adicionada!", "white");
  f["titulo"].value = "";
  f["materia"].value = "";
  return false;
}

function mudarStatus(posicao, novoStatus) {
  var lista = lerLista("tarefas");
  lista[posicao].status = novoStatus;
  salvarLista("tarefas", lista);
  mostrarTarefas();
}

function mostrarTarefas() {
  document.getElementById("col-fazer").innerHTML = "";
  document.getElementById("col-fazendo").innerHTML = "";
  document.getElementById("col-feito").innerHTML = "";
  var lista = lerLista("tarefas");

  for (var i = 0; i < lista.length; i++) {
    var card = document.createElement("div");
    card.className = "tarefa";
    card.innerHTML = `<strong>${lista[i].titulo}</strong>
      <p>${lista[i].materia} - prioridade ${lista[i].prioridade}</p>
      <button class="pequeno" onclick="mudarStatus(${i}, 'A fazer')">A fazer</button>
      <button class="pequeno" onclick="mudarStatus(${i}, 'Fazendo')">Fazendo</button>
      <button class="pequeno" onclick="mudarStatus(${i}, 'Feito')">Feito</button>
      <button class="pequeno perigo" onclick="excluirItem('tarefas', ${i})">Excluir</button>`;

    var coluna = "col-feito";
    if (lista[i].status == "A fazer") {
      coluna = "col-fazer";
    } else if (lista[i].status == "Fazendo") {
      coluna = "col-fazendo";
    }
    document.getElementById(coluna).appendChild(card);
  }
}

function salvarProjeto() {
  var f = document.forms["formProjeto"];
  var nome = f["nome"].value;
  var link = f["link"].value;
  var descricao = f["descricao"].value;

  if (nome == "") {
    mostrarMensagem("Digite o nome do projeto!", "red");
    return false;
  }
  if (link.indexOf("http") != 0) {
    mostrarMensagem("O link deve começar com http", "red");
    return false;
  }
  if (descricao == "") {
    mostrarMensagem("Escreva uma descrição!", "red");
    return false;
  }

  var lista = lerLista("projetos");
  lista.push({ nome: nome, link: link, descricao: descricao });
  salvarLista("projetos", lista);

  mostrarProjetos();
  mostrarMensagem("Projeto adicionado!", "white");
  f["nome"].value = "";
  f["link"].value = "";
  f["descricao"].value = "";
  return false;
}

function mostrarProjetos() {
  var destino = document.getElementById("lista-projetos");
  destino.innerHTML = "";
  var lista = lerLista("projetos");

  for (var i = 0; i < lista.length; i++) {
    var card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `<h3>${lista[i].nome}</h3>
      <p>${lista[i].descricao}</p>
      <a href="${lista[i].link}" target="_blank">Abrir projeto</a><br><br>
      <button class="pequeno perigo" onclick="excluirItem('projetos', ${i})">Excluir</button>`;
    destino.appendChild(card);
  }

  if (lista.length == 0) {
    destino.innerHTML = "<p>Nenhum projeto cadastrado ainda.</p>";
  }
}

function mostrarEstatisticas() {
  var materias = lerLista("materias");
  var tarefas = lerLista("tarefas");
  var projetos = lerLista("projetos");

  var horas = 0;
  for (var i = 0; i < materias.length; i++) {
    horas = horas + materias[i].horas;
  }

  var concluidas = 0;
  for (var j = 0; j < tarefas.length; j++) {
    if (tarefas[j].status == "Feito") {
      concluidas = concluidas + 1;
    }
  }

  document.getElementById("est-concluidas").innerHTML = concluidas;
  document.getElementById("est-materias").innerHTML = materias.length;
  document.getElementById("est-projetos").innerHTML = projetos.length;
  document.getElementById("est-horas").innerHTML = horas;
}

function gerarRelatorio() {
  var usuarios = lerLista("usuarios");
  var html = "";
  for (var i = 0; i < usuarios.length; i++) {
    html += `<tr><td>${usuarios[i].nome}</td><td>${usuarios[i].email}</td>
      <td><button class="pequeno perigo" onclick="excluirItem('usuarios', ${i})">Excluir</button></td></tr>`;
  }
  document.getElementById("corpo-usuarios").innerHTML = html;

  var materias = lerLista("materias");
  html = "";
  for (var i = 0; i < materias.length; i++) {
    html += `<tr><td>${materias[i].nome}</td><td>${materias[i].nivel}</td><td>${materias[i].horas}h</td>
      <td><button class="pequeno perigo" onclick="excluirItem('materias', ${i})">Excluir</button></td></tr>`;
  }
  document.getElementById("corpo-materias").innerHTML = html;

  var tarefas = lerLista("tarefas");
  html = "";
  for (var i = 0; i < tarefas.length; i++) {
    html += `<tr><td>${tarefas[i].titulo}</td><td>${tarefas[i].materia}</td><td>${tarefas[i].status}</td>
      <td><button class="pequeno perigo" onclick="excluirItem('tarefas', ${i})">Excluir</button></td></tr>`;
  }
  document.getElementById("corpo-tarefas").innerHTML = html;

  var projetos = lerLista("projetos");
  html = "";
  for (var i = 0; i < projetos.length; i++) {
    html += `<tr><td>${projetos[i].nome}</td><td>${projetos[i].link}</td>
      <td><button class="pequeno perigo" onclick="excluirItem('projetos', ${i})">Excluir</button></td></tr>`;
  }
  document.getElementById("corpo-projetos").innerHTML = html;
}

atualizarMenu();

var logado = localStorage.getItem("usuarioLogado");
var tipo = localStorage.getItem("tipoUsuario");

if (document.getElementById("area-restrita") != null && logado == null) {
  alert("Faça login para acessar esta página.");
  window.location.href = "index.html#acesso";
} else if (document.getElementById("area-admin") != null && tipo != "admin") {
  alert("Acesso restrito ao administrador.");
  window.location.href = "index.html#acesso";
} else {

  if (document.getElementById("passo-relatorio") != null && tipo == "admin") {
    document.getElementById("passo-relatorio").style.display = "block";
  }

  if (document.getElementById("est-materias") != null) { mostrarEstatisticas(); }
  if (document.getElementById("lista-materias") != null) { mostrarMaterias(); }
  if (document.getElementById("col-fazer") != null) { mostrarTarefas(); }
  if (document.getElementById("lista-projetos") != null) { mostrarProjetos(); }
  if (document.getElementById("corpo-usuarios") != null) { gerarRelatorio(); }
}
