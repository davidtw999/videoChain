const express = require('express');
const http = require('http');
const app = express();
const port = process.env.PORT || 5000


var server = http.createServer(app);
var io = require('socket.io').listen(server)
server.listen(port)

app.use(express.static(__dirname + '/public'));


const Game = require('./games/class/game.js');
const initialise = require('./games/funcs/initialise.js')
const time = require('./games/funcs/time.js')
const joinState = require('./games/funcs/joinState.js')
const readyState = require('./games/funcs/readyState.js')
const discState = require('./games/funcs/discState.js')
const buttonState = require('./games/funcs/buttonState.js')


// game define
var numOfChains = 1;
var lenOfChain = 5;
var head = 1;
var tail = lenOfChain;

var numClients;
var comRoomID = initialise.randomString();
var roomID = initialise.randomString();
var startTime, endTime, timeDiff;
var gameDraw = true;

var circleWid = 35;
var cx=15, cy=15, r = 10;
var circleWidTotel = String(lenOfChain * circleWid) + "px";
var color = "#A9A9A9"

var posColor = "white";
var posR = 13;

var circleWid = 35;
var cx=15, cy=15, r = 10;

var playerOnlineIDs;
var allplayerInChain=false;

var game = new Game(numOfChains, lenOfChain);

startTime = time.start()

