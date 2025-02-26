import { dealService } from './apiScripts.js';

const filtersBar = document.querySelector('.filters_bar');
const dealFilterContainer = document.getElementById('deal_filters')
const formBarSearch = document.getElementById('search-form')
const searchInput = document.getElementById('search-input')
const barResearchContainer = document.getElementById('results_bar')

filtersBar.addEventListener('submit', async function(event) {
    event.preventDefault();
    event.stopPropagation();
    const urlParams = new URLSearchParams(window.location.search);
    const filters = {
      price: document.getElementById('price').value,
      categorie: document.getElementById('category').value,
      reparability: document.getElementById('reparability').value
    }
    for (let key in filters) {
      if (filters[key] === 'null') {
          filters[key] = null;
      }
  }
    console.log("Formulaire soumis !");
    console.log("Filtres envoyés:", filters);
    try {
        const deals = await dealService.getByFilters(filters)
        displayResults(deals)
        console.log(result)
    }catch (error) {
        alert('Erruer lors de la recuperation des deals')
}
})

function displayResults(deals) {
  dealFilterContainer.innerHTML = deals.map(deal => `
      <div class="deals_filter">

          <div class="filter_details">
              <div class="title"  <h3 >${deal.title}</h3> </div>
              <p class="price"> prix ${deal.price}€</p>
              <p class="location">📍 ${deal.location}</p>
              <p class="category">${deal.categorie}</p>

              ${deal.reparability ? `
                  <p class="reparability">Indice de réparabilité: ${deal.reparability}/10</p>
              ` : ''}
              <p class="description">${deal.description}</p>
              ${deal.link ? `
                  <a href="${deal.link}" target="_blank" class="deal-link">Voir l'offre</a>
              ` : ''}
          </div>
      </div>
  `).join('');

}



formBarSearch.addEventListener('submit', async function(event) {
  event.preventDefault();

  const recherche = {
    name: searchInput.value.trim()
  };

  if (recherche.name === "") {
      alert('Veuillez entrer un mot-clé');
      return;
  }

  try {
      const researchResult = await dealService.getByFilters(recherche);
      if (researchResult.length > 0) {
          barResearchContainer.innerHTML = researchResult.map(deal => `
              <div class="deal-item">
                  <h3>${deal.title}</h3>
                  <p>Catégorie: ${deal.categorie}</p>
                  <p>Prix: ${deal.price}€</p>
                  <p>Réparabilité: ${deal.reparability}</p>
              </div>
          `).join('');
      } else {
          barResearchContainer.innerHTML = "<p>Aucun résultat trouvé.</p>";
      }
  } catch (error) {
      console.error('Erreur lors de la requête:', error);
      barResearchContainer.innerHTML = "<p>Une erreur est survenue. Veuillez réessayer.</p>";
  }
});
