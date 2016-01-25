define([
           'dojo/_base/declare',
           'dojo/_base/array',
           'JBrowse/View/FeatureGlyph/Box',
           'JBrowse/Util'
       ],
       function(
           declare,
           array,
           FeatureGlyph,
           Util
       ) {

var dojof = Util.dojof;

return declare( FeatureGlyph, {

    constructor: function() {

    },

    _defaultConfig: function() {
        return this.inherited(arguments);
    },

    renderFeature: function( context, fRect ) {
        var p = fRect.f.get("genotypes");
        var i = 0;
        var thisB = this;
        dojof.keys(p).forEach(function(key) {
            var col;
            var f = p[key];
            if(f.GT) {
                var value_parse=f.GT.values[0];
                var splitter = (value_parse.match(/[\|\/]/g)||[])[0];
                var split=value_parse.split(splitter);
                if((split[0]!=0&&split[1]!=0 )&& (split[0]!='.'&&split[1]!='.'))
                    col='#f00';
                else
                    col='#090';
            }
            else col='#090';

            thisB.renderBox( context, fRect.viewInfo, fRect.f, i*6, 5, fRect.f, function() { return col }  );
            i++;
        })
    },
    layoutFeature: function( viewArgs, layout, feature ) {
        var rect = this.inherited( arguments );
        if( ! rect ) {
            return rect;
        }

        // need to set the top of the inner rect
        var len=Object.keys(feature.get("genotypes")).length
        rect.rect.t=1000;

        return rect;
    }
        
});
});

