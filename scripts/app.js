$(() => {
    const app = Sammy('#main', function () {
        Handlebars.registerHelper("len", function (json) {
            return Object.keys(json).length;
        });

        this.use('Handlebars', 'hbs');


        //home
        this.get('#/home', homeController.displayHome);

        this.get('index.html', homeController.displayHome);

        //users
        this.get('#/login', usersController.displayLogin);

        this.post('#/login', usersController.handleLogin);

        this.get('#/registration', usersController.displayRegister);

        this.post('#/registration', usersController.handleRegister);

        this.get('#/logout', usersController.handleLogout);

        this.get('#/user/details/:username', usersController.displayUserProfile);

        this.get('#/user/edit/:username', usersController.displayEditUser);

        this.post('#/user/edit/:username', usersController.handleEditUser);

        this.get('#/user/ban/:username', usersController.handleBanUser);

        this.get('#/user/unban/:username', usersController.handleUnbanUser);

        //ads
        this.get('#/create', adsController.displayCreateAd);

        this.post('#/create', adsController.handleCreateAd);

        this.get('#/ads/details/:id', adsController.displayDetailsAd);

        this.get('#/edit/:id', adsController.displayEditAd);

        this.post('#/edit/:id', adsController.handleEditAd);

        this.get('#/delete/:id', adsController.handleDeleteAd);

        this.get('#/user/ads/:username', adsController.displayUserAds);

        //messages
        this.get('#/user/messages', messagesController.displayMessages);

        this.get('#/user/message/:id', messagesController.displayMessageThread);


        this.post('#/user/message/:id', messagesController.handleSendMessageInThread);

        this.get('#/message/send/:username', messagesController.displaySendMsg);

        this.post('#/message/send/:username', messagesController.handleNewMessageThread);

        //admin
        this.get('#/admin/brands', adminController.displayBrands);

        this.get('#/admin/brands/new', adminController.displayNewBrand);

        this.post('#/admin/brands/new', adminController.handleNewBrand);

        this.get('#/admin/brands/edit/:name', adminController.displayEditBrand);

        this.post('#/admin/brands/edit/:brand', adminController.handleEditBrand);

        this.get('#/admin/brands/delete/:name', adminController.handleDeleteBrand);

        this.get('#/admin/models', adminController.displayModels);

        this.get('#/admin/models/delete/:brand/:name', adminController.handleDeleteModel);

        this.get('#/admin/models/add/:name', adminController.displayAddModel);

        this.post('#/admin/models/add/:brand', adminController.handleAddModel);

        this.get('#/admin/models/edit/:brand/:model', adminController.displayEditModel);

        this.post('#/admin/models/edit/:brand/:model', adminController.handleEditModel);

        //comments
        this.post('#/ads/details/add/comments/:id', commentsController.handleAdsComment);

        this.get('#/ads/comments/delete/:id/:ad_id', commentsController.handleDeleteComment);

        this.get('#/comment/:id', commentsController.displayCreateAdComment);

        this.get('#/search/:query', displaySearch);

        this.get('#/search/brand/:query', displaySearch);

        function displaySearch(ctx) {
            let query = ctx.params.query;

            brandService.getAllBrands().then(function (categories) {
                ctx.category = categories;
                ctx.message = `Results for: "${query}"`;

                adsService.getAds().then(function (data) {
                    data = data.filter(ad => ad.title.toLowerCase().indexOf(query.toLowerCase()) !== -1);

                    for (let ad of data) {
                        ad.description = ad.description.substring(0, 15) + "...";
                    }

                    ctx.ads = data;
                    let partialsObject = utils.getCommonElements(ctx);
                    partialsObject["content"] = './temp/home/index.hbs';
                    partialsObject["ad"] = './temp/ads/ad.hbs';

                    ctx.loadPartials(partialsObject).then(function () {
                        this.partial('./temp/common/main.hbs');
                    })
                });
            }).catch(notifications.handleError)
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

    function start() {
        auth.loginAsStupedUser().then(function (data) {
            auth.saveSession(data);
            app.run();
        })
    }

    start();
});