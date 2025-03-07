## Code Description: Unlimited Blackjack with Variable Bet Simulation & Counting Systems

This code implements an interactive web-based Blackjack game that also includes a variable betting simulation and incorporates several card counting systems. It's built using HTML for the structure, CSS for styling, and JavaScript for the game logic and interactive elements.

### HTML Structure (index.html)

The HTML file provides the foundation for the Blackjack game interface and its related features.

####  `<head>` Section:

This section of the HTML document configures the webpage's metadata and visual styling. It includes:

*   **Character Set Declaration**: Sets the character encoding to UTF-8, ensuring proper display of various characters.
*   **Title**: Defines the title that appears in the browser tab, which is "Unlimited Blackjack with Variable Bet Simulation & Counting Systems".
*   **Embedded CSS Styles**:  Contained within `<style>` tags, these CSS rules define the visual presentation of the game.  They handle:
    *   Basic body styling such as font family, background and text colors, margins, padding, and text alignment for the entire page.
    *   Styling for the `.game-container`, which acts as the main container for all game elements, setting its background, padding, rounded corners, maximum width, and margin for centering.
    *   CSS rules for the system selection dropdown (`.system-select`), controlling its margin, padding, background, border-radius, and inline display.  Styling for the `<select>` element itself for padding and font size.
    *   Styling for the betting controls section (`.betting-controls`), setting margin, padding, background, border-radius, and text color.  Also styles for input fields (`<input>`) and buttons (`<button>`) within this section for padding, font size, and width for inputs, and padding, font size, margins, border, border-radius, cursor, background, and text color for buttons.
    *   Styling for `.game-info`, which is a flex container for arranging dealer and player information side-by-side, using flexbox for layout, spacing, and wrapping on smaller screens.
    *   Styling for `.section` elements within `.game-info` to control flexible sizing and minimum width.
    *   Styling for `.cards` containers, setting minimum height and margin.
    *   Styling for individual `.card` elements representing playing cards, defining their display as inline-block, background and text color, border, border-radius, width, height, line-height for vertical centering of text, margin, and font-weight.
    *   Styling for `.buttons` container to manage button margins.
    *   Styling for buttons within `.buttons` (`#deal`, `#hit`, `#stand`, `#toggle-debug`), setting padding, margins, font size, border removal, border-radius, cursor, background, and text colors for each button ID to differentiate their appearance.
    *   Styling for `.message` to control font size and top margin for game messages.
    *   Styling for `.debug` containers, used for card counting info and simulation results, setting background, text color, padding, top margin, border-radius, text alignment, and font size.  Also includes table styling for border collapse, border for table/th/td elements, and padding and text alignment for `th` and `td`.
    *   Styling for explanation, education, disclaimer, and simulation sections (`.explanation`, `.education`, `.disclaimer`, `.simulation`) which share similar styling to `.debug` but are used for different content sections of the page. This includes styling for headings within these sections (`h2`), lists (`ul`), paragraphs (`p`), and specific styling for input fields and buttons within the simulation section (`.simulation input`, `.simulation button`).

#### `<body>` Section:

This section contains the visible elements of the Blackjack game on the webpage.

