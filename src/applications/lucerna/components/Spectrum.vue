<template>
    <g>
        <defs>
            <linearGradient id="spectrumGradient">
                <stop
                        v-for="stop in gradient"
                        :key="stop.key"
                        :offset="stop.offset"
                        :style="{'stop-color' : stop.color}"
                />
            </linearGradient>
        </defs>
        <path :d="path" fill="url(#spectrumGradient)" :opacity="opacity"/>
        <template v-for="line in axis">
            <line
                    class="line-wave"
                    :x1="line.x"
                    :x2="line.x"
                    :y1="height - line.length"
                    :y2="height"
                    :opacity="opacity"
            ></line>
            <text
                    v-if="!(line.wave % 50)"
                    class="text-wave"
                    :x="line.x"
                    :dy="height - line.length - textHeight * 0.5 "
                    :font-size="textHeight"
                    text-anchor="middle"
                    :opacity="opacity"
            >{{line.wave}}nm</text>
        </template>
    </g>
</template>

<script>

    import consts from 'consts';
    import waves from './waves.json';

    export default {

        props: ['value', 'width', 'height', 'opacity', 'text-height'],

        computed :{
            axis(){
                let result = [];
                let k = this.width / (this.waveStop - this.waveStart);
                for(let w = this.waveStart, offset = 0; w<this.waveStop; w++, offset++){
                    if(!(w % 10))
                        result.push({
                            wave : w,
                            x : (w - this.waveStart) * k,
                            length : w % 50 ? this.textHeight : this.textHeight * 2
                        });
                }

                return result;
            },
            path(){
                let spectum = this.$store.state.lucerna.channels[0].spectrum;
                let max = 0;
                for(let w in spectum){
                    if(spectum[w] > max)
                        max = spectum[w];
                }

                let result = this.gradient.map((stop) => {
                    if(spectum[stop.key])
                        return (stop.offset * this.width).toFixed(4) + ' ' + (1 * this.height - spectum[stop.key] / max * this.height)
                    else
                        return (stop.offset * this.width).toFixed(4) + ` ${this.height}`;
                }).join(',');

                return `M0 ${this.height}, ${result}, ${this.width} ${this.height}`;
            },

            gradient(){
                let result  = [];
                let total   = this.waveStop - this.waveStart;
                for(let w = this.waveStart, offset = 0; w<this.waveStop; w++, offset++){
                    result.push({
                        key : w,
                        offset : offset / total,
                        color : this.waves[w]
                    });
                }
                return result;
            }
        },

        data(){
            return {
                waveStart : 360,
                waveStop  : 750,
                waves   : waves
            }
        }

    }
</script>

<style lang="less" rel="stylesheet/less">

    .text-wave {
    }

    .line-wave {
        stroke-width: 1px;
        stroke: #000;
    }

    .dot-inspector {

    }

</style>