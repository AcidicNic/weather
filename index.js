/**
 * getWeather()
 */

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
	if (weatherJson.cod !== 200) {
		return Promise.reject({ name: 'Invalid Zip Code', message: 'Try Again' });
	}
	return weatherJson
}