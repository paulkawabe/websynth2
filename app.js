//assign elements in dom
const button = document.querySelector(".note-button"); //start stop
const complexityDisplay = document.querySelector(".complexity-display");
const complexityUp = document.querySelector(".complexity-up");
const complexityDown = document.querySelector(".complexity-down");
const keyDisplay = document.querySelector(".key-display");
const keyUp = document.querySelector(".key-up");
const keyDown = document.querySelector(".key-down");

//keyboard
const c = document.querySelector(".c");
const csharp = document.querySelector(".csharp");
const d = document.querySelector(".d");
const dsharp = document.querySelector(".dsharp");
const e = document.querySelector(".e");
const f = document.querySelector(".f");
const fsharp = document.querySelector(".fsharp");
const g = document.querySelector(".g");
const gsharp = document.querySelector(".gsharp");
const a = document.querySelector(".a");
const asharp = document.querySelector(".asharp");
const b = document.querySelector(".b");

class Synthesizer {

  constructor() {
    this.synth = new Tone.Synth().toDestination();
  }

  //status variables
  playing = false;
  chord = ['C3', 'E3', 'G3', 'B3', 'C4', 'E4', 'G4', 'B4', 'C5'];
  key = 0;
  keyQuality = "maj";
  complexity = 4;
  activeDegree = 0;

  // sequence that plays arpeggiated notes in chord
  seq = new Tone.Sequence(
    (time, note) => {
      this.synth.triggerAttackRelease(note, "4n", time);
    },
    this.chord,
    "4n"
  ).start(0);

  //methods
  checkUnique(newChord) { //this ensures that the sequencer is only updated when required
    //set return variable
    let unique = false;

    //check against current set chord for new notes, if there are any, return true
    for (let i = 0; i < this.chord.length; i++) {
      if (newChord[i] != this.chord[i]) {
        unique = true;
        return unique;
      }
    }

    return unique;
  }

  updateSeq() {
    this.seq.dispose();

    this.seq = new Tone.Sequence(
      (time, note) => {
        this.synth.triggerAttackRelease(note, "4n", time);
      },
      this.chord,
      "4n"
    ).start(0);
  }

  updateChord() {
    this.chord = chordGenerator.addNotes(synth.key, synth.keyQuality, synth.activeDegree, synth.complexity);
    this.updateSeq();
  }

  updateComplexity(direction) {
    if (this.complexity + direction < 1 || this.complexity + direction > 5) {
      return;
    }

    this.complexity += direction;
    complexityDisplay.innerHTML = this.complexity;
    this.updateChord();
  }

  updateKey(direction) {
    console.log('running update key')
    if (this.key + direction < 0 || this.key + direction > 11) {
      return;
    }

    this.key += direction;
    this.activeDegree += direction;
    keyDisplay.innerHTML = this.key;
    this.updateChord();
  }

  startstop() {
    if (this.playing === false) {
      this.updateSeq;
      Tone.getTransport().start();
      this.playing = true;
    } else {
      Tone.getTransport().stop();
      this.playing = false;
    }
  }

  status() {
    console.log(`playing: ${this.playing}, chord: ${this.chord}`);
  }
}

const synth = new Synthesizer();




const keyboardCallback = (degree) => {
  synth.activeDegree = degree;
  synth.updateChord(
    chordGenerator.addNotes(synth.key, synth.keyQuality, synth.activeDegree, synth.complexity)
  )
};


//add event listeners
button.addEventListener("click", () => {
  synth.startstop();
});
complexityUp.addEventListener("click", () => {
  synth.updateComplexity(1);
})
complexityDown.addEventListener("click", () => {
  synth.updateComplexity(-1);
})
keyUp.addEventListener("click", () => {
  synth.updateKey(1);
})
keyDown.addEventListener("click", () => {
  synth.updateKey(-1);
})

//keyboard
c.addEventListener("click", () => (keyboardCallback(0)));
csharp.addEventListener("click", () => (keyboardCallback(1)));
d.addEventListener("click", () => (keyboardCallback(2)));
dsharp.addEventListener("click", () => (keyboardCallback(3)));
e.addEventListener("click", () => (keyboardCallback(4)));
f.addEventListener("click", () => (keyboardCallback(5)));
fsharp.addEventListener("click", () => (keyboardCallback(6)));
g.addEventListener("click", () => (keyboardCallback(7)));
gsharp.addEventListener("click", () => (keyboardCallback(8)));
a.addEventListener("click", () => (keyboardCallback(9)));
asharp.addEventListener("click", () => (keyboardCallback(10)));
b.addEventListener("click", () => (keyboardCallback(11)));
