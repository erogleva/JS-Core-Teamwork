let messagesController = (() => {
    function displayMessages(ctx) {
        if (!usersService.isAuthed()) {
            ctx.redirect('#/home');
            return;
        }

        let allMessages = [];

        msgService.getSentMessages().then(function (data) {
            for (let message of data) {
                message.username = message.recipient;

                if (message.title) {
                    message['time'] = utils.calcTime(message._kmd.ect);
                    allMessages.push(message);
                }
            }

            msgService.getReceivedMessages().then(function (data) {
                for (let message of data) {
                    message.username = message.sender;

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

                let templates = {
                    content: './temp/messages/inbox/index.hbs',
                    message: './temp/messages/inbox/message.hbs'
                };

                utils.loadPage(ctx, templates);
            });
        });
    }

    function displayMessageThread(ctx) {
        let id = ctx.params.id;

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

                        usersService.getUserInfo(username).then(function (userInfo) {
                            message['avatar'] = userInfo[0].avatar;
                            message.style = 'left';
                        });
                    }

                    message['time'] = utils.calcTime(message._kmd.ect);
                    ctx.answer = answer;
                    console.log(ctx.answer);
                }

                let templates = {
                    content: './temp/messages/thread/index.hbs',
                    form: './temp/messages/thread/form.hbs'
                };

                utils.loadPage(ctx, templates);
            })
        })
    }

    function displaySendMsg(ctx) {
        ctx.recipient = ctx.params.username;

        let templates = {
            content: './temp/messages/send/index.hbs',
            form: './temp/messages/send/form.hbs'
        };

        utils.loadPage(ctx, templates);
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