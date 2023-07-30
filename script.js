// canvas setup
const canvas = document.getElementById('canvas1');
const ctx = canvas.getContext('2d');
canvas.width = 800;
canvas.height = 500;

let score = 0;
let gameFrame = 0;
ctx.font = '40px Georgia';
let gameSpeed = 1;
let gameOver = false;
let gameStarted = false;
let diffLevel = "1";

// mouse interactivity
let canvasPosition = canvas.getBoundingClientRect();
const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}
canvas.addEventListener('mousedown', function (event) {
    mouse.click = true;
    mouse.x = event.x - canvasPosition.left;
    mouse.y = event.y - canvasPosition.top;
})
canvas.addEventListener('mouseup', function () {
    mouse.click = false;
})

//player
const playerImage = new Image();
playerImage.src = 'Images/pimon_flying.png';

class Player {
    constructor() {
        this.x = canvas.width;
        this.y = canvas.height;
        this.radious = 50;
        this.angle = 0;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 1985/5;
        this.spriteHeight = 2325/5;
    }
    draw() {
        //detect mouse and player move direction and visibility

        // if (mouse.click) {
        //     ctx.lineWidth = 0.2;
        //     ctx.beginPath();
        //     ctx.moveTo(this.x, this.y);
        //     ctx.lineTo(mouse.x, mouse.y);
        //     ctx.stroke();
        // }

        // player collision area visibility

        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radious, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.fillRect(this.x, this.y, this.radious, 10);

        ctx.drawImage(playerImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 60, this.y - 70, this.spriteWidth / 3, this.spriteHeight / 3);
    }
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        this.angle = Math.atan2(dy, dx);
        if (mouse.x !== this.x) {
            this.x -= dx / 15;
        }
        if (mouse.y !== this.y) {
            this.y -= dy / 15;
        }
        if (gameFrame % 5 === 0){
            this.frame++;
            if (this.frame >= 25) this.frame = 0;
            if (this.frame === 4 || this.frame === 9 || this.frame === 14 || this.frame === 19 || this.frame === 24){
                this.frameX = 0;
            } else {
                this.frameX++;
            }
            if ( this.frame < 4) this.frameY = 0;
            else if ( this.frame < 9) this.frameY = 1;
            else if ( this.frame < 14) this.frameY = 2;
            else if ( this.frame < 19) this.frameY = 3;
            else if ( this.frame < 24) this.frameY = 4;
            else this.frameY = 0;
        }
       // console.log( "sprite frame : " + this.frame + " FrameX : " + this.frameX + " FrameY : " + this.frameY + " game frame : "+ gameFrame);
    }

}

const player = new Player();

//souls
const soulArray = [];
const soulImage = new Image();
soulImage.src = 'Images/goodSoul.png';
class Soul {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.radius = 50;
        this.y = canvas.height + this.radius * 2;
        this.speed = Math.random() * 5 + 1;
        this.distance = 0;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 1000/4;
        this.spriteHeight = 250;
        this.counted = false;
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2';
    }
    draw() {
        // soul collision area visibility
        // ctx.fillStyle = 'blue';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        // ctx.closePath();
        // ctx.stroke();
        ctx.drawImage(soulImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 60, this.y - 60, this.spriteWidth / 2, this.spriteHeight / 2);
    }
    update() {
        this.y -= this.speed;
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        this.distance = Math.sqrt(dx * dx + dy * dy);

        if (gameFrame % 10 === 0){
            this.frame++;
            if (this.frame >= 3) this.frame = 0;
            if (this.frameX ===3){
                this.frameX = 0;
            }else {
                this.frameX++;
            }
            this.frameY = 0;
        }
    }


}

const soulPop1 = document.createElement('audio');
soulPop1.src = 'sounds/Rise01.wav';
const soulPop2 = document.createElement('audio');
soulPop2.src = 'sounds/Rise02.wav';

function handleSouls() {
    if (gameFrame % 50 === 0) {
        soulArray.push(new Soul());
    }
    for (let i = 0; i < soulArray.length; i++) {
        soulArray[i].update();
        soulArray[i].draw();
        if (soulArray[i].y < 0 - this.radius * 2) {
            soulArray.splice(i, 1);
            i--;
        } else if (soulArray[i].distance < soulArray[i].radius + player.radious) {
            if (!soulArray[i].counted) {
                if (soulArray[i].sound === 'sound1') {
                    soulPop1.play();
                } else {
                    soulPop2.play();
                }
                score++;
                soulArray[i].counted = true;
                soulArray.splice(i, 1);
                i--;
            }
        }
    }

}
//repeating backgrounds
const background = new Image();
background.src = 'Images/cloudBg1.png';

