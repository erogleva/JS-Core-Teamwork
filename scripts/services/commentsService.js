let commentsService = (() => {
    function getAdComments(adId) {
        let endpoint = `comments?query={"ad_id":"${adId}"}`;
        return requester.get('appdata', endpoint);
    }

    function getCommentById(id) {
        let endpoint = `comments?query={"_id":"${id}"}`;
        return requester.get('appdata', endpoint);
    }

    function addComment(adId, author, avatar, content) {
        return requester.post('appdata', 'comments', {author, content, avatar, ad_id: adId});
    }

    function editComment(id, author, content, avatar, ad_id) {
        let commentData = {
            author,
            content,
            avatar,
            ad_id
        };

        return requester.update('appdata', 'comments/' + id, commentData);
    }

    function removeComment(commentId) {
        return requester.del('appdata', 'comments/' + commentId);
    }

    return {
        getAdComments,
        getCommentById,
        addComment,
        editComment,
        removeComment
    }
})();