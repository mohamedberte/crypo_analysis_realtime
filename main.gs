// Clé API CoinMarketCap
const CMC_API_KEY = "Ton API";

/**
 * Récupère les données brutes depuis l'API CoinMarketCap pour une liste d'IDs.
 * @param {Array<number>} cmcIds - Liste des IDs CoinMarketCap.
 * @return {Object} Données brutes retournées par l'API.
 */
function fetchCMCData(cmcIds) {
  if (!Array.isArray(cmcIds) || cmcIds.length === 0) {
    throw new Error("La liste des IDs est vide ou invalide.");
  }

  // Filtrer les IDs pour ne garder que ceux qui sont des nombres valides
  cmcIds = cmcIds.filter(id => !isNaN(id) && id > 0); // Garder que les IDs valides

  if (cmcIds.length === 0) {
    throw new Error("Aucun ID valide trouvé.");
  }

  const url = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest";
  const options = {
    method: "GET",
    headers: {
      "Accepts": "application/json",
      "X-CMC_PRO_API_KEY": CMC_API_KEY,
    },
    muteHttpExceptions: true,
  };

  const params = `?id=${cmcIds.join(",")}`;
  const response = UrlFetchApp.fetch(url + params, options);

  if (response.getResponseCode() !== 200) {
    throw new Error(`Erreur API: ${response.getResponseCode()} - ${response.getContentText()}`);
  }

  const data = JSON.parse(response.getContentText());
  return data.data; // Retourne uniquement la section "data"
}

/**
 * Récupère le prix actuel pour une liste d'IDs.
 * @param {Array<number>} cmcIds - Liste des IDs CoinMarketCap.
 * @return {Array} Liste des prix en USD pour chaque ID.
 */
function getPrice(cmcIds) {
  const data = fetchCMCData(cmcIds);
  return cmcIds.map(id => {
    const coinData = data[id];
    return coinData ? parseFloat(coinData.quote.USD.price.toFixed(4)) : null;
  });
}

/**
 * Récupère la capitalisation boursière actuelle pour une liste d'IDs.
 * @param {Array<number>} cmcIds - Liste des IDs CoinMarketCap.
 * @return {Array} Liste des market caps en USD pour chaque ID.
 */
function getMarketCap(cmcIds) {
  const data = fetchCMCData(cmcIds);
  return cmcIds.map(id => {
    const coinData = data[id];
    return coinData ? parseFloat(coinData.quote.USD.market_cap) : null;
  });
}

/**
 * Récupère le volume sur 24h pour une liste d'IDs.
 * @param {Array<number>} cmcIds - Liste des IDs CoinMarketCap.
 * @return {Array} Liste des volumes 24h en USD pour chaque ID.
 */
function getVolume24h(cmcIds) {
  const data = fetchCMCData(cmcIds);
  return cmcIds.map(id => {
    const coinData = data[id];
    return coinData ? parseFloat(coinData.quote.USD.volume_24h) : null;
  });
}

/**
 * Récupère la dernière mise à jour pour une liste d'IDs.
 * @param {Array<number>} cmcIds - Liste des IDs CoinMarketCap.
 * @return {Array} Liste des dates de dernière mise à jour pour chaque ID.
 */
function getLastUpdated(cmcIds) {
  const data = fetchCMCData(cmcIds);
  return cmcIds.map(id => {
    const coinData = data[id];
    return coinData ? coinData.last_updated : null;
  });
}

/**
 * Récupère le nom pour une liste d'IDs.
 * @param {Array<number>} cmcIds - Liste des IDs CoinMarketCap.
 * @return {Array} Liste des noms pour chaque ID.
 */
function getName(cmcIds) {
  const data = fetchCMCData(cmcIds);
  return cmcIds.map(id => {
    const coinData = data[id];
    return coinData ? coinData.name : null;
  });
}

/**
 * Récupère le symbole pour une liste d'IDs.
 * @param {Array<number>} cmcIds - Liste des IDs CoinMarketCap.
 * @return {Array} Liste des symboles pour chaque ID.
 */
function getSymb(cmcIds) {
  const data = fetchCMCData(cmcIds);
  return cmcIds.map(id => {
    const coinData = data[id];
    return coinData ? coinData.symbol : null;
  });
}

/**
 * Fonction d'extraction de la plage d'IDs depuis la feuille Google Sheets.
 * @param {Range} range - Plage de cellules contenant les IDs.
 * @return {Array<number>} Liste des IDs extraits.
 */
function getCMCIdsFromSheet(range) {
  const values = range.getValues();
  // Filtrer pour ne garder que les valeurs valides (nombres positifs)
  return values.flat().filter(id => !isNaN(id) && id > 0);
}

/**
 * Fonction principale pour récupérer les prix des cryptos depuis la feuille Google Sheets.
 * @param {Range} range - Plage de cellules contenant les IDs des cryptos.
 * @return {Array} Liste des prix pour les cryptos.
 */
function getCMCPricesFromSheet(range) {
  const cmcIds = getCMCIdsFromSheet(range); // Extraire les IDs de la plage
  if (cmcIds.length === 0) {
    throw new Error("Aucun ID valide trouvé dans la plage.");
  }
  return getPrice(cmcIds); // Récupérer les prix pour ces IDs
}

/**
 * Exemple de test pour chaque fonction.
 */
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
}
