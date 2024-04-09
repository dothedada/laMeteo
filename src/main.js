const getIPlocation = async () => {
    try {
        const ipAPI = await fetch('http://ip-api.com/json/', { mode: 'cors' });
        const response = await ipAPI.json();
        return response.city;
    } catch {
        return 'Bogotá';
    }
};

const getWeather = async (location) => {
    const now = new Date().getHours();
	console.log(now)
    try {
        const weatherApi = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=897a00842abe4196a0330347240904&q=${location}&days=3&aqi=yes&alerts=no`,
            { mode: 'cors' },
        );
        const response = await weatherApi.json();
        return {
            location: response.location.name,
            today: {
                temp: {
                    cDeg: response.current.temp_c,
                    fDeg: response.current.temp_f,
                    min: {
                        cDeg: response.forecast.forecastday[0].day.mintemp_c,
                        fDeg: response.forecast.forecastday[0].day.mintemp_f,
                    },
                    max: {
                        cDeg: response.forecast.forecastday[0].day.maxtemp_c,
                        fDeg: response.forecast.forecastday[0].day.maxtemp_f,
                    },
                    feels: {
                        cDeg: response.current.feelslike_c,
                        fDeg: response.current.feelslike_f,
                    },
                },
                condition: response.current.condition.text,
                rain: response.forecast.forecastday[0].day.daily_chance_of_rain,
                snow: response.forecast.forecastday[0].day.daily_will_it_snow,
                uv: response.current.uv,
                airCuality: response.current.air_quality['us-epa-index'],
                moon: response.forecast.forecastday[0].astro.moon_phase,
                moon_illumination:
                    response.forecast.forecastday[0].astro.moon_illumination,

                nextHour: {
                    temp: {
                        cDeg: response.forecast.forecastday[0].hour[now + 1]
                            .temp_c,

                        fDeg: response.forecast.forecastday[0].hour[now + 1]
                            .temp_f,
                    },
                    rain: response.forecast.forecastday[0].hour[now + 1]
                        .chance_of_rain,
                    snow: response.forecast.forecastday[0].hour[now + 1]
                        .chance_of_snow,
                    condition:
                        response.forecast.forecastday[0].hour[now + 1].condition
                            .text,
                },

                next2Hours: {
                    temp: {
                        cDeg: response.forecast.forecastday[0].hour[now + 2]
                            .temp_c,

                        fDeg: response.forecast.forecastday[0].hour[now + 2]
                            .temp_f,
                    },
                    rain: response.forecast.forecastday[0].hour[now + 2]
                        .chance_of_rain,
                    snow: response.forecast.forecastday[0].hour[now + 2]
                        .chance_of_snow,
                    condition:
                        response.forecast.forecastday[0].hour[now + 2].condition
                            .text,
                },

                next3Hours: {
                    temp: {
                        cDeg: response.forecast.forecastday[0].hour[now + 3]
                            .temp_c,

                        fDeg: response.forecast.forecastday[0].hour[now + 3]
                            .temp_f,
                    },
                    rain: response.forecast.forecastday[0].hour[now + 3]
                        .chance_of_rain,
                    snow: response.forecast.forecastday[0].hour[now + 3]
                        .chance_of_snow,
                    condition:
                        response.forecast.forecastday[0].hour[now + 3].condition
                            .text,
                },
            },

            tomorrow: {
                temp: {
                    min: {
                        cDeg: response.forecast.forecastday[1].day.mintemp_c,
                        fDeg: response.forecast.forecastday[1].day.mintemp_f,
                    },
                    max: {
                        cDeg: response.forecast.forecastday[1].day.maxtemp_c,
                        fDeg: response.forecast.forecastday[1].day.maxtemp_f,
                    },
                },
                condition: response.forecast.forecastday[1].day.condition.text,
                rain: response.forecast.forecastday[1].day.daily_chance_of_rain,
                snow: response.forecast.forecastday[1].day.daily_will_it_snow,
                uv: response.forecast.forecastday[1].day.uv,
                airCuallity:
                    response.forecast.forecastday[1].day.air_quality[
                        'us-epa-index'
                    ],
                moon: response.forecast.forecastday[1].astro.moon_phase,
            },

            afterTomorrow: {
                temp: {
                    min: {
                        cDeg: response.forecast.forecastday[2].day.mintemp_c,
                        fDeg: response.forecast.forecastday[2].day.mintemp_f,
                    },
                    max: {
                        cDeg: response.forecast.forecastday[2].day.maxtemp_c,
                        fDeg: response.forecast.forecastday[2].day.maxtemp_f,
                    },
                },
                condition: response.forecast.forecastday[2].day.condition.text,
                rain: response.forecast.forecastday[2].day.daily_chance_of_rain,
                snow: response.forecast.forecastday[2].day.daily_will_it_snow,
                uv: response.forecast.forecastday[2].day.uv,
                airCuallity:
                    response.forecast.forecastday[2].day.air_quality[
                        'us-epa-index'
                    ],
                moon: response.forecast.forecastday[2].astro.moon_phase,
            },
        };
    } catch (err) {
        console.log('algo malio sal', err);
    }
};

// US - EPA standard.
// 1 means Good
// 2 means Moderate
// 3 means Unhealthy for sensitive group
// 4 means Unhealthy
// 5 means Very Unhealthy
// 6 means Hazardous

console.log(getIPlocation().then(city => getWeather(city)));
