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

    const emojipool = ['target.png','target.png','target.png','target.png','target.png',
  'target.png','target.png','target.png','target.png','target.png',
  'target.png','target.png','target.png','target.png','target.png',
  'target.png','target.png','target.png','target.png','target.png','target.png','target.png','target.png','target.png','target.png','target.png',

 
  'plus2.png','plus2.png','plus2.png','plus2.png','plus2.png','plus2.png','plus2.png','plus2.png','plus2.png','plus2.png',

  
  'plus5.png','plus5.png',

  'timeslow.png',

  
  'purple.png','purple.png','purple.png','alien.png','hanal.png','hanar.png',
  'junka.png','junkm.png','oldl.png','punk.png','purple.png','alien.png','hanal.png','hanar.png',
  'junka.png','junkm.png','oldl.png','punk.png'];

    const targetemo = ['target.png'];
    const plustwo = ['plus2.png'];
    const plusfive = ['plus5.png'];
    const timeslow = ['timeslow.png']

    // const targetemoclick = new Audio('sounds/targetemo.mp3');
    const wrongemo = new Audio('sounds/wronge.mp3');
    const timeover = new Audio('sounds/timeover.mp3');
    const yo = new Audio('sounds/yo.wav');
    const bg = new Audio('sounds/bg.mp3');
    const button = new Audio('sounds/buttonclick.wav');


  function toggleInstructions() {
  const dropdown = document.getElementById('instructions');
  button.play()
  if (dropdown.classList.contains('hidden')) {
    dropdown.classList.remove('hidden');
  } else {
    dropdown.classList.add('hidden');
  }

  document.addEventListener('click', (e) => {
  if (!dropdown.contains(e.target) && e.target !== howtoplay) {
    dropdown.classList.add('hidden');

  }
}
  )
};




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
    let  givestwopoints = false;

    const emojidiv = document.createElement('div');
    emojidiv.className = "drop-shadow-lg hover:drop-shadow-2xl text-7xl absolute emoji animate-bounce hover:brightness-130 hover:scale-110 duration-400 transition-all ";

    const img = document.createElement('img');
    img.src = `emojis/${selectedemoji}`;
    img.alt = selectedemoji;
    img.className = "lg:w-27 lg:h-27 w-21 h-21 object-contain pointer-events-none rounded-full"; // 64px if tailwind config = default
    img.style.imageRendering = "pixelated";

    emojidiv.appendChild(img);

     const directions = [
  'hover:translate-x-[100%]',    
  'hover:-translate-x-[100%]',   
  'hover:translate-y-[100%]',    
  'hover:-translate-y-[100%]',   
  'hover:translate-x-[100%] hover:-translate-y-[100%]',
  'hover:-translate-x-[100%] hover:-translate-y-[100%]',
]; 


    if(istargetdecoy && Math.random() < 0.3){
    console.log("Decoy created:", selectedemoji);
    isdecoy = true;
    emojidiv.dataset.decoy = true;
    };

    if(selectedemoji === plustwo[0] && Math.random() < 0.3){
    givestwopoints = true;
    };

    if(givestwopoints) {
    emojidiv.classList.add(
    'decoy',
    'cursor-not-allowed',
    'opacity-90',
    directions[Math.floor(Math.random() * directions.length)]
  );
  emojidiv.dataset.decoy = true;
  emojidiv.addEventListener("mouseenter", () => {yo.play()})
 }


   
   if (isdecoy) {
  emojidiv.classList.add(
    'decoy',
    'cursor-not-allowed',
    'opacity-70',
    directions[Math.floor(Math.random() * directions.length)]
  );
  emojidiv.addEventListener("mouseenter", () => {yo.play()})
};

    const gamescreen = document.getElementById("game-screen");
    const bounds = gamescreen.getBoundingClientRect();
    const timer = document.getElementById("timer").getBoundingClientRect();
    const counter = document.getElementById("count").getBoundingClientRect();
    const exitinplay = document.getElementById("exitbutton").getBoundingClientRect();

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
        const exitinplaybox = {
            top: exitinplay.top - bounds.top,
            bottom: exitinplay.bottom - bounds.top,
            left: exitinplay.left - bounds.left,
            right: exitinplay.right - bounds.left
        };
        

        
        if (
            !(emojiBox.right < timerBox.left ||
              emojiBox.left > timerBox.right ||
              emojiBox.bottom < timerBox.top ||
              emojiBox.top > timerBox.bottom)
        ) {
            isOverlapping = true;
        }

         if (
            !(emojiBox.right < exitinplaybox.left ||
              emojiBox.left > exitinplaybox.right ||
              emojiBox.bottom < exitinplaybox.top ||
              emojiBox.top > exitinplaybox.bottom)
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

    let scored = false;

    if (selectedemoji === targetemo[0] && !emojidiv.dataset.decoy ) {
            new Audio('sounds/targetemo.mp3').play();
            score++;
            document.getElementById("count").textContent = score;

            scored = true;    
        }
        else if (selectedemoji === plustwo[0]){
            score +=2;
            document.getElementById("count").textContent = score;
            new Audio('sounds/plus2.mp3').play();  
            scored = true;

        }
        else if (selectedemoji === plusfive[0]){
            score +=5;
            document.getElementById("count").textContent = score; 
            new Audio('sounds/plus5.mp3').play(); 
            scored = true;

        }
        else if(selectedemoji === timeslow[0]){

            timeleft += 5;
            document.getElementById("timer").textContent = timeleft;
            new Audio('sounds/time.mp3').play();
            

        }
        else {
            wrongemo.play();
            endgame();
            document.getElementById("timer").textContent = 0;
            // alert("Wrong emoji selected!");
        }
        emojidiv.remove();

        if(scored && score > highscore) {

         highscore = score;
        localStorage.setItem("highscore", highscore);
        document.getElementById("highscore").textContent = `Highest Score : ${highscore}`;

        }
    });
}




function startgame(){

document.getElementById("bg").classList.remove("hidden");
document.getElementById("bgintro").classList.add("hidden");
document.getElementById("header").classList.add("hidden");
// videobg.addEventListener("click", () => {videobg.play()});


exitduringplay =  document.getElementById("exitbutton")
exitduringplay.classList.remove("hidden")

document.getElementById("game-screen").classList.remove("bg-black");

bg.loop = true;
bg.volume = 0.8; // Optional: set volume
bg.play();
gameend = setInterval(spawnemoji,350);
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

function exitbutton() {

    exitbutton = document.getElementById("exitbutton")
    exitbutton.classList.add("hidden")
    endgame();
    wrongemo.play()
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


function buttonsound(){

    button.play();
}

