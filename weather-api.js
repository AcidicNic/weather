/**
 * weather-api.js
 */

/**
 * weatherInterface Class
 */
export class WeatherInterface {
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

export class WeatherAPI {
	/**
	 * OpenWeatherMap API Wrapper Constructor
	 * @param  {String} apiKey your OpenWeatherMap API key
	 * @param {Object} options { units='imperial', lang='en' }
	 */
	constructor(apiKey, options = {}) {
		this.apiKey = apiKey;
		this.units = options.units || 'imperial';
		this.lang = options.lang || 'en';
	}
	
	async getWeather(zip) {
		const url = `https://api.openweathermap.org/data/2.5/weather?appid=${this.apiKey}&units=${this.units}&lang=${this.lang}&zip=${zip}`;
		const res = await fetch(url);
		const weatherJson = await res.json();
		// Handle Err
		if (weatherJson.cod !== 200) {
			return Promise.reject({ name: 'Invalid Zip Code', message: 'Try Again' });
		}
		return await new WeatherInterface(weatherJson);
	}
}

/**
 * get Weather via callback
 */
export function getWeatherCallback(apiKey, zip, weatherCallback, errCallback, units='imperial', lang='en') {
	const path = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lang=${lang}&units=${units}&zip=${zip}`;
	fetch(path)
		.then(res => res.json())
		.then(weatherJson => {
			if (weatherJson.cod !== 200) {
				return errCallback({ name: 'Invalid Zip Code', message: 'Try Again' });
			}

			weatherCallback(new WeatherInterface(weatherJson));
		})
	.catch(err => errCallback(err));
}
// */

/**
 * get Weather via promise
 */
export const getWeather = async (apiKey, zip, units='imperial', lang='en') => {
	const path = `https://api.openweathermap.org/data/2.5/weather?appid=${apiKey}&lang=${lang}&units=${units}&zip=${zip}`;
	const res = await fetch(path);
	const weatherJson = await res.json();
	// Handle Err
	if (weatherJson.cod !== 200) {
		return Promise.reject({ name: 'Invalid Zip Code', message: 'Try Again' });
	}
	return await new WeatherInterface(weatherJson);
}
// */