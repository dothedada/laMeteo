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
        time: getTime(hour),

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
            current.condition.text,
            [
                `${today[0].day.daily_chance_of_rain}% lluvia`,
                today[0].day.daily_will_it_snow
                    ? `${today[0].day.daily_will_it_snow}% nieve`
                    : '',
            ],
            [
                getUVtext[current.uv],
                airDescription[current.air_quality['us-epa-index'] - 1],
            ],
        ],
        nextHour: [
            `${getHourForecast(1, 'temp_c')}°`,
            getHourForecast(1, 'condition').text,
            [
                `${getHourForecast(1, 'chance_of_rain')}% lluvia`,
                getHourForecast(1, 'chance_of_snow')
                    ? `${getHourForecast(1, 'chance_of_snow')}% nieve`
                    : '',
            ],
        ],
        next2Hours: [
            `${getHourForecast(2, 'temp_c')}°`,
            getHourForecast(2, 'condition').text,
            [
                `${getHourForecast(2, 'chance_of_rain')}% lluvia`,
                getHourForecast(2, 'chance_of_snow')
                    ? `${getHourForecast(2, 'chance_of_snow')}% nieve`
                    : '',
            ],
        ],
        next3Hours: [
            `${getHourForecast(3, 'temp_c')}°`,
            getHourForecast(3, 'condition').text,
            [
                `${getHourForecast(3, 'chance_of_rain')}% lluvia`,
                getHourForecast(3, 'chance_of_snow')
                    ? `${getHourForecast(3, 'chance_of_snow')}% nieve`
                    : '',
            ],
        ],
        tomorrow: [
            `${today[1].day.avgtemp_c}°`,
            [
                `${today[1].day.mintemp_c}° min`,
                `${today[1].day.maxtemp_c}° max`,
            ],
            today[1].day.condition.text,
            [
                `${today[1].day.daily_chance_of_rain}% lluvia`,
                today[1].day.daily_will_it_snow
                    ? `${today[1].day.daily_will_it_snow}% nieve`
                    : '',
            ],
        ],
    };
};

export default makeWeatherObject;
