let brandService = (() => {
    function getAllBrands() {
        return requester.get('appdata', 'brand');
    }

    function createBrand(data) {
        return requester.post('appdata', 'brand', data);
    }

    function editBrand(id, data) {
        let endpoint = `brand/${id}`;
        return requester.update('appdata', endpoint, data);
    }

    function getBrandById(id) {
        let endpoint = `brand/${id}`;
        return requester.get('appdata', endpoint);
    }

    function getBrand(name) {
        let endpoint = `brand?query={"name":"${name}"}`;
        return requester.get('appdata', endpoint);
    }

    function deleteBrand(id) {
        return requester.del('appdata', 'brand/' + id);
    }

    return {
        getAllBrands,
        createBrand,
        editBrand,
        getBrand,
        getBrandById,
        deleteBrand
    }
})();