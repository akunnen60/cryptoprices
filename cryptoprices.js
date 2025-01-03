const cryptos = [
    { symbol: "BTC", id: "bitcoin", fallbackId: "BTC" },
    { symbol: "ETH", id: "ethereum", fallbackId: "ETH" },
    { symbol: "XRP", id: "ripple", fallbackId: "XRP" },
    { symbol: "SOL", id: "solana", fallbackId: "SOL" },
    { symbol: "ADA", id: "cardano", fallbackId: "ADA" },
    { symbol: "BNB", id: "binancecoin", fallbackId: "BNB" }, // BNB
    { symbol: "TRX", id: "tron", fallbackId: "TRX" }, // TRON
    { symbol: "AVAX", id: "avalanche-2", fallbackId: "AVAX" }, // Avalanche
    { symbol: "DOGE", id: "dogecoin", fallbackId: "DOGE" }, // Dogecoin
    { symbol: "LINK", id: "chainlink", fallbackId: "LINK" }, // Chainlink
    { symbol: "SUI", id: "sui", fallbackId: "SUI" }, // Ajout de SUI
    { symbol: "SHIB", id: "shiba-inu", fallbackId: "SHIB" }, // Ajout de Shiba Inu
    { symbol: "XLM", id: "stellar", fallbackId: "XLM" } // Ajout de Stellar (XLM)
];

// Fonction pour récupérer les prix via CoinGecko
async function fetchPricesFromCoinGecko() {
    const ids = cryptos.map(crypto => crypto.id).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
    const response = await fetch(url);
    return await response.json();
}

// Fonction pour récupérer les prix via CryptoCompare
async function fetchPricesFromCryptoCompare() {
    const symbols = cryptos.map(crypto => crypto.fallbackId).join(",");
    const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`;
    const response = await fetch(url);
    return await response.json();
}

// Fonction principale pour récupérer les prix
async function fetchCryptoPrices() {
    const prices = [];
    try {
        // Essayer CoinGecko en premier
        const coinGeckoData = await fetchPricesFromCoinGecko();
        cryptos.forEach(crypto => {
            const price = coinGeckoData[crypto.id]?.usd;
            if (price !== undefined) {
                prices.push(`${crypto.symbol}: $${price.toFixed(2)}`);
            } else {
                // Si CoinGecko échoue, essayer CryptoCompare
                fetchPricesFromCryptoCompare().then(cryptoCompareData => {
                    const fallbackPrice = cryptoCompareData[crypto.fallbackId]?.USD;
                    if (fallbackPrice !== undefined) {
                        prices.push(`${crypto.symbol}: $${fallbackPrice.toFixed(2)}`);
                    } else {
                        prices.push(`${crypto.symbol}: Indisponible`);
                    }
                });
            }
        });
    } catch (error) {
        console.error("Erreur avec CoinGecko :", error);
        // En cas d'échec total, utiliser CryptoCompare
        try {
            const cryptoCompareData = await fetchPricesFromCryptoCompare();
            cryptos.forEach(crypto => {
                const fallbackPrice = cryptoCompareData[crypto.fallbackId]?.USD;
                if (fallbackPrice !== undefined) {
                    prices.push(`${crypto.symbol}: $${fallbackPrice.toFixed(2)}`);
                } else {
                    prices.push(`${crypto.symbol}: Indisponible`);
                }
            });
        } catch (fallbackError) {
            console.error("Erreur avec CryptoCompare :", fallbackError);
            prices.push("Prix des crypto-monnaies indisponibles !");
        }
    }

    // Mettre à jour la bannière
    updateBanner(prices.join(" &nbsp; | &nbsp; "));
}

// Fonction pour mettre à jour la bannière
function updateBanner(content) {
    const banner = document.getElementById("crypto-banner");
    if (banner) {
        // Répéter le texte pour créer un effet de boucle fluide
        banner.innerHTML = content + " &nbsp; | &nbsp; (10 refresh) ";

        // Calculer la durée de l'animation en fonction de la longueur du texte
        const textWidth = banner.scrollWidth / 2; // Largeur du texte (divisé par 2 car on l'a répété)
        const bannerWidth = banner.clientWidth; // Largeur visible de la bannière
        const duration = (textWidth / bannerWidth) * 30; // Ajuster la durée (15s par défaut)

        // Appliquer la nouvelle durée
        banner.style.animation = `scroll ${duration}s linear infinite`;

        // Redémarrer l'animation
        banner.style.animation = "none";
        void banner.offsetWidth; // Forcer le reflow
        banner.style.animation = `scroll ${duration}s linear infinite`;
    }
}

// Charger les prix au démarrage et toutes les 10 secondes
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 10000);
