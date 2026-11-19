
// ==========================================
// HAMBURGUERIA EXPLOSÃO
// Sistema principal
// ==========================================


// ==========================================
// VARIÁVEIS
// ==========================================

let contador = Number(localStorage.getItem("contadorExplosao")) || 1000;

let filaVip = JSON.parse(localStorage.getItem("filaVipExplosao")) || [];
let filaComum = JSON.parse(localStorage.getItem("filaComumExplosao")) || [];

let clientesGerados = JSON.parse(localStorage.getItem("clientesExplosao")) || [];
let clientesAtendidos = JSON.parse(localStorage.getItem("atendidosExplosao")) || [];

let clienteEmAtendimento =
    JSON.parse(localStorage.getItem("clienteAtualExplosao")) || null;

let avaliacoes = JSON.parse(localStorage.getItem("avaliacoesExplosao")) || [];
let agendamentos = JSON.parse(localStorage.getItem("agendamentosExplosao")) || [];

let noticias = JSON.parse(localStorage.getItem("noticiasExplosao")) || [
    "Bem-vindo à Hamburgueria Explosão!",
    "Confira nosso cardápio e conheça nossos hambúrgueres."
];

let promocoes = JSON.parse(localStorage.getItem("promocoesExplosao")) || [
    "🍔 Bem-vindo! Confira nossos deliciosos hambúrgueres!"
];

let indicePromocao = 0;

let quantidadePedidos = Number(localStorage.getItem("pedidosExplosao")) || 0;


// ==========================================
// SALVAR DADOS
// ==========================================

function salvarDados() {

    localStorage.setItem("contadorExplosao", contador);

    localStorage.setItem("filaVipExplosao", JSON.stringify(filaVip));
    localStorage.setItem("filaComumExplosao", JSON.stringify(filaComum));

    localStorage.setItem("clientesExplosao", JSON.stringify(clientesGerados));
    localStorage.setItem("atendidosExplosao", JSON.stringify(clientesAtendidos));

    localStorage.setItem("clienteAtualExplosao", JSON.stringify(clienteEmAtendimento));

    localStorage.setItem("avaliacoesExplosao", JSON.stringify(avaliacoes));
    localStorage.setItem("agendamentosExplosao", JSON.stringify(agendamentos));

    localStorage.setItem("noticiasExplosao", JSON.stringify(noticias));
    localStorage.setItem("promocoesExplosao", JSON.stringify(promocoes));

    localStorage.setItem("pedidosExplosao", quantidadePedidos);

}


// ==========================================
// MOSTRAR LISTAS
// ==========================================

function mostrarLista(elemento, lista) {

    if (!elemento) return;

    elemento.innerHTML = "";

    lista.forEach(item => {

        let li = document.createElement("li");

        li.textContent = item;

        elemento.appendChild(li);

    });

}


// ==========================================
// HISTÓRICO DE CLIENTES
// ==========================================

function atualizarHistoricoClientes() {

    let lista = document.getElementById("listaClientes");

    if (!lista) return;

    lista.innerHTML = "";

    clientesGerados.forEach(cliente => {

        let li = document.createElement("li");

        li.textContent = cliente.codigo + " - " + cliente.nome;

        lista.appendChild(li);

    });

}


// ==========================================
// HISTÓRICO DE ATENDIMENTOS
// ==========================================

function atualizarClientesAtendidos() {

    let lista = document.getElementById("listaAtendidas");

    if (!lista) return;

    lista.innerHTML = "";

    clientesAtendidos.forEach(cliente => {

        let li = document.createElement("li");

        li.textContent = cliente.codigo + " - " + cliente.nome;

        lista.appendChild(li);

    });

}


// ==========================================
// GERAR CLIENTE
// ==========================================

