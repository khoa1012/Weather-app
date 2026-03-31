// Search page
const app = document.getElementById("app");
app.setAttribute("class", "appDayColor");
const container = document.createElement("div");
container.setAttribute("id", "container");
const title = document.createElement("h1");
title.setAttribute("id", "title");
title.textContent = "How the weather today?";
app.append(title);
const searchBar = document.createElement("input");
searchBar.type = "text";
searchBar.placeholder = "Search...";
searchBar.autocomplete = "off";
searchBar.setAttribute("id", "searchBar");
const board = document.createElement("div");
board.setAttribute("id", "board");
app.append(container);

//time toggle
const time = Temporal.Now.plainTimeISO();
const hour = time.hour.toString();
console.log(hour);
console.log(Number(hour) + "num");
if (Number(hour) >= 17) {
  app.classList.add("appNightColor");
  app.classList.remove("appDayColor");
} else {
  app.classList.add("appDayColor");
  app.classList.remove("appNightColor");
}

//search bar
const searchWrap = document.createElement("div");
searchWrap.setAttribute("id", "searchWrap");
const searchIcon = document.createElement("i");
searchIcon.setAttribute("class", "fa-solid fa-magnifying-glass searchIcon");
const searchResult = document.createElement("div");
searchResult.setAttribute("id", "searchResult");
searchWrap.append(searchBar, searchIcon, searchResult);
const funcRow = document.createElement("div");
funcRow.setAttribute("id", "funcRow");
const deleteBtn = document.createElement("button");
deleteBtn.textContent = "Delete";
deleteBtn.setAttribute("class", "deleteBtn btn");
const changeUnit = document.createElement("button");
changeUnit.textContent = "°C <> °F";
changeUnit.setAttribute("class", "changeUnit btn");

changeUnit.addEventListener("click", (e) => {
  const cDegree = document.querySelectorAll(".boardItem .tempC");
  const fDegree = document.querySelectorAll(".boardItem .tempF");

  cDegree.forEach((e) => {
    e.classList.toggle("tempCDis");
  });
  fDegree.forEach((e) => {
    e.classList.toggle("tempFDis");
  });
});
funcRow.append(deleteBtn, changeUnit);
container.append(searchWrap, funcRow, board);
const API_KEY = "06e03d2dd9ea477db7c210549262803";
async function findPlace(keyword) {
  const res = await fetch(
    `http://api.weatherapi.com/v1/search.json?key=${API_KEY}&q=${keyword}&days=3&aqi=no&alerts=no`,
  );
  if (!res.ok) {
    throw new Error("something wrong when fetching");
  }
  const data = await res.json();
  return data;
}
let timeout;
searchBar.addEventListener("keyup", async (e) => {
  clearTimeout(timeout);
  timeout = setTimeout(async () => {
    if (searchBar.value == "") {
      searchResult.innerHTML = "";
    } else {
      try {
        const result = await findPlace(searchBar.value);
        getResultBoard(result);
      } catch (error) {
        throw error;
      }
    }
  }, 500);
});
searchBar.addEventListener("focus", () => {
  searchResult.style.display = "block";
});
document.addEventListener("click", (e) => {
  if (!searchBar.contains(e.target) && !searchResult.contains(e.target)) {
    searchResult.style.display = "none";
  }
});
function getResultBoard(result) {
  searchResult.innerHTML = "";
  console.log(result);
  if (result.length === 0) {
  } else {
    result.forEach((item) => {
      const resultHint = document.createElement("div");
      resultHint.setAttribute("class", "resultHint");

      resultHint.textContent = `${item.name}, ${item.country}`;
      const lat = document.createElement("p");
      lat.textContent = item.lat;
      const lon = document.createElement("p");
      lon.textContent = item.lon;
      // resultHint.append(cityName, countryName);
      searchResult.append(resultHint);
      resultHint.addEventListener("click", async () => {
        console.log(resultHint);
        console.log(lat, lon);
        const res = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat.textContent},${lon.textContent}&days=3&aqi=no&alerts=no`,
        );
        const data = await res.json();
        console.log(data);
        console.log(
          data.current.condition.text,
          data.current.temp_c,
          data.current.temp_f,
        );
        const boardItem = document.createElement("div");
        boardItem.setAttribute("class", "boardItem");
        const boardItemFirst = document.createElement("div");
        boardItemFirst.setAttribute("class", "boardItemFirst");

        const cityName = document.createElement("span");
        cityName.setAttribute("class", "cityName");
        cityName.textContent = data.location.name;
        const tempC = document.createElement("span");
        tempC.setAttribute("class", "tempC");
        tempC.textContent = data.current.temp_c;
        const tempF = document.createElement("span");
        tempF.setAttribute("class", "tempF tempFDis");
        tempF.textContent = data.current.temp_f;

        const boardItemSecond = document.createElement("div");
        boardItemSecond.setAttribute("class", "boardItemSecond");
        const countryName = document.createElement("span");
        countryName.setAttribute("class", "countryName");
        countryName.textContent = data.location.country;
        const condition = document.createElement("span");
        condition.setAttribute("class", "condition");
        condition.textContent = data.current.condition.text;
        const text = condition.textContent.toLowerCase();

        if (text.includes("sunny")) {
          boardItem.classList.add("sunny");
        } else if (
          text.includes("cloud") ||
          text.includes("overcast") ||
          text.includes("fog") ||
          text.includes("mist")
        ) {
          boardItem.classList.add("cloud");
        } else if (
          text.includes("rain") ||
          text.includes("drizzle") ||
          text.includes("thunder")
        ) {
          boardItem.classList.add("rain");
        } else if (
          text.includes("snow") ||
          text.includes("ice") ||
          text.includes("blizzard")
        ) {
          boardItem.classList.add("snow");
        } else if (text.includes("clear")) {
          boardItem.classList.add("clear");
        }

        boardItemFirst.append(cityName, tempC, tempF);
        boardItemSecond.append(countryName, condition);
        boardItem.append(boardItemFirst, boardItemSecond);
        board.append(boardItem);
        searchBar.value = "";
        searchResult.style.display = "none";
        searchResult.innerHTML="";
      });
    });
  }
}

//adding result into the board
