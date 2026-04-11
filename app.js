const from = document.getElementById("from");
const to = document.getElementById("to");
const amount = document.getElementById("amount");
const result = document.getElementById("result");

const fromFlag = document.getElementById("fromFlag");
const toFlag = document.getElementById("toFlag");

// 🚀 LOAD 150+ CURRENCIES
async function loadCurrencies() {
  let res = await fetch(
    "https://open.er-api.com/v6/latest/USD",
  );
  let data = await res.json();

  let codes = Object.keys(data.rates);

  codes.forEach((code) => {
    from.add(new Option(code, code));
    to.add(new Option(code, code));
  });

  from.value = "USD";
  to.value = "INR";

  updateFlag();
  convertCurrency();
}

// 🏳️ FLAGS
function updateFlag() {
  fromFlag.src = `https://flagsapi.com/${from.value.slice(0, 2)}/flat/64.png`;
  toFlag.src = `https://flagsapi.com/${to.value.slice(0, 2)}/flat/64.png`;
}

// 💰 CONVERT
async function convertCurrency() {
  let amt = amount.value || 1;

  let res = await fetch(
    `https://open.er-api.com/v6/latest/${from.value}`,
  );
  let data = await res.json();

  let rate = data.rates[to.value];
  let final = amt * rate;

  let text = `${amt} ${from.value} = ${final.toFixed(2)} ${to.value}`;
  result.innerText = text;

  addToHistory(text);
}

// 🔁 SWAP
document
  .getElementById("swap")
  .addEventListener("click", () => {
    let temp = from.value;
    from.value = to.value;
    to.value = temp;
    updateFlag();
    convertCurrency();
  });

// 🔍 SEARCH
function filterDropdown(inputId, selectId) {
  const input = document.getElementById(inputId);
  const select = document.getElementById(selectId);

  input.addEventListener("input", () => {
    const filter = input.value.toUpperCase();
    const options = select.options;

    for (let i = 0; i < options.length; i++) {
      let txt = options[i].text;
      options[i].style.display = txt.includes(filter)
        ? ""
        : "none";
    }
  });
}

filterDropdown("searchFrom", "from");
filterDropdown("searchTo", "to");

// ⚡ AUTO CONVERT
amount.addEventListener("input", convertCurrency);
from.addEventListener("change", () => {
  updateFlag();
  convertCurrency();
});
to.addEventListener("change", () => {
  updateFlag();
  convertCurrency();
});

// 🌙 DARK MODE
document
  .getElementById("toggleTheme")
  .addEventListener("click", () => {
    document.body.classList.toggle("dark");
  });

// 📊 HISTORY
function addToHistory(text) {
  const li = document.createElement("li");
  li.innerText = text;
  document.getElementById("history").prepend(li);
}

// 🗑️ CLEAR HISTORY
document
  .getElementById("clearHistory")
  .addEventListener("click", () => {
    document.getElementById("history").innerHTML = "";
  });

// 🚀 START
loadCurrencies();
