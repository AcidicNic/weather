import {
  WeatherAPI,
  prettyTime,
} from './weather-api.js';

// Get Element references
const cityEle = document.getElementById('city');
const timeEle = document.getElementById('datetime');
const weatherEle = document.getElementById('weather');
const descEle = document.getElementById('desc');
const iconEles = document.getElementsByClassName('icon');
const tempEle = document.getElementById('temp');
const feelsLikeEle = document.getElementById('feelsLike');
const tempMinEle = document.getElementById('tempMin');
const tempMaxEle = document.getElementById('tempMax');
const pressureEle = document.getElementById('pressure');
const humidityEle = document.getElementById('humidity');
const visibilityEle = document.getElementById('visibility');
const sunsetEle = document.getElementById('sunset');
const sunriseEle = document.getElementById('sunrise');
const coordsEle = document.getElementById('coords');

const resultDiv = document.getElementById('results');

const zipInput = document.getElementById('zipInput');
const cityIdInput = document.getElementById('cityIdInput');
const cityInput = document.getElementById('cityInput');
const coordsInput = document.getElementById('coordsInput');
const zipForm = document.getElementById('zipForm');
const cityForm = document.getElementById('cityForm');
const cityIdForm = document.getElementById('cityIdForm');
const coordsForm = document.getElementById('coordsForm');

function updateWeatherResults(w) {
  const now = new Date();
  resultDiv.style.display = 'block';
  cityEle.innerHTML = `${w.locationName}, ${w.country}`;
  timeEle.innerHTML = `${new Date(w.datetime*1000).toLocaleDateString([], {weekday: 'short', month: 'short', day: 'numeric'})} at ${prettyTime(w.datetime)}`;
  weatherEle.innerHTML = w.weather;
  descEle.innerHTML = w.desc;
  [...iconEles].forEach( (iconEle) => {
    iconEle.src = w.iconUrl;
  })
  tempEle.innerHTML = `${Math.floor(w.temp)} ${w.tempUnit}`;
  feelsLikeEle.innerHTML = `${Math.floor(w.tempFeelsLike)} ${w.tempUnit}`;
  tempMinEle.innerHTML = `${Math.floor(w.tempMin)} ${w.tempUnit}`;
  tempMaxEle.innerHTML = `${Math.floor(w.tempMax)} ${w.tempUnit}`;
  pressureEle.innerHTML = `${w.pressure} hPa`;
  humidityEle.innerHTML = `${w.humidity}%`;
  visibilityEle.innerHTML = `${(w.visibility/1000).toFixed(1)} km`;
  if (w.sunset < now) {
    sunsetEle.innerHTML = `<b>Sunset was at:</b> ${prettyTime(w.sunset)}`;
  } else {
    sunsetEle.innerHTML = `<b>Sunset is at:</b> ${prettyTime(w.sunset)}`;
  }
  if (w.sunset < now) {
    sunriseEle.innerHTML = `<b>Sunrise was at:</b> ${prettyTime(w.sunrise)}`;
  } else {
    sunriseEle.innerHTML = `<b>Sunrise is at:</b> ${prettyTime(w.sunrise)}`;
  }
  coordsEle.innerHTML = `${w.lon.toFixed(3)}, ${w.lat.toFixed(3)}`;
}

const weatherApi = new WeatherAPI('a76a06211fa14de22228d74eda2fa7bc');

// Define event listeners
zipForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const zip = zipInput.value;

  weatherApi.getWeatherByZip(zip)
  .then( (weatherObj) => {
    updateWeatherResults(weatherObj);
    localStorage.setItem('location', weatherObj.locationName);
    zipInput.value = '';
  })
  .catch( (err) => console.log(err) );
});

cityForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value;

  weatherApi.getWeatherByCity(city.split(','))
  .then( (weatherObj) => {
    updateWeatherResults(weatherObj);
    localStorage.setItem('location', weatherObj.locationName);
    cityInput.value = '';
  })
  .catch( (err) => console.log(err) );
});

cityIdForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const cityId = cityIdInput.value;

  weatherApi.getWeatherById(cityId)
  .then( (weatherObj) => {
    updateWeatherResults(weatherObj);
    localStorage.setItem('location', weatherObj.locationName);
    cityIdInput.value = '';
  })
  .catch( (err) => console.log(err) );
});

coordsForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const coords = coordsInput.value;

  weatherApi.getWeatherByGeo(coords.split(','))
  .then( (weatherObj) => {
    updateWeatherResults(weatherObj);
    localStorage.setItem('location', weatherObj.locationName);
    coordsInput.value = '';
  })
  .catch( (err) => console.log(err) );
});

// Get location from local storage (default is SF)
const localStorage = window.localStorage;
let defaultLocation = localStorage.getItem('location');
if (!defaultLocation) {
  defaultLocation = 'san francisco';
}

function updateWeather() {
  weatherApi.getWeatherByCity(defaultLocation)
  .then( (weatherObj) => {
    updateWeatherResults(weatherObj);
  })
  .catch( (err) => console.log(err) );
}
updateWeather();

// update the weather into every 5 minutes
setInterval(updateWeather, 5 * 60000);