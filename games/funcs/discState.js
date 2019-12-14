function findDisSocketID(socketID, game, numOfChains, lenOfChain) {
    for (i=1;i<=numOfChains;i++){
        for(j=1;j<=lenOfChain;j++){
            var k = String(i).concat(String(j))
            // console.log(game.chains[i].players[k].joined);
            if (game.chains[i].players[k].socketID === socketID){
                disPos = {"chainName": i,"playerID" : k, "chainPos":j}
                return disPos;
          
            }
        }
    }
    return false;
}


function getOnlinePlayerID(chain){
    console.log(chain)
    var numPlayers = chain.numOfplayers;
    var chainName = chain.chainName;
    var playerID, playerIDlist = [];
    for(i = 1;i<=numPlayers;i++){
        playerID = String(chainName).concat(String(i))
        if (chain.players[playerID].joined === true){
            playerIDlist.push(playerID)
        }
    }
    return playerIDlist;
}



module.exports = {
    findDisSocketID,
    getOnlinePlayerID
}