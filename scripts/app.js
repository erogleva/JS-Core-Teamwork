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

        function displayHome(ctx) {
            if (auth.isAuthed()) {
                ctx.loggedUsername = sessionStorage.getItem('username');
            }

            let partialsObject = getCommonElements(ctx);
            partialsObject["homeForm"] = './temp/homePage/homeForm.hbs';
            partialsObject["adPreview"] = './temp/homePage/adPreview.hbs';
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
    });
    app.run();
});