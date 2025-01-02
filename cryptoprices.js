const cryptos = [
    { symbol: "BTC", feed: "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd" },
    { symbol: "ETH", feed: "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd" },
    { symbol: "XRP", feed: "https://api.coingecko.com/api/v3/simple/price?ids=ripple&vs_currencies=usd" },
    { symbol: "SOL", feed: "https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd" },
    { symbol: "BNB", feed: "https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd" },
    { symbol: "ADA", feed: "https://api.coingecko.com/api/v3/simple/price?ids=cardano&vs_currencies=usd" }
];

async function fetchCryptoPrices() {
    const prices = [];
    try {
        for (const crypto of cryptos) {
            const response = await fetch(crypto.feed);
            const data = await response.json();
            const price = Object.values(data)[0].usd;
            prices.push(`${crypto.symbol}: $${price.toFixed(2)}`);
        }
    } catch (error) {
        console.error("Erreur lors de la récupération des prix :", error);
        prices.push("Erreur de chargement des prix.");
    }
    updateBanner(prices.join(" &nbsp; | &nbsp; "));
}

function updateBanner(content) {
    const banner = document.getElementById("crypto-banner");
    banner.innerHTML = content;

    // Redémarrer l'animation
    banner.style.animation = "none";
    void banner.offsetWidth; // Forcer le reflow
    banner.style.animation = "scroll 15s linear infinite";
}

// Charger les prix au démarrage et toutes les 30 secondes
fetchCryptoPrices();
setInterval(fetchCryptoPrices, 30000);
