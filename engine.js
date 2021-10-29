// Call for our function to execute when page is loaded
document.addEventListener('DOMContentLoaded', SetupCanvas);

// For testing 
let steppedGame = false;

let running = false;
let gameOver = false;
let gamePaused = false;

let score = 0;
let dashboardHeight = 80;
let AnimationId;

let cirSpeed = 0.000001;
let cirX = 1;
let cirY = 1;

// let message;
let oMessageBox;
let oSnake;
let t1;
let oTimeBox;
let oScoreBox;
let oVitamin;
let oDashboard;
let oGameTitle;

let stopwatch;

let oEat;
let oCrash;
let oGameOver;
let lives = 3;

let oGameSoundTrack;

let particles = []

let today = new Date();

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

    canvas.width =  680             //Math.floor(innerWidth * 0.50);
    canvas.height = 400          //Math.floor(innerHeight * 0.70);

    document.addEventListener('keydown', ProcessUserCommands);


    oSnake = new Snake( canvas.width/2, canvas.height/2, 0, 'white');
    oSnake.grow(1);

    oDashboard = new MessageBox(0, 0, canvas.width, 80, 'orange', 'black', '', "");

    oVitamin = new Vitamin(20,20);
    oVitamin.move();

    stopwatch = new Stopwatch("stopWatchDisplay");
    stopwatch.reset();

    oGameTitle = new NameOfGame (10,25, 160, 40, 'orange', 'white', 'bold 50px Courier', "Snake");
    oScoreBox = new MessageBox((canvas.width/2-50), 20, 100, 40, 'white', 'black', '15px Courier', "Score: " + score);
    oTimeBox = new MessageBox (canvas.width - 250, 20, 100, 40, 'white', 'black', "15px Courier", stopwatch.update());
    

    draw();

    oEat    = new SoundPlayer('beepSound1',"asset/crunch.6.ogg");
    oCrash = new SoundPlayer('beepSound2',"asset/gameover.mp3");
    oGameOver = new SoundPlayer('beepSound3',"asset/gameover1.mp3");
    oGameSoundTrack = new SoundPlayer('beepSound4',"asset/theme1.mp3");



}
class Vitamin{

    particles = [];

    constructor(x, y, color){

        this.x = x;
        this.y = y;

        this.width = 20;
        this.height = 20;
        

        this.color = color;

    }
    draw(){

            // particles
            this.particles.forEach((particle, particleIndex) => {

                if(particle.alpha <=0){
                    // after alpha hit < 0 the particle reappears on the screen.
                    //let's make sure that does not happen
                    this.particles.splice(particleIndex, 1);
                } else {
                    
                    particle.update();
                    particle.draw();
                }
            })
            
        // creating rectangle
        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = 'transparent';// TODO: make it transparent
        ctx.fillRect(this.x, this.y, 20, 20);
        ctx.fill();
        ctx.restore();
        
        this.#drawApple(this.x, this.y);
    }
    move(){

        this.x = Math.floor(Math.random() * canvas.width-40);
        this.y = Math.floor(Math.random() * canvas.height-40);

        console.log("x: " + this.x, "y: " + this.y)
        // ensure to discount the dashboard space or any off boundaries
        if(this.y < 60 || this.y > canvas.height) this.y = 80;
        if(this.x < 20 || this.x > canvas.width) this.x = 80;

    }
    splashIt(){

        //console.log("Boom - Enemy Splased!!!")
    
        for (let index = 0; index < 4 ; index++) {
            // particles.push(new Particle(target.x, target.y, 3, {x: Math.random()-0.5, y: Math.random()-0.5}, color))  
            // console.log('pase por aqui para crear particulas')
            let oParticula = new Particle(this.x, this.y, 3, {x: Math.random()*10-5, y: Math.random()*10-5}, 'red')
            // console.log(oParticula)
            this.particles.push(oParticula)    
        }
        // console.log(this.particles)
    }
    #drawApple(x, y){

        // Image implementation (both work with not error by the image does not show)
        const appleImg  = new Image();
        appleImg.src = './asset/sprite_0.png'
    
        var img = document.getElementById("source");
    
        // console.log(x + ", " + y) 
        //ctx.drawImage(appleImg, x, y);
        ctx.drawImage(appleImg, 1, 1, 104, 124, x-14, y-7, 80, 80);  
    }
}      
class Tile {