function gerarCliente(tipo) {

    let campoNome = document.getElementById("nomeCliente");

    let nome = campoNome ? campoNome.value.trim() : "";

    if (nome === "") {

        alert("Digite o nome do cliente!");

        return;

    }

    contador++;

    let codigo;

    if (tipo === "VIP") {

        codigo = "VIP" + contador;

    } else {

        codigo = "C" + contador;

    }

    let cliente = {

        codigo: codigo,
        nome: nome,
        tipo: tipo,
        dataGeracao: Date.now()

    };

    if (tipo === "VIP") {

        filaVip.push(cliente);

    } else {

        filaComum.push(cliente);

    }

    clientesGerados.push(cliente);

    if (campoNome) {
        campoNome.value = "";
    }

    let ultimoCliente = document.getElementById("ultimoCliente");

    if (ultimoCliente) {

        ultimoCliente.textContent = codigo + " - " + nome;

    }

    atualizarHistoricoClientes();

    atualizarFilas();

    salvarDados();

}


// ==========================================
// BOTÕES DE GERAR CLIENTE
// ==========================================

let btnClienteComum = document.getElementById("btnClienteComum");

if (btnClienteComum) {

    btnClienteComum.addEventListener("click", function () {

        gerarCliente("COMUM");

    });

}


let btnClienteVip = document.getElementById("btnClienteVip");

if (btnClienteVip) {

    btnClienteVip.addEventListener("click", function () {

        gerarCliente("VIP");

    });

}


// ==========================================
// ATUALIZAR FILAS
// ==========================================

function atualizarFilas() {

    let qtdVip = document.getElementById("qtdVip");
    let qtdComuns = document.getElementById("qtdComuns");

    if (qtdVip) {

        qtdVip.textContent = filaVip.length;

    }

    if (qtdComuns) {

        qtdComuns.textContent = filaComum.length;

    }

}


// ==========================================
// CHAMAR PRÓXIMO CLIENTE
// ==========================================

function chamarProximoCliente() {

    if (clienteEmAtendimento !== null) {

        alert("Finalize o atendimento atual antes de chamar outro cliente.");

        return;

    }

    let cliente;

    // VIP tem prioridade

    if (filaVip.length > 0) {

        cliente = filaVip.shift();

    } else if (filaComum.length > 0) {

        cliente = filaComum.shift();

    } else {

        alert("Não existem clientes aguardando!");

        return;

    }

    clienteEmAtendimento = cliente;

    let clienteAtual = document.getElementById("clienteAtual");
    let nomeEmAtendimento = document.getElementById("nomeEmAtendimento");

    if (clienteAtual) {

        clienteAtual.textContent = cliente.codigo;

    }

    if (nomeEmAtendimento) {

        nomeEmAtendimento.textContent = cliente.nome;

    }

    let notificacao = document.getElementById("notificacaoProxima");

    if (notificacao) {

        notificacao.textContent =
            "Próximo cliente: " + cliente.nome + " (" + cliente.codigo + ")";

    }

    // Anunciar cliente por voz

    if ("speechSynthesis" in window) {

        let fala = new SpeechSynthesisUtterance(
            "Atenção! Cliente " + cliente.nome +
            ". Código " + cliente.codigo
        );

        fala.lang = "pt-BR";

        speechSynthesis.speak(fala);

    }

    atualizarFilas();

    salvarDados();

}


// ==========================================
// BOTÃO CHAMAR PRÓXIMO
// ==========================================

let btnChamarProximo = document.getElementById("btnChamarProximo");

if (btnChamarProximo) {

    btnChamarProximo.addEventListener("click", chamarProximoCliente);

}


// ==========================================
// FINALIZAR ATENDIMENTO
// ==========================================

function finalizarAtendimento() {

    if (clienteEmAtendimento === null) {

        alert("Não existe nenhum cliente em atendimento!");

        return;

    }

    clientesAtendidos.push(clienteEmAtendimento);

    // Mantém somente os últimos 4 atendimentos

    if (clientesAtendidos.length > 4) {

        clientesAtendidos.shift();

    }

    clienteEmAtendimento = null;

    let clienteAtual = document.getElementById("clienteAtual");
    let nomeEmAtendimento = document.getElementById("nomeEmAtendimento");

    if (clienteAtual) {

        clienteAtual.textContent = "Nenhum";

    }

    if (nomeEmAtendimento) {

        nomeEmAtendimento.textContent = "Aguardando cliente";

    }

    let notificacao = document.getElementById("notificacaoProxima");

    if (notificacao) {

        notificacao.textContent = "Atendimento finalizado!";

    }

    atualizarClientesAtendidos();

    salvarDados();

}


