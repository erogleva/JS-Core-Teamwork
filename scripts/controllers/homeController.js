let homeController = (() => {
    function displayHome(ctx) {
        Promise.all([adsService.getVipAds(), adsService.getAds()])
            .then(function ([vipAds, ads]) {
                let vipAdsCount = vipAds.length;

                if (vipAdsCount > 3) {
                    let vipIndexAds = [];

                    for (let i = 0; i < 3; i++) {
                        let randomVipAdIndex = Math.round(utils.getRandom(0, vipAdsCount - 1));
                        vipIndexAds.push(vipAds[randomVipAdIndex]);
                        
                        vipAds.splice(randomVipAdIndex, 1);         
                        vipAdsCount = vipAds.length;
                    }

                    ctx.vip = vipIndexAds;
                } else {
                    ctx.vip = vipAds;
                }

                for (let ad of ads) {
                    ad.description = ad.description.substring(0, 15) + "...";
                }

                ctx.message = "All advertisements";
                ctx.ads = ads;

                let templates = {
                    content: './temp/home/index.hbs',
                    ad: './temp/ads/ad.hbs'
                };

                utils.loadPage(ctx, templates);
            }).catch(notifications.handleError);;
    }

    return {
        displayHome
    }
})();