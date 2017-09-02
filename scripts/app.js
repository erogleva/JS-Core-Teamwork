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

        function checkUserNameAndPassword(username, password) {
            let usernameRegex = /[A-z]{3}/g;
            let passRegex = /[A-z\d]{6}/g;

            return (usernameRegex.test(username) && passRegex.test(password));
        }

        function displayHome(ctx) {
            if (auth.isAuthed()) {
                ctx.user = sessionStorage.getItem('username');
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
            let confirmPassword = ctx.params.confirmPasswd;

            if (password !== confirmPassword) {
                notifications.showError("Passwords do not match.");
                return;
            }

            if (checkUserNameAndPassword(username, password)) {
                auth.register(username, password).then(function (userInfo) {
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
    });
    app.run();
});