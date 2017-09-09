let homeController = (()=>{
    function displayHome(ctx) {
        brandService.getAllBrands().then(function (categories) {
            ctx.category = categories;
            ctx.message = "All advertisements";

            adsService.getAds().then(function (data) {
                for (let ad of data) {
                    ad.description = ad.description.substring(0, 15) + "...";
                }
                ctx.ads = data;
                let partialsObject = utils.getCommonElements(ctx);
                partialsObject["ad"] = './temp/ads/ad.hbs';
                partialsObject["content"] = './temp/home/index.hbs';

                ctx.loadPartials(partialsObject).then(function () {
                    this.partial('./temp/common/main.hbs');
                })
            });
        }).catch(notifications.handleError)
    }

    return {
        displayHome
    }
})();