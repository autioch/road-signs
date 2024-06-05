import { randomArrIndex, chooseSigns } from './utils.js';

try {
    await document.documentElement.requestFullscreen();
    await screen.orientation.lock('portrait');
} catch { }


const state = {
    good: 0,
    bad: 0,
    streak: 0,
    sign: undefined,
    index: undefined
}

const resp = await fetch('./signs/db.json');
const allData = await resp.json();
const data = allData.filter(({ id }) => !!id);

window.next.addEventListener('click', setSign);

setSign();


function setSign() {
    disableResponses();

    const responses = chooseSigns(data);

    state.index = randomArrIndex(responses);
    state.sign = responses[state.index];

    window.sign.src = state.sign.img;
    window.responses.innerHTML = responses.map(({ id, label }) => `<div class="response" data-id="${id}">${label.replace(/(„|”)/gi, '')}</div>`).join('\n');

    enableResponses();
}

function validateChoice(ev) {
    disableResponses();
    const id = ev.target.dataset.id;

    if (id === state.sign.id) {
        state.good++;
        state.streak++;
    } else {
        ev.target.classList.add('red');
        state.bad++;
        state.streak = 0;
    }

    document.querySelector(`.response[data-id="${state.sign.id}"]`).classList.add('green');
    updateCounter();
}

function updateCounter() {
    window.good.innerHTML = state.good;
    window.bad.innerHTML = state.bad;
    window.streak.innerHTML = state.streak;
}

function disableResponses() {
    document.querySelectorAll('.response').forEach(el => el.removeEventListener('click', validateChoice));
}

function enableResponses() {
    document.querySelectorAll('.response').forEach(el => el.addEventListener('click', validateChoice));
}