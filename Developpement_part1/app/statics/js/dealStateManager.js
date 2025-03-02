// dealStateManager.js
export const dealStateManager = {
  // État actif : "initial", "search", "filter"
  activeState: "none",

  // Méthode pour changer l'état
  setActiveState(state) {
    this.activeState = state;
    // Déclencher un événement pour notifier les autres fichiers
    document.dispatchEvent(new CustomEvent('dealStateChanged', { detail: state }));
  },

  // Vérifier si un état est actif
  isStateActive(state) {
    return this.activeState === state;
  }
};