// ==========================================
// BOTÃO FINALIZAR
// ==========================================

let btnFinalizar = document.getElementById("btnFinalizar");

if (btnFinalizar) {

    btnFinalizar.addEventListener("click", finalizarAtendimento);

}


// ==========================================
// DATA E HORA
// ==========================================

function atualizarDataHora() {

    let elemento = document.getElementById("dataHora");

    if (!elemento) return;

    let agora = new Date();

    elemento.textContent = agora.toLocaleString("pt-BR");

}

setInterval(atualizarDataHora, 1000);

atualizarDataHora();


// ==========================================
// PESQUISAR PRODUTOS
// ==========================================

let btnPesquisar = document.getElementById("btnPesquisar");

if (btnPesquisar) {

    btnPesquisar.addEventListener("click", pesquisarProdutos);

}


function pesquisarProdutos() {

    let campo = document.getElementById("pesquisaProduto");

    if (!campo) return;

    let pesquisa = campo.value.toLowerCase();

    let produtos = document.querySelectorAll(".produto-coluna");

    produtos.forEach(produto => {

        let nome = produto.dataset.nome.toLowerCase();

        if (nome.includes(pesquisa)) {

            produto.style.display = "";

        } else {

            produto.style.display = "none";

        }

    });

}


// ==========================================
// ADICIONAR PRODUTO AO PEDIDO
// ==========================================

let botoesPedido = document.querySelectorAll(".adicionarPedido");

botoesPedido.forEach(botao => {

    botao.addEventListener("click", function () {

        quantidadePedidos++;

        let contadorPedido = document.getElementById("contadorPedido");

        if (contadorPedido) {

            contadorPedido.textContent = quantidadePedidos;

        }

        salvarDados();

        alert("Produto adicionado ao pedido!");

    });

});


// ==========================================
// AVALIAÇÕES
// ==========================================

function atualizarAvaliacoes() {

    let lista = document.getElementById("listaAvaliacoes");

    if (!lista) return;

    lista.innerHTML = "";

    avaliacoes.forEach(avaliacao => {

        let li = document.createElement("li");

        li.textContent =
            avaliacao.nota + " estrelas - " + avaliacao.comentario;

        lista.appendChild(li);

    });

}


let btnAvaliar = document.getElementById("btnAvaliar");

if (btnAvaliar) {

    btnAvaliar.addEventListener("click", function () {

        let nota = document.getElementById("notaAvaliacao");
        let comentario = document.getElementById("comentarioAvaliacao");

        if (!nota || !comentario) return;

        if (comentario.value.trim() === "") {

            alert("Digite um comentário!");

            return;

        }

        let avaliacao = {

            nota: nota.value,
            comentario: comentario.value.trim()

        };

        avaliacoes.push(avaliacao);

        // Mantém somente as últimas 10 avaliações

        if (avaliacoes.length > 10) {

            avaliacoes.shift();

        }

        comentario.value = "";

        atualizarAvaliacoes();

        salvarDados();

        alert("Obrigado pela avaliação!");

    });

}


// ==========================================
// AGENDAMENTOS
// ==========================================

function atualizarAgendamentos() {

    let lista = document.getElementById("listaAgendamentos");

    if (!lista) return;

    lista.innerHTML = "";

    agendamentos.forEach(agendamento => {

        let li = document.createElement("li");

        li.textContent =
            agendamento.nome + " - " +
            agendamento.data + " às " +
            agendamento.hora;

        lista.appendChild(li);

    });

}


let btnAgendar = document.getElementById("btnAgendar");

