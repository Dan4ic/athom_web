<template>
    <svg class="light-schedule"
         :view-box.camel="[0, 0, width, height]"
         @mousedown.prevent="onMouseDown"
         @mousemove.prevent="onMouseMove"
         @mouseup.prevent="onMouseUp"
         @mouseleave.prevent="onMouseUp"
    >

        <g :transform="['translate(' + chart.offset.left, chart.offset.top + ')']">

            <g v-if="currentTimeX > 0">
                <rect class="current-time-box" :width="currentTimeX" :height="chart.height"></rect>
                <line class="current-time-line" :x1="currentTimeX" :x2="currentTimeX" :y2="chart.height"></line>
                <text :x="currentTimeX" y="-12" dy=".32em" style="text-anchor: middle;">
                    {{ currentTime | time}}
                </text>
            </g>

            <g class="grid-days">

                <rect class="axis-border" :width="chart.width" :height="chart.height"></rect>

                <g
                        v-for="percent in axisY"
                        :transform="['translate(0', percent.y + ')']"
                >
                    <line :x2="chart.width" y2="0" class="axis-y" opacity="0.1"></line>
                    <text
                            v-if="chart.showPercents"
                            x="-20"
                            dy=".32em"
                            style="text-anchor: end;"
                    >
                        {{percent.percent | percent}}
                    </text>
                </g>

                <g
                        v-if="showDaysXAxis"
                >

                    <g
                            v-for="(xDay, index) in axisXDays"
                            :class="['axis-days', {'even' : !(xDay.number % 2)}]"
                            :transform="['translate(' + xDay.x, '0)']"
                            :key="xDay.number"

                    >

                        <clipPath :id="'clipDay' + xDay.number">
                            <rect :width="xDay.width" :height="chart.height"/>
                        </clipPath>

                        <g
                                :clip-path="['url(#clipDay'+xDay.number+')']"
                        >

                            <text
                                    :y="chart.height / 2"
                                    :x="xDay.width / 2"

                            >
                                {{xDay.number + 1}}
                            </text>

                        </g>

                        <line
                                v-if="index > 0"
                                :y2="chart.height"
                                :style="{'stroke-width' : dayBorderWidth + 'px'}"
                                opacity="0"
                        ></line>

                        <rect :width="xDay.width" :height="chart.height" opacity="0" @dblclick="expandDay(xDay)"/>

                    </g>

                </g>

                <g
                        v-for="time in axisX"
                        :transform="['translate(' + time.x, '0)']"
                        :key="time.time"
                >
                    <line :y2="chart.height" x2="0" class="axis-x" opacity="0.1"></line>
                    <text
                            v-if="chart.showTimes"
                            :y="chart.height + 20"
                            dy=".32em"
                            style="text-anchor: middle;"
                    >
                        {{time.time | time}}
                    </text>
                </g>

            </g>

            <path class="schedulePath" :d="schedulePath"></path>

            <g class="dots">

                <circle
                        v-for="dot in dots"
                        v-if="isDotVisible(dot)"
                        :class="['dot', {'selected' : dot.selected}]"
                        :r="dotRadius"
                        :cx="rebaseX(getChartX(dot))"
                        :cy="rebaseY(getChartY(dot))"
                        @mousedown="onDotMouseDown(dot)"
                ></circle>
            </g>
        </g>
    </svg>
</template>

