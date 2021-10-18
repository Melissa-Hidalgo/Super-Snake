// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', SetupCanvas);
let gameOver = false;

let running = false;
let AnimationId;

let cirSpeed = 5;
let cirX = 1;
let cirY = 1;

var message;
var laVenenosa;
var t1;
var timeBox;
var scoreBox;
var vitamina;
var dashboard;
var gameTitle;

var today = new Date();
var clock = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();


//used to monitor wheter paddles and ball are
// moving and in what direction

let DIRECTION = {
    STOPPED: 0,
    UP: 1,
    DOWN: 2,
    LEFT: 3,
    RIGHT:4
};


function SetupCanvas() {

// Reference to the canvas element
canvas = document.querySelector("canvas");

// Context provides functions used for drawing and 
// working with Canvas
ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

document.addEventListener('keydown', MovePlayerPaddle);

// trigger Animation
//AnimationId = requestAnimationFrame(gameLoop);
gameOver = false;
// console.log("yo termine SetupCanvas");


dashboard = new MessangeBox(0, 0, innerWidth, 70, 'Pink', 'black', '40px Courier', "");
dashboard.draw();

laVenenosa = new Snake( innerWidth/2, innerHeight/2, 0,'green');
laVenenosa.grow(20);
laVenenosa.draw();

timeBox = new MessangeBox (innerWidth - 130, 28, 80, 32, 'white', 'black', "15px Courier", clock);
timeBox.draw();

vitamina = new Vitamin(100, 100,'orange');
vitamina.draw();

scoreBox = new MessangeBox(innerWidth/2, 25, 170, 35, 'white', 'black', '35px Courier', "Score: 0");
scoreBox.draw();

gameTitle = new MessangeBox(10, 20, 150, 40, 'white', 'black', '40px Courier', "Snake");
gameTitle.draw(); 

}
class Vitamin{


    constructor(x, y, color){

        this.x = x;
        this.y = y;

        this.color = color;

    }
    draw(){

        ctx.save();

        // creating circles
        ctx.beginPath();
        ctx.arc(this.x, this.y, 10, 0, 2 * Math.PI);
        ctx.stroke();
        ctx.fillStyle = this.color;
        ctx.fill();

        ctx.restore();
    }
}      

class Tile{

    constructor(x, y, color, decoration){

        this.x = x;
        this.y = y;
        this.color  = color;
        this.decoration = decoration;
        this.previousX = 0;
        this.previousY = 0;
     
       
        // Defines how quickly paddles can be moved
        this.Velocity = 5;
    }
        draw(){

            ctx.save();

           //creating rectangle
            ctx.beginPath();
            ctx.rect(this.x, this.y, 20, 20);
            ctx.stroke();
            ctx.fillStyle = this.color;
            ctx.fill();

            ctx.font="20px Arial";
            ctx.textAlign = "center";
            ctx.fillStyle = "black";
            ctx.fillText(this.decoration, this.x + 10, this.y + 17);

            ctx.restore();

        }
        update(posX, posY){

        }
        move(posX, posY){

        }

}
class Snake {

    constructor(x, y, tamano, color){

        this.color  = color;
    
        this.x = x;
        this.y = y;

        //Defines movement direction of paddles
        this.move = DIRECTION.STOPPED;

        // Defines how quickly paddles can be moved
        this.Velocity = 5;

        this.body = [];
    }

    draw(){

        ctx.save();

        // Snake's head
        ctx.rect(this.x, this.y, 20, 20);
        ctx.stroke()

        //Draw the snake's body
        for (let index = 0; index < this.body.length; index++) {
            const element = this.body[index];
            element.draw();   
        }
        ctx.restore();

    }
    update(posX, posY){
        this.x += posX;
        this.y += posY;
    }
    move(posX, posY){
        this.x += posX;
        this.y += posY;
    }
    grow(numeroDeTiles){

        var PosX = this.x + 20;

        for (let index = 0; index < numeroDeTiles; index++) {
            PosX -= 23;
            var t1 = new Tile(PosX, this.y, generateRandomColor(), index);
            this.body.push(t1);
        }
      
    }
}
class MessangeBox {

