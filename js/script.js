// Tamanho da grade, quantidade de minas, aposta inicial e saldo do jogador
let size = 5, mines = 3, bet = 10, balance = 1000;

// Tabuleiro, células reveladas e status da partida
let board = [], revealed = 0, active = false;

// Atalho pra pegar elemento pelo ID
const $ = id => document.getElementById(id);
const boardEl = $('board');

// Função que cria o tabuleiro com minas distribuídas aleatoriamente
function placeMines(size, mines) {
  const total = size * size;     // Quantidade total de células
  const arr = Array(total).fill(0); // Array linear representando a grade
  let c = 0;

  // Coloca as minas em posições aleatórias sem repetir
  while (c < mines) {
    let i = Math.floor(Math.random() * total);
    if (arr[i] === 0) {
      arr[i] = 1;
      c++;
    }
  }

  // Converte o array linear para matriz 2D
  const m = [];
  for (let r = 0; r < size; r++) {
    m[r] = [];
    for (let c2 = 0; c2 < size; c2++) {
      m[r][c2] = { 
        mine: arr[r * size + c2] === 1, 
        revealed: false 
      };
    }
  }

  return m;
}

// Renderiza o tabuleiro na tela
function render() {
  boardEl.innerHTML = "";  // Limpa o tabuleiro
  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`; // Ajusta tamanho visual

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {

      let cell = board[r][c];
      let el = document.createElement("div");
      el.className = "cell";

      // Mostra conteúdo se a célula já foi revelada
      if (cell.revealed) {
        el.classList.add("revealed");

        if (cell.mine) {
          // Se for mina
          el.classList.add("mine");
          el.innerHTML = '<img src="img/errado.jpg">';
        } else {
          // Se não for mina
          el.innerHTML = '<img src="img/certo.png">';
        }
      }

      // Clique na célula
      el.onclick = () => onClick(r, c);

      boardEl.appendChild(el);
    }
  }
}

// Inicia uma nova partida
function start() {
  bet = parseInt($('betInput').value) || 1;

  // Verifica saldo
  if (bet > balance) {
    log("Saldo insuficiente.");
    return;
  }

  balance -= bet;
  size = parseInt($('sizeSelect').value);
  mines = parseInt($('minesSelect').value);

  // Cria novo tabuleiro
  board = placeMines(size, mines);
  revealed = 0;
  active = true;

  // Atualiza HUD
  $('balance').textContent = balance;
  $('currentBet').textContent = bet;

  render();
  log("Partida iniciada!");
}

// Quando clica em uma célula
function onClick(r, c) {
  if (!active) return;

  let cell = board[r][c];

  // Não faz nada se já foi revelada
  if (cell.revealed) return;

  cell.revealed = true;

  // Se clicou numa mina → perdeu
  if (cell.mine) {
    active = false;
    revealAll();
    render();
    log("Explodiu!");
    return;
  }

  // Senão, só conta como revelada
  revealed++;
  render();
}

// Revela o tabuleiro inteiro (quando explode ou coleta)
function revealAll() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      board[r][c].revealed = true;
    }
  }
}

// Função de coletar ganhos
function collect() {
  if (!active) {
    log("Nada a coletar.");
    return;
  }

  // Fórmula do ganho (tu pode mudar se quiser)
  let win = Math.floor(bet * (1 + revealed * 0.3));
  balance += win;

  $('balance').textContent = balance;
  active = false;

  revealAll();
  render();
  log("Coletado: " + win);
}

// Log de mensagens pro jogador
function log(t) {
  $('log').textContent = t;
}

// Eventos dos botões
$('startBtn').onclick = start;
$('cashoutBtn').onclick = collect;
