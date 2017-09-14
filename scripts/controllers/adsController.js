let adsController = (() => {
    function displayCreateAd(ctx) {
        if (!usersService.isAuthed()) {
            ctx.redirect("#/home");
            return;
        }

        let templates = {
            createForm: './temp/ads/create/form.hbs',
            content: './temp/ads/create/index.hbs'
        };

        ctx.cities = utils.getCities();
        utils.loadPage(ctx, templates);
    }

    function displayDetailsAd(context) {
        if (usersService.isAuthed()) {
            context.loggedUsername = sessionStorage.getItem('username');
        }

        let adId = context.params.id;

        Promise.all([adsService.loadAdDetails(adId), commentsService.getAdComments(adId)]).then(function ([adInfo, comments]) {
            context.id = adId;
            context.title = adInfo.title;
            context.description = adInfo.description;
            context.publishedDate = utils.calcTime(adInfo.publishedDate);
            context.author = adInfo.author;
            context.brand = adInfo.brand;
            context.model = adInfo.model;
            context.city = adInfo.city;
            context.mileage = parseInt(adInfo.mileage);
            context.price = parseFloat(adInfo.price);
            context.images = adInfo.images;
            context.vip = adInfo.promoted;

            if (context.author === context.loggedUsername ||
                sessionStorage.getItem('userRole')) {
                context.isAuthor = true;
            }

            context.comments = comments;

            for (let comment of context.comments) {
                if (sessionStorage.getItem('username') === comment.author
                    || sessionStorage.getItem('userRole') === 'admin') {
                    comment.isOwner = true;
                }
            }

            let templates = {
                content: './temp/ads/details/index.hbs',
                comments: './temp/ads/details/comments/index.hbs',
                form: './temp/ads/details/comments/form.hbs'
            };

            utils.loadPage(context, templates);
        }).catch(notifications.handleError);
    }

    function displayEditAd(ctx) {
        let adId = ctx.params.id.substr(1);

        adsService.loadAdDetails(adId).then(function (adInfo) {
            ctx.id = adId;
            ctx.title = adInfo.title;
            ctx.description = adInfo.description;
            ctx.publishedDate = utils.calcTime(adInfo.publishedDate);
            ctx.author = adInfo.author;
            ctx.brand = adInfo.brand;
            ctx.model = adInfo.model;
            ctx.city = adInfo.city;
            ctx.mileage = parseInt(adInfo.mileage);
            ctx.price = parseFloat(adInfo.price);
            ctx.images = adInfo.images;
            ctx.promoted = adInfo.promoted;
            ctx.cities = utils.getCities();

            let templates = {
                editForm: './temp/ads/edit/form.hbs',
                content: './temp/ads/edit/index.hbs'
            };

            utils.loadPage(ctx, templates)
        });
    }

    function displayUserAds(ctx) {
        let username = ctx.params.username;

        adsService.getUserAds(username).then(function (ads) {
            for (let ad of ads) {
                ad.description = ad.description.substring(0, 15) + "...";
                ad.title = ad.title.substring(0, 20) + "...";
            }

            ctx.ads = ads;
            ctx.username = ctx.params.username;
            ctx.message = `${username}'s advertisements`;

            let templates = {
                content: './temp/home/index.hbs',
                ad: './temp/ads/ad.hbs'
            };

            utils.loadPage(ctx, templates);
        })
    }

    function displayAdsSearch(ctx) {
        let query = ctx.params.query;
        ctx.message = `Search results for: "${query}"`;

        adsService.getAds().then(function (data) {
            data = data.filter(
                ad => ad.title.toLowerCase().match(query.toLowerCase()));

            for (let ad of data) {
                ad.description = ad.description.substring(0, 15) + "...";
                ad.title = ad.title.substring(0, 20) + "...";
            }

            ctx.ads = data;

            let templates = {
                content: './temp/home/index.hbs',
                ad: './temp/ads/ad.hbs'
            };

            utils.loadPage(ctx, templates);
        });
    }

    function displayAdsBrandSearch(ctx) {
        let brand = ctx.params.brand;
        ctx.message = `All advertisements for ${brand}`;

        adsService.getAdsByBrand(brand).then(function (data) {
            for (let ad of data) {
                ad.description = ad.description.substring(0, 15) + "...";
                ad.title = ad.title.substring(0, 20) + "...";
            }

            ctx.ads = data;

            let templates = {
                content: './temp/home/index.hbs',
                ad: './temp/ads/ad.hbs'
            };

            utils.loadPage(ctx, templates);
        });
    }

    function displayAdvancedSearchAds(ctx) {
        let brand = $("#advancedBrand").find(":selected").text();
        let model = $("#advancedModel").find(":selected").text();
        let city = $("#advancedCity").find(":selected").text();
        let mileage = parseInt(ctx.params.advancedMileage);
        let price = parseFloat(ctx.params.advancedPrice);
        ctx.message = `Advanced search results`;

        adsService.getAdsByParams(brand, model, city, mileage, price).then(function (data) {
            for (let ad of data) {
                ad.description = ad.description.substring(0, 15) + "...";
                ad.title = ad.title.substring(0, 20) + "...";
            }

            ctx.ads = data;

            let templates = {
                content: './temp/home/index.hbs',
                ad: './temp/ads/ad.hbs'
            };

            utils.loadPage(ctx, templates);
        });
    }

    function handleEditAd(ctx) {
        let adId = ctx.params.id;
        let title = ctx.params.title;
        let description = ctx.params.description;
        let brand = $("#brand").find(":selected").text();
        let model = $("#model").find(":selected").text();
        let city = $("#city").find(":selected").text();
        let mileage = parseInt(ctx.params.mileage);
        let price = parseFloat(ctx.params.price);
        let publishedDate = new Date();
        let images = ctx.params.images;

        adsService.loadAdDetails(adId).then(function (adInfo) {
            ctx.promoted = adInfo.promoted;
        });

        let promoted = ctx.promoted;

        adsService.loadAdDetails(adId).then(function (adInfo) {
            if (adInfo.promoted) {
                ctx.promoted = true;
            } else {
                ctx.promoted = false;
            }

            if (usersService.isAuthed()) {
                ctx.loggedUsername = sessionStorage.getItem('username');
            }

            let authorId = adInfo._acl.creator;

            usersService.getUserById(authorId).then(function (data) {
                let user = data[0];
                let author = user.username;

                adsService.editAd(adId, title, description, brand, model, city, mileage, price, images, publishedDate, author, promoted).then(function (adInfo) {
                    notifications.showInfo('Ad is updated');
                    ctx.redirect(`#/ads/details/${adId}`);
                }).catch(usersService.handleError);
            });
        })
    }

    function handleDeleteAd(ctx) {
        let adId = ctx.params.id.substr(1);

        adsService.removeAd(adId).then(function (adInfo) {
            notifications.showInfo(`Your ad is deleted.`);
            ctx.redirect('#/home')
        }).catch(notifications.handleError)
    }

    function handleCreateAd(ctx) {
        let title = ctx.params.title;
        let description = ctx.params.description;
        let brand = $("#brand").find(":selected").text();
        let model = $("#model").find(":selected").text();
        let city = $("#city").find(":selected").text();
        let mileage = parseInt(ctx.params.mileage);
        let price = parseFloat(ctx.params.price);
        let images = ctx.params.images;

        if (!images) {
            images = "https://www.vipspatel.com/wp-content/uploads/2017/04/no_image_available_300x300.jpg";
        }

        if (usersService.isAuthed()) {
            ctx.loggedUsername = sessionStorage.getItem('username');
        }

        let author = ctx.loggedUsername;
        let promoted = false;
        let publishedDate = new Date();

        adsService.createAd(title, description, brand, model, city, mileage, price, images, author, promoted, publishedDate).then(function () {
            ctx.redirect("#/home");
        })
    }

    function makeVip(ctx) {
        usersService.getUserInfo(sessionStorage.getItem('username')).then(function (userInfo) {
            if (userInfo[0].points > 0) {
                adsService.loadAdDetails(ctx.params.id).then(function (adsInfo) {
                    adsInfo.promoted = true;

                    adsService.editAd(adsInfo._id, adsInfo.title, adsInfo.description, adsInfo.brand, adsInfo.model, adsInfo.city, adsInfo.mileage, adsInfo.price, adsInfo.images, adsInfo.publishedDate, adsInfo.author, adsInfo.promoted, adsInfo.comments);
                    notifications.showInfo('Successful promotion of the ad.');
                    ctx.redirect(`#/ads/details/${adsInfo._id}`)
                })
            } else {
                notifications.handleError('You do not have the required number of credits');
                ctx.redirect(`#/ads/details/${ctx.params.id}`);
            }
        })
    }

    return {
        displayCreateAd,
        displayDetailsAd,
        displayEditAd,
        displayUserAds,
        displayAdsSearch,
        displayAdsBrandSearch,
        displayAdvancedSearchAds,
        handleCreateAd,
        handleEditAd,
        handleDeleteAd,
        makeVip
    }
})();