io.on('connection',  (socket) => {

    var joinedPos = [];
    console.log('\n----socket connecting for new connection or refresh on the browsers-----\n')
    console.log('This visitor IP is: ',socket.handshake.headers.host)
    console.log('This visitor addr is: ',socket.handshake.address)
    numClients = io.engine.clientsCount
    console.log('number of visitors: ', numClients)
    console.log('check 2', socket.connected)
    console.log(socket.id)
    console.log("game restart", game.start)
    console.log("numClients",numClients)

    endTime = time.end();

    if (gameDraw === true) {
        socket.emit("drawChain", circleWidTotel, lenOfChain, cx, cy, r, color)
  
    }

    if (game.start === false) {
        console.log("game.start === false", game.start)
        timeDiff = endTime - startTime;
        timeDiff /= 1000;
        console.log(timeDiff + "ms seconds");
        if (timeDiff < 5) {
            console.log("game restart in timeDiff < 10.0", game.start)
            socket.emit('restart', lenOfChain)
        } else {
            game.start = true
        }
    }

    firstAllowPos = joinState.updateJoinedPlayer(numOfChains, lenOfChain, game);
    // full chain condition
    if (firstAllowPos === false){
        // game.chains[firstAllowPos.chainName].chainReady = true;
        urlLR = "https://www.gstatic.com/webp/gallery3/2.png"
        console.log("it is full")
        socket.emit('geturl', urlLR, false)
        socket.emit('sglCG', 'is full')
        // console.log("heyhey",numClients)
    } else {
        socket.emit('joinedChainRoom', firstAllowPos, comRoomID, head, tail);
        game.chains[firstAllowPos.chainName].players[firstAllowPos.playerID].joined = true;
        game.chains[firstAllowPos.chainName].players[firstAllowPos.playerID].socketID = socket.id;
        // allplayerInChain = readyState.checkGameReady(game.chains[firstAllowPos.chainName]);
        [urlLR, game] = joinState.generateLRurl(firstAllowPos, lenOfChain, roomID, game);
        socket.emit('joined', firstAllowPos, socket.id, urlLR);
        io.emit("updateCirclePos", firstAllowPos, posColor, posR, game.chains[firstAllowPos.chainName]);
        io.emit('showReadyBut', firstAllowPos, game.chains[firstAllowPos.chainName])
        // socket.emit("updateCirclePos", firstAllowPos, posColor, posR);
        // joinedPos = joinState.findJoinedPlayer(game.chains[1]);
        // io.emit("updateCircleOn", joinedPos);
            // io.emit('showReadyBut', allplayerInChain)
        socket.emit('updateRBut');
        
      
    }

    socket.on('updateCircleForAll', (color, firstAllowPos) => {
        // joinedPos = joinState.findJoinedPlayer(game.chains[1]);
        io.emit("updateCircleOn", color, firstAllowPos);
    });
    

    socket.on('disconnect', () => {
        console.log('\n+++++   socket disconnecting +++++++\n')
    
        disPos = discState.findDisSocketID(socket.id, game, numOfChains, lenOfChain);
        console.log(disPos)

        // reset disconnect position values
        if (disPos != false){
            game.chains[disPos.chainName].players[disPos.playerID].joined = false;
            game.chains[disPos.chainName].players[disPos.playerID].socketID = null;
            game.chains[disPos.chainName].players[disPos.playerID].link = null;
            game.chains[disPos.chainName].players[disPos.playerID].readyBut = false;

            console.log(game.chains[disPos.chainName])
            playerOnlineIDs = discState.getOnlinePlayerID(game.chains[disPos.chainName])
            if (game.chains[disPos.chainName].chainReady == false){
           

    
                console.log("playerOnlineIDs!!!!  "+playerOnlineIDs)
                io.emit("updateCircleOff", disPos, playerOnlineIDs)
            
                console.log(game.chains[disPos.chainName]) 
            
            } else {
                game.chains[disPos.chainName].chainReady = false

                console.log("chainready true and ")
                console.log("playerOnlineIDs  "+playerOnlineIDs)

                for(var i=1;i<=game.chains[disPos.chainName].numOfplayers;i++){
                    var pid = String(disPos.chainName) + String(i)
                    game.chains[disPos.chainName].players[pid].readyBut = false
                }

                io.emit("updateCircleOff", disPos, playerOnlineIDs)
                io.emit('resetPanel', playerOnlineIDs, comRoomID, head, tail);
           
                    
                io.emit('resetReadyButton')
                io.emit('resetCircleColor', playerOnlineIDs)
                console.log("disPos     "+disPos)
                io.emit('showReadyBut', disPos, game.chains[disPos.chainName])
                io.emit('updateRBut');
                
            }
            
        } 
        
    });
  
    socket.on('updatingCirCor', (ready, upStatePos, playerID, chainName) => {
        // console.log(playerID)
        // console.log(game.chains[chainName].players[playerID].playerID)
        // console.log(game.chains[chainName].players[playerID].readyBut)
        game.chains[chainName].players[playerID].readyBut = ready;     
        io.emit("updatedCirCor", ready, upStatePos)
    });


    socket.on('updateCurrentPlayer', (nextPlayer, lenOfChain, prevPlayer, playerIDs, easyNo, fileName) => {
        console.log("this is in the updateCurrent player loop!!!!!!!")
        console.log("playerIDs   "+playerIDs)
        var chainName = prevPlayer.charAt(0);
        io.emit('prevPlayer', prevPlayer, playerIDs, easyNo, game.chains[chainName].gameLvlImgN, comRoomID);
        io.emit('nextPlayer', nextPlayer, lenOfChain, playerIDs, easyNo, fileName, comRoomID);
    });


    socket.on('checkChainReadyState', (chainName) => {
        console.log('chainName ' +chainName)
        playerOnlineIDs = discState.getOnlinePlayerID(game.chains[chainName])
        if (playerOnlineIDs.length === game.chains[chainName].numOfplayers) {
            game.chains[chainName].chainReady = readyState.checkChainReadyStates(chainName, playerOnlineIDs, game)
            if (game.chains[chainName].chainReady) {
                // reset all pages to other players interface
                console.log(game.chains[chainName]);
                io.emit('changeInterface', game.chains[chainName], head, tail);
                console.log(playerOnlineIDs)
                console.log('chainName when game ready' + chainName)
                io.emit('gameReadyStage', playerOnlineIDs, head, chainName)
                // io.emit('gameReadyStage', playerOnlineIDs[playerOnlineIDs.length-1])
            }
        }
    });

    socket.on('headPlayerClick', (playerIDs, headPlayer, chainName, fileName, easyNo) => {
        game.chains[chainName].gameLevel = easyNo;
        game.chains[chainName].gameLvlImgN = fileName;
        socket.emit('headPlayerClickCheck', playerIDs, headPlayer, chainName,  fileName, easyNo)
    });

    socket.on('lastPlayerClickBut', (prevPlayer, answer, submitTime, gameNum, playerIDs) => {
        var chainName = prevPlayer[0];
        // game.chains[chainName].result.push(answer);
        var esayNo = game.chains[chainName].gameLevel;
        var fileName = game.chains[chainName].gameLvlImgN;
        game.gameResults.push({'chainName':chainName,'game':gameNum,'level':esayNo,'submitAns':answer,'correctAns':fileName,'submitTime':submitTime});
        io.emit('gameFinished', prevPlayer, answer, comRoomID, fileName, playerIDs)
    });

    socket.on('replayGame', (chainName, playerIDs) => {
        game.chains[chainName].chainReady = false
        game.chains[chainName].gameLevel = null;
        game.chains[chainName].gameLvlImgN = [];

        for(var i = 0;i<playerIDs.length;i++){
            game.chains[chainName].players[playerIDs[i]].readyBut = false
        }
      
        var allplayerInChain = readyState.checkGameReady(game.chains[chainName]);
        console.log("allplayerInchina   " + allplayerInChain)
        if (allplayerInChain) {
            io.emit('resetReadyButton')
            io.emit('showReadyBut', game.chains[chainName], game.chains[chainName])
            io.emit('updateRBut');
        }
       
    });



    socket.on('updCirPlayingToS', (prevPlayer, curPlayer, playerIDs) => {
        io.emit('updCirPlayingToAll', prevPlayer, curPlayer, playerIDs)
    });

    socket.on('hostButtonStatus', (gameStart, chainName, nextPlayer, playerIDs) => {
        console.log(game.chains[chainName].gameReady)
        var easyNo = game.chains[chainName].gameLevel
        var fileName = game.chains[chainName].gameLvlImgN
        if (gameStart === true){
            game.chains[chainName].gameReady = gameStart;
            io.emit('resetUIAfterGamestart',chainName,head)
            io.emit("nextPlayer", nextPlayer, lenOfChain, playerIDs, easyNo, fileName, comRoomID)
        } 
    });


    console.log(game.chains[1])
    console.log("outside",numClients)
});

