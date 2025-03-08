const postRequest = async (endpoint, body) => {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();  // Attente du JSON de la réponse
  } catch (error) {
    console.error("Erreur dans la requête POST:", error);
    throw error;  // Si erreur, on la relance
  }
};


document.addEventListener('DOMContentLoaded', function() {
  const registerButton = document.getElementById('soumettre');

  // Vérification si le bouton est trouvé
  if (!registerButton) {
    console.error('Le bouton d\'inscription n\'a pas été trouvé');
    return;
  }

  registerButton.addEventListener('click', async function(event) {
    event.preventDefault();

    console.log("Le bouton a été cliqué");

    // Récupération des éléments du formulaire
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const pseudo = document.getElementById('pseudo').value;

    // Validation des champs
    if (!email || !password || !lastName || !firstName) {
      alert('Veuillez remplir tous les champs');
      return;
    }

    // Construction de l'objet de données
    const registerData = {
      first_name: firstName,
      last_name: lastName,
      email: email,
      pass_word: password,
      pseudo: pseudo
    };

    try {
      // Envoi de la requête
      const response = await postRequest('/api/users', registerData);

      if (response.error) {
        alert('Erreur lors de l\'inscription : ' + response.message);
        return;
      }

      // Succès de l'inscription
      alert('Inscription réussie !');
      window.location.href = "/login";

    } catch (error) {
      console.error("Erreur dans la requête", error);
      alert('Une erreur est survenue lors de l\'inscription');
    }
  });
});
