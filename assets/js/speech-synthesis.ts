const msg : SpeechSynthesisUtterance = new SpeechSynthesisUtterance();

let voices : SpeechSynthesisVoice [] = [];
const voicesDropdown : HTMLElement = <HTMLElement> document.querySelector('[name="voice"]')!;
const options : NodeList = document.querySelectorAll('[type="range"]');

// msg.text = transcript or query somewhere

function populateVoices(this: SpeechSynthesis) : void {
    voices = this.getVoices();
    console.log(voices);
    voicesDropdown.innerHTML = voices.map(voice => 
        `<option value="${voice.name}">${voice.name} (${voice.lang})</option>`
    ).join('');
}

function setVoice(this: HTMLInputElement) : void {
    console.log('voice changed');
    msg.voice = voices.find(voice => voice.name === this.value)!;
    toggle();
}

function toggle() : void {
    speechSynthesis.cancel();
    speechSynthesis.speak(msg);
}

function setOptions(this: HTMLInputElement) : void {
    console.log(this.name, this.value);
    const nameKey : keyof SpeechSynthesisUtterance = <keyof SpeechSynthesisUtterance> this.name;
    msg[nameKey] = <never> this.value;
    toggle();
}

options.forEach(option => option.addEventListener('change', setOptions));


window.speechSynthesis.addEventListener('voiceschanged', populateVoices);
//window.speechSynthesis.addEventListener('end', recognition.start);
voicesDropdown.addEventListener('change', setVoice);