import { dealService, userService, VoteService, CommentService } from './apiScripts.js';
// Import both setupVoteButtons AND handleVote function
import { setupVoteButtons, handleVote } from './deals.js';

const containerDeal = document.querySelector('.d_details');
const containerComment = document.querySelector('.deal_comments');

const deal_id = localStorage.getItem('dealID');

async function fetchDeal() {
  try {
    const userData = localStorage.getItem('userData');
    if (!userData) {
      window.location.href = '/login';
      return;
    }
    const deal = await dealService.getById(deal_id);
    if (deal) {
      console.log('deal:', deal);
      displayDeal(deal, containerDeal);
    } else {
      console.error('Deal not found');
      containerDeal.innerHTML = '<p>Deal not found</p>';
    }
  } catch (error) {
    console.error('Erreur lors de la récupération des deal:', error);
    containerDeal.innerHTML = '<p>Erreur lors du chargement des deal</p>';
  }
}


// Implement your own handleVote function specifically for the detail page
// if you can't import it properly from deals.js
export async function detailPageHandleVote(event) {
  // Find the closest button element since event.target might be the image
  const button = event.target.closest('.vote-btn');
  if (!button) return; // Exit if we didn't click on a vote button

  const currentDeal = button.closest('.deal_detail');
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

    console.log('Sending vote data:', voteData); // Log the data being sent

    const response = await VoteService.create(voteData);

    if (response.success) {
      const dealContainer = button.closest('.deal_detail');

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

// Create a specific setup function for the detail page votes
function setupDetailPageVoteButtons() {
  const voteButtons = document.querySelectorAll('.vote-btn');

  voteButtons.forEach(button => {
    // First remove any existing event listeners to prevent duplicates
    button.removeEventListener('click', detailPageHandleVote);
    // Add the event listener
    button.addEventListener('click', detailPageHandleVote);
  });

  console.log(`Set up ${voteButtons.length} vote buttons`);
}

export function displayDeal(deal, container) {
  container.innerHTML = `
    <div class="deal_detail" deal-details="${deal.id}">
      <div class="deal-image">
        <img class="article" src="${deal.image ? `data:image/jpeg;base64,${deal.image}` : 'https://via.placeholder.com/150'}" alt="${deal.title}">
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
        <div class="user"><img src="/statics/images/user.png" alt="user icon" class="user-icon"><p>  ${deal.owner_pseudo}</p></div>
          <div class="reated_at">
          <div class="comment"><button type="submit">${deal.comments_number}<img src="/statics/images/chat.png" alt="comments" class="comments-icon"></button></div>
          <button id="shareButton" class="share-btn"><img src="/statics/images/partage.png" alt="Partager" class="share-icon">partager</button>
          <h3>${deal.created_ago}</h3>
          </div>
        </div>
          <div class="title_price">
          <div class="title"><h3>${deal.title}</h3></div>
          <div class="price"><p>${deal.reduction}€</p></div>
          </div>
        <div class="deal_footer">
          <div class="location"><p>📍 ${deal.location}</p></div>
          <div class="category"><p>${deal.categorie}</p></div>
          ${deal.reparability ? `<p class="reparability"><img src="/statics/images/idr.png" alt="reparability" class="reparability-icon"> ${deal.reparability}/10</p>` : ''}
          ${deal.link ? `<a href="${deal.link}" target="_blank" class="deal-link">Voir l'offre</a>` : ''}
        </div>

      </div>
    </div>
    <div class="description">

      <p>Description</p>
      <div class="description_details">${deal.description}</div>
    </div>
      <div class="comments-section">
        <h3>Commentaires</h3>

        <div class="comments-list">
          ${deal.comments.length > 0 ? deal.comments.map(comment => `
            <div class="comment-item">
              <div class="comment-user">
              <p><strong>Utilisateur ${comment.pseudo} :</strong></p>
              </div>
              <div class="comment-text">
              <p>${comment.comment}</p>
              </div>
              <div class="comment-date">
              <small> ${comment.created_ago}</small>
            </div>
            </div>
          `).join('') : '<p>Aucun commentaire pour ce deal.</p>'}
        </div>
      </div>

  `;

  // Use our detail-page specific setup function
  setupDetailPageVoteButtons();
}

async function addComment() {
  const add_comment_btn = document.querySelector('.submit_comment');

  if (!add_comment_btn) {
    console.error('Le bouton "submit_comment" n\'a pas été trouvé.');
    return;
  }

  add_comment_btn.addEventListener('click', async (event) => {
    event.preventDefault();

    const userdata = localStorage.getItem('userData');
    const deal_id = localStorage.getItem('dealID');
    const comment = document.getElementById('comment').value;

    if (!userdata || !deal_id || !comment) {
      alert('Veuillez remplir tous les champs et vous connecter.');
      return;
    }

    const userId = JSON.parse(userdata).user_id;

    const data = {
      user_id: userId,
      deal_id: deal_id,
      comment: comment
    };

    try {
      await CommentService.create(data);
      alert('Commentaire ajouté avec succès');
      // Reload the deal to show the new comment
      fetchDeal();
      // Clear the comment field
      document.getElementById('comment').value = '';
    } catch (error) {
      alert('Erreur lors de l\'ajout du commentaire : ' + error.message);
    }
  });
}

document.addEventListener('DOMContentLoaded', () => {

  fetchDeal();
  addComment();
});
