import App from './App.vue';
import Scheduller from './components/Scheduler.vue';
import DotInspector from './components/DotInspector.vue';

$requireComponent('lucerna-basis').then(()=>{
    $exportComponent('lucerna-app', App);
    $exportComponent('lucerna-dot-inspector', DotInspector);
    $exportComponent('lucerna-scheduller', Scheduller);
});