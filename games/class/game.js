class Game {
    constructor(numOfChains, lenOfChain) {
        this.numOfChains = numOfChains;
        this.lenOfChain = lenOfChain;
        this.start = false;
        this.chains = {};
        this.gameReady = [];
        this.gameResults = [];

        var i;
        var chainName;
        for (i = 1; i <= numOfChains; i++) {
            chainName = String(i)
            console.log(chainName)
            var eachChain = new Chain(lenOfChain, chainName);
            // this.chains.push({chainName: chainName, chainObj: eachChain})
            this.chains[chainName] = eachChain;
            this.gameReady.push({chainName:false})
            this.gameResults.push({chainName:null,'game':null,'level':null,'submitAns':null,'correctAns':null,'submitTime':null})
        } 
    }
}

class Player {
    constructor(playerID, chainPos, chainName){
        this.playerID = playerID;
        this.chainPos = chainPos;
        this.chainName = chainName;
        this.joined = false;
        this.link = null;
        this.ipAddr = null;
        this.socketID = null;
        this.readyBut = false;
    }
}


class Chain {
    constructor(numOfplayers, chainName){
        this.players = {};
        this.numOfplayers = numOfplayers;
        this.chainName = chainName;
        this.chainReady = false;
        this.gameLevel = null;
        this.gameLvlImgN = [];
        // this.result = [];

        var i;
        var playerID;
        var playerPos;
        for (i = 1; i <= numOfplayers; i++) {
            playerID = chainName.concat(String(i))
            // console.log(playerID)
            playerPos = String(i)
            var eachPlayer = new Player(playerID, playerPos, chainName);
            // this.players.push({playerID: playerID, playerObj: eachPlayer})
            // console.log(eachPlayer)
            this.players[playerID] = eachPlayer;

        } 
    }
}

module.exports = Game;