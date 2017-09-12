let adsService = (() => {
    const adsSort = '&sort={"promoted": -1, "_kmd.ect": -1}';

    function getAds() {
        return requester.get('appdata', `ads?query{}${adsSort}`);
    }

    function getUserAds(username) {
        let endpoint = `ads?query={"author":"${username}"}` + adsSort;
        return requester.get('appdata', endpoint);
    }

    function getAdsByBrand(brandName) {
        let endpoint = `ads?query={"brand":"${brandName}"}` + adsSort;
        return requester.get('appdata', endpoint);
    }
    
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

    function removeAd(adId) {
        return requester.del('appdata', 'ads/' + adId);
    }

    function getCounts() {
        return requester.get('appdata', 'ads/_count?query{"promoted":"true"}');
    }

    function getRandomVipAds(num) {
        let endpoint = `ads?query={"promoted":true}&limit=1&skip=${num}`;
        console.log(endpoint);
        return requester.get('appdata', endpoint);
    }

    return {
        createAd,
        getAds,
        getUserAds,
        loadAdDetails,
        editAd,
        removeAd,
        getAdsByBrand,
        getCounts,
        getRandomVipAds
    }
})();