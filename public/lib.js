var countT;
var submitTime;
var sectionTime = 30;
var fileName;
var easyNo;
var timeRecord = [];
var gameNum = 0;

class Socket {
    constructor(ip, port) {
        this.ip = ip;
        this.port = port;
        this.rooms = [];
        this.peerPlayers = {};
        this.playerID = null;
        this.chainPos = null;
        this.link = [];
        this.chainName = null;
        this.joined = null;
        this.sockID = null;
        this.ready = false; // condition when click the button
        this.subReady = false;
        this.gameStart = false;
        this.finshedTurn = false;

        this.socket = io.connect();

        this.socket.on('created', (room, socketId) => {
            trace(`${socketId} successfully created ${room}.`);
            socketIdElem.innerHTML = this.socket.id;
            this.rooms.push(room);
            this.hostID = this.socket.id;
        });

        this.socket.on('joined', (joinPos, socketId, urlLR) => {
            this.sockID = socketId;
            this.playerID = joinPos.playerID;
            this.chainName = joinPos.chainName;
            this.chainPos = joinPos.chainPos;
            this.joined = true;
            this.link = {"left": "https://www.talkroom.io/call/" + urlLR.left,
                        "right": "https://www.talkroom.io/call/" + urlLR.right}
        });

       
        this.socket.on('geturl', (urlLR, firstAllowPos) => {
            console.log("urlLR", urlLR)
            var urlL;
            var urlR;
            if (firstAllowPos === false) {
                document.getElementById("leftscreen").setAttribute("src", urlLR);
                document.getElementById("rightscreen").setAttribute("src", urlLR);
                document.getElementById("leftID").innerHTML = "SCREEN1"
                document.getElementById("rightID").innerHTML = "SCREEN2"
                document.getElementById("selfID").innerHTML = "The game is full, please ask the admin!"
                

                var readyBut = document.getElementById('button')
                readyBut.style.display = 'none'

                this.socket.disconnect();

            } else {
                if (urlLR.left === false){
                    urlL = "https://www.gstatic.com/webp/gallery3/2.png";
                    document.getElementById("leftID").innerHTML = "No player";
                } else {
                    urlL = "https://www.talkroom.io/call/"+String(urlLR.left)
                    document.getElementById("leftID").innerHTML = "Player " + String(firstAllowPos.chainPos - 1)
                }
                if (urlLR.right === false){
                    urlR = "https://www.gstatic.com/webp/gallery3/2.png";
                    document.getElementById("rightID").innerHTML = "No player";
                } else {
                    urlR = "https://www.talkroom.io/call/"+String(urlLR.right)
                    document.getElementById("rightID").innerHTML = "Player " + String(firstAllowPos.chainPos + 1)
                }
                
                document.getElementById("leftscreen").setAttribute("src", urlL);
                document.getElementById("rightscreen").setAttribute("src", urlR);

                // console.log("firstAllowPos",firstAllowPos.chainPos)
                // console.log("dsfdsfdsfdsfs", document.getElementById("selfID").innerHTML)
                // document.getElementById("selfID").innerHTML = "You are the player "+String(firstAllowPos.chainPos) 
                // + " in the position " + String(firstAllowPos.chainPos) + " of chain " + String(firstAllowPos.chainName);
                document.getElementById("selfID").innerHTML = "Chain " + String(firstAllowPos.chainName) + " Player "
                + String(firstAllowPos.chainPos);
            }

        });

        this.socket.on('restart', (lenOfChain) => {
            // document.getElementById("leftscreen").setAttribute("src", "https://www.gstatic.com/webp/gallery3/2.png");
            // document.getElementById("leftscreen").innerHTML = `<iframe src="https://www.gstatic.com/webp/gallery3/2.png" frameborder="0" 
            // scrolling="auto" class="frame-area" allow="microphone; camera"></iframe>`

            document.getElementById("text11").innerHTML = `<div class="text-contain text-header">
                        <a><span><div id="leftID">SCREEN1</div><span></a></div>
                    <iframe id="leftscreen" src="https://www.gstatic.com/webp/gallery3/2.png"  
                    frameborder="0" scrolling="auto" class="frame-area" allow="microphone; camera" > </iframe>`
            document.getElementById("text22").innerHTML = `<div class="text-contain text-header">
                    <a><span><div id="leftID">SCREEN2</div><span></a></div>
                <iframe id="rightscreen" src="https://www.gstatic.com/webp/gallery3/2.png"  
                frameborder="0" scrolling="auto" class="frame-area" allow="microphone; camera" > </iframe>`

            document.getElementById("selfID").innerHTML = "Close your browser and rejoin the game!"
          

            // resetReadyBut();

            var btPanel= document.getElementById('bottomPanel')
            btPanel.innerHTML = `PAGE EXPIRED`
            // document.getElementById("clock").innerHTML = 'PAGE EXPIRED'
            clearInterval(countT);
            // document.getElementById('submit').style.display = "none";

            for (var i = 1;i<= lenOfChain;i++){
                setCircles("circle" + String(i), 10, "#A9A9A9", 0.5);
                setTexts("text" + String(i), "12px", "normal", 0.3);
            }
            console.log("in disconnect")
            this.socket.disconnect();
        });

        this.socket.on('updateTextCounT', () => {
            document.getElementById("clock").innerHTML = "";
            clearInterval(countT)

        });

        this.socket.on('drawChain', (chaincircleWid, lenOfChain, cx, cy, r, color) => {
            var circles, circleID;
            var svg1 = document.getElementById('chaincircle');
            svg1.setAttribute("width", chaincircleWid);

            for (var i=1;i<=lenOfChain;i++){
                var updateCx = cx + (i-1) * 33;
                circles = document.createElementNS("http://www.w3.org/2000/svg", "circle");
                circleID = "circle" + String(i);
                circles.setAttribute("id",circleID);
                circles.setAttribute("cx",updateCx);
                circles.setAttribute("cy",cy);
                circles.setAttribute("r",r);
                circles.setAttribute("fill", color);
                circles.setAttribute("fill-opacity", 0.5);
                svg1.appendChild(circles);

                var myTextElement = document.createElementNS("http://www.w3.org/2000/svg", "text");
                var myText = document.createTextNode("P"+String(i));
                myTextElement.setAttribute("id","text"+String(i));
                myTextElement.setAttribute("x", updateCx);
                myTextElement.setAttribute("y", cy+5);
                myTextElement.setAttribute("text-anchor", "middle");
                myTextElement.setAttribute("fill", "black");
                myTextElement.setAttribute("font-family", "Arial");
                myTextElement.setAttribute("fill-opacity", 0.3);
                myTextElement.setAttribute("font-size", "12px");
                myTextElement.appendChild(myText);
                svg1.appendChild(myTextElement)
               
            }
            
        });

        this.socket.on('updateCirclePos', (firstAllowPos, posColor, r, chain) => {
            // firstAllowPos = {"chainName": i,"playerID" : k, "chainPos":j}
            var circleID;
            var textID;
            var playerID;
            var color, opacityC, opacityT ;
           
            for (var i=1;i<=chain.numOfplayers;i++) {
                circleID = "circle" + String(i);
                textID = "text" + String(i);
                playerID = String(firstAllowPos.chainName) + String(i);
                color = getColor(chain.players[playerID].joined, chain.players[playerID].readyBut);
                opacityC = getOpC(chain.players[playerID].joined, chain.players[playerID].readyBut);
                opacityT = getOpT(chain.players[playerID].joined);
                console.log("color ", color)
                console.log("opacityC ", opacityC)
                console.log("opacityT ", opacityT)
                if(this.playerID === playerID){
                    setCircles(circleID, r, color, opacityC)
                    setTexts(textID, "14px", "bold", 1)
                } else {
                    setCircles(circleID, 10, color, opacityC)
                    setTexts(textID, "12px", "normal", opacityT)
                }
                
            }
          
        });

        function getOpT(joined){
            var opacityT;
            if (joined) {
                opacityT = 0.5
                return opacityT

            } else {
                opacityT = 0.3
                return opacityT
            }
        }

        function getOpC(joined, readyBut){
            var opacityC;
            if (joined) {
                if(readyBut) {
                    opacityC = 1
                    return opacityC
                } else {
                    opacityC = 1
                    return opacityC
                }
            } else {
                opacityC = 0.5
                return opacityC
            }
        }

        function getColor(joined, readyBut){
            var color;
            if (joined) {
                if(readyBut) {
                    color = 'green'
                    return color
                } else {
                    color = 'white'
                    return color
                }
            } else {
                color = "#A9A9A9"
                return color
            }
        }

        this.socket.on('updateCircleOn', (color, firstAllowPos) => {
            // console.log(joinedPos)
         
            if (firstAllowPos.playerID != this.playerID){
                setCircles("circle" + String(firstAllowPos.chainPos), 10, "white", 1)
                setTexts("text" + String(firstAllowPos.chainPos), "12px", "normal", 0.5)
            } 
            
        });

        this.socket.on('updateCircleOff', (disPos, playerOnlineIDs) => {
            var pid = disPos.chainPos;
            setCircles("circle" + String(pid), 10, "#A9A9A9", 0.5);
            setTexts("text" + String(pid), "12px", "normal", 0.3);
        
        });


        function resetReadyBut(){
            var readyBut = document.getElementById('button')
            if(readyBut) {
                readyBut.innerHTML = '';
                readyBut.style.backgroundColor = 'white'
                readyBut.style.color = 'black'
                readyBut.style.width = '230px'
                readyBut.style.boxShadow = '0 3px #999'
                readyBut.disabled = true;
            }
            
        }

        function resetCircles(posID, playerID){
            var lastCharID = posID.charAt(posID.length -1)
            if (posID === playerID){
                setCircles("circle" + String(lastCharID), 13, "white", 1);
                setTexts("text" + String(lastCharID), "14px", "bold", 1)
            } else {
                setCircles("circle" + String(lastCharID), 10, "white", 1);
                setTexts("text" + String(lastCharID), "12px", "normal", 0.5)
            }
        }


        function setCircles(circleID, r, color, opacity){
            var circle;
            console.log(circleID)
            console.log("r: "+ r)
            circle = document.getElementById(circleID);
            circle.setAttribute("r",r);
            circle.setAttribute("fill",color);
            circle.setAttribute("fill-opacity", opacity);
        }
        

        function setTexts(textID, size, weight, opacity){
            var text;
            text = document.getElementById(textID);
            text.setAttribute("fill-opacity", opacity);
            text.setAttribute("font-weight", weight);
            text.setAttribute("font-size", size);
        }

  
        this.socket.on('updateRBut', () => {

            document.getElementById('button').addEventListener('click',  () => {
                var readyBut = document.getElementById('button')
                // var readyButText = document.getElementById('readyButText')
				if (this.ready === false) {
                    readyBut.style.backgroundColor = 'red'
                    readyBut.innerHTML = 'Cancel'
                    console.log("false")
                    console.log(readyBut)
                    this.ready = true
                    // clearInterval(countT)
             
                    document.getElementById("clock").innerHTML = "Wait for other players ready.";
                    this.socket.emit('updatingCirCor', this.ready, this.chainPos, this.playerID, this.chainName);
                    this.socket.emit('checkChainReadyState', this.chainName);
                    
              
                } else {
                    // clearInterval(countT)
                    readyBut.style.backgroundColor = 'green'
                    readyBut.innerHTML = 'Ready'
                    document.getElementById("clock").innerHTML = "";

                    this.ready = false
                    // setupCountdown(this.socket);
                    
                    this.socket.emit('updatingCirCor', this.ready, this.chainPos, this.playerID, this.chainName);
                }
			});
        });


        this.socket.on('updatedCirCor', (ready, upStatePos) => {
            // change to green color for all online players
            var circleID = "circle" + String(upStatePos);
            var circle = document.getElementById(circleID);
            if (ready === true) {
                circle.setAttribute("fill", 'green');
            // change to green red for all online players
            } else {
                circle.setAttribute("fill", 'white');
            }
        });


        this.socket.on('showReadyBut', (firstAllowPos, chain) => {
            var readyBut = document.getElementById('button')
            var playerID

            readyBut.disabled = false;
            readyBut.innerHTML = 'Ready';
            readyBut.style.backgroundColor = 'green'
            readyBut.style.color = 'white'
            readyBut.style.width = '70px'
            console.log('chain    '+chain)
            console.log("chain.numOfplayers  "+chain.numOfplayers)
         
            for (var i=1;i<=chain.numOfplayers;i++) {
               
                playerID = String(firstAllowPos.chainName) + String(i);
         
                if (this.playerID === playerID) {
                    if (chain.players[playerID].readyBut){
                        readyBut.innerHTML = 'Cancel';
                        readyBut.style.backgroundColor = 'red'
                    } else {
                        readyBut.innerHTML = 'Ready';
                        readyBut.style.backgroundColor = 'green'
                    }
                }  
                
            }
 
        });


        this.socket.on('resetCircleColor', (playerOnlineIDs) => {
            for (var i=0;i<playerOnlineIDs.length;i++){
                console.log(playerOnlineIDs[i])
                resetCircles(playerOnlineIDs[i], this.playerID)
            }
        });

        this.socket.on('gameReadyStage', (playerIDs, head, chainName) => {
            console.log('chainName in gameReadySatge '+chainName);
            // change button text
            var readyBut = document.getElementById('button')
            readyBut.innerHTML = `Please wait for loading the game interface, <br> 
                            then turn on your carema button in the interface<br> 
                            and wait for the first player P1 to start the game!`;
            readyBut.style.backgroundColor = 'white'
            readyBut.style.color = 'black'
            readyBut.style.width = '400px'
            readyBut.style.height = '50px'
            readyBut.style.boxShadow = 'none'
            readyBut.disabled = true;
            // change the text after button
            document.getElementById("clock").innerHTML = ''
            var headPlayer = String(chainName) + String(head);
            var btPanel= document.getElementById('bottomPanel')
            console.log("gameReady Stage beging!!!!!!!!!!!!!!!!!!!!!!!!!!")
            console.log(this.playerID);
            console.log(chainName);
            console.log(headPlayer);

            var selfID = document.getElementById('selfID')


            if(this.playerID === headPlayer) {
                // var selfID = document.getElementById('selfID')
                selfID.innerHTML = `You are the first player in the chain and please read the game instruction`
        
                console.log("print here as the head player!!!!!")
                btPanel.innerHTML = `<button id="button">
                            Turn on your carema button in the interface.
                        </button>`
                var p1But = document.getElementById('button') 
                p1But.disabled = true;
 
                var text11 = document.getElementById('text11');

                text11.innerHTML = `<div class="text-contain text-header">
                <a><span><div id="leftID">Game Instruction</div><span></a>
                </div>
                <div id="leftscreen"> 
                    <div id = textParagraph>
                        <p>  Please wait for loading the interface and config the setting for the audio and camera once the interface appears.
                        <br>Choose a game level of Australia Sign Language you want to play </p> 
                        <p> 
                        <button id="Beginner">
                            Beginner	
                        </button>
                        <button id="easy">
                            Easy	
                        </button>
                        <button id="Normal">
                            Normal	
                        </button>
                        <button id="Hard">
                            Hard	
                        </button>
                        <button id="Challenging">
                            Challenging	
                        </button>
                    </div>
                </div>`

                document.getElementById('Beginner').addEventListener('click',  () => {
                    var textParagraph = document.getElementById('textParagraph');
                    easyNo = 1 

                    var total = easyNo*(playerIDs.length-2); //2 means last two players
                    var i;

                    fileName = randGenerator(easyNo);
             
                    textParagraph.innerHTML = `<div id=imgSection> 
                            <p> How to play the game?
                            <br> * Learn and copy the sign language from the ${easyNo} image below.
                            <br>* Here are the sample image,
                            the real image will be shown when you start the game.
                            <br>&emsp;<img src="/img/auslan/${fileName[0]}.png" 
                                            style="width:90px;height:70px;">
                            <br>* Send the gesture to next player P2. 
                            <br>* P2 should copy your gesture and add ${easyNo} more image then send to his/her next player P3.
                            <br>* P3 should do the same thing as P2.
                            <br>* P4, P5 should receive all the gesture and find out the correct meaning, then sumbit the answer.
                            <br>* Please let all players know what the game is before starting a game by clicking the button below.
                            </p></div>`
                            
                    var imgDiv = document.getElementById("imgSection");

                    for(i=1;i<easyNo;i++){
                        var newcontent = document.createElement('div');
                        newcontent.innerHTML = `<img src="/img/auslan/${fileName[i]}.png" 
                                    style="width:90px;height:70px;">`;
                        imgDiv.appendChild(newcontent.firstChild);
                    }

                    fileName = randGenerator(total);
                    console.log("fileName" +fileName)
                    console.log("fileName b4 setup" +fileName)
                    setupCountdown(this.socket, playerIDs, headPlayer, chainName, fileName, easyNo)
                });

                document.getElementById('easy').addEventListener('click',  () => {
                    var textParagraph = document.getElementById('textParagraph');
                    var i;
                    easyNo = 2;
                    var total = easyNo*(playerIDs.length-2);
                    fileName = randGenerator(total);
             
                    textParagraph.innerHTML = `<div id=imgSection> 
                            <p> How to play the game?
                            <br> * Learn and copy the sign language from the ${easyNo} images below.
                            <br>* Here are the sample image,
                            the real image will be shown when you start the game.
                            <div id=imgS>&emsp;<img src="/img/auslan/${fileName[0]}.png" 
                                            style="width:90px;height:70px;"></div>
                            * Send the gesture to next player P2. 
                            <br>* P2 should copy your gesture and add ${easyNo} more image then send to his/her next player P3.
                            <br>* P3 should do the same thing as P2.
                            <br>* P4, P5 should receive all the gesture and find out the correct meaning, then sumbit the answer.
                            </p></div>`

                    var imgDiv = document.getElementById("imgS");

                    for(i=1;i<easyNo;i++){
                        var newcontent = document.createElement('div');
                        newcontent.innerHTML = `<img src="/img/auslan/${fileName[i]}.png" 
                                    style="width:90px;height:70px;">`;
                        imgDiv.appendChild(newcontent.firstChild);
                    }

                    fileName = randGenerator(total);
                    console.log("fileName b4 setup" +fileName)
                    setupCountdown(this.socket, playerIDs, headPlayer, chainName, fileName, easyNo)
                });

                document.getElementById('Normal').addEventListener('click',  () => {
                    var textParagraph = document.getElementById('textParagraph');
                    var i;
                    easyNo = 3;
                    var total = easyNo*(playerIDs.length-2);
                    fileName = randGenerator(total);
             
                    textParagraph.innerHTML = `<div id=imgSection> 
                    <p> How to play the game?
                    <br> * Learn and copy the sign language from the ${easyNo} images below.
                    <br>* Here are the sample image,
                    the real image will be shown when you start the game.
                    <div id=imgS>&emsp;<img src="/img/auslan/${fileName[0]}.png" 
                                    style="width:90px;height:70px;"></div>
                    * Send the gesture to next player P2. 
                    <br>* P2 should copy your gesture and add ${easyNo} more image then send to his/her next player P3.
                    <br>* P3 should do the same thing as P2.
                    <br>* P4, P5 should receive all the gesture and find out the correct meaning, then sumbit the answer.
                    </p></div>`
                    var imgDiv = document.getElementById("imgS");

                    for(i=1;i<easyNo;i++){
                        var newcontent = document.createElement('div');
                        newcontent.innerHTML = `<img src="/img/auslan/${fileName[i]}.png" 
                                    style="width:90px;height:70px;">`;
                        imgDiv.appendChild(newcontent.firstChild);
                    }

                    fileName = randGenerator(total);
                    console.log("fileName b4 setup" +fileName)
                    setupCountdown(this.socket, playerIDs, headPlayer, chainName, fileName, easyNo)
                });

                document.getElementById('Hard').addEventListener('click',  () => {
                    var textParagraph = document.getElementById('textParagraph');
                    var i;
                    easyNo = 4;
                    var total = easyNo*(playerIDs.length-2);
                    fileName = randGenerator(total);
             
                    textParagraph.innerHTML = `<div id=imgSection> 
                    <p> How to play the game?
                    <br> * Learn and copy the sign language from the ${easyNo} images below.
                    <br>* Here are the sample image,
                    the real image will be shown when you start the game.
                    <div id=imgS>&emsp;<img src="/img/auslan/${fileName[0]}.png" 
                                    style="width:90px;height:70px;"></div>
                    * Send the gesture to next player P2. 
                    <br>* P2 should copy your gesture and add ${easyNo} more image then send to his/her next player P3.
                    <br>* P3 should do the same thing as P2.
                    <br>* P4, P5 should receive all the gesture and find out the correct meaning, then sumbit the answer.
                    </p></div>`
                    var imgDiv = document.getElementById("imgS");

                    for(i=1;i<easyNo;i++){
                        var newcontent = document.createElement('div');
                        newcontent.innerHTML = `<img src="/img/auslan/${fileName[i]}.png" 
                                    style="width:90px;height:70px;">`;
                        imgDiv.appendChild(newcontent.firstChild);
                    }
                    
                    fileName = randGenerator(total);
                    console.log("fileName b4 setup" +fileName)
                    setupCountdown(this.socket, playerIDs, headPlayer, chainName, fileName, easyNo)
                });

                document.getElementById('Challenging').addEventListener('click',  () => {
                    var textParagraph = document.getElementById('textParagraph');
                    var i;
                    easyNo = 5; 
                    var total = easyNo*(playerIDs.length-2);
                    fileName = randGenerator(total);
             
                    textParagraph.innerHTML = `<div id=imgSection> 
                    <p> How to play the game?
                    <br> * Learn and copy the sign language from the ${easyNo} images below.
                    <br>* Here are the sample image,
                    the real image will be shown when you start the game.
                    <div id=imgS>&emsp;<img src="/img/auslan/${fileName[0]}.png" 
                                    style="width:90px;height:70px;"></div>
                    * Send the gesture to next player P2. 
                    <br>* P2 should copy your gesture and add ${easyNo} more image then send to his/her next player P3.
                    <br>* P3 should do the same thing as P2.
                    <br>* P4, P5 should receive all the gesture and find out the correct meaning, then sumbit the answer.
                    </p></div>`
                    var imgDiv = document.getElementById("imgS");

                    for(i=1;i<easyNo;i++){
                        var newcontent = document.createElement('div');
                        newcontent.innerHTML = `<img src="/img/auslan/${fileName[i]}.png" 
                                    style="width:90px;height:70px;">`;
                        imgDiv.appendChild(newcontent.firstChild);
                    }
                    
                    fileName = randGenerator(total);
                    console.log("fileName b4 setup" +fileName)
                    setupCountdown(this.socket, playerIDs, headPlayer, chainName, fileName, easyNo)
                });

            } else {
                selfID.innerHTML = `Please read the INSTRUCTION at the bottom`
            }
            
        });

        this.socket.on('headPlayerClickCheck', (playerIDs, headPlayer, chainName, fileName, easyNo) => {
            var btPanel= document.getElementById('bottomPanel')
            btPanel.innerHTML = `<button id="headButton">
                            Start a challenge game 
                        </button>`

                var hostBut = document.getElementById('headButton')
                hostBut.style.backgroundColor = 'white'

                var leftID = document.getElementById('leftID')
                leftID.style.backgroundColor = 'blue'
                leftID.innerHTML = 'Game Instruction'


                selfID.innerHTML = `YOUR TURN to START the game.`

                this.socket.emit('updCirPlayingToS', headPlayer, headPlayer, playerIDs);
            

                // game start when the head player click button
                document.getElementById('headButton').addEventListener('click',  () => {
                    var hdBut = document.getElementById('headButton')
                    var nextPlayer;
                    var rightID = document.getElementById('rightID')
                    // var tempPIDs = playerIDs;
                    console.log("fileNamehost" +fileName)
                    var textParagraph = document.getElementById('textParagraph')
                    textParagraph.innerHTML = `<div id=imgSection> 
                    <p> Time is counting now, please enjoy the game!
                    <br> * Learn and copy the sign language from the ${easyNo} image below.
                    <div id=imgS>&emsp;<img src="/img/auslan/${fileName[0]}.png" 
                                    style="width:90px;height:70px;"></div>
                    * Send the gesture to next player.
                    </p></div>
                   `
                    var imgDiv = document.getElementById("imgS");
                    var i;
                    for(i=1;i<easyNo;i++){
                        var newcontent = document.createElement('div');
                        newcontent.innerHTML = `<img src="/img/auslan/${fileName[i]}.png" 
                                    style="width:90px;height:70px;">`;
                        imgDiv.appendChild(newcontent.firstChild);
                    }


                    hdBut.display = 'none'
                    hdBut.disabled = true;
                    this.gameStart = true;
             
                    leftID.style.backgroundColor = '#2e2e2e'
                    rightID.style.backgroundColor = 'blue'

                    // console.log("restIDs " + tempPIDs)
                    // tempPIDs.shift();
                    // nextPlayer = tempPIDs[0]
                    // console.log("restIDs after tempPID shift" + tempPIDs)
                    nextPlayer = playerIDs[1]
                    console.log("restIDs after playerID shift" + playerIDs)

                    this.socket.emit('updCirPlayingToS', headPlayer, nextPlayer, playerIDs);
                    this.socket.emit('hostButtonStatus', this.gameStart, chainName, nextPlayer, playerIDs);
                });
            
        });




        this.socket.on('updCirPlayingToAll', (prevPlayer, curPlayer, playerIDs) => {
            var i;
            console.log("playerIDs     "+playerIDs)
            console.log("prevPlayer     "+prevPlayer)
            console.log("curPlayer     "+curPlayer)
            console.log("this.playerID     "+this.playerID)
            for(i = 0;i<playerIDs.length;i++){
                console.log("playerIDs[i]    " + playerIDs[i])
                var lastCharID = playerIDs[i].charAt(playerIDs[i].length -1)
                var color, size;
                if (playerIDs[i] === prevPlayer || playerIDs[i] === curPlayer) {
                    color = "blue"
                    size = 10
                    setCircles("circle" + String(lastCharID), size, color, 1);
                } else if (parseInt(playerIDs[i]) < parseInt(prevPlayer)){
                    color = "white"
                    size = 10
                    setCircles("circle" + String(lastCharID), size, color, 1);
                } else {
                    color = "green"
                    size = 10
                    setCircles("circle" + String(lastCharID), size, color, 1);

                }

                if (this.playerID === playerIDs[i]) {
                    size = 13
                    setCircles("circle" + String(lastCharID), size, color, 1);
                }

            } 
        });


        this.socket.on('resetUIAfterGamestart', (chainName, head) => {
            setupCountUp()
            var headPlayer = String(chainName) + String(head);
            // var tailPlayer = String(chainName) + String(tail);
            var btPanel= document.getElementById('bottomPanel')
            btPanel.innerHTML = ``
            var selfID= document.getElementById('selfID')

            if (this.playerID === headPlayer){
                selfID.innerHTML = `Game starts and it's YOUR TURN for SENDING the message.`
            } else {
                selfID.innerHTML = `Game starts`
            }
        
        });


        this.socket.on('nextPlayer', (nextPlayer, lenOfChain, playerIDs, easyNo, fileName, comRoomID) => {
            var lastEle = nextPlayer.charAt(nextPlayer.length-1)
            var prevPlayer = String(parseInt(nextPlayer) - 1);
            console.log("lastEle!!!!!!!!!: " + lastEle)
            console.log("String(lenOfChain): " + String(lenOfChain))
            console.log("lenOfChain: " + lenOfChain)
            console.log("nextPlayer: " + playerIDs)

            
            if (lastEle === String(lenOfChain)){
                if (this.playerID === nextPlayer) {
                    console.log("it is in last players")
                    var leftID = document.getElementById('leftID')
                    leftID.style.backgroundColor = 'blue'

                    var bottom = document.getElementById('submit');
                    bottom.innerHTML = 'Finish Game!';
                    bottom.style.display = "inline";

                    var selfID = document.getElementById('selfID')
                    selfID.innerHTML = `Game starts and it's YOUR TURN to finish the game.`

                    var imgSec = document.getElementById('imgSection')
                    imgSec.innerHTML = `<img src="/img/auslan/AZ.png" 
                    style="width:60%;height:50%;margin-left:20%;">`
                    
                    document.getElementById('submit').addEventListener('click',  () => {
                 
                        gameNum = gameNum + 1

                        var leftID = document.getElementById('leftID')
                        
                        leftID.style.backgroundColor = '#2e2e2e'

                        var answer = document.getElementById('answer').value;
                        console.log("answer    "+answer)

                        var text22 = document.getElementById('text22');
                        text22.innerHTML = `<div class="text-contain text-header"><a><span>
                            <div id="rightID">Video chatroom for all players</div><span></a></div>
                            <iframe id="rightscreen" src="https://www.talkroom.io/call/${comRoomID}" frameborder="0" 
                            scrolling="auto" class="frame-area" allow="microphone; camera" > </iframe>`


                        var rightID = document.getElementById('rightID')
                        rightID.style.backgroundColor = 'red'

                        var lastID = playerIDs[playerIDs.length - 1]
                        var nextLastID = parseInt(lastID) + 1

                        // finsh the game
                        if (this.subReady === false) {
                            this.socket.emit('updCirPlayingToS', nextLastID, nextLastID, playerIDs);
                            this.socket.emit('lastPlayerClickBut', prevPlayer, answer, submitTime.replace("Playing time:", ""),gameNum, playerIDs)
                        }        
                    });
                } 
                if (this.playerID === prevPlayer){
                    var text11 = document.getElementById('text11');
                    text11.innerHTML = `<div class="text-contain text-header">
                    <a><span><div id="leftID">Game Information</div><span></a>
                    </div>
                    <div id="leftscreen">
                        <div id = textParagraph> * Please copy all the gestures from previous player <br>
                        * Discuss the correct answer with the last player
                        </div>     
                    </div>`
    
                }
            } else if(this.playerID === nextPlayer) {

                console.log("it is in middle players")
                var btPanel= document.getElementById('bottomPanel')
               
                btPanel.innerHTML = `<button id="button">
                                            Start a turn with the next player
                                    </button>`;
                btPanel.style.display = "inline";

                var leftID = document.getElementById('leftID')
                leftID.style.backgroundColor = 'blue'

                var selfID = document.getElementById('selfID')
                selfID.innerHTML = `Game starts and it's YOUR TURN for RECEIVING the message.`

                // prevPlayer = String(parseInt(nextPlayer) - 1)
                var curPlayer = nextPlayer;
                nextPlayer = String(parseInt(nextPlayer) + 1);

                document.getElementById('button').addEventListener('click',  () => { 
                    var text11 = document.getElementById('text11');
                    fileName.shift()
                    text11.innerHTML = `<div class="text-contain text-header">
                    <a><span><div id="leftID">Game Instruction</div><span></a>
                    </div>
                    <div id="leftscreen"> 
                        <div id = textParagraph>
                        </div>     
                    </div>`
    
                    var textParagraph = document.getElementById('textParagraph')
                  
                    textParagraph.innerHTML = `<div id=imgSection> 
                    <p> Time is counting now, please enjoy the game!
                    <br> * Learn and copy the sign language from the last player and new ${easyNo} images below.
                    <div id=imgS>&emsp;<img src="/img/auslan/${fileName[0]}.png" 
                                    style="width:90px;height:70px;"></div>
                    * Send all gestures to the next player in order.
                    </p></div>`
                    var imgDiv = document.getElementById("imgS");
                    var i;
                    for(i=1;i<easyNo;i++){
                        var newcontent = document.createElement('div');
                        newcontent.innerHTML = `<img src="/img/auslan/${fileName[i]}.png" 
                                    style="width:90px;height:70px;">`;
                        imgDiv.appendChild(newcontent.firstChild);
                    }

                    btPanel.innerHTML = ``
                    leftID.style.backgroundColor = '#2e2e2e'

                    var rightID = document.getElementById('rightID')
                    rightID.style.backgroundColor = 'blue'

                    selfID.innerHTML = `Game starts and it's YOUR TURN for SENDING the message.`

                    this.socket.emit('updCirPlayingToS', curPlayer, nextPlayer, playerIDs);
                    this.socket.emit('updateCurrentPlayer', nextPlayer, lenOfChain, prevPlayer, playerIDs, easyNo, fileName);
                });
            }
        });

        this.socket.on('prevPlayer', (prevPlayer, playerIDs, easyNo, fileName, comRoomID) => {
            var i,l;
            var j = prevPlayer[prevPlayer.length -1];
     
            timeRecord.push(submitTime)
            console.log("playerIDs     " +  playerIDs)
            console.log("playerIDs.length  "+playerIDs.length)
            for(l=0;l<playerIDs.length;l++){
                console.log("---playerIDs[i]    "+playerIDs[l])
                console.log("---qprevPlayer    "+prevPlayer)
                if(parseInt(playerIDs[l])<=parseInt(prevPlayer)){
                    console.log(parseInt(playerIDs[l])<=parseInt(prevPlayer))
                    if (this.playerID === prevPlayer) {
                        var text22 = document.getElementById('text22');
                                text22.innerHTML = `<div class="text-contain text-header"><a><span>
                                    <div id="rightID">Video chatroom for all players</div><span></a></div>
                                    <iframe id="rightscreen" src="https://www.talkroom.io/call/${comRoomID}" frameborder="0" 
                                    scrolling="auto" class="frame-area" allow="microphone; camera" > </iframe>`
        
                        var rightID = document.getElementById('rightID')
                        rightID.style.backgroundColor = 'red'
        
                        var selfID = document.getElementById('selfID')
                        selfID.innerHTML = `Your turn is OVER.`
        
                    } 
                    if(this.playerID === playerIDs[l]) {
                        var text11 = document.getElementById('text11');

                        text11.innerHTML = `<div class="text-contain text-header">
                        <a><span><div id="leftID">Game progress</div><span></a>
                        </div>
                        <div id="leftscreen"> 
                            <div id = textParagraph>
                            </div>     
                        </div>`
        
                        var textParagraph = document.getElementById('textParagraph')
                        
                        for(var k = 0;k<j;k++){
                            var newcontentP = document.createElement('div');
                            newcontentP.innerHTML = `<div id=imgSection${k+1}> 
                            * P${k+1} finished gestures ${timeRecord[k].replace("Playing time:", "at")} <br>
                            </div>`
                            textParagraph.appendChild(newcontentP.firstChild);
                            var imgDiv = document.getElementById(`imgSection${k+1}`);
                          
                            for(i=k*easyNo;i<(k+1)*easyNo;i++){
                             
                                var newcontent = document.createElement('div');
                                newcontent.innerHTML = `<img src="/img/auslan/${fileName[i]}.png" 
                                            style="width:90px;height:70px;">`;
                                imgDiv.appendChild(newcontent.firstChild);
                            }

                        }
                       
                    }
                }
            }
            
                
            
        });

        this.socket.on('changeLastplayer', (playerID) => {
            if(this.playerID == playerID){
                var bottom = document.getElementById('submit');
                // bottom.disabled = true;
                bottom.style.display = 'none'
            }
        });


        this.socket.on('changeInterface', (chain, head, tail) => {
            var i;
            for(i=1;i<=chain.numOfplayers;i++){
                var playerID = '1' + String(i)
                console.log('playerID ' + playerID)
                console.log('this.playerID ' + this.playerID)
                console.log('chain.players[playerID].playerID ' + chain.players[playerID].playerID)
                if(this.playerID == chain.players[playerID].playerID){
                    var text11 = document.getElementById('text11');
                    var text22 = document.getElementById('text22');
                    console.log('this.playerID ' + this.playerID)
                    console.log('chain.players[playerID].link.left ' + chain.players[playerID].link.left)
                    console.log('chain.players[playerID].link.right ' + chain.players[playerID].link.right)
                    var leftLink = chain.players[playerID].link.left;
                    var rightLink = chain.players[playerID].link.right;
                    
                    console.log("peerPlayersright   "+this.peerPlayers.right) //bugs here
                    if (chain.players[playerID].chainPos === String(head)) {
                        text11.innerHTML = `<div class="text-contain text-header"><a><span>
                            <div id="leftID">${this.peerPlayers.left}</div><span></a></div>
                            <iframe id="leftscreen" src="https://www.gstatic.com/webp/gallery3/2.png" frameborder="0" 
                            scrolling="auto" class="frame-area" allow="microphone; camera" > </iframe>`
                        text22.innerHTML = `<div class="text-contain text-header"><a><span>
                            <div id="rightID">${this.peerPlayers.right}</div><span></a></div>
                            <iframe id="rightscreen" src="https://www.talkroom.io/call/${rightLink}" frameborder="0" 
                            scrolling="auto" class="frame-area" allow="microphone; camera" > </iframe>`
                    } else if (chain.players[playerID].chainPos === String(tail)){
                        text11.innerHTML = `<div class="text-contain text-header"><a><span>
                            <div id="leftID">${this.peerPlayers.left}</div><span></a></div>
                            <iframe id="leftscreen" src="https://www.talkroom.io/call/${leftLink}" frameborder="0" 
                            scrolling="auto" class="frame-area" allow="microphone; camera" > </iframe>`
                        text22.innerHTML = `<div class="text-contain text-header">
                                                <a><span><div id="rightID">Game Instruction</div><span></a>
                            </div>
                            <div id="rightscreen"> 
                                <div id = textParagraph> 
                                    <p>* Get all gestures from the last player
                                        <br>* Use australia sign language images to find out the correct answer
                                        <br>* The images will be shown in your turn once the game starts
                                        <br>* Fill our the correct answer in order
                                    </p>
                                    <div id=imgSection> 
                                        
                                    </div>
                                <div>
                                <label for="answer">Write your answer: </label>
                                <input type="text" id="answer" name="name">
                            </div>`
                        
                    } else {
                        text11.innerHTML = `<div class="text-contain text-header"><a><span>
                            <div id="leftID">${this.peerPlayers.left}</div><span></a>
                            <iframe id="leftscreen" src="https://www.talkroom.io/call/${leftLink}" frameborder="0" 
                            scrolling="auto" class="frame-area" allow="microphone; camera" > </iframe></div>`
                        text22.innerHTML = `<div class="text-contain text-header"><a><span>
                            <div id="rightID">${this.peerPlayers.right}</div><span></a></div>
                            <iframe id="rightscreen" src="https://www.talkroom.io/call/${rightLink}" frameborder="0" 
                            scrolling="auto" class="frame-area" allow="microphone; camera" > </iframe>`
                    }
                }
            }      
        });

        this.socket.on('joinedChainRoom', (firstAllowPos, comRoomID, head, tail) => {
            var text11 = document.getElementById('text11');
            text11.innerHTML = `<div class="text-contain text-header">
                                <a><span><div id="leftID">Information</div><span></a>
                                </div>
                                <div id="leftscreen"> 
                                    <div id = textParagraph>
                                        <p>GAME RULE</p>
                                        <p>* All players can chat with each other in video chatroom before or end the game.</p>
                                        <p>* Top right corner panel indicates players online or offline status.
                                        <br>&emsp; The bigger size of circle indicates the player's position in a chain.
                                        <img src="/img/icon/panel.png" style="margin-left:3px;width:130px;height:25px;top:5px;position: relative">
                                        <br>&emsp; The white colour indicates the player is online.
                                        <img src="/img/icon/white.png" style="margin-left:3px;width:25px;height:25px;top:5px;position: relative"">
                                        <br>&emsp; The darkgray colour indicates the player is offline.
                                        <img src="/img/icon/gray.png" style="margin-left:3px;width:25px;height:25px;top:5px;position: relative"">
                                        <br>&emsp; The green colour indicates the player is ready for the game.
                                        <img src="/img/icon/readyC.png" style="margin-left:3px;width:27px;height:25px;top:5px;position: relative"">
                                        </p>
                                        <p>* The 'Ready' button will show at the bottom panel once the player joins in the room.
                                        <img src="/img/icon/ready.png" style="margin-left:3px;width:65px;height:25px;top:5px;position: relative"">
                                        <br>&emsp; The player can click 'Cancel' button if he/she is not ready before the game starts.
                                        <img src="/img/icon/cancel.png" style="margin-left:3px;width:65px;height:25px;top:5px;position: relative"">
                                        </p> 
                                        <p>* The game will start when all players click ‘ready’ buttons.
                                        <br>&emsp; The top right corner panel will shown as 
                                        <img src="/img/icon/allready.png" style="margin-left:3px;width:120px;height:25px;top:5px;position: relative"">
                                        </p>  
                                    </div>
                                </div>`

            var text22 = document.getElementById('text22')
            text22.innerHTML = `<div class="text-contain text-header"><a><span>
                                <div id="rightID">Video chatroom for all players</div><span></a></div>
                                <iframe id="rightscreen" src="https://www.talkroom.io/call/${comRoomID}" frameborder="0" 
                                scrolling="auto" class="frame-area" allow="microphone; camera" > </iframe>`

            document.getElementById("selfID").innerHTML = "You are the Player " + String(firstAllowPos.chainPos) 
            + " of Chain " + String(firstAllowPos.chainName) ;

            if (firstAllowPos.chainPos === head) {
                this.peerPlayers = {'left':'NoScreen','right':'P' + String(head + 1)}
            } else if(firstAllowPos.chainPos === tail){
                this.peerPlayers = {'left':'P' + String(tail - 1),'right':'NoScreen'}
            } else {
                this.peerPlayers = {'left':'P' + String(firstAllowPos.chainPos - 1),'right':'P' + String(firstAllowPos.chainPos + 1)}
          
            }
            console.log("this.peerPlayers  "+ this.peerPlayers)
        });


        this.socket.on('resetPanel', (playerOnlineIDs, comRoomID, head, tail) => {

            var chainName,chainPos;
            for (var i=0;i<playerOnlineIDs.length;i++){
                chainName = playerOnlineIDs[i][0]
                chainPos = parseInt(playerOnlineIDs[i][playerOnlineIDs[i].length - 1])
           
                console.log("chainName " + chainName)
                console.log("chainPos " + chainPos)
                if(this.playerID === String(playerOnlineIDs[i])){
                    var text11 = document.getElementById('text11');
                    text11.innerHTML = `<div class="text-contain text-header">
                                        <a><span><div id="leftID">Information</div><span></a>
                                        </div>
                                            <div id="leftscreen"> 
                                                <div id = textParagraph>
                                                    <p>GAME RULE</p>
                                                    <p>* All players can chat with each other in video chatroom before or end the game.</p>
                                                    <p>* Top right corner panel indicates players online or offline status.
                                                    <br>&emsp; The bigger size of circle indicates the player's position in a chain.
                                                    <img src="/img/icon/panel.png" style="margin-left:3px;width:130px;height:25px;top:5px;position: relative">
                                                    <br>&emsp; The white colour indicates the player is online.
                                                    <img src="/img/icon/white.png" style="margin-left:3px;width:25px;height:25px;top:5px;position: relative"">
                                                    <br>&emsp; The darkgray colour indicates the player is offline.
                                                    <img src="/img/icon/gray.png" style="margin-left:3px;width:25px;height:25px;top:5px;position: relative"">
                                                    <br>&emsp; The green colour indicates the player is ready for the game.
                                                    <img src="/img/icon/readyC.png" style="margin-left:3px;width:27px;height:25px;top:5px;position: relative"">
                                                    </p>
                                                    <p>* The 'Ready' button will show at the bottom panel once the player joins in the room.
                                                    <img src="/img/icon/ready.png" style="margin-left:3px;width:65px;height:25px;top:5px;position: relative"">
                                                    <br>&emsp; The player can click 'Cancel' button if he/she is not ready before the game starts.
                                                    <img src="/img/icon/cancel.png" style="margin-left:3px;width:65px;height:25px;top:5px;position: relative"">
                                                    </p> 
                                                    <p>* The game will start when all players click ‘ready’ buttons.
                                                    <br>&emsp; The top right corner panel will shown as 
                                                    <img src="/img/icon/allready.png" style="margin-left:3px;width:120px;height:25px;top:5px;position: relative"">
                                                    </p>  
                                                </div>
                                        </div>`

                    var text22 = document.getElementById('text22')
                    text22.innerHTML = `<div class="text-contain text-header"><a><span>
                                        <div id="rightID">Video chatroom for all players</div><span></a></div>
                                        <iframe id="rightscreen" src="https://www.talkroom.io/call/${comRoomID}" frameborder="0" 
                                        scrolling="auto" class="frame-area" allow="microphone; camera" > </iframe>`

                    document.getElementById("selfID").innerHTML = "Chain " + String(chainName) + " Player "
                                + String(chainPos);

                    if (chainPos === head) {
                        this.peerPlayers = {'left':'NoScreen','right':'P' + String(head + 1)}
                    } else if(chainPos === tail){
                        this.peerPlayers = {'left':'P' + String(tail - 1),'right':'NoScreen'}
                    } else {
                        this.peerPlayers = {'left':'P' + String(chainPos - 1),'right':'P' + String(chainPos + 1)}
                    }
                }
            }
            
        });


        this.socket.on('gameFinished', (prevPlayer, answer, comRoomID, fileName, playerIDs) => {
      
            var subBut = document.getElementById('submit')
            var clock = document.getElementById('clock')
        

            if (this.playerID === prevPlayer) {

                
                var text22 = document.getElementById('text22');
                text22.innerHTML = `<div class="text-contain text-header"><a><span>
                    <div id="rightID">Video chatroom for all players</div><span></a></div>
                    <iframe id="rightscreen" src="https://www.talkroom.io/call/${comRoomID}" frameborder="0" 
                    scrolling="auto" class="frame-area" allow="microphone; camera" > </iframe>`
                var rightID = document.getElementById('rightID')
                rightID.style.backgroundColor = 'red'

            }

            var text11 = document.getElementById('text11');

            text11.innerHTML = `<div class="text-contain text-header">
                    <a><span><div id="leftID">Game progress</div><span></a>
                    </div>
                    <div id="leftscreen">
                        <div id = textParagraph> * Your team submitted answer is "<span style="color:red;font-size:12px";>${answer}</span>". <br>
                        * Game finished at <span style="color:red;font-size:12px";>${submitTime.replace("Playing time:", "")}</span>.<br>
                        The correct gestures are shown below.<br>
                        </div>     
                    </div>`
    
            var textParagraph = document.getElementById('textParagraph')
                    
            for(var i = 0;i<fileName.length; i++){
            
                var newcontent = document.createElement('div');
                newcontent.innerHTML = `<img src="/img/auslan/${fileName[i]}K.png" 
                            style="width:90px;height:90px;margin-left:3px;">`;
                textParagraph.appendChild(newcontent.firstChild);
                
            }
            // var aZImg = document.createElement('div');
            // aZImg.innerHTML = `<img src="/img/auslan/Az.png" 
            //                     style="width:70%;height:50%;margin-left:3px;"><br>`;
            // textParagraph.appendChild(aZImg.firstChild);


            subBut.style.display = 'none'
            clearInterval(countT);
            clock.innerHTML = ``;

            var selfID = document.getElementById('selfID')
            selfID.innerHTML = `GAME OVER!! Click ready button to replay the game!`

            var leftID = document.getElementById("leftID")
            leftID.innerHTML = 'End Game Information'

            this.ready = false;
            this.socket.emit("replayGame",prevPlayer[0], playerIDs)
        });


        this.socket.on('resetReadyButton', () => {
            this.ready = false;
            clearInterval(countT);
            var btPanel= document.getElementById('bottomPanel')
            btPanel.innerHTML = `<button id="button"></button><p id="clock"></p><button id="submit">
            </button>`
        })

      
        function setupCountdown (socket, playerIDs, headPlayer, chainName, fileName, easyNo) {
            // Set the date we're counting down to
            console.log("fileName after setup" +fileName)
            var countDownDate = 10
            var now = 0
            // Update the count down every 1 second
            countT = setInterval(function() {
        
                // Find the distance between now and the count down date
                var distance = countDownDate - now;
                        
                // Output the result in an element with id="demo"
                document.getElementById("clock").innerHTML =  "Please wait for " + distance + " seconds to start the game";
                    
                // If the count down is over, write some text 
                if (distance < 0) {
                    clearInterval(countT);
                    document.getElementById("clock").innerHTML = "";
                    socket.emit('headPlayerClick',playerIDs, headPlayer, chainName, fileName, easyNo)
                }
                now = now + 1
        
            }, 1000);
        
        }



        function setupCountUp () {
            // Set the date we're counting down to
            var countUp = 0
            var now = 0
            // Update the count down every 1 second
            countT = setInterval(function() {
        
                // Find the distance between now and the count down date
                var distance = countUp + now;

                var hours = Math.floor(distance % (60*60*24)/(60*60));
                var minutes = Math.floor(distance % (60*60)/60);
                var seconds = Math.floor(distance % 60);
                        
                // Output the result in an element with id="demo"
                document.getElementById("clock").innerHTML =  'Playing time: ' + hours + "h " + minutes + "m " + seconds + "s ";
                submitTime = document.getElementById("clock").innerHTML
                // If the count down is over, write some text 
                // if (distance < 0) {
                //     clearInterval(countGame);
                //     document.getElementById("clock").innerHTML = "PAGE EXPIRED";
                //     socket.emit('timeOutShut');
                // }
                now = now + 1
        
            }, 1000);
        
        }

        function randGenerator(numOfRands){
            var nums = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,26];
            var gen_nums = [];
            var randList = [];

            function in_array(array, el) {
                for(var i = 0 ; i < array.length; i++) 
                    if(array[i] == el) return true;
                return false;
            }

            function get_rand(array) {
                var rand = array[Math.floor(Math.random()*array.length)];
                if(!in_array(gen_nums, rand)) {
                    gen_nums.push(rand); 
                    return rand;
                }
                return get_rand(array);
            }

            for(var i = 0; i < numOfRands; i++) {
                randList.push(get_rand(nums));
            }
            return randList;
        }
        

    }

    clickReadyBut(colorRBut) {
        this.socket.emit('clickedRBut', colorRBut);
    }

  
}