*   **Game Container `<div>` (`.game-container`)**: This is the primary container for all game-related content, styled as defined in the CSS.  It includes:
    *   **Heading `<h1>`**: Displays the title "Blackjack".
    *   **Counting System Dropdown `<div>` (`.system-select`)**: Contains a label "Select Counting System for Play:" and a `<select>` dropdown menu (`#system-select`).  The dropdown allows the user to choose from different card counting systems: Hi-Lo, KO, Omega II, Wong Halves, and Zen Count, with Hi-Lo selected by default.
    *   **Betting Controls `<div>` (`.betting-controls`)**: Manages betting functionality. It displays:
        *   A paragraph `<p>` showing the "Bankroll:" and the current bankroll amount (`<span id="bankroll">`).
        *   An input field (`<input type="number" id="bet-amount">`) where the player can enter their bet amount, with placeholders, minimum value, and step value.
        *   A "Place Bet" button (`<button id="place-bet">`) to submit the bet amount.
    *   **Game Information `<div>` (`.game-info`)**:  A flex container holding two sections:
        *   **Dealer Section `<div>` (`.section`)**:  Displays dealer information:
            *   Heading `<h2>` "Dealer".
            *   A `<div>` (`#dealer-cards`, `.cards`) to display the dealer's cards.
            *   A paragraph `<p>` showing "Total:" and the dealer's hand total (`<span id="dealer-total">`).
        *   **Player Section `<div>` (`.section`)**: Displays player information, structured similarly to the dealer section:
            *   Heading `<h2>` "You".
            *   A `<div>` (`#player-cards`, `.cards`) to display the player's cards.
            *   A paragraph `<p>` showing "Total:" and the player's hand total (`<span id="player-total">`).
    *   **Game Buttons `<div>` (`.buttons`)**:  Contains game control buttons:
        *   "Deal" button (`<button id="deal">`), initially disabled.
        *   "Hit" button (`<button id="hit">`), initially disabled.
        *   "Stand" button (`<button id="stand">`), initially disabled.
        *   "Toggle Card Counting Info" button (`<button id="toggle-debug">`).
    *   **Message Area `<div>` (`#message`, `.message`)**: Displays game messages and status updates to the player.
    *   **Card Counting Info Panel `<div>` (`#debug-container`, `.debug`)**: Initially hidden (`style="display: none;"`), this section is intended to display card counting information to the user in debug mode.
    *   **Suggestion Panel `<div>` (`#suggestion-container`, `.explanation`)**: Displays a suggestion to the player based on the game state, with a label "Suggestion:" and a span (`<span id="suggestion-text">`) to hold the suggestion text.
    *   **Comparison Panel for All Systems `<div>` (`#comparison-container`, `.debug`)**:  Also initially hidden, this panel is meant to show a comparison of different card counting systems, likely in a table format.
    *   **Explanation, Education & Disclaimer Section `<div>` (`#explanation-container`, `.explanation`)**: Provides information about card counting, betting rules, and disclaimers. It includes:
        *   A strong text element `<strong>` explaining "Card Counting & Betting Explained:".
        *   Paragraphs `<p>` explaining card counting, balanced vs. unbalanced systems, and betting rules.
        *   Unordered lists `<ul>` to list point values for different card counting systems and casino countermeasures.
    *   **Education Section `<div>` (`.education`)**:  Provides more in-depth learning material about card counting and variable betting, including headings, paragraphs, and lists explaining true count conversion and variable bet strategy examples.
    *   **Simulation Section `<div>` (`.simulation`)**:  Contains elements for running simulations:
        *   Heading `<h2>` "Simulation: Run Multiple Hands with Variable Betting".
        *   Paragraphs `<p>` explaining the simulation process and betting strategy used.
        *   An unordered list `<ul>` outlining the simulation steps.
        *   Input field (`<input type="number" id="sim-hands">`) for entering the number of hands to simulate.
        *   "Run Simulation" button (`<button id="run-simulation">`) to start the simulation.
        *   Simulation outcome results `<div>` (`#simulation-results`, `.debug`), initially hidden, to display simulation outcome statistics.
        *   Running count statistics `<div>` (`#running-stats`, `.debug`), also initially hidden, to display running count statistics from the simulation.

*   **JavaScript Section `<script>`**:  This section contains the JavaScript code that implements the game's interactive behavior, game logic, card counting calculations, betting strategies, and simulation functionalities.

### JavaScript Code (within `<script>` tag in HTML):

The JavaScript code is the core of the Blackjack game, handling all dynamic aspects and user interactions. It's structured to manage game state, implement card counting systems, handle betting, simulate gameplay, and update the HTML interface.

#### 1. Default System and System Value Mapping:

*   **`cardCountingSystem` variable**: Initialized to "Hi-Lo", setting the default card counting system for the game.
*   **`systemValues` object**: A constant JavaScript object that stores the card point values for each card rank, categorized by different card counting systems (Hi-Lo, KO, Omega II, Wong Halves, Zen Count).  This mapping is crucial for implementing the different counting systems.

#### 2. System Selection Dropdown Event Listener:

*   **Event listener on `#system-select`**:  This JavaScript code adds an event listener to the system selection dropdown menu. When the user changes the selected option in the dropdown, the following actions occur:
    *   The `cardCountingSystem` variable is updated to reflect the newly selected system.
    *   `updateDebugDisplay()`, `updateSuggestion()`, and `updateComparison()` functions are called. These functions are responsible for updating the card counting information panel, the suggestion text, and the system comparison panel to reflect the currently chosen counting system.

#### 3. Game State Variables (Play Mode):