    constructor(x, y, velocity, color, letter, previousX, previousY){

        this.color = color;

        // position on canvas
        this.x = x;
        this.y = y;

        this.prevX = previousX;
        this.prevY = previousY;

        this.width = 20;
        this.height = 20;

        this.velocity = velocity;

        // Defines movement direction of snake
        this.move = DIRECTION.STOPPED;

        this.letter = letter;

        this.snapped = false;
    }
    draw(){

        ctx.save();
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        ctx.fill();

        ctx.fillStyle = 'rgba(0,0,255)';
        ctx.font = "10pt sans-serif";
        ctx.strokeText(this.letter, this.x+3, this.y+15);
        ctx.restore();
    }
    update(posX, posY){

        // console.log("Tile.update.enter-> " + this.prevX  + ", " + this.prevY + " / " + (this.x) + ", " + (this.y) + " / " + (posX) + ", " + (posY));

        // save my current postion & velocity
        this.prevX = this.x;
        this.prevY = this.y;

        // set my new postion
        this.x = posX;
        this.y = posY;
    }
}
class Snake {


    constructor(x, y, color){

        this.color = color;
        
        this.x = x;
        this.y = y;

        this.width = 20;
        this.height = 20;

        this.prevX = x-20;
        this.prevY = y;

        // defines movement direction of paddles
        this.move = DIRECTION.STOPPED;

        // defines how quickly tiles can be moved
        this.velocity = 20;
        this.cuerpo = [];

        this.bodySize = 0;
        
       // save head's positon for next tile
       let tilePosX = this.prevX;
       let tilePosY = this.prevY;


        // console.log("Snake.constructor.1");
        // console.log(this.snappedTiles)
    }
    draw(){

        ctx.save();

        // draw head
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x, this.y, this.width, this.height);

        // draw ojo
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x+12, this.y+5, 2, 0, Math.PI*2, false);
        ctx.fillStyle = 'Yellow';
        ctx.fill();
        ctx.strokeStyle = "black"
        ctx.stroke();
        ctx.closePath();
        ctx.restore();

        this.#drawLives();

        // console.log("contruct.draw.1");
        // console.log(this.snappedTiles)

        // draw individual tiles into body
        for (let index = 0; index < this.cuerpo.length; index++) {
            const currentTile = this.cuerpo[index];
            currentTile.draw();
        }
        ctx.restore();

        // console.log("contructdraw.2");
        // console.log(this.snappedTiles)
    }
    update(){

        // console.log("SetPreviousPos.enter");

        // save previous position
        this.prevX = this.x;
        this.prevY = this.y;

        // here it is where my next tile should be
        switch (this.move) {
            case DIRECTION.DOWN:
                this.y += this.velocity;
                break;
            case DIRECTION.UP:
                this.y -= this.velocity;
                break;        
            case DIRECTION.RIGHT:
                this.x += this.velocity;
                break;     
            case DIRECTION.LEFT:
                this.x -= this.velocity;
                break;
        }
        // console.log("update.updatePrevious.1");
        // console.log(this.snappedTiles)i
        
        // console.log("Snake Postions -> x: " + this.x + " y: " + this.y);
        // console.log("Snake Prev Postions -> x: " + this.prevX + " y: " + this.prevY);


        // save head's positon for next tile
        let tilePosX = this.prevX;
        let tilePosY = this.prevY;

        // draw individual tiles into body
        for (let index = 0; index < this.cuerpo.length; index++) {

            // console.log("Set tile new Postions to -> x: " + tilePosX + " y: " + tilePosY);
            
            const currentTile = this.cuerpo[index];
            currentTile.update(tilePosX, tilePosY);

            // set the positon for the next tile
            // console.log("Save tile prev Pos for next tile's new Pos -> x: " + currentTile.prevX + " y: " + currentTile.prevY);
            tilePosX = currentTile.prevX;
            tilePosY = currentTile.prevY;

        }
        // console.log("update.updatePrevious.2");
        // console.log(this.snappedTiles)
    }
    grow(numberOfTiles){

        let tilePosX = 0;
        let tilePosY = 0;   

        // if only head, follow it
        // console.log(this.snappedTiles);

        if (this.cuerpo.length == 0){
            tilePosX = this.prevX;
            tilePosY = this.prevY; 
            // console.log("follow head at: " + tilePosX + ", " + tilePosY);   
        } else {
            // if not, follow tail
            let tile = this.cuerpo[this.cuerpo.length-1];
            if (tile != undefined){
                tilePosX = tile.prevX;
                tilePosY = tile.prevY;      
                // console.log("follow tile at: " + tilePosX + ", " + tilePosY);   
            }
        }

        //console.log("grow h(x.y): " + this.x + ", " + this.y);
        //console.log("grow Prev(Posx.Posy): " + tilePosX + ", " + tilePosY);

        // adding default tiles to initial body
        for (let index = 0; index < numberOfTiles; index++) {
            // console.log("tile: " + index); 
            this.length +=1;
            this.cuerpo.push(new Tile(tilePosX, tilePosY, this.velocity, "rgb(3, 233, 0)","*", this.length, tilePosX-20, tilePosY))
            tilePosX -= 20; // TODO: Check if whether of not the head should always grow to the right???
            //tilePosY -= tilePosY;    // Y does not change for the initial setup       
        }
        this.bodySize += numberOfTiles;

    }
    crashWithBody(tile){
    
        let crash = false;
        // console.log('x: ' + this.x + ", " + this.y);
        if ((this.x == tile.x) && (this.y == tile.y)) crash = true;
        
        
        return crash;

    }
    crashWithOthers(otherObj){

        // console.log('crashWithOthers.enter');
        // console.log(this);
        // console.log(otherObj);
        // console.log('snake (x, y): ' + this.x + ", " + this.y);

        var myleft = this.x;
        var myright = this.x + (this.width);
        var mytop = this.y;
        var mybottom = this.y + (this.height);
        var otherleft = otherObj.x;
        var otherright = otherObj.x + (otherObj.width);
        var othertop = otherObj.y;
        var otherbottom = otherObj.y + (otherObj.height);
        var crash = true;

        if ((mybottom < othertop) ||
        (mytop > otherbottom) ||
        (myright < otherleft) ||
        (myleft > otherright)) {
            //console.log('crashWithOthers.crash: ' + crash);
            crash = false;
        }
        //console.log('crashWithOthers.crash: ' + crash);
        return crash;
    }
    resetPosition(){
        this.x = 300;
        this.y =  140;
    }
    #drawLives(x, y){

        let PosX = 525;

        for (let index = 0; index < lives; index++) {
            PosX += 30;
            const snakeImg  = new Image();
            snakeImg.src = './asset/snake-SWEN.png'
            ctx.drawImage(snakeImg, 1, 1, 32, 32, PosX, 25, 35, 35); 
        }  
    }  
}
class NameOfGame {

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

