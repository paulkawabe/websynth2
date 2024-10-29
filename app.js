//assign elements in dom
const button = document.querySelector(".note-button"); //start stop
const complexityDisplay = document.querySelector(".complexity-display");
const complexityUp = document.querySelector(".complexity-up");
const complexityDown = document.querySelector(".complexity-down");
const keyDisplay = document.querySelector(".key-display");
const keyUp = document.querySelector(".key-up");
const keyDown = document.querySelector(".key-down");
const keyQualityToggle = document.querySelector(".key-quality-toggle");
// const directionToggle = document.querySelector(".direction-toggle");
const drawTest = document.querySelector(".draw-test");

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

Tone.getTransport().bpm.value = 200;
console.log(Tone.getTransport());

Tone.getTransport().scheduleRepeat(function(time){
	//use the time argument to schedule a callback with Tone.Draw
	Tone.Draw.schedule(function(){
		//do drawing or DOM manipulation here
    if (drawTest.className == 'draw-test') {
      drawTest.className = '';
    } else {
      drawTest.className = 'draw-test';
    }

    console.log(time)
    
	}, time)
}, "8n")

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
  noteValue = '8n';
  direction = 'ascending';

  // sequence that plays arpeggiated notes in chord
  seq = new Tone.Sequence(
    (time, note) => {
      this.synth.triggerAttackRelease(note, "4n", time);
    },
    this.chord,
    this.noteValue
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
      this.noteValue
    ).start(0);
  }

  updateChord() {
    this.chord = chordGenerator.addNotes(synth.key, synth.keyQuality, synth.activeDegree, synth.complexity, synth.direction);
    this.updateSeq();
  }

  updateComplexity(direction) {
    if (this.complexity + direction < 1 || this.complexity + direction > 6) {
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

  updateKeyQuality() {
    if (this.keyQuality === 'maj') {
      this.keyQuality = 'min';
      keyQualityToggle.innerHTML = 'minor';
      this.updateChord();
    } else {
      this.keyQuality = 'maj';
      keyQualityToggle.innerHTML = 'major';
      this.updateChord();
    }
  }

  // updateDirection() {
  //   if (this.direction == 'ascending') {
  //     this.direction = 'descending';
  //     directionToggle.innerHTML = 'descending';
  //     this.updateChord();
  //   } else {
  //     this.direction = 'ascending';
  //     directionToggle.innerHTML = 'ascending';
  //     this.updateChord();
  //   }
  // }

  updateActiveDegree(degree) {
    synth.activeDegree = degree;
    synth.updateChord();
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
keyQualityToggle.addEventListener("click", () => {
  synth.updateKeyQuality();
})
// directionToggle.addEventListener("click", () => {
//   synth.updateDirection();
// })

//keyboard
c.addEventListener("click", () => (synth.updateActiveDegree(0)));
csharp.addEventListener("click", () => (synth.updateActiveDegree(1)));
d.addEventListener("click", () => (synth.updateActiveDegree(2)));
dsharp.addEventListener("click", () => (synth.updateActiveDegree(3)));
e.addEventListener("click", () => (synth.updateActiveDegree(4)));
f.addEventListener("click", () => (synth.updateActiveDegree(5)));
fsharp.addEventListener("click", () => (synth.updateActiveDegree(6)));
g.addEventListener("click", () => (synth.updateActiveDegree(7)));
gsharp.addEventListener("click", () => (synth.updateActiveDegree(8)));
a.addEventListener("click", () => (synth.updateActiveDegree(9)));
asharp.addEventListener("click", () => (synth.updateActiveDegree(10)));
b.addEventListener("click", () => (synth.updateActiveDegree(11)));
