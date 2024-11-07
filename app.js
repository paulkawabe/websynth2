//assign elements in dom
const button = document.querySelector(".note-button"); //start stop
const complexityDisplay = document.querySelector(".complexity-display");
const complexityUp = document.querySelector(".complexity-up");
const complexityDown = document.querySelector(".complexity-down");
const keyDisplay = document.querySelector(".key-display");
const keyUp = document.querySelector(".key-up");
const keyDown = document.querySelector(".key-down");
const keyQualityToggle = document.querySelector(".key-quality-toggle");
const keyQualityDisplay = document.querySelector(".key-quality-display");
const romanNumeralDisplay = document.querySelector(".roman-numeral-display");
const extensionsDisplay = document.querySelector(".extensions-display");
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

Tone.getTransport().bpm.value = 120;




class Synthesizer {

  constructor() {
    this.synth = new Tone.Synth().toDestination();
  }

  //status variables
  playing = false;
  beat = 1;
  chord = ['C3', 'E3', 'G3', 'B3', 'C4', 'E4', 'G4', 'B4'];
  key = 0;
  keyQuality = "maj";
  complexity = 4;
  activeDegree = 0;
  playedNote = 'C3';
  playedNoteIndex = 0;
  romanNumeral = 'I';
  noteValue = '8n';
  direction = 'ascending';

  //resources
  romanNumerals = {
    maj: ['I', 'V/ii','ii', 'vii&deg;/iii','iii', 'IV', 'V/V','V', 'vii&deg;/vi', 'vi', 'V/IV','vii&deg;'],
    min: ['i', '&#9837;II', 'ii&deg;', 'III', 'vii&deg;/iv', 'iv', 'V/V', 'V', 'VI', 'V/ii&deg;', 'V/iv', 'vii&deg;']
  }

  noteNames = {
    sharps: ['C', 'C&sharp;', 'D', 'D&sharp;', 'E', 'F', 'F&sharp;', 'G', 'G&sharp;', 'A', 'A&sharp;', 'B'],
    flats: ['C', 'D&#9837;', 'D', 'E&#9837;', 'E', 'F', 'G&#9837;', 'G', 'A&#9837;', 'A', 'B&#9837;', ]
  }

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
    this.romanNumeral = this.romanNumerals[this.keyQuality].at(this.activeDegree - this.key);
    romanNumeralDisplay.innerHTML = this.romanNumeral;
    this.updateSeq();
  }

  updateComplexity(direction = 0) {
    if (this.complexity + direction < 1 || this.complexity + direction > 6) {
      return;
    }

    this.complexity += direction;
    complexityDisplay.innerHTML = this.complexity;
    switch(this.complexity) {
      case 4:
        extensionsDisplay.innerHTML = "7";
        break;
      case 5:
        extensionsDisplay.innerHTML = "7, 9";
        break;
      case 6:
        extensionsDisplay.innerHTML = "7, 9, 11";
        break;
      default:
        extensionsDisplay.innerHTML = "none";
    }

    if (this.complexity > 3 && this.keyQuality === 'maj' && (this.activeDegree === 11 || this.activeDegree === 3)) {
      extensionsDisplay.innerHTML = "7";
    } else if (this.complexity > 3 && this.keyQuality === 'min' && (this.activeDegree === 4 || this.activeDegree === 11)) {
      extensionsDisplay.innerHTML = "7";
    }
    this.updateChord();
  }

  updateKey(direction) {

    if (this.key + direction < 0 || this.key + direction > 11) {
      return;
    }

    const currentKey = document.querySelector('.tonic');
    console.log(currentKey);

    if (!!currentKey) {
      currentKey.classList.remove('tonic');
    }

    this.key += direction;
    this.updateActiveDegree(this.activeDegree += direction);
    keyDisplay.innerHTML = this.noteNames.sharps.at(this.key);
    keyboardArray[this.key].classList.add('tonic');
    this.updateChord();
  }

  updateKeyQuality() {
    if (this.keyQuality === 'maj') {
      this.keyQuality = 'min';
      keyQualityToggle.innerHTML = 'minor';
      keyQualityDisplay.innerHTML = 'minor';
      this.updateChord();
    } else {
      this.keyQuality = 'maj';
      keyQualityToggle.innerHTML = 'major';
      keyQualityDisplay.innerHTML = 'major';
      this.updateChord();
    }
  }

  updateActiveDegree(degree) {

    const selectedKey = document.querySelector('.selected-key');

    if (!!selectedKey) {
      selectedKey.classList.remove('selected-key');
    }
    synth.activeDegree = degree;

    keyboardArray[synth.activeDegree].classList.add('selected-key');

    this.updateComplexity();
    this.updateChord();
  }

  readPlayedNote() {
    return this.synth.playedNote;
  }

  readPlayedNoteIndex() {
    return this.synth.playedNoteIndex;
  }

  readRomanNumeral() {
    return this.romanNumeral;
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
      }, 100);
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
}, "8n")


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


romanNumeralDisplay.innerHTML = synth.readRomanNumeral();
keyboardArray[synth.key].classList.add("tonic");

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
