// ==================== EMOJI POOLS & GAME ASSETS ====================

// Main emoji pool with weighted distribution for random selection
const emojipool = [
    // Target emojis (high frequency - 26 instances for higher spawn rate)
    'target.png','target.png','target.png','target.png','target.png',
    'target.png','target.png','target.png','target.png','target.png',
    'target.png','target.png','target.png','target.png','target.png',
    'target.png','target.png','target.png','target.png','target.png',
    'target.png','target.png','target.png','target.png','target.png','target.png',

    // Plus 2 point emojis (medium frequency - 10 instances)
    'plus2.png','plus2.png','plus2.png','plus2.png','plus2.png',
    'plus2.png','plus2.png','plus2.png','plus2.png','plus2.png',

    // Plus 5 point emojis (low frequency - 2 instances)
    'plus5.png','plus5.png',

    // Time slow emoji (very rare - 1 instance)
    'timeslow.png',

    // Decoy/wrong emojis (moderate frequency - 16 instances)
    'purple.png','purple.png','purple.png','alien.png','hanal.png','hanar.png',
    'junka.png','junkm.png','oldl.png','punk.png','purple.png','alien.png',
    'hanal.png','hanar.png','junka.png','junkm.png','oldl.png','punk.png'
];

// Individual emoji type arrays for easy reference
const targetemo = ['target.png'];      // Main target emoji (+1 point)
const plustwo = ['plus2.png'];         // Bonus emoji (+2 points)
const plusfive = ['plus5.png'];        // High bonus emoji (+5 points)
const timeslow = ['timeslow.png'];     // Time extension emoji (+5 seconds)

// ==================== AUDIO ASSETS ====================

// Game sound effects
const wrongemo = new Audio('sounds/wronge.mp3');          // Wrong emoji click sound
const timeover = new Audio('sounds/timeover.mp3');        // Game over sound
const yo = new Audio('sounds/yo.wav');                    // Decoy hover sound
const bg = new Audio('sounds/bg.mp3');                    // Background music
const button = new Audio('sounds/buttonclick.wav');       // UI button click sound

// ==================== UTILITY FUNCTIONS ====================

/**
 * Toggles the visibility of the instructions dropdown
 * Includes click-outside-to-close functionality
 */
function toggleInstructions() {
    const dropdown = document.getElementById('instructions');
    button.play();
    
    if (dropdown.classList.contains('hidden')) {
        dropdown.classList.remove('hidden');
    } else {
        dropdown.classList.add('hidden');
    }

    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!dropdown.contains(e.target) && e.target !== howtoplay) {
            dropdown.classList.add('hidden');
        }
    });
}

/**
 * Plays button click sound for UI interactions
 */
function buttonsound() {
    button.play();
}

// ==================== GAME STATE VARIABLES ====================

let score = 0;                                            // Current game score
let highscore = localStorage.getItem("highscore") || 0;   // Persistent high score
let gameend;                                              // Emoji spawning interval
let timerinterval;                                        // Game timer interval
let gameactive = false;                                   // Game state flag
let timeleft = 60;                                        // Remaining game time

// Initialize high score display
document.getElementById("highscore").textContent = `Highest Score : ${highscore}`;

// Background video element reference
const videobg = document.getElementById("bg");

// ==================== CORE GAME FUNCTIONS ====================

/**
 * Main emoji spawning function
 * Handles emoji creation, positioning, behavior, and click events
 */
