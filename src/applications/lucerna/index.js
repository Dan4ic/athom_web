import App from './App.vue';
import Scheduller from './components/Scheduler.vue';
import DotInspector from './components/DotInspector.vue';

let Preferences = require('./components/Preferences.vue');

$exportComponent('lucerna-app', App);
$exportComponent('lucerna-preferences', Preferences);
$exportComponent('lucerna-dot-inspector', DotInspector);
$exportComponent('lucerna-scheduller', Scheduller);



