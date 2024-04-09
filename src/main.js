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
    try {
        const weatherApi = await fetch(
            `https://api.weatherapi.com/v1/forecast.json?key=897a00842abe4196a0330347240904&q=${location}&days=3&aqi=yes&alerts=no`,
            { mode: 'cors' },
        );
        const response = await weatherApi.json();
        return {
            temp: {
                cDeg: response.current.temp_c,
                fDeg: response.current.temp_f,
            },
			feels: {
                cDeg: response.current.feelslike_c,
                fDeg: response.current.feelslike_f,
			}
        };
    } catch (err) {
        console.log('algo malio sal', err);
    }
};

console.log(getWeather(getIPlocation()))
