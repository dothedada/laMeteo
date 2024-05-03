const forecast = (from, until, weatherKey, weatherInfo) =>
    from + until >= 24
        ? weatherKey[1].hour[from + until - 24][weatherInfo]
        : weatherKey[0].hour[from + until][weatherInfo];

const makeWeatherObject = ({ createCard, info }) => {
    if (!createCard) return { hasWeather: createCard, message: info };

    const now = new Date().getHours();
    const { current } = info;
    const today = info.forecast.forecastday;

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
            uv: current.uv,
            airCuality: current.air_quality['us-epa-index'],

            nextHour: {
                temp: forecast(now, 1, today, 'temp_c'),
                rain: forecast(now, 1, today, 'chance_of_rain'),
                snow: forecast(now, 1, today, 'chance_of_snow'),
                condition: forecast(now, 1, today, 'condition').text,
            },
            next2Hours: {
                temp: forecast(now, 2, today, 'temp_c'),
                rain: forecast(now, 2, today, 'chance_of_rain'),
                snow: forecast(now, 2, today, 'chance_of_snow'),
                condition: forecast(now, 2, today, 'condition').text,
            },
            next3Hours: {
                temp: forecast(now, 3, today, 'temp_c'),
                rain: forecast(now, 3, today, 'chance_of_rain'),
                snow: forecast(now, 3, today, 'chance_of_snow'),
                condition: forecast(now, 3, today, 'condition').text,
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
