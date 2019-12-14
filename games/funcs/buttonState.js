function resetReadyButState(chainName, playerOnlineIDs, game){
    for(i = 0;i<=playerOnlineIDs.length;i++){
        console.log(playerOnlineIDs[i])
        if (playerOnlineIDs[i]) {
            game.chains[chainName].players[playerOnlineIDs[i]].readyBut = false;
        }
    }
    return game;
}

module.exports = {
    resetReadyButState
}
