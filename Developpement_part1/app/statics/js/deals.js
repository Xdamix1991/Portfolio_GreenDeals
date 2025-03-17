import { dealService, userService, VoteService } from './apiScripts.js';




export function displayDeals(deals, container) {

    container.innerHTML = deals.map(deal => `
            <div class="deal_details" deal-details="${deal.id}">
        <div class="deal-image">
            <div class="user"><img src="/statics/images/user.png" alt="user icon" class="user-icon"><p>  ${deal.owner_pseudo}</p></div>
            <img src="${deal.image ? `data:image/jpeg;base64,${deal.image}` : 'https://via.placeholder.com/150'}" alt="${deal.title}">
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
                <div class="price"><p>${deal.reduction}</p></div>
                <div class="title"><h3>${deal.title}</h3></div>
                <div class="reated_at"><h3>${deal.created_ago}</h3></div>
            </div>

            <div class="description"><p>${deal.description}</p></div>

            <div class="deal_footer">

                <div class="location"><p>📍 ${deal.location}</p></div>
                <div class="category"><p>${deal.categorie}</p></div>
                ${deal.reparability ? `<p class="reparability"><img src="/statics/images/idr.png" alt="reparability" class="reparability-icon"> ${deal.reparability}/10</p>` : ''}
                <div class="comment"><button type="submit">${deal.comments_number}<img src="/statics/images/chat.png" alt="comments" class="comments-icon"></button></div>
                ${deal.link ? `<a href="${deal.link}" target="_blank" class="deal-link">Voir l'offre</a>` : ''}
            </div>
        </div>
    </div>
    `).join('');


    setupVoteButtons();
    dealRedirecting();
}


export function setupVoteButtons() {
    const voteButtons = document.querySelectorAll('.vote-btn');
    voteButtons.forEach(button => {
        button.removeEventListener('click', handleVote);
        button.addEventListener('click', handleVote);
    });
}


export async function handleVote(event) {
    // Find the closest button element since event.target might be the image
    const button = event.target.closest('.vote-btn');
    if (!button) return; // Exit if we didn't click on a vote button

    const currentDeal = button.closest('.deal_details');
    const dealId = currentDeal.getAttribute('deal-details');
    const voteType = button.getAttribute('data-type');
    const value = parseInt(button.getAttribute('data-value'));

    console.log(`dealId: ${dealId}`);
    console.log(`voteType: ${voteType}`);
    console.log(`value: ${value}`);

    try {
        const voteData = {
            deal_id: dealId
        };

        // Add the appropriate vote type
        if (voteType === 'green') {
            voteData.green_vote = value;
        } else if (voteType === 'price') {
            voteData.price_vote = value;
        }

        console.log('Sending vote data:', voteData); // debugging

        const response = await VoteService.create(voteData);

        if (response.success) {
            const dealContainer = button.closest('.deal_details');

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
    const dealsContainer = document.querySelector('.deal_container');
    if (!dealsContainer) return;

    try {
        const deals = await dealService.getAll();
        if (deals) {
            displayDeals(deals, dealsContainer);

            // Vérifier si l'un des conteneurs de filtres ou de recherche est déjà visible
            const dealFilterContainer = document.getElementById('deal_filters');
            const barResearchContainer = document.getElementById('results_bar');

            if ((dealFilterContainer && dealFilterContainer.style.display !== 'none') ||
                (barResearchContainer && barResearchContainer.style.display !== 'none')) {
                dealsContainer.style.display = 'none';
            }
        }
    } catch (error) {
        console.error('Erreur lors de la récupération des deals:', error);
        dealsContainer.innerHTML = '<p>Erreur lors du chargement des deals</p>';
    }
}

function dealRedirecting() {
    const dealContainers = document.querySelectorAll('.deal_details');
    dealContainers.forEach(container => {
        container.addEventListener('click', (event) => {
            // Vérifie si l'élément cliqué est un bouton de vote ou le bouton "Voir l'offre"
            const isVoteButton = event.target.closest('.green-vote');
            const isDealLink = event.target.closest('.deal-link');
            const isVoteButton2 = event.target.closest('.price-vote');



            if (!isVoteButton && !isDealLink && !isVoteButton2) {
                const dealId = container.getAttribute('deal-details');
                console.log(dealId)
                localStorage.setItem('dealID', dealId)
                window.location.href = 'deal/${dealId}`';
            }
        });
    });
}

export function displayDeal(deal, container) {
    container.innerHTML = `
        <div class="deal_details" deal-details="${deal.id}">
            <div class="deal-image">
                <img src="${deal.image ? `data:image/jpeg;base64,${deal.image}` : 'https://via.placeholder.com/150'}" alt="${deal.title}">
                <div class="vote-buttons">
                    <div class="green-vote">
                        <div class="vote-controls">
                            <button class="vote-btn green-up" data-deal="${deal.id}" data-type="green" data-value="1">
                                <img src="/statics/images/up.svg" alt="Vote up" class="vote-icon">
                            </button>
                            <div class="vote-counts">${deal.green_vote_sum}</div>
                            <button class="vote-btn green-down" data-deal="${deal.id}" data-type="green" data-value="-1">
                                <img src="/statics/images/down.svg" alt="Vote down" class="vote-icon">
                            </button>
                        </div>
                    </div>
                    <div class="price-vote">
                        <div class="vote-controls">
                            <button class="vote-btn price-up" data-deal="${deal.id}" data-type="price" data-value="1">
                                <img src="/statics/images/up.svg" alt="Vote up" class="vote-icon">
                            </button>
                            <div class="vote-counts">${deal.price_vote_sum}</div>
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
                    <div class="owner"><p>${deal.owner_pseudo}</p></div>
                    <div class="location"><p>📍 ${deal.location}</p></div>
                    <div class="category"><p>${deal.categorie}</p></div>
                    ${deal.reparability ? `<p class="reparability">Indice de réparabilité: ${deal.reparability}/10</p>` : ''}
                    <div class="comment"><a href="#">💬commentaires<a></div>
                </div>
                ${deal.link ? `<a href="${deal.link}" target="_blank" class="deal-link">Voir l'offre</a>` : ''}
            </div>
        </div>
    `;

    setupVoteButtons();
}

document.addEventListener('DOMContentLoaded', () => {
    fetchDeals();
});