const BG = {
    x1 : 0,
    x2 : canvas.width,
    y : 0,
    width : canvas.width,
    height : canvas.height
}
function handleBackground() {
    BG.x1 -= gameSpeed;
    if(BG.x1 < -BG.width) BG.x1 = BG.width - 1;
    BG.x2 -= gameSpeed;
    if(BG.x2 < -BG.width) BG.x2 = BG.width - 1;
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height);
    ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height);
}
// Enemies
const enemyImage = new Image();
enemyImage.src = 'Images/enemy2.png';

class Enemy {
    constructor() {
        this.x = -200;
        this.y = Math.random() * (canvas.height -150) + 90;
        this.radius = 60;
        this.speed = Math.random() * 2 + 2;
        this.frame = 0;
        this.frameX = 0;
        this.frameY = 0;
        this.spriteWidth = 3724/6;
        this.spriteHeight = 744;
    }
    draw(){
        // enemy collision area visibility
        // ctx.fillStyle = 'red';
        // ctx.beginPath();
        // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        // ctx.fill();
        ctx.drawImage(enemyImage, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, this.x - 85, this.y - 100, this.spriteWidth/3.8, this.spriteHeight/3.8);
    }
    update(){
        this.x -= this.speed;
        if(this.x < 0 - this.radius){
            this.x = canvas.width + 200;
            this.y = Math.random() * (canvas.height - 150) + 90;
            this.speed = Math.random() * 2 + 2;
        }
        // animate sprite sheet for enemy1
        if (gameFrame % 5 === 0){
            this.frame++;
            if (this.frame >= 5) this.frame = 0;
            if (this.frameX ===5){
                this.frameX = 0;
            }else {
                this.frameX++;
            }
            this.frameY = 0;
        }
        // collision with player
        const dx = this.x - player.x;
        const dy = this.y - player.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < this.radius + player.radious){
            handleGameOver();
        }
    }
}
const enemy1 = new Enemy();
const enemy2 = new Enemy();
const enemy3 = new Enemy();

function handleEnemy() {
    if(diffLevel==="2"){
        enemy1.draw();
        enemy2.draw();
        enemy1.update();
        enemy2.update();
    }else if (diffLevel==="3"){
        enemy1.draw();
        enemy2.draw();
        enemy3.draw();
        enemy1.update();
        enemy2.update();
        enemy3.update();
    }else{
        enemy1.draw();
        enemy1.update();
    }
}

function handleGameOver() {
    ctx.fillStyle = 'white';
    ctx.fillText('Game Over, you reached score : ' + score, 110, 250);
    gameOver = true;
}
// Animation loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    handleBackground();
    player.update();
    player.draw();
    if(gameStarted) {
        handleSouls();
        handleEnemy();
    }
    ctx.fillStyle = 'white';
    ctx.fillText('score: ' + score, 10, 50);
    gameFrame++;
    if (!gameOver) requestAnimationFrame(animate);
}

animate();

window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect();
})

//start game
const startBtn = document.getElementById('startGame');
startBtn.addEventListener('click', function () {
    if(!gameStarted){
        gameStarted = true;
        gameFrame = 0;
        startBtn.innerText = "Restart";
    }else {
        window.location.reload();
    }
})

// toggle difficulties

const diffLevel1Btn = document.getElementById('dLevel1');
const diffLevel2Btn = document.getElementById('dLevel2');
const diffLevel3Btn = document.getElementById('dLevel3');

diffLevel1Btn.addEventListener('click' , function () {
    diffLevel = "1";
    diffLevel1Btn.classList.add('btn-info');
    if(diffLevel2Btn.classList.contains('btn-warning')){
        diffLevel2Btn.classList.remove('btn-warning');
    }
    if(diffLevel3Btn.classList.contains('btn-danger')){
        diffLevel3Btn.classList.remove('btn-danger');
    }
});
diffLevel2Btn.addEventListener('click' , function () {
    diffLevel = "2";
    diffLevel2Btn.classList.add('btn-warning');
    if(diffLevel1Btn.classList.contains('btn-info')){
        diffLevel1Btn.classList.remove('btn-info');
    }
    if(diffLevel3Btn.classList.contains('btn-danger')){
        diffLevel3Btn.classList.remove('btn-danger');
    }
});
diffLevel3Btn.addEventListener('click' , function () {
    diffLevel = "3";
    diffLevel3Btn.classList.add('btn-danger');
    if(diffLevel2Btn.classList.contains('btn-warning')){
        diffLevel2Btn.classList.remove('btn-warning');
    }
    if(diffLevel1Btn.classList.contains('btn-info')){
        diffLevel1Btn.classList.remove('btn-info');
    }
});

