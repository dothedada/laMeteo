const getIPlocation = async () => {
    try {
        const ipAPI = await fetch('http://ip-api.com/json/', { mode: 'cors' });
        const response = await ipAPI.json();
        return [response.lat, response.lon];
    } catch (err) {
        return [4.634, -74.072];
    }
};

const getDeviceCoords = () =>
    new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
            (cor) => resolve([cor.coords.latitude, cor.coords.longitude]),
            (err) => reject(Error(err)),
        );
    }).catch(getIPlocation);

const getCordsFromLocation = async (location) => {
    try {
        const locationAPI = await fetch(
            `https://geocode.maps.co/search?q=${location}&api_key=66169804de7ce334066812gjn2dfd6b`,
            { mode: 'cors' },
        );
        const response = await locationAPI.json();
        return [response[0].lat, response[0].lon];
    } catch (err) {
        alert('No se pudo obtener las coordenadas del lugar, revisa el nombre y de ser posible, ingresa más detalles, como el país o el nombre de la región. Por el momento se mostrará el clima de Bogotá', err);
        return [4.634, -74.072];
    }
};

const getWeather = async (location) => {
    const [lat, lon] = location;
    const weatherKey = '897a00842abe4196a0330347240904';
    const weatherURL = 'https://api.weatherapi.com/v1/forecast.json?';
    const weatherRequest = `${weatherURL}key=${weatherKey}&q=${lat},${lon}&days=2&aqi=yes&alerts=no&lang=es`;

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
            `https://api.unsplash.com/photos/random/?query=${textPrompt}&client_id=zclGqZQC79tn1uXMgO8-ORR3nJS9Hn4h74ICzbgnbk8`,
            { mode: 'cors' },
        );
        const response = await request.json();
        return {
            alt: response.alternative_slugs.es
                .split('-')
                .slice(0, -1)
                .join(' '),
            url: response.urls.regular,
            thumb: response.urls.thumb,
            html: `Imagen realizada por <a href="${response.user.links.html}?utm_source=feel_the_weather&utm_medium=referral">${response.user.name}</a> / <a href="https://unsplash.com/?utm_source=feel_the_weather&utm_medium=referral">Unsplash</a>`,
        };
    } catch (err) {
        alert('Sucedió un problema al cargar las imágenes, mientras se soluciona, sólo se mostrará la información del clima y una foto de un perrito', err);
        return {
            alt: 'Unos perrios corriendo',
            url: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk87Jn2Y7H1wQVn7Yfuvf9byOwQ5qlrvJqM-QDWZV1tA&s',
            thumb: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSk87Jn2Y7H1wQVn7Yfuvf9byOwQ5qlrvJqM-QDWZV1tA&s',
            html: ``,

        }
    }
};

export { getDeviceCoords, getCordsFromLocation, getWeather, getImage };
