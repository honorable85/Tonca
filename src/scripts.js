import('./pdms').then(pdms => {
    pdms.default.initBootstrap();
    pdms.default.init();
    addToHomescreen();
});
