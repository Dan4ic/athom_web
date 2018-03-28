<template>
    <modal>
        <h1 slot="title">{{'INSTALL_APP_TITLE' | lang}}</h1>
        <template slot="body">
            <v-container grid-list-md>
                <v-layout row wrap>
                    <v-flex xs12>
                        <label class="label-file">
                            <v-icon class="app-ico" v-if="!manifest || !manifest.favicon" color="grey" large>extension</v-icon>
                            <img v-else class="app-ico" :src="manifest.favicon">
                            <div class="app-caption">
                                <span v-if="!manifest" v-html="htmlFileCaption"></span>
                                <h2 v-else>{{manifest.name}}</h2>
                            </div>
                            <input
                                    type="file"
                                    accept=".smt"
                                    style="position: fixed; top: 0; left: 0; width: 1px; height: 1px; z-index: 0;"
                                    @change="readFile"
                            />
                        </label>
                    </v-flex>
                    <v-flex xs12>
                        <table class="app-params-table">
                            <tr>
                                <td width="1%">{{'VENDOR' | lang}}:</td>
                                <td>{{manifest ? manifest.vendor : ''}}</td>
                            </tr>
                            <tr>
                                <td valign="top" width="1%">{{'DESCRIPTION' | lang}}:</td>
                                <td>{{description}}</td>
                            </tr>
                            <tr>
                                <td width="1%">{{'SIZE' | lang}}:</td>
                                <td>{{manifest ? Math.round(size / 1024 + 1) : ''}}kB</td>
                            </tr>
                        </table>
                    </v-flex>
                </v-layout>
            </v-container>
        </template>
        <template slot="actions">
            <v-btn @click="$emit('onclose')">{{'CANCEL' | lang }}</v-btn>
            <v-btn @click="doUninstall" flat>{{'INSTALL' | lang }}</v-btn>
        </template>
    </modal>
</template>

<script>

    import modal from './../Modal.vue'

    const consts = window.$consts;

    export default {
        name: 'InstallApplication',
        components : {
            modal,
        },
        methods: {
            doUninstall(){

            },

            readString(dataview, offset, length){

                let result  = [];

                for(let pos = offset, len = 0; len < length; len++, pos++ ){
                    result.push(dataview.getInt8(pos));
                }

                return (new TextDecoder()).decode(new Uint8Array(result));

            },

            readFile(evt){
                let files = evt.target.files;
                let file = files[0];
                let reader = new FileReader();
                this.manifest   = null;
                this.size       = null;
                this.buffer     = null;
                reader.onload = (event) => {
                    this.buffer = event.target.result;
                    this.size   = this.buffer.byteLength;

                    let dataview = new DataView(this.buffer);

                    if(this.readString(dataview, 0, 6) !== 'SMTB01'){
                        this.$bus.$emit(
                            consts.EVENTS.ALERT,
                            consts.ALERT_TYPE.ERROR,
                            Vue.filter('lang')('ERROR_APP_BUNDLE_FORMAT')
                        );
                        return;
                    }

                    let manifest_len = dataview.getUint32(6, true);
                    debugger;

                    console.log(manifest_len, this.readString(dataview, 10, manifest_len));
                    this.manifest = JSON.parse(this.readString(dataview, 10, manifest_len));
                }
                reader.readAsArrayBuffer(file);
            }
        },
        computed: {
            htmlFileCaption(){
                return Vue.filter('lang')('DO_SELECT_APP');
            },
            description(){
                if(!this.manifest || !('description' in this.manifest))
                    return '';
                let lang = this.$store.state.display.lang;

                if(lang in this.manifest.description)
                    return this.manifest.description[lang];
                else
                    return this.manifest.description['en'];
            }
        },
        data() {
            return {
                manifest : null,
                size : null,
                buffer : null
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

    .app-ico {
        width: 64px;
        height: 64px;
        display: flex;
        font-size: 64px !important;
    }

    .app-caption {
        display: flex;
        width: 100%;
        text-align: center;
        align-items: center;
        padding: 4px;
    }

    .app-caption span {
        margin: auto;
    }

    .label-file {
        display: flex;
        width: 100%;
        background: rgba(0, 0, 0, 0.15);
        border: solid 1px #ccc;
        border-radius: 4px;
        padding: 2px;
    }

    .app-params-table {
        margin-bottom: 24px;
    }

</style>