    constructor(x, y, wWith, wHeight, bgColor, foreColor, font, message){

        this.x = x;
        this.y = y;

        this.wWith = wWith;
        this.wHeight = wHeight;

        this.bgColor = bgColor;
        this.foreColor = foreColor;
        this.font = font;

        this.message = message;

        let messaPosX = x+50;
        let messaPosY = y+100;

    }   
    draw(){
            
        ctx.save();

        // creating rectangle
        ctx.beginPath();
        ctx.rect(this.x, this.y, this.wWith , this.wHeight);
        ctx.stroke();
        ctx.fillStyle = this.bgColor;
        ctx.fill();

        ctx.font =  this.font;
        ctx.textAlign = "center";
        ctx.fillStyle = this.foreColor;

        ctx.fillText(this.message, this.x + (this.wWith*0.5), this.y + (this.wHeight*0.7));

        ctx.restore();

    }
}

function gameLoop() {

    console.log("yo llegue gameLoop")
    if(gameOver==false){

        AnimationId = requestAnimationFrame(gameLoop);
        update();
        paint();

    } else {
        
        message = new MessangeBox(innerWidth/4, innerHeight/4, 300, 150, 'red', 'black','40px Courier', 'Game Over!');
        message.draw();
    
        // // Finish the game
        cancelAnimationFrame(AnimationId)
        // ctx.font="30px Arial";
        // ctx.textAlign = "center";
        // ctx.fillStyle = "red";
        // ctx.fillText("Game Over!!!", canvas.width/2, canvas.height/2 );
    }

}
function paint(){

    // for (let index = 0; index < innerWidth; index += 50) {
    // {
            // Clear the canvas
            ctx.clearRect(0,0, canvas.width, canvas.height);
            laVenenosa.draw();
            timeBox.draw();
            vitamina.draw();
          
            // // Draw canvas background
            // ctx.fillStyle = 'rgb(0, 0, 0, 0.3)';
            // ctx.fillRect(0,0, canvas.width, canvas.height)

            // // creating circles
            // ctx.beginPath();
            // ctx.fillStyle = 'white';
            // ctx.arc(cirX, cirY, 40, 0, 2 * Math.PI);
            // ctx.stroke();
            // ctx.fillStyle = "green";
            // ctx.fill();
            // console.log( "x:" + index + "y" + index); 
            // console.log( "width:" + innerWidth + "Height" + innerHeight); 

        //     // creating rectangle
        //     ctx.beginPath();
        //     ctx.rect(innerWidth-index, index, 200, 100);
        //     ctx.stroke();
        //     ctx.fillStyle = "red";
        //     ctx.fill();

        //     //console.log( "width:" + innerWidth + "Height" + innerHeight);
            

        //     ctx.font="60px time new roma";
        //     ctx.fillStyle = "yellow";
        //     ctx.textAlign = "center";
        //     ctx.fillText("Melissa", canvas.width/2, index);
        // }
        // // gameOver = true;
    // }
    
    // if (gameOver) {  
    //     console.log("gameOver: " + gameOver);  
    //     cancelAnimationFrame(AnimationId);
    // }
}
function update() {

    cirX += cirSpeed;
    cirY += cirSpeed;

    //enemigos off the screen?
    if (cirX > canvas.height) {
        cirSpeed = cirSpeed * -1;
    } else if (cirX < 0) {
        cirSpeed = cirSpeed * -1;
    }
}
function MovePlayerPaddle(key) {  
    
    if (running === false){
        running = true;
        AnimationId = window.requestAnimationFrame(gameLoop);
    }

    // handle scape as game over
    if(key.keyCode === 27) gameOver = true;

    // Handle space bar for PAUSE
    if(key.keyCode === 32) {
        running = false;
    }

    // Handle up arrow and w input
    if(key.keyCode === 38 || key.keyCode === 87){
        laVenenosa.update(0, -10)
        laVenenosa.move = DIRECTION.UP;
    }
    
    // Handle down arrow and s input
    if(key.keyCode === 40 || key.keyCode === 83) {
        laVenenosa.update (0, 10) 
        laVenenosa.move = DIRECTION.DOWN;
    }
    // Handle left arrow and a input
    if(key.keyCode === 37 || key.keyCode === 65) {
        laVenenosa.update (-10, 0) 
        laVenenosa.move = DIRECTION.LEFT;
    }
    
    // Handle right arrow and d input
    if(key.keyCode === 39 || key.keyCode === 68) {
        laVenenosa.update (10, 0) 
        laVenenosa.move = DIRECTION.RIGHT;
    }

    update();
}
function generateRandomColor()
{
    var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
    //random color will be freshly served
}
