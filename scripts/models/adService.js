let adService = (() => {
    function createAd(title, description, brand, model, city, mileage, price, imagesUrls, author, promoted, publishedDate) {
        let images = JSON.stringify(imagesUrls);
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

    return {
        createAd,
        getAds,
        getUserAds,
        loadAdDetails
    }
})();