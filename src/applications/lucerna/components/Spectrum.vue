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
    </g>
</template>

<script>

    import consts from 'consts';
    import waves from './waves.json';

    export default {

        props: ['value', 'width', 'height', 'opacity'],

        computed :{
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

    .dot-inspector {

    }

</style>