import {
  getWeatherCallback,
  getWeather,
  WeatherAPI
} from './weather-api.js';

// Get Element references
const tempEl = document.getElementById('temp')
const descEl = document.getElementById('desc')
const formEl = document.getElementById('form')
const zipInput = document.getElementById('zip')

function updateWeatherResults(weatherObj) {
  tempEl.innerHTML = weatherObj.type;
  descEl.innerHTML = weatherObj.desc;
}
function handleErr(err) {
  tempEl.innerHTML = err.name;
  descEl.innerHTML = err.message;
}

// Define event listeners
formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  const zip = zipInput.value;

  // getWeatherCallback('a76a06211fa14de22228d74eda2fa7bc', zip, updateWeatherResults, handleErr);
  // getWeather('a76a06211fa14de22228d74eda2fa7bc', zip)
  // .then( (weatherObj) => {
  //   updateWeatherResults(weatherObj);
  // })
  // .catch( (err) => handleErr(err) );

  const weatherApi = new WeatherAPI('a76a06211fa14de22228d74eda2fa7bc');
  weatherApi.getWeather(zip)
  .then( (weatherObj) => {
    updateWeatherResults(weatherObj);
  })
  .catch( (err) => handleErr(err) );
});