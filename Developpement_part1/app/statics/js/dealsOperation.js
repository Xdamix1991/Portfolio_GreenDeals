import { dealService } from './apiScripts.js';

document.addEventListener('DOMContentLoaded', function(event) {
  const dealsButton = document.getElementById('dealsButton');
  const dealOptions = document.getElementById('dealOptions');
  const addDealButton = document.getElementById('addDealButton');
  const myDealsButton = document.getElementById('myDealsButton');
  const dealForm = document.getElementById('deal_form');
  const myDealsContainer = document.getElementById('my_deals');
  const updateForm = document.getElementById('update_form');


  dealsButton.addEventListener('click', function() {
    if (window.getComputedStyle(dealOptions).display === 'none') {
      dealOptions.style.display = 'block';
    } else {
      dealOptions.style.display = 'none';
    }
  });

  addDealButton.addEventListener('click', function() {
    if (updateForm) {
      updateForm.style.display = 'none';
    }
    dealForm.style.display = 'block';
    myDealsContainer.style.display = 'none';
  });

  myDealsButton.addEventListener('click', async function() {
    dealForm.style.display = 'none';
    if (updateForm) {
      updateForm.style.display = 'none';
    }
    myDealsContainer.style.display = 'block';
    await fetchUserDeals(); // Appel de fetchUserDeals before
  });

  if (dealForm) {
    dealForm.addEventListener('submit', async function(event) {
      event.preventDefault();

      // Récupérer l'image du formulaire
      const fileInput = document.getElementById('image');
      const file = fileInput.files[0];

      // Si une image est sélectionnée
      if (file) {
        // Créer un objet FileReader pour lire l'image
        const reader = new FileReader();

        reader.onloadend = async function () {
          // L'image est maintenant en base64
          const base64Image = reader.result.split(',')[1]; // Supprimer la partie "data:image/png;base64,"

          // Créer un objet deal_data avec les autres informations
          const deal_data = {
            title: document.getElementById('title').value,
            image: base64Image,  // Image encodée en base64
            link: document.getElementById('lien').value,
            description: document.getElementById('description').value,
            price: document.getElementById('price').value,
            categorie: document.getElementById('categorie').value,
            location: document.getElementById('location').value,
            reparability: document.getElementById('reparability').value,
          };

          try {
            // Envoyer les données au service backend
            const result = await dealService.create(deal_data, {
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
            });

            alert('Votre Deal a été posté avec succès');
            dealForm.reset();
          } catch (error) {
            alert('Erreur lors de la création du deal: ' + error.message);
          }
        };

        // Lire le fichier comme une URL Data (Base64)
        reader.readAsDataURL(file);
      } else {
        // Si aucune image n'est sélectionnée, envoyer les données sans image
        const deal_data = {
          title: document.getElementById('title').value,
          image: null,
          link: document.getElementById('lien').value,
          description: document.getElementById('description').value,
          price: document.getElementById('price').value,
          categorie: document.getElementById('categorie').value,
          location: document.getElementById('location').value,
          reparability: document.getElementById('reparability').value,
        };

      try {
        const result = await dealService.create(deal_data, {
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        alert('Votre Deal a été posté avec succès');
        dealForm.reset();
      } catch (error) {
        alert('Erreur lors de la création du deal: ' + error.message);
      }
      }
    });
  }

  const userString = localStorage.getItem('userData');
  let userId = null;

  if (userString) {
    const user = JSON.parse(userString);
    userId = user.user_id;
  }


  async function fetchUserDeals() {
    if (!userId) {
      alert("Utilisateur non connecté.");
      return;
    }

    const myDeals = await dealService.getByAttribute('user_id', userId);
    const resultContainer = document.getElementById("my_deals");

    if (Array.isArray(myDeals)) {
      resultContainer.innerHTML = myDeals.map(deal => `
        <div class="user_deal">
          <h2>Votre deal: ${deal.title}</h2>
          <p>Prix: ${deal.price} $</p>
          <p>Lien: ${deal.link}</p>
          <p>IDR: ${deal.reparability}</p>
          <button class="delete-button" data-id="${deal.id}">Supprimer</button>
          <button class="update-button" data-id="${deal.id}">Modifier</button>
        </div>
      `).join('');
    } else {
      resultContainer.innerHTML = `<h2>Aucun deal trouvé.</h2>`;
    }
    attachButtonEvents();
  }

  function attachButtonEvents() {
    document.querySelectorAll(".delete-button").forEach(button => {
      button.addEventListener("click", async (event) => {
        const dealId = event.target.getAttribute("data-id");
        if (confirm("Voulez-vous vraiment supprimer ce deal ?")) {
          try {
            await dealService.delete(dealId);
            alert("Deal supprimé avec succès !");
            fetchUserDeals();
          } catch (error) {
            alert("Erreur lors de la suppression du deal : " + error.message);
          }
        }
      });
    });

    document.querySelectorAll(".update-button").forEach(button => {
      button.addEventListener("click", async (event) => {
        const dealId = event.target.getAttribute("data-id");
        try {
          const deal = await dealService.getById(dealId);
          document.getElementById('update_title').value = deal.title;
          document.getElementById('update_lien').value = deal.link;
          document.getElementById('update_description').value = deal.description;
          document.getElementById('update_price').value = deal.price;
          document.getElementById('update_categorie').value = deal.categorie;
          document.getElementById('update_location').value = deal.location;
          document.getElementById('update_reparability').value = deal.reparability;
          updateForm.style.display = 'block';
          myDealsContainer.style.display = 'none';
          updateForm.setAttribute('data-id', deal.id);
        } catch (error) {
          alert("Erreur lors de la récupération du deal : " + error.message);
        }
      });
    });

    updateForm.addEventListener('submit', async function(event) {
      event.preventDefault();
      const dealId = updateForm.getAttribute('data-id');
      const update_deal_data = {
        title: document.getElementById('update_title').value,
        link: document.getElementById('update_lien').value,
        description: document.getElementById('update_description').value,
        price: document.getElementById('update_price').value,
        categorie: document.getElementById('update_categorie').value,
        location: document.getElementById('update_location').value,
        reparability: document.getElementById('update_reparability').value,
      };

      try {
        await dealService.update(dealId, update_deal_data);
        alert('Votre deal a été mis à jour avec succès');
        updateForm.reset();
        updateForm.style.display = 'none';
        await fetchUserDeals();
        myDealsContainer.style.display = 'block';
      } catch (error) {
        alert('Erreur lors de la mise à jour du deal: ' + error.message);
      }
    });
  }
});

