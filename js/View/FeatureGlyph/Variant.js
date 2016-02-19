define([
           'dojo/_base/declare',
           'dojo/_base/array',
           'dojo/_base/lang',
           'JBrowse/View/FeatureGlyph/Box',
           'JBrowse/Util'
       ],
       function(
           declare,
           array,
           lang,
           FeatureGlyph,
           Util
       ) {

var dojof = Util.dojof;

return declare( FeatureGlyph, {
    getColor: function( feature, genotype, genotype_full ) {
        return this.getConf( 'style.color', [feature, genotype, genotype_full] );
    },
    renderFeature: function( context, fRect ) {
        if( fRect.f.get("type") != "SNV" ) return null;

        var genotypes = fRect.f.get("genotypes");
        var color = lang.hitch( this, 'getColor' );
        var style = lang.hitch( this, 'getStyle' );

        dojof.keys(genotypes).forEach(function(key, ret) {
            var col;
            if( genotypes[key].GT ) {
                var value_parse = genotypes[key].GT.values[0];
                var splitter = (value_parse.match(/[\|\/]/g)||[])[0];
                var split = value_parse.split( splitter );
                if( ( split[0]!=0   || split[1]!=0 ) &&
                    ( split[0]!='.' || split[1]!='.' ) ) {
                    col = color( fRect.f, 'alt', value_parse );
                }
                else {
                    col = color( fRect.f, 'ref', value_parse );
                }
            }
            else col = color( fRect.f, 'ref' );

            var place1 = ret*style( fRect.f, 'height' );
            var place2 = ret*style( fRect.f, 'spacer' );
            this.renderBox( context, fRect.viewInfo, fRect.f, place2||place1, 1, fRect.f, function() { return col; } );
        }, this);
    }
        
});
});

