document.addEventListener('DOMContentLoaded', function () {
  // Récupérer le bouton de connexion
  const loginButton = document.getElementById('loginButton');

  // Ajouter un écouteur d'événement pour le clic sur le bouton
    if (!loginButton) {
        return;
    }
  loginButton.addEventListener('click', function (event) {
      event.preventDefault(); // Empêcher le comportement par défaut du formulaire


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
          credentials: 'include',
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

            localStorage.setItem('userData', JSON.stringify(data.user))
            console.log(data.user)
        window.location.href = 'mypage'
      })
      .catch(error => {
          console.error('Erreur:', error);
          alert('Identifiants incorrects ou problème de connexion.');
      });
  });
});


document.addEventListener('DOMContentLoaded', function () {
    const loginLink = document.querySelector('.login');
    const loginButton = loginLink.querySelector('button');
    const userData = JSON.parse(localStorage.getItem('userData'));

    if (userData) {
        // Vérifiez si le token est expiré
        fetch('/api/auth/protected', {
            method: 'GET',
            credentials: 'include'
        })
        .then(response => {
            if (!response.ok) {
                alert('votre session a expiré');
                throw new Error('Token expiré');

            }
            return response.json();
        })
        .then(data => {
            loginButton.textContent = userData.pseudo;
            loginLink.href = "#";

            loginButton.addEventListener('mouseover', function() {
                loginButton.textContent = 'Logout';
            });

            loginButton.addEventListener('mouseout', function() {
                loginButton.textContent = userData.pseudo;
            });

            loginButton.addEventListener('click', function() {
                if (loginButton.textContent === 'Logout') {
                    handleLogout();
                }
            });
        })
        .catch(error => {
            console.error('Erreur:', error);
            handleLogout();
        });
    }
});



function handleLogout() {

        fetch('/api/logout', { method: 'POST', credentials: 'include' })
            .then(() => {
                localStorage.removeItem('userData');
                window.location.href = 'home';
            })
            .catch(error => console.error('Erreur de déconnexion:', error));

}
