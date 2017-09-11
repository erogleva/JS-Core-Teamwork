let homeController = (() => {
    function displayHome(ctx) {
        adsService.getAds().then(function (data) {
            for (let ad of data) {
                ad.description = ad.description.substring(0, 15) + "...";
            }

            ctx.message = "All advertisements";
            ctx.ads = data;

            let templates = {
                content: './temp/home/index.hbs',
                ad: './temp/ads/ad.hbs'
            };

            utils.loadPage(ctx, templates);
        }).catch(notifications.handleError);
    }

    return {
        displayHome
    }
})();