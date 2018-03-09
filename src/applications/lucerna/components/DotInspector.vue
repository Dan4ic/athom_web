<template>
  <div>
    <!-- Use the component -->
    <!--<svg width="400" height="400">-->
      <!--<g>-->
        <!--<polygon :points="points"></polygon>-->
        <!--<circle cx="200" cy="200" r="200"></circle>-->
        <!--<text v-for="label in labels" :x="label.x" :y="label.y">{{label.name}}</text>-->
      <!--</g>-->
    <!--</svg>-->

    <svg :width="diagram.width" :height="diagram.height" >
      <g v-for="(axis, i) in axisY">
        <text :x="axis.x" :y="axis.y">{{axis.value}}</text>
        <line :x1="diagram.legend.paddingLeft" :y1="axis.y" :x2="diagram.width" :y2="axis.y" style="stroke:rgb(196,196,196);stroke-width:1" />
      </g>
      <g v-for="(column, i) in columns">
        <rect :x="column.columnX" :y="column.columnY" :width="column.width" :height="column.height" :style="{fill:column.color}" />
        <text :x="column.textX" :y="column.textY">{{column.name}}</text>
      </g>
    </svg>

    <!-- controls -->
    <v-layout v-for="channel in channels" row>
      <v-flex xs3>
        <v-subheader>{{channel.name}}</v-subheader>
      </v-flex>
      <v-flex xs8>
        <v-slider min="0" max="100" v-model="channel.value" thumb-label></v-slider>
      </v-flex>
      <v-flex xs1>
        <v-text-field v-model="channel.value" type="number" min="0" max="100"></v-text-field>
      </v-flex>
    </v-layout>

    <!--<pre>{{value}}</pre>-->
  </div>
</template>

<script>

  import consts from 'consts';

  export default {

    props: ['value'],

    data() {
      let channels = this.value[0].channels;

      return {
        radarRadius: 200,

        diagram: {
          width: 400,
          height: 400,
          chart: {
            columnSpace: 40,
          },
          legend: {
            paddingTop: 20,
            paddingLeft: 40,
            paddingBottom: 40,
            paddingX: 10,
            paddingY: 20,
            axisYPaddingX: 10,
            axisYStepCount: 5
          }
        },

        dot: this.value[0],
        channels: channels
      };
    },

    computed: {
      // // a computed property for the polygon's points
      // points() {
      //   let total = this.channels.length;
      //   return this.channels.map((channel, i) => {
      //     let point = this.valueToPoint(channel.value, i, total);
      //     return point.x + ',' + point.y
      //   }, this).join(' ');
      // },

      columns() {
        let chartWidth = this.diagram.width - this.diagram.legend.paddingLeft;
        let chartHeight = this.diagram.height - this.diagram.legend.paddingBottom - this.diagram.legend.paddingTop;

        let total = this.channels.length;
        let columnWidth = Math.round((chartWidth - (total - 1) * this.diagram.chart.columnSpace) / total);
        return this.channels.map((channel, i) => {
          let offsetX = Math.round((columnWidth + this.diagram.chart.columnSpace) * i);
          let height = Math.round(channel.value / 100 * chartHeight);
          return {
            name: channel.name,
            columnX: this.diagram.legend.paddingLeft + offsetX,
            columnY: chartHeight - height + this.diagram.legend.paddingTop,
            textX: this.diagram.legend.paddingLeft + offsetX + this.diagram.legend.paddingX ,
            textY: this.diagram.height - this.diagram.legend.paddingY,
            width: columnWidth,
            height: height,
            color: channel.color
          };
        }, this);
      },

      axisY() {
        let axisYStepCount = this.diagram.legend.axisYStepCount;
        let axisHeight = this.diagram.height - this.diagram.legend.paddingBottom - this.diagram.legend.paddingTop;
        let axisStep = axisHeight / axisYStepCount;
        let axisY = [];
        for (let i = axisYStepCount; i >= 0; i--) {
          axisY.push({
            x: this.diagram.legend.axisYPaddingX,
            y: Math.round(i * axisStep) + this.diagram.legend.paddingTop,
            value: 100 - Math.round(100 / axisYStepCount * i)  + '%'
          });
        }
        return axisY;
      }//,

      // labels() {
      //   let total = this.channels.length;
      //   return this.channels.map((channel, i) => {
      //     let point = this.valueToPoint(channel.value + 10, i, total);
      //     return {
      //       name: i,
      //       x: point.x,
      //       y: point.y
      //     };
      //   }, this);
      // }
    },

    methods: {
      valueToPoint(value, index, total) {
        let x = 0;
        let y = -value * 0.8;
        let angle = Math.PI * 2 / total * index;
        let cos = Math.cos(angle);
        let sin = Math.sin(angle);
        let tx = x * cos - y * sin + 100;
        let ty = x * sin + y * cos + 100;
        return {
          x: tx,
          y: ty
        };
      }
    }
  }

</script>

<style lang="less" rel="stylesheet/less">

    .dot-inspector {

    }

    .dot-inspector polygon {
      fill: #42b983;
      opacity: .75;
    }

    .dot-inspector circle {
      fill: transparent;
      stroke: #999;
    }

    .dot-inspector text {
      font-family: Helvetica Neue, Arial, sans-serif;
      font-size: 10px;
      fill: #666;
    }

    .dot-inspector label {
      display: inline-block;
      margin-left: 10px;
      width: 100px;
    }

    .dot-inspector #raw {
      position: absolute;
      top: 0;
      left: 300px;
    }

</style>
