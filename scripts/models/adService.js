let adService = (() => {
    function createAd(title, description, brand, model, city, mileage, price, imagesUrls) {
        let images = JSON.stringify(imagesUrls);
        return requester.post('appdata', 'ads', {title, description, brand, model, city, mileage, price, images});
    }

    function getAds() {
        return requester.get('appdata', 'ads');
    }

    return {
        createAd,
        getAds
    }
})();