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
container.append(searchWrap, board);
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
searchBar.addEventListener("focus",()=>{
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
      searchResult.append(resultHint);
    });
  }
}
