/**
 * weather-api.js
 */

/**
 * Weather Class
 */
export class Weather {
	constructor(jsonRes, units) {
		this.locationName = jsonRes.name;
		this.timezone = jsonRes.timezone;
		this.datetime = jsonRes.dt;
		this.units = units;

		this.type = jsonRes.weather[0].main;
		this.desc = jsonRes.weather[0].description;
		this.iconUrl = `http://openweathermap.org/img/wn/${jsonRes.weather[0].icon}@2x.png`;

		this.temp = jsonRes.main.temp;
		this.tempFeelsLike = jsonRes.main.feels_like;
		this.tempMin = jsonRes.main.temp_min;
		this.tempMax = jsonRes.main.temp_max;
		this.pressure = jsonRes.main.pressure;
		this.humidity = jsonRes.main.humidity;
		this.visibility = jsonRes.visibility;

		this.sunset = jsonRes.sys.sunset;
		this.sunrise = jsonRes.sys.sunrise;
		this.lon = jsonRes.coord.lon;
		this.lat = jsonRes.coord.lat;
	}
} 

// getWeather via callback
export function getWeatherCallback(apiKey, zip, weatherCallback, errCallback) {
	const units = 'imperial';
	const path = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&zip=${zip}&units=${units}`;
	fetch(path)
		.then(res => res.json())
		.then(json => {
			if (json.cod !== 200) {
				return errCallback({ name: 'Invalid Zip Code', message: 'Try Again' });
			}

			weatherCallback(json);
		})
	.catch(err => errCallback(err));
}

// getWeather via promise
export const getWeatherPromise = async (apiKey, zip) => {
	const units = 'imperial';
	const path = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&zip=${zip}&units=${units}`;
	const res = await fetch(path);
	const weatherJson = await res.json();
	// Handle Err
	if (weatherJson.cod !== 200) {
		return Promise.reject({ name: 'Invalid Zip Code', message: 'Try Again' });
	}
	return weatherJson
}