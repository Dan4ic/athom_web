<template>
  <div>
    <svg :width="options.width" :height="options.height"
         @mousemove="onMouseMove($event)"
         @mouseup="onMouseUp($event)"
         @touchmove.prevent="onTouchMove($event)"
         @touchend.prevent="onMouseUp($event)">

      <g v-for="(axis, i) in control.axises" class="axises">
        <text :x="axis.x" :y="axis.y" dy="0.28em">{{axis.value}}%</text>
        <line :x1="options.axis.y.width" :y1="axis.y" :x2="options.width" :y2="axis.y" />
      </g>

      <g class="brightness">
        <text :x="control.brightness.x" :y="control.brightness.y" dy="0.28em">{{control.brightness.value}}%</text>
        <line :x1="options.axis.y.width" :y1="control.brightness.y" :x2="options.width" :y2="control.brightness.y" />
      </g>

      <g v-for="(slider, i) in control.sliders" class="channel">
        <g class="button increase"
           @mousedown="increaseSlider($event, slider)"
           @touchstart="increaseSlider($event, slider)">
          <circle :r="options.slider.bottom.button.radius" :cx="slider.buttons.plus.x" :cy="slider.buttons.plus.y" :fill="slider.color" />
          <text :x="slider.buttons.plus.x" :y="slider.buttons.plus.y" dy="0.23em">{{options.slider.top.button.text}}</text>
        </g>

        <rect :x="slider.offsetX" :y="slider.offsetY" :width="slider.width" :height="slider.height" :fill="slider.color" :stroke="slider.color"
              @mousedown="onMouseDownSlider($event, slider)"
              @touchstart="onTouchDownSlider($event, slider)"/>

        <g @mousedown="onMouseDownToggle($event, slider)"
           @touchstart="onMouseDownToggle($event, slider)">
          <circle :r="options.slider.rail.radius" :cx="slider.position.x" :cy="slider.position.y" :fill="slider.color"/>
          <text :x="slider.position.x" :y="slider.position.y" dy="0.23em" class="value">{{slider.displayValue.toFixed(1)}}</text>
        </g>

        <g class="button decrease"
           @mousedown="decreaseSlider($event, slider)"
           @touchstart="decreaseSlider($event, slider)">
          <circle :r="options.slider.bottom.button.radius" :cx="slider.buttons.minus.x" :cy="slider.buttons.minus.y" :fill="slider.color" />
          <text :x="slider.buttons.minus.x" :y="slider.buttons.minus.y" dy="0.28em">{{options.slider.bottom.button.text}}</text>
        </g>

        <rect :class="'toggle' + (slider.lock ? ' lock' : ' unlock')"
              :x="slider.toggle.x" :y="slider.toggle.y"
              :width="options.slider.toggle.width" :height="options.slider.toggle.height"
              @mousedown="toggleLockSlider($event, slider)"
              @touchstart="toggleLockSlider($event, slider)" />
      </g>
    </svg>

    <pre>{{dot}}</pre>
  </div>
</template>