function spawnemoji() {
    // Random emoji selection from pool
    let ran = Math.floor(Math.random() * emojipool.length);
    let selectedemoji = emojipool[ran];
    let isdecoy = false;
    const istargetdecoy = targetemo.includes(selectedemoji);
    let givestwopoints = false;

    // Create emoji container element
    const emojidiv = document.createElement('div');
    emojidiv.className = "drop-shadow-lg hover:drop-shadow-2xl text-7xl absolute emoji animate-bounce hover:brightness-130 hover:scale-110 duration-400 transition-all ";

    // Create emoji image element
    const img = document.createElement('img');
    img.src = `emojis/${selectedemoji}`;
    img.alt = selectedemoji;
    img.className = "lg:w-27 lg:h-27 w-21 h-21 object-contain pointer-events-none rounded-full";
    img.style.imageRendering = "pixelated";

    emojidiv.appendChild(img);

    // Available movement directions for decoy emojis
    const directions = [
        'hover:translate-x-[100%]',                        // Move right
        'hover:-translate-x-[100%]',                       // Move left
        'hover:translate-y-[100%]',                        // Move down
        'hover:-translate-y-[100%]',                       // Move up
        'hover:translate-x-[100%] hover:-translate-y-[100%]',  // Move diagonal up-right
        'hover:-translate-x-[100%] hover:-translate-y-[100%]', // Move diagonal up-left
    ];

    // Create target decoy (30% chance for target emojis to become decoys)
    if(istargetdecoy && Math.random() < 0.3){
        console.log("Decoy created:", selectedemoji);
        isdecoy = true;
        emojidiv.dataset.decoy = true;
    }

    // Create plus2 decoy (30% chance for plus2 emojis to become decoys)
    if(selectedemoji === plustwo[0] && Math.random() < 0.3){
        givestwopoints = true;
    }

    // Apply decoy behavior to plus2 emojis
    if(givestwopoints) {
        emojidiv.classList.add(
            'decoy',
            'cursor-not-allowed',
            'opacity-90',
            directions[Math.floor(Math.random() * directions.length)]
        );
        emojidiv.dataset.decoy = true;
        emojidiv.addEventListener("mouseenter", () => {yo.play()});
    }

    // Apply decoy behavior to target emojis
    if (isdecoy) {
        emojidiv.classList.add(
            'decoy',
            'cursor-not-allowed',
            'opacity-70',
            directions[Math.floor(Math.random() * directions.length)]
        );
        emojidiv.addEventListener("mouseenter", () => {yo.play()});
    }

    // ==================== EMOJI POSITIONING ====================
    
    // Get game screen boundaries
    const gamescreen = document.getElementById("game-screen");
    const bounds = gamescreen.getBoundingClientRect();
    const timer = document.getElementById("timer").getBoundingClientRect();
    const counter = document.getElementById("count").getBoundingClientRect();
    const exitinplay = document.getElementById("exitbutton").getBoundingClientRect();

    const maxTop = bounds.height - 80;
    const maxLeft = bounds.width - 80;

    let randomTop, randomLeft;
    let isOverlapping;

    // Overlap prevention loop - ensures emojis don't spawn on UI elements or each other
    do {
        isOverlapping = false;

        randomTop = Math.random() * maxTop;
        randomLeft = Math.random() * maxLeft;

        // Define emoji bounding box
        const emojiBox = {
            top: randomTop,
            bottom: randomTop + 64,
            left: randomLeft,
            right: randomLeft + 64
        };

        // Define UI element bounding boxes
        const timerBox = {
            top: timer.top - bounds.top,
            bottom: timer.bottom - bounds.top,
            left: timer.left - bounds.left,
            right: timer.right - bounds.left
        };

        const counterBox = {
            top: counter.top - bounds.top,
            bottom: counter.bottom - bounds.top,
            left: counter.left - bounds.left,
            right: counter.right - bounds.left
        };

        const exitinplaybox = {
            top: exitinplay.top - bounds.top,
            bottom: exitinplay.bottom - bounds.top,
            left: exitinplay.left - bounds.left,
            right: exitinplay.right - bounds.left
        };

        // Check overlap with timer
        if (!(emojiBox.right < timerBox.left ||
              emojiBox.left > timerBox.right ||
              emojiBox.bottom < timerBox.top ||
              emojiBox.top > timerBox.bottom)) {
            isOverlapping = true;
        }

        // Check overlap with exit button
        if (!(emojiBox.right < exitinplaybox.left ||
              emojiBox.left > exitinplaybox.right ||
              emojiBox.bottom < exitinplaybox.top ||
              emojiBox.top > exitinplaybox.bottom)) {
            isOverlapping = true;
        }

        // Check overlap with score counter
        if (!(emojiBox.right < counterBox.left ||
              emojiBox.left > counterBox.right ||
              emojiBox.bottom < counterBox.top ||
              emojiBox.top > counterBox.bottom)) {
            isOverlapping = true;
        }

        // Check overlap with existing emojis
        const existingEmojis = document.querySelectorAll('.emoji');
        existingEmojis.forEach(existing => {
            const rect = existing.getBoundingClientRect();
            const existingBox = {
                top: rect.top - bounds.top,
                bottom: rect.bottom - bounds.top,
                left: rect.left - bounds.left,
                right: rect.right - bounds.left
            };

            if (!(emojiBox.right < existingBox.left ||
                  emojiBox.left > existingBox.right ||
                  emojiBox.bottom < existingBox.top ||
                  emojiBox.top > existingBox.bottom)) {
                isOverlapping = true;
            }
        });

    } while (isOverlapping);

    // Set final emoji position
    emojidiv.style.top = `${randomTop}px`;
    emojidiv.style.left = `${randomLeft}px`;

    // Add emoji to game screen
    gamescreen.appendChild(emojidiv);

    // Auto-remove emoji after 950ms if not clicked
    setTimeout(() => {
        emojidiv.remove();
    }, 950);

    // ==================== EMOJI CLICK HANDLING ====================
    
    emojidiv.addEventListener("click", () => {
        // Handle decoy clicks (just spin, no scoring)
        if (emojidiv.dataset.decoy) {
            emojidiv.classList.add('animate-spin');
            return;
        }

        let scored = false;

        // Handle different emoji types
        if (selectedemoji === targetemo[0] && !emojidiv.dataset.decoy) {
            // Target emoji clicked (+1 point)
            new Audio('sounds/targetemo.mp3').play();
            score++;
            document.getElementById("count").textContent = score;
            scored = true;    
        }
        else if (selectedemoji === plustwo[0]) {
            // Plus 2 emoji clicked (+2 points)
            score += 2;
            document.getElementById("count").textContent = score;
            new Audio('sounds/plus2.mp3').play();  
            scored = true;
        }
        else if (selectedemoji === plusfive[0]) {
            // Plus 5 emoji clicked (+5 points)
            score += 5;
            document.getElementById("count").textContent = score; 
            new Audio('sounds/plus5.mp3').play(); 
            scored = true;
        }
        else if(selectedemoji === timeslow[0]) {
            // Time slow emoji clicked (+5 seconds)
            timeleft += 5;
            document.getElementById("timer").textContent = timeleft;
            new Audio('sounds/time.mp3').play();
        }
        else {
            // Wrong emoji clicked (game over)
            wrongemo.play();
            endgame();
            document.getElementById("timer").textContent = 0;
        }
        
        // Remove clicked emoji
        emojidiv.remove();

        // Update high score if necessary
        if(scored && score > highscore) {
            highscore = score;
            localStorage.setItem("highscore", highscore);
            document.getElementById("highscore").textContent = `Highest Score : ${highscore}`;
        }
    });
}

