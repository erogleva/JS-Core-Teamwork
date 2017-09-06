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

    function edit(adId, title, description, brand, model, city, mileage, price, images, publishedDate, author, promoted) {

        let adData = {
            title: title,
            description: description,
            brand: brand,
            model: model,
            city: city,
            mileage: mileage,
            price: price,
            images: JSON.stringify(images),
            publishedDate: publishedDate,
            author: author,
            promoted: promoted
        };
        return requester.update('appdata', 'ads/' + adId, adData);
    }

    function removeAd(adId) {
        return requester.del('appdata', 'ads/' + adId);
    }

    return {
        createAd,
        getAds,
        getUserAds,
        loadAdDetails,
        edit,
        removeAd
    }
})();