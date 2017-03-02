const userRole = require('../libs/user_role');
const breadcrumbs = require('express-breadcrumbs');


var Camp = require('../models/camp').Camp;
var User = require('../models/user').User;

module.exports = function (app, passport) {
    // Breadcrumbs
    app.use(breadcrumbs.init());

    // Set Breadcrumbs home information 
    app.use(breadcrumbs.setHome({
        name: 'camps:breadcrumbs.root'
    }));

    // ==============
    // Camps Routing
    // ==============
    // camps index page, create new camp
    app.get('/:lng/camps', userRole.isLoggedIn(), (req, res) => {
        req.breadcrumbs({
            name: 'camps:breadcrumbs.home',
            url: '/camps'
        });
        res.render('pages/camps/index', {
            user: req.user,
            breadcrumbs: req.breadcrumbs()
        });
    });
    // index - catch no language
    // app.get('/camps', userRole.isLoggedIn(), function (req, res) {
    //     res.redirect('/:lng/camps');
    // });
    // new camp
    app.get('/:lng/camps/new', userRole.isLoggedIn(), (req, res) => {
        req.breadcrumbs({
            name: 'camps:breadcrumbs.new',
            url: '/camps/new'
        });
        res.render('pages/camps/new', {
            user: req.user,
            camp_name_en: req.query.c,
            breadcrumbs: req.breadcrumbs()
        });
    });
    // camps statistics
    app.get('/:lng/camps-stats', userRole.isLoggedIn(), (req, res) => {
        req.breadcrumbs(i18next.t('camps:breadcrumbs.stats'));
        res.render('pages/camps/stats', {
            user: req.user,
            breadcrumbs: req.breadcrumbs()
        });
    });
    // camps members board
    app.get('/:lng/camps-members', userRole.isLoggedIn(), (req, res) => {
        req.breadcrumbs(i18next.t('camps:breadcrumbs.members'));
        res.render('pages/camps/members', {
            user: req.user,
            breadcrumbs: req.breadcrumbs()
        });
    });
    // camps documents
    app.get('/:lng/camps-docs', userRole.isLoggedIn(), (req, res) => {
        req.breadcrumbs(i18next.t('camps:breadcrumbs.docs'));
        res.render('pages/camps/docs', {
            user: req.user,
            breadcrumbs: req.breadcrumbs()
        });
    });
    /**
     * CRUD Routes
     */
    // Read
    app.get('/:lng/camps/:id', userRole.isLoggedIn(), (req, res) => {
        Camp.forge({
            id: req.params.id
        }).fetch({
            withRelated: ['details']
        }).then((camp) => {
            User.forge({
                user_id: camp.toJSON().main_contact
            }).fetch().then((user) => {
                res.render('pages/camps/camp', {
                    user: req.user,
                    id: req.params.id,
                    camp: camp.toJSON(),
                    details: camp.related('details').toJSON()
                });
            });
        }).catch((e) => {
            res.status(500).json({
                error: true,
                data: {
                    message: e.message
                }
            });
        });
    });
    // Edit
    app.get('/:lng/camps/:id/edit', userRole.isLoggedIn(), (req, res) => {
        Camp.forge({
            id: req.params.id
        }).fetch({
            withRelated: ['details']
        }).then((camp) => {
            res.render('pages/camps/edit', {
                user: req.user,
                camp: camp.toJSON(),
                details: camp.related('details').toJSON()
            })
        })
    });
    // Delete, make camp inactive
    app.get('/:lng/camps/:id/remove', userRole.isLoggedIn(), (req, res) => {
        Camp.forge({
            id: req.params.id
        }).fetch().then((camp) => {
            camp.save({
                status: 'inactive'
            }).then(() => {
                res.render('pages/camps/stats', {
                    user: req.user
                });
            }).catch(function (err) {
                res.status(500).json({
                    error: true,
                    data: {
                        message: err.message
                    }
                });
            });
        });
    });
    // Destroy
    app.get('/:lng/camps/:id/destroy', userRole.isAdmin(), (req, res) => {
        Camp.forge({
            id: req.params.id
        }).fetch().then((camp) => {
            camp.destroy().then(() => {
                res.render('pages/camps/stats', {
                    user: req.user
                });
            }).catch(function (err) {
                res.status(500).json({
                    error: true,
                    data: {
                        message: err.message
                    }
                });
            });
        });
    });
    // Test Route for New Camp Program
    // new Program
    app.get('/:lng/program', userRole.isLoggedIn(), (req, res) => {
        req.breadcrumbs('camps-new_program');
        res.render('pages/camps/program', {
            user: req.user,
            camp_name_en: req.query.c
        });
    });
};
