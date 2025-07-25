    // const emojipool =  [
    // '😁', // beaming face
    // '😂', // laughing with tears
    // '🤣', // rolling on the floor laughing
    // '😃', // smiling
    // '😄', // smiling with open mouth
    // '😅', // smiling with sweat
    // '😆', // laughing closed eyes
    // '😇', // smiling with halo
    // '😃', 
    // '😃', 
    // '😃', 
    // '😃', 
    // '😃', 
    // '😃', 
    // ];
    // const targetemo = ['😃'];

    const emojipool = ['alien.png','hanal.png','hanar.png','junka.png','junkm.png','oldl.png','punk.png','target.png','target.png','target.png','target.png','target.png','target.png','target.png','target.png','target.png','target.png','target.png','target.png','target.png','target.png',];
    const targetemo = ['target.png']


    // const targetemoclick = new Audio('sounds/targetemo.mp3');
    const wrongemo = new Audio('sounds/wronge.mp3');
    const timeover = new Audio('sounds/timeover.mp3');
    const yo = new Audio('sounds/yo.wav');
    const bg = new Audio('sounds/bg.mp3');
    const button = new Audio('sounds/buttonclick.wav');

    let score = 0;
    let highscore = localStorage.getItem("highscore") || 0;
    document.getElementById("highscore").textContent = `Highest Score : ${highscore}`
    let gameend;
    let timerinterval;
    let gameactive = false;
    let timeleft = 60;
    const videobg = document.getElementById("bg");


   function spawnemoji() {
    let ran = Math.floor(Math.random() * emojipool.length);
    let selectedemoji = emojipool[ran];
    let isdecoy = false;
    const istargetdecoy = targetemo.includes(selectedemoji);

    const emojidiv = document.createElement('div');
    emojidiv.className = "drop-shadow-lg hover:drop-shadow-2xl text-7xl absolute emoji animate-bounce hover:brightness-130 hover:scale-110 duration-400 transition-all ";

    const img = document.createElement('img');
    img.src = `emojis/${selectedemoji}`;
    img.alt = selectedemoji;
    img.className = "w-27 h-27 object-contain pointer-events-none rounded-full"; // 64px if tailwind config = default
    img.style.imageRendering = "pixelated";

    emojidiv.appendChild(img);


    

    if(istargetdecoy && Math.random() < 0.3){
    console.log("Decoy created:", selectedemoji);
    isdecoy = true;
    emojidiv.dataset.decoy = true;
    };


    const directions = [
  'hover:translate-x-[100%]',    
  'hover:-translate-x-[100%]',   
  'hover:translate-y-[100%]',    
  'hover:-translate-y-[100%]',   
  'hover:translate-x-[100%] hover:-translate-y-[100%]',
  'hover:-translate-x-[100%] hover:-translate-y-[100%]',
]; 

   if (isdecoy) {
  emojidiv.classList.add(
    'decoy',
    'cursor-not-allowed',
    'opacity-80',
    directions[Math.floor(Math.random() * directions.length)]
  );
  emojidiv.addEventListener("mouseenter", () => {yo.play()})
};

    const gamescreen = document.getElementById("game-screen");
    const bounds = gamescreen.getBoundingClientRect();
    const timer = document.getElementById("timer").getBoundingClientRect();
    const counter = document.getElementById("count").getBoundingClientRect();

    const maxTop = bounds.height - 80;
    const maxLeft = bounds.width - 80;

    let randomTop, randomLeft;
    let isOverlapping;

    // overlapping check loop //

    do {
        isOverlapping = false;

        randomTop = Math.random() * maxTop;
        randomLeft = Math.random() * maxLeft;

        const emojiBox = {
            top: randomTop,
            bottom: randomTop + 64,
            left: randomLeft,
            right: randomLeft + 64
        };

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

        
        if (
            !(emojiBox.right < timerBox.left ||
              emojiBox.left > timerBox.right ||
              emojiBox.bottom < timerBox.top ||
              emojiBox.top > timerBox.bottom)
        ) {
            isOverlapping = true;
        }

        // Overlap check with counter
        if (
            !(emojiBox.right < counterBox.left ||
              emojiBox.left > counterBox.right ||
              emojiBox.bottom < counterBox.top ||
              emojiBox.top > counterBox.bottom)
        ) {
            isOverlapping = true;
        }

        // Overlap check with existing emojis
        const existingEmojis = document.querySelectorAll('.emoji');
        existingEmojis.forEach(existing => {
            const rect = existing.getBoundingClientRect();
            const existingBox = {
                top: rect.top - bounds.top,
                bottom: rect.bottom - bounds.top,
                left: rect.left - bounds.left,
                right: rect.right - bounds.left
            };

            if (
                !(emojiBox.right < existingBox.left ||
                  emojiBox.left > existingBox.right ||
                  emojiBox.bottom < existingBox.top ||
                  emojiBox.top > existingBox.bottom)
            ) {
                isOverlapping = true;
            }
        });

    } while (isOverlapping);

    emojidiv.style.top = `${randomTop}px`;
    emojidiv.style.left = `${randomLeft}px`;

    gamescreen.appendChild(emojidiv);


    setTimeout(() => {
        emojidiv.remove();
    }, 950);

    emojidiv.addEventListener("click", () => {

        if (emojidiv.dataset.decoy) {
        emojidiv.classList.add('animate-spin');
        return;
    }

    if (selectedemoji === targetemo[0] && !emojidiv.dataset.decoy ) {
            new Audio('sounds/targetemo.mp3').play();
            score++;
            document.getElementById("count").textContent = score;

            if (score > highscore) {
        highscore = score;
        localStorage.setItem("highscore", highscore);
        document.getElementById("highscore").textContent = `Highest Score : ${highscore}`;
        }

            emojidiv.remove();
        } else {
            wrongemo.play();
            endgame();
            document.getElementById("timer").textContent = 0;
            // alert("Wrong emoji selected!");
        }
    });
}




