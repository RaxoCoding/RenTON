# Utiliser l'image Node.js basée sur Alpine
FROM node:18-alpine

# Installer bash sur cette image
RUN apk add --no-cache bash

# Créer et définir le répertoire de travail à /app
WORKDIR /app

# Copier tous les fichiers du projet dans le conteneur
COPY . .

# Installer les dépendances du projet
RUN yarn install

# Exposer le port 3000
EXPOSE 3000

# Commande par défaut pour démarrer l'application Next.js
CMD ["yarn", "dev"]
