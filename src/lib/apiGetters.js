const getIPlocation = async () => {
    try {
        const ipAPI = await fetch('http://ip-api.com/json/', { mode: 'cors' });
        const response = await ipAPI.json();
        return `${response.lat},${response.lon}`;
    } catch (err) {
        return '4.6347462459849265,-74.07258405134549';
    }
};

const getDeviceCoords = () => {
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (cor) => resolve(`${cor.coords.latitude},${cor.coords.longitude}`),
            (err) => reject(Error(err)),
        );
    });
};

const getCordsFromLocation = async (location) => {
    try {
        const locationAPI = await fetch(
            `https://geocode.maps.co/search?q=${location}&api_key=66169804de7ce334066812gjn2dfd6b`,
            { mode: 'cors' },
        );
        const response = await locationAPI.json();
        return `${response[0].lat},${response[0].lon}`;
    } catch (err) {
        console.log('Error con el paso de locación a coordenadas', err);
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
        return {
            createCard: false,
            info: 'En este momento no disponemos información suficiente para crear la tarjeta',
        };
    }
};

const getImage = async (searchPrompt) => {
    try {
        const request = await fetch(
            `https://api.unsplash.com/photos/random/?query=${searchPrompt} landscape&orientation=landscape&client_id=zclGqZQC79tn1uXMgO8-ORR3nJS9Hn4h74ICzbgnbk8`,
            { mode: 'cors' },
        );
        const response = await request.json();
        return response;
    } catch (err) {
        throw new Error('error en la carga de imagen', err);
    }
};

export {
    getIPlocation,
    getDeviceCoords,
    getCordsFromLocation,
    getWeather,
    getImage,
};
