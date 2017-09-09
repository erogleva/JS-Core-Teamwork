let adsService = (() => {
    function createAd(title, description, brand, model, city, mileage, price, images, author, promoted, publishedDate) {
        return requester.post('appdata', 'ads', {title, description, brand, model, city, mileage, price, images, author, promoted, publishedDate});
    }

    function getAds() {
        return requester.get('appdata', 'ads');
    }

    function getUserAds(userId) {
        let endpoint = `ads?query={"_acl.creator":"${userId}"}`;
        return requester.get('appdata', endpoint);
    }

    function loadAdDetails(adId) {
        return requester.get('appdata', 'ads/' + adId);
    }

    function getAdComments(adId) {
        let endpoint = `comments?query={"ad_id":"${adId}"}`;
        return requester.get('appdata', endpoint);
    }

    function addComment(adId, author, avatar, content) {
        return requester.post('appdata', 'comments', {author, content, avatar, ad_id: adId});
    }

    function edit(adId, title, description, brand, model, city, mileage, price, images, publishedDate, author, promoted, comments) {
        let adData = {
            title: title,
            description: description,
            brand: brand,
            model: model,
            city: city,
            mileage: mileage,
            price: price,
            images: images,
            publishedDate: publishedDate,
            author: author,
            promoted: promoted,
            comments: comments
        };
        return requester.update('appdata', 'ads/' + adId, adData);
    }

    function getAdsByBrand(brandName) {
        let endpoint = `ads?query={"brand":"${brandName}"}&sort={"_kmd.ect": -1}`;
        return requester.get('appdata', endpoint);
    }

    function removeAd(adId) {
        return requester.del('appdata', 'ads/' + adId);
    }

    function removeComment(commentId) {
        return requester.del('appdata', 'comments/' + commentId);
    }

    return {
        createAd,
        getAds,
        getUserAds,
        loadAdDetails,
        edit,
        removeAd,
        removeComment,
        addComment,
        getAdComments,
        getAdsByBrand
    }
})();