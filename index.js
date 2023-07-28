const API_WEATHER_KEY = "63412008219fb63574ctadofe09b6581";
const API_URL_BASE = "https://api.shecodes.io/weather/v1";

const temperatureElement = document.querySelector("#temperature");
const cityElement = document.querySelector("#currentCity");
const descriptionElement = document.querySelector("#description");
const windElement = document.querySelector("#wind");
const humidityElement = document.querySelector("#humidity");
const dateElement = document.querySelector("#date");
const iconElement = document.querySelector("#icon");
const cityInputElement = document.querySelector("#city-input");
const form = document.querySelector("#search-form");
const forecastElement = document.querySelector("#forecast");

function handleSubmit(event) {
  event.preventDefault();
  search(cityInputElement.value);
}
function search(city) {
  let currentUrl = `${API_URL_BASE}/current?query=${city}&key=${API_WEATHER_KEY}`;
  let forecastUrl = `${API_URL_BASE}/forecast?query=${city}&key=${API_WEATHER_KEY}`;
  axios.get(currentUrl).then(displayTemperature);
  axios.get(forecastUrl).then(displayForecast);
}

function displayTemperature(response) {
  let celsiusTemperature = response.data.temperature.current;
  cityElement.innerHTML = response.data.city;
  descriptionElement.innerHTML = response.data.condition.description;
  humidityElement.innerHTML = response.data.temperature.humidity;

  temperatureElement.innerHTML = Math.round(celsiusTemperature);
  windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
  dateElement.innerHTML = formatDate(response.data.time * 1000);

  iconElement.setAttribute("src", `${response.data.condition.icon_url}`);
  iconElement.setAttribute("alt", response.data.condition.description);
}

function formatDate(timestamp) {
  let date = new Date(timestamp);
  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }
  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[date.getDay()];
  return `${day} ${hours}:${minutes}`;
}

function displayForecast(response) {
  console.log(response);

  let forecastDataDaily = response.data.daily;
  let forecastDays = forecastDataDaily.slice(0, 4);
  let forecastHTML = "";
  let shortDay;

  forecastDays.forEach(function (day) {
    shortDay = formatDate(day.time * 1000).slice(0, 3);
    forecastHTML =
      forecastHTML +
      `
    <div class="col-2">
      <div class="weather-item">
        <div class="weather-forecast-date">${shortDay}</div>
        <img
          src="${day.condition.icon_url}"
          alt=""
          width="80"
        />
        <div class="weather-forecast-temperature">
          <span class="weather-temperature-max">${Math.round(
            day.temperature.maximum
          )} C  º</span>
          <span class="weather-temperature-min">${Math.round(
            day.temperature.minimum
          )} Cº</span>
        </div>
      </div>
    </div>
  `;
  });
  forecastElement.innerHTML = forecastHTML;
}

form.addEventListener("submit", handleSubmit);

search("New York");
