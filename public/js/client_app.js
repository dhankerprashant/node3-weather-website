console.log('Client side JS file loaded')

fetch('/weather?address=dubai').then((response) => {
    response.json().then((data) => {
        console.log(data)
    })
})
// postMessage("Some message.......")
console.log('http call completed..')

const weatherForm = document.querySelector('form')
const locationInput = document.querySelector('input')
const message = document.querySelector('#msg1')

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault()
    fetch('/weather?address='+locationInput.value).then((response) => {
    response.json().then((data) => {
        message.textContent = data.forecast
        console.log(data)
    })
})
    
    console.log('Button clicked')
})