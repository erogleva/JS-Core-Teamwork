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
        
        this.get('#/user/details/:username', displayUserProfil);

        this.get('#/user/edit/:username', displayEditUser);

        this.post('#/user/edit/:username', handleEditUser);

        function handleEditUser(ctx) {
            let username = ctx.params.username;
            let avatar = ctx.params.avatar;
            let email = ctx.params.email;
            let fName = ctx.params.firstName;
            let lName = ctx.params.lastName;
            let phone = ctx.params.phone;
            auth.editUser(username, avatar, email, phone, fName, lName).then(function (userInfo) {
                    notifications.showInfo('User registration successful.');
                    auth.saveSession(userInfo);
                    ctx.redirect(`#/user/details/${username}`);
                }).catch(notifications.handleError);
        }
        
        function displayUserProfil(ctx) {
            if (auth.isAuthed()) {
                ctx.username = sessionStorage.getItem('username');
            }
            auth.userInfo().then(function (data) {
                if( data._id === sessionStorage.getItem('id')) {
                    ctx.isOuner = true;
                } else {
                    ctx.isOuner = '';
                }
                ctx.data = data;
                ctx.loadPartials({
                    header: './temp/common/header.hbs',
                    footer: './temp/common/footer.hbs',
                    homeForm: './temp/homePage/homeForm.hbs',
                    content: './temp/userProfil/index.hbs'
                }).then(function () {
                    this.partial('./temp/common/main.hbs');
                })
            })
        }

        function displayEditUser(ctx) {
            if (auth.isAuthed()) {
                ctx.username = sessionStorage.getItem('username');
            }
            auth.userInfo().then(function (data) {
                if( data._id !== sessionStorage.getItem('id')) {
                    ctx.redirect('#/home');
                }
                ctx.data = data;
                ctx.loadPartials({
                    header: './temp/common/header.hbs',
                    footer: './temp/common/footer.hbs',
                    homeForm: './temp/homePage/homeForm.hbs',
                    regForm: './temp/userProfil/editProfil/form.hbs',
                    content: './temp/userProfil/editProfil/index.hbs'
                }).then(function () {
                    this.partial('./temp/common/main.hbs');
                })
            })
        }

        function displayHome(ctx) {
            if (auth.isAuthed()) {
                ctx.username = sessionStorage.getItem('username');
            }

            ctx.loadPartials({
                header: './temp/common/header.hbs',
                footer: './temp/common/footer.hbs',
                homeForm: './temp/homePage/homeForm.hbs',
                adPreview: './temp/homePage/adPreview.hbs',
                content: './temp/homePage/home.hbs'
            }).then(function () {
                this.partial('./temp/common/main.hbs');
            })
        }

        function displayLogin(ctx) {
            ctx.loadPartials({
                header: './temp/common/header.hbs',
                footer: './temp/common/footer.hbs',
                loginForm: './temp/loginPage/form.hbs',
                content: './temp/loginPage/index.hbs'
            }).then(function () {
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
            ctx.loadPartials({
                header: './temp/common/header.hbs',
                footer: './temp/common/footer.hbs',
                regForm: './temp/registrationPage/form.hbs',
                content: './temp/registrationPage/index.hbs'
            }).then(function () {
                this.partial('./temp/common/main.hbs');
            })
        }

        function handleRegister(ctx) {
            let username = ctx.params.username;
            let password = ctx.params.passwd;
            let avatar = ctx.params.avatar;
            let email = ctx.params.email;
            let fName = ctx.params.firstName;
            let lName = ctx.params.lastName;
            let phone = ctx.params.phone;

            let confirmPassword = ctx.params.confirmPasswd;

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

        function checkUserNameAndPassword(username, password) {
            let usernameRegex = /[A-z]{3}/g;
            let passRegex = /[A-z\d]{6}/g;

            return (usernameRegex.test(username) && passRegex.test(password));
        }
    });
    app.run();
});