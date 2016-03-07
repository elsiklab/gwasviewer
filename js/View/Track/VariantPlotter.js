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
                heightScaler: 1,
                displayMode: "collapse",
                style: {
                    color: function(feature) { return 'hsl(' + ( -Math.log(feature.get('score')) * 5 ) + ',50%,50%)'; },
                    showLabels: false,
                    // example to only show labels above a certain threshold
                    //label: function(feature) { return -Math.log(feature.get('score'))>50 ? feature.get('name') : null; }
                }
            });
    },
    fillBlock: function(args) {
        this.inherited(arguments);
        this.makeHistogramYScale( this.config.maxHeight, 0, this.config.maxHeight/this.config.heightScaler );
    },

    // override getLayout to access addRect method
    _getLayout: function () {
        var thisB = this;
        var layout = this.inherited(arguments);
        var maxHeight = this.config.maxHeight;
        var heightScaler = this.config.heightScaler;
        return declare.safeMixin(layout, {
            addRect: function (id, left, right, height, data) {
                var pLeft   = Math.floor( left   / this.pitchX );
                var pRight  = Math.floor( right  / this.pitchX );
                var pHeight = Math.ceil(  height / this.pitchY );

                var midX = Math.floor((pLeft+pRight)/2);
                var y = maxHeight - 10 + ( Math.log(data.get('score')) * heightScaler );
                this.pTotalHeight = this.maxHeight;

                var rectangle = { id: id, l: pLeft, r: pRight, mX: midX, h: pHeight, top: Math.floor(y/this.pitchY) };
                if( data )
                    rectangle.data = data;

                this._addRectToBitmap(rectangle, data);
                this.rectangles[id] = rectangle;
                return y;
            }
        });
    }
});
});
