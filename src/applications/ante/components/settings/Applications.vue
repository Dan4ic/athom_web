<template>
    <v-form ref="form" lazy-validation>
        <v-card style="width: 100%">
            <v-card-title primary-title>
                <v-layout row wrap>
                    <h1>{{'APPS_TITLE' | lang}}</h1>
                    <v-flex xs12>
                        <v-data-table
                                :headers="headers"
                                :items="items"
                                hide-actions
                                class="elevation-1"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.name }}</td>
                                <td class="text-xs-right">{{ props.item.calories }}</td>
                                <td class="text-xs-right">{{ props.item.fat }}</td>
                                <td class="text-xs-right">{{ props.item.carbs }}</td>
                                <td class="text-xs-right">{{ props.item.protein }}</td>
                                <td class="text-xs-right">{{ props.item.iron }}</td>
                            </template>
                        </v-data-table>
                    </v-flex>
                </v-layout>
            </v-card-title>
        </v-card>
    </v-form>
</template>

<script>

    import consts from 'consts';
    import template from './Template.vue'

    export default {
        name: 'Applications',
        extends : template,
        computed: {

        },
        methods: {

        },
        data () {
            return {
                headers: [
                    {
                        text: 'Dessert (100g serving)',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    { text: 'Calories', value: 'calories' },
                    { text: 'Fat (g)', value: 'fat' },
                    { text: 'Carbs (g)', value: 'carbs' },
                    { text: 'Protein (g)', value: 'protein' },
                    { text: 'Iron (%)', value: 'iron' }
                ],
                items: [
                    {
                        value: false,
                        name: 'Frozen Yogurt',
                        calories: 159,
                        fat: 6.0,
                        carbs: 24,
                        protein: 4.0,
                        iron: '1%'
                    },
                    {
                        value: false,
                        name: 'Ice cream sandwich',
                        calories: 237,
                        fat: 9.0,
                        carbs: 37,
                        protein: 4.3,
                        iron: '1%'
                    },
                    {
                        value: false,
                        name: 'Eclair',
                        calories: 262,
                        fat: 16.0,
                        carbs: 23,
                        protein: 6.0,
                        iron: '7%'
                    },

                ]
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
