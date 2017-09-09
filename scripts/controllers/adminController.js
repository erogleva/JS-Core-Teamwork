let adminController = (()=>{
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

    function displayEditModel(ctx) {
        ctx.model = ctx.params.model;
        ctx.brand = ctx.params.brand;

        let partialsObject = utils.getCommonElements(ctx);
        partialsObject["content"] = './temp/admin/models/edit.hbs';

        brandService.getAllBrands().then(function (categories) {
            ctx.category = categories;

            ctx.loadPartials(partialsObject).then(function () {
                this.partial('./temp/common/main.hbs');
            });
        })
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

    function displayAddModel(ctx) {
        ctx.name = ctx.params.name;
        let partialsObject = utils.getCommonElements(ctx);
        partialsObject["content"] = './temp/admin/models/add.hbs';

        brandService.getAllBrands().then(function (categories) {
            ctx.category = categories;

            ctx.loadPartials(partialsObject).then(function () {
                this.partial('./temp/common/main.hbs');
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

    function displayModels(ctx) {
        brandService.getAllBrands().then(function (data) {
            ctx.data = data;
            ctx.category = data;

            let partialsObject = utils.getCommonElements(ctx);
            partialsObject["model"] = './temp/admin/models/model.hbs';
            partialsObject["content"] = './temp/admin/models/index.hbs';

            ctx.loadPartials(partialsObject).then(function () {
                this.partial('./temp/common/main.hbs');
            });
        }).catch(notifications.handleError)
    }

    function handleDeleteBrand(ctx) {
        brandService.deleteBrand(ctx.params.name).then(function (brandInfo) {
            adsService.getAdsByBrand(ctx.params.name.trim()).then(function (adsInfo) {
                let length = adsInfo.length;
                for (i = 0; i < length; i++) {
                    adsService.removeAd((adsInfo[i]._id));
                }
                notifications.showInfo('Successfully deleted brand and Ands');
                ctx.redirect('#/admin/brands');

            });
        }).catch(notifications.handleError);
    }

    function handleEditBrand(ctx) {
        let brandName = {"name": ctx.params.name};
        brandService.getBrand(ctx.params.brand).then(function (brandInfo) {
            brandService.editBrand(brandInfo[0]._id, brandName).then(function (data) {
                notifications.showInfo('Successfully added brand');
                ctx.redirect('#/admin/brands');
            })
        }).catch(notifications.handleError);
    }

    function displayEditBrand(ctx) {
        ctx.name = ctx.params.name;
        let partialsObject = utils.getCommonElements(ctx);
        partialsObject["content"] = './temp/admin/brands/edit.hbs';

        brandService.getAllBrands().then(function (categories) {
            ctx.category = categories;

            ctx.loadPartials(partialsObject).then(function () {
                this.partial('./temp/common/main.hbs');
            });
        })
    }

    function handleNewBrand(ctx) {
        let brandName = {"name": ctx.params.name};

        brandService.createBrand(brandName).then(function () {
            notifications.showInfo('Successfully added brand');
            ctx.redirect('#/admin/brands');
        }).catch(notifications.handleError);
    }

    function displayNewBrand(ctx) {
        if (auth.isAuthed()) {
            let partialsObject = utils.getCommonElements(ctx);
            partialsObject["content"] = './temp/admin/brands/new.hbs';

            brandService.getAllBrands().then(function (categories) {
                ctx.category = categories;

                ctx.loadPartials(partialsObject).then(function () {
                    this.partial('./temp/common/main.hbs');
                });
            })
        }
    }

    function displayBrands(ctx) {
        brandService.getAllBrands().then(function (data) {
            ctx.data = data;
            ctx.length = data.length;
            ctx.category = data;

            if (auth.isAuthed()) {
                let partialsObject = utils.getCommonElements(ctx);
                partialsObject["content"] = './temp/admin/brands/index.hbs';
                partialsObject["brand"] = './temp/admin/brands/brand.hbs';

                ctx.loadPartials(partialsObject).then(function () {
                    this.partial('./temp/common/main.hbs');
                });
            }
        });
    }

    return{
        displayNewBrand,
        displayModels,
        displayEditBrand,
        displayBrands,
        displayAddModel,
        displayEditModel,
        handleEditBrand,
        handleAddModel,
        handleNewBrand,
        handleDeleteBrand,
        handleDeleteModel,
        handleEditModel
    }
})();