function start(){
    var startTime;
    startTime = new Date();
    return startTime
}

function end(){
    var endTime;
    endTime = new Date();
    return endTime;
}

module.exports = {
    start,
    end
}