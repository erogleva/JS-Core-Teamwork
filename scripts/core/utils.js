let utils = (() => {
    const commonTemplates = {
        'header': './temp/common/header.hbs',
        'footer': './temp/common/footer.hbs',
        'leftColumn': './temp/common/leftColumn.hbs',
        'rightColumn': './temp/common/rightColumn.hbs'
    };

    function loadPage(ctx, templates) {
        if (usersService.isAuthed()) {
            ctx.loggedUsername = sessionStorage.getItem('username');
            ctx.userRole = sessionStorage.getItem('userRole');
        }

        brandService.getAllBrands().then(function (data) {
            ctx.brands = data;

            adsService.getVipAds().then(function (vipAds) {
                let vipAdsCount = vipAds.length;
                console.log("All vip ads");
                console.log(vipAds);
                let randomVipAdIndex = Math.round(getRandom(0, vipAdsCount - 1));
                console.log(randomVipAdIndex);
                console.log(vipAds[randomVipAdIndex]);

                ctx.vipAd = vipAds[randomVipAdIndex];
                console.log(ctx.vipAd);
                Object.assign(templates, commonTemplates);

                ctx.loadPartials(templates).then(function () {
                    this.partial(`./temp/common/main.hbs`);
                });
            });
        });
    }


    function getCommonElements(ctx) {
        if (usersService.isAuthed()) {
            ctx.loggedUsername = sessionStorage.getItem('username');
            ctx.userRole = sessionStorage.getItem('userRole');
        }

        return {
            'header': './temp/common/header.hbs',
            'footer': './temp/common/footer.hbs',
            'leftColumn': './temp/common/leftColumn.hbs'
        }
    }

    function getCities() {
        return ["Sofia", "Varna", "Plovdiv", "Ruse"];
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
            return value === 1 ? '' : 's';
        }
    }

    function getRandom(min, max) {
        return Math.random() * (max - min) + min;
    }

    return {
        getCommonElements,
        calcTime,
        getCities,
        loadPage
    }
})
();
