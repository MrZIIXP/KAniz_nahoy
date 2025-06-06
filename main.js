let total = 0;
let currentBet = 0;
let wonAmount = 0;

function initCasino() {
  total = promptAmount("Введите начальный баланс:");
  updateDisplay();
  checkBalance();
}

function promptAmount(message) {
  let value;
  do {
    value = prompt(message);
    if (value === null) return 0;
  } while (isNaN(value) || value.trim() === '');
  return parseFloat(value);
}

function updateDisplay() {
  document.getElementById("total").textContent = `Итог: ${total.toFixed(2)}$`;
  document.getElementById("current-bet").textContent = `Ставка: ${currentBet.toFixed(2)}$`;

  const debtDisplay = document.getElementById("debt");
  if (total < 0) {
    debtDisplay.style.display = "block";
    debtDisplay.textContent = `Долг: ${Math.abs(total).toFixed(2)}$`;
  } else {
    debtDisplay.style.display = "none";
  }
}к

function placeBet() {
  let bet = promptAmount("Введите сумму ставки:");
  if (bet > 0) {
    currentBet += bet;
    total -= bet;
    updateDisplay();
    checkBalance();
  }
}

function finishBet() {
  total += currentBet;
  currentBet = 0;
  updateDisplay();
  checkBalance();
}

function addBalance() {
  let add = promptAmount("Сколько хотите добавить?");
  if (add > 0) {
    total += add;
    updateDisplay();
    checkBalance();
  }
}

function spinSlot() {
  if (currentBet <= 0) return;
  const symbols = ['7', '💎', '🍒', '🍋'];
  const result = Array.from({length: 3}, () => symbols[Math.floor(Math.random() * symbols.length)]);
  document.getElementById("slot-grid").innerHTML = result.map(s => `<div>${s}</div>`).join('');
  let multiplier = 0;
  if (result.every(s => s === '7')) multiplier = 7;
  else if (result.every(s => s === '💎')) multiplier = 3;
  else if (result.every(s => s === '🍒')) multiplier = 2;
  else if (result.every(s => s === '🍋')) multiplier = 1.5;
  wonAmount = currentBet * multiplier;
  if (multiplier > 0) {
    alert(`Вы выиграли: ${wonAmount.toFixed(2)}!`);
    currentBet = wonAmount;
  } else {
    alert("Вы проиграли.");
    currentBet = 0;
  }
  updateDisplay();
  checkBalance();
}

function spinRoulette() {
  if (currentBet <= 0) return;

  let betColor = prompt("Введите цвет (красный / чёрный) или оставьте пустым:");
  if (betColor) betColor = betColor.toLowerCase().trim();
  if (betColor && betColor !== "красный" && betColor !== "чёрный") {
    alert("Цвет должен быть 'красный' или 'чёрный'");
    return;
  }

  let betNumberRaw = prompt("Введите число от 0 до 36 или оставьте пустым:");
  let betNumber = betNumberRaw ? parseInt(betNumberRaw) : null;
  if (betNumberRaw && (isNaN(betNumber) || betNumber < 0 || betNumber > 36)) {
    alert("Число должно быть от 0 до 36");
    return;
  }

  const resultNumber = Math.floor(Math.random() * 37);
  const colors = ["красный", "чёрный"];
  const resultColor = colors[Math.floor(Math.random() * 2)];

  document.getElementById("roulette-result").textContent = `Результат: ${resultNumber} ${resultColor}`;

  let win = true;

  if (betColor && betNumberRaw) {
    win = (resultColor === betColor && resultNumber === betNumber);
    wonAmount = win ? currentBet * 5 : 0;
  } else if (betColor) {
    win = (resultColor === betColor);
    wonAmount = win ? currentBet * 1.5 : 0;
  } else if (betNumberRaw) {
    win = (resultNumber === betNumber);
    wonAmount = win ? currentBet * 2 : 0;
  } else {
    wonAmount = 0;
    win = false;
  }

  if (win && wonAmount > 0) {
    alert(`Вы выиграли: ${wonAmount.toFixed(2)}!`);
    currentBet = wonAmount;
  } else {
    alert("Вы проиграли.");
    currentBet = 0;
  }

  updateDisplay();
  checkBalance();
}

function rollDice() {
  if (currentBet <= 0) return;
  const dice = Math.floor(Math.random() * 6) + 1; // Выпало число от 1 до 6
  document.getElementById("dice-result").textContent = `Результат: ${dice}`;
  if (dice < 6) {
    alert("Сумма меньше 6 — вы проиграли. Ставка аннулирована.");
    currentBet = 0;
  } else {
    wonAmount = (currentBet / 3) * dice;
    alert(`Выигрыш: ${wonAmount.toFixed(2)}!`);
    currentBet = wonAmount;
  }
  updateDisplay();
  checkBalance();
}


function checkBalance() {
  const buttons = ["bet-button", "finish-button", "slot-button", "roulette-button", "dice-button"];
  const inDebt = total < 0;

  for (let id of buttons) {
    const btn = document.getElementById(id);
    if (btn) {
      btn.disabled = false;
      btn.classList.toggle("negative", inDebt);
    }
  }

  if (total === 0) {
    if (confirm("Баланс 0$. Пожалуйста пополните его.")) {
      total += promptAmount("Введите сумму пополнения:");
      updateDisplay();
    }
  }

  // Если в минусе — запрашиваем оплату долга
  while (total < 0) {
    alert("Пожалуйста оплатите долг");
    total += promptAmount("Введите сумму для оплаты долга:");
    updateDisplay();
  }
}
