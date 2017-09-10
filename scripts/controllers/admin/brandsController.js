let brandsController = (() => {
    function displayBrands(ctx) {
        if (!auth.isAuthed()) {
            ctx.redirect('#/login');
            return;
        }

        let templates = {
            content: './temp/admin/brands/index.hbs',
            brand: './temp/admin/brands/brand.hbs'
        };
        utils.loadPage(ctx, templates);
    }

    function displayNewBrand(ctx) {
        if (!auth.isAuthed()) {
            ctx.redirect('#/login');
            return;
        }

        let templates = {
            content: './temp/admin/brands/new.hbs'
        };
        utils.loadPage(ctx, templates);
    }

    function displayEditBrand(ctx) {
        if (!auth.isAuthed()) {
            ctx.redirect('#/login');
            return;
        }

        ctx.name = ctx.params.name;
        let templates = {
            content: './temp/admin/brands/edit.hbs'
        };
        utils.loadPage(ctx, templates);
    }

    function handleNewBrand(ctx) {
        let brandName = {"name": ctx.params.name};

        brandService.createBrand(brandName).then(function () {
            notifications.showInfo('Successfully added brand');
            ctx.redirect('#/admin/brands');
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

    function handleDeleteBrand(ctx) {
        brandService.deleteBrand(ctx.params.name).then(function (brandInfo) {
            notifications.showInfo('Successfully deleted brand');
            ctx.redirect('#/admin/brands');
        }).catch(notifications.handleError);
    }

    return {
        displayNewBrand,
        displayEditBrand,
        displayBrands,
        handleEditBrand,
        handleNewBrand,
        handleDeleteBrand
    }
})();