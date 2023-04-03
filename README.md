# Quizzly-Vue

## Installation
Node.js 16.9.0 ou une version plus récente est requise.

Installation des dépendances :
```shell
npm install
```

## Utilisation
Lancement du serveur de développement :
```shell
npm run serve
```

Compilation et minification du code pour la production :
```shell
npm run build
```

Lancement du serveur en production :
```shell
serve -s dist
```

## Structure du dossier
- `public`: contient les fichiers statiques
- `src`: contient le code source de l'application. 
  - `assets`: contient les images, les polices et les styles CSS.
  - `components`: contient les composants Vue réutilisables.
  - `methods`: contient les méthodes réutilisables
  - `functions`: contient les fonctions réutilisables utilisées dans l'application
  - `store`: contient le store VueX
  - `views`: contient les vues principales de l'application.
  - `router.js`: contient la configuration du router Vue.
  - `main.js`: point d'entrée de l'application.

## Configuration

Le fichier `.env` contient les variables d'environnement nécessaires pour l'application. Vous pouvez créer un fichier .env.local pour les personnaliser localement.

Les variables d'environnement disponibles sont :
- `VUE_APP_API_URL`: l'URL de l'API back-end.
- `VUE_APP_SOCKET_ENDPOINT`: l'URL du serveur WebSocket utilisé.