function startgame(){

document.getElementById("bg").classList.remove("hidden");
document.getElementById("bgintro").classList.add("hidden");
document.getElementById("header").classList.add("hidden");
// videobg.addEventListener("click", () => {videobg.play()});



document.getElementById("game-screen").classList.remove("bg-black");

bg.loop = true;
bg.volume = 0.3; // Optional: set volume
bg.play();
gameend = setInterval(spawnemoji,400);
document.getElementById("startbutton").classList.add("hidden");
document.getElementById("startbutton").classList.add("pointer-events-none");
document.getElementById("count").classList.remove("hidden");
document.getElementById("timer").classList.remove("hidden");
timerinterval = setInterval(updatetimer,1000);


}

document.getElementById("startbutton").addEventListener("click", () => {
    button.play();
})






function updatetimer(){

    timeleft--;
    document.getElementById("timer").textContent = timeleft;
    if (timeleft == 0 ) {
    timeover.play();  
     endgame();   

    }
}

function endgame (){

//  {setTimeout(() => {     
//   videobg.pause();
// }, 1600);};
    document.getElementById("bg").classList.add("hidden");
    document.getElementById("scorebg").classList.remove("hidden");
    bg.pause();
    bg.currentTime = 0;

    document.getElementById("highscore").classList.add("hidden");
    document.getElementById("bgintro").classList.add("hidden");

    const endgrid = document.getElementById("endgrid");

    endgrid.classList.remove("hidden");

    void endgrid.offsetWidth;

    endgrid.classList.remove("opacity-0", "scale-90");
    endgrid.classList.add("opacity-100", "scale-100");
   
    clearInterval(gameend);
    clearInterval(timerinterval);
    
    document.getElementById("timer").classList.add("hidden");

    allemojis = document.querySelectorAll('.emoji');
    allemojis.forEach(emoji => { emoji.remove();
        
    });
}



document.getElementById("try").addEventListener("click", () => {
    button.play();
})


function tryagain () {
     
    
    const endgrid = document.getElementById("endgrid");
    endgrid.classList.add("hidden", "opacity-0", "scale-90");
    endgrid.classList.remove("opacity-100", "scale-100");

    clearInterval(gameend);
    clearInterval(timerinterval);
    
    score = 0;
    timeleft = 60;

    document.getElementById("count").textContent = score;
    document.getElementById("timer").textContent = timeleft;



    startgame();
    document.getElementById("endgrid").classList.add("hidden");
    document.getElementById("scorebg").classList.add("hidden");

    

    
};




function exit() {
    button.play();
    setTimeout(() => {
        location.reload();
    }, 150);
}
