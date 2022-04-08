import debounce from "lodash.debounce";
import "./css/styles.css";
import fetchCountries from "./fetchCountries.js";
import Notiflix from "notiflix";

const DEBOUNCE_DELAY = 300;
const inputEl = document.querySelector("#search-box");
const countryUl = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");
// Слушатель на инпут
inputEl.addEventListener("input", debounce(createResponse, DEBOUNCE_DELAY));
// Функция создающая и отправляющая запрос на сервер
function createResponse(evt) {
  //Сбрасываем хтмл при отправке
  eraseHtml();
  //Если строка пустая не отправляем запрос
  if (evt.target.value === "") {
    return;
  }
  //Вызываем функцию для создания запроса
  fetchCountries(evt.target.value)
    //Если все ок создаем разметку с помощью функции
    .then(getResponseData)
    // Если все плохо ловим ошибку
    .catch(onError);
}
//Функция для обработки данных из запроса
function getResponseData(data) {
  //Длинна массива
  const dataLength = data.length;
  //Если массив слишком длинный кидаем ошибку
  if (dataLength > 10) {
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
    return;
  }
  //Если в массиве больше двух и не больше 10ти, создаем разметку
  if (dataLength >= 2 && dataLength <= 10) {
    countryUl.insertAdjacentHTML("beforeend", countryListMarkUp(data));
    return;
  }
  //Иначе создаем разметку для одной странны
  countryInfo.insertAdjacentHTML("beforeend", countryInfoMarkUp(data));
}
//Функция для создания списка стран
function countryListMarkUp(data) {
  return data
    .map(
      obj =>
        `<li class="list__item"><img class="ul__img" src="${obj.flags.svg}" alt="${obj.name.official}">
        <h2 class="list__title">${obj.name.official}</h2></li>`
    )
    .join("");
}
//Функция для создания карточки одной странны
function countryInfoMarkUp(data) {
  return data
    .map(
      obj =>
        `
      <div class="wrapper">
        <img class="img" src="${obj.flags.svg}" alt="${obj.name.official}">
        <h2 class="title">${obj.name.official}</h2>
      </div>
      <p class="description">Capital: <span class="description__span">${obj.capital}</span></p>
      <p class="description">Population: <span class="description__span">${obj.population}</span></p>
      <p class="description">Languages: <span class="description__span">${countryLanguagesList(obj.languages)}</span></p>
      `
    )
    .join("");
}
//Вынимаем список языков из обьекта в респонсе
function countryLanguagesList(data) {
  return Object.values(data).join(", ");
}
//Сообщение об ошибке
function onError() {
  Notiflix.Notify.failure("Oops, there is no country with that name");
}
//Стираем ХТМЛ
function eraseHtml() {
  countryInfo.innerHTML = "";
  countryUl.innerHTML = "";
}
