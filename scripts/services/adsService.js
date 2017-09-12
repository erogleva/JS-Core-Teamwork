let adsService = (() => {
    function createAd(title, description, brand, model, city, mileage, price, images, author, promoted, publishedDate) {
        return requester.post('appdata', 'ads', {
            title,
            description,
            brand,
            model,
            city,
            mileage,
            price,
            images,
            author,
            promoted,
            publishedDate
        });
    }

    function getAds() {
        return requester.get('appdata', 'ads');
    }

    function getUserAds(username) {
        let endpoint = `ads?query={"author":"${username}"}`;
        return requester.get('appdata', endpoint);
    }


    function loadAdDetails(adId) {
        return requester.get('appdata', 'ads/' + adId);
    }

    function editAd(adId, title, description, brand, model, city, mileage, price, images, publishedDate, author, promoted, comments) {
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

    function getVipAds() {
        let endpoint = `ads?query={"promoted":true}`;
        return requester.get('appdata', endpoint);
    }
    //
    // function getVipAdsCount() {
    //     let endpoint = `ads/_count/?query={"promoted":true}`;
    //     return requester.get('appdata', endpoint);
    // }

    return {
        createAd,
        getAds,
        getUserAds,
        loadAdDetails,
        editAd,
        removeAd,
        getAdsByBrand,
        getVipAds,
    }
})();