        ctx.beginPath();
        ctx.fillText("",this.x, this.y);
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
class MessageBox {

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

        ctx.fillText(this.message, this.x + (this.wWith/2), this.y + (this.wHeight*0.7));

        ctx.restore();

    }
    update(newMessage){
        if (newMessage != undefined) {
            this.message = newMessage;
        }

    }
}
class Particle {

    constructor(x, y, radius, velocity, color){

        this.radius = radius;
        this.color = color;

        this.x = x;
        this.y = y;

        this.velocity = velocity;
        this.alpha = 1;
    }
    draw(){
        ctx.save();
        canvas.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = this.color;
        ctx.fill();
        ctx.restore();
    }
    update(){
        this.x = this.x + this.velocity.x;
        this.y = this.y + this.velocity.y;
        this.alpha -=  0.10 ;
    }
}
class Stopwatch {
    constructor(id, delay=100) { //Delay in ms
      this.state = "paused";
      this.delay = delay;
      this.display = document.getElementById(id);
      this.value = 0;
    }
    
    formatTime(ms) {
      var hours   = Math.floor(ms / 3600000);
      var minutes = Math.floor((ms - (hours * 3600000)) / 60000);
      var seconds = Math.floor((ms - (hours * 3600000) - (minutes * 60000)) / 1000);
      var ds = Math.floor((ms - (hours * 3600000) - (minutes * 60000) - (seconds * 1000))/100);
   
      if (hours   < 10) {hours   = "0"+hours;}
      if (minutes < 10) {minutes = "0"+minutes;}
      if (seconds < 10) {seconds = "0"+seconds;}
      return hours+':'+minutes+':'+seconds+'.'+ds;
    }
    
    update() {
      if (this.state=="running") {
        this.value += this.delay;
      }
      return this.formatTime(this.value);
    }
    
