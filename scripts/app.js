$(() => {
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        this.get('#/home', displayHome);

        this.get('index.html', displayHome);

        this.get('#/login', displayLogin);

        this.post('#/login', handleLogin);

        this.get('#/registration', displayRegister);

        this.post('#/registration', handleRegister);

        this.get('#/logout', handleLogout);

        this.get('#/user/details/:username', displayUserProfile);

        this.get('#/user/edit/:username', displayEditUser);

        this.post('#/user/edit/:username', handleEditUser);

        this.get('#/create', displayCreateAd);

        this.get('#/user/messages', displayMessages);

        this.get('#/user/message/:id', displayMessage);

        this.post('#/user/message/:id', handleSendMessageInThread);

        this.get('#/message/send/:username', displaySendMsg);

        this.post('#/message/send/:username', handleNewMessageThread);

        function displayHome(ctx) {
            if (auth.isAuthed()) {
                ctx.loggedUsername = sessionStorage.getItem('username');
            }

            let partialsObject = getCommonElements(ctx);
            partialsObject["homeForm"] = './temp/homePage/homeForm.hbs';
            partialsObject["content"] = './temp/homePage/home.hbs';

            ctx.loadPartials(partialsObject).then(function () {
                this.partial('./temp/common/main.hbs');
            })
        }

        function displayLogin(ctx) {
            let partialsObject = getCommonElements(ctx);
            partialsObject["loginForm"] = './temp/loginPage/form.hbs';
            partialsObject["content"] = './temp/loginPage/index.hbs';

            ctx.loadPartials(partialsObject).then(function () {
                this.partial('./temp/common/main.hbs');
            })
        }

        function handleLogin(ctx) {
            let username = ctx.params.username;
            let password = ctx.params.passwd;
            let loginForm = $('#loginForm');

            auth.login(username, password).then(function (userInfo) {
                auth.saveSession(userInfo);
                notifications.showInfo('Login successful.');
                ctx.redirect("#/home");
            }).catch(notifications.handleError);
        }

        function displayRegister(ctx) {
            let partialsObject = getCommonElements(ctx);
            partialsObject["regForm"] = './temp/registrationPage/form.hbs';
            partialsObject["content"] = './temp/registrationPage/index.hbs';

            ctx.loadPartials(partialsObject).then(function () {
                this.partial('./temp/common/main.hbs');
            })
        }

        function handleRegister(ctx) {
            let username = ctx.params.username;
            let password = ctx.params.passwd;
            let confirmPassword = ctx.params.confirmPasswd;
            let avatar = ctx.params.avatar;
            let email = ctx.params.email;
            let fName = ctx.params.firstName;
            let lName = ctx.params.lastName;
            let phone = ctx.params.phone;

            if (password !== confirmPassword) {
                notifications.showError("Passwords do not match.");
                return;
            }

            if (checkUserNameAndPassword(username, password)) {
                auth.register(username, password, avatar, email, phone, fName, lName).then(function (userInfo) {
                    notifications.showInfo('User registration successful.');
                    auth.saveSession(userInfo);
                    ctx.redirect("#/home");
                }).catch(notifications.handleError);
            } else {
                notifications.showError('Invalid username/password.');
            }
        }

        function handleLogout(ctx) {
            auth.logout().then(function () {
                sessionStorage.clear();
                notifications.showInfo('Logout successful.');
                ctx.redirect("#/home");
            }).catch(notifications.handleError);
        }

        function displayUserProfile(ctx) {
            let username = ctx.params.username;
            if (auth.isAuthed()) {
                ctx.loggedUsername = sessionStorage.getItem('username');
            }
            auth.getUserInfo(username).then(function (data) {
                if (data[0]._id === sessionStorage.getItem('id')) {
                    ctx.isOwner = true;
                }
                ctx.data = data[0];

                let partialsObject = getCommonElements(ctx);
                partialsObject["content"] = './temp/userProfile/index.hbs';
                ctx.loadPartials(partialsObject).then(function () {
                    this.partial('./temp/common/main.hbs');
                })
            })
        }

        function displayEditUser(ctx) {
            if (!auth.isAuthed()) {
                ctx.redirect("#/home");
                return;
            }

            let username = ctx.params.username;
            ctx.loggedUsername = sessionStorage.getItem('username');

            auth.getUserInfo(username).then(function (data) {
                if (data[0]._id !== sessionStorage.getItem('id')) {
                    ctx.redirect('#/home');
                    return;
                }

                ctx.data = data[0];

                let partialsObject = getCommonElements(ctx);
                partialsObject["editForm"] = './temp/userProfile/editProfile/form.hbs';
                partialsObject["content"] = './temp/userProfile/editProfile/index.hbs';

                ctx.loadPartials(partialsObject).then(function () {
                    this.partial('./temp/common/main.hbs');
                })
            })
        }

        function handleEditUser(ctx) {
            let avatar = ctx.params.avatar;
            let fName = ctx.params.firstName;
            let lName = ctx.params.lastName;
            let phone = ctx.params.phone;

            auth.getUserInfo(ctx.params.username).then(function (data) {
                auth.editUser(data[0].username, avatar, data[0].email, phone, fName, lName, data[0].points).then(function (userInfo) {
                    notifications.showInfo('Successfully edited.');
                    auth.saveSession(userInfo);
                    ctx.redirect(`#/user/details/${data[0].username}`);
                }).catch(notifications.handleError)
            }).catch(notifications.handleError);
        }

        function displayCreateAd(ctx) {
            if (!auth.isAuthed()) {
                ctx.redirect("#/home");
                return;
            }

            let partialsObject = getCommonElements(ctx);
            partialsObject["createForm"] = './temp/ads/create/form.hbs';
            partialsObject["content"] = './temp/ads/create/index.hbs';

            ctx.loadPartials(partialsObject).then(function () {
                this.partial('./temp/common/main.hbs');
            })
        }

        function displayMessages(ctx) {
            if (!auth.isAuthed()) {
                ctx.redirect('#/home');
                return;
            }

            let allMessages = [];
            msgService.getSentMessages().then(function (data) {
                for (let message of data) {
                    if (message.title) {
                        message['time'] = calcTime(message._kmd.ect);
                        allMessages.push(message);
                    }
                }

                msgService.getReceivedMessages().then(function (data) {
                    for (let message of data) {
                        if (message.title) {
                            message['time'] = calcTime(message._kmd.ect);
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

                    let partialsObject = getCommonElements(ctx);
                    partialsObject["content"] = './temp/userProfile/msgBox/index.hbs';
                    partialsObject["msgTemp"] = './temp/userProfile/msgBox/msgTemp.hbs';

                    ctx.loadPartials(partialsObject).then(function () {
                        this.partial('./temp/common/main.hbs');
                    })
                });
            });
        }

        function displayMessage(ctx) {
            let id = ctx.params.id;

            msgService.getSingleMessage(id).then(function (data) {
                data[0]['time'] = calcTime(data[0]._kmd.ect);

                if (data[0].sender === sessionStorage.getItem('username')) {
                    data[0].style = 'right';
                } else {
                    data[0].style = 'left';
                }

                ctx.data = data[0];

                //TODO Avatar promise resolves later
                msgService.findAnswer(id).then(function (answer) {
                    for (let message of answer) {
                        let username = message.sender;

                        auth.getUserInfo(username).then(function (userInfo) {
                            message['avatar'] = userInfo[0].avatar;
                        });

                        message['time'] = calcTime(message._kmd.ect);

                        if (message.sender === sessionStorage.getItem('username')) {
                            message.style = 'right';
                        } else {
                            message.style = 'left';
                        }
                    }

                    ctx.answer = answer;

                    let partialsObject = getCommonElements(ctx);
                    partialsObject["content"] = './temp/userProfile/msgBox/singleMsg.hbs';
                    partialsObject["sendMsg"] = './temp/userProfile/msgBox/singleMsg/form.hbs';

                    ctx.loadPartials(partialsObject).then(function () {
                        this.partial('./temp/common/main.hbs');
                    })
                })
            })
        }

        function displaySendMsg(ctx) {
            ctx.recipient = ctx.params.username;

            let partialsObject = getCommonElements(ctx);
            partialsObject["content"] = './temp/sendMsg/index.hbs';
            partialsObject["sendMsgForm"] = './temp/sendMsg/form.hbs';

            ctx.loadPartials(partialsObject).then(function () {
                this.partial('./temp/common/main.hbs');
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

        function checkUserNameAndPassword(username, password) {
            let usernameRegex = /[A-z]{3}/g;
            let passRegex = /[A-z\d]{6}/g;

            return (usernameRegex.test(username) && passRegex.test(password));
        }

        function getCommonElements(ctx) {
            if (auth.isAuthed()) {
                ctx.loggedUsername = sessionStorage.getItem('username');
            }

            return {
                'header': './temp/common/header.hbs',
                'footer': './temp/common/footer.hbs',
                'leftColumn': './temp/common/leftColumn.hbs'
            };
        }

        function calcTime(dateIsoFormat) {
            let diff = new Date - (new Date(dateIsoFormat));
            diff = Math.floor(diff / 60000);
            if (diff < 1) return 'less than a minute';
            if (diff < 60) return diff + ' minute' + pluralize(diff);
            diff = Math.floor(diff / 60);
            if (diff < 24) return diff + ' hour' + pluralize(diff);
            diff = Math.floor(diff / 24);
            if (diff < 30) return diff + ' day' + pluralize(diff);
            diff = Math.floor(diff / 30);
            if (diff < 12) return diff + ' month' + pluralize(diff);
            diff = Math.floor(diff / 12);
            return diff + ' year' + pluralize(diff);

            function pluralize(value) {
                if (value !== 1) return 's';
                else return '';
            }
        }
    });
    app.run();
});