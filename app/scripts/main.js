var stageSizeX = 800;
var stageSizeY = 600;
var prize = 'Index';
var score = 0;
var peons = [];

PIXI.Sprite.prototype.move = function (dir, speed) {
    var actor = this;
    if (actor.isDead || !dir || !speed) {
        return false;
    }
    // make sure the actor is not leaving the screen
    if (dir === 'x') {
        if (actor.position.x + speed < 0 ||
            actor.position.x + actor.width + speed > stageSizeX) {
            return false;
        }
    } else if (dir === 'y') {
        if (actor.position.y + speed < 0 ||
            actor.position.y + actor.height + speed > stageSizeY) {
            return false;
        }
    } else {
        // bad dir
        return false;
    }

    // make the move
    actor.position[dir] += speed;
};

PIXI.Sprite.prototype.didIntersect = function (otherGuy) {
    var actor = this;

    isIntersecting = function(r1, r2) {
        return !(r2.x > (r1.x + r1.width) ||
            (r2.x + r2.width) < r1.x ||
            r2.y > (r1.y + r1.height) ||
            (r2.y + r2.height) < r1.y);
    };

    return !!isIntersecting(actor, otherGuy);
};


PIXI.Sprite.prototype.die = function (stage) {
    var actor = this;

    actor.isDead = true;
    stage.removeChild(actor);
};

placePrize = function() {
    var x = man.position.x;
    var y = man.position.y;

    var rand = parseInt(Math.random() * 100 / 33) + 1;
    var prizeTexture = PIXI.Texture.fromImage("images/prize"+rand+".png");
    prize.setTexture(prizeTexture);

    if (x > stageSizeX / 2) {
        prize.position.x = 10;
    } else {
        prize.position.x = stageSizeX - 150 - (prize.width*2);
    }
    if (y > stageSizeY / 2) {
        prize.position.y = 10;
    } else {
        prize.position.y = stageSizeY - 100;
    }

    stage.addChild(prize);
};

placePeon = function () {
    var peonTexture = PIXI.Texture.fromImage("images/boss.png");
    var peon = new PIXI.Sprite(peonTexture);

    peon.scale.x = 0.25;
    peon.scale.y = 0.25;

    peon.position.x = boss.position.x;
    peon.position.y = boss.position.y;

    peon.speed = 1;

    stage.addChild(peon);
    peons.push(peon);
}

deployPeons = function(num) {
    for(var i=0;i<num;i++){
        placePeon();
    }
};

placeBoss = function() {
    var x = man.position.x;
    var y = man.position.y;

    if (x > stageSizeX / 2) {
        boss.position.x = 100;
    } else {
        boss.position.x = stageSizeX - 175;
    }
    if (y > stageSizeY / 2) {
        boss.position.y = 100;
    } else {
        boss.position.y = stageSizeY - 150;
    }

    boss.isDead = false;
    boss.speed = 1;
    stage.addChild(boss);
    deployPeons(score);
};

updateScore = function() {
    score++;
    text.setText("Score: "+score);
};

AIcallback = function(AI,actor,antagonist) {
    var speed = actor.speed;
    var dir;

    if (AI === 'aggressive') {
        var antagonistX = actor.position.x - antagonist.position.x;
        var antagonistY = actor.position.y - antagonist.position.y;

        if (Math.abs(antagonistX) > Math.abs(antagonistY)) {
            dir = 'x';
            speed = speed * (antagonistX / Math.abs(antagonistX)) * -1;
        } else {
            dir = 'y';
            speed = speed * (antagonistY / Math.abs(antagonistY)) * -1;
        }
    } else if (AI === 'defensive'){
        var antagonistX = actor.position.x - antagonist.position.x;
        var antagonistY = actor.position.y - antagonist.position.y;

        if (Math.abs(antagonistX) > Math.abs(antagonistY)){
            dir = 'x';
            speed = speed * (antagonistX / Math.abs(antagonistX));
        } else {
            dir = 'y';
            speed = speed * (antagonistY / Math.abs(antagonistY));
        }
    } else {
        // random
        var rand;
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
    }
    
    return {dir:dir,speed:speed};
}
// You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer
var renderer = new PIXI.autoDetectRenderer(stageSizeX, stageSizeY);
// You can use either PIXI.WebGLRenderer or PIXI.CanvasRenderer
var renderer = new PIXI.autoDetectRenderer(stageSizeX, stageSizeY);

