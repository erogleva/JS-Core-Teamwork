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

        this.get('#/search/:query', adsController.displayAdsSearch);

        this.get('#/search/brand/:brand', adsController.displayAdsBrandSearch);

        //messages
        this.get('#/user/messages', messagesController.displayMessages);

        this.get('#/user/message/:id', messagesController.displayMessageThread);

        this.post('#/user/message/:id', messagesController.handleSendMessageInThread);

        this.get('#/message/send/:username', messagesController.displaySendMsg);

        this.post('#/message/send/:username', messagesController.handleNewMessageThread);

        //admin/brands
        this.get('#/admin/brands', brandsController.displayBrands);

        this.get('#/admin/brands/new', brandsController.displayNewBrand);

        this.post('#/admin/brands/new', brandsController.handleNewBrand);

        this.get('#/admin/brands/edit/:name', brandsController.displayEditBrand);

        this.post('#/admin/brands/edit/:brand', brandsController.handleEditBrand);

        this.get('#/admin/brands/delete/:name', brandsController.handleDeleteBrand);

        //admin/models
        this.get('#/admin/models', modelsController.displayModels);

        this.get('#/admin/models/delete/:brand/:name', modelsController.handleDeleteModel);

        this.get('#/admin/models/add/:name', modelsController.displayAddModel);

        this.post('#/admin/models/add/:brand', modelsController.handleAddModel);

        this.get('#/admin/models/edit/:brand/:model', modelsController.displayEditModel);

        this.post('#/admin/models/edit/:brand/:model', modelsController.handleEditModel);

        //comments
        this.post('#/ads/details/add/comments/:id', commentsController.handleAdsComment);

        this.get('#/ads/comments/delete/:id/:ad_id', commentsController.handleDeleteComment);
    });

    function start() {
        auth.loginAsStupedUser().then(function (data) {
            auth.saveSession(data);
            app.run();
        })
    }

    start();
});