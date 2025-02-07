# Installation du projet
1. Téléchargez ou clonez le dépôt
2. Depuis un terminal ouert dans le dossier du projet, lancer la commande : `sudo docker-compose up --build`
3. Ouvrez le site depuis la page http://localhost:8080 

Nb : à l'étape 2, ne pas ajouter le `sudo` si vous êtes sous Windows (sauf dernière version de Windows 11) (PowerShell ou Shell) : sudo n'existant pas et Docker Desktop configurant automatiquement Docker pour ne pas avoir besoin des droits administrateur.

# README - Tests d'Automatisation avec Cypress

## Introduction

Ce projet met en place des tests automatisés pour assurer la qualité des fonctionnalités de l'application. Nous utilisons **Cypress** pour automatiser les tests des API et des interfaces utilisateur.

---

## Installation du projet

### 1. Cloner le dépôt

Clonez le dépôt à l'aide de la commande suivante :

```git clone <URL_DU_REPO> cd <NOM_DU_REPO> ```

### 2. Lancer Docker

Pour démarrer l'environnement local avec Docker :
Depuis un terminal ouvert à la racine du projet, lancer la commande

```docker compose up ```

Pour arrêter proprement les services Docker après utilisation, exécutez la commande suivante :

```docker compose down```

**Remarque :** Sous Windows (sauf Windows 11 dernière version), ne pas utiliser `sudo`.

### 3. Accéder au site

Ouvrez le navigateur et accédez à l'application :

- **Site Web** : [http://localhost:8080](http://localhost:8080)
- **Documentation API** : [http://localhost:8081/api/doc](http://localhost:8081/api/doc)

---

## Exécution des tests Cypress

### 1. Installation des dépendances

Si ce n'est pas encore fait, installez les dépendances avec la commande suivante :

```npm install```

### 2. Lancer les tests en mode interface graphique

Pour exécuter les tests dans une interface graphique :

```npx cypress open```

Sélectionnez un navigateur et exécutez les tests.

### 3. Lancer les tests en mode headless

Pour exécuter les tests sans interface graphique (mode headless) :

```npx cypress run```

---

## Génération du rapport de test

### 1. Exécuter les tests avec Mochawesome

Pour générer un rapport de test détaillé, exécutez les tests avec l'option reporter :

```npx cypress run --reporter mochawesome```


### 2. Consulter le rapport généré

Les rapports seront générés dans le dossier `cypress/reports`. Ouvrez le fichier `merged-report.html` pour afficher les résultats sous forme graphique.

---

## Types de tests

Les tests automatisés incluent principalement :

- **Tests API** : Vérification de la connexion, de la gestion du panier, etc.
- **SmokeTests** : Vérification de la présence des champs et boutons.
- **Tests Front-End** : Vérification de la connexion utilisateur, gestion du panier, etc.

Les tests de base (smoke tests) et les tests API ont déjà été réalisés manuellement avant l'automatisation.

---

## Remarques supplémentaires

- Assurez-vous que Docker est correctement configuré et que l'application fonctionne localement avant d'exécuter les tests.
- Pour toute modification ou ajout de tests, veillez à mettre à jour le rapport et vérifier que les tests passent correctement.

---

Bonne exécution des tests ! 🚀