if (btnAgendar) {

    btnAgendar.addEventListener("click", function () {

        let nome = document.getElementById("nomeAgendamento");
        let data = document.getElementById("dataAgendamento");
        let hora = document.getElementById("horaAgendamento");

        if (!nome || !data || !hora) return;

        if (
            nome.value.trim() === "" ||
            data.value === "" ||
            hora.value === ""
        ) {

            alert("Preencha todos os campos do agendamento!");

            return;

        }

        let agendamento = {

            nome: nome.value.trim(),
            data: data.value,
            hora: hora.value

        };

        agendamentos.push(agendamento);

        nome.value = "";
        data.value = "";
        hora.value = "";

        atualizarAgendamentos();

        salvarDados();

        alert("Agendamento realizado!");

    });

}


// ==========================================
// NOTÍCIAS
// ==========================================

function atualizarNoticias() {

    let area = document.getElementById("areaNoticias");

    if (!area) return;

    area.innerHTML = "";

    noticias.forEach(noticia => {

        let p = document.createElement("p");

        p.textContent = noticia;

        area.appendChild(p);

    });

}


let btnAdicionarNoticia = document.getElementById("btnAdicionarNoticia");

if (btnAdicionarNoticia) {

    btnAdicionarNoticia.addEventListener("click", function () {

        let campo = document.getElementById("novaNoticia");

        if (!campo || campo.value.trim() === "") {

            alert("Digite uma notícia!");

            return;

        }

        noticias.push(campo.value.trim());

        campo.value = "";

        atualizarNoticias();

        salvarDados();

    });

}


// ==========================================
// PROMOÇÕES
// ==========================================

function atualizarPromocoes() {

    let area = document.getElementById("areaPromocoes");

    if (!area) return;

    if (promocoes.length === 0) {

        area.textContent = "Nenhuma promoção cadastrada.";

        return;

    }

    area.textContent = promocoes[indicePromocao];

}


let btnAdicionarPromocao = document.getElementById("btnAdicionarPromocao");

if (btnAdicionarPromocao) {

    btnAdicionarPromocao.addEventListener("click", function () {

        let campo = document.getElementById("novaPromocao");

        if (!campo || campo.value.trim() === "") {

            alert("Digite uma promoção!");

            return;

        }

        promocoes.push(campo.value.trim());

        campo.value = "";

        indicePromocao = promocoes.length - 1;

        atualizarPromocoes();

        salvarDados();

    });

}


// Alternar promoções automaticamente

setInterval(function () {

    if (promocoes.length > 0) {

        indicePromocao++;

        if (indicePromocao >= promocoes.length) {

            indicePromocao = 0;

        }

        atualizarPromocoes();

    }

}, 5000);


// ==========================================
// UNIDADES DA HAMBURGUERIA
// ==========================================

let filiais = {

    centro: {

        nome: "Unidade Centro",
        endereco: "Rua Exemplo, 100 - Centro",
        telefone: "(11) 4000-0000",
        horario: "Segunda a domingo, das 18h às 23h"

    },

    norte: {

        nome: "Unidade Norte",
        endereco: "Avenida Exemplo, 200 - Norte",
        telefone: "(11) 4000-0001",
        horario: "Segunda a domingo, das 18h às 23h"

    },

    sul: {

        nome: "Unidade Sul",
        endereco: "Rua Exemplo, 300 - Sul",
        telefone: "(11) 4000-0002",
        horario: "Segunda a domingo, das 18h às 23h"

    }

};


function alterarFilial() {

    let seletor = document.getElementById("selecionarFilial");

    if (!seletor) return;

    let filial = filiais[seletor.value];

    if (!filial) return;

    let nome = document.getElementById("nomeFilial");
    let endereco = document.getElementById("enderecoFilial");
    let telefone = document.getElementById("telefoneFilial");
    let horario = document.getElementById("horarioFilial");

    if (nome) nome.textContent = filial.nome;

    if (endereco) endereco.textContent = filial.endereco;

    if (telefone) telefone.textContent = filial.telefone;

    if (horario) horario.textContent = filial.horario;

}


let selecionarFilial = document.getElementById("selecionarFilial");

