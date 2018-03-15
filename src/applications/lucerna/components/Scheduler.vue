<template>
    <div>
        <svg v-if="!isShowDotInspector"
             class="light-schedule"
             :view-box.camel="[0, 0, width, height]"
             @mousedown.prevent="onMouseDown"
             @mousemove.prevent="onMouseMove"
             @mouseup.prevent="onMouseUp"
             @mouseleave.prevent="onMouseUp"
             @touchstart.prevent="onTouch"
             @touchmove.prevent="onTouch"
             @touchend.prevent="onTouch"
             @touchcancel.prevent="onTouch"
        >
            <g :transform="['translate(' + chart.offset.left, chart.offset.top + ')']">

                <g v-if="currentTimeX > 0">
                    <rect class="current-time-box" :width="currentTimeX" :height="chart.height"></rect>
                    <line class="current-time-line" :x1="currentTimeX" :x2="currentTimeX" :y2="chart.height"></line>
                    <text
                            :x="currentTimeX"
                            :y="dotRadius * 1"
                            :dy="!isMobileScreen? 8 * koofScreenY : -fontHeight / 2 + 4"
                            :dx="chart.width / 2 < currentTimeX ? -2 : 2"
                            :style="{'text-anchor' : chart.width / 2 < currentTimeX ? 'end' : 'start'}"
                            :font-size="fontHeight"
                            opacity="0.3"
                    >
                        {{ currentTime | time}}
                    </text>
                </g>

                <g :transform="['translate(0, 50)']">
                    <spectrum
                            :width="chart.width"
                            :height="chart.height - 50"
                            opacity="0.35"
                    ></spectrum>
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
                                :x="isMobileScreen? 0 : -10"
                                :dy="isMobileScreen? fontSizeAxisY : fontSizeAxisY / 2"
                                :style="{'text-anchor' : isMobileScreen ? 'middle' : 'end'}"
                                :font-size="fontSizeAxisY"
                                :transform="[isMobileScreen ? 'rotate(90)' : '']"
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
                                        :font-size="fontHeight * 5"
                                        :dy="fontHeight"

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
                                :y="chart.height + fontSizeAxisX"
                                style="text-anchor: middle;"
                                :font-size="fontSizeAxisX"
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
                            :class="['dot', {'selected' : dot.selected || isInSelBox(dot)}]"
                            :r="dotRadius"
                            :cx="rebaseX(getChartX(dot))"
                            :cy="rebaseY(getChartY(dot))"
                            @mousedown="onDotMouseDown(dot)"
                            @dblclick="isShowDotInspector=true"
                    ></circle>
                </g>

                <rect
                        class="selection-box"
                        v-if="selectionBox.isSelectionBox"
                        :x="selBox.x"
                        :y="selBox.y"
                        :width="selBox.width"
                        :height="selBox.height"
                />

            </g>
            <circle
                    v-if="draggingNewDot.isDragging"
                    class="dot"
                    :r="dotRadius"
                    :cx="draggingNewDot.x"
                    :cy="draggingNewDot.y"
            />
            <g class="toolbar" :transform="['translate(' + toolbar.left +','+ toolbar.top + ')']">
                <circle
                        class="dot"
                        :r="dotRadius"
                        :cx="dotRadius + dotRadius / 2"
                        :cy="dotRadius + dotRadius / 2"
                        @mousedown.prevent="onMouseDownNewDot"
                        @mouseup.prevent="onMouseUpNewDot"
                ></circle>
                <text
                        :y="dotRadius * 2"
                        :x="dotRadius * 3 + dotRadius / 2"
                        :dy="dotRadius"
                        class="button ico"
                        :font-size="dotRadius * 3"
                        @mousedown.prevent="onDelete"
                >
                    clear
                </text>
                <text
                        :y="dotRadius * 2"
                        :x="dotRadius * 7 + dotRadius / 2"
                        :dy="dotRadius / 2"
                        class="button ico"
                        :font-size="dotRadius * 2"
                        @mousedown.stop="onCopy"
                >
                    content_copy
                </text>

            </g>
        </svg>
        <v-form ref="form" v-if="isShowDotInspector" class="dot-inspector">
            <v-card style="height: 100%">
                <v-card-title primary-title >
                    <v-container style="padding: 0">
                        <v-layout row>
                            <h1>{{'DOT_INSPECTOR' | lang}}</h1>
                        </v-layout>
                        <v-layout row>
                            <lucerna-dot-inspector v-model="dotsForInspection"></lucerna-dot-inspector>
                        </v-layout>
                    </v-container>
                </v-card-title>
                <v-card-actions text-xs-right style="position: absolute; bottom: 0; z-index: 10001">
                    <v-btn @click="isShowDotInspector=false">{{'SUBMIT' | lang }}</v-btn>
                </v-card-actions>
            </v-card>
        </v-form>
    </div>
