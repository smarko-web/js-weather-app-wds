import "./style.css";
import { getWeather } from "./weather";
import { ICON_MAP } from "./iconMap";
navigator.geolocation.getCurrentPosition(positionSuccess, positionFailure);

function positionSuccess({ coords }) {
  getWeather(
    coords.latitude,
    coords.longitude,
    Intl.DateTimeFormat().resolvedOptions().timeZone
  )
  .then(renderWeather)
  .catch(e => {
    console.error(e);
    alert("Error Getting Weather");
  })
}
function positionFailure() {
  alert("There was an error getting current location, please allow this site to use your location")
}
function renderWeather({ current, daily, hourly }) {
  renderCurrentWeather(current);
  renderDailyWeather(daily); 
  renderHourlyWeather(hourly);
  document.body.classList.remove('blurred')

  // console.log(splitHours(hourly, 6));
}
function setValue(selector, value, { parent = document } = {}) {
  parent.querySelector(`[data-${selector}]`).textContent = value;
}

function getIconUrl(iconCode) {
  return `icons/${ICON_MAP.get(iconCode)}.svg`;
}

const currentIcon = document.querySelector("[data-current-icon]");
function renderCurrentWeather(current) {
  currentIcon.src = getIconUrl(current.iconCode);
  setValue("current-temp", current.currentTemp);
  setValue("curent-high", current.highTemp);
  setValue("curent-fl-high", current.highFeelsLike);
  setValue("curent-fl-low", current.lowFeelsLike);
  setValue("curent-wind", current.windSpeed);
  setValue("curent-precip", current.precipAmount);
  setValue("curent-low", current.lowTemp);
  setValue("curent-dew-point", current.dewPoint);
  setValue("curent-humidity", current.humidity);
}

const DAY_FORMATTER = new Intl.DateTimeFormat(undefined, { weekday: "short" })
const dailySection = document.querySelector("[data-day-section]");
const dayCardTemplate = document.getElementById("day-card-template");
function renderDailyWeather(daily) {
  dailySection.innerHTML = "";
  daily.forEach(day => {
    const dayCardElement = dayCardTemplate.content.cloneNode(true);
    const precipSection = dayCardElement.querySelector('.day-card-precent');
    if (day.chanceOfPrecip > 0) {
      setValue("day-precip", day.chanceOfPrecip, { parent: dayCardElement });
    } else {
      precipSection.innerHTML = "";
    }
    setValue("day-date", DAY_FORMATTER.format(day.timestamp), { parent: dayCardElement });
    setValue("day-high", day.maxTemp, { parent: dayCardElement });
    setValue("day-low", day.minTemp, { parent: dayCardElement });
    dayCardElement.querySelector("[data-day-icon]").src = getIconUrl(day.iconCode);
    dailySection.append(dayCardElement);
  });
}

