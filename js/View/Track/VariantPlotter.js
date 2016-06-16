define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'JBrowse/View/Track/CanvasFeatures',
    'JBrowse/Model/SimpleFeature',
    'JBrowse/Util'
],
function(
    declare,
    array,
    lang,
    CanvasFeatures,
    SimpleFeature,
    Util
) {
    return declare(CanvasFeatures, {
        _defaultConfig: function() {
            var thisB = this;
            return Util.deepUpdate(lang.clone(this.inherited(arguments)),
                {
                    glyph: 'GWASViewer/View/FeatureGlyph/Circle',
                    maxHeight: 210,
                    width: 10,
                    heightScaler: 1,
                    useYAxis: true,
                    displayMode: 'collapse',
                    useMyVariantInfo: false,
                    style: {
                        color: function(feature) { return 'hsl(' + (-Math.log(feature.get('score')) * 1.8) + ',50%,50%)'; },
                        showLabels: false
                    },
                    onClick: {
                        content: function(track, feature, featDiv, container) {
                            var ret;
                            if (track.config.useMyVariantInfo) {
                                ret = dojo.xhrGet({
                                    url: 'http://myvariant.info/v1/query?q=' + feature.get('name'),
                                    handleAs: 'json'
                                }).then(function(res) {
                                    var feat = thisB.processFeat(res.hits[0]);
                                    var content = track.defaultFeatureDetail(track, feat);
                                    return content;
                                });
                            } else {
                                ret = track.defaultFeatureDetail(track, feature, featDiv, container);
                            }
                            return ret;
                        }
                    }
                });
        },
        fillBlock: function(/* args */) {
            this.inherited(arguments);

            if (this.config.useYAxis) {
                this.makeHistogramYScale(this.config.maxHeight, 0, this.config.maxHeight / this.config.heightScaler);
            }
        },

        _getLayout: function() {
            var layout = this.inherited(arguments);

            var maxHeight = this.config.maxHeight;
            var heightScaler = this.config.heightScaler;
            var getScore = this.config.scoreFun || function(data) { return -Math.log(data.get('score')); };
            return declare.safeMixin(layout, {
                addRect: function(id, left, right, height, data) {
                    var pLeft   = Math.floor(left   / this.pitchX);
                    var pRight  = Math.floor(right  / this.pitchX);
                    var pHeight = Math.ceil(height / this.pitchY);

                    var midX = Math.floor((pLeft + pRight) / 2);
                    var y = maxHeight - 10 + (-getScore(data) * heightScaler);
                    this.pTotalHeight = this.maxHeight;

                    var rectangle = {
                        id: id,
                        l: pLeft,
                        r: pRight,
                        mX: midX,
                        h: pHeight,
                        top: Math.floor(y / this.pitchY)
                    };
                    if (data) {
                        rectangle.data = data;
                    }

                    this._addRectToBitmap(rectangle, data);
                    this.rectangles[id] = rectangle;
                    return y;
                }
            });
        },
        processFeat: function(f) {
            var start = +f._id.match(/chr.*:g.([0-9]+)/)[1];
            var feature = new SimpleFeature({
                id: f._id,
                data: {
                    start: start - 1,
                    end: start,
                    id: f._id
                }
            });

            var process = function(str, data, plus) {
                if (!data) {
                    return;
                }

                if (str.match(/snpeff/)) {
                    if (lang.isArray(data.ann)) {
                        array.forEach(data.ann, function(fm, i) { process(str + '_' + i, fm, i); });
                        return;
                    } else if (data.ann) {
                        delete data.ann.cds;
                        delete data.ann.cdna;
                        delete data.ann.protein;
                    } else {
                        delete data.cds; // Sub-sub-objects, not super informative
                        delete data.cdna;
                        delete data.protein;
                    }
                }
                if (str.match(/cadd/)) {
                    if (data.encode) {
                        process(str + '_encode', data.encode);
                    }
                    delete data.encode;
                }
                if (str.match(/clinvar/)) {
                    process(str + '_hgvs', data.hgvs);
                    delete data.hgvs;
                    if (lang.isArray(data.rcv)) {
                        array.forEach(data.rcv, function(elt, i) { process(str + '_rcv' + i, elt); });
                    } else {
                        process(str + '_rcv', data.rcv);
                    }
                    delete data.rcv;
                }
                if (str.match(/grasp/)) {
                    if (lang.isArray(data.publication)) {
                        array.forEach(data.publication, function(fm, i) { process(str + '_publication' + i, fm); });
                    }
                    delete data.publication;
                }

                feature.data[str + '_attrs' + (plus || '')] = {};
                var valkeys = array.filter(Object.keys(data), function(key) {
                    return typeof data[key] !== 'object';
                });

                var objkeys = array.filter(Object.keys(data), function(key) {
                    return typeof data[key] === 'object' && key !== 'gene';
                });

                array.forEach(valkeys, function(key) {
                    feature.data[str + '_attrs' + (plus || '')][key] = data[key];
                });
                array.forEach(objkeys, function(key) {
                    feature.data[str + '_' + key + (plus || '')] = data[key];
                });
            };

            process('cadd', f.cadd);
            process('cosmic', f.cosmic);
            process('dbnsfp', f.dbnsfp);
            process('dbsnp', f.dbsnp);
            process('evs', f.evs);
            process('exac', f.exac);
            process('mutdb', f.mutdb);
            process('wellderly', f.wellderly);
            process('snpedia', f.snpedia);
            process('snpeff', f.snpeff);
            process('vcf', f.vcf);
            process('grasp', f.grasp);
            process('gwassnps', f.gwassnps);
            process('docm', f.docm);
            process('emv', f.emv);
            process('clinvar', f.clinvar);

            return feature;
        }


    });
});
