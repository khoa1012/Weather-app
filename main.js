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
  const detailTempC = document.querySelector(".itemTempC");
  const detailTempF = document.querySelector(".itemTempF");
  const highTempC = document.querySelector(".highC");
  const highTempF = document.querySelector(".highF");
  const lowTempC = document.querySelector(".lowC");
  const lowTempF = document.querySelector(".lowF");
  cDegree.forEach((e) => {
    e.classList.toggle("tempCDis");
  });
  fDegree.forEach((e) => {
    e.classList.toggle("tempFDis");
  });
  if(detailTempC) detailTempC.classList.toggle("itemTempCDis");

  if(detailTempF)detailTempF.classList.toggle("itemTempFDis");

  if(highTempC)highTempC.classList.toggle("highCDis");

  if(highTempF)highTempF.classList.toggle("highFDis");

  if(lowTempC)lowTempC.classList.toggle("lowCDis");

  if(lowTempF)lowTempF.classList.toggle("lowFDis");
});

deleteBtn.addEventListener("click", () => {
  const getItems = document.querySelectorAll(".boardItem .deleteIcon");
  console.log(getItems);
  getItems.forEach((e) => {
    e.classList.toggle("deleteIconShow");
  });
  if (deleteBtn.textContent === "Delete" && getItems.length !== 0) {
    deleteBtn.textContent = "Done";
  } else {
    deleteBtn.textContent = "Delete";
  }
});
board.addEventListener("click", async (e) => {
  console.log(e);
  console.log(e.target);
  console.log(e.target.closest("div"));
  if (e.target.classList.contains("deleteIcon")) {
    const deleteTarget = e.target.closest("div");

    deleteTarget.remove();
    if (board.innerHTML === "") {
      deleteBtn.textContent = "Delete";
    }
    return;
  }
  const itemTarget = e.target.closest(".boardItem");

  if (itemTarget) {
    console.log(itemTarget);
    if (!itemTarget.classList.contains("view")) {
      itemTarget.classList.add("view");
      itemTarget.classList.add("popup");
      console.log(board.getBoundingClientRect().top);
      console.log(itemTarget.getBoundingClientRect().top);
      const distance =
        itemTarget.getBoundingClientRect().top -
        board.getBoundingClientRect().top;
      console.log(distance);
      itemTarget.style.setProperty("--startY", `${distance}px`);

      const testBtn = document.createElement("i");

      testBtn.setAttribute("class", "fa-solid fa-arrow-left goBack");
      board.style.overflow = "hidden";
      itemTarget.style.overflow = "hidden";
      const firstRow = itemTarget.querySelector(".boardItemFirst");
      const secondRow = itemTarget.querySelector(".boardItemSecond");
      const currentLat = secondRow.querySelector(".lat");
      const currentLon = secondRow.querySelector(".lon");
      firstRow.classList.add("noShow");
      secondRow.classList.add("noShow");
      itemTarget.append(testBtn);

      const currentRes = await fetch(
        `http://api.weatherapi.com/v1/forecast.json?key=${API_KEY}&q=${currentLat.textContent},${currentLon.textContent}&days=3&aqi=no&alerts=no`,
      );
      if (!currentRes.ok) {
        throw new Error(
          "something wrong when fetching when click on boardItem",
        );
      }
      const data = await currentRes.json();
      console.log(data);
      const itemTempC = document.createElement("span");
      itemTempC.setAttribute("class", "itemTempC");
      itemTempC.textContent = Math.round(data.current.temp_c);
      const itemTempF = document.createElement("span");
      itemTempF.textContent = Math.round(data.current.temp_f);
      itemTempF.setAttribute("class", "itemTempF itemTempFDis");
      const tempRow = document.createElement("div");
      tempRow.setAttribute("class", "tempRow");
      tempRow.append(itemTempC, itemTempF);
      const detailCity = document.createElement("h2");
      detailCity.setAttribute("class", "detailCity");
      detailCity.textContent = data.location.name;
      const detailCond = document.createElement("h2");
      detailCond.setAttribute("class", "detailCond");
      detailCond.textContent = data.current.condition.text;
      const detailData = document.createElement("div");
      detailData.setAttribute("class", "detailData");
      const highTemp = document.createElement("div");
      highTemp.setAttribute("class", "highTemp");
      const lowTemp = document.createElement("div");
      lowTemp.setAttribute("class", "lowTemp");
      const highInitial = document.createElement("span");
      highInitial.setAttribute("class", "highInitial");
      highInitial.textContent = `H: `;
      const lowInitial = document.createElement("span");
      lowInitial.setAttribute("class", "lowInitial");
      lowInitial.textContent = `L: `;
      const highC = document.createElement("span");
      highC.setAttribute("class", "highC");
      const highF = document.createElement("span");
      highF.setAttribute("class", "highF highFDis");
      const lowC = document.createElement("span");
      lowC.setAttribute("class", "lowC");
      const lowF = document.createElement("span");
      lowF.setAttribute("class", "lowF lowFDis");
      highC.textContent = Math.round(data.forecast.forecastday[0].day.maxtemp_c);
      lowC.textContent = Math.round(data.forecast.forecastday[0].day.mintemp_c);
      highF.textContent = Math.round(data.forecast.forecastday[0].day.maxtemp_f);
      lowF.textContent = Math.round(data.forecast.forecastday[0].day.mintemp_f);
      const highLowTempRow = document.createElement("div");
      highLowTempRow.setAttribute("class", "highLowTempRow");
      highTemp.append(highInitial, highC, highF);
      lowTemp.append(lowInitial, lowC, lowF);
      highLowTempRow.append(highTemp, lowTemp);

      const dayTemp = document.createElement("div");
      dayTemp.setAttribute("class","dayTemp");
      let hourTempArray = data.forecast.forecastday[0].hour;
      console.log(hourTempArray);

      detailData.append(detailCity, tempRow, detailCond, highLowTempRow);
      itemTarget.append(detailData);
      itemTarget.querySelector(".goBack").classList.add("moveUp");
      itemTarget.querySelector(".detailData").classList.add("moveUp");
      itemTarget.style.cursor = "auto";
    }
  }
  if (e.target.classList.contains("goBack")) {
    const backTarget = e.target.closest(".boardItem");
    backTarget.classList.remove("popup", "view");
    const firstRow = backTarget.querySelector(".boardItemFirst");
    const secondRow = backTarget.querySelector(".boardItemSecond");

    firstRow.classList.remove("noShow");
    secondRow.classList.remove("noShow");
    console.log("at here");
    const backBtn = backTarget.querySelector(".goBack");
    const removeData = backTarget.querySelector(".detailData");
    backBtn.remove();
    removeData.remove();
    board.style.overflow = "auto";
    backTarget.style.cursor = "pointer";
  }
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
      lat.setAttribute("class", "lat");
      const lon = document.createElement("p");
      lon.textContent = item.lon;
      lon.setAttribute("class", "lon");
      // resultHint.append(cityName, countryName);
      searchResult.append(resultHint);
      resultHint.addEventListener("click", async () => {
        console.log(resultHint);
        console.log(lat, lon);
        const res = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${API_KEY}&q=${lat.textContent},${lon.textContent}&days=3&aqi=no&alerts=no`,
        );
        if (!res.ok) {
          throw new Error(
            "something wrong when fetching when adding boardItem",
          );
        }
        const data = await res.json();
        console.log(data);
        console.log(
          data.current.condition.text,
          data.current.temp_c,
          data.current.temp_f,
        );
        const boardItem = document.createElement("div");
        boardItem.setAttribute("class", "boardItem delete");
        const boardItemFirst = document.createElement("div");
        boardItemFirst.setAttribute("class", "boardItemFirst");

        const cityName = document.createElement("span");
        cityName.setAttribute("class", "cityName");
        cityName.textContent = data.location.name;
        const tempC = document.createElement("span");
        tempC.setAttribute("class", "tempC");
        tempC.textContent = Math.round(data.current.temp_c);
        const tempF = document.createElement("span");
        tempF.setAttribute("class", "tempF tempFDis");
        tempF.textContent = Math.round(data.current.temp_f);

        const boardItemSecond = document.createElement("div");
        boardItemSecond.setAttribute("class", "boardItemSecond");
        const countryName = document.createElement("span");
        countryName.setAttribute("class", "countryName");
        countryName.textContent = data.location.country;
        const condition = document.createElement("span");
        condition.setAttribute("class", "condition");
        condition.textContent = data.current.condition.text;
        const text = condition.textContent.toLowerCase();
        const deleteIcon = document.createElement("button");
        deleteIcon.textContent = "X";
        deleteIcon.setAttribute("class", " deleteIcon");
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
        boardItemSecond.append(countryName, condition, lat, lon);
        boardItem.append(boardItemFirst, boardItemSecond, deleteIcon);
        if (deleteBtn.textContent === "Done") {
          deleteIcon.classList.toggle("deleteIconShow");
        }
        board.append(boardItem);
        searchBar.value = "";
        searchResult.style.display = "none";
        searchResult.innerHTML = "";
      });
    });
  }
}

//adding result into the board
