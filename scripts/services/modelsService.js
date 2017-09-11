$(() => {
    $(document).on("change", "#brand", displayModels);

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
});