    start() {
      if (this.state=="paused") {
        this.state="running";
        if (!this.interval) {
          var t=this;
          this.interval = setInterval(function(){t.update();}, this.delay);
        }
      }
    }
    
    stop() {
         if (this.state=="running") {
        this.state="paused";
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
         }
    }
    
    reset() {
    //   this.start();
      this.stop();
      this.value=0;
      this.update();
    }
}
class SoundPlayer {
    // Used to play sounds when requestd
    #beepSound;

    constructor(id, source){
       
        // Allow for playing sound
        this.#beepSound = document.getElementById(id);
        this.#beepSound.src = source;
        // console.log(this.#beepSound)
    }
    play(){
        this.#beepSound.play();
    }
    mute(){
        this.#beepSound.muted = !this.#beepSound.muted
    }

}
function gameLoop() {

    // console.log("yo llegue gameLoop");

    if (gamePaused==true) {

        cancelAnimationFrame(AnimationId)
        oMessageBox = new MessageBox((canvas.width/2)-100, (canvas.height/2)-40, 300, 150, 'orange', 'white','40px Courier', 'Game Paused!');
        oMessageBox.draw("Game Paused !!!");
        return;
    }

    if(!gameOver && !gamePaused){


        if(!steppedGame)requestAnimationFrame(laggedRequestAnimationFrame)

        update();
        draw();

    } else {

        if (lives < 0) {
            setGameOver();    
        }else {
            resetBoard();
        }
    }
    oGameSoundTrack.play();
}
function draw() {

    // for (let index = 0; index < canvas.width; index += 50) {
    // {
            // Clear the canvas
            ctx.clearRect(0,0, canvas.width, canvas.height);

            oDashboard.draw();
            oGameTitle.draw(); 
            oTimeBox.draw();
            oScoreBox.update("Score: "+ score);
            oScoreBox.draw();
            oVitamin.draw();
            oSnake.draw();          

}
function update() {

    // console.log("update.enter")

    oSnake.update();
    oScoreBox.update();
    oTimeBox.update(stopwatch.update());

    // if player tries to move off the board gameover
    if(oSnake.y < dashboardHeight || oSnake.y > canvas.height-20){
        gameOver = true;
        oCrash.play();
        stopwatch.stop();
        lives--;
    }

    if(oSnake.x < 0 || oSnake.x > canvas.width-20){
        gameOver = true;
        oCrash.play();
        stopwatch.start();
        lives--;  
    }

    if(oSnake.crashWithOthers(oVitamin)) {

        // console.log("crashWithOthers: " + oSnake.crashWithOthers(oVitamin));

        // circle explosion


        // console.log("x-> " + oVitamin.x + ", " + oSnake.x + " y-> "  + oVitamin.y + ", " + oSnake.y);
        //  console.log("crashWithOthers: " + oSnake.crashWithOthers(oSnake, oVitamin));

        //console.log("Let me move  x-> " + oVitamin.x + ", " + oSnake.x + " y-> "  + oVitamin.y + ", " + oSnake.y);
        oEat.play();
        oVitamin.splashIt();
        oVitamin.move();
        addScore();
        console.log(score)
        //oScoreBox = new MessageBox(canvas.width/2, 20, 160, 40, 'white', 'black', '20px Courier',"Score: "+ score);
        
        
        setTimeout(function(){ oSnake.grow(1);}, 1000);
    }
    for (let index = 2; index < oSnake.cuerpo.length; index++) {

        var tile = oSnake.cuerpo[index];
       
        // console.log(tile)
        if(oSnake.crashWithBody(tile)) {
            gameOver = true;
            oCrash.play();
            stopwatch.stop();
            lives--;

            // console. lof "Gameover"
        }   
    }
}
function generateRandomColor()
{
    var randomColor = '#'+Math.floor(Math.random()*16777215).toString(16);
    return randomColor;
    //random color will be freshly served
}
function ProcessUserCommands(key){

    if ((key.keyCode === 32)  && (running == true)){

        // reset pause the game
        gamePaused = !gamePaused;

        if(gamePaused){
            stopwatch.stop();
        }else {
            stopwatch.start();
        }
        // console.log("gamePaused: " + gamePaused);
        gameLoop();
        return;

    } else if(running === false){

        // game started
        running = true;
        gamePaused = false;
        stopwatch.start();
        if (!steppedGame) requestAnimationFrame(laggedRequestAnimationFrame)
        oSnake.move = DIRECTION.RIGHT; 
    }

    switch (true) {
        
        // Handle scape as game over
        case (key.keyCode === 27):      
            if (!gamePaused) gameOver = true;
            break;

        // Handle space bar for PAUSE
        // case (key.keyCode === 32):
        //     running = true;
        //     break;

        // Handle up arrow and w input
        case (key.keyCode === 38 || key.keyCode === 87) && oSnake.move != DIRECTION.DOWN: 
            oSnake.move = DIRECTION.UP;
            //update();
            break;

        // Handle down arrow and s input
        case (key.keyCode === 40 || key.keyCode === 83) && oSnake.move != DIRECTION.UP:
            oSnake.move = DIRECTION.DOWN;
            //update();
            break;
        
        // Handle left arrow and a input
        case (key.keyCode === 37 || key.keyCode === 65) && oSnake.move != DIRECTION.RIGHT:
            oSnake.move = DIRECTION.LEFT;
            //update();
            break;

        // Handle right arrow and d input
        case (key.keyCode === 39 || key.keyCode === 68)  && oSnake.move != DIRECTION.LEFT:
            oSnake.move = DIRECTION.RIGHT;
            //update();
            break;

        default:
            break;
    }
    // console.log("key.code: " + key.keyCode)
    if(steppedGame) gameLoop();
}
function getTime(){

    let clock = today.getHours().toString()   + ":" + 
                today.getMinutes().toString() + ":" + 
                today.getSeconds().toString();
    
                return clock;
}
var fps = 5;
// Article reference: http://www.javascriptkit.com/javatutors/requestanimationframe.shtml
function laggedRequestAnimationFrame(timestamp){
    setTimeout(function(){ //throttle requestAnimationFrame to 20fps
        AnimationId = requestAnimationFrame(gameLoop);
    }, 1000/fps)
}

