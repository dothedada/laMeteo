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


const makeBTN = (text, className, callback) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className;
    btn.textContent = text;
    if (callback) btn.addEventListener('click', callback);

    return btn;
};

const removeCards = (id) => {
    const cardsId =
        typeof id === 'string'
            ? id
            : id.target.closest('[data-id]').getAttribute('data-id');
    const divs = document.querySelectorAll(`[data-id=${cardsId}]`);
    divs.forEach((card) => card.remove());
};

const makeWeatherCards = (weatherInfo, insertionPoint) => {
    if (!weatherInfo) return;

    const { now, nextHour, next2Hours, next3Hours, tomorrow } = weatherInfo;
    const id = `${now[0][0]}_${new Date().getTime().toString(26)}`;
    let firstCard = true;

    const renderCard = (data, renderPicture = false) => {
        let card;

        if (firstCard) {
            card = makeDiv(id, 'highlight');

            const location = makeSpan('Este es el clima de', 'sr-only');
            const title = document.createElement('h2');
            title.className = 'single';
            title.append(location, makeSpan(data[0]), makeSpan(data[1]));

            const editLocation = document.createElement('div');
            editLocation.className = 'topRow';
            editLocation.append(
                makeBTN('Cambiar', 'locationBTN'),
                makeBTN('Borrar', 'locationBTN', removeCards),
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

    now.forEach((cardData) => renderCard(cardData));
    nextHour.forEach((cardData) => renderCard(cardData));
    next2Hours.forEach((cardData) => renderCard(cardData));
    next3Hours.forEach((cardData) => renderCard(cardData));
    tomorrow.forEach((cardData) => renderCard(cardData));
    renderCard(weatherInfo.imageData, true);
};

export default makeWeatherCards;
