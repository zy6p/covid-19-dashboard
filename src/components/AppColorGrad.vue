<template>
  <div class="gradient" v-html="s"></div>
</template>

<script lang="js">
const chroma = require('chroma-js');

export default {
  name: "AppColorGrad",
  props: {
    colorMap: {
      type: [String, Array],
      default: ""
    }
    // radio2ColorMap,
  },
  setup(props) {
    let s = '';
    let d = chroma.scale(props.colorMap);
    let dom = d.domain ? d.domain() : [0, 1],
        dmin = Math.min(dom[0], dom[dom.length - 1]),
        dmax = Math.max(dom[dom.length - 1], dom[0]);
    for (let i = 0; i <= 100; i++) {
      s += '<span class="grad-step" style="background-color:' + d(dmin + i / 100 * (dmax - dmin)) + '"></span>';
    }
    // s += '<span class="domain-min">' + dmin + '</span>';
    // s += '<span class="domain-med">' + ((dmin + dmax) * 0.5) + '</span>';
    // s += '<span class="domain-max">' + dmax + '</span>';

    return {
      s,
    };
  }
}
</script>

<style scoped>
</style>
