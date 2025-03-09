import { dealService, userService, VoteService, CommentService } from './apiScripts.js';
import { setupVoteButtons } from './deals.js';

const containerDeal = document.querySelector('.d_details');
const containerComment = document.querySelector('.deal_comments');


const deal_id = localStorage.getItem('dealID');

async function fetchDeal() {
  try {
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



export function displayDeal(deal, container) {
  container.innerHTML = `
    <div class="deal_detail" deal-details="${deal.id}">
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
        <div class="owner"><p>${deal.owner_pseudo}</p></div>
          <div class="reated_at">
          <div class="comment"><button type="submit">${deal.comments_number}<img src="/statics/images/chat.png" alt="comments" class="comments-icon"></button></div>
          <button id="shareButton" class="share-btn"><img src="/statics/images/partage.png" alt="Partager" class="share-icon">partager</button>
          <h3>${deal.created_ago}</h3>
          </div>
        </div>
          <div class="titile_price">
          <div class="title"><h3>${deal.title}</h3></div>
          <div class="price"><p>${deal.price}€</p></div>
          </div>
        <div class="deal_footer">
          <div class="location"><p>📍 ${deal.location}</p></div>
          <div class="category"><p>${deal.categorie}</p></div>
          ${deal.reparability ? `<p class="reparability">Indice de réparabilité: ${deal.reparability}/10</p>` : ''}
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

  setupVoteButtons();
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

    } catch (error) {
      alert('Erreur lors de l\'ajout du commentaire : ' + error.message);
    }
  });
}



document.addEventListener('DOMContentLoaded', () => {
  fetchDeal();

  addComment();

});
