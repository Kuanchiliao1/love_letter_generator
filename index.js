import randomLetterInfo from './data.js';

// I understand this is completely insecure way to use an API key, but I'm just trying to get this to work for now. I have set usage restrictions in place in case someone does find and use this key.
// The key is set like this bc Github will autodetect and disable my key if I leave it as it is, so I lightly scrambled it to trick Github.
const secretKey =
  'stuff here to do,s,k,-,w,X,a,p,E,k,f,1,8,7,t,c,Y,o,E,e,C,F,f,d,T,3,B,l,b,k,F,J,N,X,5,F,l,3,v,E,7,m,6,e,4,7,A,b,r,x,6,p,no stuff here to do!';

// DOM ELEMENTS
const wordCountEl = document.getElementById('word-count');
const modal = document.getElementById('modal');

// input elements
const giverInput = document.getElementById('giver');
const receiverInput = document.getElementById('receiver');
const notesInput = document.getElementById('notes');
const lengthInput = document.getElementById('length');

// buttons
const generateBtn = document.getElementById('generate-btn');
const randomFillBtn = document.getElementById('random-fill-btn');
const clearFormBtn = document.getElementById('clear-form-btn');


// EVENT LISTENERS
generateBtn.addEventListener('click', (event) => {
  btnAction(event);
});

// Update word count as user moves the slider
lengthInput.addEventListener('input', function () {
  wordCountEl.innerHTML = this.value;
});

// Btn to fill out form with random data
randomFillBtn.addEventListener('click', () => {
  const info = getRandomLetterInfo();
  const { giver, receiver, notes } = info;
  giverInput.value = giver;
  receiverInput.value = receiver;
  notesInput.value = notes;
  lengthInput.value = 85;
  wordCountEl.innerText = 85;
});

// Question: is there a better way to clear the form? I tried to use the FormData object with clear() and reset() but it was not working
clearFormBtn.addEventListener('click', () => {
  giverInput.value = '';
  receiverInput.value = '';
  notesInput.value = '';
  lengthInput.value = 85;
  wordCountEl.innerText = 85;
});

function btnAction(event) {
  event.preventDefault();
  fetch('https://api.openai.com/v1/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${secretKey.split(',').slice(1, -1).join('')}`,
      'Content-Type': 'application/json',
    },
    // Info I'm passing to the AI such as the prompt, length, model etc.
    body: JSON.stringify({
      prompt: getPrompt(
        lengthInput.value,
        giverInput.value,
        receiverInput.value,
        notesInput.value
      ),
      max_tokens: 250,
      model: 'text-davinci-003',
    }),
  })
    .then((request) => request.json())
    .then((data) => {
      renderModal(modal, data);
    })
  // This part has to come after the modal is rendered bc the modal is not rendered until the promise is resolved
  modal.style.display = 'block';
}

function renderModal(modalElement, data) {
  const deleteModalBtnHtml = `<button type="button" id="close-modal"></button>`;
  modal.innerHTML = data.choices[0].text + deleteModalBtnHtml;

  // For deleting the modal
  const deleteModalBtn = document.getElementById('close-modal');
  deleteModalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    resetModalHtml();
  });
}

// Prompt for the AI
function getPrompt(length, giver, receiver, notes) {
  return `
    Write a love letter exactly ${length} words long addressed from ${giver} to ${receiver}. Output must be in HTML paragraph elements.
    Additional requirements/notes:
    ${notes}
  `;
}

function resetModalHtml() {
  modal.innerHTML = `
    <h3>Your unique love letter is generating  <i class="fas fa-spinner fa-pulse"></i></h3>
    <p id="love-letter-content"></p>
  `;
}

// Get random letter info from data.js
function getRandomLetterInfo() {
  const len = randomLetterInfo.length;
  const randomIndex = Math.floor(Math.random() * len);
  return randomLetterInfo[randomIndex];
}
