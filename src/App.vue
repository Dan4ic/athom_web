<template>
  <div id="app">
    <v-app id="inspire" dark>
      <v-navigation-drawer id="mainmenu" clipped fixed v-model="drawer" app>
        <v-list dense>
          <router-link :to="{name:'Dashboard'}">
            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>dashboard</v-icon>
              </v-list-tile-action>
              <v-list-tile-content>
                <v-list-tile-title>Dashboard</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </router-link>
          <router-link :to="{name:'Settings'}">
            <v-list-tile @click="">
              <v-list-tile-action>
                <v-icon>settings</v-icon>
              </v-list-tile-action>

              <v-list-tile-content>
                <v-list-tile-title>Settings</v-list-tile-title>
              </v-list-tile-content>
            </v-list-tile>
          </router-link>
        </v-list>
      </v-navigation-drawer>
      <v-toolbar app fixed clipped-left>
        <v-toolbar-side-icon @click.stop="drawer = !drawer"></v-toolbar-side-icon>
        <v-toolbar-title>SmartTank</v-toolbar-title>
      </v-toolbar>
      <v-content>
          <router-view/>
      </v-content>
      <v-footer app fixed>
        <span>&copy; 2017</span>
      </v-footer>
    </v-app>

  </div>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    drawer: null
  }),
}
</script>

<style>

@import 'assets/material_icons.css';
@import '../node_modules/vuetify/dist/vuetify.min.css';

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

  #mainmenu a {
    text-decoration: none;
  }

</style>
