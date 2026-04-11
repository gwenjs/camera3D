---
layout: home

hero:
  name: "@gwenjs/camera3d"
  text: "Caméra 3D pour GWEN"
  tagline: Orbite, première personne, troisième personne, look-at, animations de chemin et screen shake — dans un seul composable.
  actions:
    - theme: brand
      text: Démarrer
      link: /fr/guide/getting-started
    - theme: alt
      text: Référence API
      link: /fr/api/

features:
  - title: use3DCamera()
    details: Un composable crée l'entité caméra, l'enregistre et nettoie automatiquement quand le contexte est détruit.
  - title: Orbite & Look-At
    details: Caméras de présentation en rotation automatique, look-at statique et suivi en troisième personne — tout déclaratif, sans calcul manuel.
  - title: Première & Troisième Personne
    details: Attachez la caméra à n'importe quelle entité avec un décalage de position des yeux, ou suivez depuis derrière avec un offset 3D configurable.
  - title: Chemins de caméra
    details: Jouez une séquence de points de passage avec FOV et look-at par étape.
  - title: Screen Shake
    details: Ajoutez du shake basé sur un trauma avec décroissance et angle maximum configurables, cumulable sur plusieurs appels.
  - title: Perspective & Orthographique
    details: Changez le type de projection, le FOV, le zoom et les plans near/far à tout moment via le Camera3DHandle.
---
