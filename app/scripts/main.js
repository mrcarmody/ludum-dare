var stageSizeX = 800;
var stageSizeY = 600;
var prize = 'Index';

// You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer
var renderer = new PIXI.autoDetectRenderer(stageSizeX, stageSizeY);

document.body.appendChild(renderer.view);

var stage = new PIXI.Stage;

var text = new PIXI.Text("Acquire the "+prize+"!!",{font:"30px Arial", fill:"yellow"});
text.position.x = 10;
text.position.y = 10;

stage.addChild(text);

var happyTalk = [];
happyTalk.push(new PIXI.Text("Yes!",{font:"20px Arial", fill:"yellow"}));

var sadTalk = [];
sadTalk.push(new PIXI.Text("No :(",{font:"20px Arial", fill:"yellow"}));


var manTexture = PIXI.Texture.fromImage("images/rMan.png");
var man = new PIXI.Sprite(manTexture);

man.position.x = 100;
man.position.y = 500;

man.scale.x = 0.5;
man.scale.y = 0.5;

stage.addChild(man);

var bossTexture = PIXI.Texture.fromImage("images/boss.png");
var boss = new PIXI.Sprite(bossTexture);

boss.position.x = 520;
boss.position.y = 100;

boss.scale.x = 0.75;
boss.scale.y = 0.75;

stage.addChild(boss);


var prizeTexture = PIXI.Texture.fromImage("images/prize.png");
var prize = new PIXI.Sprite(prizeTexture);

prize.position.x = 650;
prize.position.y = 10;

prize.scale.x = 0.75;
prize.scale.y = 0.75;

stage.addChild(prize);


function moveboss() {
    // Random
    var rand;
    var dir = 'y';
    var speed = 5;
    rand = Math.random();
    if (rand < 0.25) {
        dir = 'x';
    } else if (rand < 0.5) {
        dir = 'x';
        speed = speed * -1;
    } else if (rand < 0.75) {
        dir = 'y';
    } else if (rand < 1) {
        dir = 'y';
        speed = speed * -1;
    }

    moveActor(boss,dir,speed);
}

requestAnimationFrame(animate);

function animate() {

    moveboss();

    renderer.render(stage);

    requestAnimationFrame(animate);
}

// Catch input from the user (keyboard)
document.addEventListener('keydown', function(event) {
    var isShift;

    if (window.event) {
        key = window.event.keyCode;
        isShift = window.event.shiftKey ? true : false;
    } else {
        key = event.which;
        isShift = event.shiftKey ? true : false;
    }

    var speed = 10;
    var dir = 'y';
    if (isShift){
        speed = speed * 2;
    }


    switch (event.keyCode) {
        case 16:
           return;
        // left and right (or right and left???)
        case 37:
            dir = 'x';
            speed = speed * -1;
            break;
        case 39:
            dir = 'x';
            break;
        // Up arrow
        case 38:
            dir = 'y';
            speed = speed * -1;
            break;
        // Down arrow
        case 40:
            dir = 'y';
            break;
        case 84:
            speak(man,happyTalk[0]);
            return;
    }

    moveActor(man,dir,speed);
});

isIntersecting = function(r1, r2) {
    return !(r2.x > (r1.x + r1.width) ||
        (r2.x + r2.width) < r1.x ||
        r2.y > (r1.y + r1.height) ||
        (r2.y + r2.height) < r1.y);
};

speak = function(actor,phrase){
    phrase.position.x = actor.position.x + actor.width + 3;
    phrase.position.y = actor.position.y - 10;
    stage.addChild(phrase);
};

moveActor = function(actor,dir,speed){
    // make sure the actor is not leaving the screen
    if (dir === 'x'){
        if (actor.position.x + speed < 0 ||
            actor.position.x + actor.width + speed > stageSizeX){
            return false;
        }
    } else if (dir === 'y'){
        if (actor.position.y + speed < 0 ||
            actor.position.y + actor.height + speed > stageSizeY){
            return false;
        }
    } else {
        // bad dir
        return false;
    }
    // check for collision with the boss
    /*
    if (isIntersecting(actor, boss)){
        speed = speed * -2 >= 30 ? speed * -2 : 30;
        //speak(actor,sadTalk[0]);
    };
    */

    // make the move
    actor.position[dir] += speed;

    // check for collision with the prize
    if (isIntersecting(actor, prize)){
        speak(actor,happyTalk[0]);
    };

};
