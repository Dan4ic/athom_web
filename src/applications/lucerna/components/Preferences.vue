<template>
    <v-form ref="form" lazy-validation>
        <v-card style="width: 100%">
            <v-card-title primary-title>
                <v-container style="padding: 0">
                    <v-layout row>
                        <h1>{{'PREFS_TITLE' | lang}}</h1>
                    </v-layout>
                    <v-layout :wrap="isMobileScreen">
                        <v-flex :xs12="isMobileScreen" :xs6="!isMobileScreen" class="col1">
                            <v-text-field
                                    v-model="daysNumber"
                                    class="col1"
                                    :label="'DAYS_NUMBER' | lang"
                                    type="number"
                                    min="1"
                                    max="365"
                            ></v-text-field>
                        </v-flex>
                        <v-flex :xs12="isMobileScreen" :xs6="!isMobileScreen" class="col2">
                            <v-text-field
                                    v-model="channelsNumber"
                                    :label="'CHANNELS_NUMBER' | lang"
                                    type="number"
                                    min="1"
                                    max="16"
                            ></v-text-field>
                        </v-flex>
                    </v-layout>
                    <v-layout row>
                        <h3>{{'COLORS_TITLE' | lang}}</h3>
                    </v-layout>
                    <v-layout row wrap>
                        <template v-for="i in channelsNumber" >
                            <label
                                    class="color-packer"
                                    :style="{
                                        'background-color' : config.channels[i - 1],
                                        'color' : getContrastYIQ(config.channels[i - 1])
                                    }"
                            >{{i}}
                                <input type="color" :placeholder="i + 1" v-model="config.channels[i - 1]"/>
                            </label>
                        </template>
                    </v-layout>
                </v-container>
            </v-card-title>
            <v-card-actions text-xs-right>
                <v-btn @click="submit">{{'SUBMIT' | lang }}</v-btn>
                <v-btn @click="reset" flat>{{'RESET' | lang }}</v-btn>

                <v-btn @click="download" class="download-file" icon :title="'DOWNLOAD' | lang ">
                    <v-icon color="grey" large>archive</v-icon>
                </v-btn>
                <label class="upload-file" :title="'UPLOAD' | lang ">
                    <v-icon color="grey" large>unarchive</v-icon>
                    <input type="file" @change="upload" accept=".json"/>
                </label>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>

    import Utils from '../utils';
    let consts = window.$consts;

    export default {
        name: 'SettingsLucerna',
        computed : {
            config(){
                if(this.$store.state.Lucerna.data.configs) {
                    this.$store.commit('Lucerna/data/applyData', {name : 'config', data : []});
                    this.$store.dispatch('Lucerna/data/reload', 'config');
                }

                if(!this.$store.state.Lucerna.data.config.length)
                    this.new_config = {
                        channelNumber : 4,
                        channels : [
                            '#f4fcde', '#0000FF', '#FF0000', '#f533ee',
                            '#f4fcde', '#0000FF', '#FF0000', '#f533ee',
                            '#f4fcde', '#0000FF', '#FF0000', '#f533ee',
                            '#f4fcde', '#0000FF', '#FF0000', '#f533ee'
                        ],
                        interval : {
                            width : 86400
                        }
                    };
                else if(!this.new_config)
                    this.new_config = this.copyConfig(this.$store.state.Lucerna.data.config[0], 'ui');

                return this.new_config;
            },


            daysNumber: {
                get(){
                    return this.config.interval.width / 86400;
                },
                set(value){
                    this.config.interval.width = (value < 1 ? 1 : (value < 365 ? value : 365)) * 86400;
                }
            },

            channelsNumber: {
                get(){
                    return this.config.channelNumber;
                },
                set(value){
                    this.config.channelNumber = (+value < 1 ? 1 : (+value > 16 ? 16 : +value));
                }
            }
        },
        methods : {
            copyConfig(source, to){
                let result = {
                    channelNumber : source.channelNumber,
                    channels : [],
                    interval : {
                        width : source.interval.width
                    }
                };
                for(let key in source.channels) {
                    if(to == 'ui')
                        result.channels[key] = '#' + ('000000' + (+source.channels[key]).toString(16)).slice(-6);
                    else if(to == 'hw')
                        result.channels[key] = parseInt(source.channels[key].slice(-6), 16);
                }
                return result;
            },

            getContrastYIQ(hexcolor){
                return Utils.getContrastYIQ(hexcolor)
            },

            numberToHexColor(num){
                num >>>= 0;
                let b = num & 0xFF,
                    g = (num & 0xFF00) >>> 8,
                    r = (num & 0xFF0000) >>> 16;
                return "rgba(" + [r, g, b, 255].join(",") + ")";
            },

            reset(){
                this.new_config = null;
            },
            submit(){
                this.$store.commit('Lucerna/data/applyData', {
                    name : 'config',
                    data : [this.copyConfig(this.new_config, 'hw')]
                });
                this.$store.dispatch('Lucerna/data/post', 'config');
            },
            upload(evt){
                let files = evt.target.files;
                let file = files[0];
                let reader = new FileReader();
                reader.onload = (event) => {
                    try {
                        let channels    = JSON.parse(event.target.result);
                        if(!Array.isArray(channels))
                            throw 'Error format file';
                        channels.map((channel) => {
                            if(!('color' in  channel))
                                throw `Required field color`;
                        });

                        this.channels   = channels;
                        this.channelNumber  = channels.length;

                    } catch(e){
                        this.$bus.$emit(consts.EVENTS.ALERT, consts.ALERT_TYPE.ERROR, Vue.filter('lang')('ERROR_LOAD_LIGHT_CONFIG'));
                        console.error(e);
                    }
                }
                reader.readAsText(file);
            },
            download(){
                let content = encodeURIComponent(JSON.stringify(this.channels));
                let element = document.createElement('a');
                element.setAttribute('href', 'data:text/json;charset=utf-8,' + content);
                element.setAttribute('download', "ledkit.json");
                element.style.display = 'none';
                document.body.appendChild(element);
                element.click();
                document.body.removeChild(element);
            }
        },
        data () {
            return {
                new_config : null,
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .col1 {
        padding-right: 4px;
    }

    .col2 {
        padding-left: 4px;
    }

    .color-packer {
        display: inline-block;
        width: 1cm;
        height: 1cm;
        line-height: 1cm;
        text-align: center;
        font-size: 0.5cm;
        margin: 2px;
        border-radius: 4px;
        border: solid 1px silver;
        cursor: pointer;
    }

    .color-packer input {
        display: none;
    }

    .download-file, .upload-file {
        width: 1cm;
        height: 1cm;
        position: relative;
    }

    .upload-file {
        cursor: pointer;
    }

    .upload-file:before {
        border-radius: 50%;
        color: inherit;
        content: "";
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        opacity: .12;
        -webkit-transition: .3s cubic-bezier(.25,.8,.5,1);
        transition: .3s cubic-bezier(.25,.8,.5,1);
        width: 100%;
    }
    .upload-file>*{
        margin-left: 2px;
        margin-top: 1px;
    }


    .upload-file:hover:before {
        background-color: currentColor;
    }

    .upload-file input{
        position: fixed;
        left: 0;
        top: 0;
        width: 1px;
        height: 1px;
        z-index: -1;
    }

</style>
