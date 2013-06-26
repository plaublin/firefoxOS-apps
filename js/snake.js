/* Constants */
var gameSpeed = 100; // the game state is updated every this value ms
var snakeInitLength = 5; // initial size of the snake
var boardWidth = 50;  // the size of the board is fixed. We adapt
var boardHeight = 30; // the size of the cells when drawing it.


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
    return {
        x: Math.round(Math.random()*boardWidth), 
        y: Math.round(Math.random()*boardHeight), 
    };
}


function drawStuff() {
    var width = canvas.width;
    var height = canvas.height;
    var w = width / boardWidth; // cell width. Depends on the screen size
    var h = height / boardHeight; // cell height. Depends on the screen size

    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);
    context.strokeStyle = "black";
    context.strokeRect(0, 0, width, height);

    // draw the snake
    paintCell(snake[0].x, snake[0].y, w, h, "red");
    for(var i = 1; i < snake.length; i++)
    {
        paintCell(snake[i].x, snake[i].y, w, h, "#fdc77b");
    }

    // draw the frog
    paintCell(frog.x, frog.y, w, h, "green");

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
    console.log("Snake.length="+snake.length);

    //check lose condition: hit an edge or eat itself
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
        console.log("I ate a frog");
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

    // size of the canvas
    var width = canvas.width;
    var height = canvas.height;
    var w = width / boardWidth; // cell width. Depends on the screen size
    var h = height / boardHeight; // cell height. Depends on the screen size

    // we consider the head of the snake to be the point at the center of the head on the screen
    var nx = (snake[0].x+0.5)*w; 
    var ny = (snake[0].y+0.5)*h; 
    var dx = x - nx;
    var dy = y - ny;
    console.log("n=("+nx+", "+ny+"), c=("+x+", "+y+"), d=("+dx+", "+dy+")");

    if (dir == "up" || dir == "down") {
        if (dx < 0) dir = "left";
        else dir = "right";
    } else {
        if (dy > 0) dir = "down";
        else dir = "up";
    }

/*
    if (dx >= 0 && dy >= 0) {
        if (dx >= dy) {
            dir2 = "right";
        } else {
            dir2 = "down";
        }
    } else if (dx >=0 && dy < 0) {
        if (dx >= -dy) {
            dir2 = "right";
        } else {
            dir2 = "up";
        }
    } else if (dx < 0 && dy <= 0) {
        if (-dx >= dy) {
            dir2 = "left";
        } else {
            dir2 = "down";
        }
    } else if (dx < 0 && dy < 0) {
        if (-dx >= -dy) {
            dir2 = "left";
        } else {
            dir2 = "up";
        }
    }

    //FIXME Problem with this method: if there is less space on one side (e.g., above < below), then we cannot move in this direction (e.g., we cannot go up).

    // check if the movement is possible
    if (dir2 == "top" && snake[1].y >= snake[0].y) dir = dir2; 
    else if (dir2 == "down" && snake[1].y <= snake[0].y) dir = dir2; 
    else if (dir2 == "left" && snake[1].x >= snake[0].x) dir = dir2; 
    else if (dir2 == "right" && snake[1].x <= snake[0].x) dir = dir2; 

    console.log("dir2=" + dir2 + ", dir=" + dir);
*/
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

