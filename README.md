# Taskwave

Une plateforme moderne de gestion de tâches et de projets en équipe, permettant une collaboration en temps réel avec des fonctionnalités avancées de notification et de communication.

## 🎯 À propos du projet

Taskwave est une application web complète conçue pour faciliter la gestion collaborative de projets et de tâches. Elle offre une expérience utilisateur fluide avec une architecture moderne basée sur une API REST et une interface réactive.

### Fonctionnalités principales

- ✅ **Gestion de tâches** - Créer, assigner et suivre les tâches des projets
- 👥 **Gestion d'équipe** - Organiser les utilisateurs par équipes et départements
- 📊 **Projets** - Créer et gérer des projets avec les membres de l'équipe
- 🔔 **Notifications en temps réel** - Notifications instantanées via WebSocket
- 💬 **Messagerie** - Communication directe entre les utilisateurs
- 📝 **Commentaires** - Commenter les tâches et collaborer en ligne
- 🛡️ **Authentification sécurisée** - Authentification API avec Sanctum
- 👤 **Gestion des permissions** - Contrôle d'accès granulaire avec rôles et permissions

## 🏗️ Architecture

### Backend
- **Framework** : Laravel 7
- **Base de données** : MySQL/PostgreSQL (via Eloquent ORM)
- **Authentification** : Laravel Sanctum
- **Temps réel** : Pusher (WebSocket)
- **Stockage** : MinIO S3
- **Tests** : PHPUnit

### Frontend
- **Framework** : React (Vite)
- **UI Libraries** : Chakra UI, Mantine, Material-UI
- **Styling** : Tailwind CSS, Bootstrap
- **HTTP Client** : Axios
- **Table Management** : TanStack React Table
- **Drag & Drop** : @hello-pangea/dnd
- **Date Picker** : Dayjs, Mantine Dates

## 📋 Prérequis

### Backend
- PHP >= 7.2.5
- Composer
- Node.js & npm
- MySQL/PostgreSQL
- Redis (optionnel, pour cache/sessions)

### Frontend
- Node.js >= 14
- npm ou yarn

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd Taskwave
```

### 2. Configuration du Backend

```bash
cd backend

# Installer les dépendances PHP
composer install

# Copier le fichier d'environnement
cp .env.example .env

# Générer la clé d'application
php artisan key:generate

# Configurer la base de données dans .env
# DB_CONNECTION=mysql
# DB_HOST=127.0.0.1
# DB_PORT=3306
# DB_DATABASE=taskwave
# DB_USERNAME=root
# DB_PASSWORD=

# Exécuter les migrations
php artisan migrate

# (Optionnel) Remplir la base de données avec des données de test
php artisan db:seed

# Installer les dépendances npm
npm install
```

### 3. Configuration du Frontend

```bash
cd ../frontend

# Installer les dépendances
npm install
```

## 🎮 Utilisation

### Démarrer le serveur de développement Backend

```bash
cd backend

# Serveur Laravel
php artisan serve

# Compilation des assets (dans une autre console)
npm run dev

# (Optionnel) Pour le hot reload
npm run hot
```

Par défaut, le serveur écoute sur `http://localhost:8000`

### Démarrer le serveur de développement Frontend

```bash
cd frontend

npm run dev
```

Par défaut, le frontend écoute sur `http://localhost:5000`

### Production

**Backend :**
```bash
cd backend
npm run production
php artisan config:cache
php artisan route:cache
```

**Frontend :**
```bash
cd frontend
npm run build
```

## 📁 Structure du projet

```
Taskwave/
├── backend/                 # API Laravel
│   ├── app/                # Modèles et logique métier
│   │   ├── Http/          # Controllers et Middleware
│   │   ├── Events/        # Événements (WebSocket)
│   │   └── Console/       # Commandes personnalisées
│   ├── config/            # Configuration
│   ├── database/          # Migrations et Seeds
│   ├── routes/            # Définition des routes API
│   ├── tests/             # Tests unitaires et fonctionnels
│   └── storage/           # Fichiers et logs
│
└── frontend/               # Interface React
    ├── src/
    │   ├── components/    # Composants réutilisables
    │   ├── pages/         # Pages de l'application
    │   ├── context/       # Contexte global (état)
    │   ├── api/           # Calls API
    │   ├── assets/        # Images, icônes
    │   └── routes.jsx     # Routage
    ├── public/            # Assets statiques
    └── index.html         # Point d'entrée HTML
```

## 🔧 Configuration importante

### Variables d'environnement Backend (.env)

```env
APP_NAME=Taskwave
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=taskwave
DB_USERNAME=root
DB_PASSWORD=

BROADCAST_DRIVER=pusher
QUEUE_CONNECTION=database

PUSHER_APP_ID=your_app_id
PUSHER_APP_KEY=your_app_key
PUSHER_APP_SECRET=your_app_secret
PUSHER_APP_CLUSTER=mt1

AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=
```

## 🔒 Authentification

L'API utilise **Laravel Sanctum** pour l'authentification par token. 

### Exemple d'utilisation :

```javascript
// Frontend - Axios config
const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## 📡 Communication temps réel

L'application utilise **Pusher** pour les notifications et mises à jour en temps réel.

### Configuration Pusher :
Assurez-vous que les variables d'environnement Pusher sont configurées dans `.env` du backend.

## 🧪 Tests

### Backend (PHPUnit)

```bash
cd backend
php artisan test
```

### Frontend (Jest - si configuré)

```bash
cd frontend
npm run test
```

## 📦 Déploiement

### Backend (Serveur)
1. Cloner le projet sur le serveur
2. Exécuter `composer install --optimize-autoloader --no-dev`
3. Configurer `.env` avec les données de production
4. Exécuter `php artisan migrate --force`
5. Configurer un reverse proxy (Nginx/Apache)

### Frontend (CDN/Serveur)
1. Exécuter `npm run build`
2. Uploader le dossier `dist/` sur le serveur
3. Configurer la base URL de l'API dans les variables d'environnement

## 🐛 Dépannage

### Le frontend ne se connecte pas à l'API
- Vérifier que le backend est en cours d'exécution sur `localhost:8000`
- Vérifier la configuration CORS dans `config/cors.php`
- Vérifier les en-têtes Authorization

### Les notifications en temps réel ne fonctionnent pas
- Vérifier les identifiants Pusher dans `.env`
- Vérifier que `BROADCAST_DRIVER=pusher` est défini
- Consulter les logs Pusher

### Erreurs de migration base de données
- Vérifier les identifiants de base de données dans `.env`
- Assurez-vous que la base de données existe
- Exécuter `php artisan migrate:refresh` (en développement uniquement)

## 📚 Ressources utiles

- [Documentation Laravel](https://laravel.com/docs)
- [Documentation React](https://react.dev)
- [Chakra UI](https://chakra-ui.com)
- [Mantine](https://mantine.dev)
- [Pusher](https://pusher.com)

## 👨‍💼 Équipe

Ce projet a été développé comme PFE 2025.

## 📄 Licence

Ce projet est sous licence MIT.

## 📞 Support

Pour toute question ou problème, veuillez créer une issue sur le repository.

---

**Dernière mise à jour** : Août 2026
