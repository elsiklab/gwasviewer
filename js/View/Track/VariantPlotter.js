define( [
            'dojo/_base/declare',
            'dojo/_base/array',
            'dojo/_base/lang',
            'JBrowse/View/Track/CanvasFeatures',
            'JBrowse/Util'
        ],
        function(
            declare,
            array,
            lang,
            CanvasFeatures,
            Util
        ) {

var dojof = Util.dojof;

return declare( CanvasFeatures,
{
    _defaultConfig: function () {
        return Util.deepUpdate(
            lang.clone( this.inherited(arguments) ),
            {
                glyph: "VariantViewer/View/FeatureGlyph/Circle",
                maxHeight: 210,
                width: 10,
                heightScaler: 10,
                displayMode: "collapse"
            });
    },

    // override getLayout to access addRect method
    _getLayout: function () {
        var thisB = this;
        var layout = this.inherited(arguments);
        var maxHeight = this.config.maxHeight;
        return declare.safeMixin(layout, {
            addRect: function (id, left, right, height, data) {
                this.pTotalHeight = this.maxHeight;
                return 0;
            }
        });
    }
});
});
