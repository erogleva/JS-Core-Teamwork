let adsController = (()=>{
    function displayCreateAd(ctx) {
        if (!auth.isAuthed()) {
            ctx.redirect("#/home");
            return;
        }

        brandService.getAllBrands().then(function (data) {
            ctx.category = data;
            ctx.brands = data;
            let partialsObject = utils.getCommonElements(ctx);
            partialsObject["createForm"] = './temp/ads/create/form.hbs';
            partialsObject["content"] = './temp/ads/create/index.hbs';

            ctx.loadPartials(partialsObject).then(function () {
                this.partial('./temp/common/main.hbs');
            })
        });
    }

    function handleCreateAd(ctx) {
        let title = ctx.params.title;
        let description = ctx.params.description;
        let brand = ctx.params.brand;
        let model = $("#model").find(":selected").text();
        let city = $("#city").find(":selected").text();
        let mileage = parseInt(ctx.params.mileage);
        let price = parseFloat(ctx.params.price);
        let images = ctx.params.images;

        if (!images) {
            images = "https://www.vipspatel.com/wp-content/uploads/2017/04/no_image_available_300x300.jpg";
        }

        if (auth.isAuthed()) {
            ctx.loggedUsername = sessionStorage.getItem('username');
        }

        let author = ctx.loggedUsername;
        let promoted = false;
        let publishedDate = new Date();

        adsService.createAd(title, description, brand, model, city, mileage, price, images, author, promoted, publishedDate).then(function () {
            ctx.redirect("#/home");
        })
    }

    function displayDetailsAd(context) {
        if (auth.isAuthed()) {
            context.loggedUsername = sessionStorage.getItem('username');
        }

        let adId = context.params.id;

        adsService.loadAdDetails(adId).then(function (adInfo) {
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

            if (context.author === context.loggedUsername ||
                sessionStorage.getItem('userRole')) {
                context.isAuthor = true;
            }

            adsService.getAdComments(adId).then(function (comments) {
                context.comments = comments;

                for (let comment of context.comments) {
                    if (sessionStorage.getItem('username') === comment.author
                        || sessionStorage.getItem('userRole') === 'admin') {
                        comment.isOwner = true;
                    }
                }

                brandService.getAllBrands().then(function (data) {
                    context.category = data;

                    let partialsObject = utils.getCommonElements(context);
                    partialsObject["content"] = './temp/ads/details/index.hbs';
                    partialsObject["comments"] = './temp/ads/details/comments/index.hbs';
                    partialsObject["form"] = './temp/ads/details/comments/form.hbs';

                    context.loadPartials(partialsObject).then(function () {
                        this.partial('./temp/common/main.hbs');
                    });
                })
            })
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
            console.log(ctx.promoted);

            let partialsObject = utils.getCommonElements(ctx);
            partialsObject["editForm"] = './temp/ads/edit/form.hbs';
            partialsObject["content"] = './temp/ads/edit/index.hbs';

            brandService.getAllBrands().then(function (categories) {
                ctx.category = categories;
                ctx.brands = categories;

                ctx.loadPartials(partialsObject).then(function () {
                    this.partial('./temp/common/main.hbs');
                });
            })
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

            if (auth.isAuthed()) {
                ctx.loggedUsername = sessionStorage.getItem('username');
            }

            let author = ctx.loggedUsername;

            adsService.edit(adId, title, description, brand, model, city, mileage, price, images, publishedDate, author, promoted).then(function (adInfo) {
                notifications.showInfo('Ad is updated');
                ctx.redirect(`#/ads/details/${adId}`);
            }).catch(auth.handleError);
        })
    }

    function handleDeleteAd(ctx) {
        let adId = ctx.params.id.substr(1);

        adsService.removeAd(adId).then(function (adInfo) {
            console.log(adInfo);
            notifications.showInfo(`Your ad is deleted.`);
            ctx.redirect('#/home')
        }).catch(notifications.handleError)
    }

    function displayUserAds(ctx) {
        let username = ctx.params.username;

        adsService.getUserAds(username).then(function (ads) {
            ctx.ads = ads;
            ctx.username = ctx.params.username;
            ctx.message = `${username}'s advertisements`;

            let partialsObject = utils.getCommonElements(ctx);
            partialsObject["content"] = './temp/home/index.hbs';
            partialsObject["ad"] = './temp/ads/ad.hbs';

            brandService.getAllBrands().then(function (categories) {
                ctx.category = categories;

                ctx.loadPartials(partialsObject).then(function () {
                    this.partial('./temp/common/main.hbs');
                });
            })
        })
    }

    return{
        displayCreateAd,
        displayDetailsAd,
        displayEditAd,
        displayUserAds,
        handleCreateAd,
        handleEditAd,
        handleDeleteAd
    }
})();