$(() => {
    const app = Sammy('#main', function () {
        Handlebars.registerHelper("len", function (json) {
            return Object.keys(json).length;
        });

        this.use('Handlebars', 'hbs');

        //Home
        this.get('#/home', homeController.displayHome);

        this.get('/', homeController.displayHome);

        this.get('index.html', homeController.displayHome);

        //Users
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

        //Ads
        this.get('#/create', adsController.displayCreateAd);

        this.post('#/create', adsController.handleCreateAd);

        this.get('#/ads/details/:id', adsController.displayDetailsAd);

        this.get('#/edit/:id', adsController.displayEditAd);

        this.post('#/edit/:id', adsController.handleEditAd);

        this.get('#/delete/:id', adsController.handleDeleteAd);

        this.get('#/user/ads/:username', adsController.displayUserAds);

        this.get('#/search/:query', adsController.displayAdsSearch);

        this.get('#/search/brand/:brand', adsController.displayAdsBrandSearch);

        this.post('#/search/advanced', adsController.displayAdvancedSearchAds);

        this.get('#/makeVip/:id', adsController.makeVip);

        //Messages
        this.get('#/user/messages', messagesController.displayMessages);

        this.get('#/user/message/:id', messagesController.displayMessageThread);

        this.post('#/user/message/:id', messagesController.handleSendMessageInThread);

        this.get('#/message/send/:username', messagesController.displaySendMsg);

        this.post('#/message/send/:username', messagesController.handleNewMessageThread);

        //Brands
        this.get('#/admin/brands', brandsController.displayBrands);

        this.get('#/admin/brands/new', brandsController.displayNewBrand);

        this.post('#/admin/brands/new', brandsController.handleNewBrand);

        this.get('#/admin/brands/edit/:name', brandsController.displayEditBrand);

        this.post('#/admin/brands/edit/:brand', brandsController.handleEditBrand);

        this.get('#/admin/brands/delete/:name', brandsController.handleDeleteBrand);

        //Models
        this.get('#/admin/models', modelsController.displayModels);

        this.get('#/admin/models/delete/:id', modelsController.handleDeleteModel);

        this.get('#/admin/models/add/:id', modelsController.displayAddModel);

        this.post('#/admin/models/add/:id', modelsController.handleAddModel);

        this.get('#/admin/models/edit/:id', modelsController.displayEditModel);

        this.post('#/admin/models/edit/:id', modelsController.handleEditModel);

        //Comments
        this.post('#/ads/details/add/comments/:id', commentsController.handleAdsComment);

        this.get('#/ads/comments/edit/:ad_id/:id', commentsController.displayEditComment);

        this.post('#/ads/comments/edit/:ad_id/:id', commentsController.handleEditComment);

        this.get('#/ads/comments/delete/:ad_id/:id', commentsController.handleDeleteComment);
    });

    function start() {
        usersService.loginAsStupedUser().then(function (data) {
            usersService.saveSession(data);
            app.run();
        })
    }

    start();
});