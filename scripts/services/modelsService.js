let modelsService = (() => {
    $(document).on("change", "#brand", displayModels);
    $(document).on("change", "#advancedBrand", displayAdvancedSearchModels);

    function displayModels() {
        let brand_id = $('#brand').find(":selected").val();

        getModelsByBrand(brand_id).then(function (models) {
            $('#model').find("option").remove();

            for (let model of models) {
                $('#model').append($(`<option value="${model.name}">${model.name}</option>`));
            }
            $('#model').append(`<option value="Other">Other</option>`);
        })
    }

    function displayAdvancedSearchModels() {
        let brand_id = $('#advancedBrand').find(":selected").val();

        getModelsByBrand(brand_id).then(function (models) {
            $('#advancedModel').find("option").remove();
            $('#advancedModel').append($(`<option value="all">All models</option>`));

            for (let model of models) {
                $('#advancedModel').append($(`<option value="${model.name}">${model.name}</option>`));
            }
        })
    }

    function getModel(id) {
        return requester.get('appdata', `models/${id}`);
    }

    function addModel(modelName, brand_id) {
        return requester.post('appdata', `models`, { name: modelName, brand_id });
    }

    function editModel(id, modelName, brand_id) {
        return requester.update('appdata', `models/${id}`, { name: modelName, brand_id });
    }

    function getAllModels() {
        return requester.get('appdata', `models`);
    }

    function deleteModel(id) {
        return requester.del('appdata', `models/${id}`);
    }

    function getModelsByBrand(id) {
        return requester.get('appdata', `models?query={"brand_id":"${id}"}`);
    }

    return {
        getAllModels,
        editModel,
        getModel,
        deleteModel,
        addModel,
        displayAdvancedSearchModels
    }
})();
