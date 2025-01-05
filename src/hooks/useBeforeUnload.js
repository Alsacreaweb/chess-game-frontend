import { useEffect } from "react";

export const useBeforeUnload = (message) => {
  const handleBeforeUnload = (event) => {
    // Le message peut ne pas être affiché sur tous les navigateurs, mais l'alerte s'affichera quand même
    event.returnValue = message; // Nécessaire pour que l'événement se déclenche sur certains navigateurs
    return message; // Pour d'autres navigateurs comme Firefox
  };

  // Utilisation de useEffect pour attacher l'écouteur d'événements
  useEffect(() => {
    // Ajouter l'écouteur d'événements
    window.addEventListener("beforeunload", handleBeforeUnload);

    // Nettoyer l'écouteur lors du démontage du composant
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [message]); // Le message peut changer, donc on l'ajoute à la dépendance
};
