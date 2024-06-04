const resp = await fetch('./signs/db.json');
const allData = await resp.json();


const data = allData.filter(({ id }) => !!id);
console.log(data.length);

const randomArrIndex = () => Math.floor(Math.random() * data.length);
const sortRandomize = () => Math.random() - 0.5;

let validId;
let counterAll = 0;
let counterOK = 0;

function disableResponses() {
    document.querySelectorAll('.response').forEach(el => el.removeEventListener('click', validateChoice));

}

function updateCounter() {
    window.counter.innerHTML = `${counterOK} / ${counterAll}`;
}


function setSign() {
    disableResponses();
    counterAll++;
    updateCounter();

    const randomIndex = randomArrIndex();
    const randomSign = data[randomIndex];


    const invalidAnswer1 = data[randomArrIndex()];
    const invalidAnswer2 = data[randomArrIndex()];
    const invalidAnswer3 = data[randomArrIndex()];

    console.log(randomIndex);

    validId = randomSign.id;

    const responses = [randomSign, invalidAnswer1, invalidAnswer2, invalidAnswer3];
    responses.sort(sortRandomize);

    // const imageSvg = await(await fetch(randomSign.img)).text();

    window.sign.src = randomSign.img;
    window.responses.innerHTML = responses.map(({ id, label }) => `<div class="response" data-id="${id}">${label.replace(/(„|”)/gi, '')}</div>`).join('\n');

    document.querySelectorAll('.response').forEach(el => el.addEventListener('click', validateChoice));
}

function validateChoice(ev) {
    disableResponses();
    const id = ev.target.dataset.id;

    if (id === validId) {
        counterOK++;
    } else {
        ev.target.classList.add('red');
    }

    document.querySelector(`.response[data-id="${validId}"]`).classList.add('green');

    updateCounter();
}


window.next.addEventListener('click', setSign);

setSign();