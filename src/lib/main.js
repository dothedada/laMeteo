import {
    getIPlocation,
    getDeviceCoords,
    getCordsFromLocation,
    getWeather,
    getImage,
} from './apiGetters';

import makeWeatherObject from './wetherCard';

// NOTE:
// 5- Cálculo de parámetros para la interfase (temperatura, Dif temperatura con percepcion, hora del día, probabilidad de lluvia...)
// 6- API música


// US - EPA standard.
// 1 means Good
// 2 means Moderate
// 3 means Unhealthy for sensitive group
// 4 means Unhealthy
// 5 means Very Unhealthy
// 6 means Hazardous

