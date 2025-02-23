document.addEventListener('DOMContentLoaded', function () {
  // Récupérer le bouton de connexion
  const loginButton = document.getElementById('loginButton');

  // Ajouter un écouteur d'événement pour le clic sur le bouton
  loginButton.addEventListener('click', function (event) {
      event.preventDefault(); // Empêcher le comportement par défaut du formulaire

      // Récupérer les valeurs des champs
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      // Vérifier que les champs ne sont pas vides
      if (!email || !password) {
          alert('Veuillez remplir tous les champs.');
          return;
      }


      // Créer l'objet de données pour la connexion
      const loginData = {
          email: email,
          pass_word: password
      };

      // Envoyer la requête POST à l'API de connexion
      fetch('/api/auth/login', {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(loginData)
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Erreur de connexion');
          }
          return response.json();
      })
      .then(data => {
          // Stocker le token et les données de l'utilisateur dans le localStorage
          localStorage.setItem('token', data.access_token);

            return fetch('/api/auth/protected', {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${data.access_token}`
                }
            })
          // Rediriger vers la page utilisateur

      })
      .then(response => {
        if (! response.ok) throw new Error("accés reffusé !");
        return response.json()
      })
      .then(data => {
        localStorage.setItem('userData', JSON.stringify(data.user))
        window.location.href = 'mypage';
      })
      .catch(error => {
          console.error('Erreur:', error);
          alert('Identifiants incorrects ou problème de connexion.');
      });
  });
});