function recCollisionDectetion(targetA, targetB) {
    return !(targetB.x > (targetA.x + targetA.width) || 
             (targetB.x + targetB.width) < targetA.x || 
             targetB.y > (targetA.x + targetA.height) ||
             (targetB.y + targetB.height) < targetA.y);
}
function circleCollisionDetection(circle1, circle2){

    // Article reference: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection

    var dx = (circle1.x + circle1.radius) - (circle2.x + circle2.radius);
    var dy = (circle1.y + circle1.radius) - (circle2.y + circle2.radius);
    var distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < circle1.radius + circle2.radius) {
        // collision detected!
        // this.color = "green";
        return true;
    } else {
        // no collision
        // this.color = "blue";
        return false;
    }
}
// return true if the rectangle and circle are colliding
function RectToCircleColliding(circle, rect){

    // console.log("cicle: x-" + circle.x + " y-" + circle.y);

    var distX = Math.abs(circle.x - rect.x-rect.w/2);
    var distY = Math.abs(circle.y - rect.y-rect.h/2);

    if (distX > (rect.w/2 + circle.r)) { return false; }
    if (distY > (rect.h/2 + circle.r)) { return false; }

    if (distX <= (rect.w/2)) { return true; } 
    if (distY <= (rect.h/2)) { return true; }

    var dx=distX-rect.w/2;
    var dy=distY-rect.h/2;
    return (dx*dx+dy*dy<=(circle.r*circle.r));
}
function setGameOver(){

    // Finish the game
    cancelAnimationFrame(AnimationId)
   
    stopwatch.stop();

    oGameOver.play();

    oMessageBox = new MessageBox((canvas.width/2)-100, (canvas.height/2)-40, 300, 150, 'black', 'red', "40px Courier", 'Game Over!!!');
    oMessageBox.draw();
    
}
function addScore(){
    score += 5;
}
function resetBoard() {

    let bodySize = oSnake.bodySize;
    // console.log('Cuerpo: '+ bodySize);
    
    oSnake = new Snake(300, 140, 'black');
    oSnake.grow(1);

    oVitamin.move();

    gameOver=false;
    gamePaused=false;

    while(oSnake.crashWithBody(oVitamin)){
        oVitamin.move();
    }

    stopwatch.stop();

    gameLoop();
 
}
function muteIt(){
    let btn = document.getElementById('sound');

    if (btn.innerText === 'On'){
        btn.innerText = 'Off';
    }else{
        btn.innerText = 'On';
    }

    oGameSoundTrack.mute();
    oGameOver.mute();
    oEat.mute();
    oCrash.mute();
}
