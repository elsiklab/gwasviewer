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
        console.log('here');
        return dojo.mixin( dojo.clone( this.inherited(arguments), { "glyph": "VariantViewer/View/FeatureGlyph/Variants" }) );
    },

    // override getLayout to access addRect method
    _getLayout: function () {
        var thisB = this;
        var browser = this.browser;
        var layout = this.inherited(arguments);
        var clabel = this.name + "-collapsed";
        return declare.safeMixin(layout, {
            addRect: function (id, left, right, height, data) {
                this.pTotalHeight = Math.max( dojof.keys(data.get('genotypes')) * 5, thisB.maxHeight );
                return 0;
            }
        });
    }
});
});
