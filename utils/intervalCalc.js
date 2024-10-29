//this calculates the scale degree of the note being played in cases where the note value is lower than the key value

export const intervalCalc = (key, note) => {
    let degree = 0
    let checkKey = key
    while ( checkKey % 12 !== note ) {
        degree++
        checkKey++
    }
    return degree
}