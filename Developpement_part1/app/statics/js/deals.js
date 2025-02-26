
const dealsContainer = document.querySelector('.deal_container');

// Fonction pour récupérer les deals depuis l'API
async function fetchDeals() {
    try {
        const response = await fetch('/api/deals');
        if (!response.ok) {
            throw new Error('Erreur réseau');
        }
        const deals = await response.json();
        displayDeals(deals);
    } catch (error) {
        console.error('Erreur lors de la récupération des deals:', error);
        dealsContainer.innerHTML = '<p>Erreur lors du chargement des deals</p>';
    }
}

// Fonction pour afficher les deals
function displayDeals(deals) {
    dealsContainer.innerHTML = deals.map(deal => `
        <div class="deal_cards">

            <div class="deal_details">
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


// Appelle la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', fetchDeals);