<script>

  import consts from 'consts';

  export default {

    props: ['value'],

    data() {
      let channels = this.value[0].channels;

      return {
        options: {
          width: 350,
          height: 500,
          slider: {
            width: 50,
            top: {
              height: 50,
              button: {
                radius: 16,
                text: "+"
              }
            },
            bottom: {
              height: 50,
              button: {
                radius: 16,
                text: "-"
              }
            },
            rail: {
              width: 8,
              radius: 14,
              padding: 10
            },
            toggle: {
              width: 20,
              height: 20,
              bottom: 2
            }
          },
          axis: {
            y: {
              width: 30,
              count: 5,
              left: 0
            },
            x: {
              height: 24
            }
          },
        },

        dot: this.value[0],
        channels: channels
      };
    },

    computed: {

      control() {
        const total = this.channels.length;
        const slidersWidth = Math.round((this.options.width - this.options.axis.y.width) / total);
        const slidersHeight = this.options.height - (this.options.slider.top.height + this.options.slider.bottom.height + this.options.axis.x.height);

        let data = {
          movedSlider: null,
          axises: []
        };

        let axisYHeight = slidersHeight - this.options.slider.rail.padding * 2;
        let axisYStep = axisYHeight / this.options.axis.y.count;
        let axisYStepPercents = Math.round(1000 / this.options.axis.y.count) / 10;
        for (let i = this.options.axis.y.count; i >= 0; i--) {
          data.axises.push({
            x: this.options.axis.y.left,
            y: Math.round(i * axisYStep) + this.options.slider.top.height + this.options.slider.rail.padding,
            value: Math.round((100 - axisYStepPercents * i) * 10) / 10
          });
        }

        data.brightness = {
          x: this.options.axis.y.left,
          y: Math.round(axisYHeight * (1 - this.dot.brightness)) + this.options.slider.top.height + this.options.slider.rail.padding,
          value: Math.round(this.dot.brightness * 1000) / 10
        };

        data.sliders = this.channels.map((channel, i) => {
          let sliderOffsetX = this.options.axis.y.width + slidersWidth * i + slidersWidth / 2 - this.options.slider.rail.width / 2;
          let sliderOffsetY = this.options.slider.top.height + this.options.slider.rail.padding;
          let sliderWidth = this.options.slider.rail.width;
          let sliderHeight = slidersHeight - this.options.slider.rail.padding * 2;

          let sliderPositionX = sliderOffsetX + this.options.slider.rail.width / 2;
          let sliderPositionY = sliderOffsetY + (sliderHeight - sliderHeight * channel.value);

          let buttonPlusPositionY = this.options.slider.top.height / 2;
          let buttonMinusPositionY = this.options.slider.top.height + slidersHeight + this.options.slider.bottom.height / 2;

          let togglePositionX = sliderOffsetX + this.options.slider.rail.width / 2 - this.options.slider.toggle.width / 2;
          let togglePositionY = this.options.height - this.options.slider.toggle.height - this.options.slider.toggle.bottom;

          let displayValue = Math.round(channel.value * 1000) / 10;

          return {
            index: i,
            name: channel.name,
            color: channel.color,
            value: channel.value,
            displayValue: displayValue,
            lock: !!channel.lock,
            offsetX: sliderOffsetX,
            offsetY: sliderOffsetY,
            width: sliderWidth,
            height: sliderHeight,
            position: {
              x: sliderPositionX,
              y: sliderPositionY
            },
            buttons: {
              plus: {
                x: sliderPositionX,
                y: buttonPlusPositionY,
              },
              minus: {
                x: sliderPositionX,
                y: buttonMinusPositionY,
              }
            },
            toggle: {
              x: togglePositionX,
              y: togglePositionY,
              lock: false
            }
          };
        }, this);

        return data;
      }
    },

    methods: {

      onMouseDownToggle(e, slider) {
        console.log('onMouseDownToggle');
        this.movedSlider = slider;
      },

      onMouseDownSlider(e, slider) {
        let delta = slider.offsetY + slider.height - e.offsetY;
        let value = delta / slider.height;
        value = Math.max(Math.min(value, 1), 0);
        this.calculateChannels(slider, value);
      },

      onTouchDownSlider(e, slider) {
        if (e.touches.length > 1 || (e.type === "touchend" && e.touches.length > 0))
          return;

        let touch = e.changedTouches[0];

        // TODO need to ask Roman how to fix it.
        let delta = slider.offsetY + slider.height + this.options.slider.top.height - touch.clientY + touch.radiusY + 5;
        let value = delta / slider.height;
        value = Math.max(Math.min(value, 1), 0);
        this.calculateChannels(slider, value);
      },

      onMouseUp(e) {
        this.movedSlider = null;
      },

      onMouseMove(e) {
        if (this.movedSlider) {
          this.onMouseDownSlider(e, this.movedSlider);
        }
      },

      onTouchMove(e) {
        if (this.movedSlider) {
          this.onTouchDownSlider(e, this.movedSlider);
        }
      },

      increaseSlider(e, slider) {
        let newValue = Math.min(slider.value + 0.01, 1);
        this.calculateChannels(slider, newValue);
      },

      decreaseSlider(e, slider) {
        let newValue = Math.max(slider.value - 0.01, 0);
        this.calculateChannels(slider, newValue);
      },

      toggleLockSlider(e, slider) {
        this.channels[slider.index].lock = !this.channels[slider.index].lock;
      },

      calculateChannels(slider, channelValue) {
        if (!this.dot.totalBrightnessPower) {
          this.dot.totalCorrelation = this.channels.map(ch => ch.correlation).reduce((a, b) => a + b, 0);
          this.dot.totalBrightnessPower = this.dot.brightness * this.dot.totalCorrelation;
        }

        let currentChannel = this.channels[slider.index];
        let maxChannelValue = this.dot.totalBrightnessPower / currentChannel.correlation;
        channelValue = Math.min(channelValue, maxChannelValue, 1);

        let channelBrightnessPower = channelValue * currentChannel.correlation;
        let restBrightnessPower = this.dot.totalBrightnessPower - channelBrightnessPower;
        let channelsBrightnessPower = this.channels
          .filter((ch, i) => i !== slider.index)
          .map(ch => ch.correlation * ch.value)
          .reduce((a, b) => a + b, 0);

        let unlockCorrelation = this.channels
          .filter((ch, i) => !ch.lock && i !== slider.index)
          .map(ch => ch.correlation)
          .reduce((a, b) => a + b, 0);

        let deltaBrightnessPower = restBrightnessPower - channelsBrightnessPower;
        for (let i = 0; i < this.channels.length; i++) {
          let ch = this.channels[i];
          if (i !== slider.index && !ch.lock) {
            let deltaChannelPower = deltaBrightnessPower / unlockCorrelation * ch.correlation;
            deltaBrightnessPower -= deltaChannelPower;

            let oldValue = ch.value;
            let newValue = oldValue + deltaChannelPower / ch.correlation;
            if (newValue > 1) {
              let overValue = newValue - 1;
              deltaBrightnessPower += overValue * ch.correlation;
              newValue = 1;
            } else if (newValue < 0) {
              let underValue = 0 - newValue;
              deltaBrightnessPower -= underValue * ch.correlation;
              newValue = 0;
            }
            unlockCorrelation -= ch.correlation;
            ch.value = newValue;
          }
        }

        if (deltaBrightnessPower !== 0) {
          channelValue = (channelBrightnessPower + deltaBrightnessPower) / currentChannel.correlation
        }

        currentChannel.value = channelValue;
        slider.value = channelValue;
      }

    }
  }