// ==================== GAME CONTROL FUNCTIONS ====================

/**
 * Initializes and starts a new game
 */
function startgame() {
    // Switch backgrounds
    document.getElementById("bg").classList.remove("hidden");
    document.getElementById("bgintro").classList.add("hidden");
    document.getElementById("header").classList.add("hidden");

    // Show exit button during gameplay
    exitduringplay = document.getElementById("exitbutton");
    exitduringplay.classList.remove("hidden");

    // Remove intro background styling
    document.getElementById("game-screen").classList.remove("bg-black");

    // Start background music
    bg.loop = true;
    bg.volume = 0.8; 
    bg.play();

    // Start emoji spawning (every 350ms)
    gameend = setInterval(spawnemoji, 350);

    // Hide start button and show game UI
    document.getElementById("startbutton").classList.add("hidden");
    document.getElementById("startbutton").classList.add("pointer-events-none");
    document.getElementById("count").classList.remove("hidden");
    document.getElementById("timer").classList.remove("hidden");

    // Start game timer (updates every second)
    timerinterval = setInterval(updatetimer, 1000);
}

/**
 * Updates the game timer every second
 */
function updatetimer() {
    timeleft--;
    document.getElementById("timer").textContent = timeleft;
    
    if (timeleft == 0) {
        timeover.play();  
        endgame();   
    }
}

/**
 * Handles exit button click during gameplay
 */
function exitbutton() {
    exitbutton = document.getElementById("exitbutton");
    exitbutton.classList.add("hidden");
    endgame();
    wrongemo.play();
}

/**
 * Ends the current game and shows results
 */
function endgame() {
    // Hide exit button
    document.getElementById("exitbutton").classList.add("hidden");

    // Switch to score background
    document.getElementById("bg").classList.add("hidden");
    document.getElementById("scorebg").classList.remove("hidden");
    
    // Stop background music
    bg.pause();
    bg.currentTime = 0;

    // Hide intro elements
    document.getElementById("highscore").classList.add("hidden");
    document.getElementById("bgintro").classList.add("hidden");

    // Show end game screen with animation
    const endgrid = document.getElementById("endgrid");
    endgrid.classList.remove("hidden");
    
    void endgrid.offsetWidth; // Force reflow for animation
    
    endgrid.classList.remove("opacity-0", "scale-90");
    endgrid.classList.add("opacity-100", "scale-100");
   
    // Stop game intervals
    clearInterval(gameend);
    clearInterval(timerinterval);
    
    // Hide timer
    document.getElementById("timer").classList.add("hidden");

    // Remove all remaining emojis
    allemojis = document.querySelectorAll('.emoji');
    allemojis.forEach(emoji => { 
        emoji.remove();
    });
}

/**
 * Restarts the game with reset values
 */
function tryagain() {
    // Hide end screen
    const endgrid = document.getElementById("endgrid");
    endgrid.classList.add("hidden", "opacity-0", "scale-90");
    endgrid.classList.remove("opacity-100", "scale-100");

    // Clear any existing intervals
    clearInterval(gameend);
    clearInterval(timerinterval);
    
    // Reset game values
    score = 0;
    timeleft = 60;

    // Update UI displays
    document.getElementById("count").textContent = score;
    document.getElementById("timer").textContent = timeleft;

    // Start new game
    startgame();
    document.getElementById("endgrid").classList.add("hidden");
    document.getElementById("scorebg").classList.add("hidden");
}

/**
 * Exits the game and reloads the page
 */
function exit() {
    button.play();
    setTimeout(() => {
        location.reload();
    }, 150);
}

// ==================== EVENT LISTENERS ====================

// Start button click sound
document.getElementById("startbutton").addEventListener("click", () => {
    button.play();
});

// Try again button click sound
document.getElementById("try").addEventListener("click", () => {
    button.play();
});