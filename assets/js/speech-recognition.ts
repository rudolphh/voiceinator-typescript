import search from '../js/bible-api-search'

const recognition : SpeechRecognition = new SpeechRecognition;
recognition.interimResults = true;

let p : HTMLParagraphElement = document.createElement("p");
let small : HTMLElement = document.createElement("small");

const searchInputLabel : HTMLElement = document.querySelector(`#search-input-label`)!;
const searchInput : HTMLElement = document.querySelector(`#search-input`)!;


p.contentEditable = "true";
p.textContent = "Voiceinator";

small.innerHTML =
  "Say a simple <strong>color</strong>, tell <strong>Rudy</strong> what to Google," + 
   "or <strong>Bible</strong> to search scripture";
   
small.innerHTML += `
<small><div style="margin: 5px; font-weight: normal;">can also use: </div>
  <ul>
    <li><strong>YouTube </strong>&lt;search query&gt;</li>
    <li><strong>indeed </strong>&lt;'job title' in 'location'&gt;</li>
  </ul>
</small>`;


const words : HTMLElement = document.querySelector(".words")!;
words.appendChild(p);
words.appendChild(small);

function resultHandler(e : any) {
  //console.log(e.results);
  const transcript = Array.from(e.results)
    .map((result : any) => result[0])
    .map((result) => result.transcript)
    .join("");

  p.textContent = transcript;

  if (e.results[0].isFinal) {
    //p = document.createElement("p");
    //words.appendChild(p);

    let spokenColors = transcript
      .split(" ")
      .filter((word) =>
        CSS_COLOR_NAMES.includes(word.charAt(0).toUpperCase() + word.slice(1))
      );
    document.body.style.backgroundColor = spokenColors[spokenColors.length - 1];

    // "rudy"
    if (transcript.includes("Rudy")) {
      let baseUrl = "https://www.google.com/search?q=";
      let searchIndex = transcript.lastIndexOf("Rudy") + 5; // ignore name plus a space
      //console.log(searchIndex)
      let query = transcript.substring(searchIndex);
      //console.log("field: " + searchField);

      // encode only the query string
      let completeUrl = baseUrl + encodeURIComponent(query);
      console.log(completeUrl);
      window.open(completeUrl);
      return;
    }

    // "bible"
    if (transcript.includes("Bible")) {
      let searchIndex = transcript.lastIndexOf("Bible") + 6; // ignore name plus a space
      let query = transcript.substring(searchIndex);

      const beBack = <HTMLAudioElement> document.getElementById("myAudio")!;
      const vcinLogo : HTMLElement = document.querySelector(".vcin-logo")!;

      if (!vcinLogo.classList.contains("disappear")) {
        beBack.play();
        vcinLogo.classList.add("disappear");
        searchInputLabel.style.display = "inline-block";
      }

      searchInput.innerHTML = query;
      search(encodeURIComponent(query));
      return;
    }

    // jobs
    let phrase : string = "indeed";
    if (transcript.toLowerCase().includes(phrase)) {
      const baseUrl : string = "https://www.indeed.com/jobs?q=";
      let searchIndex : number = transcript.lastIndexOf(phrase) + phrase.length + 1;
      let query : string = transcript.substring(searchIndex);

      let completeUrl : string = baseUrl + encodeURIComponent(query);

      console.log(completeUrl);
      window.open(completeUrl);
      return;
    }

    //youtube
    phrase = "YouTube";
    if (transcript.includes(phrase)) {
      const baseUrl : string = "https://www.youtube.com/results?search_query=";
      let searchIndex : number = transcript.lastIndexOf(phrase) + phrase.length + 1;
      let query : string = transcript.substring(searchIndex);

      // encode only the query string
      let completeUrl : string = baseUrl + encodeURIComponent(query);
      console.log(completeUrl);
      window.open(completeUrl);
      return;
    }

    msg.text = transcript;
    recognition.stop();
    window.speechSynthesis.speak(msg);
  }
}

recognition.addEventListener("result", resultHandler);
//recognition.addEventListener("end", recognition.start);
//recognition.start();

function debounce(this: void, func : Function, timeout = 300) {
  let timer : number;
  return (...args : any) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(this, args);
    }, timeout);
  };
}

document.querySelector(".words p")!.addEventListener(
  "input",
  debounce(function (){
    msg.text = document.querySelector(".words p")!.textContent!;
    speechSynthesis.speak(msg);
  }, 500)
);

document.querySelector("#speak-btn")!.addEventListener("click", (e) => {
  recognition.start();
});
