let homeController = (() => {
    function displayHome(ctx) {
        adsService.getVipAds()
            .then(function (vipAds) {

                let vipAdsCount = vipAds.length;
                if (vipAdsCount > 3) {
                    let vipIndexAds = [];
                    for (let i = 0; i < 3; i++) {
                        vipIndexAds.push(vipAds[randomVipAdIndex = Math.round(utils.getRandom(0, vipAdsCount - 1))]);
                    }
                    ctx.vip =vipIndexAds;
                } else {
                    ctx.vip = vipAds;
                }

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
                })
            }).catch(notifications.handleError);
    }

    return {
        displayHome
    }
})();