import { dealService, userService } from './apiScripts.js';


document.addEventListener('DOMContentLoaded', function(event) {
  const addDealButton = document.getElementById("deal_form");

  const resultContainer = document.getElementById("result_container");
  if (addDealButton) {
    addDealButton.addEventListener('submit', async function(event) {
      event.preventDefault();
  const deal_data = {
    title: document.getElementById('title').value,
    link: document.getElementById('lien').value,
    description: document.getElementById('description').value,
    price: document.getElementById('price').value,
    categorie: document.getElementById('categorie').value,
    location: document.getElementById('location').value,
    reparability: document.getElementById('reparability').value,
  }

  try {
    const result = await dealService.create( deal_data,{

      headers: {
        'Content-Type': 'application/json',

      },
      credentials: 'include'
  })

    alert('votre Deal a été posté avec succés')

    resultContainer.innerHTML = `
    <div class="user_deal">
    <h2> deal crée avec succés </h2>
    <title> ${result.title} </title>
    <p>prix: ${result.price} $</p>
    <p>lien: ${result.link} </p>
    <p>IDR: ${result.reparability} </p>
    </div>
    `

    addDealButton.reset();
  } catch (error) {
    alert('Erreur lors de la création du deal: ' + error.message)
  }
})

}
});
