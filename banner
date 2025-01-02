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
    for (let crypto of cryptos) {
        try {
            const response = await fetch(crypto.feed);
            const data = await response.json();
            const price = Object.values(data)[0].usd;
            prices.push(`${crypto.symbol}: $${price.toFixed(2)}`);
        } catch (error) {
            console.error(`Erreur avec ${crypto.symbol}:`, error);
            prices.push(`${crypto.symbol}: N/A`);
        }
    }
    document.getElementById("crypto-banner").innerHTML = prices.join(" &nbsp; | &nbsp; ");
}

fetchCryptoPrices();
setInterval(fetchCryptoPrices, 60000);
