// Default system for play is Hi‑Lo
let cardCountingSystem = "Hi-Lo";

// Mapping values for each system
const systemValues = {
    "Hi-Lo": { "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 0, "8": 0, "9": 0, "10": -1, "J": -1, "Q": -1, "K": -1, "A": -1 },
    "KO": { "2": 1, "3": 1, "4": 1, "5": 1, "6": 1, "7": 1, "8": 0, "9": 0, "10": -1, "J": -1, "Q": -1, "K": -1, "A": -1 },
    "Omega II": { "2": 1, "3": 1, "4": 2, "5": 2, "6": 2, "7": 1, "8": 0, "9": -1, "10": -2, "J": -2, "Q": -2, "K": -2, "A": 0 },
    "Wong Halves": { "2": 0.5, "3": 1, "4": 1, "5": 1.5, "6": 1, "7": 0.5, "8": 0, "9": -0.5, "10": -1, "J": -1, "Q": -1, "K": -1, "A": -1 },
    "Zen Count": { "2": 1, "3": 1, "4": 2, "5": 2, "6": 2, "7": 1, "8": 0, "9": 0, "10": -2, "J": -2, "Q": -2, "K": -2, "A": 0 }
};

// Update system selection from dropdown
const systemSelect = document.getElementById("system-select");
systemSelect.addEventListener("change", () => {
    cardCountingSystem = systemSelect.value;
    updateDebugDisplay();
    updateSuggestion();
    updateComparison();
});

// Game state variables (for play mode)
let deck = [];
let playerCards = [];
let dealerCards = [];
let gameOver = false;
let playerStand = false;
let debugMode = false;

// Betting variables
let bankroll = 1000;
let currentBet = 0;

// DOM elements for play mode
const dealerCardsEl = document.getElementById("dealer-cards");
const playerCardsEl = document.getElementById("player-cards");
const dealerTotalEl = document.getElementById("dealer-total");
const playerTotalEl = document.getElementById("player-total");
const messageEl = document.getElementById("message");
const dealBtn = document.getElementById("deal");
const hitBtn = document.getElementById("hit");
const standBtn = document.getElementById("stand");
const toggleDebugBtn = document.getElementById("toggle-debug");
const debugContainer = document.getElementById("debug-container");
const bankrollEl = document.getElementById("bankroll");
const betInput = document.getElementById("bet-amount");
const placeBetBtn = document.getElementById("place-bet");
const suggestionText = document.getElementById("suggestion-text");
const comparisonContainer = document.getElementById("comparison-container");

// DOM elements for simulation
const simHandsInput = document.getElementById("sim-hands");
const runSimBtn = document.getElementById("run-simulation");
const simResultsContainer = document.getElementById("simulation-results");
const runningStatsContainer = document.getElementById("running-stats");

// Create and shuffle deck (for play mode)
function createDeck() {
    deck = [];
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    suits.forEach(suit => {
    ranks.forEach(rank => {
        // For gameplay totals, use Hi‑Lo value.
        deck.push({ suit: suit, name: rank, value: systemValues["Hi-Lo"][rank] });
    });
    });
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Calculate hand total with Ace adjustment (play mode)
function calculateTotal(cards) {
    let total = cards.reduce((sum, card) => sum + card.value, 0);
    let aceCount = cards.filter(card => card.name === "A").length;
    while (total > 21 && aceCount > 0) {
    total -= 10;
    aceCount--;
    }
    return total;
}

// Compute system count for remaining deck using selected system mapping
function computeSystemCount(system) {
    let count = 0;
    deck.forEach(card => {
    count += systemValues[system][card.name];
    });
    return count;
}

// For balanced systems, running count is negative of system count; for KO, return "N/A"
function computeRunningCountFor(system) {
    if (system === "KO") return "N/A";
    return -computeSystemCount(system);
}

// For balanced systems, compute true count (normalized by decks remaining); for KO, return "N/A"
function computeTrueCountFor(system) {
    if (system === "KO") return "N/A";
    const remaining = deck.length;
    const decksRemaining = remaining / 52;
    if (decksRemaining === 0) return computeRunningCountFor(system);
    return (computeRunningCountFor(system) / decksRemaining).toFixed(2);
}

// Update the Card Counting Info panel for the selected system (play mode)
function updateDebugDisplay() {
    if (debugMode) {
    debugContainer.style.display = "block";
    debugContainer.innerHTML = `
        <strong>Card Counting Info (${cardCountingSystem}):</strong><br>
        Cards remaining: ${deck.length}<br>
        System Count: ${computeSystemCount(cardCountingSystem)}<br>
        Running Count: ${computeRunningCountFor(cardCountingSystem)}<br>
        True Count: ${computeTrueCountFor(cardCountingSystem)}
    `;
    } else {
    debugContainer.style.display = "none";
    }
}

// Update the comparison panel for all systems (play mode)
function updateComparison() {
    let html = `<strong>Comparison of Counting Systems:</strong><br>
                <table>
                <tr>
                    <th>System</th>
                    <th>System Count</th>
                    <th>Running Count</th>
                    <th>True Count</th>
                </tr>`;
    for (const system in systemValues) {
    let sysCount = computeSystemCount(system);
    let running = (system === "KO") ? "N/A" : -sysCount;
    let trueCount = (system === "KO") ? "N/A" : (deck.length / 52 === 0 ? running : (running / (deck.length / 52)).toFixed(2));
    html += `<tr>
                <td>${system}</td>
                <td>${sysCount}</td>
                <td>${running}</td>
                <td>${trueCount}</td>
                </tr>`;
    }
    html += `</table>`;
    comparisonContainer.style.display = "block";
    comparisonContainer.innerHTML = html;
}

// Provide suggestion with explanation based on player's total, dealer's visible card, and true count (play mode)
function updateSuggestion() {
    let suggestion = "";
    let explanation = "";
    const playerTotal = calculateTotal(playerCards);
    const dealerVisibleCard = dealerCards[1] || dealerCards[0];
    const dealerValue = dealerVisibleCard ? systemValues["Hi-Lo"][dealerVisibleCard.name] : 0;
    const trueCount = cardCountingSystem === "KO" ? 0 : parseFloat(computeTrueCountFor(cardCountingSystem));
    
    if (!dealerVisibleCard) {
    suggestion = "Waiting...";
    explanation = "Waiting for dealer's visible card.";
    } else if (playerTotal < 11) {
    suggestion = "Hit.";
    explanation = `Your total (${playerTotal}) is very low; hitting is advisable.`;
    } else if (playerTotal >= 17) {
    suggestion = "Stand.";
    explanation = `Your total (${playerTotal}) is high; standing minimizes bust risk.`;
    } else {
    if (dealerValue >= 7) {
        suggestion = "Hit.";
        explanation = `Dealer's card (${dealerVisibleCard.name}${dealerVisibleCard.suit}) is strong. You need a better hand.`;
    } else {
        suggestion = "Stand.";
        explanation = `Dealer's card (${dealerVisibleCard.name}${dealerVisibleCard.suit}) is weak; your total may be enough.`;
    }
    }
    
    if (cardCountingSystem !== "KO") {
    if (playerTotal >= 12 && playerTotal <= 16 && trueCount >= 2) {
        suggestion = "Stand.";
        explanation += ` The true count is high (${trueCount}), indicating a deck rich in high cards. Standing is favorable.`;
    }
    if (trueCount <= -2 && playerTotal < 17) {
        suggestion = "Hit.";
        explanation += ` The true count is low (${trueCount}), suggesting more low cards remain, so hitting is less risky.`;
    }
    }
    
    suggestionText.textContent = suggestion + " " + explanation;
}

// Render cards, totals, update suggestion, debug info, and comparison panel (play mode)
function renderCards() {
    dealerCardsEl.innerHTML = "";
    playerCardsEl.innerHTML = "";
    
    dealerCards.forEach((card, index) => {
    if (index === 0 && !gameOver && !playerStand) {
        const hiddenCard = document.createElement("div");
        hiddenCard.classList.add("card");
        hiddenCard.textContent = "❓";
        dealerCardsEl.appendChild(hiddenCard);
    } else {
        const cardEl = document.createElement("div");
        cardEl.classList.add("card");
        cardEl.textContent = card.name + card.suit;
        dealerCardsEl.appendChild(cardEl);
    }
    });
    
    playerCards.forEach(card => {
    const cardEl = document.createElement("div");
    cardEl.classList.add("card");
    cardEl.textContent = card.name + card.suit;
    playerCardsEl.appendChild(cardEl);
    });
    
    const dealerTotal = (gameOver || playerStand) ? calculateTotal(dealerCards) : "??";
    dealerTotalEl.textContent = dealerTotal;
    playerTotalEl.textContent = calculateTotal(playerCards);
    updateDebugDisplay();
    updateSuggestion();
    updateComparison();
}

// SIMULATION SECTION (Variable Betting)
// For simulation, we use a simple variable bet strategy:
// Base bet is $10; for balanced systems, if true count < 1, bet $10; otherwise, bet = $10 × (1 + (true count - 1)).
function simulateHandForSystem(system) {
    // Create a fresh simulation deck
    let simDeck = [];
    const suits = ["♠", "♥", "♦", "♣"];
    const ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    suits.forEach(suit => {
    ranks.forEach(rank => {
        simDeck.push({ suit: suit, name: rank, value: systemValues["Hi-Lo"][rank] });
    });
    });
    // Shuffle simulation deck
    for (let i = simDeck.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [simDeck[i], simDeck[j]] = [simDeck[j], simDeck[i]];
    }
    
    // Deal initial hands: two cards each for player and dealer
    let simPlayer = [simDeck.pop(), simDeck.pop()];
    let simDealer = [simDeck.pop(), simDeck.pop()];
    
    let playerTotal = calculateTotal(simPlayer);
    let dealerVisible = simDealer[1] || simDealer[0];
    let dealerValue = dealerVisible ? systemValues["Hi-Lo"][dealerVisible.name] : 0;
    
    // For balanced systems, compute true count based on simulation deck; for KO, we use 0.
    let systemCount = 0;
    simDeck.forEach(card => {
    systemCount += systemValues[system][card.name];
    });
    let runningCount = (system === "KO") ? null : -systemCount;
    let decksRemaining = simDeck.length / 52;
    let trueCount = (system === "KO") ? 0 : (decksRemaining === 0 ? runningCount : (runningCount / decksRemaining));
    
    // Calculate recommended bet based on true count (for balanced systems)
    const baseBet = 10;
    let recommendedBet = baseBet;
    if (system !== "KO" && trueCount >= 1) {
    // Simple rule: bet = baseBet * (1 + (trueCount - 1))
    recommendedBet = Math.round(baseBet * (1 + (trueCount - 1)));
    }
    
    // Determine suggestion using basic strategy (using Hi‑Lo values for dealer's card)
    let suggestion = "";
    if (playerTotal < 11) {
    suggestion = "Hit";
    } else if (playerTotal >= 17) {
    suggestion = "Stand";
    } else {
    suggestion = (dealerValue >= 7) ? "Hit" : "Stand";
    }
    if (system !== "KO") {
    if (playerTotal >= 12 && playerTotal <= 16 && trueCount >= 2) {
        suggestion = "Stand";
    }
    if (trueCount <= -2 && playerTotal < 17) {
        suggestion = "Hit";
    }
    }
    
    // Simulate player's decision: if suggestion is "Hit", draw one extra card
    if (suggestion === "Hit") {
    simPlayer.push(simDeck.pop());
    playerTotal = calculateTotal(simPlayer);
    }
    
    // Simulate dealer's turn: hit until total >= 17
    while (calculateTotal(simDealer) < 17 && simDeck.length > 0) {
    simDealer.push(simDeck.pop());
    }
    let dealerTotal = calculateTotal(simDealer);
    
    // Determine outcome:
    // If player busts, outcome = loss (-recommendedBet)
    // If dealer busts or player total > dealer total, outcome = win (+recommendedBet)
    // If push, outcome = 0 (or half win if you want to count as half win)
    let outcome = 0;
    if (playerTotal > 21) outcome = -recommendedBet;
    else if (dealerTotal > 21 || playerTotal > dealerTotal) outcome = recommendedBet;
    else if (playerTotal === dealerTotal) outcome = 0; // push
    else outcome = -recommendedBet;
    
    return { outcome, recommendedBet, runningCount: (runningCount === null ? "N/A" : runningCount) };
}

// Simulation: run a number of hands and aggregate results for each system using variable bets
function simulateHands(numHands) {
    let results = {};
    // Initialize results for each system
    for (const system in systemValues) {
    results[system] = { totalProfit: 0, wins: 0, pushes: 0, losses: 0, totalBet: 0, countOutcomes: [] };
    }
    
    // Run simulation for each system independently
    for (const system in systemValues) {
    for (let i = 0; i < numHands; i++) {
        let simResult = simulateHandForSystem(system);
        results[system].totalProfit += simResult.outcome;
        if (simResult.outcome > 0) results[system].wins++;
        else if (simResult.outcome === 0) results[system].pushes++;
        else results[system].losses++;
        results[system].totalBet += simResult.recommendedBet;
        if (simResult.runningCount !== "N/A") {
        results[system].countOutcomes.push(simResult.runningCount);
        }
    }
    }
    
    // Build summary table for outcomes and variable bets
    let outcomeHtml = `<h3>Simulation Outcome Results (${numHands} hands):</h3>
                        <table>
                        <tr>
                            <th>System</th>
                            <th>Total Profit</th>
                            <th>Wins</th>
                            <th>Pushes</th>
                            <th>Losses</th>
                            <th>Win % (Wins + 0.5×Pushes)</th>
                            <th>Average Bet</th>
                        </tr>`;
    for (const system in results) {
    let totalScore = results[system].wins + 0.5 * results[system].pushes;
    let winPerc = ((totalScore / numHands) * 100).toFixed(2) + "%";
    let avgBet = (results[system].totalBet / numHands).toFixed(2);
    outcomeHtml += `<tr>
                        <td>${system}</td>
                        <td>$${results[system].totalProfit}</td>
                        <td>${results[system].wins}</td>
                        <td>${results[system].pushes}</td>
                        <td>${results[system].losses}</td>
                        <td>${winPerc}</td>
                        <td>$${avgBet}</td>
                    </tr>`;
    }
    outcomeHtml += `</table>`;
    simResultsContainer.innerHTML = outcomeHtml;
    simResultsContainer.style.display = "block";
    
    // Build summary table for running count statistics
    let statsHtml = `<h3>Running Count Statistics:</h3>
                    <table>
                        <tr>
                        <th>System</th>
                        <th>Average Running Count</th>
                        <th>Minimum Running Count</th>
                        <th>Maximum Running Count</th>
                        </tr>`;
    for (const system in results) {
    let arr = results[system].countOutcomes;
    if (arr.length === 0) {
        statsHtml += `<tr>
                        <td>${system}</td>
                        <td>N/A</td>
                        <td>N/A</td>
                        <td>N/A</td>
                    </tr>`;
    } else {
        let sum = 0, min = Infinity, max = -Infinity;
        for (let val of arr) {
        sum += val;
        if (val < min) min = val;
        if (val > max) max = val;
        }
        let avg = (sum / arr.length).toFixed(2);
        statsHtml += `<tr>
                        <td>${system}</td>
                        <td>${avg}</td>
                        <td>${min}</td>
                        <td>${max}</td>
                    </tr>`;
    }
    }
    statsHtml += `</table>`;
    runningStatsContainer.innerHTML = statsHtml;
    runningStatsContainer.style.display = "block";
}

// Prepare for the next round (play mode)
function prepareForNextRound() {
    gameOver = false;
    playerStand = false;
    if (bankroll < 10) {
    messageEl.textContent = "Game Over! Not enough bankroll to continue.";
    betInput.disabled = true;
    placeBetBtn.disabled = true;
    dealBtn.disabled = true;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    return;
    }
    betInput.disabled = false;
    placeBetBtn.disabled = false;
    dealBtn.disabled = true;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealerCardsEl.innerHTML = "";
    playerCardsEl.innerHTML = "";
    dealerTotalEl.textContent = "0";
    playerTotalEl.textContent = "0";
    messageEl.textContent = "";
    suggestionText.textContent = "";
    currentBet = 0;
}

// End hand (play mode)
function endHand() {
    setTimeout(() => {
    prepareForNextRound();
    }, 2000);
}

// Check for immediate bust (play mode)
function checkForEndGame() {
    const playerTotal = calculateTotal(playerCards);
    if (playerTotal > 21) {
    messageEl.textContent = "You bust! Dealer wins.";
    gameOver = true;
    renderCards();
    endHand();
    }
    if (gameOver) {
    hitBtn.disabled = true;
    standBtn.disabled = true;
    }
}

// Dealer's turn (play mode)
function dealerTurn() {
    while (calculateTotal(dealerCards) < 17) {
    dealerCards.push(deck.pop());
    }
}

// Determine winner (play mode)
function determineWinner() {
    const playerTotal = calculateTotal(playerCards);
    const dealerTotal = calculateTotal(dealerCards);
    
    if (dealerTotal > 21) {
    messageEl.textContent = "Dealer busts! You win.";
    bankroll += currentBet * 2;
    } else if (dealerTotal > playerTotal) {
    messageEl.textContent = "Dealer wins.";
    } else if (dealerTotal < playerTotal) {
    messageEl.textContent = "You win!";
    bankroll += currentBet * 2;
    } else {
    messageEl.textContent = "Push. It's a tie.";
    bankroll += currentBet;
    }
    bankrollEl.textContent = bankroll;
    renderCards();
    endHand();
}

// Event listeners for play mode
placeBetBtn.addEventListener("click", () => {
    let betVal = parseInt(betInput.value);
    if (isNaN(betVal) || betVal < 10 || betVal > bankroll) {
    alert("Invalid bet. Minimum is $10 and cannot exceed your bankroll.");
    return;
    }
    currentBet = betVal;
    bankroll -= currentBet;
    bankrollEl.textContent = bankroll;
    betInput.disabled = true;
    placeBetBtn.disabled = true;
    dealBtn.disabled = false;
    messageEl.textContent = "";
});

dealBtn.addEventListener("click", () => {
    gameOver = false;
    playerStand = false;
    messageEl.textContent = "";
    hitBtn.disabled = false;
    standBtn.disabled = false;
    dealBtn.disabled = true;
    createDeck();
    shuffleDeck();
    playerCards = [];
    dealerCards = [];
    playerCards.push(deck.pop());
    dealerCards.push(deck.pop());
    playerCards.push(deck.pop());
    dealerCards.push(deck.pop());
    renderCards();
});

hitBtn.addEventListener("click", () => {
    if (!gameOver) {
    playerCards.push(deck.pop());
    renderCards();
    checkForEndGame();
    }
});

standBtn.addEventListener("click", () => {
    playerStand = true;
    hitBtn.disabled = true;
    standBtn.disabled = true;
    dealerTurn();
    renderCards();
    determineWinner();
    gameOver = true;
});

toggleDebugBtn.addEventListener("click", () => {
    debugMode = !debugMode;
    updateDebugDisplay();
    updateComparison();
});

// Simulation button event
runSimBtn.addEventListener("click", () => {
    const numHands = parseInt(simHandsInput.value);
    if (isNaN(numHands) || numHands < 1) {
    alert("Please enter a valid number of hands to simulate.");
    return;
    }
    simulateHands(numHands);
});

// Initialize play mode: enable betting controls; disable game buttons until bet is placed
document.addEventListener("DOMContentLoaded", () => {
    betInput.disabled = false;
    placeBetBtn.disabled = false;
    dealBtn.disabled = true;
    hitBtn.disabled = true;
    standBtn.disabled = true;
});