const getUVtext = (uvIndex) => {
    const uvRecomendations = [
        'no hay radiación UV',
        'no necesitas protección',
        'no necesitas protección',
        'te recomendamos usar protección',
        'te recomendamos usar protección',
        'te recomendamos usar protección',
        'es necesario usar protección',
        'es necesario usar protección',
        'mantente a la sombra',
        'mantente a la sombra',
        'mantente a la sombra',
        '¡NO SALGAS!',
    ];
    return `índice U.V. de ${uvIndex}, ${uvRecomendations[uvIndex]}`;
};

const makeWeatherObject = ({ createCard, info }) => {
    if (!createCard) return { hasWeather: createCard, message: info };

    const now = new Date().getHours();
    const { current } = info;
    const today = info.forecast.forecastday;

    const getHourForecast = (until, weatherKey, weatherInfo) =>
        now + until >= 24
            ? weatherKey[1].hour[now + until - 24][weatherInfo]
            : weatherKey[0].hour[now + until][weatherInfo];

    return {
        hasWeather: true,

        location: info.location.name,
        region: info.location.region,
        country: info.location.country,

        today: {
            temp: {
                current: current.temp_c,
                min: today[0].day.mintemp_c,
                max: today[0].day.maxtemp_c,
                feels: current.feelslike_c,
                heatInd: today[0].hour[now].heatindex_c,
            },
            condition: current.condition.text,
            rain: today[0].day.daily_chance_of_rain,
            snow: today[0].day.daily_will_it_snow,
            uv: getUVtext(current.uv),
            airCuality: current.air_quality['us-epa-index'],

            nextHour: {
                temp: getHourForecast(1, today, 'temp_c'),
                rain: getHourForecast(1, today, 'chance_of_rain'),
                snow: getHourForecast(1, today, 'chance_of_snow'),
                condition: getHourForecast(1, today, 'condition').text,
            },
            next2Hours: {
                temp: getHourForecast(2, today, 'temp_c'),
                rain: getHourForecast(2, today, 'chance_of_rain'),
                snow: getHourForecast(2, today, 'chance_of_snow'),
                condition: getHourForecast(2, today, 'condition').text,
            },
            next3Hours: {
                temp: getHourForecast(3, today, 'temp_c'),
                rain: getHourForecast(3, today, 'chance_of_rain'),
                snow: getHourForecast(3, today, 'chance_of_snow'),
                condition: getHourForecast(3, today, 'condition').text,
            },
        },

        tomorrow: {
            temp: {
                min: today[1].day.mintemp_c,
                max: today[1].day.maxtemp_c,
                avg: today[1].day.avgtemp_c,
            },
            condition: today[1].day.condition.text,
            rain: today[1].day.daily_chance_of_rain,
            snow: today[1].day.daily_will_it_snow,
        },
    };
};

export default makeWeatherObject;
