const intervalCalc = (key, note) => {
    let degree = 0
    let checkKey = key
    while ( checkKey % 12 !== note ) {
        degree++
        checkKey++
    }
    return degree
}

const chordGenerator = {
    notes :  [
        "C3", 
        "C#3", 
        "D3",
        "D#3",
        "E3",
        "F3",
        "F#3",
        "G3",
        "G#3",
        "A3",
        "A#3",
        "B3",
        "C4",
        "C#4",
        "D4",
        "D#4",
        "E4",
        "F4",
        "F#4",
        "G4",
        "G#4",
        "A4",
        "A#4",
        "B4",
        "C5",
    ],
    chordTypes : {
        maj : [0, 4, 7, 11, 2, 5],
        min : [0, 3, 7, 10, 2, 5],
        dom : [0, 4, 7, 10, 2, 5,],
        dim : [0, 3, 6, 9]
    },
    newChordTypes : {
        maj : [0, 4, 7, [11, 2, 5]],
        min : [0, 3, 7, [10, 2, 5]],
        dom : [0, 4, 7, [10, 2, 5,]],
        dim : [0, 3, 6, [9]]
    },
    qualityMap : { //chord qualities for playing degrees of the scale from 0 - 11 in major and minor keys
        maj : [
            "maj",
            "dom",
            "min",
            "dim",
            "min",
            "maj",
            "dom",
            "dom",
            "dim",
            "min",
            "dom",
            "dim"
        ],
        min : [
            "min",
            "maj",
            "dim",
            "maj",
            "dim",
            "min",
            "maj",
            "dom",
            "maj",
            "dom",
            "dom",
            "dim"
        ]
    },
    addNotes: (key, keyQuality, note, complexity = 4, direction) => {

        
        //this is the list of tones that will be passed to the synth
        const chord = [];
        
        //this is the chord that will be returned to the synth
        const notes = [];

        //the scale degree is calculated by checking the distance between the two values in a base 12 number system
        const degree = key <= note ? note - key : intervalCalc(key, note);

        //the mod variable changes the root that is called when looking for the chord
        let mod = 0;
        
        //the quality of the chord based on the scale degree being played and whether it is a major or minor key
        const qualityOfChord = chordGenerator.qualityMap[keyQuality][(degree)];
        
        //the template for the chord being played
        const chordTemplate = chordGenerator.chordTypes[qualityOfChord];
        
        //the total amount of pitch classses to transpose up from pitch class 0 
        const totalTransposition = key + degree + mod;

        //handle applied chords where the root is different from the scale degree being played
        switch(degree) {
            case 1: //applied chord going to the second scale degree
                mod = 8
                break;
            case 6: //applied chord going to the fifth scale degree
                mod = 8;
                break;
            case 9: //applied chord going to the second scale degree in minor keys
                if (keyQuality === 'min') {
                    mod = 5;
                }
                break;
        }

        //populate notes array with the transposed pitch of the chord template based on it's complexity (how many notes to include)
        for ( let i = 0; i < complexity; i++) {
            if (chordTemplate[i] !== undefined) {
                notes.push((chordTemplate[i] + totalTransposition) % 12);
            }
        }

        //arrange notes in selected order
        if (direction === 'ascending') {
            notes.sort((a, b) => a - b);
        } else {
            notes.sort((a,b) => a + b);
        }

        const addToChord = (notes, octave = 0) => {

            // let limit = 3;

            // if (octave != 0) {
            //     limit = notes.length;
            // }

            if (chordGenerator.notes.length - 1 < notes[0] + (octave * 12)) { //terminate recursion if lowest note is outside the range of notes
                return;
            } else if (notes[0] + (octave * 12) === chordGenerator.notes.length - 1){ //check if chord should include the highest note (C5), add if so. Terminate recursion as there are no higher notes
                chord.push(chordGenerator.notes[notes[0] + (octave * 12)]);
                return;
            } else {
                for (let i = 0; i < notes.length; i++) { //add all notes in the current octave if they exist
                    chord.push(chordGenerator.notes[notes[i] + (octave * 12)]);
                }
                addToChord(notes, octave + 1) //repeat for next octave
            }
        
        }

        addToChord(notes)
        // console.log(notes)
        // console.log(chord)
        return chord
    }
}
