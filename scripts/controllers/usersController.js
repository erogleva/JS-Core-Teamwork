let usersController = (() => {
    function displayRegister(ctx) {
        let templates = {
            regForm: './temp/registration/form.hbs',
            content: './temp/registration/index.hbs'
        };
        utils.loadPage(ctx, templates);
    }

    function displayLogin(ctx) {
        let templates = {
            loginForm: './temp/login/form.hbs',
            content: './temp/login/index.hbs'
        };
        utils.loadPage(ctx, templates);
    }

    function displayUserProfile(ctx) {
        let username = ctx.params.username;

        if (auth.isAuthed()) {
            ctx.loggedUsername = sessionStorage.getItem('username');
        }

        auth.getUserInfo(username).then(function (data) {
            if (data.length === 0) {
                return;
            }

            if (data[0]._id === sessionStorage.getItem('id')) {
                ctx.isOwner = true;
            }

            ctx.data = data[0];

            let templates = {
                content: './temp/profile/index.hbs'
            };
            utils.loadPage(ctx, templates);
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
            if (data[0]._id !== sessionStorage.getItem('id') && sessionStorage.getItem('userRole') !== 'admin') {
                ctx.redirect('#/home');
                return;
            }

            if (sessionStorage.getItem('userRole')) {
                ctx.userRole = true;
            }

            ctx.data = data[0];

            let templates = {
                content: './temp/profile/edit/index.hbs',
                editForm: './temp/profile/edit/form.hbs'
            };
            utils.loadPage(ctx, templates);
        })
    }

    function handleLogin(ctx) {
        let username = ctx.params.username;
        let password = ctx.params.passwd;

        auth.login(username, password).then(function (userInfo) {
            if (userInfo.isBlocked === 'true') {
                notifications.showInfo('You are blocked');
                ctx.redirect('#/home');
                return;
            }
            auth.saveSession(userInfo);
            auth.getUserInfo(sessionStorage.getItem('username')).then(function (data) {
                //if (data[0].userRole) {
                    sessionStorage.setItem('userRole', 'admin')
                //}

                notifications.showInfo('Login successful.');
                ctx.redirect("#/home");
            });
        }).catch(notifications.handleError);
    }

    function handleRegister(ctx) {
        let username = ctx.params.username;
        let password = ctx.params.passwd;
        let confirmPassword = ctx.params.confirmPasswd;
        let email = ctx.params.email;
        let fName = ctx.params.firstName;
        let lName = ctx.params.lastName;
        let phone = ctx.params.phone;
        let avatar = ctx.params.avatar;

        if (!avatar) {
            avatar = 'https://s3.amazonaws.com/wll-community-production/images/no-avatar.png';
        }

        if (password !== confirmPassword) {
            notifications.showError("Passwords do not match.");
            return;
        }

        if (auth.checkUserNameAndPassword(username, password)) {
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
            auth.loginAsStupedUser().then(function (data) {
                auth.saveSession(data);
                notifications.showInfo('Logout successful.');
                ctx.redirect("#/home");
            })
        }).catch(notifications.handleError);
    }

    function handleEditUser(ctx) {
        let avatar = ctx.params.avatar;
        let fName = ctx.params.firstName;
        let lName = ctx.params.lastName;
        let phone = ctx.params.phone;

        auth.getUserInfo(ctx.params.username).then(function (data) {
            let points = data[0].points;

            if (ctx.params.points) {
                points = ctx.params.points;
            }

            auth.editUser(data[0]._id, data[0].username, avatar, data[0].email, phone, fName, lName, points, data[0].userRole).then(function (userInfo) {
                notifications.showInfo('Successfully edited.');

                if (sessionStorage.getItem('userRole') !== 'admin') {
                    auth.saveSession(userInfo);
                }

                ctx.redirect(`#/user/details/${data[0].username}`);
            }).catch(notifications.handleError)
        }).catch(notifications.handleError);
    }

    function handleBanUser(ctx) {
        let username = ctx.params.username;

        auth.getUserInfo(username).then(function (userInfo) {
            userInfo[0].isBlocked = 'true';

            auth.banUser(userInfo[0]._id, userInfo[0]).then(function (data) {
                ctx.redirect(`#/user/details/${userInfo[0].username}`);
            })
        }).catch(notifications.handleError)
    }

    function handleUnbanUser(ctx) {
        let username = ctx.params.username;

        auth.getUserInfo(username).then(function (userInfo) {
            userInfo[0].isBlocked = '';

            auth.banUser(userInfo[0]._id, userInfo[0]).then(function (data) {
                notifications.showInfo(username + ' is active again');
                ctx.redirect(`#/user/details/${userInfo[0].username}`);
            })
        }).catch(notifications.handleError)
    }

    return {
        displayRegister,
        displayLogin,
        handleRegister,
        handleLogout,
        handleLogin,
        displayUserProfile,
        displayEditUser,
        handleEditUser,
        handleBanUser,
        handleUnbanUser
    }
})();