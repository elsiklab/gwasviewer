define( [
            'dojo/_base/declare',
            'dojo/_base/array',
            'dojo/_base/lang',
            'JBrowse/View/Track/CanvasVariants',
            'JBrowse/Util'
        ],
        function(
            declare,
            array,
            lang,
            CanvasVariants,
            Util
        ) {

var dojof = Util.dojof;

return declare( CanvasVariants,
{
    _defaultConfig: function () {
        return Util.deepUpdate(
            lang.clone( this.inherited(arguments) ),
            {
                "glyph": "VariantViewer/View/FeatureGlyph/Circle"
            });
    },

    // override getLayout to access addRect method
    _getLayout: function () {
        var thisB = this;
        var layout = this.inherited(arguments);
        return declare.safeMixin(layout, {
            addRect: function (id, left, right, height, data) {
                this.pTotalHeight = 210;
                return this.pTotalHeight;
            }
        });
    }
});
});