</template>

<script>

  import consts from 'consts';
  import Spectrum from './Spectrum.vue';

  export default {

        components : {
            spectrum : Spectrum
        },

        created () {
            window.addEventListener('mousewheel', this.proxyScrollEvent);
            window.addEventListener('resize', this.onResize);

            this.$bus.$on(consts.EVENTS.DO_SCREEN_REBUILD, (type, messages) => {
                this.onResize();
            });
        },

        destroyed () {
            window.removeEventListener('mousewheel', this.proxyScrollEvent);
            window.removeEventListener('resize', this.onResize)
            clearInterval(this.scrolling.inertTimer);
        },
        mounted(){
            this.onResize();
            this.zoom.value = this.interval.width / this.interval.resolution;
            if (this.intervalStartOffset === null) {
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

        watch: {
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
            const example_dots = [
                    /*
                {
                    selected: false,
                    time: 23760,
                    brightness: 0.01,
                    spectrum: {
                        0: 0.1,
                        1: 0.2,
                        2: 0.1,
                        3: 0.6,
                        4: 1,
                        5: 0.2,
                        6: 0.1,
                        7: 0.2
                    }
                },
                {
                    selected: false,
                    time: 38880,
                    brightness: 0.9,
                    spectrum: {
                        0: 0.3,
                        1: 0.2,
                        2: 0.2,
                        3: 0.1,
                        4: 0.6,
                        5: 0.7,
                        6: 0.1,
                        7: 0.9
                    }
                },
                {
                    selected: false,
                    time: 52560,
                    brightness: 0.9,
                    spectrum: {
                        0: 0.3,
                        1: 0.2,
                        2: 0.2,
                        3: 0.1,
                        4: 0.6,
                        5: 0.7,
                        6: 0.1,
                        7: 0.9
                    }
                },
                {
                    selected: false,
                    time: 67620,
                    brightness: 0.01,
                    spectrum: {
                        0: 1,
                        1: 0.5,
                        2: 0.4,
                        3: 0.3,
                        4: 0.2,
                        5: 0.1,
                        6: 0.1,
                        7: 0.1
                    }
                },
                */
            ];

            let dots = [];

            for (let day = 0; day < 10; day++) {
                example_dots.map(function (element) {
                    let new_dot = Object.assign({}, element);
                    new_dot.time += day * 86400;
                    dots.push(new_dot);
                });
            }

            let data = {
                clientWidth: null,
                clientHeight: null,
                event: {
                    dot: null,
                },
                draggingDot: {
                    isDragging: false,
                    offsetX: 0,
                    offsetY: 0,
                    clientX: 0,
                    clientY: 0
                },
                scrolling: {
                    isScrolling: false,
                    power : 0,
                    inertTimer : setInterval(()=>{
                        if(Math.abs(this.scrolling.power) > 1) {
                            this.interval.offset = this.rebaseOffset(
                                this.interval.offset + this.scrolling.power  / this.dpi
                            );
                            this.scrolling.power    /= 1.04;
                        }
                    }, 20),
                    clientX: 0,
                },
                selectionBox : {
                    isSelectionBox  : false,
                    timeStart : null,
                    timeEnd : null,
                    top : null,
                    bottom : null
                },
                draggingNewDot : {
                    isDragging : false,
                    x   : 0,
                    y   : 0
                },
                width: 1000,
                height: 350,
                zoom: {
                    value: 1,    //Текущий зум
                    step: 1.1,  //K преращение зума
                    //Возможные дискретности времени на оси Х
                    time_parts: [1, 10, 30, 60, 300, 600, 1800, 3600, 7200, 14400, 43200, 86400],
                    max_parts: 12
                },
                interval: {
                    width: this.intervalWidth,
                    resolution: this.intervalResolution,
                    offset: this.intervalStartOffset ? +this.intervalStartOffset : 0      //Смещение графика слева
                },
                dots: dots,
                isShowDotInspector : false,
                toolbar : {
                    top : 0,
                    left : 60,
                },
                chart: {
                    showPercents: true,
                    showTimes: true,
                    height: 260,
                    width: 940,
                    offset: {
                        top: 36,
                        left: 60
                    }
                }
            };

            data.zoom.value = this.rebaseZoomByParams(data, data.zoom.value);

            return data;

        },

        methods: {

            createDot(time, brightness, selected) {
                let channels = this.$store.state.lucerna.channels.map((channel, i) => {
                    return {
                        name: 'Channel ' + (i + 1),
                        value: brightness,
                        color: channel.color,
                        correlation: channel.correlation || i,
                        lock: false
                    };
                });

                return {
                    selected: !!selected,
                    time: time,
                    brightness: brightness,
                    channels: channels
                };
            },

            createDroppedDot(isSelected){
                return this.createDot(
                        this.interval.offset + this.rebaseX(this.draggingNewDot.x - this.chart.offset.left) / this.dpi,
                        (this.chart.height - this.rebaseY(this.draggingNewDot.y - this.chart.offset.top)) / this.chart.height,
                        isSelected
                );
            },

            onTouch(evt) {
                evt.preventDefault();
                if (evt.touches.length > 1 || (evt.type == "touchend" && evt.touches.length > 0))
                    return;

                let newEvt = document.createEvent("MouseEvents");
                let type = null;
                let touch = null;

                switch (evt.type) {
                    case "touchstart":
                        type = "mousedown";
                        touch = evt.changedTouches[0];
                        break;
                    case "touchmove":
                        type = "mousemove";
                        touch = evt.changedTouches[0];
                        break;
                    case "touchend":
                        type = "mouseup";
                        touch = evt.changedTouches[0];
                        break;
                }

                newEvt.initMouseEvent(type, true, true, document.defaultView, 0,
                        touch.screenX, touch.screenY, touch.clientX, touch.clientY,
                        evt.ctrlKey, evt.altKey, evt.shiftKey, evt.metaKey, 0, null);

                evt.target.dispatchEvent(newEvt);
            },

            onMouseDownNewDot(event){
                this.draggingNewDot.isDragging = true;
                this.draggingNewDot.x   = event.offsetX * this.koofScreenX;
                this.draggingNewDot.y   = event.offsetY * this.koofScreenY;
            },

            onMouseUpNewDot(event){
                this.draggingDot.isDragging = false;
            },

            isInSelBox(dot) {
                return this.selectionBox.isSelectionBox
                    && this.rebaseX(this.getChartX(dot)) >= this.selBox.x && this.rebaseX(this.getChartX(dot)) <= this.selBox.x + this.selBox.width
                    && this.rebaseY(this.getChartY(dot)) >= this.selBox.y && this.rebaseY(this.getChartY(dot)) <= this.selBox.y + this.selBox.height;
            },

            onResize(){
                this.clientWidth = this.$el.clientWidth;
                this.clientHeight = this.$el.clientHeight;
                this.height = this.clientWidth ? this.$el.clientHeight / this.clientWidth * this.width : 0;
                this.chart.offset.top = this.dotRadius * 3;
                this.chart.height = this.height - this.chart.offset.top - this.fontSizeAxisX * 1.5;
            },

            onZoom(delta, event){
                let old_exposition = this.exposition;

                switch (delta) {
                    case -1:
                        this.zoom.value = this.rebaseZoom(this.zoom.value / this.zoom.step);
                        break;
                    case 1:
                        this.zoom.value = this.rebaseZoom(this.zoom.value * this.zoom.step);
                        break;
                }

                if (this.zoom.value <= 1)
                    this.zoom.value = 1;

                this.interval.offset = this.rebaseOffset(
                        this.interval.offset
                        + (old_exposition - this.exposition)
                        * ((event.offsetX * this.koofScreenX - this.chart.offset.left) / this.chart.width)
                );
            },

            //Первичный обработчик событий для реализации события zoom
            proxyScrollEvent(event){
                let e = window.event || event;
                let delta = Math.max(-1, Math.min(1, (e.wheelDelta || -e.detail)));

                if (e.path.indexOf(this.$el) >= 0) {

                    this.onZoom(delta, e);
                    e.preventDefault();

                }
            },

            onDotMouseDown(dot){
                this.draggingDot.isDragging = true;
                this.draggingDot.offsetX = 0;
                this.draggingDot.offsetY = 0;

                this.event.dot = dot;
                this.event.isShift = window.event.shiftKey;
            },

            onMouseUp(){

                if(this.draggingNewDot.isDragging){
                    if(
                        (this.draggingNewDot.y >= this.chart.offset.top)
                        && (this.draggingNewDot.y <= this.chart.offset.top + this.chart.height)
                        && (this.draggingNewDot.x >= this.chart.offset.left)
                        && (this.draggingNewDot.x <= this.chart.offset.left + this.chart.width)
                    )
                        this.dots.push(this.createDroppedDot(true));
                    this.draggingNewDot.isDragging = false;
                }

                if (this.draggingDot.isDragging && this.draggingDot.offsetX == 0 && this.draggingDot.offsetY == 0) {
                    if (!this.event.isShift)
                        this.cleanSelectedDots();

                    this.event.dot.selected = !this.event.dot.selected;
                }

                this.dots.map((dot) => {
                    if(this.selectionBox.isSelectionBox && this.isInSelBox(dot))
                        dot.selected = true;

                    if (dot.selected) {
                        dot.brightness = (this.chart.height - this.rebaseY(this.getChartY(dot))) / this.chart.height;
                        dot.time = this.interval.offset + this.rebaseX(this.getChartX(dot)) / this.dpi;
                    }
                });

                this.draggingDot.isDragging = false;
                this.draggingDot.offsetX = 0;
                this.draggingDot.offsetY = 0;

                this.scrolling.isScrolling = false;
                this.selectionBox.isSelectionBox    = false;
            },

            onMouseDown(event) {
                this.draggingDot.clientX = event.clientX;
                this.draggingDot.clientY = event.clientY;

                this.scrolling.clientX = event.clientX;

                this.scrolling.power = 0;

                if (!this.draggingDot.isDragging) {
                    if(!!window.event.shiftKey) {
                        this.selectionBox.isSelectionBox    = true;
                        this.selectionBox.timeStart         = this.interval.offset
                                + this.rebaseX(event.offsetX * this.koofScreenX - this.chart.offset.left) / this.dpi;
                        this.selectionBox.timeEnd           = this.selectionBox.timeStart;

                        this.selectionBox.top               = event.offsetY * this.koofScreenY - this.chart.offset.top;
                        if(this.selectionBox.top < 0)
                            this.selectionBox.top           = 0;

                        this.selectionBox.bottom            = this.selectionBox.top;
                    } else {
                        this.cleanSelectedDots();
                        this.scrolling.isScrolling = true;
                    }
                }

                return true;
            },

            onMouseMove() {

                if(this.draggingNewDot.isDragging) {
                    this.draggingNewDot.x   = event.offsetX  * this.koofScreenX;
                    this.draggingNewDot.y   = event.offsetY  * this.koofScreenY;
                    return;
                }

                if (this.draggingDot.isDragging) {
                    this.draggingDot.offsetX += (this.draggingDot.clientX - event.clientX) * this.koofScreenX;
                    this.draggingDot.offsetY += (this.draggingDot.clientY - event.clientY) * this.koofScreenY;

                    if (!this.event.dot.selected) {

                        if (!this.event.isShift)
                            this.cleanSelectedDots();

                        this.event.dot.selected = this.draggingDot.offsetX != 0 || this.draggingDot.offsetY != 0;
                    }
                }

                if (this.scrolling.isScrolling) {
                    this.scrolling.power = (this.scrolling.clientX - event.clientX)* this.koofScreenX;
                    this.interval.offset = this.rebaseOffset(
                            this.interval.offset + this.scrolling.power  / this.dpi
                    );
                }

                if (this.selectionBox.isSelectionBox) {
                    this.selectionBox.timeEnd           = this.interval.offset
                            + this.rebaseX(event.offsetX  * this.koofScreenX - this.chart.offset.left) / this.dpi;
                    if(this.selectionBox.timeEnd < this.interval.offset)
                        this.selectionBox.timeEnd = this.interval.offset;

                    this.selectionBox.bottom            = event.offsetY * this.koofScreenY - this.chart.offset.top;
                    if(this.selectionBox.bottom > this.chart.height)
                        this.selectionBox.bottom    = this.chart.height;
                    else if(this.selectionBox.bottom < 0)
                        this.selectionBox.bottom    = 0;
                }

                this.draggingDot.clientX = event.clientX;
                this.draggingDot.clientY = event.clientY;

                this.scrolling.clientX = event.clientX;

                return true;
            },

            onDelete(){

                let result  = [];

                this.dots.map((dot) => {
                    if(!dot.selected)
                        result.push(dot);
                });

                this.dots = result;

            },

            onCopy(){
                this.dots.map((dot) => {
                    if(dot.selected) {
                        dot.selected    = false;
                        let new_dot = Object.assign({}, dot);
                        new_dot.time += this.dotRadius * 2 / this.dpi;
                        new_dot.selected = true;
                        this.dots.push(new_dot);
                    }
                });
            },

            //Фокусировка на выбранном дне по dblclick
            expandDay(xDay){
                this.interval.offset = xDay.number * this.interval.resolution;
                this.zoom.value = this.interval.width / this.interval.resolution;
            },

            cleanSelectedDots(){
                this.dots.map(function (dot) {
                    dot.selected = false;
                });
            },

            isDotVisible(dot){
                let realX = this.getChartX(dot);
                return realX >= 0 && realX <= this.chart.width;
            },

            rebaseOffset(offset){
                if (offset < 0)
                    offset = 0;
                else if (offset > this.interval.width - this.exposition)
                    offset = this.interval.width - this.exposition;

                return offset;
            },

            rebaseX(x){
                return x;
            },

            rebaseY(y){
                return y > this.chart.height ? this.chart.height : (y < 0 ? 0 : y);
            },

            rebaseZoomByParams(params, zoom){
                let max_part = params.zoom.time_parts[params.zoom.time_parts.length - 1];
                let min_zoom = params.interval.width / (max_part * params.zoom.max_parts);

                return zoom < min_zoom ? min_zoom : zoom;
            },

            rebaseZoom(zoom){
                return this.rebaseZoomByParams(this, zoom);
            },

            getChartXByTime(timestamp){
                timestamp = timestamp < 0
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
                let leftShoulder = border - Math.min(point1.x, point2.x);
                let width = Math.abs(point1.x - point2.x);
                let koof = leftShoulder / width;
                let height = point1.y - point2.y;

                return point1.y - height * koof;
            },
        },

        computed: {

            dotsForInspection : {
                get(){
                    let dots = [];

                    this.dots.map((dot) => {
                        if(dot.selected)
                            dots.push(Object.assign({}, dot));
                    });

                    return dots;
                },
                set(value){
                    //todo реализовать
                    return;
                }
            },

            //Calc selection box
            selBox(){

                let result = {
                    x   : (
                        (this.selectionBox.timeStart < this.selectionBox.timeEnd ? this.selectionBox.timeStart : this.selectionBox.timeEnd)
                        - this.interval.offset
                        ) * this.dpi,
                    y   : this.selectionBox.top < this.selectionBox.bottom ? this.selectionBox.top : this.selectionBox.bottom,
                    width : Math.abs(this.selectionBox.timeStart - this.selectionBox.timeEnd) * this.dpi,
                    height : Math.abs(this.selectionBox.top - this.selectionBox.bottom)
                };

                if(result.y + result.height > this.chart.height)
                    result.height   = this.chart.height - result.y;

                return result;
            },

            currentTime(){
                return (this.hwDateTime / 1000) % this.interval.width;
            },

            //Вычисляет толщину линии перехода между днями
            dayBorderWidth(){
                let width = 3 * (this.zoom.value / 10);

                if (width < 3)
                    width = 3;
                else if (width > 10)
                    width = 10;

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
                let step = 20;
                let result = [];

                for (let percent = 100; percent >= 0; percent -= step) {

                    result.push({
                        y: (100 - percent) * (this.chart.height / 100),
                        percent: percent
                    });

                }

                return result;
            },

            axisXDays(){
                let result = [];

                for (
                        let day = parseInt(this.interval.offset / this.interval.resolution);
                        day <= parseInt((this.interval.offset + this.exposition) / this.interval.resolution);
                        day++) {

                    let xDay = {
                        number: day,
                        x: (day * this.interval.resolution - this.interval.offset) * this.dpi,
                        width: this.interval.resolution * this.dpi
                    };

                    if (day * this.interval.resolution <= this.interval.offset) {

                        xDay.width = (day * this.interval.resolution + this.interval.resolution - this.interval.offset) * this.dpi;
                        xDay.x = 0;

                    } else if (day * this.interval.resolution + this.interval.resolution > this.interval.offset + this.exposition) {

                        xDay.width = this.interval.offset + this.exposition - day * this.interval.resolution;

                    }

                    if (xDay.x + xDay.width > this.chart.width)
                        xDay.width = this.chart.width - xDay.x;

                    if (xDay.width < 0)
                        xDay.width = 0;

                    result.push(xDay);
                }

                return result;
            },

            axisX() {
                let time_part = null;
                let parts_number = null;
                let result = [];

                this.zoom.time_parts.map(function (candidate) {
                    let candidate_parts_number = this.exposition / candidate;

                    if (
                            (parts_number == null || candidate_parts_number > parts_number)
                            && candidate_parts_number <= this.zoom.max_parts
                    ) {

                        time_part = candidate;
                        parts_number = candidate_parts_number;

                    }
                }.bind(this));

                if (!time_part)
                    time_part = this.zoom.time_parts[this.zoom.time_parts.length - 1] || 1;

                for (
                        let moment = this.interval.offset - (this.interval.offset % time_part);
                        moment < this.interval.offset + this.exposition;
                        moment += time_part
                ) {

                    if (moment <= this.interval.offset)
                        continue;

                    result.push({
                        x: (moment - this.interval.offset) * this.dpi,
                        time: moment
                    });

                }

                return result;
            },

            currentTimeX() {
                return this.getChartXByTime(this.currentTime);
            },

            schedulePath() {
                let rebaseMap = [];
                let dots = Object.assign([], this.dots);

                if(this.draggingNewDot.isDragging
                    &&(this.draggingNewDot.y >= this.chart.offset.top)
                    && (this.draggingNewDot.y <= this.chart.offset.top + this.chart.height)
                    && (this.draggingNewDot.x >= this.chart.offset.left)
                    && (this.draggingNewDot.x <= this.chart.offset.left + this.chart.width)

                )
                    dots.push(this.createDroppedDot());

                dots.map((dot) => {

                    let x = this.rebaseX(this.getChartX(dot));
                    let y = this.rebaseY(this.getChartY(dot));

                    rebaseMap.push({
                        x: x,
                        y: y,
                        dot: dot
                    });

                });

                rebaseMap.sort(function (a, b) {

                    if (a.x > b.x)
                        return 1;
                    else if (a.x < b.x)
                        return -1;

                    return 0;

                });

                //Вычисляем основное тело пути
                //за одно находим точки перехода между границами
                let body = '';

                //Точки перехода слева
                let outside_left = null;
                let inside_left = null;

                //Точки перехода справа
                let outside_right = null;
                let inside_right = null;

                rebaseMap.map((dot) => {

                    if (this.getChartX(dot.dot) < 0)
                        outside_left = dot;
                    else if (this.getChartX(dot.dot) > (this.chart.width)) {
                        outside_right = !outside_right ? dot : outside_right;
                    } else {

                        if (!inside_left)
                            inside_left = dot;
                        else
                            inside_right = dot;

                        body += 'L' + dot.x + ',' + dot.y;
                    }

                });

                let prefix = "";
                let postfix = "";

                //Если точек нет, то все просто - график на нуле
                if (!rebaseMap.length) {

                    prefix = 'M0,0';
                    postfix = 'L' + this.chart.width + ',0';

                } else {

                    if (!outside_left)
                        outside_left = {
                            x: -(this.chart.width * this.zoom.value - rebaseMap[rebaseMap.length - 1].x),
                            y: rebaseMap[rebaseMap.length - 1].y,
                            dot: rebaseMap[rebaseMap.length - 1]
                        };

                    if (!outside_right)
                        outside_right = {
                            x: this.chart.width * this.zoom.value + this.interval.offset * this.dpi + rebaseMap[0].x,
                            y: rebaseMap[0].y,
                            dot: rebaseMap[0]
                        };

                    inside_left = inside_left || inside_right;
                    inside_right = inside_right || inside_left;

                    if (!inside_left && !inside_right) {

                        prefix = 'M0,' + this.calcTransition(0, outside_left, outside_right);
                        postfix = 'L' + this.chart.width + ','
                                + this.calcTransition(this.chart.width, outside_left, outside_right);

                    } else {

                        prefix = 'M0,' + this.calcTransition(0, outside_left, inside_left);
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
                return (+this.clientWidth) != 0 ? this.width / this.clientWidth : 0;
            },

            //Коэфициент преобразования реальных точек во внутренние по высоте
            koofScreenY(){
                return (+this.clientHeight) !=0 ?  this.height / this.clientHeight : 0;
            },

            //Радиус точек на графике
            dotRadius(){
                return this.koofScreenX > 0 ? (this.isMobileScreen ? 20 : 10) * this.koofScreenX : 1;
            },

            fontHeight(){
                return this.koofScreenY > 0 ? 16 * this.koofScreenY : 16;
            },

            fontSizeAxisY(){
                return this.fontHeight < (this.chart.offset.left / 6) ? this.chart.offset.left / 6 : this.fontHeight;
            },

            fontSizeAxisX(){
                return this.fontHeight > (this.clientWidth / 16) ? this.clientWidth / 16 : this.fontHeight;
            }

        },

        filters: {

            day(timestamp) {
                return (timestamp - timestamp % 86400) / 86400 + 1;
            },

            time(timestamp) {
                let hours = (timestamp % 86400 - timestamp % 3600) / 3600;
                let mins = (timestamp % 3600 - timestamp % 60) / 60;
                let secs = timestamp % 60;


                return ''
                        + ('0' + hours).slice(-2)
                        + ':' + ('0' + mins).slice(-2);
                //+ (inc_sec ? ':' + ('0' + secs).slice(-2) : '');
            },

            percent(value) {
                return '' + value + '%';
            }
        }
    }
</script>

<style lang="less" rel="stylesheet/less">

    .dot-inspector {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        z-index: 10000;
    }

    .light-schedule {

        .toolbar {

            .button {
                cursor: pointer;
            }

            .button:hover {
                fill: #f00;
            }

            .button.ico {
                font-family: "Material Icons";
                text-rendering: optimizeLegibility;
                font-feature-settings: 'liga' 1;
                font-style: normal;
            }
        }

        /* width: 100%; */
        /* height: auto; */

        .selection-box {
            stroke: none;
            fill: #000;
            opacity: 0.2;
        }

        .current-time-box {
            stroke: none;
            fill: #000;
            opacity: 0.05;
        }

        .current-time-line {

            stroke: rgb(0, 0, 255);
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

        .schedulePath {
            fill: none;
            stroke: #0000F5;
        }

    }

</style>