document.body.appendChild(renderer.view);

var stage = new PIXI.Stage;
//var stage = new PIXI.Stage(0X86c1f4);

var text = new PIXI.Text("Score: "+score,{font:"30px Arial", fill:"yellow"});
text.position.x = 10;
text.position.y = 10;

stage.addChild(text);

var happyTalk = [];
happyTalk.push(new PIXI.Text("Yes!",{font:"20px Arial", fill:"yellow"}));

var sadTalk = [];
sadTalk.push(new PIXI.Text("No :(",{font:"20px Arial", fill:"yellow"}));


var manTexture = PIXI.Texture.fromImage("images/radMan.png");
var man = new PIXI.Sprite(manTexture);

man.position.x = 100;
man.position.y = 450;

man.scale.x = 0.17;
man.scale.y = 0.17;

man.speed = 5;
stage.addChild(man);

var bossTexture = PIXI.Texture.fromImage("images/boss.png");
var boss = new PIXI.Sprite(bossTexture);

boss.scale.x = 0.6;
boss.scale.y = 0.6;

placeBoss();

var prizeTexture = PIXI.Texture.fromImage("images/prize.png");
var prize = new PIXI.Sprite(prizeTexture);
prize.scale.x = 0.5;
prize.scale.y = 0.5;

placePrize();

function moveboss(AI) {
    var move = AIcallback(AI,boss,man);

    boss.move(move.dir,move.speed);
};

movePeons = function() {
    for(var i=0;i<peons.length;i++) {
        var peon = peons[i];
        var move;
        if (i!=0 && i%5===0){
            move = AIcallback('aggressive',peon,man);
        } else {
            move = AIcallback('random',peon,man);
        }
        peon.move(move.dir, move.speed);

        if (peon.didIntersect(man)){
            man.die(stage);
        }
    }
};

// Catch input from the user (keyboard)
var map = [];
mapKeys = function(e) {
    var isShift;

    if (window.event) {
        key = window.event.keyCode;
        isShift = window.event.shiftKey ? true : false;
    } else {
        key = e.which;
        isShift = e.shiftKey ? true : false;
    }

    if (isShift) {
        speed = speed * 2;
    }

    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
};

document.addEventListener('keydown', mapKeys);
document.addEventListener('keyup', mapKeys);

moveMan = function() {
    var speed = man.speed;
    var x;
    var y;

    // left and right (or right and left???)
    if (map[37]) {
        x = speed * -1;
    } else if (map[39]) {
        x = speed;
    }

    // Up and down arrows
    if (map[38]) {
        y = speed * -1;
    } else if (map[40]) {
        y = speed;
    }

    man.move('x',x);
    man.move('y',y);

    if (man.didIntersect(prize)){
        updateScore();
        man.speed += 2;
        boss.die(stage);
        stage.removeChild(prize);
        placePrize();
        placeBoss();
    }
};

/*
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

    var speed = man.speed;
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

    man.move(dir,speed);
    if (man.didIntersect(prize)){
        updateScore();
        man.speed += 5;
        boss.die(stage);
        stage.removeChild(prize);
        placePrize();
        placeBoss();
    }
});
*/

speak = function(actor,phrase){
    phrase.position.x = actor.position.x + actor.width + 3;
    phrase.position.y = actor.position.y - 10;
    stage.addChild(phrase);
};

requestAnimationFrame(animate);

function animate() {

    moveMan();
    movePeons();
    moveboss('aggressive');

    if (boss.didIntersect(man)){
        man.die(stage);
    }

    renderer.render(stage);

    requestAnimationFrame(animate);
}