<script>

    import consts from 'consts';

    export default {

        created () {
            window.addEventListener('mousewheel', this.proxyScrollEvent);
            window.addEventListener('resize', this.onResize)
        },

        destroyed () {
            window.removeEventListener('mousewheel', this.proxyScrollEvent);
            window.removeEventListener('resize', this.onResize)
        },
        mounted(){
            this.onResize();
            this.zoom.value = this.interval.width / this.interval.resolution;
            if(this.intervalStartOffset === null) {
                this.interval.offset = this.currentTime - this.currentTime % this.interval.resolution;
            }
        },
        props: {
            intervalWidth: {
                type: Number,
                required: false,
                default: 86400
            },
            intervalResolution: {
                type: Number,
                required: false,
                default: 86400
            },
            intervalStartOffset: {
                required: false,
                default: null
            },
        },

        watch : {
            intervalWidth(value){
                this.interval.width = value;
            },

            intervalResolution(value) {
                this.interval.resolution = value;
            },

            intervalStartOffset(value) {
                this.interval.offset = value;
            }

        },

        data() {

            const example_dots  = [
                {
                    selected    : false,
                    time        : 23760,
                    brightness  : 0.01,
                    spectrum      : {
                        0 : 0.1,
                        1 : 0.2,
                        2 : 0.1,
                        3 : 0.6,
                        4 : 1,
                        5 : 0.2,
                        6 : 0.1,
                        7 : 0.2
                    }
                },
                {
                    selected    : false,
                    time        : 38880,
                    brightness  : 0.9,
                    spectrum      : {
                        0 : 0.3,
                        1 : 0.2,
                        2 : 0.2,
                        3 : 0.1,
                        4 : 0.6,
                        5 : 0.7,
                        6 : 0.1,
                        7 : 0.9
                    }
                },
                {
                    selected    : false,
                    time        : 52560,
                    brightness  : 0.9,
                    spectrum      : {
                        0 : 0.3,
                        1 : 0.2,
                        2 : 0.2,
                        3 : 0.1,
                        4 : 0.6,
                        5 : 0.7,
                        6 : 0.1,
                        7 : 0.9
                    }
                },
                {
                    selected    : false,
                    time        : 67620,
                    brightness  : 0.01,
                    spectrum      : {
                        0 : 1,
                        1 : 0.5,
                        2 : 0.4,
                        3 : 0.3,
                        4 : 0.2,
                        5 : 0.1,
                        6 : 0.1,
                        7 : 0.1
                    }
                },
            ];

            let dots    = [];

            for(let day=0; day<10; day++) {

                example_dots.map(function(element){

                    let new_dot = Object.assign({}, element);

                    new_dot.time    += day * 86400;

                    dots.push(new_dot);

                });

            }


            let data    = {
                clientWidth : null,
                clientHeight : null,
                event : {
                    dot : null,
                },
                draggingDot  : {
                    isDragging  : false,
                    offsetX     : 0,
                    offsetY     : 0,
                    clientX     : 0,
                    clientY     : 0
                },
                scrolling   :{
                    isScrolling : false,
                    clientX     : 0,
                },
                width       : 1000,
                height      : 350,
                zoom        : {
                    value       : 1,    //Текущий зум
                    step        : 1.1,  //K преращение зума
                    //Возможные дискретности времени на оси Х
                    time_parts  : [1, 10, 30, 60, 300, 600, 1800, 3600, 7200, 14400, 43200, 86400],
                    max_parts   : 12
                },
                interval    : {
                    width       : this.intervalWidth,
                    resolution  : this.intervalResolution,
                    offset      : this.intervalStartOffset ? +this.intervalStartOffset : 0      //Смещение графика слева
                },
                dots : dots,
                chart: {
                    showPercents: true,
                    showTimes: true,
                    height: 260,
                    width: 940,
                    offset: {
                        top: 20,
                        left: 60
                    }
                }
            };

            data.zoom.value = this.rebaseZoomByParams(data, data.zoom.value);

            return data;

        },

        methods : {

            onResize(){
                this.clientWidth = this.$el.clientWidth;
                this.clientHeight = this.$el.clientHeight;
                this.height = this.clientWidth ? this.$el.clientHeight / this.clientWidth * this.width : 0;
                this.chart.height = this.height - 90;
            },

            onZoom(delta, event){

                let old_exposition  = this.exposition;

                switch(delta){
                    case -1:
                        this.zoom.value = this.rebaseZoom(this.zoom.value / this.zoom.step);
                        break;
                    case 1:
                        this.zoom.value = this.rebaseZoom(this.zoom.value * this.zoom.step);
                        break;
                }

                if(this.zoom.value <= 1)
                    this.zoom.value  = 1;

                this.interval.offset    = this.rebaseOffset(this.interval.offset + (old_exposition - this.exposition) / 2);

            },

            //Первичный обработчик событий для реализации события zoom
            proxyScrollEvent(event){

                let e       = window.event || event;
                let delta   = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

                if(e.path.indexOf(this.$el)>=0) {

                    this.onZoom(delta, e);
                    e.preventDefault();

                }

            },

            onDotMouseDown(dot){

                this.draggingDot.isDragging = true;
                this.draggingDot.offsetX    = 0;
                this.draggingDot.offsetY    = 0;

                this.event.dot      = dot;
                this.event.isShift  = window.event.shiftKey;

            },

            onMouseUp(){

                if(this.draggingDot.isDragging && this.draggingDot.offsetX == 0 && this.draggingDot.offsetY == 0) {

                    if(!this.event.isShift)
                            this.cleanSelectedDots();

                    this.event.dot.selected    = !this.event.dot.selected;

                }

                this.dots.map(function(dot){

                    if(dot.selected) {

                        dot.brightness = (this.chart.height - this.rebaseY(this.getChartY(dot))) / this.chart.height;

                        dot.time     = this.interval.offset + this.rebaseX(this.getChartX(dot)) /  this.dpi;

                    }

                }.bind(this));

                this.draggingDot.isDragging = false;
                this.draggingDot.offsetX    = 0;
                this.draggingDot.offsetY    = 0;

                this.scrolling.isScrolling  = false;

            },

            onMouseDown(event) {

                this.draggingDot.clientX    = event.clientX;
                this.draggingDot.clientY    = event.clientY;

                this.scrolling.clientX      = event.clientX;

                if(!this.draggingDot.isDragging) {

                    this.cleanSelectedDots();

                    this.scrolling.isScrolling  = true;

                }

                return true;

            },

            onMouseMove() {

                if(this.draggingDot.isDragging) {

                    this.draggingDot.offsetX    += (this.draggingDot.clientX - event.clientX) * this.koofScreenX;
                    this.draggingDot.offsetY    += (this.draggingDot.clientY - event.clientY) * this.koofScreenY;

                    if(!this.event.dot.selected) {

                        if(!this.event.isShift)
                            this.cleanSelectedDots();

                        this.event.dot.selected = this.draggingDot.offsetX != 0 || this.draggingDot.offsetY != 0;
                    }
                }

                if(this.scrolling.isScrolling) {

                    this.interval.offset    = this.rebaseOffset(
                            this.interval.offset + (this.scrolling.clientX - event.clientX) / this.dpi);

                }

                this.draggingDot.clientX    = event.clientX;
                this.draggingDot.clientY    = event.clientY;

                this.scrolling.clientX      = event.clientX;

                return true;

            },

            //Фокусировка на выбранном дне по dblclick
            expandDay(xDay){
                this.interval.offset    = xDay.number * this.interval.resolution;
                this.zoom.value         = this.interval.width / this.interval.resolution;
            },

            cleanSelectedDots(){
                this.dots.map(function(dot){
                    dot.selected    = false;
                });
            },

            isDotVisible(dot){
                let realX   = this.getChartX(dot);
                return realX >= 0 && realX <= this.chart.width;
            },

            rebaseOffset(offset){

                if(offset < 0)
                    offset  = 0;
                else if(offset > this.interval.width - this.exposition)
                    offset  = this.interval.width - this.exposition;

                return offset;

            },

            rebaseX(x){

                return x;

            },

            rebaseY(y){

                return y > this.chart.height ? this.chart.height : (y < 0 ? 0 : y);

            },

            rebaseZoomByParams(params, zoom){

                let max_part    = params.zoom.time_parts[params.zoom.time_parts.length -1];
                let min_zoom    = params.interval.width / (max_part * params.zoom.max_parts);

                return  zoom < min_zoom ? min_zoom : zoom;

            },

            rebaseZoom(zoom){

                return  this.rebaseZoomByParams(this, zoom);

            },

            getChartXByTime(timestamp){

                timestamp   = timestamp < 0
                              ? this.interval.width + (timestamp % this.interval.width)
                              : timestamp % this.interval.width;

                return (timestamp - this.interval.offset) * this.dpi;

            },

            getChartX(dot){

                return this.getChartXByTime(dot.time - (dot.selected ? this.draggingDot.offsetX : 0) / this.dpi);

            },

            getChartY(dot){

                return (this.chart.height - this.chart.height * dot.brightness)
                        - (dot.selected ? this.draggingDot.offsetY : 0);

            },

            //вычисляет Y точки перехода для границ графика
            //  border  - X перехода
            //  point1, point2 - точки
            calcTransition(border, point1, point2){

                let leftShoulder    = border - Math.min(point1.x, point2.x);
                let width           = Math.abs(point1.x - point2.x);
                let koof            = leftShoulder / width;
                let height          = point1.y - point2.y;

                return point1.y - height * koof;

            },

        },

        computed: {

            currentTime(){
                return (this.hwDateTime / 1000) % this.interval.width;
            },

            //Вычисляет толщину линии перехода между днями
            dayBorderWidth(){

                let width   = 3 * (this.zoom.value / 10);

                if(width < 3)
                    width   = 3;
                else if(width > 10)
                    width   = 10;

                return width;

            },

            //Количество точек на секунду с учетом зума
            dpi(){
                return this.chart.width / this.interval.width * this.zoom.value;
            },

            //Экспозиция времени отображаемая на графике с учетом зума
            exposition(){

                return 1 * (this.chart.width / this.dpi).toFixed(5);

            },

            axisY(){

                let step    = 20;
                let result  = [];

                for(let percent = 100; percent >= 0; percent -= step){

                    result.push({
                        y       : (100-percent) * (this.chart.height / 100),
                        percent : percent
                    });

                }

                return result;

            },

            axisXDays(){

                let result  = [];

                for(
                        let day = parseInt(this.interval.offset / this.interval.resolution);
                        day <= parseInt((this.interval.offset + this.exposition) / this.interval.resolution);
                        day ++){

                    let xDay = {
                        number  : day,
                        x       : (day * this.interval.resolution - this.interval.offset) * this.dpi,
                        width   :  this.interval.resolution * this.dpi
                    };

                    if(day * this.interval.resolution <= this.interval.offset) {

                        xDay.width  = (day * this.interval.resolution + this.interval.resolution - this.interval.offset) * this.dpi;
                        xDay.x      = 0;

                    } else if(day * this.interval.resolution + this.interval.resolution > this.interval.offset + this.exposition) {

                        xDay.width  = this.interval.offset + this.exposition - day * this.interval.resolution;

                    }

                    if(xDay.x + xDay.width > this.chart.width)
                        xDay.width  = this.chart.width - xDay.x;

                    if(xDay.width < 0)
                        xDay.width  = 0;

                    result.push(xDay);

                }

                return result;

            },

            axisX() {

                let time_part       = null;
                let parts_number    = null;
                let result          = [];

                this.zoom.time_parts.map(function(candidate){

                    let candidate_parts_number  = this.exposition / candidate;

                    if(
                            (parts_number == null || candidate_parts_number > parts_number)
                            && candidate_parts_number <= this.zoom.max_parts
                    ) {

                        time_part       = candidate;
                        parts_number    = candidate_parts_number;

                    }

                }.bind(this));

                if(!time_part)
                    time_part   = this.zoom.time_parts[this.zoom.time_parts.length - 1] || 1;

                for(
                        let moment  = this.interval.offset - (this.interval.offset % time_part);
                        moment < this.interval.offset + this.exposition;
                        moment  += time_part
                ){

                    if(moment <= this.interval.offset)
                        continue;

                    result.push({
                        x       : (moment - this.interval.offset) * this.dpi,
                        time    : moment
                    });

                }

                return result;

            },

            currentTimeX() {

                return this.getChartXByTime(this.currentTime);

            },

            schedulePath() {

                let rebaseMap   = [];

                this.dots.map(function(dot){

                    let x   = this.rebaseX(this.getChartX(dot));
                    let y   = this.rebaseY(this.getChartY(dot));

                    rebaseMap.push({
                        x   : x,
                        y   : y,
                        dot : dot
                    });

                }.bind(this));

                rebaseMap.sort(function(a, b){

                    if(a.x > b.x )
                        return 1;
                    else if(a.x < b.x )
                        return -1;

                    return 0;

                });

                //Вычисляем основное тело пути
                //за одно находим точки перехода между границами
                let body      = '';

                //Точки перехода слева
                let outside_left    = null;
                let inside_left     = null;

                //Точки перехода справа
                let outside_right   = null;
                let inside_right    = null;

                rebaseMap.forEach(function(dot){

                    if(this.getChartX(dot.dot) < 0)
                        outside_left    = dot;
                    else if(this.getChartX(dot.dot) > (this.chart.width)) {
                        outside_right = !outside_right ? dot : outside_right;
                    } else {

                        if(!inside_left)
                            inside_left     = dot;
                        else
                            inside_right    = dot;

                        body += 'L' + dot.x + ',' + dot.y;
                    }

                }.bind(this));

                let prefix  = "";
                let postfix = "";

                //Если точек нет, то все просто - график на нуле
                if(!rebaseMap.length) {

                    prefix  = 'M0,0';
                    postfix = 'L' + this.chart.width + ',0';

                } else {

                    if(!outside_left)
                        outside_left    = {
                            x   : - (this.chart.width * this.zoom.value - rebaseMap[rebaseMap.length-1].x),
                            y   : rebaseMap[rebaseMap.length - 1].y,
                            dot : rebaseMap[rebaseMap.length - 1]
                        };

                    if(!outside_right)
                        outside_right   = {
                            x   : this.chart.width * this.zoom.value + this.interval.offset * this.dpi + rebaseMap[0].x,
                            y   : rebaseMap[0].y,
                            dot : rebaseMap[0]
                        };

                    inside_left     = inside_left || inside_right;
                    inside_right    = inside_right || inside_left;

                    if(!inside_left && !inside_right){

                        prefix  = 'M0,' + this.calcTransition(0, outside_left, outside_right);
                        postfix = 'L' + this.chart.width + ','
                                + this.calcTransition(this.chart.width, outside_left, outside_right);

                    } else {

                        prefix  = 'M0,' + this.calcTransition(0, outside_left, inside_left);
                        postfix = 'L' + this.chart.width + ','
                                + this.calcTransition(this.chart.width, inside_right, outside_right);

                    }

                }

                return prefix + body + postfix;

            },

            showDaysXAxis(){

                return this.interval.width > this.interval.resolution;

            },

            //Коэфициент преобразования реальных точек во внутренние по ширине
            koofScreenX(){
                return (+this.clientWidth) !=0 ? this.width / this.clientWidth : 0;
            },

            //Коэфициент преобразования реальных точек во внутренние по высоте
            koofScreenY(){
                return this.height / this.clientHeight;
            },

            //Радиус точек на графике
            dotRadius(){
                return this.koofScreenX > 0 ? 10 * this.koofScreenX : 1;
            }

        },

        filters: {

            day(timestamp) {

                return (timestamp - timestamp % 86400) / 86400 + 1;

            },

            time(timestamp) {

                let hours   = (timestamp % 86400 - timestamp % 3600) / 3600;
                let mins    = (timestamp % 3600 - timestamp % 60) / 60;
                let secs    = timestamp % 60;


                return ''
                        + ('0' + hours).slice(-2)
                        + ':' + ('0' + mins).slice(-2);
                        //+ (inc_sec ? ':' + ('0' + secs).slice(-2) : '');

            },

            percent(value) {
                return ''+value+'%';
            }


        }

    }
</script>

<style lang="less" rel="stylesheet/less">

    .light-schedule {

        /* width: 100%; */
        /* height: auto; */

        .current-time-box {
            stroke: none;
            fill: #000;
            opacity: 0.05;
        }

        .current-time-line {

            stroke: rgb(0,0,255);
            stroke-width: 1;
            stroke-opacity: 0.3;

        }

        .axis-y, .axis-x, .axis-border {

            shape-rendering: crispEdges;
            stroke: #000;
            stroke-width: 1px;
            fill: none;

            text {
                font-size: 13px;
                line-height: 18px;
            }

        }

        .axis-days {

            text {
                opacity: 0.2;
                text-anchor: middle;
                font-size: 48px;
                stroke: #333;
                cursor: default;
            }

            line {
                opacity: 0.3;
                stroke: #333;
            }

        }

        .axis-days.even {


        }

        .dots {

            .dot {
                fill: #0000F5;
                stroke: #FFF;
                cursor: normal;
            }

            .dot:hover, .dot.selected {
                border: 3px;
                border-color: #FF0000;
                fill: #F50000;
            }

        }

        .schedulePath {
            fill: none;
            stroke: #0000F5;
        }

    }

</style>