let homeController = (() => {
    function displayHome(ctx) {
        Promise.all([adsService.getVipAds(), adsService.getAds()]).then(function ([allVipAds, ads]) {
            let vipAdsCount = allVipAds.length;

            if (vipAdsCount > 3) {
                let vipAds = [];

                for (let i = 0; i < 3; i++) {
                    let randomVipAdIndex = Math.round(utils.getRandom(0, vipAdsCount - 1));
                    let vipAd = allVipAds[randomVipAdIndex];

                    vipAd.description = vipAd.description.substring(0, 15) + "...";
                    vipAd.title = vipAd.title.substring(0, 20) + "...";

                    vipAds.push(vipAd);

                    allVipAds.splice(randomVipAdIndex, 1);
                    vipAdsCount = allVipAds.length;
                }

                ctx.vip = vipAds;
            } else {
                for (let vipAd of allVipAds) {
                    vipAd.description = vipAd.description.substring(0, 15) + "...";
                    vipAd.title = vipAd.title.substring(0, 20) + "...";
                }

                ctx.vip = allVipAds;
            }

            for (let ad of ads) {
                ad.description = ad.description.substring(0, 15) + "...";
                ad.title = ad.title.substring(0, 20) + "...";
            }

            ctx.message = "All advertisements";
            ctx.ads = ads;

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