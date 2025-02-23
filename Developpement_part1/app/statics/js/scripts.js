export const postRequest = async (endpoint, body) => {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

  const data = await response.json();
  if (!response.ok) {
    let message = data?.message || data;
    return { error: true, message };
  }
  return data;
};

export const getRequest = async (endpoint) => {

    const response = await fetch(endpoint)
    const data = await response.json();
    if (!response.ok) {
      let message = data?.message || data;
      return {error: true, message};
    }
    return data;
    };


export const updateRequest = async (endpoint, body) => {
  try {
    const response = await fetch(endpoint, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    return await response.json();  // Attente du JSON de la réponse
  } catch (error) {
    console.error("Erreur dans la requête PUT:", error);
    throw error;  // Si erreur, on la relance
  }
};

export const deleteRequest = async (endpoint) => {
  try {
    const response = await fetch(endpoint, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return await response.json();  // Attente du JSON de la réponse
  } catch (error) {
    console.error("Erreur dans la requête DELETE:", error);
    throw error;  // Si erreur, on la relance
  }
};
