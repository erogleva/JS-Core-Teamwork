let modelsController = (() => {
    function displayModels(ctx) {
        let templates = {
            model: './temp/admin/models/model.hbs',
            content: './temp/admin/models/index.hbs'
        };

        utils.loadPage(ctx, templates);
    }

    function displayAddModel(ctx) {
        ctx.name = ctx.params.name;
        let templates = {
            regForm: './temp/registration/form.hbs',
            content: './temp/admin/models/add.hbs'
        };

        utils.loadPage(ctx, templates);
    }

    function displayEditModel(ctx) {
        ctx.model = ctx.params.model;
        ctx.brand = ctx.params.brand;

        let templates = {
            content: './temp/admin/models/edit.hbs'
        };

        utils.loadPage(ctx, templates);
    }

    function handleAddModel(ctx) {
        let modelName = ctx.params.name;
        let brand = ctx.params.brand;
        let rString = Math.random().toString(36).slice(2);

        brandService.getBrand(brand).then(function (brandInfo) {
            if (!brandInfo[0].models) {
                brandInfo[0]['models'] = {rString: modelName};
            } else {
                brandInfo[0].models[rString] = modelName;
            }

            let data = {"name": brandInfo[0].name, "models": brandInfo[0].models};

            brandService.editBrand(brandInfo[0]._id, data).then(function (info) {
                notifications.showInfo('Model added successfully.');
                ctx.redirect(`#/admin/models`)
            });
        }).catch(notifications.handleError);
    }

    function handleEditModel(ctx) {
        let brand = ctx.params.brand;
        let oldModel = ctx.params.model;
        let newModel = ctx.params.name;

        brandService.getBrand(brand).then(function (brandInfo) {
            for (let modelInfo in brandInfo[0].models) {
                if (brandInfo[0].models[modelInfo] === oldModel) {
                    brandInfo[0].models[modelInfo] = newModel;
                }
            }

            let data = {"name": brandInfo[0].name, "models": brandInfo[0].models};

            brandService.editBrand(brandInfo[0]._id, data).then(function (info) {
                ctx.redirect(`#/admin/models`)
            });
        })
    }

    function handleDeleteModel(ctx) {
        let modelName = ctx.params.name;
        let brandName = ctx.params.brand;

        brandService.getBrand(brandName).then(function (brandInfo) {
            for (let model in brandInfo[0].models) {
                if (brandInfo[0].models[model] === modelName) {
                    delete brandInfo[0].models[model];
                }
            }

            let data = {"name": brandInfo[0].name, "models": brandInfo[0].models};

            brandService.editBrand(brandInfo[0]._id, data).then(function (info) {
                ctx.redirect(`#/admin/models`)
            });

        })
    }

    return {
        displayModels,
        displayAddModel,
        displayEditModel,
        handleAddModel,
        handleDeleteModel,
        handleEditModel
    }
})();