</script>

<style lang="less" rel="stylesheet/less">
    .dot-inspector pre {
      font-size: 10px;
      overflow-y: scroll;
      height: 250px;
    }

    .dot-inspector text {
      font-family: Helvetica Neue, Arial, sans-serif;
    }

    .dot-inspector label {
      display: inline-block;
      margin-left: 10px;
      width: 100px;
    }

    .dot-inspector .axises text{
      stroke: #007e9a;
      font-size: 10px;
    }

    .dot-inspector .axises line {
      stroke: #00b8d4;
      stroke-width: 1px
    }

    .dot-inspector .brightness text{
      stroke: #b71c1c;
      font-size: 10px;
    }
    .dot-inspector .brightness line {
      stroke: #b71c1c;
      stroke-width: 2px
    }

    .dot-inspector .channel > rect {
      opacity: 0.6;
      stroke-linecap: "round";
      stroke-width: 5px;
    }

    .dot-inspector .channel:hover rect {
      opacity: 1;
    }

    .dot-inspector .channel > g circle {
      stroke: #888;
      stroke-opacity: 0.6;
      stroke-width: 2px;
    }

    .dot-inspector .channel:hover circle {
      stroke-opacity: 1;
    }

    .dot-inspector .channel .button > circle {
      stroke: #888;
      stroke-opacity: 0.6;
      stroke-width: 2px;
    }

    .dot-inspector .channel .button:hover circle {
      stroke-opacity: 1;
    }

    .dot-inspector .channel text.value {
      color: #FFF;
      font-size: 10px;
      text-anchor: middle;
    }

    .dot-inspector .channel .button > text {
      color: #222;
      font-size: 26px;
      text-anchor: middle;
    }

    .dot-inspector .channel .toggle {
      stroke: #222;
      stroke-opacity: 0.6;
      stroke-width: 1px;
      font-size: 26px;
      text-anchor: middle;
    }

    .dot-inspector .channel .lock {
      fill: #ff9c9b;
    }

    .dot-inspector .channel .unlock {
      fill: #eae7ff;
    }


</style>
