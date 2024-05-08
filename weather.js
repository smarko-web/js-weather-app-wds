import axios from "axios";

export function getWeather(lat, lon, timezone) {
    return axios.get(
    "https://api.open-meteo.com/v1/forecast?&hourly=temperature_2m,relativehumidity_2m,dewpoint_2m,apparent_temperature,precipitation_probability,precipitation,weathercode,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,precipitation_probability_max&current_weather=true&temperature_unit=fahrenheit&windspeed_unit=mph&precipitation_unit=inch&timeformat=unixtime",
        { 
            params: {
                latitude: lat,
                longitude: lon,
                timezone, 
            },
        }
    )
    .then(({ data }) => {
           return {
                current: parseCurrentWeather(data),
                daily: parseDailyWeather(data),
                hourly: parseHourlyWeather(data)
            }
         })
    }

 function parseCurrentWeather({ current_weather, daily, hourly }) {
    const {
        temperature: currentTemp,
        weathercode: iconCode, 
        windspeed: windSpeed,
    } = current_weather;
    
    const {
       sunrise: [sunRise],
       sunset: [sunSet],
        apparent_temperature_min: [minFeelsLike],
        apparent_temperature_max: [maxFeelsLike],
        temperature_2m_max:  [maxTemp],
        temperature_2m_min: [minTemp],
    } = daily;

    const { 
        dewpoint_2m: [dewPoint],
        relativehumidity_2m: [humidity],
        precipitation: [precipAmount],
        precipitation_probability: [chanceOfPrecip],
    } = hourly;
   
    return {
        currentTemp: Math.round(currentTemp),
        highTemp: Math.round(maxTemp),
        lowTemp:  Math.round(minTemp),
        highFeelsLike:  Math.round(maxFeelsLike),
        lowFeelsLike: Math.round(minFeelsLike),
        windSpeed: Math.round(windSpeed),
        precipAmount: Math.round(precipAmount * 100) / 100,
        chanceOfPrecip,
        dewPoint: Math.round(dewPoint),
        humidity,
        sunRise,
        sunSet,
        iconCode,
    }
}
function parseDailyWeather({ daily }) {
    return daily.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            minTemp: Math.round(daily.temperature_2m_min[index]),
            maxTemp: Math.round(daily.temperature_2m_max[index]),
            chanceOfPrecip: daily.precipitation_probability_max[index],
            iconCode: daily.weathercode[index],

        }
    })
}
function parseHourlyWeather({ hourly, current_weather }) {
    return hourly.time.map((time, index) => {
        return {
            timestamp: time * 1000,
            iconCode: hourly.weathercode[index],
            temp: Math.round(hourly.temperature_2m[index]),
            feelsLike: Math.round(hourly.apparent_temperature[index]),
            dewPoint: Math.round(hourly.dewpoint_2m[index]),
            precipAmount: Math.round(hourly.precipitation[index] * 100) / 100,
            chanceOfPrecip: hourly.precipitation_probability[index],
            humidity: hourly.relativehumidity_2m[index], 
            windSpeed: Math.round(hourly.windspeed_10m[index]),
        }
    }).filter(({ timestamp }) => timestamp >= current_weather.time * 1000)
}