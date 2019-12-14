function updateJoinedPlayer (numOfChains, lenOfChain, game) {
    var firstAllowPos = []
    for (i=1;i<=numOfChains;i++){
        for(j=1;j<=lenOfChain;j++){
            var k = String(i).concat(String(j))
            // console.log(game.chains[i].players[k].joined);
            if (game.chains[i].players[k].joined === false){
                firstAllowPos = {"chainName": i,"playerID" : k, "chainPos":j}
                return firstAllowPos;
            }
        }
    }
    return false;
}


function generateLRurl(firstAllowPos, lenOfChain, roomID, game) {
    var id = Number(firstAllowPos.playerID);
    var left = null;
    var right = null;
    var urlLR = [];
    var head = 1;
    var tail = lenOfChain;

    if (firstAllowPos.chainPos === head){
        left = false;
        right = roomID + String(id);
    } else if (firstAllowPos.chainPos === tail){
        left = roomID + String(id - 1);
        right = false;
    } else {
        left = roomID + String(id - 1)
        right = roomID + String(id);
    }
    urlLR = {"left": left, "right": right}
    // console.log("first allow",firstAllowPos)
    // console.log(game.chains[firstAllowPos.chainName].players[firstAllowPos.playerID]);
    game.chains[firstAllowPos.chainName].players[firstAllowPos.playerID].link = urlLR;
    // console.log(game.chains[firstAllowPos.chainName]);
    return [urlLR, game];
}

function findJoinedPlayer (gameChain) {
    var joinedPos = [];
    var totalPlayers = gameChain.numOfplayers;
    var cid = String(gameChain.chainName);
    var pid;

    for(var i = 1;i<=totalPlayers;i++){
        pid = cid.concat(i)
        if (gameChain.players[pid].joined === true) {
            // console.log(pid)
            joinedPos.push(gameChain.players[pid].chainPos);
        }
    }
    return joinedPos;
}

module.exports = {
    updateJoinedPlayer,
    generateLRurl,
    findJoinedPlayer
}