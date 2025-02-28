// import
import API_KEY from "./config.js";
import country_list from "./country-list.js";

// select Elements
let dropList = document.querySelectorAll(".drop-list select");
let fromCurrency = document.querySelector(".from select");
let toCurrency = document.querySelector(".to select");
let getButton = document.querySelector("form button");

// make input just accept numbers
let input = document.querySelector(".myAmountInput");
input.addEventListener("input", () => {
  input.value = input.value.replace(/[^0-9]/, "");
});

for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    // add Default choice in the select tag USD And EGP
    let selected;
    if (i == 0) {
      selected = currency_code == "USD" ? "selected" : "";
    } else if (i == 1) {
      selected = currency_code == "EGP" ? "selected" : "";
    }
    // creating an option tag with passing currency code as a value and text
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    // insert the option tag inside select tag
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  });
}

function loadFlag(element) {
  for (let code in country_list) {
    if (code == element.value) {
      // if currency code of country list is equal to the option value
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://flagsapi.com/${country_list[code]}/flat/64.png`;
    }
  }
}

window.addEventListener("load", () => {
  getExchangeRate();
});

getButton.addEventListener("click", (e) => {
  e.preventDefault(); // to submit the form
  getExchangeRate();
});

const exchangeIcon = document.querySelector(".drop-list .icon");
exchangeIcon.addEventListener("click", () => {
  [fromCurrency.value, toCurrency.value] = [
    toCurrency.value,
    fromCurrency.value
  ];
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
});

function getExchangeRate() {
  const amount = document.querySelector(".amount input");
  let exchangerateText = document.querySelector(".exchange-rate");
  // if user add empty amount or zero
  if (amount.value == "" || amount.value == "0") {
    amount.value = "1";
  }
  exchangerateText.innerHTML = `Getting Exchange Rate...`;
  let url = `https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency.value}`;
  // fetch api response and returning it with parsing into js and in anthor then method receiving that obj
  fetch(url)
    .then((response) => response.json())
    .then((result) => {
      let exchangerate = result.conversion_rates[toCurrency.value];
      let totalExchangeRate = (amount.value * exchangerate).toFixed(2);
      exchangerateText.innerHTML = `${amount.value} ${fromCurrency.value} = ${totalExchangeRate} ${toCurrency.value}`;
    })
    .catch(() => {
      exchangerateText.innerHTML = "Something went wrong";
    });
}

console.log(fromCurrency.value);

/* 
  extra information 
   - for with in get key for array or object
   - for with of get value for array or object
   - insertAdjacentHTML() adds HTML next to an element, before/after or inside, without removing existing content.
     --position(optional) : beforebegin, afterbegin, beforeend, afterend
 */