*   **`deck`**: An array to represent the deck of cards used in the current game.
*   **`playerCards`**: An array to hold the cards dealt to the player's hand.
*   **`dealerCards`**: An array for the cards in the dealer's hand.
*   **`gameOver`**: A boolean flag indicating whether the current game round has ended.
*   **`playerStand`**: A boolean flag to track if the player has chosen to stand.
*   **`debugMode`**: A boolean flag to control the visibility of the debug/card counting information panel.
*   **`bankroll`**: A variable to store the player's current bankroll, initialized to 1000.
*   **`currentBet`**: A variable to store the player's bet amount for the current round.

#### 4. DOM Element Variables (Play Mode & Simulation):

*   This section declares variables to store references to various HTML elements using `document.getElementById()`. These variables are used to dynamically update the content and properties of these HTML elements in the JavaScript code.  Variables are created for:
    *   Card display areas for dealer and player (`dealerCardsEl`, `playerCardsEl`).
    *   Total display areas for dealer and player (`dealerTotalEl`, `playerTotalEl`).
    *   Message display area (`messageEl`).
    *   Game control buttons (`dealBtn`, `hitBtn`, `standBtn`, `toggleDebugBtn`).
    *   Debug information container (`debugContainer`).
    *   Bankroll display element (`bankrollEl`).
    *   Bet input field and place bet button (`betInput`, `placeBetBtn`).
    *   Suggestion text display area (`suggestionText`).
    *   Comparison panel container (`comparisonContainer`).
    *   Simulation hands input field, run simulation button, and simulation results containers (`simHandsInput`, `runSimBtn`, `simResultsContainer`, `runningStatsContainer`).

#### 5. Deck Creation and Shuffling Functions (Play Mode):

*   **`createDeck()`**: This function initializes a standard 52-card deck. It creates card objects with properties for suit, name (rank), and value (using Hi-Lo system for gameplay totals), and populates the `deck` array with these card objects.
*   **`shuffleDeck()`**: This function shuffles the cards in the `deck` array using the Fisher-Yates shuffle algorithm, randomizing the card order in place.

#### 6. Hand Total Calculation Function (Play Mode):

*   **`calculateTotal()`**: This function calculates the Blackjack hand total for a given array of cards. It sums the `value` property of each card (using Hi-Lo values) and handles Ace values, reducing the total by 10 for each Ace if the total exceeds 21 to simulate Ace being worth 1 instead of 11.

#### 7. Card Counting System Functions:

*   **`computeSystemCount()`**: This function calculates the "system count" for the current deck based on a given card counting system. It iterates through the cards remaining in the `deck` and sums up the point values assigned to each card according to the provided `system` mapping from `systemValues`.
*   **`computeRunningCountFor()`**: For balanced counting systems, this function computes the running count, which is typically the negative of the system count. For the KO system (unbalanced), it returns "N/A" as running count is not directly applicable.
*   **`computeTrueCountFor()`**: For balanced systems, this function computes the true count, which normalizes the running count by the estimated number of decks remaining in the deck.  It returns "N/A" for the KO system. The true count is calculated by dividing the running count by the number of decks remaining (calculated as `deck.length / 52`).

#### 8. Debug and Comparison Display Functions (Play Mode):

*   **`updateDebugDisplay()`**: This function updates the content of the debug information panel (`#debug-container`). It's only visible if `debugMode` is true. It displays the current card counting information for the selected `cardCountingSystem`, including cards remaining, system count, running count, and true count.
*   **`updateComparison()`**: This function updates the comparison panel (`#comparison-container`).  It creates an HTML table that compares the system count, running count, and true count for all available card counting systems (Hi-Lo, KO, Omega II, Wong Halves, Zen Count) based on the current deck.  The comparison panel is shown when debug mode is enabled.

#### 9. Suggestion Generation Function (Play Mode):

