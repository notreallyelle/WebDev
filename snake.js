
let canvas;
let context;
let height;
let width;

let interval_id;
let coin = {};
let counter = [];

let player = {
    x : 150,
    y : 150,
    size : 20,
    direction : "",
    delay : counter.length,
    nextMove : "",
};

let scale;
counter.push(player)
let moveRight = false;
let moveUp = false;
let moveDown = false;
let moveLeft = false;

let points = 0;

document.addEventListener('DOMContentLoaded', init, false);

function init(){
    canvas = document.querySelector('canvas');
    context = canvas.getContext('2d');
    width = canvas.width;
    height = canvas.height;
    coin = {
        x : getRandomNumber(0, width),
        y : getRandomNumber(0, height),
        size : 15,
    };

    window.addEventListener('keydown', activate, false);

    interval_id = window.setInterval(draw, 33);
}

function updateScore(pts){
    points += pts;
    let score = document.querySelector("#points")
    
    score.innerHTML = `Points: ${points}`;
}

function activate(event){
    let keyCode = event.keyCode;
    if (keyCode === 38 && moveDown === false) {
        player.direction = "up"

        moveRight = false;
        moveUp = true;
        moveDown = false;
        moveLeft = false;
    }

    if (keyCode === 39 && moveLeft === false) {
        player.direction = "right"

        moveUp = false;
        moveDown = false;
        moveRight = true;
        moveLeft = false;
    }

    if (keyCode === 40 && moveUp === false) {
        player.direction = "down"

        moveDown = true;
        moveUp = false;
        moveRight = false;
        moveLeft = false;
    }

    if (keyCode === 37 && moveRight === false) {
        player.direction = "left"

        moveUp = false;
        moveRight = false;
        moveLeft = true;
        moveDown = false;
    }

}

function getRandomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomHex() {
  return '#'+(Math.random()*0xFFFFFF<<0).toString(16);
};

function edges() {
    if (player.x < 0) {
      stop();
      context.clearRect(0, 0, width, height);
      context.font = "50px Arial";
      context.textAlign = "center";
      context.fillStyle = "white"
      context.fillText("GAME OVER!", canvas.width/2, canvas.height/2);
      return;
    }
    if (player.x + player.size > width) {
      stop();
      context.clearRect(0, 0, width, height);
      context.font = "50px Arial";
      context.textAlign = "center";
      context.fillStyle = "white"
      context.fillText("GAME OVER!", canvas.width/2, canvas.height/2);
      return;
    }
    if (player.y < 0) {
      stop();
      context.clearRect(0, 0, width, height);
      context.font = "50px Arial";
      context.textAlign = "center";
      context.fillStyle = "white"
      context.fillText("GAME OVER!", canvas.width/2, canvas.height/2);
      return;
    }
    if (player.y + player.size > height) {
      stop();
      context.clearRect(0, 0, width, height);
      context.font = "50px Arial";
      context.textAlign = "center";
      context.fillStyle = "white"
      context.fillText("GAME OVER!", canvas.width/2, canvas.height/2);
      return;
    }
}


function draw() {
  context.clearRect(0, 0, width, height);
  context.fillStyle = getRandomHex();
  context.fillRect(coin.x, coin.y, coin.size, coin.size);

  edges()

  for (let s of counter) {
    if (counter.indexOf(s) !== 0){
      if (finder(s)) {
        stop();
        context.clearRect(0, 0, width, height);
        context.font = "50px Arial";
        context.textAlign = "center";
        context.fillStyle = "white"
        context.fillText("GAME OVER!", canvas.width/2, canvas.height/2);
        return;
      }
    }
  }

  if (collider(coin)) {

    coin.x = getRandomNumber(0, width);
    coin.y = getRandomNumber(0, height);

    updateScore(1)
    context.fillRect(player.x, player.y, player.size, player.size);
    scale = {
      x : player.x,
      y : player.y,
      size : player.size,
      direction : player.direction,
      delay : counter.length - 1,
      nextMove : "",
    }
    counter.push(scale)
  }

  context.fillStyle ='white';

  for (let scale of counter) {
    if (scale.delay === 0) {
      context.fillRect(scale.x, scale.y, scale.size, scale.size);

    if (counter.indexOf(scale) !== 0) {

      scale.direction = scale.nextMove;
      scale.nextMove = counter[counter.indexOf(scale) - 1].direction;
      }

    if (scale.direction === "left") {
    scale.x = scale.x - 10;
    }   

    if (scale.direction === "up") {
      scale.y = scale.y - 10;
      }

    if (scale.direction === "right") {
    scale.x = scale.x + 10;
    }

    if (scale.direction === "down") {
      scale.y = scale.y + 10;
      }


    }
  else {
    scale.delay -= 1
    }
  }
}

function collider(coin) {
    if (player.x + player.size < coin.x || coin.x + coin.size < player.x || player.y > coin.y + coin.size || coin.y > player.y + player.size) {
        return false;
    } else {
        return true;
    }
}

function finder(s) {
  if (counter[0].x === s.x && counter[0].y === s.y) {
    return true;
  } else {
      return false;
  }
}

function stop() {
    clearInterval(interval_id);
    window.removeEventListener('keydown', activate);
}
