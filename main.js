// Search page
const app = document.getElementById("app");
app.setAttribute("class", "appDayColor");
const container = document.createElement("div");
container.setAttribute("id", "container");
const title = document.createElement("h1");
title.setAttribute("id", "title");
title.textContent ="How the weather today?"
app.append(title);
const searchBar = document.createElement("input");
searchBar.type = "text";
searchBar.placeholder = "Search..."
searchBar.setAttribute("id", "searchBar");
const board = document.createElement("div");
board.setAttribute("id", "board");
app.append(container);

//time toggle
const time = Temporal.Now.plainTimeISO();
const hour = time.hour.toString();
console.log(hour);
console.log(Number(hour) + "num");
if (Number(hour) >= 15) {
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
searchIcon.setAttribute("class","fa-solid fa-magnifying-glass searchIcon")
searchWrap.append(searchBar, searchIcon);
container.append(searchWrap,board);
