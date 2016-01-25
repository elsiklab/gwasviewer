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
            CanvasFeatures,
            Util
        ) {

var dojof = Util.dojof;

return declare( CanvasFeatures,
{
    
    _defaultConfig: function () {
        var config = this.inherited(arguments);
        config.glyph = "VariantViewer/View/FeatureGlyph/Variant";
        return config;
    },

    // override getLayout to access addRect method
    _getLayout: function () {
        var thisB = this;
        var layout = this.inherited(arguments);
        return declare.safeMixin(layout, {
            addRect: function (id, left, right, height, data) {
                this.pTotalHeight = Math.min( dojof.keys(data.get('genotypes')) * 5, thisB.maxHeight );
                return this.pTotalHeight;
            }
        });
    }
});
});
