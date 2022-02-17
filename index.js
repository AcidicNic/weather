import { 
  // getWeatherCallback, 
  getWeatherPromise,

} from './weather-api.js';

// Get Element references
const tempEl = document.getElementById('temp')
const descEl = document.getElementById('desc')
const formEl = document.getElementById('form')
const zipInput = document.getElementById('zip')

function updateWeatherResults(res) {
  tempEl.innerHTML = res.main.temp;
  descEl.innerHTML = res.weather[0].description;
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

  getWeatherPromise('a76a06211fa14de22228d74eda2fa7bc', zip)
  .then( (weatherJson) => {
    updateWeatherResults(weatherJson);
  })
  .catch( (err) => handleErr(err) );
});