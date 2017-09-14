let modelsController = (() => {
    function displayModels(ctx) {
        let templates = {
            model: './temp/admin/models/model.hbs',
            content: './temp/admin/models/index.hbs'
        };

        utils.loadPage(ctx, templates);
    }

    function displayAddModel(ctx) {
        brandService.getBrandById(ctx.params.id).then(function (brand) {
            ctx.brand_id = brand._id;
            ctx.name = brand.name;

            let templates = {
                regForm: './temp/registration/form.hbs',
                content: './temp/admin/models/add.hbs'
            };

            utils.loadPage(ctx, templates);
        })
    }

    function displayEditModel(ctx) {
        ctx.model_id = ctx.params.id;

        modelsService.getModel(ctx.model_id).then(function (model) {
            ctx.model = model.name;

            let templates = {
                content: './temp/admin/models/edit.hbs'
            };

            utils.loadPage(ctx, templates);
        });
    }

    function handleAddModel(ctx) {
        let modelName = ctx.params.name;
        let brand_id = ctx.params.id;

        modelsService.addModel(modelName, brand_id).then(function () {
            notifications.showInfo("Model added.");
            ctx.redirect(`#/admin/models`)
        }).catch(notifications.handleError);
    }

    function handleEditModel(ctx) {
        let id = ctx.params.id;
        let modelName = ctx.params.name;

        modelsService.getModel(id).then(function (model) {
            modelsService.editModel(id, modelName, model.brand_id).then(function () {
                notifications.showInfo("Model name was changed.");
                ctx.redirect('#/admin/models');
            });
        }).catch(notifications.handleError);
    }

    function handleDeleteModel(ctx) {
        let id = ctx.params.id;

        modelsService.deleteModel(id).then(function () {
            notifications.showInfo("Model was deleted.");
            ctx.redirect(`#/admin/models`)
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