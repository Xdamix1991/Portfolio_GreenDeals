import { dealService } from './apiScripts.js';
import { handleVote, displayDeals, setupVoteButtons } from './deals.js';

const filtersBar = document.querySelector('.filters_bar');
const dealFilterContainer = document.getElementById('deal_filters');
const formBarSearch = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const barResearchContainer = document.getElementById('results_bar');


let isDealFilterVisible = false;
let isBarResearchVisible = false;




async function getDealsWithFilters(filters) {
  try {
    const deals = await dealService.getByFilters(filters);
    if (deals) {
        displayDeals(deals, dealFilterContainer);

    }
  } catch (error) {
    alert('Erreur lors de la récupération des deals');
  }
}

// Fonction pour gérer la soumission du formulaire de filtre
function handleFilterSubmit(event) {
  event.preventDefault();
  event.stopPropagation();

  const filters = {
    price: document.getElementById('price').value,
    categorie: document.getElementById('category').value,
    reparability: document.getElementById('reparability').value
  };

  for (let key in filters) {
    if (filters[key] === 'null') {
      filters[key] = null;
    }
  }

  console.log("Formulaire soumis !");
  console.log("Filtres envoyés:", filters);

  // Cache le `barResearchContainer` et affiche `dealFilterContainer` immédiatement
  hideElement(barResearchContainer);
  showElement(dealFilterContainer);

  // Récupération des deals avec filtres
  getDealsWithFilters(filters);


  isDealFilterVisible = true;
  isBarResearchVisible = false;
}

// Fonction pour gérer la soumission de la recherche
async function handleSearchSubmit(event) {
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
    if(researchResult){    // Cache le `dealFilterContainer` et affiche `barResearchContainer` immédiatement
    hideElement(dealFilterContainer);
    showElement(barResearchContainer);

    displayDeals(researchResult, barResearchContainer)
    } else {
      barResearchContainer.innerHTML = "<p>Aucun résultat trouvé.</p>";
    }

    // Mettre à jour le flag pour afficher le bon conteneur
    isDealFilterVisible = false;
    isBarResearchVisible = true;

  } catch (error) {
    console.error('Erreur lors de la requête:', error);
    barResearchContainer.innerHTML = "<p>Une erreur est survenue. Veuillez réessayer.</p>";
  }
}

function hideElement(element) {
  element.style.display = 'none';
  if (element.parentElement) {
    element.parentElement.style.display = 'none';
  }
}


function showElement(element) {
  element.style.display = '';
  if (element.parentElement) {
    element.parentElement.style.display = '';
  }
}


filtersBar.addEventListener('submit', handleFilterSubmit);
formBarSearch.addEventListener('submit', handleSearchSubmit);

// Masquer les deux conteneurs au début
hideElement(dealFilterContainer);
hideElement(barResearchContainer);
