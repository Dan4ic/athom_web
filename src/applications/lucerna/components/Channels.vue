<template>
    <g :transform="['translate(' + left +','+ top + ')']">
        <template v-for="channel, index in channels">
            <rect
                    class="channel-item"
                    :style = "{'fill' : channel.color, 'opacity' : channel.expand ? 1 : 0.3}"
                    :x="channel.x - getExpanderWidth(channel)"
                    :y="channel.y - radius"
                    :rx="radius"
                    :ry="radius"
                    :width="getWidth(channel)"
                    :height="radius * 2"
                    @mousemove.prevent="onMouseMove(channel)"
                    @mouseleave.prevent="onMouseLeave(channel)"
            />
            <text
                    :y="channel.y + 1"
                    :x="channel.x + radius * 0.75"
                    :dy="fontHeight * 0.25"
                    text-anchor="middle"
                    class="channel-level"
                    :font-size="`${fontHeight}px`"
                    :style="{'fill' : getContrastYIQ(channel.color.slice(-6))}"
                    @mousemove.prevent="onMouseMove(channel)"
                    @mouseleave.prevent="onMouseLeave(channel)"
            >
                {{value[index].level|percent}}
            </text>
        </template>
    </g>
</template>

<script>

    import Сonsts from 'consts';
    import Utils from '../utils';

    export default {

        props: {
            value : {
                type : Array,
                required: true,
            },
            left : {
                type : Number,
                default: 0
            },
            top : {
                type : Number,
                default: 0
            },
            width : {
                type : Number,
                default: 0
            },
            height : {
                type : Number,
                default: 0
            }
        },
        methods : {
            getContrastYIQ(hexcolor){
                return Utils.getContrastYIQ(hexcolor)
            },
            onMouseMove(channel) {
                channel.expand = true;
            },
            onMouseLeave(channel) {
                channel.expand = false;
            },
            getExpanderWidth(channel){
                return channel.expand ? this.radius * 10: this.radius * 0.5;
            },
            getWidth(channel){
                return this.radius * 2 + this.getExpanderWidth(channel);
            }
        },
        computed :{
        },

        filters: {
            percent(value) {
                return !value ? 0 : (value * 100).toFixed(2);
            },
        },
        watch : {
            width(){

            },
            height(){

            }
        },

        data(){
            let result = {
                channels : [],
                cellHeight : (this.height - 16) / this.value.length,
            };
            console.log(result.cellHeight, this.width);
            result.radius = (result.cellHeight > this.width ? this.width : result.cellHeight) / 2;
            result.fontHeight = result.radius * 0.75;

            let top_offset = 0;
            this.value.map((channel) => {
                result.channels.push({
                    expand: false,
                    color: channel.color,
                    level: channel.level,
                    x: this.width / 2,
                    y: top_offset,
                });
                top_offset += (!top_offset ? result.radius * 0.75 : 0) + result.radius * 2 + 2;
            });
            return result;
        }

    }
</script>

<style lang="less" rel="stylesheet/less">

    .channel-item {
        cursor: pointer;
        stroke : #0000f5;
        stroke-width: 0.5px;
        transition: all 0.15s ease-in;
    }

    .channel-level {
        cursor: pointer;
    }

</style>