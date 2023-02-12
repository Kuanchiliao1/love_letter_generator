// You must get your own API key from open AI and make your own API_key.js file!
// import secretKey from "./API_key.js"

// exports.handler = async () => {
//   const mySecret = process.env.MY_SECRET;
//   console.log(mySecret)
//   return {
//     statusCode: 200,
//     body: `hello world! I have a ${mySecret}`,
//   };
// };
import randomLetterInfo from "./data.js"
console.log(randomLetterInfo)
// const secretKey = "123"
const secretKey = "stuff here to do,s,k,-,w,X,a,p,E,k,f,1,8,7,t,c,Y,o,E,e,C,F,f,d,T,3,B,l,b,k,F,J,N,X,5,F,l,3,v,E,7,m,6,e,4,7,A,b,r,x,6,p,no stuff here to do!"

const generateBtn = document.getElementById('generate-btn');
const form = document.getElementById('form');
const formData = new FormData(form)
const letterInfo = { giver, receiver, notes, length }
const slider = document.getElementById("length")

const wordCountEl = document.getElementById("word-count")

slider.addEventListener("input", function() {
  const wordCount = wordCountEl.value
  if (this.value !== wordCount ) {
    wordCountEl.innerHTML = this.value
  }
})

const modal = document.getElementById("modal")
generateBtn.addEventListener("click", (event)=> {
  btnAction(event)
})

function btnAction(event) {
  event.preventDefault()
  let { giver, receiver, notes, length } = letterInfo
  giver = document.getElementById("giver").value
  receiver =  document.getElementById("receiver").value
  notes =  document.getElementById("notes").value
  length =  document.getElementById("length").value
  console.log(length, giver, receiver, notes)

  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${secretKey.split(",").slice(1, -1).join("")}`,
      'Content-Type': "application/json",
    },
    body: JSON.stringify({
      "prompt": getPrompt(length, giver, receiver, notes),
      "max_tokens": 250,
      "model": "text-davinci-003",
    })
  })
  .then(request => request.json())
  .then(data => {
    const loveText = data['choices'][0].text
    const wordCount = loveText.split(" ").length
    renderModal(modal, data)
    console.log("Word count: " + wordCount)
  })

  // formData.clear()
  modal.style.display = "block"
}

function renderModal(modalElement, data) {
  const deleteModalBtnHtml = `<button type="button" id="close-modal"></button>`
  modal.innerHTML = data['choices'][0].text + deleteModalBtnHtml
  modalElement.style.display = "block"


  // For deleting the modal
  const deleteModalBtn = document.getElementById("close-modal")
  deleteModalBtn.addEventListener("click", function() {
    modal.style.display = "none"
    resetModalHtml()
  })
}

function getPrompt(length, giver, receiver, notes) {
  const prompt = `
    Write a love letter exactly ${length} words long addressed from ${giver} to ${receiver}. Output must be in HTML paragraph elements.
    Additional requirements/notes:
    ${notes}
  `
  return prompt
}

function resetModalHtml() {
  modal.innerHTML = `
    <h3>Your unique love letter is generating  <i class="fas fa-spinner fa-pulse"></i></h3>
    <p id="love-letter-content"></p>
  `
}

// TEST
const testBtn = document.getElementById("test")

testBtn.addEventListener("click", () => {
  const info = getRandomLetterInfo()
  const { giver, receiver, notes } = info
  document.getElementById("giver").value = giver
  document.getElementById("receiver").value = receiver
  document.getElementById("notes").value = notes
  document.getElementById("length").value = 85
  wordCountEl.innerText = 85
})

function getRandomLetterInfo() {
  const len = randomLetterInfo.length
  const randomIndex = Math.floor((Math.random() * len))
  return randomLetterInfo[randomIndex]
}