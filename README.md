# Suivi de Portefeuille d'Investissement avec Google Sheets

## Introduction

Ce projet simplifie la gestion et le suivi de vos investissements en cryptomonnaies en centralisant les données essentielles dans une feuille **Google Sheets**. En utilisant l'API CoinMarketCap, vous pouvez automatiser la récupération d'informations clés telles que :

- Le prix actuel des cryptomonnaies.
- La capitalisation boursière.
- Le volume échangé sur 24 heures.
- La date de la dernière mise à jour.
- Les noms et symboles des cryptomonnaies.

Cette solution personnalisable vous permet de surveiller votre portefeuille d'investissement efficacement, en évitant les mises à jour manuelles répétitives.

---

## Fonctionnalités

### Principales Fonctions
1. **Connexion API CoinMarketCap :**
   - Extraction des données basées sur les identifiants uniques des cryptomonnaies (CMC IDs).
2. **Informations Disponibles :**
   - Prix actuel.
   - Capitalisation boursière.
   - Volume échangé sur 24 heures.
   - Dernière mise à jour.
   - Nom et symbole.
3. **Intégration Google Sheets :**
   - Lecture des IDs directement depuis des cellules.
   - Mise à jour automatique des données.
4. **Actualisation Automatique :**
   - Planifiez des mises à jour grâce aux déclencheurs de Google Apps Script.

---

## Prérequis

1. **Clé API CoinMarketCap :**
   - Créez un compte sur [CoinMarketCap Developer](https://coinmarketcap.com/api/) et générez une clé API.
   - Remplacez `"Ton API"` dans le script par votre clé API.

2. **Accès à Google Apps Script :**
   - Dans Google Sheets, allez dans **Extensions > Apps Script** pour ouvrir l'éditeur de script.

3. **Liste des CMC IDs :**
   - Les cryptomonnaies sont identifiées par des IDs uniques (exemple : Bitcoin = `1`, Ethereum = `1027`). Consultez la [documentation API](https://coinmarketcap.com/api/documentation/v1/) pour plus de détails.

---

## Installation

### Étape 1 : Ajouter le Script

1. Copiez le script dans l'éditeur **Apps Script** de Google Sheets.
2. Remplacez les plages de cellules par celles correspondant à votre configuration :
   - **Colonne contenant les IDs** (exemple : `A2:A`).
   - **Colonnes pour les données affichées** (exemple : `B2:B` pour les prix).

### Étape 2 : Fonctions Disponibles

Le script contient plusieurs fonctions pour extraire et afficher les données.

#### 1. **Récupération des Données Brutes**
- **`fetchCMCData(cmcIds)`**
  - Connecte l'API CoinMarketCap et récupère les données basées sur une liste d'IDs.
  - Filtre les IDs invalides et retourne un objet contenant les informations brutes.

#### 2. **Fonctions d'Extraction**
- **`getPrice(cmcIds)`** : Récupère le prix actuel (USD).
- **`getMarketCap(cmcIds)`** : Récupère la capitalisation boursière.
- **`getVolume24h(cmcIds)`** : Récupère le volume échangé sur 24 heures.
- **`getLastUpdated(cmcIds)`** : Récupère la dernière date de mise à jour.
- **`getName(cmcIds)`** : Récupère le nom de la cryptomonnaie.
- **`getSymb(cmcIds)`** : Récupère le symbole de la cryptomonnaie.

#### 3. **Intégration Google Sheets**
- **`getCMCIdsFromSheet(range)`** : Lit les IDs dans une plage de cellules et filtre les valeurs valides.
- **`getCMCPricesFromSheet(range)`** : Retourne les prix pour une liste d'IDs extraits des cellules.

---

## Automatisation

### Déclencheurs Automatiques

1. **Configurer un Déclencheur :**
   - Allez dans **Extensions > Apps Script > Déclencheurs**.
   - Ajoutez un déclencheur pour exécuter automatiquement la fonction `updatePrices` (ou similaire) à des intervalles définis.

2. **Ajout d’un Bouton dans Google Sheets :**
   - Insérez un dessin (par exemple, un bouton) dans Google Sheets.
   - Attribuez le script `updatePrices` pour effectuer une mise à jour manuelle rapide.

---

## Exemple d'Utilisation

### Configuration dans Google Sheets

- **Colonne A :** Liste des IDs (CMC IDs) des cryptos.
- **Colonnes B et suivantes :** Affichage des données (prix, market cap, etc.).

### Exemple de Test dans Apps Script

```javascript
function testCMCFunctions() {
  const testIds = [[1], [1027], [825], [29513]]; // Exemple: Bitcoin, Ethereum, Tether, Node AI
  
  const prices = getPrice(testIds);
  const marketCaps = getMarketCap(testIds);
  const volumes = getVolume24h(testIds);
  const lastUpdates = getLastUpdated(testIds);
  const names = getName(testIds);
  const symbols = getSymb(testIds);

  console.log("Prix:", prices);
  console.log("Market Caps:", marketCaps);
  console.log("Volumes 24h:", volumes);
  console.log("Dernières Mises à Jour:", lastUpdates);
```

![image](https://github.com/user-attachments/assets/91e7e095-6036-4e79-84a6-e5b8309e33ec)


