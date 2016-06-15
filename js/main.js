define([
           'dojo/_base/declare',
           'JBrowse/Plugin'
       ],
       function(
           declare,
           JBrowsePlugin
       ) {
return declare( JBrowsePlugin,
{
    constructor: function( args ) {
        var browser = args.browser;

        // Do anything you need to initialize your plugin here
        console.log( 'GWAS plugin starting' );
        browser.registerTrackType({
            label: 'GWASViewer',
            type: 'GWASViewer/View/Track/VariantPlotter'
        });

    }
});
});
