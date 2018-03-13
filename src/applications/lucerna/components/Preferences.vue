<template>
    <v-form ref="form" lazy-validation>
        <v-card>
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
                        <template v-for="i in channelNumber" >
                            <label
                                    class="color-packer"
                                    :style="{
                                        'background-color' : channels[i - 1].color,
                                        'color' : getContrastYIQ(channels[i - 1].color)
                                    }"
                            >{{i}}
                                <input type="color" :placeholder="i + 1" v-model="channels[i - 1].color"/>
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

    $requireComponent('lucerna-basis');

    let consts = window.$consts;

    export default {
        name: 'SettingsLucerna',
        computed : {
            daysNumber: {
                get(){
                    return this.interval.width !== null ? this.interval.width / 86400
                        : this.$store.state.lucerna.interval.width / 86400;
                },
                set(value){
                    this.interval.width = value * 86400;
                }
            },
            channelsNumber: {
                get(){
                    return this.channelNumber;
                },
                set(value){

                    if(+value < 1)
                        value   = 0;
                    else if(+value > 16)
                        value   = 16;

                    if(value > this.channels.length){
                        for(let f=this.channels.length; f<value; f++)
                            this.channels.push({
                                color : '#ff00ff'
                            });
                    }

                    this.channelNumber = +value;
                }
            }
        },
        methods : {
            getContrastYIQ(hexcolor){
                var r = parseInt(hexcolor.substr(1,2),16);
                var g = parseInt(hexcolor.substr(3,2),16);
                var b = parseInt(hexcolor.substr(5,2),16);
                var yiq = ((r*299)+(g*587)+(b*114))/1000;
                return ((yiq >= 128) ? 'black' : 'white');
            },
            reset(){
                this.channels   = [];
                this.$store.state.lucerna.channels.map((channel) => {
                    this.channels.push(Object.assign({}, channel));
                });
                this.channelNumber  = this.channels.length;
            },
            submit(){
                this.$store.commit('lucerna/setIntervalWidth', this.daysNumber * 86400);
                this.$store.commit('lucerna/setChannelsParams', this.channels);
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
        mounted(){
          this.reset();
        },
        data () {
            return {
                channelNumber   : null,
                channels : null,
                interval    : {
                    width       : null,
                    resolution  : null,
                    offset      : null
                },
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
