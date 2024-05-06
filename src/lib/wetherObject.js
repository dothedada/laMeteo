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
    'No hay información sobre U.V.',
    'UV: 1, minimo de radiación',
    'UV: 2, normal',
    'UV: 3, podrías usar bloqueador +30',
    'UV: 4, es mejor que uses bloqueador',
    'UV: 5, usa bloqueador +30',
    'UV: 6, usa bloqueador +50',
    'UV: 7, usa bloqueador +50',
    'UV: 8, usa un bloqueador fuerte',
    'UV: 9, mantente a la sombra',
    'UV: 10, usa bloqueador y evita salir',
    'UV: 11, ¡NO SALGAS!',
];

const airDescription = [
    'AC: 1, el aire está bien',
    'AC: 2, el aire está aceptable',
    'AC: 3, el aire está poco saludable',
    'AC: 4, el aire está poco muy saludable',
    'AC: 5, el aire no es saludable',
    'AC: 6, el aire está tóxico',
];

const makeWeatherConditionLines = (weatherCondition) => {
    const weatherWords = weatherCondition.split(' ');
    if (weatherWords.length < 2) return weatherCondition;

    const line1 = weatherWords
        .slice(0, Math.ceil(weatherWords.length / 2))
        .join(' ');
    const line2 = weatherWords
        .slice(Math.ceil(weatherWords.length / 2))
        .join(' ');

    return [line1, line2];
};

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
        time: getTime(hour),
        lat: info.location.lat,
        lon: info.location.lon,

        now: [
            [
                `${info.location.name}`,
                `${info.location.region} ${info.location.country}`,
            ],
            `${current.temp_c}°`,
            [
                `${today[0].day.mintemp_c}° min`,
                `${today[0].day.maxtemp_c}° max`,
            ],
            [`${current.feelslike_c}°`, 'Sensación térmica'],
            [`${today[0].hour[hour].heatindex_c}°`, 'Índice calor'],
            makeWeatherConditionLines(current.condition.text),
            [
                `${getHourForecast(0, 'chance_of_rain')}% lluvia`,
                getHourForecast(0, 'chance_of_snow')
                    ? `${getHourForecast(0, 'chance_of_snow')}% nieve`
                    : '',
            ],
            [
                getUVtext[current.uv],
                airDescription[current.air_quality['us-epa-index'] - 1],
            ],
        ],
        nextHour: [
            ['En una hora', `${getHourForecast(1, 'temp_c')}°`],
            makeWeatherConditionLines(getHourForecast(1, 'condition').text),
            [
                `${getHourForecast(1, 'chance_of_rain')}% lluvia`,
                getHourForecast(1, 'chance_of_snow')
                    ? `${getHourForecast(1, 'chance_of_snow')}% nieve`
                    : '',
            ],
        ],
        next2Hours: [
            ['En dos horas', `${getHourForecast(2, 'temp_c')}°`],
            makeWeatherConditionLines(getHourForecast(2, 'condition').text),
            [
                `${getHourForecast(2, 'chance_of_rain')}% lluvia`,
                getHourForecast(2, 'chance_of_snow')
                    ? `${getHourForecast(2, 'chance_of_snow')}% nieve`
                    : '',
            ],
        ],
        next3Hours: [
            ['En tres horas', `${getHourForecast(3, 'temp_c')}°`],
            makeWeatherConditionLines(getHourForecast(3, 'condition').text),
            [
                `${getHourForecast(3, 'chance_of_rain')}% lluvia`,
                getHourForecast(3, 'chance_of_snow')
                    ? `${getHourForecast(3, 'chance_of_snow')}% nieve`
                    : '',
            ],
        ],
        tomorrow: [
            ['Mañana', `${today[1].day.avgtemp_c}°`],
            [
                `${today[1].day.mintemp_c}° min`,
                `${today[1].day.maxtemp_c}° max`,
            ],
            makeWeatherConditionLines(today[1].day.condition.text),
            [
                `${today[1].day.daily_chance_of_rain}% lluvia`,
                today[1].day.daily_chance_of_snow
                    ? `${today[1].day.daily_chance_of_snow}% nieve`
                    : '',
            ],
        ],
    };
};

export default makeWeatherObject;
