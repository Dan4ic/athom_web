import Store from './storage';
import App from './App.vue';
import Scheduller from './components/Scheduler.vue';
import DotInspector from './components/DotInspector.vue';
import Preferences from './components/Preferences.vue';
import Langs from './langs';

$includeLang(Langs);
$store.registerModule('lucerna', Store);
$exportComponent('lucerna-app', App);
$exportComponent('lucerna-preferences', Preferences);
$exportComponent('lucerna-dot-inspector', DotInspector);
$exportComponent('lucerna-scheduller', Scheduller);



