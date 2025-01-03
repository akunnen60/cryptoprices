const cryptos = [
    { symbol: "BTC", id: "bitcoin", fallbackId: "BTC" },
    { symbol: "ETH", id: "ethereum", fallbackId: "ETH" },
    { symbol: "XRP", id: "ripple", fallbackId: "XRP" },
    { symbol: "SOL", id: "solana", fallbackId: "SOL" },
    { symbol: "ADA", id: "cardano", fallbackId: "ADA" },
    { symbol: "BNB", id: "binancecoin", fallbackId: "BNB" },
    { symbol: "TRX", id: "tron", fallbackId: "TRX" },
    { symbol: "AVAX", id: "avalanche-2", fallbackId: "AVAX" },
    { symbol: "DOGE", id: "dogecoin", fallbackId: "DOGE" },
    { symbol: "LINK", id: "chainlink", fallbackId: "LINK" },
    { symbol: "SUI", id: "sui", fallbackId: "SUI" },
    { symbol: "XLM", id: "stellar", fallbackId: "XLM" }
];

let previousPrices = {}; // Stocker les prix précédents

async function fetchPricesFromCoinGecko() {
    const ids = cryptos.map(crypto => crypto.id).join(",");
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`;
    const response = await fetch(url);
    return await response.json();
}

async function fetchPricesFromCryptoCompare() {
    const symbols = cryptos.map(crypto => crypto.fallbackId).join(",");
    const url = `https://min-api.cryptocompare.com/data/pricemulti?fsyms=${symbols}&tsyms=USD`;
    const response = await fetch(url);
    return await response.json();
}

async function fetchCryptoPrices() {
    const prices = [];
    try {
        const coinGeckoData = await fetchPricesFromCoinGecko();
        cryptos.forEach(crypto => {
            const price = coinGeckoData[crypto.id]?.usd;
            if (price !== undefined) {
                prices.push(`${crypto.symbol}: $${price.toFixed(2)}`);
            } else {
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

    updateBanner(prices);
}

function updateBanner(prices) {
    const banner = document.getElementById("crypto-banner");
    if (banner) {
        // Effacer la bannière pendant 0.5 seconde
        banner.style.display = "none";
        setTimeout(() => {
            banner.innerHTML = prices
                .map(price => {
                    const [symbol, value] = price.split(": $");
                    const currentPrice = parseFloat(value);
                    const previousPrice = previousPrices[symbol] || currentPrice;

                    // Déterminer la couleur en fonction de la variation
                    const colorClass = currentPrice > previousPrice ? "green" : currentPrice < previousPrice ? "red" : "";

                    // Mettre à jour le prix précédent
                    previousPrices[symbol] = currentPrice;

                    return `<span class="${colorClass}">${symbol}: $${value}</span>`;
                })
                .join(" &nbsp; | &nbsp; ");

            // Réafficher la bannière
            banner.style.display = "block";
        }, 500); // Attendre 0.5 seconde
    }
}

// Charger les prix au démarrage et toutes les 10 secondes
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 10000);
