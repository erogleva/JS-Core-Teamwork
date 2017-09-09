let messagesController = (()=>{
    function displayMessages(ctx) {
        if (!auth.isAuthed()) {
            ctx.redirect('#/home');
            return;
        }

        let allMessages = [];

        msgService.getSentMessages().then(function (data) {
            for (let message of data) {
                if (message.title) {
                    message['time'] = utils.calcTime(message._kmd.ect);
                    allMessages.push(message);
                }
            }

            msgService.getReceivedMessages().then(function (data) {
                for (let message of data) {
                    if (message.title) {
                        message['time'] = utils.calcTime(message._kmd.ect);
                        allMessages.push(message);
                    }
                }

                allMessages = allMessages.sort((a, b) => {
                    if (a._kmd.ect > b._kmd.ect) {
                        return -1;
                    } else {
                        return 1;
                    }
                });

                ctx.data = allMessages;

                let partialsObject = utils.getCommonElements(ctx);
                partialsObject["content"] = './temp/messages/inbox/index.hbs';
                partialsObject["message"] = './temp/messages/inbox/message.hbs';

                brandService.getAllBrands().then(function (categories) {
                    ctx.category = categories;

                    ctx.loadPartials(partialsObject).then(function () {
                        this.partial('./temp/common/main.hbs');
                    })
                })
            });
        });
    }

    function displayMessageThread(ctx) {
        let id = ctx.params.id;

        brandService.getAllBrands().then(function (brandInfo) {
            ctx.category = brandInfo;

            msgService.getSingleMessage(id).then(function (data) {
                data[0]['time'] = utils.calcTime(data[0]._kmd.ect);

                if (data[0].sender === sessionStorage.getItem('username')) {
                    data[0].style = 'right';
                    data[0].avatar = sessionStorage.getItem('avatar')
                } else {
                    data[0].style = 'left';
                }

                ctx.data = data[0];

                msgService.findAnswer(id).then(function (answer) {
                    for (let message of answer) {
                        if (message.sender === sessionStorage.getItem('username')) {
                            message.avatar = sessionStorage.getItem('avatar');
                            message.style = 'right';
                        } else {
                            let username = message.sender;

                            auth.getUserInfo(username).then(function (userInfo) {
                                message['avatar'] = userInfo[0].avatar;
                                message.style = 'left';
                            });
                        }

                        message['time'] = utils.calcTime(message._kmd.ect);
                        ctx.answer = answer;
                        console.log(ctx.answer);
                    }

                    let partialsObject = utils.getCommonElements(ctx);
                    partialsObject["content"] = './temp/messages/thread/index.hbs';
                    partialsObject["form"] = './temp/messages/thread/form.hbs';

                    ctx.loadPartials(partialsObject).then(function () {
                        this.partial('./temp/common/main.hbs');
                    })
                })
            })
        })
    }

    function displaySendMsg(ctx) {
        ctx.recipient = ctx.params.username;

        let partialsObject = utils.getCommonElements(ctx);
        partialsObject["content"] = './temp/messages/send/index.hbs';
        partialsObject["form"] = './temp/messages/send/form.hbs';

        brandService.getAllBrands().then(function (categories) {
            ctx.category = categories;

            ctx.loadPartials(partialsObject).then(function () {
                this.partial('./temp/common/main.hbs');
            })
        })
    }

    function handleNewMessageThread(ctx) {
        let recipient = ctx.params.username;
        let sender = sessionStorage.getItem('username');
        let text = ctx.params.description;
        let title = ctx.params.title;

        msgService.createNewMessageThread(recipient, sender, title, text).then(function () {
            notifications.showInfo('Message successfully sent.');
            ctx.redirect('#/user/messages');
        }).catch(notifications.handleError)
    }

    function handleSendMessageInThread(ctx) {
        let sender = sessionStorage.getItem('username');
        let answer = ctx.params.id;
        let text = ctx.params.msgText;
        let recipient = ctx.params.recipient;

        msgService.sendMsg(answer, sender, recipient, text).then(function () {
            ctx.redirect(`#/user/message/${answer}`);
        })
    }

    return {
        displaySendMsg,
        displayMessageThread,
        displayMessages,
        handleSendMessageInThread,
        handleNewMessageThread
    }
})();