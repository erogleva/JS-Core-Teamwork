let commentsController = (() => {
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
        handleAdsComment,
        handleDeleteComment
    }
})();