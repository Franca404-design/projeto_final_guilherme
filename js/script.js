let size = 5, mines = 3, bet = 10, balance = 1000;
let board = [], revealed = 0, active = false;

const $ = id => document.getElementById(id);
const boardEl = $('board');

function placeMines(size, mines) {
  const total = size * size;
  const arr = Array(total).fill(0);
  let c = 0;

  while (c < mines) {
    let i = Math.floor(Math.random() * total);
    if (arr[i] === 0) {
      arr[i] = 1;
      c++;
    }
  }

  const m = [];
  for (let r = 0; r < size; r++) {
    m[r] = [];
    for (let c2 = 0; c2 < size; c2++) {
      m[r][c2] = { mine: arr[r * size + c2] === 1, revealed: false };
    }
  }

  return m;
}

function render() {
  boardEl.innerHTML = "";
  boardEl.style.gridTemplateColumns = `repeat(${size}, 1fr)`;

  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      let cell = board[r][c];
      let el = document.createElement("div");
      el.className = "cell";

      if (cell.revealed) {
        el.classList.add("revealed");
        if (cell.mine) {
          el.classList.add("mine");
          el.innerHTML = '<img src="img/errado.jpg">';
        
        }
        else {
    el.innerHTML = '<img src="img/certo.png">';
}

      }

      el.onclick = () => onClick(r, c);
      boardEl.appendChild(el);
    }
  }
}

function start() {
  bet = parseInt($('betInput').value) || 1;

  if (bet > balance) {
    log("Saldo insuficiente.");
    return;
  }

  balance -= bet;
  size = parseInt($('sizeSelect').value);
  mines = parseInt($('minesSelect').value);

  board = placeMines(size, mines);
  revealed = 0;
  active = true;

  $('balance').textContent = balance;
  $('currentBet').textContent = bet;

  render();
  log("Partida iniciada!");
}

function onClick(r, c) {
  if (!active) return;

  let cell = board[r][c];
  if (cell.revealed) return;

  cell.revealed = true;

  if (cell.mine) {
    active = false;
    revealAll();
    render();
    log("Explodiu!");
    return;
  }

  revealed++;
  render();
}

function revealAll() {
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      board[r][c].revealed = true;
    }
  }
}

function collect() {
  if (!active) {
    log("Nada a coletar.");
    return;
  }

  let win = Math.floor(bet * (1 + revealed * 0.3));
  balance += win;

  $('balance').textContent = balance;
  active = false;

  revealAll();
  render();
  log("Coletado: " + win);
}

function log(t) {
  $('log').textContent = t;
}

$('startBtn').onclick = start;
$('cashoutBtn').onclick = collect;
