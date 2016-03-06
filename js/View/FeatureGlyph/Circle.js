define(['dojo/_base/declare',
           'dojo/_base/lang',
           'JBrowse/View/FeatureGlyph/Box'],
       function(declare,
           lang,
           Box) {

return declare(Box, {

    renderBox: function( context, viewInfo, feature, top, overallHeight, parentFeature, style ) {

        var left  = viewInfo.block.bpToX( feature.get('start') );

        style = style || lang.hitch( this, 'getStyle' );
        var width = style( feature, 'width') || 10;

        var height = this._getFeatureHeight( viewInfo, feature );
        if( ! height )
            return;
        
        top = this.config.maxHeight - width + (Math.log(feature.get('score')) * this.config.heightScaler);

        // background
        context.beginPath();
        context.arc(left+width/2, top+width/2, width/2, 0, 2 * Math.PI, false);
        context.fillStyle = style( feature, 'color' );
        context.fill();
        context.lineWidth = 1;
        context.strokeStyle = style( feature, 'borderColor');
        context.stroke();
    }

});
});
