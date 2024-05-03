const getTime = (hour) => {
    if (hour < 6) return 'noche';
    if (hour < 8) return 'amanecer';
    if (hour < 12) return 'mañana';
    if (hour < 14) return 'medio día';
    if (hour < 18) return 'tarde';
    if (hour < 19) return 'anochecer';
    return 'noche';
};

const getUVtext = [
    'UV: 0, no hay radiación',
    'UV: 1, no necesitas protección',
    'UV: 2, no necesitas protección',
    'UV: 3, te recomendamos usar protección',
    'UV: 4, te recomendamos usar protección',
    'UV: 5, te recomendamos usar protección',
    'UV: 6, es necesario usar protección',
    'UV: 7, es necesario usar protección',
    'UV: 8, mantente a la sombra',
    'UV: 9, mantente a la sombra',
    'UV: 10, mantente a la sombra',
    'UV: 11, ¡NO SALGAS!',
];

const airDescription = [
    'AC: 1, Buena calidad del aire',
    'AC: 2, Calidad del aire aceptable',
    'AC: 3, Aire poco saludable para las personas más sensibles',
    'AC: 4, Aire poco saludable',
    'AC: 5, El aire no es saludable',
    'AC: 6, El aire es tóxico',
];

const makeWeatherObject = ({ createCard, info }) => {
    if (!createCard) return { hasWeather: createCard, message: info };

    const hour = new Date().getHours();
    const { current } = info;
    const today = info.forecast.forecastday;

    const getHourForecast = (until, key) =>
        hour + until >= 24
            ? today[1].hour[hour + until - 24][key]
            : today[0].hour[hour + until][key];

    return {
        hasWeather: true,

        time: getTime(hour),
        location: info.location.name,
        region: info.location.region,
        country: info.location.country,

        today: {
            temp: {
                current: current.temp_c,
                min: today[0].day.mintemp_c,
                max: today[0].day.maxtemp_c,
                feels: current.feelslike_c,
                heatInd: today[0].hour[hour].heatindex_c,
            },
            condition: current.condition.text,
            rain: today[0].day.daily_chance_of_rain,
            snow: today[0].day.daily_will_it_snow,
            uv: getUVtext[current.uv],
            ac: airDescription[current.air_quality['us-epa-index'] - 1],

            nextHour: {
                temp: getHourForecast(1, 'temp_c'),
                rain: getHourForecast(1, 'chance_of_rain'),
                snow: getHourForecast(1, 'chance_of_snow'),
                condition: getHourForecast(1, 'condition').text,
            },
            next2Hours: {
                temp: getHourForecast(2, 'temp_c'),
                rain: getHourForecast(2, 'chance_of_rain'),
                snow: getHourForecast(2, 'chance_of_snow'),
                condition: getHourForecast(2, 'condition').text,
            },
            next3Hours: {
                temp: getHourForecast(3, 'temp_c'),
                rain: getHourForecast(3, 'chance_of_rain'),
                snow: getHourForecast(3, 'chance_of_snow'),
                condition: getHourForecast(3, 'condition').text,
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
