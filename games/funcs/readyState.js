function checkGameReady(chain){
    var numPlayers = chain.numOfplayers;
    var chainName = chain.chainName;
    var playerID, playerIDlist = [];
    for(i = 1;i<=numPlayers;i++){
        playerID = String(chainName).concat(String(i))
        if (chain.players[playerID].joined === true){
            playerIDlist.push(playerID)
        }
    }
    if(playerIDlist.length === numPlayers){
        return true
    }
    return false
}


function checkChainReadyStates(chainName, playerOnlineIDs, game){
    var numOfReady = 0;
    for(i = 0;i<=playerOnlineIDs.length;i++){
        console.log(playerOnlineIDs[i])
        if (playerOnlineIDs[i]) {
            if (game.chains[chainName].players[playerOnlineIDs[i]].readyBut === true){
                numOfReady = numOfReady + 1
            }
        }
    }
    if (numOfReady === playerOnlineIDs.length) {
        return true
    }
    return false
}


module.exports = {
    checkGameReady,
    checkChainReadyStates
}