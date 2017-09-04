let adService = (() => {
    function createAd(title, description, brand, model, city, mileage, price, imagesUrls) {
        let images = JSON.stringify(imagesUrls);
        return requester.post('appdata', 'ads', {title, description, brand, model, city, mileage, price, images});
    }

    function getAds() {
        return requester.get('appdata', 'ads');
    }

    function getUserAds(userId) {
        let endpoint = `ads?query={"_acl.creator":"${userId}"}`;
        return requester.get('appdata', endpoint);
    }

    return {
        createAd,
        getAds,
        getUserAds,
    }
})();