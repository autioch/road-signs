/**
 * @param {Array} arr 
 */
export function randomArrIndex(arr) {
    return Math.floor(Math.random() * arr.length);
}

export function sortRandomize() {
    return Math.random() - 0.5;
}

export function shuffleArray(arr) {
    return arr.sort(sortRandomize).reverse().sort(sortRandomize);
}

/**
 * @param {Array} signs 
 */
export function chooseSigns(signs) {
    const shallowCopy = [...signs];
    const chosenSigns = [];

    for (let i = 0; i < 4; i++) {
        chosenSigns.push(shallowCopy.splice(randomArrIndex(shallowCopy), 1)[0]);
    }

    return chosenSigns;
}
