const char1 = {
    name: "Wizard",
    hP: 100,
    alive: true,
    rest: false,
    cLocale: "#A1",
    grid: "#B1",
    charImg: "#wizPic",
    attkImg: "#spell",
    healthBar: "#B1 .health",
    idlePic: "./assests/images/gameArt/wizard/casting1_16.png",
    attkPic: "./assests/images/gameArt/wizard/area_casting1_13.png",    
    deadPic: "./assests/images/gameArt/wizard/dying24.png",
};
const char2 = {
    name: "Archer",
    hP: 100,
    alive: true,
    rest: false,
    cLocale: "#A2",
    grid: "#B2",
    charImg: "#arcPic",
    attkImg: "#arrow",
    healthBar: "#B2 .health",
    idlePic: "./assests/images/gameArt/archer/idle1.png",
    attkPic: "./assests/images/gameArt/archer/high_shoot8.png",    
    deadPic: "./assests/images/gameArt/archer/dying15.png",
};
const char3 = {
    name: "Warrior",
    hP: 100,
    alive: true,
    rest: false,
    cLocale: "#A3",
    grid: "#B3",
    charImg: "#warPic",
    attkImg: "#warAttk",
    healthBar: "#B3 .health",
    idlePic: "./assests/images/gameArt/warrior/idle10.png",
    attkPic: "./assests/images/gameArt/warrior/Attack1_3.png",    
    deadPic: "./assests/images/gameArt/warrior/dying14.png",
};
const dragon = {
    name: "Dragon",
    hP: 200,
    hasAttacked: false,
    mainPic: "./assests/images/gameArt/dragon.png",
    attkPic: "./assests/images/gameArt/dragonAttack2.png",       
};
const charArr = [char1,char2,char3,dragon,"next"];
const controllerObj = {
    attkButton: "<button id='attk' class='btn btn-primary'>Attack</button>",
    restButton: "<button id='rest' class='btn btn-primary'>Rest</button>",
}

var turn = 0;
var curPhase = 0;
var started = false;
var charDead = 0;

$("#start").click(startGame);

function startGame(){
    if(!started){
        started = true;
        console.log("Game Start");
        turn++;
        loadImgs();
        newTurn();
    }    
}

function loadImgs(){
    $("#arrow").css("visibility", "hidden");
    $("#spell").css("visibility", "hidden");
    $("#fireBall").css("visibility", "hidden");
    $("#warAttk").css("visibility", "hidden");
}

function newTurn(){
    console.log("dragonHP", dragon.hP);
    curPhase = 0;
    healthCheck();    
    newPhase(curPhase);
}

function newPhase(thisPhase){
    var thisChar = charArr[thisPhase];
    // console.log("Current Phase", thisChar.name);

    if(thisChar == "next"){
        newTurn();
    }else if(thisChar === dragon){
        dragonPhase()
    }else{
        if(thisChar.alive){
            moveController(); 
        }else{
            endPhase();
        }       
    }
}

function moveController(){
    var thisChar = charArr[curPhase];
    $(thisChar.cLocale).append(controllerObj.attkButton);
    $(thisChar.cLocale).append(controllerObj.restButton);
    decision();
}

function decision(){
    var thisChar = charArr[curPhase];
    if(!thisChar.alive){
        endPhase();
    }
    // console.log("Decision Phase", thisChar)
    $("#attk").click(charAttack);
    $("#rest").click(charRest);    
}

function endPhase(){
    console.log("END PHASE")
    var thisChar = charArr[curPhase];
    if(thisChar === dragon){
        curPhase++;
        newPhase(curPhase);
    } else {        
        $(thisChar.cLocale).empty();
        curPhase++;
        newPhase(curPhase);
    }    
}

function dragonPhase(){
    console.log("DRAGON PHASE!!!");
    $("#dragPic").attr("src",dragon.attkPic);

    setTimeout(()=>{$("#fireBall").css("visibility","visible");},250);
    
    setTimeout(()=>{$("#dragPic").attr("src",dragon.mainPic);},1000);

    setTimeout(()=>{$("#fireBall").css("visibility","hidden");},2000);

    setTimeout(dragonDmg(),1000);
    healthCheck();
}

function charAttack(){        
    var thisChar = charArr[curPhase];
    var restBox = `${thisChar.grid} .rest`
    var dmg = Math.round(Math.random()*10);
    // console.log(thisChar.rest)
    if(thisChar.rest){
        console.log(thisChar.name,"Rested Attack")
        dmg = Math.round(dmg*(Math.random()*2 + 1));
        thisChar.rest = false;
        $(restBox).css("background-color","transparent")
    }
    animation(dmg)
    // console.log(thisChar.name, "Attacked!");
    
}

function charRest(){        
    var thisChar = charArr[curPhase];
    thisChar.rest = true;
    var restBox = `${thisChar.grid} .rest`
    $(restBox).css("background-color","orange")
    // console.log(thisChar.name, "Rests");
    endPhase();
}

function animation(dmg){
    var thisChar = charArr[curPhase];
    var img = $(thisChar.charImg);
    var attkImg = $(thisChar.attkImg);
    $("#attk").css("visibility","hidden");
    $("#rest").css("visibility","hidden"); 

    charDmg(dmg);

    setTimeout(()=>{img.attr("src", thisChar.attkPic);},250);

    setTimeout(()=>{
        attkImg.css("visibility", "visible");
        if(curPhase == 2){
            img.css("visibility", "hidden");
        }        
        },1000);

    setTimeout(()=>{
        attkImg.css("visibility", "hidden");
        if(curPhase == 2){
            img.css("visibility", "visible");
        }          
        },2000);

    setTimeout(()=>{img.attr("src", thisChar.idlePic);},2000);

    setTimeout(()=>{endPhase()},2000);   

}

function dragonDmg(){
    var aliveArr = [];
    for(var x=0;x<3;x++){
        var current = charArr[x];
        if(current.alive){
            aliveArr.push(current);
        }
    }
    var rando = Math.floor(Math.random()*aliveArr.length);
    var charAttacked = aliveArr[rando];
    $("#info").html(` The Dragon hit the ${charAttacked.name} for 20 damage!`);
    charAttacked.hP -= 20;
    endPhase();
}

function charDmg(damage){
    var thisChar = charArr[curPhase];
    $("#info").html(` ${thisChar.name} did ${damage} damage!`);
    dragon.hP = dragon.hP - damage;
    var z = dragon.hP;
    console.log(z);
    $("#dragHP").html(z);
}

function healthCheck(){
    for(var x=0;x<4;x++){
        var char = charArr[x]
        if(x<3){
            $(char.healthBar).html(char.hP);
            if(char.hP <= 0){
                death(char);
            }
        }else{
            if(char.hP <= 0){
                win();
            }
        }
    }
}

function death(character){
    charDead++
    $(character.charImg).attr("src", character.deadPic);
    character.alive = false;
    if(charDead>2){
        $("#info").html("YOU LOST");
    }
}

function win(){
    $("#dragPic").css("visibility","hidden");
    $("#B5").html("<h1>You Win!</h1>");
}