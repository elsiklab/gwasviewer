define([
    'dojo/_base/declare',
    'dojo/_base/array',
    'dojo/_base/lang',
    'dojo/request',
    'dijit/Dialog',
    'JBrowse/View/Track/CanvasFeatures',
    'JBrowse/Model/SimpleFeature',
    'JBrowse/Util'
],
function (
    declare,
    array,
    lang,
    request,
    Dialog,
    CanvasFeatures,
    SimpleFeature,
    Util
) {
    return declare(CanvasFeatures, {
        constructor: function () {
            this.featMap = {};
        },
        _defaultConfig: function () {
            var thisB = this;
            return Util.deepUpdate(lang.clone(this.inherited(arguments)),
                {
                    glyph: function(feat) {
                        if(feat.get('name') == thisB.curr) {
                            return 'GWASViewer/View/FeatureGlyph/Diamond';
                        }
                        return 'GWASViewer/View/FeatureGlyph/Circle'
                    },
                    maxHeight: 210,
                    width: 10,
                    heightScaler: 1,
                    useYAxis: true,
                    displayMode: 'collapse',
                    useMyVariantInfo: false,
                    useMyVariantInfoURL: 'https://myvariant.info/v1/query?q=',
                    useMyVariantInfoArgs: '&email=colin.diesh@gmail.com&fields=all',
                    useEnsemblR2: false,
                    useEnsemblURL: 'https://rest.ensembl.org/ld/human/',
                    useEnsemblArgs: '?content-type=application/json;population_name=1000GENOMES:phase_3:KHV',
                    maxFeatureScreenDensity: 50,
                    onClick: {
                        action: function (feature) {
                            var track = this.track;
                            var d;
                            if (track.config.useEnsemblR2) {
                                track.curr = feature.get('name');
                                d = new Dialog({ content: 'Waiting for Ensembl LD REST API...', title: 'GWASViewer' });
                                d.show();
                                request(track.config.useEnsemblURL + feature.get('name') + track.config.useEnsemblArgs, {
                                    handleAs: 'json'
                                }).then(function (res) {
                                    track.featMap = {};
                                    res.forEach(function (r) {
                                        if (r.variation1 === feature.get('name')) {
                                            track.featMap[r.variation2] = +r.r2;
                                        } else if (r.variation2 === feature.get('name')) {
                                            track.featMap[r.variation1] = +r.r2;
                                        }
                                    });
                                    d.set('content', 'Success getting Ensembl LD REST API data!');
                                    setTimeout(function () {
                                        d.hide();
                                    }, 1000);
                                    track.redraw();
                                }, function (error) {
                                    d.set('content', 'Error getting ensembl data, status: ' + (error.response || {}).status + '<br>' + error);
                                });
                            } else if (track.config.useMyVariantInfo) {
                                d = new Dialog({ content: 'Waiting for myvariant.info API...', title: 'GWASViewer' });
                                d.show();
                                request(track.config.useMyVariantInfoURL + feature.get('name') + track.config.useMyVariantInfoArgs, {
                                    handleAs: 'json'
                                }).then(function (res) {
                                    var feat = track.processFeat(res.hits[0]);
                                    var content = track.defaultFeatureDetail(track, feat);
                                    d.hide();
                                    new Dialog({ content: content }).show();
                                }, function (error) {
                                    d.set('content', 'Error getting myvariant.info data, status: ' + (error.response || {}).status + '<br>' + error);
                                });
                            } else {
                                var content = track.defaultFeatureDetail(track, feature);
                                new Dialog({ content: content }).show();
                            }
                        }
                    },
                    style: {
                        color: function (feature, label, glyph, track) {
                            if (Object.keys(track.featMap).length) {
                                var n = feature.get('name');
                                if(n == track.curr) {
                                    return 'pink';
                                }
                                var r = track.featMap[n];
                                if (!r) return 'grey';
                                if (r < 0.2) { return 'hsl(220,50%,50%)'; }
                                if (r < 0.4) { return 'hsl(165,50%,50%)'; }
                                if (r < 0.6) { return 'hsl(110,50%,50%)'; }
                                if (r < 0.8) { return 'hsl(55,50%,50%)'; }
                                return 'hsl(0,50%,50%)';
                            }
                            return 'hsl(' + (-Math.log(feature.get('score')) * 1.8) + ',50%,50%)';
                        },
                        showLabels: false,
                        strandArrow: false
                    }
                });
        },
        fillBlock: function (/* args */) {
            this.inherited(arguments);

            if (this.config.useYAxis) {
                this.makeHistogramYScale(this.config.maxHeight, 0, this.config.maxHeight / this.config.heightScaler);
            }
        },

        updateStaticElements: function () {
            this.inherited(arguments);
            if (Object.keys(this.featMap).length) {
                var context = this.staticCanvas.getContext('2d');
                context.fillStyle = 'black';
                context.font = 'normal 12px sans-serif';
                context.fillText('r²', this.staticCanvas.width - 50, 15);
                context.translate(0, 20);
                context.fillText('0-0.2', this.staticCanvas.width - 93, 10);
                context.fillText('0.2-0.4', this.staticCanvas.width - 93, 20);
                context.fillText('0.4-0.6', this.staticCanvas.width - 93, 30);
                context.fillText('0.6-0.8', this.staticCanvas.width - 93, 40);
                context.fillText('0.8-1', this.staticCanvas.width - 93, 50);
                context.fillText('undef', this.staticCanvas.width - 93, 60);
                context.beginPath();
                context.strokeStyle = 'black';
                context.rect(this.staticCanvas.width - 50, 0, 30, 10);
                context.fillStyle = 'hsl(220,50%,50%)';
                context.fill();
                context.stroke();
                context.beginPath();
                context.rect(this.staticCanvas.width - 50, 10, 30, 10);
                context.fillStyle = 'hsl(165,50%,50%)';
                context.fill();
                context.stroke();
                context.beginPath();
                context.rect(this.staticCanvas.width - 50, 20, 30, 10);
                context.fillStyle = 'hsl(110,50%,50%)';
                context.fill();
                context.stroke();
                context.beginPath();
                context.rect(this.staticCanvas.width - 50, 30, 30, 10);
                context.fillStyle = 'hsl(55,50%,50%)';
                context.fill();
                context.stroke();
                context.beginPath();
                context.rect(this.staticCanvas.width - 50, 40, 30, 10);
                context.fillStyle = 'hsl(0,50%,50%)';
                context.fill();
                context.stroke();
                context.beginPath();
                context.rect(this.staticCanvas.width - 50, 50, 30, 10);
                context.fillStyle = 'grey';
                context.fill();
                context.stroke();
            }
        },

        _getLayout: function () {
            var layout = this.inherited(arguments);

            var maxHeight = this.config.maxHeight;
            var heightScaler = this.config.heightScaler;
            var getScore = this.config.scoreFun || function (data) { return -Math.log(data.get('score')); };
            return declare.safeMixin(layout, {
                addRect: function (id, left, right, height, data) {
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
        processFeat: function (f) {
            var start = +f._id.match(/chr.*:g.([0-9]+)/)[1];
            var feature = new SimpleFeature({
                id: f._id,
                data: {
                    start: start - 1,
                    end: start,
                    id: f._id
                }
            });

            var process = function (str, data, plus) {
                if (!data) {
                    return;
                }

                if (str.match(/snpeff/)) {
                    if (lang.isArray(data.ann)) {
                        array.forEach(data.ann, function (fm, i) { process(str + '_' + i, fm, i); });
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
                        array.forEach(data.rcv, function (elt, i) { process(str + '_rcv' + i, elt); });
                    } else {
                        process(str + '_rcv', data.rcv);
                    }
                    delete data.rcv;
                }
                if (str.match(/grasp/)) {
                    if (lang.isArray(data.publication)) {
                        array.forEach(data.publication, function (fm, i) { process(str + '_publication' + i, fm); });
                    }
                    delete data.publication;
                }

                feature.data[str + '_attrs' + (plus || '')] = {};
                var valkeys = array.filter(Object.keys(data), function (key) {
                    return typeof data[key] !== 'object';
                });

                var objkeys = array.filter(Object.keys(data), function (key) {
                    return typeof data[key] === 'object' && key !== 'gene';
                });

                array.forEach(valkeys, function (key) {
                    feature.data[str + '_attrs' + (plus || '')][key] = data[key];
                });
                array.forEach(objkeys, function (key) {
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
