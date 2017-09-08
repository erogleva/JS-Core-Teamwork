$(() => {
    $(document).on("change", "#brand", displayModels);

    function displayModels() {
        let brandName = $('#brand').find(":selected").text();

        brandService.getBrand(brandName).then(function (data) {
            let models = data[0].models;

            for (let id in models) {
                $('#model').append($(`<option value="1">${models[id]}</option>`));
            }
        })
    }
});