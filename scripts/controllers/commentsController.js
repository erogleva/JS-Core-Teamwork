let commentsController = (()=>{
    function displayCreateAdComment(ctx) {
        let adId = ctx.params.id.substr(1);

        adsService.loadAdDetails(adId).then(function (adInfo) {
            ctx.id = adId;

            let partialsObject = getCommonElements(ctx);
            partialsObject["commentForm"] = './temp/ads/comments/form.hbs';
            partialsObject["content"] = './temp/ads/comments/index.hbs';

            brandService.getAllBrands().then(function (categories) {
                ctx.category = categories;

                ctx.loadPartials(partialsObject).then(function () {
                    this.partial('./temp/common/main.hbs');
                });
            })
        });
    }

    function handleDeleteComment(ctx) {
        let adsId = ctx.params.id;
        let commentId = ctx.params.ad_id;

        adsService.removeComment(commentId).then(function () {
            notifications.showInfo('Comment deleted.');
            ctx.redirect('#/ads/details/' + adsId)
        }).catch(notifications.handleError)
    }

    function handleAdsComment(ctx) {
        let id = ctx.params.id;
        let username = sessionStorage.getItem('username');

        adsService.addComment(id, username, sessionStorage.getItem('avatar'), ctx.params.comment).then(function () {
            notifications.showInfo('Comment added.');
            ctx.redirect(`#/ads/details/${id}`)
        }).catch(notifications.handleError);
    }

    return {
        displayCreateAdComment,
        handleAdsComment,
        handleDeleteComment
    }
})();