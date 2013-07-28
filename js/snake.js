/* Constants */
var gameSpeed = 100; // the game state is updated every this value ms
var snakeInitLength = 5; // initial size of the snake
var cellSize = 25; // the size of the cells is fixed. We adapt the size of the board


/* Global variables */
var canvas;
var context;
var score;
var snake;
var frog;
var dir;
var ateAFrog;


function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    score = 0;
    snake = createSnake();
    frog = createFrog();
    dir = "right";
    ateAFrog = false;

    if (typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(advanceGame, gameSpeed);
}

init();
canvas.addEventListener("click", getCursorPosition, false);


function createSnake() {
    s = [];
    for (var i=snakeInitLength-1; i>=0; i--) {
        s.push({x: i, y: 0});
    }

    return s;
}


function createFrog() {
    var boardWidth = canvas.width / cellSize;
    var boardHeight = canvas.height / cellSize;

    return {
        x: Math.floor(Math.random()*boardWidth), 
        y: Math.floor(Math.random()*boardHeight), 
    };
}


function drawStuff() {
    var width = canvas.width;
    var height = canvas.height;

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);

    // draw the snake
    paintCell(snake[0].x, snake[0].y, cellSize, cellSize, "red");
    for(var i = 1; i < snake.length; i++)
    {
        paintCell(snake[i].x, snake[i].y, cellSize, cellSize, "#fdc77b");
    }

    // draw the frog
    paintCell(frog.x, frog.y, cellSize, cellSize, "green");

    // draw the score
    var score_text = "Score: " + score;
    context.fillStyle = "blue";
    context.fillText(score_text, 5, height-5);
}


function paintCell(x, y, w, h, c) {
    context.fillStyle = c;
    context.fillRect(x*w, y*h, w, h);
    context.strokeStyle = "white";
    context.strokeRect(x*w, y*h, w, h);
}


function advanceGame() {
    //advance the snake
    var nx = snake[0].x;
    var ny = snake[0].y;
    if (dir == "right") nx++;
    else if (dir == "left") nx--;
    else if (dir == "up") ny--;
    else if (dir == "down") ny++;

    if (!ateAFrog) {
        snake.pop();
    }
    var newHead = {x: 0, y: 0};
    newHead.x = nx;
    newHead.y = ny;
    snake.unshift(newHead);

    //check lose condition: hit an edge or eat itself
    var boardWidth = canvas.width / cellSize;
    var boardHeight = canvas.height / cellSize;
    if (nx < 0 || nx >= boardWidth || ny < 0 || ny >= boardHeight || (snake[0].x == snake[snake.length-1].x && snake[0].y == snake[snake.length-1].y)) {
        //We should print a big message saying "you loose!"
        //TODO
        init();
        return;
    }

    //increase the size of the snake and create a new frog if needed
    if (snake[0].x == frog.x && snake[0].y == frog.y) {
        ateAFrog = true;
        score++;
        frog = createFrog();
    } else {
        ateAFrog = false;
    }

    drawStuff();
}


/* From http://answers.oreilly.com/topic/1929-how-to-use-the-canvas-and-draw-elements-in-html5/ */
function getCursorPosition(e) {
    var x;
    var y;
    if (e.pageX || e.pageY) {
        x = e.pageX;
        y = e.pageY;
    }
    else {
        x = e.clientX + document.body.scrollLeft +
            document.documentElement.scrollLeft;
        y = e.clientY + document.body.scrollTop +
            document.documentElement.scrollTop;
    }
    x -= canvas.offsetLeft;
    y -= canvas.offsetTop;

    // we consider the head of the snake to be the point at the center of the head on the screen
    var nx = (snake[0].x+0.5)*cellSize; 
    var ny = (snake[0].y+0.5)*cellSize; 
    var dx = x - nx;
    var dy = y - ny;

    if (dir == "up" || dir == "down") {
        if (dx < 0) dir = "left";
        else dir = "right";
    } else {
        if (dy > 0) dir = "down";
        else dir = "up";
    }
}


// resize the canvas to fill browser window dynamically
(function() {
    window.addEventListener('resize', resizeCanvas, false);

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        drawStuff(); 
    }
    resizeCanvas();
})();

