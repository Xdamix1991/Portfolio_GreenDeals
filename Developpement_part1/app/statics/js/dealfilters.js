import { dealService } from './apiScripts.js';
import { displayDeals, setupVoteButtons } from './deals.js';

const filtersBar = document.querySelector('.filters_bar');
const dealFilterContainer = document.getElementById('deal_filters');
const formBarSearch = document.getElementById('search-form');
const searchInput = document.getElementById('search-input');
const barResearchContainer = document.getElementById('results_bar');
const mainDealContainer = document.querySelector('.deal_container');

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

  // Cacher le conteneur principal de deals
  hideElement(mainDealContainer);

  // Cacher le conteneur de résultats de recherche
  hideElement(barResearchContainer);

  // Afficher le conteneur de deals filtrés
  showElement(dealFilterContainer);

  // Récupération des deals avec filtres
  getDealsWithFilters(filters);

  isDealFilterVisible = true;
  isBarResearchVisible = false;

  // Notifier les autres modules du changement d'état
  document.dispatchEvent(new CustomEvent('displayStateChanged', {
    detail: {
      showMainDeals: false,
      showFilteredDeals: true,
      showSearchResults: false
    }
  }));
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

    // Cacher le conteneur principal de deals
    hideElement(mainDealContainer);

    // Cacher le conteneur de deals filtrés
    hideElement(dealFilterContainer);

    // Afficher le conteneur de résultats de recherche
    showElement(barResearchContainer);

    if(researchResult && researchResult.length > 0) {
      displayDeals(researchResult, barResearchContainer);
    } else {
      barResearchContainer.innerHTML = "<p>Aucun résultat trouvé.</p>";
    }

    // Mettre à jour le flag pour afficher le bon conteneur
    isDealFilterVisible = false;
    isBarResearchVisible = true;

    // Notifier les autres modules du changement d'état
    document.dispatchEvent(new CustomEvent('displayStateChanged', {
      detail: {
        showMainDeals: false,
        showFilteredDeals: false,
        showSearchResults: true
      }
    }));
  } catch (error) {
    console.error('Erreur lors de la requête:', error);
    barResearchContainer.innerHTML = "<p>Une erreur est survenue. Veuillez réessayer.</p>";
  }
}

function hideElement(element) {
  if (element) {
    element.style.display = 'none';
  }
}

function showElement(element) {
  if (element) {
    element.style.display = '';
  }
}

// Fonction pour réinitialiser l'affichage
function resetView() {
  hideElement(dealFilterContainer);
  hideElement(barResearchContainer);
  showElement(mainDealContainer);

  isDealFilterVisible = false;
  isBarResearchVisible = false;

  // Notifier les autres modules du changement d'état
  document.dispatchEvent(new CustomEvent('displayStateChanged', {
    detail: {
      showMainDeals: true,
      showFilteredDeals: false,
      showSearchResults: false
    }
  }));
}

// Utiliser un bouton de réinitialisation existant s'il existe
const resetButton = document.getElementById('reset-filters');
if (resetButton) {
  resetButton.addEventListener('click', resetView);
}

filtersBar.addEventListener('submit', handleFilterSubmit);
formBarSearch.addEventListener('submit', handleSearchSubmit);

// Masquer uniquement les conteneurs de filtres et de résultats de recherche au départ
hideElement(dealFilterContainer);
hideElement(barResearchContainer);
