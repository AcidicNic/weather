/**
 * weather-api.js
 */

/**
 * WeatherInterface Class
 */
export class WeatherInterface {
	constructor(jsonRes, units) {
		this.locationName = jsonRes.name;
		this.country = jsonRes.sys.country;
		this.timezone = jsonRes.timezone;
		this.datetime = jsonRes.dt;
		this.units = units;

		this.weather = jsonRes.weather[0].main;
		this.desc = jsonRes.weather[0].description;
		this.iconUrl = `http://openweathermap.org/img/wn/${jsonRes.weather[0].icon}@2x.png`;

		this.temp = jsonRes.main.temp;
		this.tempFeelsLike = jsonRes.main.feels_like;
		this.tempMin = jsonRes.main.temp_min;
		this.tempMax = jsonRes.main.temp_max;
		this.pressure = jsonRes.main.pressure;
		this.humidity = jsonRes.main.humidity;
		this.visibility = jsonRes.visibility;

		if (units === 'imperial') this.tempUnit = '°F';
		else this.tempUnit = '°C';

		this.sunset = jsonRes.sys.sunset;
		this.sunrise = jsonRes.sys.sunrise;
		this.lon = jsonRes.coord.lon;
		this.lat = jsonRes.coord.lat;
	}
}

/**
 * WeatherAPI Class
 */
export class WeatherAPI {
	/**
	 * OpenWeatherMap API Wrapper Constructor
	 * @param {String} apiKey your OpenWeatherMap API key
	 * @param {Object} options { units='imperial', lang='en' }
	 */
	constructor(apiKey, options = {}) {
		this.apiKey = apiKey;
		this.units = options.units || 'imperial';
		this.lang = options.lang || 'en';
	}
	
	/**
	 * Set apiKey
	 * @param {String} apiKey your OpenWeatherMap API key
	 */
	setApiKey(apiKey) {
		this.apiKey = apiKey || '';
	}

	/**
	 * Set options
	 * @param {Object} options { units='imperial', lang='en' }
	 */
	setOptions(options) {
		this.units = options.units || 'imperial';
		this.lang = options.lang || 'en';
	}
	
	/**
	 * Set units
	 * @param {String} units 'standard', 'metric' or 'imperial'
	 */
	setUnits(units='imperial') {
		this.units = units;
	}
	
	/**
	 * Set language
	 * @param {String} lang a two letter language code. (List of valid lang codes: https://openweathermap.org/current#multi)
	 */
	setLang(lang='en') {
		this.lang = lang;
	}
	
	/**
	 * Get base API url
	 * @returns {String} url to OpenWeatherMap API with apiKey and options added.
	 */
	getBaseURL() {
		return `https://api.openweathermap.org/data/2.5/weather?appid=${this.apiKey}&units=${this.units}&lang=${this.lang}`;
	}

	/**
	 * Get weather by zip code
	 * @param {String} zip a valid zip Code
	 * @returns {WeatherInterface} weather data
	 */
	async getWeatherByZip(zip) {
		const urlParams = `&zip=${zip}`;
		return await this._callAPI(urlParams, {msg: `Couldn't find location with zip code: ${zip}`});
	}

	/**
	 * Get weather by city name
	 * @param {String} city a valid city name
	 * @param {String} state (optional) a valid US state code. ('CA', 'OR', etc.)
	 * @param {String} country (optional) a valid two char country code.
	 * @returns {WeatherInterface} weather data
	 */
	async getWeatherByCity(city, state=undefined, country=undefined) {
		let urlParams = `${this.getBaseURL()}&q=${city}`;
		if (state) urlParams += `,${state}`;
		if (country) urlParams += `,${country}`;
		return await this._callAPI(urlParams, {msg: `Couldn't find city: ${city} ${state || ''} ${country || ''}`});
	}
	
	/**
	 * Get weather by geo coords
	 * @param {Object} coords {lon: Number | String, lat: Number | String}
	 * @returns {WeatherInterface} weather data
	 */
	async getWeatherByGeo(coords) {
		const urlParams = `&lon=${coords.lon}&lat=${coords.lat}`;
		return await this._callAPI(urlParams, {msg: `Couldn't find location with coords: ${coords}`});
	}
	
	/**
	 * Get weather by city ID
	 * @param {String} cityId (List of valid city Ids: http://bulk.openweathermap.org/sample/)
	 * @returns {WeatherInterface} weather data
	 */
	async getWeatherById(cityId) {
		const urlParams = `&id=${cityId}`;
		return await this._callAPI(urlParams, {msg: `Couldn't find city with Id: ${cityId}`});
	}

	async _callAPI(urlParams, err) {
		try {
			const url = `${this.getBaseURL()}${urlParams}`;
			const res = await fetch(url);
			const weatherJson = await res.json();
			if (weatherJson.cod !== 200) {
				return Promise.reject({...err, data: weatherJson});
			}
			return await new WeatherInterface(weatherJson, this.units);
		} catch (err) {
			console.log(err);
			return Promise.reject(err);
		}
	}
}

export const prettyTime = (datetime) => {
	const prettyTime = new Date(datetime*1000)
		.toLocaleTimeString([], {
			hour: '2-digit',
			minute: '2-digit',
			hour12: true,
		});
	
	if (prettyTime.substring(0, 1) === '0') {
		return prettyTime.substring(1);
	}
	return prettyTime
}

/**
 * get Weather via callback
 *./
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
 *./
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
