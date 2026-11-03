"use strict";

/* ЛР №4. Основы JavaScript
   Вариант 19. «Историк и реконструктор» — возраст артефактов в годах */

// ---------- Данные ----------
// 6 значений: возраст артефактов в годах (диапазон 100–5000)
const artifactAges = [120, 250, 780, 1450, 2300, 3200];

// Пороговые значения вынесены в константы
const ANCIENT_LIMIT = 1000; // «древние» — старше 1000 лет
const YOUNG_LIMIT = 300;    // «молодые» — не старше 300 лет
const VERY_ANCIENT = 3000;  // порог для дополнительного сообщения

// ---------- Функции ----------

// Максимум (самый старый артефакт)
function getMax(arr) {
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }
  return max;
}

// Фильтрация: артефакты старше заданного возраста
function filterOlderThan(arr, limit) {
  const result = [];
  for (const age of arr) {
    if (age > limit) {
      result.push(age);
    }
  }
  return result;
}

// Сумма элементов массива
function getSum(arr) {
  let sum = 0;
  for (const age of arr) {
    sum += age;
  }
  return sum;
}

// Средний возраст
function getAverage(arr) {
  return getSum(arr) / arr.length;
}

// Цикл по молодым артефактам (≤ 300 лет): количество и доля в процентах
function getYoungStats(arr, limit) {
  let count = 0;
  for (const age of arr) {
    if (age <= limit) {
      count++;
    }
  }
  const share = (count / arr.length) * 100;
  return { count, share };
}

// Запрос имени: prompt возвращает null при отмене, поэтому есть проверка
function askName() {
  const name = prompt("Как вас зовут?");
  if (name === null || name.trim() === "") {
    return "гость";
  }
  return name.trim();
}

// ---------- Основная логика ЛР №4 ----------
function main() {
  // Ввод / вывод: prompt + alert
  const name = askName();
  alert("Здравствуйте, " + name + "! Добро пожаловать в музей артефактов.");

  // Вычисления
  const maxAge = getMax(artifactAges);
  const ancient = filterOlderThan(artifactAges, ANCIENT_LIMIT);
  const average = getAverage(artifactAges);
  const young = getYoungStats(artifactAges, YOUNG_LIMIT);

  // Вывод: alert
  alert(
    "Средний возраст – " + Math.round(average) + " лет, " +
    ancient.length + " артефактов – древние"
  );

  // Вывод: console.log
  console.log("Возраст артефактов:", artifactAges);
  console.log("Самый старый артефакт:", maxAge, "лет");
  console.log("Древние артефакты (старше " + ANCIENT_LIMIT + " лет):", ancient);
  console.log("Сумма возрастов:", getSum(artifactAges));
  console.log(
    "Молодые артефакты (≤ " + YOUNG_LIMIT + " лет): " + young.count +
    " шт., доля – " + young.share.toFixed(1) + "%"
  );

  // Дополнительное условие
  if (maxAge > VERY_ANCIENT) {
    console.log("Среди находок есть по-настоящему древние артефакты!");
  }
}

/* ЛР №5. DOM и взаимодействие с элементами страницы
   Вариант 19. «Историк и реконструктор» — хронология событий */

// ---------- Ключи localStorage ----------
const EVENTS_KEY = "timelineEvents";
const THEME_KEY = "theme";

// Стартовые события (показываются, если в localStorage ещё ничего нет)
const defaultEvents = [
  { id: 1, year: "862", text: "Призвание варягов" },
  { id: 2, year: "988", text: "Крещение Руси" },
  { id: 3, year: "1242", text: "Ледовое побоище" }
];

// ---------- Поиск элементов ----------
const themeBtn = document.getElementById("themeBtn");
const addEventBtn = document.getElementById("addEventBtn");
const toggleBtn = document.getElementById("toggleBtn");
const timelineList = document.querySelector(".timeline-list");

// Текущий список событий
let events = [];

// ---------- Обработка ошибок ----------
// Проверяем, что все нужные элементы есть на странице
function checkElements() {
  const elements = {
    "#themeBtn": themeBtn,
    "#addEventBtn": addEventBtn,
    "#toggleBtn": toggleBtn,
    ".timeline-list": timelineList
  };

  for (const name in elements) {
    if (!elements[name]) {
      console.error("Элемент не найден: " + name);
      return false;
    }
  }
  return true;
}

// ---------- localStorage ----------
function loadEvents() {
  const saved = localStorage.getItem(EVENTS_KEY);
  if (saved === null) {
    return defaultEvents.slice();
  }

  try {
    const parsed = JSON.parse(saved);
    if (Array.isArray(parsed)) {
      return parsed;
    }
  } catch (error) {
    console.error("Не удалось прочитать события из localStorage:", error);
  }
  return defaultEvents.slice();
}

function saveEvents() {
  localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
}

// ---------- Карточки событий ----------
// Создаёт карточку: <article> → <time> → <p> → кнопка «Удалить»
function createEventCard(event) {
  const card = document.createElement("article");
  card.classList.add("event");
  card.setAttribute("data-id", event.id);

  const time = document.createElement("time");
  time.setAttribute("datetime", event.year.padStart(4, "0"));
  time.textContent = event.year + " г.";

  const text = document.createElement("p");
  text.textContent = event.text;

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Удалить";
  deleteBtn.addEventListener("click", function () {
    deleteEvent(event.id, card);
  });

  card.appendChild(time);
  card.appendChild(text);
  card.appendChild(deleteBtn);
  timelineList.appendChild(card);
}

// Считает карточки на странице через querySelectorAll
function showCount() {
  const cards = document.querySelectorAll(".event");
  console.log("Событий в хронологии:", cards.length);
}

function renderEvents() {
  for (const event of events) {
    createEventCard(event);
  }
  showCount();
}

// ---------- Добавление ----------
function addEvent() {
  const year = prompt("Год события (например, 1380):");
  if (year === null || year.trim() === "") {
    return;
  }
  if (!/^\d{1,4}$/.test(year.trim())) {
    alert("Год нужно ввести числом, например 1380");
    return;
  }

  const text = prompt("Что произошло?");
  if (text === null || text.trim() === "") {
    return;
  }

  const event = { id: Date.now(), year: year.trim(), text: text.trim() };
  events.push(event);
  createEventCard(event);
  saveEvents();
  showCount();
}

// ---------- Удаление ----------
function deleteEvent(id, card) {
  events = events.filter(function (event) {
    return event.id !== id;
  });
  card.remove();
  saveEvents();
  showCount();
}

// ---------- Скрытие / показ ----------
function toggleTimeline() {
  const isHidden = timelineList.classList.toggle("hidden");
  toggleBtn.textContent = isHidden ? "Развернуть хронологию" : "Свернуть хронологию";
}

// ---------- Тема ----------
function applyTheme(theme) {
  if (theme === "dark") {
    document.body.classList.add("theme-dark");
  } else {
    document.body.classList.remove("theme-dark");
  }
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("theme-dark");
  localStorage.setItem(THEME_KEY, isDark ? "dark" : "light");
}

// ---------- Запуск ----------
function init() {
  if (!checkElements()) {
    return;
  }

  applyTheme(localStorage.getItem(THEME_KEY));
  events = loadEvents();
  renderEvents();

  themeBtn.addEventListener("click", toggleTheme);
  addEventBtn.addEventListener("click", addEvent);
  toggleBtn.addEventListener("click", toggleTimeline);
}

// Сначала оживляем страницу (ЛР №5), потом приветствие и расчёты (ЛР №4)
init();
main();
