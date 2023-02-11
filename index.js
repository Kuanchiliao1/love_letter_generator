/*
Game plan:
- initialize the generate btn
- initialize the form
- add event listener to the generate btn
  - prevent default
  - call openAI api
    - loading animation/picture while we wait
      consider getting text token by token
    - 
  - clear form
- display modal with the generated text
- count characters
  - add eventlisteners to both inputs to constantly listen for any keypress
    - on every keypress
      - count all the chars in both inputs
      - counts all the words in both inputs
*/

const generateBtn = document.getElementById('generate-btn');
const form = document.getElementById('form');
const formData = new FormData(form)
const letterInfo = {
  giver: "",
  receiver: "",
  notes: "",
  length: ""
}

const modal = document.getElementById("modal")
const letter = `
My Dearest,

I think of you constantly, my love. Every morning when I wake up and every night before I go to sleep, my heart is filled with thoughts of you. I never knew it was possible to feel such a deep, unwavering love for another person, until I met you.

You are the most beautiful thing I have ever seen. Your eyes sparkle and your smile lights up the room. I could get lost in your presence forever.

You bring out the best in me. When I am with you, I feel like I can do anything. I feel confident and brave and ready to take on the world. I'm so thankful for the way you encourage and support me.

The love I have for you is so immense and so powerful, it's hard to put into words. All I know is that I want to spend the rest of my life with you. I want to make memories together, laugh together and explore the world together. I want to love you, cherish you, and build a life together.

Forever yours,

[Your Name]`
generateBtn.addEventListener("click", (event)=> {
  btnAction(event)
})

function btnAction(event) {
  event.preventDefault()
  letterInfo.giver = document.getElementById("giver").value
  letterInfo.receiver =  document.getElementById("receiver").value
  letterInfo.notes =  document.getElementById("notes").value
  letterInfo.length =  document.getElementById("length").value
  const { giver, receiver, notes, length } = letterInfo

  fetch("https://api.openai.com/v1/completions", {
    method: "POST",
    headers: {
      'Authorization': "Bearer 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",
      'Content-Type': "application/json",
    },
   body: JSON.stringify({
      "prompt": `
      Write a love letter ${length} words long addressed from ${giver} to ${receiver}. Assume this is the innerHTML of an HTML div element and format accordingly with p and br elements. Do not include br element in the signoff!
      Additional requirements/notes:
      ${notes}
      `,
      "max_tokens": 250,
      "model": "text-davinci-003",
    })
  })
  .then(request => request.json())
  .then(data => {
    console.log(data)
    const loveText = data['choices'][0].text
    let wordCount = loveText.split(" ").length
    renderModel(modal, data)
    console.log("Word count: " + wordCount)
  })

  // formData.clear()
  modal.style.display = "block"
}

function renderModel(modalElement, data) {
  modal.innerHTML = data['choices'][0].text
  modalElement.style.display = "block"

  // For deleting the modal
  const deleteModalBtn = document.createElement("button").setAttribute("id", "close-modal-btn")
  deleteModalBtn.addEventListener("click", function() {
    modal.style.display = "none"
  })
}

function getPrompt(nameValue, notesValue) {
  return `
  Write me a love letter for ${nameValue}. The love letter must be about the following things:
  ${notesValue}
  `
}