const HOUR_FORMATTER = new Intl.DateTimeFormat(undefined, { hour: "numeric" })
const hourlySection = document.querySelector("[data-hour-section]");
const hourRowTemplate = document.getElementById("hour-row-template");
function renderHourlyWeather(hourly) {
  hourlySection.innerHTML = "";

  const smallArrays = splitHours(hourly, 12);
  //first page
  appendRows(smallArrays[0]);

  // Pagination System 
  const loadMoreBtn = document.querySelector(".load-more");
  var index = 1;
  loadMoreBtn.addEventListener("click", () => {
    if (index < smallArrays.length) { 
      appendRows(smallArrays[index]);
      index++;
    } else {
      loadMoreBtn.classList.add("hidden");
    }
  });
  //back to top button
  const topBtn = document.querySelector(".btn-to-top");
  window.addEventListener("scroll", () => {
    if (window.pageYOffset > 100) {
      topBtn.classList.remove("hidden");
      topBtn.addEventListener("click", () => {
        window.scroll({
          top: 0,
          behavior: "smooth"
        });
      })
    } else {
      topBtn.classList.add("hidden");
    }
  })

  function appendRows(array) {
    array.forEach(hour => {
      const hourRowElement = hourRowTemplate.content.cloneNode(true);
      setValue("day", DAY_FORMATTER.format(hour.timestamp), { parent: hourRowElement});
      setValue("time",HOUR_FORMATTER.format(hour.timestamp) , { parent: hourRowElement});
      hourRowElement.querySelector("[data-icon]").src = getIconUrl(hour.iconCode);
      const tempButton = hourRowElement.querySelector("button");
      const tempOnly = hourRowElement.querySelector(".temp-only");
      if (hour.chanceOfPrecip > 0) {
        setValue("temp", hour.temp, { parent: hourRowElement });
        tempButton.classList.remove("hidden");
      } else {
        setValue("temp-no-precip", hour.temp, { parent: hourRowElement });
        tempOnly.classList.remove("hidden");
      }
      setValue("temp", hour.temp, { parent: hourRowElement });
      setValue("precip-percent", hour.chanceOfPrecip, { parent: hourRowElement });
      setValue("fl-temp", hour.feelsLike, { parent: hourRowElement });
      setValue("wind", hour.windSpeed, { parent: hourRowElement});
      setValue("precip-amount", hour.precipAmount, { parent: hourRowElement });
      setValue("humidity", hour.humidity, { parent: hourRowElement });
      setValue("dew-point", hour.dewPoint, { parent: hourRowElement }); 
      hourlySection.append(hourRowElement);
    });
    tableRowInteractive();
  }
  function tableRowInteractive() {
    
    const table = document.querySelector('.hour-section');
    for (var i = 0, row; row = table.rows[i]; i++) {
      const group = row.querySelectorAll('.temp-percent');
      const group2 = row.querySelectorAll('.dew-humidity-group-tr');
  
      group.forEach(element => {
        element.addEventListener("click", () => {
          toggleGroup(group[0], group[1])
        });
        const percentage = row.querySelector("[data-precip-percent]").innerHTML;
        if (percentage > 80) {
          element.classList.add("high");
        }
        else if(percentage > 50) {
          element.classList.add("medium");
        } 
        else if(percentage >= 20) {
          element.classList.add("low");
        } 
      })
      
        group2.forEach(element => {
          element.addEventListener("click", () => {
              toggleGroup(group2[0], group2[1])
          }
        );
        
        const label = element.querySelector(".label");
        const dewPointNumber = row.querySelector('[data-dew-point]').innerHTML;
  
        if (dewPointNumber >= 70) {
          label.classList.add("bad"); 
        }
        else if (dewPointNumber > 60) {
          label.classList.add("normal");
        }
        else if (dewPointNumber > 50) {
          label.classList.add("good");
        }
        else if (dewPointNumber < 50) {
          label.classList.add("best");
        }
  
      })
    }
  }
  // split hours into small chunks

  function splitHours(hourArray, chunkSize) {
    const results = [];
    let index = 0;
    while (index < hourArray.length) {
      results.push(hourArray.slice(index, index + chunkSize));
      index += chunkSize;
    }
    return results;
  }  
}





// change wind to precip, and change huminity to dew point

function toggleGroup(group, group2, className = "hidden") {
  group.classList.toggle(className);
  group2.classList.toggle(className);
}

 const precipWindGroup = document.querySelectorAll('.precip-wind-group');
 const dewHumidityGroup = document.querySelectorAll('.dew-humidity-group');

precipWindGroup.forEach(element => {
  element.addEventListener("click", () => {toggleGroup(precipWindGroup[0], precipWindGroup[1])})
});

dewHumidityGroup.forEach(element => {
  element.addEventListener("click", () => {toggleGroup(dewHumidityGroup[0], dewHumidityGroup[1])})
});

// const dewPointButton = document.querySelector(".dew-humidity-group-tr");
// const label = dewPointButton.querySelector(".label");
// const dewPointNumber = document.querySelector('[data-hour-dew-point]').innerHTML;

// console.log(dewPointNumber);

// if (dewPointNumber > 70) {
//   label.classList.add("bad"); 
// }
// else if (dewPointNumber > 60) {
//   label.classList.add("normal");
// }
// else if (dewPointNumber > 50) {
//   label.classList.add("good");
// }
// else if (dewPointNumber < 50) {
//   label.classList.add("best");
// }

// console.log(label);




