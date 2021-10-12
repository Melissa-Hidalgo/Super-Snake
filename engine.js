// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', SetupCanvas);
let gameOver;
let AnimationId;

function SetupCanvas() {

// Reference to the canvas element
canvas = document.querySelector("canvas");

// Context provides functions used for drawing and 
// working with Canvas
ctx = canvas.getContext('2d');

canvas.width = innerWidth;
canvas.height = innerHeight;

// trigger Animation
AnimationId = requestAnimationFrame(paint);
gameOver = false;

}
function paint(){

    for (let index = 0; index < innerWidth; index += 100) {
        // creating enemies
  {

            // creating circles
            ctx.beginPath();
            ctx.fillStyle = 'white';
            ctx.arc(index, index, 40, 0, 2 * Math.PI);
            ctx.stroke();
            console.log( "x:" + index + "y" + index); 
            console.log( "width:" + innerWidth + "Height" + innerHeight); 

            // creating rectangle
            ctx.beginPath();
            ctx.rect(innerWidth-index, index, 20, 20);
            ctx.stroke();
            console.log( "width:" + innerWidth + "Height" + innerHeight);
            

            ctx.font="60px time new roma";
            ctx.fillStyle = "yellow";
            ctx.textAlign = "center";
            ctx.fillText("Melissa", canvas.width/2, index);
        }
        gameOver = true;
    }
    
    if (gameOver) {  
        console.log("gameOver: " + gameOver);  
        cancelAnimationFrame(AnimationId);
    }
}
