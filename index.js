// You must get your own API key from open AI and make your own API_key.js file!
// import secretKey from "./API_key.js"

exports.handler = async () => {
  const mySecret = process.env.MY_SECRET;
  console.log(mySecret)
  return {
    statusCode: 200,
    body: `hello world! I have a ${mySecret}`,
  };
};

const secretKey = "123"

const generateBtn = document.getElementById('generate-btn');
const form = document.getElementById('form');
const formData = new FormData(form)
const letterInfo = { giver, receiver, notes, length }
const slider = document.getElementById("length")

slider.addEventListener("input", function() {
  const wordCountEl = document.getElementById("word-count")
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
  console.log(letterInfo)

  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      'Authorization': `Bearer ${secretKey.key}`,
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
  })
}

function getPrompt(length, giver, receiver, notes) {
  const prompt = `
    Write a love letter ${length} words long addressed from ${giver} to ${receiver}. Assume this is the innerHTML of an HTML div element and format accordingly with p and br elements. Do not include any br element in the sign-off! All text should be inside a p element but not inside a div.
    Additional requirements/notes:
    ${notes}
  `
  return prompt
}