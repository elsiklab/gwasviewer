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
                "glyph": "VariantViewer/View/FeatureGlyph/Variant",
                "style": {
                    "color": function(feat, gt, gt_full) { return gt=='ref'? 'blue': 'orange'; }
                }
            });
    },

    // override getLayout to access addRect method
    _getLayout: function () {
        var thisB = this;
        var layout = this.inherited(arguments);
        return declare.safeMixin(layout, {
            addRect: function (id, left, right, height, data) {
                this.pTotalHeight = dojof.keys( data.get('genotypes') ).length/2 * (thisB.config.style.spacer||thisB.config.style.height||2);
                return this.pTotalHeight;
            }
        });
    }
});
});
