// NOTE:
// 2- buscar API de coordenadas a cidudad
// 3- Incorporar webpack
// 4- API imágenes
// 5- Cálculo de parámetros para la interfase (temperatura, Dif temperatura con percepcion, hora del día, probabilidad de lluvia...)
// 6- API música

const getIPlocation = async () => {
    try {
        const ipAPI = await fetch('http://ip-api.com/json/', { mode: 'cors' });
        const response = await ipAPI.json();
        return response.city;
    } catch {
        return 'Bogotá';
    }
};

const getDeviceCoords = () => {
	return new Promise((resolve, reject) => {
		navigator.geolocation.getCurrentPosition(
			(location) => resolve(location.coords),
			(err) => reject(Error(err)),
		);
	});
};

const getLocationFromCoords = async (latitude, longitude) => {
    try {
        const locationAPI = await fetch(
            `https://geocode.maps.co/reverse?lat=${latitude}&lon=${longitude}&api_key=66169804de7ce334066812gjn2dfd6b`,
            { mode: 'cors' },
        );
        const response = await locationAPI.json();
		return response.address.city
    } catch (err) {
        console.log('Algo salio mal con el paso de cordenadas a locación', err);
    }
};


const getWeather = async (location) => {
    try {
        const weatherApi = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=897a00842abe4196a0330347240904&q=${location}&days=3&aqi=yes&alerts=no`,
            { mode: 'cors' },
        );
        const weatherInfo = await weatherApi.json();
        return { createCard: true, info: weatherInfo };
    } catch (err) {
        console.log('algo malio sal', err);
        return {
            createCard: false,
            info: 'En este momento no disponemos información suficiente para crear la tarjeta',
        };
    }
};


const makeWeatherObject = ({ createCard, info }) => {
    if (!createCard) return { hasWeather: createCard, message: info };

    const now = new Date().getHours();
    const current = info.current;
    const forecastDay = info.forecast.forecastday;

    return {
        hasWeather: true,
        location: info.location.name,
        today: {
            temp: {
                cDeg: current.temp_c,
                fDeg: current.temp_f,
                min: {
                    cDeg: forecastDay[0].day.mintemp_c,
                    fDeg: forecastDay[0].day.mintemp_f,
                },
                max: {
                    cDeg: forecastDay[0].day.maxtemp_c,
                    fDeg: forecastDay[0].day.maxtemp_f,
                },
                feels: {
                    cDeg: current.feelslike_c,
                    fDeg: current.feelslike_f,
                },
            },
            condition: current.condition.text,
            rain: forecastDay[0].day.daily_chance_of_rain,
            snow: forecastDay[0].day.daily_will_it_snow,
            uv: current.uv,
            airCuality: current.air_quality['us-epa-index'],
            moon: forecastDay[0].astro.moon_phase,
            moon_illumination: forecastDay[0].astro.moon_illumination,

            nextHour: {
                time:
                    now + 1 > 23
                        ? forecastDay[1].hour[0].time
                        : forecastDay[0].hour[now + 1].time,
                temp: {
                    cDeg:
                        now + 1 > 23
                            ? forecastDay[1].hour[0].temp_c
                            : forecastDay[0].hour[now + 1].temp_c,

                    fDeg:
                        now + 1 > 23
                            ? forecastDay[1].hour[0].temp_f
                            : forecastDay[0].hour[now + 1].temp_f,
                },
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
                time:
                    now + 2 > 23
                        ? forecastDay[1].hour[now + 2 - 24].time
                        : forecastDay[0].hour[now + 2].time,
                temp: {
                    cDeg:
                        now + 2 > 23
                            ? forecastDay[1].hour[now + 2 - 24].temp_c
                            : forecastDay[0].hour[now + 2].temp_c,

                    fDeg:
                        now + 2 > 23
                            ? forecastDay[1].hour[now + 2 - 24].temp_f
                            : forecastDay[0].hour[now + 2].temp_f,
                },
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
                time:
                    now + 3 > 23
                        ? forecastDay[1].hour[now + 3 - 24].time
                        : forecastDay[0].hour[now + 3].time,
                temp: {
                    cDeg:
                        now + 3 > 23
                            ? forecastDay[1].hour[now + 3 - 24].temp_c
                            : forecastDay[0].hour[now + 3].temp_c,

                    fDeg:
                        now + 3 > 23
                            ? forecastDay[1].hour[now + 3 - 24].temp_f
                            : forecastDay[0].hour[now + 3].temp_f,
                },
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
                min: {
                    cDeg: forecastDay[1].day.mintemp_c,
                    fDeg: forecastDay[1].day.mintemp_f,
                },
                max: {
                    cDeg: forecastDay[1].day.maxtemp_c,
                    fDeg: forecastDay[1].day.maxtemp_f,
                },
            },
            condition: forecastDay[1].day.condition.text,
            rain: forecastDay[1].day.daily_chance_of_rain,
            snow: forecastDay[1].day.daily_will_it_snow,
            uv: forecastDay[1].day.uv,
            airCuallity: forecastDay[1].day.air_quality['us-epa-index'],
            moon: forecastDay[1].astro.moon_phase,
        },

        afterTomorrow: {
            temp: {
                min: {
                    cDeg: forecastDay[2].day.mintemp_c,
                    fDeg: forecastDay[2].day.mintemp_f,
                },
                max: {
                    cDeg: forecastDay[2].day.maxtemp_c,
                    fDeg: forecastDay[2].day.maxtemp_f,
                },
            },
            condition: forecastDay[2].day.condition.text,
            rain: forecastDay[2].day.daily_chance_of_rain,
            snow: forecastDay[2].day.daily_will_it_snow,
            uv: forecastDay[2].day.uv,
            airCuallity: forecastDay[2].day.air_quality['us-epa-index'],
            moon: forecastDay[2].astro.moon_phase,
        },
    };
};

// US - EPA standard.
// 1 means Good
// 2 means Moderate
// 3 means Unhealthy for sensitive group
// 4 means Unhealthy
// 5 means Very Unhealthy
// 6 means Hazardous

// console.log(getIPlocation().then((city) => getWeather(city)));

const card = getDeviceCoords()
    .then((cords) => getLocationFromCoords(cords.latitude, cords.longitude))
    .then((location) => getWeather(location))
    .then((weatherInfo) => makeWeatherObject(weatherInfo))
    .then((card) => console.log(card));
