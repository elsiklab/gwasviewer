# variantviewer

A JBrowse plugin that adds some custom glyphs for variants

## Example configuration

  {
      "type": "VariantViewer/View/Track/VariantViewer",
      "urlTemplate": "variants.vcf.gz",
      "label": "Variant track",
      "storeClass": "JBrowse/Store/SeqFeature/VCFTabix",
      "style": {
          "height":1,
          "spacer":1,
          "color": "function(feat,gt) { return gt=='ref'? 'blue': 'orange'; }"
      }
  }
