// Work in Progress pour eviter d'afficher le conteneur de deals.js apres les filtres à faire si tu relis le code 
export const dealStateManager = {

  activeState: "none",


  setActiveState(state) {
    this.activeState = state;

    document.dispatchEvent(new CustomEvent('dealStateChanged', { detail: state }));
  },


  isStateActive(state) {
    return this.activeState === state;
  }
};
