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
//indexed array of keys
const keyboardArray = [c, csharp, d, dsharp, e, f, fsharp, g, gsharp, a, asharp, b];

Tone.getTransport().bpm.value = 200;
console.log(Tone.getTransport());




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
  playedNote = 'C3';
  playedNoteIndex = 0;
  noteValue = '4n';
  direction = 'ascending';

  // sequence that plays arpeggiated notes in chord
  seq = new Tone.Sequence(
    (time, note) => {
      this.synth.triggerAttackRelease(note, '4n', time);
      this.synth.playedNote = note;
      this.synth.playedNoteIndex = chordGenerator.notes.indexOf(note)%12;
    },
    this.chord,
    this.noteValue
  ).start(0);

  //methods

  updateSeq() {
    this.seq.dispose();

    this.seq = new Tone.Sequence(
      (time, note) => {
        this.synth.triggerAttackRelease(note, "4n", time);
        this.synth.playedNote = note;
        this.synth.playedNoteIndex = chordGenerator.notes.indexOf(note)%12;
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

  readPlayedNote() {
    return this.synth.playedNote;
  }

  readPlayedNoteIndex() {
    return this.synth.playedNoteIndex;
  }

  clearActiveNotes() {
    let activeNote = document.querySelector('.active-key')
    if(!!activeNote) {
      activeNote.classList.remove('active-key');
      activeNote.classList.add('inactive-key');
    }
  }

  startstop() {
    if (this.playing === false) {
      this.updateSeq;
      Tone.getTransport().start();
      this.playing = true;
    } else {
      Tone.getTransport().stop();
      this.playing = false;

      //account for latency in tonejs sequencer
      setTimeout(() => {
        this.clearActiveNotes();
      }, 50);
    }
  }

  status() {
    console.log(`playing: ${this.playing}, chord: ${this.chord}`);
  }
}

const synth = new Synthesizer();


//DRAW AREA
Tone.getTransport().scheduleRepeat(function(time){
	//use the time argument to schedule a callback with Tone.Draw
	Tone.Draw.schedule(function(){
		//do drawing or DOM manipulation here

    synth.clearActiveNotes();
    
    keyboardArray[synth.readPlayedNoteIndex()].classList.remove('inactive-key');
    keyboardArray[synth.readPlayedNoteIndex()].classList.add('active-key');
    
	}, time)
}, "4n")


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
