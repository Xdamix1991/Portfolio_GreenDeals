import { dealService, userService, VoteService } from './apiScripts.js';

const dealsContainer = document.querySelector('.deal_container');


export function displayDeals(deals, container) {
    container.innerHTML = deals.map(deal => `
            <div class="deal_details">
        <div class="deal-image">
            <img src="${deal.image || 'https://via.placeholder.com/150'}" alt="${deal.title}">
            <div class="vote-buttons">
    <div class="green-vote">
        <div class="vote-controls">
            <!-- Bouton vote up (flèche vers le haut) -->
            <button class="vote-btn green-up" data-deal="${deal.id}" data-type="green" data-value="1">
                <img src="/statics/images/up.svg" alt="Vote up" class="vote-icon">
            </button>
            <div class="vote-counts">${deal.green_vote_sum}</div>
            <!-- Bouton vote down (flèche vers le bas) -->
            <button class="vote-btn green-down" data-deal="${deal.id}" data-type="green" data-value="-1">
                <img src="/statics/images/down.svg" alt="Vote down" class="vote-icon">
            </button>
        </div>
    </div>
    <div class="price-vote">
        <div class="vote-controls">
            <!-- Bouton vote up (flèche vers le haut) -->
            <button class="vote-btn price-up" data-deal="${deal.id}" data-type="price" data-value="1">
                <img src="/statics/images/up.svg" alt="Vote up" class="vote-icon">
            </button>
            <div class="vote-counts">${deal.price_vote_sum}</div>
            <!-- Bouton vote down (flèche vers le bas) -->
            <button class="vote-btn price-down" data-deal="${deal.id}" data-type="price" data-value="-1">
                <img src="/statics/images/down.svg" alt="Vote down" class="vote-icon">
            </button>
        </div>
    </div>
</div>
        </div>
        <div class="deal_text_content">
            <div class="deal_header">
                <div class="price"><p>${deal.price}€</p></div>
                <div class="title"><h3>${deal.title}</h3></div>
                <div class="reated_at"><h3>${deal.created_ago}</h3></div>
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


    setupVoteButtons();
}


export function setupVoteButtons() {
    const voteButtons = document.querySelectorAll('.vote-btn');
    voteButtons.forEach(button => {
        button.removeEventListener('click', handleVote);
        button.addEventListener('click', handleVote);
    });
}


export async function handleVote(event) {
    const dealId = event.target.getAttribute('data-deal');
    const voteType = event.target.getAttribute('data-type');
    const value = parseInt(event.target.getAttribute('data-value'));

    try {
        const voteData = {
            deal_id: dealId
        };

        // Ajouter le type de vote approprié
        if (voteType === 'green') {
            voteData.green_vote = value;
        } else if (voteType === 'price') {
            voteData.price_vote = value;
        }


        const response = await VoteService.create(voteData);

        if (response.success) {

            const dealContainer = event.target.closest('.deal_details');


            if (voteType === 'green') {
                const greenVoteDisplay = dealContainer.querySelector('.green-vote .vote-counts');
                greenVoteDisplay.textContent = response.green_vote_sum;
            } else if (voteType === 'price') {
                const priceVoteDisplay = dealContainer.querySelector('.price-vote .vote-counts');
                priceVoteDisplay.textContent = response.price_vote_sum;
            }
        } else {
            console.error('Erreur lors du vote:', response.message);
        }
    } catch (error) {
        console.error('Erreur lors du vote:', error);
    }
}

async function fetchDeals() {
    try {
        const deals = await dealService.getAll();
        if (deals) {
            displayDeals(deals, dealsContainer);
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des deals:', error);
        dealsContainer.innerHTML = '<p>Erreur lors du chargement des deals</p>';
    }
}


document.addEventListener('DOMContentLoaded', () => {
    fetchDeals();
});




