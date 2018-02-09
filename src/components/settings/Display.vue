<template>
    <v-form ref="form" lazy-validation>
        <v-card>
            <v-card-title primary-title>
                <v-layout row wrap>
                    <h1>{{'DISPLAY_TITLE' | lang}}</h1>
                    <v-flex xs12>
                        <v-select
                                :label="'THEME' | lang"
                                v-model="theme"
                                :items="themes"
                                required
                        ></v-select>
                    </v-flex>
                    <v-flex xs12>
                        <v-select
                                :label="'LANGUAGE' | lang"
                                v-model="lang"
                                :items="languages"
                                required
                        ></v-select>
                    </v-flex>
                </v-layout>
            </v-card-title>
            <v-card-actions text-xs-right>
                <v-btn @click="submit">{{'SUBMIT' | lang }}</v-btn>
                <v-btn @click="submit">{{'RESET' | lang }}</v-btn>
                <v-btn @click="submit">{{'DEFAULT' | lang }}</v-btn>
            </v-card-actions>
        </v-card>
    </v-form>
</template>

<script>

    import consts from './../../core/consts';

    export default {
        name: 'SettingsNetwork',
        computed: {
            themes(){
                return consts.LANGS[this.$store.state.display.lang].THEMES;
            },

            theme: {
                get(){
                    return this.$store.state.display.theme;
                },
                set(value){
                    this.$store.commit('setTheme', value);
                }
            },
            lang: {
                get(){
                    return this.$store.state.display.lang;
                },
                set(value){
                    this.$store.commit('setLang', value);
                }
            }
        },
        methods: {
            submit(){
            }
        },
        data () {
            return {
                languages : [
                    {text: 'English', value: 'en'},
                    {text: 'Русский', value: 'ru'}
                ]
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