*   **`updateSuggestion()`**: This function generates a suggestion ("Hit" or "Stand") for the player based on basic Blackjack strategy, incorporating card counting principles when appropriate. The suggestion considers:
    *   Player's hand total.
    *   Dealer's visible card (second card dealt, or first if dealer only has one).
    *   True count (for balanced systems; not used for KO).
    *   Basic strategy guidelines (e.g., hit on low totals, stand on high totals, dealer's card strength).
    *   Card counting adjustments (e.g., stand on stiff hands if true count is high, hit on lower hands if true count is very low for balanced systems).
    The generated suggestion and a brief explanation are then displayed in the suggestion text area (`#suggestion-text`).

#### 10. Card Rendering Function (Play Mode):

*   **`renderCards()`**: This function updates the HTML display to visually represent the dealer's and player's hands and game information. It performs the following actions:
    *   Clears the inner HTML of the dealer and player card display areas (`dealerCardsEl`, `playerCardsEl`).
    *   Iterates through the `dealerCards` array. For the dealer's first card, if the game is not over and the player hasn't stood, it displays a face-down card ("❓"). Otherwise, it displays all dealer cards face-up. Each card is created as a `<div>` element with class "card" and card name/suit as text content.
    *   Iterates through the `playerCards` array and displays each player card face-up in the `playerCardsEl`, similar to dealer cards, creating `<div>` elements with class "card" and card name/suit.
    *   Updates the dealer's total display (`dealerTotalEl`). If the game is over or player has stood, it shows the actual dealer total; otherwise, it shows "??".
    *   Updates the player's total display (`playerTotalEl`).
    *   Calls `updateDebugDisplay()` to refresh the card counting info panel.
    *   Calls `updateSuggestion()` to refresh the suggestion text.
    *   Calls `updateComparison()` to refresh the system comparison panel.

#### 11. Simulation Section Functions (Variable Betting):

*   **`simulateHandForSystem()`**: This function simulates a single hand of Blackjack for a given card counting `system` using a variable betting strategy.  The simulation includes:
    *   Creating and shuffling a fresh deck specifically for the simulation.
    *   Dealing initial hands to player and dealer.
    *   Calculating true count (for balanced systems) based on the simulated deck.
    *   Determining a recommended bet based on the true count and the chosen system (using a simple variable bet strategy: base bet of $10, adjusted based on true count for balanced systems).
    *   Determining a suggested action ("Hit" or "Stand") using a basic strategy, adjusted by true count for balanced systems.
    *   Simulating player's turn based on the suggestion (hitting if suggested).
    *   Simulating dealer's turn (dealer hits until total is 17 or more).
    *   Determining the outcome of the hand (win, loss, or push) and calculating the profit or loss based on the recommended bet.
    *   Returning an object containing the outcome, recommended bet, and running count (if applicable to the system).

*   **`simulateHands()`**: This function runs a specified number of Blackjack hands in a simulation for each card counting system. It then aggregates and displays the results. The simulation process includes:
    *   Initializing result objects to store simulation statistics for each system (total profit, wins, pushes, losses, total bet, running count outcomes).
    *   Iterating through each card counting system in `systemValues`.
    *   For each system, running the `simulateHandForSystem()` function for the specified number of hands.
    *   Accumulating simulation results for each system (total profit, win/loss counts, total bets, and running count values).
    *   After simulating all hands for all systems, building HTML table strings (`outcomeHtml`, `statsHtml`) to display:
        *   A table summarizing simulation outcomes (total profit, wins, pushes, losses, win percentage, average bet) for each system.
        *   A table summarizing running count statistics (average, minimum, maximum running count) for each system.
    *   Updating the innerHTML of the simulation results and running count statistics containers (`simResultsContainer`, `runningStatsContainer`) to display the generated HTML tables, making them visible.

#### 12. Play Mode Game Flow Functions:

*   **`prepareForNextRound()`**: This function resets the game state to prepare for a new hand after a round ends. It:
    *   Resets `gameOver` and `playerStand` flags.
    *   Checks if the player's `bankroll` is below $10. If so, it ends the game, disables betting and game buttons, and displays a "Game Over" message.
    *   If bankroll is sufficient, it enables betting controls (bet input and place bet button) and disables game action buttons (deal, hit, stand).
    *   Clears card displays and total displays for dealer and player.
    *   Clears game messages and suggestion text.
    *   Resets `currentBet` to 0.
*   **`endHand()`**: This function is called at the end of a Blackjack hand. It uses `setTimeout()` to introduce a short delay (2 seconds) before calling `prepareForNextRound()` to give the player time to see the outcome before the game resets for the next bet.
*   **`checkForEndGame()`**: This function checks if the player has busted (player total exceeds 21) after hitting. If a bust occurs:
    *   Displays a "You bust!" message.
    *   Sets `gameOver` to true.
    *   Calls `renderCards()` to update card display (revealing dealer's hidden card).
    *   Calls `endHand()` to proceed to the end of the hand sequence.
    *   Disables hit and stand buttons if the game is over.
*   **`dealerTurn()`**: This function simulates the dealer's turn in Blackjack. The dealer keeps hitting (drawing cards) until their hand total is 17 or more.
*   **`determineWinner()`**: This function determines the winner of the Blackjack hand after the dealer has completed their turn or the player has busted or stood. It compares player and dealer totals and determines the outcome:
    *   If dealer busts, player wins.
    *   If dealer total is greater than player total (and player hasn't busted), dealer wins.
    *   If player total is greater than dealer total (and player hasn't busted), player wins.
    *   If totals are equal, it's a push (tie).
    *   Updates the `messageEl` to display the outcome of the hand.
    *   Updates the `bankroll` based on the outcome (win, loss, or push) and updates the bankroll display (`bankrollEl`).
    *   Calls `renderCards()` to update card display.
    *   Calls `endHand()` to proceed to the end of the hand sequence.

#### 13. Event Listeners for Play Mode Buttons:

*   **`placeBetBtn.addEventListener("click", ...)`**:  Adds an event listener to the "Place Bet" button. When clicked:
    *   Retrieves the bet amount from the bet input field.
    *   Validates the bet amount to ensure it's a number, at least $10, and not exceeding the current bankroll. If invalid, displays an alert.
    *   If the bet is valid, stores the bet amount in `currentBet`, deducts it from the `bankroll`, updates the bankroll display, disables betting controls (input and button), and enables the "Deal" button.  Clears any previous message.
*   **`dealBtn.addEventListener("click", ...)`**: Adds an event listener to the "Deal" button. When clicked:
    *   Resets `gameOver` and `playerStand` flags.
    *   Clears any game messages.
    *   Enables "Hit" and "Stand" buttons, disables "Deal" button.
    *   Creates a new shuffled deck using `createDeck()` and `shuffleDeck()`.
    *   Clears player and dealer hands (`playerCards`, `dealerCards`).
    *   Deals two cards to the player and two cards to the dealer from the deck.
    *   Calls `renderCards()` to display the initial hands.
*   **`hitBtn.addEventListener("click", ...)`**: Adds an event listener to the "Hit" button. When clicked:
    *   Checks if the game is not over (`!gameOver`).
    *   If game is active, draws one card from the deck and adds it to the player's hand.
    *   Calls `renderCards()` to update the display.
    *   Calls `checkForEndGame()` to check if the player has busted.
*   **`standBtn.addEventListener("click", ...)`**: Adds an event listener to the "Stand" button. When clicked:
    *   Sets `playerStand` to true.
    *   Disables "Hit" and "Stand" buttons.
    *   Calls `dealerTurn()` to simulate the dealer's turn.
    *   Calls `renderCards()` to display dealer's cards and updated totals.
    *   Calls `determineWinner()` to determine and display the game outcome.
    *   Sets `gameOver` to true.
*   **`toggleDebugBtn.addEventListener("click", ...)`**: Adds an event listener to the "Toggle Card Counting Info" button. When clicked:
    *   Toggles the `debugMode` boolean variable (from false to true or true to false).
    *   Calls `updateDebugDisplay()` to update the visibility and content of the debug panel based on the new `debugMode`.
    *   Calls `updateComparison()` to update the system comparison panel visibility based on the new `debugMode`.

#### 14. Simulation Button Event Listener:

*   **`runSimBtn.addEventListener("click", ...)`**: Adds an event listener to the "Run Simulation" button. When clicked:
    *   Retrieves the number of hands to simulate from the simulation hands input field (`simHandsInput`).
    *   Validates the input to ensure it's a valid number greater than 0. If invalid, displays an alert.
    *   If valid, calls the `simulateHands()` function, passing the number of hands to simulate to begin the simulation process.

#### 15. Initialization on Document Load:

*   **`document.addEventListener("DOMContentLoaded", ...)`**: This code block ensures that the following JavaScript code executes only after the entire HTML document has been fully loaded and parsed by the browser.  Upon page load:
    *   Betting input (`betInput`) and place bet button (`placeBetBtn`) are enabled, allowing the player to start by placing a bet.

### Summary:

This comprehensive Blackjack code combines HTML for page structure, CSS for visual presentation, and JavaScript for interactive game logic, card counting, variable betting simulation, and educational content. It offers a functional Blackjack game with features for card counting practice and simulation of different card counting systems with variable betting strategies, along with detailed explanations and disclaimers. The JavaScript is well-structured into functions for different aspects of the game, including game state management, card operations, UI updates, simulation, and event handling.