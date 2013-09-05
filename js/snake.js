/* Constants */
var gameSpeed = 100; // the game state is updated every this value ms
var snakeInitLength = 5; // initial size of the snake
var cellSize = 25; // the size of the cells is fixed. We adapt the size of the board


/* Global variables */
var canvas;
var context;
var score;
var best_score = 0;
var game_over;
var snake;
var frog;
var mongoose;
var dir;
var ateAFrog;
var ateAMongoose;


function init() {
    canvas = document.getElementById('canvas');
    context = canvas.getContext('2d');
    score = 0;
    game_over = false;
    snake = createSnake();
    frog = createEntity();
    mongoose = createEntity();
    dir = "right";
    ateAFrog = false;
    ateAMongoose = false;

    if (typeof game_loop != "undefined") clearInterval(game_loop);
    game_loop = setInterval(advanceGame, gameSpeed);
}

init();
canvas.addEventListener("click", getCursorPosition, false);
document.addEventListener("keydown", doKeyDown, false);


function createSnake() {
    s = [];
    for (var i=snakeInitLength-1; i>=0; i--) {
        s.push({x: i, y: 0});
    }

    return s;
}


function createEntity() {
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

    context.font = "20px Georgia";

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

    // draw the mongoose
    paintCell(mongoose.x, mongoose.y, cellSize, cellSize, "purple");

    // draw the score
    var score_text = "Score: " + score;
    context.fillStyle = "blue";
    context.fillText(score_text, 5, height-5);

    if (game_over) {
        var go_w = width/3;
        var go_h = height/3;
        context.fillStyle = "white";
        context.fillRect(go_w, go_h, go_w, go_h);
        context.strokeStyle = "red";
        context.strokeRect(go_w-3, go_h-3, go_w+6, go_h+6);
        context.strokeRect(go_w, go_h, go_w, go_h);
        
        var msg = "You Lose!";
        context.fillStyle = "red";
        context.fillText(msg, go_w+go_w/2-context.measureText(msg).width/2, go_h+go_h/3);

        best_score = Math.max(score, best_score);
        msg = "Your score: " + score + ", best score:" + best_score;
        context.fillStyle = "blue";
        context.fillText(msg, go_w+go_w/2-context.measureText(msg).width/2, go_h+2*go_h/3);
    }
}


function paintCell(x, y, w, h, c) {
    context.fillStyle = c;
    context.fillRect(x*w, y*h, w, h);
    context.strokeStyle = "white";
    context.strokeRect(x*w, y*h, w, h);
}

function snakeEatsItself() {
    for (var i = 1; i < snake.length; i++) {
        if (snake[0].x == snake[i].x && snake[0].y == snake[i].y) {
            return true;
        }
    }
    return false;
}


function advanceGame() {
    if (game_over) {
        return;
    }

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
    if (nx < 0 || nx >= boardWidth || ny < 0 || ny >= boardHeight || snakeEatsItself() || ateAMongoose) {
        if (!game_over) {
            game_over = true;
            drawStuff();
            setTimeout(function() {
                init();
            }, 3000);
        }
        return;
    }

    //increase the size of the snake and create a new frog if needed
    if (snake[0].x == frog.x && snake[0].y == frog.y) {
        ateAFrog = true;
        score++;
        frog = createEntity();
        mongoose = createEntity();
    } else {
        ateAFrog = false;
    }

    if (snake[0].x == mongoose.x && snake[0].y == mongoose.y) {
        ateAMongoose = true;
        frog = createEntity();
        mongoose = createEntity();
    }

    drawStuff();
}


/* From http://answers.oreilly.com/topic/1929-how-to-use-the-canvas-and-draw-elements-in-html5/ */
function getCursorPosition(e) {
    var x;
    var y;

    if (game_over) {
        return;
    }

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

function doKeyDown(e) {
    if (game_over) {
        return;
    }

    if (e.keyCode == 38 && dir != "down") { // up arrow
        dir = "up";
    } else if (e.keyCode == 37 && dir != "right") { // left arrow
        dir = "left";
    } else if (e.keyCode == 40 && dir != "up") { // down arrow
        dir = "down";
    } else if (e.keyCode == 39 && dir != "left") { // right arrow
        dir = "right";
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

