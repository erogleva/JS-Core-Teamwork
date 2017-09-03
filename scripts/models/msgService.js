let msg = (() => {
    function getMsg() {
        let username = sessionStorage.getItem('username');
        let endpoint = `msg?query={"recipient":"${username}"}&sort={"_kmd.ect": -1}`;
        return requester.get('appdata', endpoint);
    }
    function getSendMsg() {
        let username = sessionStorage.getItem('username');
        let endpoint = `msg?query={"sender":"${username}"}&sort={"_kmd.ect": -1}`;
        return requester.get('appdata', endpoint);
    }

    function getSingleMsg(id) {
        let endpoint = `msg?query={"_id":"${id}"}`;
        return requester.get('appdata', endpoint);
    }

    function foundAnswer(id) {
        let endpoint = `msg?query={"answer":"${id}"}`;
        return requester.get('appdata', endpoint);
    }

    function sendMsg(answer, sender, recipient, text) {
        return requester.post('appdata', 'msg', {answer, sender, recipient, text});
    }
    return {
        getMsg,
        getSingleMsg,
        foundAnswer,
        sendMsg,
        getSendMsg,
    }
})();