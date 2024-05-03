const makeWeatherObject = ({ createCard, info }) => {
    if (!createCard) return { hasWeather: createCard, message: info };

    const now = new Date().getHours();
    const { current } = info;
    const forecastDay = info.forecast.forecastday;

    return {
        hasWeather: true,

        location: info.location.name,
        region: info.location.region,
        country: info.location.country,

        today: {
            temp: {
                current: current.temp_c,
                min: forecastDay[0].day.mintemp_c,
                max: forecastDay[0].day.maxtemp_c,
                feels: current.feelslike_c,
                heatInd: forecastDay[0].hour[now].heatindex_c,
            },
            condition: current.condition.text,
            rain: forecastDay[0].day.daily_chance_of_rain,
            snow: forecastDay[0].day.daily_will_it_snow,
            uv: current.uv,
            airCuality: current.air_quality['us-epa-index'],

            nextHour: {
                temp:
                    now + 1 > 23
                        ? forecastDay[1].hour[0].temp_c
                        : forecastDay[0].hour[now + 1].temp_c,
                rain:
                    now + 1 > 23
                        ? forecastDay[1].hour[0].chance_of_rain
                        : forecastDay[0].hour[now + 1].chance_of_rain,
                snow:
                    now + 1 > 23
                        ? forecastDay[1].hour[0].chance_of_snow
                        : forecastDay[0].hour[now + 1].chance_of_snow,
                condition:
                    now + 1 > 23
                        ? forecastDay[1].hour[0].condition.text
                        : forecastDay[0].hour[now + 1].condition.text,
            },

            next2Hours: {
                temp:
                    now + 2 > 23
                        ? forecastDay[1].hour[now + 2 - 24].temp_c
                        : forecastDay[0].hour[now + 2].temp_c,
                rain:
                    now + 2 > 23
                        ? forecastDay[1].hour[now + 2 - 24].chance_of_rain
                        : forecastDay[0].hour[now + 2].chance_of_rain,
                snow:
                    now + 2 > 23
                        ? forecastDay[1].hour[now + 2 - 24].chance_of_snow
                        : forecastDay[0].hour[now + 2].chance_of_snow,
                condition:
                    now + 2 > 23
                        ? forecastDay[1].hour[now + 2 - 24].condition.text
                        : forecastDay[0].hour[now + 2].condition.text,
            },

            next3Hours: {
                temp:
                    now + 3 > 23
                        ? forecastDay[1].hour[now + 3 - 24].temp_c
                        : forecastDay[0].hour[now + 3].temp_c,
                rain:
                    now + 3 > 23
                        ? forecastDay[1].hour[now + 3 - 24].chance_of_rain
                        : forecastDay[0].hour[now + 3].chance_of_rain,
                snow:
                    now + 3 > 23
                        ? forecastDay[1].hour[now + 3 - 24].chance_of_snow
                        : forecastDay[0].hour[now + 3].chance_of_snow,
                condition:
                    now + 3 > 23
                        ? forecastDay[1].hour[now + 3 - 24].condition.text
                        : forecastDay[0].hour[now + 3].condition.text,
            },
        },

        tomorrow: {
            temp: {
                min: forecastDay[1].day.mintemp_c,
                max: forecastDay[1].day.maxtemp_c,
                avg: forecastDay[1].day.avgtemp_c,
            },
            condition: forecastDay[1].day.condition.text,
            rain: forecastDay[1].day.daily_chance_of_rain,
            snow: forecastDay[1].day.daily_will_it_snow,
        },
    };
};

export default makeWeatherObject;
