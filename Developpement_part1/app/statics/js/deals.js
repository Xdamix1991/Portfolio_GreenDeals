
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
            <div class="deal_details">
        <div class="deal-image">
            <img src="${deal.image || 'https://via.placeholder.com/150'}" alt="${deal.title}">
        </div>
        <div class="deal_text_content">
            <div class="deal_header">
                <div class="price"><p>${deal.price}€</p></div>
                <div class="title"><h3>${deal.title}</h3></div>
                <div class="reated_at"><h3>posté:le...</h3></div>
            </div>

            <div class="description"><p>${deal.description}</p></div>

            <div class="deal_footer">
                <div class="location"><p>📍 ${deal.location}</p></div>

                <div class="category"><p>${deal.categorie}</p></div>
                ${deal.reparability ? `<p class="reparability">Indice de réparabilité: ${deal.reparability}/10</p>` : ''}
                <div class="comment"><a href="#">💬commentaires<a></div>
                </div>

            ${deal.link ? `<a href="${deal.link}" target="_blank" class="deal-link">Voir l'offre</a>` : ''}
        </div>
    </div>
    `).join('');
}


// Appelle la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', fetchDeals);



