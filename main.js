let inputFromText = document.querySelector(".from-text");
let inputFromNumber = document.querySelector(".from-number");
let inputToText = document.querySelector(".to-text");
let inputToNumber = document.querySelector(".to-number");
let button = document.querySelector("button");
let Price = document.querySelector(".price span");
let ulFrom = document.querySelector(".ul-from");
let ulTo = document.querySelector(".ul-to");
let currencyFrom = document.querySelector(".currency-from");
let currencyTo = document.querySelector(".currency-to");
let info = document.querySelector(".info");

let data;

// Fetch the data from the API and store it in the 'data' variable
async function fetchDataFromAPI() {
  try {
    let response = await fetch(
      "https://api.currencyfreaks.com/v2.0/rates/latest?apikey=7852d8b2b79d403884a5de7dc8966167"
    );
    data = await response.json();
  } catch (error) {
    console.error("Fetch error:", error);
  }
}

// Call the function to fetch the data
fetchDataFromAPI();

inputToNumber.addEventListener("input", function () {
  handleinputTo();
  calcTo();
});

inputFromNumber.addEventListener("input", function () {
  handleinputFrom();
  calcFrom();
});

inputToText.addEventListener("input", function () {
  handleAddAndRemoveOfTo();
  let keys = Object.keys(data.rates);
  if (keys.includes(inputToText.value.toUpperCase())) {
    if (inputToNumber.value) {
      calcTo();
    } else {
      calcFrom();
    }
  }
});

inputFromText.addEventListener("input", function () {
  handleAddAndRemoveOfFrom();
  let keys = Object.keys(data.rates);
  if (keys.includes(inputFromText.value.toUpperCase())) {
    if (inputFromNumber.value) {
      calcFrom();
    } else {
      calcTo();
    }
  }
});

document.addEventListener("click", removeLis);

function handleAddAndRemoveOfFrom() {
  inputFromText.value = inputFromText.value
    .split("")
    .filter((str) => {
      return isNaN(parseInt(str));
    })
    .join("");
  let keys = Object.keys(data.rates);
  keys = keys.filter(
    (key) =>
      key.startsWith(inputFromText.value.toUpperCase()) &&
      inputFromText.value !== ""
  );
  ulFrom.innerHTML = "";
  for (i = 0; i < keys.length; i++) {
    let li = document.createElement("li");
    li.innerHTML = keys[i];
    li.className = "from";
    ulFrom.append(li);
    ulFrom.style.display = "inline";
  }
  if (!inputFromText.value) {
    ulFrom.style.display = "none";
  }
}

function handleAddAndRemoveOfTo() {
  inputToText.value = inputToText.value
    .split("")
    .filter((str) => {
      return isNaN(parseInt(str));
    })
    .join("");
  let keys = Object.keys(data.rates);
  keys = keys.filter(
    (key) =>
      key.startsWith(inputToText.value.toUpperCase()) &&
      inputToText.value !== ""
  );
  ulTo.innerHTML = "";
  for (i = 0; i < keys.length; i++) {
    let li = document.createElement("li");
    li.innerHTML = keys[i];
    ulTo.append(li);
    ulTo.style.display = "inline";
  }
  if (!inputToText.value) {
    ulTo.style.display = "none";
  }
}

function handleinputFrom() {
  inputFromNumber.value = inputFromNumber.value
    .split("")
    .filter((num) => {
      return !isNaN(parseInt(num));
    })
    .join("");
}

function handleinputTo() {
  inputToNumber.value = inputToNumber.value
    .split("")
    .filter((num) => {
      return !isNaN(parseInt(num));
    })
    .join("");
}

function removeLis(e) {
  if (e.target.nodeName === "LI") {
    if (e.target.className === "from") {
      inputFromText.value = e.target.innerHTML;
      currencyFrom.textContent = inputFromText.value;
      ulFrom.style.display = "none";
      handleAddAndRemoveOfFrom();
      let keys = Object.keys(data.rates);
      if (keys.includes(inputFromText.value.toUpperCase())) {
        calcFrom();
      }
    } else {
      inputToText.value = e.target.innerHTML;
      currencyTo.textContent = e.target.innerHTML;
      ulTo.style.display = "none";
      handleAddAndRemoveOfTo();
      let keys = Object.keys(data.rates);
      if (keys.includes(inputToText.value.toUpperCase())) {
        calcFrom();
      }
    }
  }
}

function calcTo() {
  ulFrom.innerHTML = "";
  ulTo.innerHTML = "";
  let keys = Object.keys(data.rates);
  if (keys.includes(inputFromText.value.toUpperCase())) {
    currencyFrom.textContent = inputFromText.value.toUpperCase();
  }
  if (keys.includes(inputToText.value.toUpperCase())) {
    currencyTo.textContent = inputToText.value.toUpperCase();
  }
  let inputValue = inputFromNumber.value;
  inputFromNumber.value = Math.round(
    (inputToNumber.value / data.rates[inputToText.value.toUpperCase()]) *
      data.rates[inputFromText.value.toUpperCase()]
  );
  if (
    inputFromNumber.value === "NaN" ||
    (inputFromNumber.value === "0" && !inputFromText.value)
  ) {
    inputFromNumber.value = inputValue;
  } else {
    info.textContent = ` 1 ${inputToText.value.toUpperCase()} = ${(
      (1 / data.rates[inputToText.value.toUpperCase()]) *
      data.rates[inputFromText.value.toUpperCase()]
    ).toFixed(3)} ${inputFromText.value.toUpperCase()}`;
  }
}

function calcFrom() {
  ulFrom.innerHTML = "";
  ulTo.innerHTML = "";

  let keys = Object.keys(data.rates);
  if (keys.includes(inputFromText.value.toUpperCase())) {
    currencyFrom.textContent = inputFromText.value.toUpperCase();
  }
  if (keys.includes(inputToText.value.toUpperCase())) {
    currencyTo.textContent = inputToText.value.toUpperCase();
  }
  let inputValue = inputToNumber.value;
  inputToNumber.value = Math.round(
    (inputFromNumber.value / data.rates[inputFromText.value.toUpperCase()]) *
      data.rates[inputToText.value.toUpperCase()]
  );
  if (inputToNumber.value === "NaN" || inputToNumber.value === "0") {
    inputToNumber.value = inputValue;
  } else {
    info.textContent = ` 1 ${inputFromText.value.toUpperCase()} = ${(
      (1 / data.rates[inputFromText.value.toUpperCase()]) *
      data.rates[inputToText.value.toUpperCase()]
    ).toFixed(3)} ${inputToText.value.toUpperCase()}`;
  }
}
