let commentsController = (() => {
    function displayEditComment(ctx) {
        let adId = ctx.params.ad_id;
        let commentId = ctx.params.id;

        commentsService.getCommentById(commentId).then(function (data) {
            let comment = data[0];
            ctx.adId = adId;
            ctx.commentId = commentId;
            ctx.content = comment.content;
            ctx.author = comment.author;
            ctx.avatar = comment.avatar;

            let templates = {
                content: './temp/ads/details/comments/edit.hbs'
            };

            utils.loadPage(ctx, templates)
        }).catch(notifications.handleError);
    }

    function handleEditComment(ctx) {
        let adId = ctx.params.ad_id;
        let commentId = ctx.params.id;
        let content = ctx.params.content;
        let author = ctx.params.author;
        let avatar = ctx.params.avatar;

        commentsService.editComment(commentId, author, content, avatar, adId).then(function (data) {
            notifications.showInfo('Comment edited.');
            ctx.redirect('#/ads/details/' + adId);
        }).catch(notifications.handleError);
    }

    function handleDeleteComment(ctx) {
        let adsId = ctx.params.ad_id;
        let commentId = ctx.params.id;

        commentsService.removeComment(commentId).then(function () {
            notifications.showInfo('Comment deleted.');
            ctx.redirect('#/ads/details/' + adsId)
        }).catch(notifications.handleError)
    }

    function handleAdsComment(ctx) {
        let id = ctx.params.id;
        let username = sessionStorage.getItem('username');

        commentsService.addComment(id, username, sessionStorage.getItem('avatar'), ctx.params.comment).then(function () {
            notifications.showInfo('Comment added.');
            ctx.redirect(`#/ads/details/${id}`)
        }).catch(notifications.handleError);
    }

    return {
        handleAdsComment,
        displayEditComment,
        handleEditComment,
        handleDeleteComment
    }
})();