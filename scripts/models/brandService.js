let brandService = (() => {
    function getAllBrands() {
        return requester.get('appdata', 'brand');
    }

    function createBrand(data) {
        return requester.post('appdata', 'brand', data);
    }

    function editBrand(id, data) {
        let endpoint = `brand/${id}`;
        console.log(endpoint);
        return requester.update('appdata', endpoint, data);
    }

    function getBrand(name) {
        let endpoint = `brand?query={"name":"${name}"}`;
        return requester.get('appdata', endpoint);
    }

    function deleteBrand(name) {
        let endpoint = `brand?query={"name":"${name}"}`;
        return requester.del('appdata', endpoint);
    }

    return {
        getAllBrands,
        createBrand,
        editBrand,
        getBrand,
        deleteBrand
    }
})();