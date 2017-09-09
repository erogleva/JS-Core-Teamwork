let msgService = (() => {
    function getReceivedMessages() {
        let username = sessionStorage.getItem('username');
        let endpoint = `msg?query={"recipient":"${username}"}`;
        return requester.get('appdata', endpoint);
    }

    function getSentMessages() {
        let username = sessionStorage.getItem('username');
        let endpoint = `msg?query={"sender":"${username}"}`;
        return requester.get('appdata', endpoint);
    }

    function getSingleMessage(id) {
        let endpoint = `msg?query={"_id":"${id}"}`;
        return requester.get('appdata', endpoint);
    }

    function findAnswer(id) {
        let endpoint = `msg?query={"answer":"${id}"}`;
        return requester.get('appdata', endpoint);
    }

    function createNewMessageThread(recipient, sender, title, text) {
        let isOpen = "unread";
        return requester.post('appdata', 'msg', {recipient, sender, title, text, isOpen})
    }

    function sendMsg(answer, sender, recipient, text) {
        return requester.post('appdata', 'msg', {answer, sender, recipient, text});
    }

    return {
        getReceivedMessages,
        getSingleMessage,
        findAnswer,
        sendMsg,
        getSentMessages,
        createNewMessageThread
    }
})();