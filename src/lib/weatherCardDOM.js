const weatherDivs = (locationID, CSSclass) => {
    const div = document.createElement('div');
    div.setAttribute('data-id', locationID);
    div.className = CSSclass ? `${CSSclass} ${locationID}` : locationID;

    return div;
};
const weatherSpans = (content, CSSclass) => {
    const span = document.createElement('span');
    if (CSSclass) span.className = CSSclass;
    span.textContent = content;

    return span;
};

const makeWeatherCards = async (cardInfo) => {
    if (!cardInfo) return;

    const { today, tomorrow } = cardInfo;

    const id = `${cardInfo.location}-${Math.floor(Math.random() * new Date().getTime()).toString(26)}`;

    const localStyle = document.createElement('style');
    localStyle.textContent = `.${id} {
    --_img: url(${cardInfo.imageData.url});
    --_color: black;
    --_bk-overlay: hsl(0 0 90% / 0.6);
}
`;
    document.head.appendChild(localStyle);

    console.log(JSON.stringify(cardInfo, null, 2))

    const location = weatherDivs(id);
    const name = document.createElement('h2');
    // name.className = "break"
    name.textContent = `${cardInfo.location}\n${cardInfo.country}`;
    const nameDescription = weatherSpans(
        'La siguiente información corresponde a ',
        'sr-only',
    );

    const editLocation = document.createElement('div');
    editLocation.className = 'topRow';
    const changeBTN = document.createElement('button');
    changeBTN.type = 'button';
    changeBTN.className = 'locationBTN';
    changeBTN.textContent = 'Cambiar';
    // changeBTN.addEventListener('click', () => {
    //     insertPosition = `substitution_${id}`;
    //     modal.showModal();
    // });
    const deleteBTN = document.createElement('button');
    deleteBTN.type = 'button';
    deleteBTN.textContent = 'Borrar';
    // deleteBTN.addEventListener('click', () => {
    //     removeWeatherDivs(id);
    // });
    editLocation.append(changeBTN, deleteBTN);

    location.append(nameDescription, name, editLocation);

    const current = weatherDivs(id, 'double');
    current.textContent = `${today.temp.current}°`;

    const dayMinMax = weatherDivs(id, 'single');
    dayMinMax.append(
        weatherSpans(`${today.temp.min}° min`),
        weatherSpans(`${today.temp.max}° max`),
    );

    const currentFeel = weatherDivs(id, 'highlight');
    currentFeel.append(
        weatherSpans(`${today.temp.feels}°`, 'double'),
        weatherSpans('sensación térmica', 'break'),
    );

    const currentHeat = weatherDivs(id, 'highlight');
    currentHeat.append(
        weatherSpans(`${today.temp.heatInd}°`, 'double'),
        weatherSpans('índice calor', 'break'),
    );

    const currentCondition = weatherDivs(id, 'break');
    currentCondition.textContent = today.condition;

    const currentWatter = weatherDivs(id, 'single');
    const currentRain = weatherSpans(`${today.rain}% lluvia`);
    const currentSnow = weatherSpans(`${today.snow}% nieve`);
    currentWatter.appendChild(currentRain);
    if (+today.snow > 0) currentWatter.appendChild(currentSnow);

    const currentAtmosphere = weatherDivs(id, 'single sectionEnd');
    currentAtmosphere.append(
        weatherSpans(today.uv),
        weatherSpans(today.ac),
    );

    const nextHourTemp = weatherDivs(id);
    nextHourTemp.append(
        weatherSpans('En una hora', 'topRow'),
        weatherSpans(`${today.nextHour.temp}°`, 'double'),
    );

    const nextHourCondition = weatherDivs(id, 'break');
    nextHourCondition.textContent = today.nextHour.condition;

    const nextHourWatter = weatherDivs(id, 'single sectionEnd');
    const nextHourRain = weatherSpans(`${today.nextHour.rain}% lluvia`);
    const nextHourSnow = weatherSpans(`${today.nextHour.snow}% nieve`);
    nextHourWatter.appendChild(nextHourRain);
    if (+today.nextHour.snow > 0) nextHourWatter.appendChild(nextHourSnow);

    const next2HoursTemp = weatherDivs(id);
    next2HoursTemp.append(
        weatherSpans('En dos horas', 'topRow'),
        weatherSpans(`${today.next2Hours.temp}°`, 'double'),
    );

    const next2HoursCondition = weatherDivs(id, 'break');
    next2HoursCondition.textContent = today.next2Hours.condition;

    const next2HoursWatter = weatherDivs(id, 'single sectionEnd');
    const next2HoursRain = weatherSpans(`${today.next2Hours.rain}% lluvia`);
    const next2HoursSnow = weatherSpans(`${today.next2Hours.snow}% nieve`);
    next2HoursWatter.appendChild(next2HoursRain);
    if (+today.next2Hours.snow > 0)
        next2HoursWatter.appendChild(next2HoursSnow);

    const next3HoursTemp = weatherDivs(id);
    next3HoursTemp.append(
        weatherSpans('En tres horas', 'topRow'),
        weatherSpans(`${today.next3Hours.temp}°`, 'double'),
    );

    const next3HoursCondition = weatherDivs(id, 'break');
    next3HoursCondition.textContent = today.next3Hours.condition;

    const next3HoursWatter = weatherDivs(id, 'single sectionEnd');
    const next3HoursRain = weatherSpans(`${today.next3Hours.rain}% lluvia`);
    const next3HoursSnow = weatherSpans(`${today.next3Hours.snow}% nieve`);
    next3HoursWatter.appendChild(next3HoursRain);
    if (+today.next3Hours.snow > 0)
        next3HoursWatter.appendChild(next3HoursSnow);

    const tomorrowTemp = weatherDivs(id);
    tomorrowTemp.append(
        weatherSpans('Mañana', 'topRow'),
        weatherSpans(`${tomorrow.temp.avg}°`, 'double'),
    );

    const tomorrowMinMax = weatherDivs(id, 'single');
    tomorrowMinMax.append(
        weatherSpans(`${tomorrow.temp.min}° min`),
        weatherSpans(`${tomorrow.temp.max}° max`),
    );

    const tomorrowCondition = weatherDivs(id, 'break');
    tomorrowCondition.textContent = tomorrow.condition;

    const tomorrowWatter = weatherDivs(id, 'single');
    const tomorrowRain = weatherSpans(`${tomorrow.rain}% lluvia`);
    const tomorrowSnow = weatherSpans(`${tomorrow.snow}% nieve`);
    tomorrowWatter.appendChild(tomorrowRain);
    if (+tomorrow.snow > 0) tomorrowWatter.appendChild(tomorrowSnow);

    const picture = document.createElement('picture');
    const image = document.createElement('img');
    image.src = cardInfo.imageData.thumb;
    image.alt = cardInfo.imageData.alt;
    const imgBTN = document.createElement('button');
    imgBTN.type = 'button';
    imgBTN.className = 'zoomBTN';
    imgBTN.textContent = 'zoom';
    picture.append(image, imgBTN);

    document.body.append(
        location,
        current,
        dayMinMax,
        currentFeel,
        currentHeat,
        currentCondition,
        currentWatter,
        currentAtmosphere,
        nextHourTemp,
        nextHourCondition,
        nextHourWatter,
        next2HoursTemp,
        next2HoursCondition,
        next2HoursWatter,
        next3HoursTemp,
        next3HoursCondition,
        next3HoursWatter,
        tomorrowTemp,
        tomorrowMinMax,
        tomorrowCondition,
        tomorrowWatter,
        picture,
    );
};

export default makeWeatherCards;
