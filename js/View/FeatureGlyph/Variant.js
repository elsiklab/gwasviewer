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

    renderFeature: function( context, fRect ) {
        if( fRect.f.get("type") != "SNV" ) return null;
        var genotypes = fRect.f.get("genotypes");
        dojof.keys(genotypes).forEach(function(key, i) {
            var col;
            if( genotypes[key].GT ) {
                var value_parse = genotypes[key].GT.values[0];
                var splitter = (value_parse.match(/[\|\/]/g)||[])[0];
                var split = value_parse.split( splitter );
                if( ( split[0]!=0   && split[1]!=0 ) &&
                    ( split[0]!='.' && split[1]!='.' ) )
                    col='#f00';
                else
                    col='#090';
            }
            else col='#090';
            this.renderBox( context, fRect.viewInfo, fRect.f, i*6, 3, fRect.f, function() { return col; } );
        }, this);
    }
//    ,
//    layoutFeature: function( viewArgs, layout, feature ) {
//        var rect = this.inherited( arguments );
//        if( ! rect ) {
//            return rect;
//        }
//
//        // need to set the top of the inner rect
//        var len = dojof.keys(feature.get("genotypes")).length
//        rect.rect.t=1000;
//
//        return rect;
//    }
        
});
});

