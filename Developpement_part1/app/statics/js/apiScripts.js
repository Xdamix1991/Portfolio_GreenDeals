const API_BASE_URL = 'http://127.0.0.1:5001/api';

// Fonction générique pour les requêtes fetch
async function fetchData(endpoint, method = 'GET', data = null, options = {}) {
  const url = `${API_BASE_URL}/${endpoint}`;

  const fetchOptions = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}) // Garde les headers personnalisés
    },
    credentials: 'include',
    ...options, // Ajoute les autres options
  };

  if (data && (method === 'POST' || method === 'PUT' || method === 'PATCH')) {
    fetchOptions.body = JSON.stringify(data);
  }

  try {
    console.log("Envoi de la requête avec cookies activés :", fetchOptions);
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      throw new Error(`Erreur HTTP: ${response.status}`);
    }

    return await response.json();

  } catch (error) {
    console.error(`Erreur lors de la requête à ${endpoint}:`, error);
    throw error;
  }
}

// Fonction générique pour créer des services API par modèle
function createModelService(modelName) {
  return {
    getAll: () => fetchData(`${modelName}`),
    getById: (id) => fetchData(`${modelName}/${id}`),
    getByAttribute: (attribute, value) => fetchData(`${modelName}?${attribute}=${encodeURIComponent(value)}`),
    getByFilters: (filters) => {
      const queryParams = Object.entries(filters)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      return fetchData(`${modelName}?${queryParams}`);
    },
    create: (data) => fetchData(`${modelName}`, 'POST', data),
    update: (id, data) => fetchData(`${modelName}/${id}`, 'PUT', data),
    delete: (id) => fetchData(`${modelName}/${id}`, 'DELETE')
  };
}


export const dealService = createModelService('deals');
export const userService = createModelService('users');
export const VoteService = createModelService('votes');
export const CommentService = createModelService('comments')
