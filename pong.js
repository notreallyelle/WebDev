let canvas;
let context;
let height;
let width;

let interval_id;

let player;
let cpu;
let ball;
let ballspeed = 5;

let player1points = 0;
let player2points = 0;

let dx = 0;
let dy = 0;

let moveUp = false;
let moveDown = false;



document.addEventListener('DOMContentLoaded', init, false);

function init() {
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    
    player = {

        x: canvas.width - 10,
        y: canvas.height/2 - 100/2,
        width: 10,
        height: 100,
        direction : ""
    }

    cpu = {
        x: 0,
        y: canvas.height/2 - 100/2,
        width: 10,
        height: 100,
        direction : ""
    }
    
    ball = {
        x: canvas.width/2,
        y: canvas.height/2,
        width: 15,
        height: 15
    }


    window.addEventListener('keydown', activate, false);

    interval_id = window.setInterval(draw, 33); 
    
}

function updateScore1(pts){
    player1points += pts;
    let score = document.querySelector("#player1points")
        
    score.innerHTML = `Player 1: ${player1points}`;
}

function updateScore2(pts){
    player2points += pts;
    let score = document.querySelector("#player2points")
    score.innerHTML = `Player 2: ${player2points}`;

}

function activate(event){

    let keyCode = event.keyCode;
    if (keyCode === 38) {
        player.direction = "up"
        player.y = player.y - 30;
        moveUp = true;
        moveDown = false;
    }

    
    if (keyCode === 40) {
        player.direction = "down"
        player.y = player.y + 30;
        moveDown = true;
        moveUp = false;
    }

    if (keyCode === 87) {  // w key
        cpu.direction = "up"
        cpu.y = cpu.y - 30;
        moveUp = true;
        moveDown = false;
    }

    
    if (keyCode === 83) {  // s key
        cpu.direction = "down"
        cpu.y = cpu.y + 30;
        moveDown = true;
        moveUp = false;
    }

}

function draw(){
//draw player
    context.clearRect(0, 0, width, height);
    context.fillStyle = 'white';
    context.fillRect(player.x, player.y, player.width, player.height);

//draw cpu
    context.fillRect(cpu.x, cpu.y, cpu.width, cpu.height);
    context.fillStyle = 'white';

//draw ball
    context.fillRect(ball.x, ball.y, ball.width, ball.height);
    context.fillStyle = 'white';


    if (player.y >= canvas.height - player.height) {
        player.y = canvas.height - player.height;
    }
    else if (player.y <= 0) {
        player.y = 0;
    }

    if (cpu.y >= canvas.height - cpu.height) {
        cpu.y = canvas.height - cpu.height;
    }
    else if (cpu.y <= 0) {
        cpu.y = 0;
    }

    ball.x += ballspeed; //ball moves to player 1 at the beginning of the game (Speed 5)

    //ball hits the top/bottom of the canvas
    if (ball.y > 520) {
        ballspeed = ballspeed *-1;
    }

    else if (ball.y < 0) {
        ballspeed = ballspeed *-1;
    }
    //ball hits paddles
    if (collider(ball) === false) {
        ballspeed = ballspeed *-1.3;
    }

    //update score
    if (ball.x <= 0){
        ballspeed = 5;
        ball.x = canvas.width/2;
        ball.y = canvas.height/2;
        updateScore1(1);
    }
    if (ball.x >= 1200) {
        ballspeed = 5;
        ball.x = canvas.width/2;
        ball.y = canvas.height/2;
        updateScore2(1);
    }

    //winner
    if (player1points >= 10) {
        stop();
        context.clearRect(0, 0, width, height);
        context.font = "50px Arial";
        context.textAlign = "center";
        context.fillStyle = "white"
        context.fillText("Player 1 Wins!", canvas.width/2, canvas.height/2);
        return;
    }
    
    if (player2points >= 10) {
        stop();
        context.clearRect(0, 0, width, height);
        context.font = "50px Arial";
        context.textAlign = "center";
        context.fillStyle = "white"
        context.fillText("Player 2 Wins!", canvas.width/2, canvas.height/2);
        return;
    }

}



function collider(ball) {
    ball.size = ball.height * ball.width
    player.size = player.height * player.width;
    cpu.size = cpu.height * cpu.width;

    if(ball.x + ball.width >= player.x && ball.x <= player.x + player.width && ball.y >= player.y && ball.y <= player.y + player.height ||
    ball.x + ball.width >= cpu.x && ball.x <= cpu.x + cpu.width && ball.y >= cpu.y && ball.y <= cpu.y + cpu.height){
        console.log(ball.x, ball.y);
        return false;}
    else {
        
        return true;
    }

}
function stop() {
    clearInterval(interval_id);
    window.removeEventListener('keydown', activate);
}