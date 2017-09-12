$(() => {
    $(document).on("change", "#brand", displayModels);
    $(document).on("change", "#advancedBrand", displayAdvancedSearchModels);

    function displayModels() {
        let brandName = $('#brand').find(":selected").text();

        brandService.getBrand(brandName).then(function (data) {
            let models = data[0].models;
            $('#model').find("option").remove();

            for (let id in models) {
                $('#model').append($(`<option value="">${models[id]}</option>`));
            }

            if (Object.keys(models).length === 0) {
                $('#model').append($(`<option selected value="">No models available.</option>`));
            }
        })
    }

    function displayAdvancedSearchModels() {
        let brandName = $('#advancedBrand').find(":selected").text();

        brandService.getBrand(brandName).then(function (data) {
            let models = data[0].models;
            $('#advancedModel').find("option").remove();
            $('#advancedModel').append($(`<option value="all">All models</option>`));

            for (let id in models) {
                $('#advancedModel').append($(`<option value="">${models[id]}</option>`));
            }
        })
    }
});