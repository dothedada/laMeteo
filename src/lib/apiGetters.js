const getIPlocation = async () => {
    try {
        const ipAPI = await fetch('http://ip-api.com/json/', { mode: 'cors' });
        const response = await ipAPI.json();
        return `${response.lat},${response.lon}`;
    } catch (err) {
        return '4.6347462459849265,-74.07258405134549';
    }
};

const getDeviceCoords = () =>
    new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (cor) => resolve(`${cor.coords.latitude},${cor.coords.longitude}`),
            (err) => reject(Error(err)),
        );
    });

const getCordsFromLocation = async (location) => {
    try {
        const locationAPI = await fetch(
            `https://geocode.maps.co/search?q=${location}&api_key=66169804de7ce334066812gjn2dfd6b`,
            { mode: 'cors' },
        );
        const response = await locationAPI.json();
        return [response[0].lat, response[0].lon];
    } catch (err) {
        throw new Error('Error con el paso de locación a coordenadas', err);
    }
};

const getWeather = async (location) => {
    const [lat, lon] = location;
    const weatherKey = '897a00842abe4196a0330347240904';
    const weatherURL = 'https://api.weatherapi.com/v1/forecast.json?';
    const weatherRequest = `${weatherURL}key=${weatherKey}&q=${lat},${lon}&days=2&aqi=no&alerts=no`;
    try {
        const request = await fetch(weatherRequest, { mode: 'cors' });
        const weatherInfo = await request.json();
        return { createCard: true, info: weatherInfo };
    } catch (err) {
        return {
            createCard: false,
            info: 'En este momento no disponemos información suficiente para crear la tarjeta',
        };
    }
};

const getImage = async (searchPrompt) => {
    const textPrompt = searchPrompt.trim().replace(/\s+/g, '-');

    try {
        const request = await fetch(
            `https://api.unsplash.com/photos/random/?query=${textPrompt}&orientation=landscape&client_id=zclGqZQC79tn1uXMgO8-ORR3nJS9Hn4h74ICzbgnbk8`,
            { mode: 'cors' },
        );
        const response = await request.json();
        return {
            alt: {
                en: response.alt_description.replace('-', ' '),
                es: response.alternative_slugs.es
                    .split('-')
                    .slice(0, -1)
                    .join(' '),
            },
            url: response.urls.regular,
            html: `<a href="${response.user.links.html}?utm_source=feel_the_weather&utm_medium=referral">${response.user.name}</a> / <a href="https://unsplash.com/?utm_source=feel_the_weather&utm_medium=referral">Unsplash</a>`,
        };
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
