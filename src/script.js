// create games object
const games = {};

// track element
games.object = {
    startScreen : document.querySelector('.play-screen'),
    optionScreen : document.querySelector('.select-screen'),
    gameScreen : document.querySelector('.game-screen'),
    playButton : document.getElementById('play-btn'),
    optionButtons : document.querySelectorAll('.option'),
    timeSpan : document.getElementById('time'),
    scoreSpan : document.getElementById('score') ,
    message : document.getElementById('message'),
    noButton : document.getElementById('no-btn'),
    yseButton : document.getElementById('yes-btn')
}

// games asset object
games.asset = {
    time : 0,
    objectList : null,
    objectListLength : 0,
    timeInterval : null,
    colorList : data.colors,
    colorListLength : data.colors.length,
    score : 0,
    killCountTrack : 1
}

// create game function object
games.gameFunctions = {};

// play function
games.gameFunctions.play = ()=>{
    // hide the startScreen from client
    games.object.startScreen.classList.add('up-screen');
}

// selectOne function
games.gameFunctions.selectOne = option=>{
    // find option name from option and set game objectList and lenght
    let optionName = option.querySelector('p').innerText.toLowerCase();
    games.asset.objectList = data[optionName];
    games.asset.objectListLength = games.asset.objectList.length;

    // hide option secreen and call startGames function
    games.object.optionScreen.classList.add('up-screen');
    games.gameFunctions.startGames()
}

// start timing function
games.gameFunctions.startTiming = ()=>{
    // calculate secound and minute
    let times = games.asset.time++;
    let minutes = Math.floor(times/60);
    let secounds = times - minutes*60;
    let minutesStringForm = minutes < 10 ? '0'+minutes : `${minutes}`;
    let secoundsStringForm = secounds < 10 ? '0'+secounds : `${secounds}`;

    // update time in ui
    games.object.timeSpan.innerText = `${minutesStringForm}:${secoundsStringForm}`
}

// getRandomPositin function
games.gameFunctions.getRandomPosition = ()=>{
    // get Width and height
    let width = games.object.gameScreen.offsetWidth - 40;
    let height = games.object.gameScreen.offsetHeight - 90;

    // create random x and y
    let x = Math.random()*width + 20;
    let y = Math.random()*height + 70;

    // create left and top position and return them as array
    let positionLeft = x+'px';
    let positionTop = y+'px';
    
    return [positionLeft,positionTop]
}

// deleteObject function
games.gameFunctions.deleteObject = object=>{
    // add hide-object class and delete 400milisecound letter
    object.classList.add('hide-object');
    setTimeout(()=>{
        object.remove();
    },400);
}

// kill funcitons
games.gameFunctions.kill = object=>{
    // delete object
    games.gameFunctions.deleteObject(object);

    // update score in ui and update kill count track
    let score = ++games.asset.score;
    let scoreString = score < 10 ? '0'+score : `${score}`;
    games.object.scoreSpan.innerText = scoreString;
    let killCountTrack = ++games.asset.killCountTrack;

    // create object again
    if(killCountTrack > 0){
        for(let i = 0; i < killCountTrack;i++){
            games.gameFunctions.createObject();
        }
    }

    // updateKill CountTrack
    if(killCountTrack+1 > 10){
        games.asset.killCountTrack = -44;
    }

    // show message 
    if(score % 50 == 0 && score ){
        games.object.message.classList.add('show-message');
    }
}

// createObject functions
games.gameFunctions.createObject = ()=>{
    // extract games asset object
    let {
        objectList:list,
        objectListLength:length,
        colorList,
        colorListLength
    } = games.asset;

    // get random object and property
    let randomObject = list[Math.floor(Math.random()*length)];
    let randomColor = colorList[Math.floor(Math.random()*colorListLength)];
    let randomDegree = Math.floor(Math.random()*360)+'deg';
    let [positionLeft,positionTop] = games.gameFunctions.getRandomPosition();

    // create div and innerHTML
    let div = document.createElement('div');
    let p = document.createElement('p');
    p.innerHTML = randomObject;
    p.style.color = randomColor;
    p.style.transform = `rotate(${randomDegree})`;
    div.appendChild(p);
    div.className = 'game-object';

    // set div position
    div.style.left = positionLeft;
    div.style.top = positionTop;

    // add event listener on div
    div.addEventListener('click',()=>{
        games.gameFunctions.kill(div);
    });

    // append child inside the game screen
    games.object.gameScreen.appendChild(div);
}

// startGames function
games.gameFunctions.startGames = ()=>{
    // extract function from gameFunction
    let {
        startTiming,
        createObject
    } = games.gameFunctions;

    // start the time
    games.asset.timeInterval = setInterval(startTiming,1000);

    // createObject
    setTimeout(createObject,1000);
}

// continueGames function
games.gameFunctions.continueGames = ()=>{
    // hide message
    games.object.message.classList.remove('show-message');
}

// reset games
games.gameFunctions.resetGames = ()=>{
    // get all object and delete object from ui
    let allObject = document.querySelectorAll('.game-object');

    allObject.forEach(object=>{
        object.classList.add('hide-object');
        setTimeout(()=>{
            object.remove();
        },400);
    })

    // hide message 
    games.object.message.classList.remove('show-message');
    
    // clear timer and reset time and score
    clearInterval(games.asset.timeInterval);
    games.asset.time = 0;
    games.asset.score = 0;
    games.asset.killCountTrack = 1;

    // reset ui
    games.object.timeSpan.innerText = '00:00';
    games.object.scoreSpan.innerText = '00';

    // back start screen
    games.object.optionScreen.classList.remove('up-screen');
    games.object.startScreen.classList.remove('up-screen');
}

// extract gamesFunctions
let {
    play,
    selectOne,
    continueGames,
    resetGames
} = games.gameFunctions;

// add event listener on playButton
games.object.playButton.addEventListener('click',play);

// add event listener on all options
games.object.optionButtons.forEach(option=>{
    // add event listener on option
    option.addEventListener('click',()=>{
        selectOne(option);
    });
})

// add event listener on noButton
games.object.noButton.addEventListener('click',continueGames);

// add event listener on yesButton
games.object.yseButton.addEventListener('click',resetGames);