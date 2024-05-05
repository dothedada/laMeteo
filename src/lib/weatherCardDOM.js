const makeDiv = (locationID, CSSclass) => {
    const div = document.createElement('div');
    div.setAttribute('data-id', locationID);
    div.className = CSSclass ? `${CSSclass} ${locationID}` : locationID;

    return div;
};
const makeSpan = (content, CSSclass) => {
    const span = document.createElement('span');
    if (CSSclass) span.className = CSSclass;
    span.textContent = content;

    return span;
};

const makeBTN = (text, className) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.textContent = text;

    return btn;
};

const makeHue = (tempStr) => {
    const minReg = 5; // se elimina el - al número negativo
    const maxReg = 35;
    let temp = +tempStr.replace('°', '');
    if (temp < -minReg) temp = -minReg;
    if (temp > maxReg) temp = maxReg;
    const percent = ((temp + minReg) / (maxReg + minReg)) * 100;

    const minHue = 0;
    const maxHue = 230;
    const hue = minHue + (percent / 100) * (maxHue - minHue) - maxHue;

    return Math.round(Math.abs(hue));
};

const makeSat = (perceivedStr, tempStr) => {
    const min = 0;
    const max = 10;
    let diference = Math.abs(
        +perceivedStr.replace('°', '') - +tempStr.replace('°', ''),
    ) * 2;
    if (diference > max) diference = max;

    return Math.round((diference / (max - min)) * 100);
};

const makeColor = (temp, feel, heat) =>
    `${makeHue(temp)} ${makeSat(feel, temp)}% ${makeSat(heat, temp)}%`;

const makeWeatherCards = (weatherInfo, insertionPoint) => {
    const id = `${weatherInfo.now[0][0].replace(' ', '-')}_${new Date().getTime().toString(26)}`;
    const { now, nextHour, next2Hours, next3Hours, tomorrow } = weatherInfo;

    let firstCard = true;
    let sectionTitle;

    const renderCard = (data, last, renderPicture = false) => {
        let card;

        if (firstCard) {
            card = makeDiv(id, 'highlight');

            const title = document.createElement('h2');
            title.className = 'single';
            title.append(
                makeSpan('Este es el clima de', 'sr-only'),
                makeSpan(data[0]),
                makeSpan(data[1]),
            );

            const editLocation = document.createElement('div');
            editLocation.className = 'topRow';
            editLocation.append(
                makeBTN('Cambiar', 'locationBTN'),
                makeBTN('Borrar', 'removeBTN'),
            );

            card.append(title, editLocation);
        } else if (renderPicture) {
            card = document.createElement('picture');
            card.setAttribute('data-id', id);
            card.className = id;

            const image = document.createElement('img');
            image.src = data.thumb;
            image.alt = data.alt;

            card.append(image, makeBTN('zoom', 'zoomBTN'));
        } else if (typeof data !== 'object') {
            card = /°/.test(data) ? makeDiv(id, 'double') : makeDiv(id);
            card.textContent = data;
        } else if (/°$/.test(data[0])) {
            card = makeDiv(id, 'highlight');
            card.append(
                makeSpan(data[0], 'double'),
                makeSpan(data[1], 'break'),
            );
        } else if (sectionTitle) {
            card = makeDiv(id, 'highlight');
            card.append(
                makeSpan(data[0], 'topRow'),
                makeSpan(data[1], 'double'),
            );
            sectionTitle = false;
        } else {
            card = makeDiv(id, 'single');
            card.append(makeSpan(data[0]), makeSpan(data[1]));
        }

        if (last) {
            card.classList.add('sectionEnd');
            sectionTitle = true;
        }

        const siblings = document.body.querySelectorAll(`.${id}`);

        const cardInsertion = firstCard
            ? insertionPoint
            : siblings[siblings.length - 1].nextElementSibling;

        document.body.insertBefore(card, cardInsertion);
        firstCard = false;
    };

    const localStyle = document.createElement('style');
    localStyle.textContent = `.${id} {
        --_img: url(${weatherInfo.imageData ? weatherInfo.imageData.url : ''});
        --_color: hsl(${makeColor(weatherInfo.now[1], weatherInfo.now[3][0], weatherInfo.now[4][0])} / 1);
        --_bk-overlay1: hsl(${makeHue(weatherInfo.now[1])} 50% 90% / 1);
        --_bk-overlay2: hsl(${makeHue(weatherInfo.now[1])} 50% 90% / 0.5);
    }`;

    console.log(
        // weatherInfo.now[1],
        // weatherInfo.now[3][0],
        // weatherInfo.now[4][0],
        makeColor(
            weatherInfo.now[1],
            weatherInfo.now[3][0],
            weatherInfo.now[4][0],
        ),
    );
    // makeColor(weatherInfo.now[1], weatherInfo.now[3][0], weatherInfo.now[4][0]);

    document.head.appendChild(localStyle);

    now.forEach((data, index, { length }) =>
        renderCard(data, index === length - 1),
    );
    nextHour.forEach((data, index, { length }) =>
        renderCard(data, index === length - 1),
    );
    next2Hours.forEach((data, index, { length }) =>
        renderCard(data, index === length - 1),
    );
    next3Hours.forEach((data, index, { length }) =>
        renderCard(data, index === length - 1),
    );
    tomorrow.forEach((data, index, { length }) =>
        renderCard(data, index === length - 1),
    );
    if (weatherInfo.imageData) renderCard(weatherInfo.imageData, false, true);
};

export default makeWeatherCards;
