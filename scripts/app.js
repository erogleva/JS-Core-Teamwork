$(() => {

    // когато документа се зарежда да изписва
    $(document).on({
        ajaxStart: () => {
            $('#loadingBox').show()
        },
        ajaxStop: () => {
            $('#loadingBox').fadeOut()
        },
    });

    // Зареждане на Sammy
    const app = Sammy('#main', function () {
        this.use('Handlebars', 'hbs');

        // Home
        this.get('#/home', displayHome);
        this.get('index.html', displayHome);
        function displayHome(ctx) {
            ctx.loadPartials({
                header: './temp/common/header.hbs',
                footer: './temp/common/footer.hbs',
                homeForm: './temp/homePage/homeForm.hbs',
                adPreview: './temp/homePage/adPreview.hbs'
            }).then(function () {
                this.partial('./temp/homePage/home.hbs');
            })
        }
        //Login Page
        this.get('#/login', function (ctx) {
            ctx.loadPartials({
                header: './temp/common/header.hbs',
                footer: './temp/common/footer.hbs',
                loginForm: './temp/loginPage/form.hbs',
            }).then(function () {
                this.partial('./temp/loginPage/index.hbs');
            })
        });
        //After login user is redirect to homepage
        this.post('#/login', function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.passwd;
            let loginForm = $('#loginForm');
            console.log(username);
            if(checkUserNameAndPassword(username, password)) {
                auth.login(username, password).then(function (userInfo) {
                    auth.saveSession(userInfo);
                    auth.showInfo('Login successful.');
                    loginForm.find("input[name*='username']").val('');
                    loginForm.find("input[name*='passwd']").val('');
                    displayHome(ctx)
                }).catch(auth.handleError);
            } else {
                auth.showError('invalid username/password');
                loginForm.find("input[name*='username']").val('');
                loginForm.find("input[name*='passwd']").val('');
            }
        });
        function checkUserNameAndPassword(username, password) {
            let usarnameRegex = /[A-z]{3}/g;
            let passRegex = /[A-z\d]{6}/g;
            if (usarnameRegex.test(username) &&  passRegex.test(password)) {
                return true;
            }
            return false;
        }

        //Register Page
        this.get('#/registration', function (ctx) {
            ctx.loadPartials({
                header: './temp/common/header.hbs',
                footer: './temp/common/footer.hbs',
                regForm: './temp/registrationPage/form.hbs',
            }).then(function () {
                this.partial('./temp/registrationPage/index.hbs');
            })
        });
        //After registration user is redirect to homepage
        this.post('#/registration', function (ctx) {
            let username = ctx.params.username;
            let password = ctx.params.passwd;
            let regForm = $('#formRegister');

            if(checkUserNameAndPassword(username, password)) {
                auth.register(username, password).then(function (userInfo) {
                    auth.showInfo('User registration successful.');
                    auth.saveSession(userInfo);
                    let regForm = $('#registerForm');
                    regForm.find("input[name*='username']").val('');
                    regForm.find("input[name*='passwd']").val('');
                   displayHome(ctx)
                }).catch(auth.handleError);
            } else {
                auth.showError('invalid username/password');
                regForm.find("input[name*='username']").val('');
                regForm.find("input[name*='passwd']").val('');
            }
        })

    });

    app.run();
});