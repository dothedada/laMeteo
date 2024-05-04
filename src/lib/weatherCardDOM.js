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

const makeWeatherCards = (weatherInfo, insertionPoint) => {
    const id = `${weatherInfo.now[0][0]}_${new Date().getTime().toString(26)}`;
    const { now, nextHour, next2Hours, next3Hours, tomorrow } = weatherInfo;

    let firstCard = true;
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
                makeBTN('Cambiar', 'changeBTN'),
                makeBTN('Borrar', 'removeBTN'),
            );

            card.append(title, editLocation);
        } else if (renderPicture) {
            card = document.createElement('picture');
            card.setAttribute('data-id', id);

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
        } else {
            card = makeDiv(id, 'single');
            card.append(makeSpan(data[0]), makeSpan(data[1]));
        }

        console.log(last);
        if (last) card.classList.add('sectionEnd');

        const cardInsertion = firstCard
            ? insertionPoint
            : document.body.querySelectorAll(`.${id}`)[
                  document.body.querySelectorAll(`.${id}`).length - 1
              ].nextElementSibling;

        document.body.insertBefore(card, cardInsertion);
        firstCard = false;
    };

    const localStyle = document.createElement('style');
    localStyle.textContent = `.${id} {
        --_img: url(${weatherInfo.imageData.url});
        --_color: black;
        --_bk-overlay: hsl(0 0 90% / 0.6);
    }`;

    document.head.appendChild(localStyle);

    now.forEach((data, i, { lng }) => renderCard(data, i === lng - 1));
    nextHour.forEach((data, i, { lng }) => renderCard(data, i === lng - 1));
    next2Hours.forEach((data, i, { lng }) => renderCard(data, i === lng - 1));
    next3Hours.forEach((data, i, { lng }) => renderCard(data, i === lng - 1));
    tomorrow.forEach((data, i, { lng }) => renderCard(data, i === lng - 1));
    renderCard(weatherInfo.imageData, false, true);
};

export default makeWeatherCards;