if (selecionarFilial) {

    selecionarFilial.addEventListener("change", alterarFilial);

}


// ==========================================
// TRADUÇÃO
// ==========================================

let traducoes = {

    pt: {

        cardapio: "Cardápio",
        clientes: "Clientes",
        agendamento: "Agendamento",
        promocoes: "Promoções",
        sobre: "Sobre nós",
        adicionar: "Adicionar ao pedido",
        chamar: "Chamar próximo cliente",
        finalizar: "Finalizar atendimento"

    },

    en: {

        cardapio: "Menu",
        clientes: "Customers",
        agendamento: "Scheduling",
        promocoes: "Promotions",
        sobre: "About us",
        adicionar: "Add to order",
        chamar: "Call next customer",
        finalizar: "Finish service"

    },

    es: {

        cardapio: "Menú",
        clientes: "Clientes",
        agendamento: "Agendamiento",
        promocoes: "Promociones",
        sobre: "Sobre nosotros",
        adicionar: "Agregar al pedido",
        chamar: "Llamar al siguiente cliente",
        finalizar: "Finalizar atención"

    }

};


function alterarIdioma() {

    let seletor = document.getElementById("idioma");

    if (!seletor) return;

    let idioma = seletor.value;

    let textos = traducoes[idioma];

    if (!textos) return;

    let links = document.querySelectorAll(".navegacao a");

    links.forEach(link => {

        let destino = link.getAttribute("href");

        if (destino === "#cardapio") link.textContent = textos.cardapio;

        if (destino === "#clientes") link.textContent = textos.clientes;

        if (destino === "#agendamento") link.textContent = textos.agendamento;

        if (destino === "#promocoes") link.textContent = textos.promocoes;

        if (destino === "#sobre") link.textContent = textos.sobre;

    });

    document.querySelectorAll(".adicionarPedido").forEach(botao => {

        botao.textContent = textos.adicionar;

    });

    let chamar = document.getElementById("btnChamarProximo");

    if (chamar) chamar.textContent = textos.chamar;

    let finalizar = document.getElementById("btnFinalizar");

    if (finalizar) finalizar.textContent = textos.finalizar;

}


let seletorIdioma = document.getElementById("idioma");

if (seletorIdioma) {

    seletorIdioma.addEventListener("change", alterarIdioma);

}


// ==========================================
// CARREGAR INFORMAÇÕES AO ABRIR A PÁGINA
// ==========================================

function carregarPainel() {

    atualizarHistoricoClientes();

    atualizarClientesAtendidos();

    atualizarFilas();

    atualizarAvaliacoes();

    atualizarAgendamentos();

    atualizarNoticias();

    atualizarPromocoes();

    let contadorPedido = document.getElementById("contadorPedido");

    if (contadorPedido) {

        contadorPedido.textContent = quantidadePedidos;

    }

    alterarFilial();

    // Restaurar cliente que estava em atendimento

    if (clienteEmAtendimento !== null) {

        let clienteAtual = document.getElementById("clienteAtual");
        let nomeEmAtendimento = document.getElementById("nomeEmAtendimento");

        if (clienteAtual) {

            clienteAtual.textContent = clienteEmAtendimento.codigo;

        }

        if (nomeEmAtendimento) {

            nomeEmAtendimento.textContent = clienteEmAtendimento.nome;

        }

    }

}


// Executar quando a página carregar

carregarPainel();


// ==========================================
// ALTERNAR VÍDEOS AUTOMATICAMENTE
// ==========================================

let videosHamburgueria = [
    "videos/videoh1.mp4",
    "videos/videoh2.mp4",
    "videos/videoh3.mp4"
];

let indiceVideo = 0;

let videoHamburgueria = document.getElementById("videoHamburgueria");

if (videoHamburgueria) {

    videoHamburgueria.addEventListener("ended", function () {

        indiceVideo++;

        if (indiceVideo >= videosHamburgueria.length) {
            indiceVideo = 0;
        }

        videoHamburgueria.src = videosHamburgueria[indiceVideo];

        videoHamburgueria.play();

    });

}
