/* *
 *
 *  (c) 2010-2021 Torstein Honsi
 *
 *  License: www.highcharts.com/license
 *
 *  !!!!!!! SOURCE GETS TRANSPILED BY TYPESCRIPT. EDIT TS FILE ONLY. !!!!!!!
 *
 * */

'use strict';

/* *
 *
 *  Imports
 *
 * */

import type BBoxObject from '../../Core/Renderer/BBoxObject';
import type Chart from '../../Core/Chart/Chart';
import type ColumnMetricsObject from './ColumnMetricsObject';
import type ColumnPoint from './ColumnPoint';
import type ColumnSeriesOptions from './ColumnSeriesOptions';
import type DashStyleValue from '../../Core/Renderer/DashStyleValue';
import type PointerEvent from '../../Core/PointerEvent';
import type { SeriesStateHoverOptions } from '../../Core/Series/SeriesOptions';
import type { StatesOptionsKey } from '../../Core/Series/StatesOptions';
import type SVGAttributes from '../../Core/Renderer/SVG/SVGAttributes';
import type SVGElement from '../../Core/Renderer/SVG/SVGElement';

import A from '../../Core/Animation/AnimationUtilities.js';
const { animObject } = A;
import Color from '../../Core/Color/Color.js';
const { parse: color } = Color;
import H from '../../Core/Globals.js';
const {
    hasTouch,
    noop
} = H;
import LegendSymbol from '../../Core/Legend/LegendSymbol.js';
import Palette from '../../Core/Color/Palette.js';
import Series from '../../Core/Series/Series.js';
import SeriesRegistry from '../../Core/Series/SeriesRegistry.js';
import U from '../../Core/Utilities.js';
const {
    clamp,
    css,
    defined,
    extend,
    fireEvent,
    isArray,
    isNumber,
    merge,
    pick,
    objectEach
} = U;

/* *
 *
 *  Declarations
 *
 * */

declare module '../../Core/Series/SeriesLike' {
    interface SeriesLike {
        barW?: number;
        pointXOffset?: number;
    }
}

/* *
 *
 *  Class
 *
 * */

/**
 * The column series type.
 *
 * @private
 * @class
 * @name Highcharts.seriesTypes.column
 *
 * @augments Highcharts.Series
 */
class ColumnSeries extends Series {

    /* *
     *
     *  Static Properties
     *
     * */

    /**
     * Column series display one column per value along an X axis.
     *
     * @sample {highcharts} highcharts/demo/column-basic/
     *         Column chart
     * @sample {highstock} stock/demo/column/
     *         Column chart
     *
     * @extends      plotOptions.line
     * @excluding    connectEnds, connectNulls, gapSize, gapUnit, linecap,
     *               lineWidth, marker, step, useOhlcData
     * @product      highcharts highstock
     * @optionparent plotOptions.column
     */
    public static defaultOptions: ColumnSeriesOptions = merge(Series.defaultOptions, {

        /**
         * The corner radius of the border surrounding each column or bar.
         *
         * @sample {highcharts} highcharts/plotoptions/column-borderradius/
         *         Rounded columns
         *
         * @product highcharts highstock gantt
         *
         * @private
         */
        borderRadius: 0,

        /**
         * When using automatic point colors pulled from the global
         * [colors](colors) or series-specific
         * [plotOptions.column.colors](series.colors) collections, this option
         * determines whether the chart should receive one color per series or
         * one color per point.
         *
         * In styled mode, the `colors` or `series.colors` arrays are not
         * supported, and instead this option gives the points individual color
         * class names on the form `highcharts-color-{n}`.
         *
         * @see [series colors](#plotOptions.column.colors)
         *
         * @sample {highcharts} highcharts/plotoptions/column-colorbypoint-false/
         *         False by default
         * @sample {highcharts} highcharts/plotoptions/column-colorbypoint-true/
         *         True
         *
         * @type      {boolean}
         * @default   false
         * @since     2.0
         * @product   highcharts highstock gantt
         * @apioption plotOptions.column.colorByPoint
         */

        /**
         * A series specific or series type specific color set to apply instead
         * of the global [colors](#colors) when [colorByPoint](
         * #plotOptions.column.colorByPoint) is true.
         *
         * @type      {Array<Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject>}
         * @since     3.0
         * @product   highcharts highstock gantt
         * @apioption plotOptions.column.colors
         */

        /**
         * When `true`, the columns will center in the category, ignoring null
         * or missing points. When `false`, space will be reserved for null or
         * missing points.
         *
         * @sample {highcharts} highcharts/series-column/centerincategory/
         *         Center in category
         *
         * @since   8.0.1
         * @product highcharts highstock gantt
         *
         * @private
         */
        centerInCategory: false,

        /**
         * Padding between each value groups, in x axis units.
         *
         * @sample {highcharts} highcharts/plotoptions/column-grouppadding-default/
         *         0.2 by default
         * @sample {highcharts} highcharts/plotoptions/column-grouppadding-none/
         *         No group padding - all columns are evenly spaced
         *
         * @product highcharts highstock gantt
         *
         * @private
         */
        groupPadding: 0.2,

        /**
         * Whether to group non-stacked columns or to let them render
         * independent of each other. Non-grouped columns will be laid out
         * individually and overlap each other.
         *
         * @sample {highcharts} highcharts/plotoptions/column-grouping-false/
         *         Grouping disabled
         * @sample {highstock} highcharts/plotoptions/column-grouping-false/
         *         Grouping disabled
         *
         * @type      {boolean}
         * @default   true
         * @since     2.3.0
         * @product   highcharts highstock gantt
         * @apioption plotOptions.column.grouping
         */

        /**
         * @ignore-option
         * @private
         */
        marker: null as any, // point options are specified in the base options

        /**
         * The maximum allowed pixel width for a column, translated to the
         * height of a bar in a bar chart. This prevents the columns from
         * becoming too wide when there is a small number of points in the
         * chart.
         *
         * @see [pointWidth](#plotOptions.column.pointWidth)
         *
         * @sample {highcharts} highcharts/plotoptions/column-maxpointwidth-20/
         *         Limited to 50
         * @sample {highstock} highcharts/plotoptions/column-maxpointwidth-20/
         *         Limited to 50
         *
         * @type      {number}
         * @since     4.1.8
         * @product   highcharts highstock gantt
         * @apioption plotOptions.column.maxPointWidth
         */

        /**
         * Padding between each column or bar, in x axis units.
         *
         * @sample {highcharts} highcharts/plotoptions/column-pointpadding-default/
         *         0.1 by default
         * @sample {highcharts} highcharts/plotoptions/column-pointpadding-025/
         *          0.25
         * @sample {highcharts} highcharts/plotoptions/column-pointpadding-none/
         *         0 for tightly packed columns
         *
         * @product highcharts highstock gantt
         *
         * @private
         */
        pointPadding: 0.1,

        /**
         * A pixel value specifying a fixed width for each column or bar point.
         * When set to `undefined`, the width is calculated from the
         * `pointPadding` and `groupPadding`. The width effects the dimension
         * that is not based on the point value. For column series it is the
         * hoizontal length and for bar series it is the vertical length.
         *
         * @see [maxPointWidth](#plotOptions.column.maxPointWidth)
         *
         * @sample {highcharts} highcharts/plotoptions/column-pointwidth-20/
         *         20px wide columns regardless of chart width or the amount of
         *         data points
         *
         * @type      {number}
         * @since     1.2.5
         * @product   highcharts highstock gantt
         * @apioption plotOptions.column.pointWidth
         */

        /**
         * A pixel value specifying a fixed width for the column or bar.
         * Overrides pointWidth on the series.
         *
         * @see [series.pointWidth](#plotOptions.column.pointWidth)
         *
         * @type      {number}
         * @default   undefined
         * @since     7.0.0
         * @product   highcharts highstock gantt
         * @apioption series.column.data.pointWidth
         */

        /**
         * The minimal height for a column or width for a bar. By default,
         * 0 values are not shown. To visualize a 0 (or close to zero) point,
         * set the minimal point length to a pixel value like 3\. In stacked
         * column charts, minPointLength might not be respected for tightly
         * packed values.
         *
         * @sample {highcharts} highcharts/plotoptions/column-minpointlength/
         *         Zero base value
         * @sample {highcharts} highcharts/plotoptions/column-minpointlength-pos-and-neg/
         *         Positive and negative close to zero values
         *
         * @product highcharts highstock gantt
         *
         * @private
         */
        minPointLength: 0,

        /**
         * When the series contains less points than the crop threshold, all
         * points are drawn, event if the points fall outside the visible plot
         * area at the current zoom. The advantage of drawing all points
         * (including markers and columns), is that animation is performed on
         * updates. On the other hand, when the series contains more points than
         * the crop threshold, the series data is cropped to only contain points
         * that fall within the plot area. The advantage of cropping away
         * invisible points is to increase performance on large series.
         *
         * @product highcharts highstock gantt
         *
         * @private
         */
        cropThreshold: 50,

        /**
         * The X axis range that each point is valid for. This determines the
         * width of the column. On a categorized axis, the range will be 1
         * by default (one category unit). On linear and datetime axes, the
         * range will be computed as the distance between the two closest data
         * points.
         *
         * The default `null` means it is computed automatically, but this
         * option can be used to override the automatic value.
         *
         * This option is set by default to 1 if data sorting is enabled.
         *
         * @sample {highcharts} highcharts/plotoptions/column-pointrange/
         *         Set the point range to one day on a data set with one week
         *         between the points
         *
         * @type    {number|null}
         * @since   2.3
         * @product highcharts highstock gantt
         *
         * @private
         */
        pointRange: null,

        states: {

            /**
             * Options for the hovered point. These settings override the normal
             * state options when a point is moused over or touched.
             *
             * @extends   plotOptions.series.states.hover
             * @excluding halo, lineWidth, lineWidthPlus, marker
             * @product   highcharts highstock gantt
             */
            hover: {

                /** @ignore-option */
                halo: false,

                /**
                 * A specific border color for the hovered point. Defaults to
                 * inherit the normal state border color.
                 *
                 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @product   highcharts gantt
                 * @apioption plotOptions.column.states.hover.borderColor
                 */

                /**
                 * A specific color for the hovered point.
                 *
                 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @product   highcharts gantt
                 * @apioption plotOptions.column.states.hover.color
                 */

                /**
                 * How much to brighten the point on interaction. Requires the
                 * main color to be defined in hex or rgb(a) format.
                 *
                 * In styled mode, the hover brightening is by default replaced
                 * with a fill-opacity set in the `.highcharts-point:hover`
                 * rule.
                 *
                 * @sample {highcharts} highcharts/plotoptions/column-states-hover-brightness/
                 *         Brighten by 0.5
                 *
                 * @product highcharts highstock gantt
                 */
                brightness: 0.1
            },

            /**
             * Options for the selected point. These settings override the
             * normal state options when a point is selected.
             *
             * @extends   plotOptions.series.states.select
             * @excluding halo, lineWidth, lineWidthPlus, marker
             * @product   highcharts highstock gantt
             */
            select: {

                /**
                 * A specific color for the selected point.
                 *
                 * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @default #cccccc
                 * @product highcharts highstock gantt
                 */
                color: Palette.neutralColor20,

                /**
                 * A specific border color for the selected point.
                 *
                 * @type    {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
                 * @default #000000
                 * @product highcharts highstock gantt
                 */
                borderColor: Palette.neutralColor100
            }
        },

        dataLabels: {
            align: void 0,
            verticalAlign: void 0,

            /**
             * The y position offset of the label relative to the point in
             * pixels.
             *
             * @type {number}
             */
            y: void 0
        },

        // false doesn't work well: https://jsfiddle.net/highcharts/hz8fopan/14/
        /**
         * @ignore-option
         * @private
         */
        startFromThreshold: true,

        stickyTracking: false,

        tooltip: {
            distance: 6
        },

        /**
         * The Y axis value to serve as the base for the columns, for
         * distinguishing between values above and below a threshold. If `null`,
         * the columns extend from the padding Y axis minimum.
         *
         * @type    {number|null}
         * @since   2.0
         * @product highcharts
         *
         * @private
         */
        threshold: 0,

        /**
         * The width of the border surrounding each column or bar. Defaults to
         * `1` when there is room for a border, but to `0` when the columns are
         * so dense that a border would cover the next column.
         *
         * In styled mode, the stroke width can be set with the
         * `.highcharts-point` rule.
         *
         * @sample {highcharts} highcharts/plotoptions/column-borderwidth/
         *         2px black border
         *
         * @type      {number}
         * @default   undefined
         * @product   highcharts highstock gantt
         * @apioption plotOptions.column.borderWidth
         */

        /**
         * The color of the border surrounding each column or bar.
         *
         * In styled mode, the border stroke can be set with the
         * `.highcharts-point` rule.
         *
         * @sample {highcharts} highcharts/plotoptions/column-bordercolor/
         *         Dark gray border
         *
         * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
         * @default   #ffffff
         * @product   highcharts highstock gantt
         *
         * @private
         */
        borderColor: Palette.backgroundColor

    });

    /* *
     *
     *  Properties
     *
     * */

    public borderWidth: number = void 0 as any;

    public columnIndex?: number;

    public columnMetrics?: ColumnMetricsObject;

    public cropShould?: number;

    public dashStyle?: DashStyleValue;

    public data: Array<ColumnPoint> = void 0 as any;

    public dense?: boolean;

    public group: SVGElement = void 0 as any;

    public options: ColumnSeriesOptions = void 0 as any;

    public points: Array<ColumnPoint> = void 0 as any;

    public pointXOffset?: number;

    public translatedThreshold?: number;

    /* *
     *
     *  Functions
     *
     * */

    /* eslint-disable valid-jsdoc */

    /**
     * Animate the column heights one by one from zero.
     *
     * @private
     * @function Highcharts.seriesTypes.column#animate
     *
     * @param {boolean} init
     *        Whether to initialize the animation or run it
     */
    public animate(init: boolean): void {
        const series = this,
            yAxis = this.yAxis,
            options = series.options,
            inverted = this.chart.inverted,
            attr: SVGAttributes = {},
            translateProp: 'translateX'|'translateY' = inverted ? 'translateX' : 'translateY';
        let translateStart: number,
            translatedThreshold;

        if (init) {
            attr.scaleY = 0.001;
            translatedThreshold = clamp(
                yAxis.toPixels(options.threshold as any),
                yAxis.pos,
                yAxis.pos + yAxis.len
            );
            if (inverted) {
                attr.translateX = translatedThreshold - yAxis.len;
            } else {
                attr.translateY = translatedThreshold;
            }

            // apply finnal clipping (used in Highcharts Stock) (#7083)
            // animation is done by scaleY, so cliping is for panes
            if (series.clipBox) {
                series.setClip();
            }

            series.group.attr(attr);

        } else { // run the animation
            translateStart = Number(series.group.attr(translateProp));
            series.group.animate(
                { scaleY: 1 },
                extend(animObject(series.options.animation), {
                    // Do the scale synchronously to ensure smooth
                    // updating (#5030, #7228)
                    step: function (val: any, fx: any): void {
                        if (series.group) {
                            attr[translateProp] = translateStart +
                                fx.pos * (yAxis.pos - translateStart);
                            series.group.attr(attr);
                        }
                    }
                })
            );
        }
    }

    /**
     * Initialize the series. Extends the basic Series.init method by
     * marking other series of the same type as dirty.
     *
     * @private
     * @function Highcharts.seriesTypes.column#init
     */
    public init(chart: Chart, options: ColumnSeriesOptions): void {
        super.init.apply(this, arguments as any);

        const series = this;

        chart = series.chart;

        // if the series is added dynamically, force redraw of other
        // series affected by a new column
        if (chart.hasRendered) {
            chart.series.forEach(function (otherSeries): void {
                if (otherSeries.type === series.type) {
                    otherSeries.isDirty = true;
                }
            });
        }
    }

    /**
     * Return the width and x offset of the columns adjusted for grouping,
     * groupPadding, pointPadding, pointWidth etc.
     *
     * @private
     * @function Highcharts.seriesTypes.column#getColumnMetrics
     * @return {Highcharts.ColumnMetricsObject}
     */
    public getColumnMetrics(): ColumnMetricsObject {
        const series = this,
            options = series.options,
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            reversedStacks = xAxis.options.reversedStacks,
            // Keep backward compatibility: reversed xAxis had reversed
            // stacks
            reverseStacks = (xAxis.reversed && !reversedStacks) ||
            (!xAxis.reversed && reversedStacks),
            stackGroups: Record<string, number> = {};
        let stackKey,
            columnCount = 0;

        // Get the total number of column type series. This is called on
        // every series. Consider moving this logic to a chart.orderStacks()
        // function and call it on init, addSeries and removeSeries
        if (options.grouping === false) {
            columnCount = 1;
        } else {
            series.chart.series.forEach(function (otherSeries): void {
                const otherYAxis = otherSeries.yAxis,
                    otherOptions = otherSeries.options;
                let columnIndex;

                if (otherSeries.type === series.type &&
                    (
                        otherSeries.visible ||
                        !series.chart.options.chart.ignoreHiddenSeries
                    ) &&
                    yAxis.len === otherYAxis.len &&
                    yAxis.pos === otherYAxis.pos
                ) { // #642, #2086
                    if (otherOptions.stacking && otherOptions.stacking !== 'group') {
                        stackKey = otherSeries.stackKey;
                        if (
                            typeof stackGroups[stackKey as any] ===
                            'undefined'
                        ) {
                            stackGroups[stackKey as any] = columnCount++;
                        }
                        columnIndex = stackGroups[stackKey as any];
                    } else if (otherOptions.grouping !== false) { // #1162
                        columnIndex = columnCount++;
                    }
                    (otherSeries as any).columnIndex = columnIndex;
                }
            });
        }

        const categoryWidth = Math.min(
                Math.abs(xAxis.transA) * (
                    (xAxis.ordinal && xAxis.ordinal.slope) ||
                options.pointRange ||
                xAxis.closestPointRange ||
                xAxis.tickInterval ||
                1
                ), // #2610
                xAxis.len // #1535
            ),
            groupPadding = categoryWidth * (options.groupPadding as any),
            groupWidth = categoryWidth - 2 * groupPadding,
            pointOffsetWidth = groupWidth / (columnCount || 1),
            pointWidth = Math.min(
                options.maxPointWidth || xAxis.len,
                pick(
                    options.pointWidth,
                    pointOffsetWidth * (
                        1 - 2 * (options.pointPadding as any)
                    )
                )
            ),
            pointPadding = (pointOffsetWidth - pointWidth) / 2,
            // #1251, #3737
            colIndex = (series.columnIndex || 0) + (reverseStacks ? 1 : 0),
            pointXOffset =
            pointPadding +
            (
                groupPadding +
                colIndex * pointOffsetWidth -
                (categoryWidth / 2)
            ) * (reverseStacks ? -1 : 1);

        // Save it for reading in linked series (Error bars particularly)
        series.columnMetrics = {
            width: pointWidth,
            offset: pointXOffset,
            paddedWidth: pointOffsetWidth,
            columnCount
        };
        return series.columnMetrics;
    }

    /**
     * Make the columns crisp. The edges are rounded to the nearest full
     * pixel.
     *
     * @private
     * @function Highcharts.seriesTypes.column#crispCol
     */
    public crispCol(
        x: number,
        y: number,
        w: number,
        h: number
    ): BBoxObject {
        const chart = this.chart,
            borderWidth = this.borderWidth,
            xCrisp = -((borderWidth as any) % 2 ? 0.5 : 0);
        let right,
            yCrisp = (borderWidth as any) % 2 ? 0.5 : 1;

        if (chart.inverted && chart.renderer.isVML) {
            yCrisp += 1;
        }

        // Horizontal. We need to first compute the exact right edge, then
        // round it and compute the width from there.
        if (this.options.crisp) {
            right = Math.round(x + w) + xCrisp;
            x = Math.round(x) + xCrisp;
            w = right - x;
        }

        // Vertical
        const bottom = Math.round(y + h) + yCrisp,
            fromTop = Math.abs(y) <= 0.5 && bottom > 0.5; // #4504, #4656
        y = Math.round(y) + yCrisp;
        h = bottom - y;

        // Top edges are exceptions
        if (fromTop && h) { // #5146
            y -= 1;
            h += 1;
        }

        return {
            x: x,
            y: y,
            width: w,
            height: h
        };
    }

    /**
     * Adjust for missing columns, according to the `centerInCategory`
     * option. Missing columns are either single points or stacks where the
     * point or points are either missing or null.
     *
     * @private
     * @function Highcharts.seriesTypes.column#adjustForMissingColumns
     * @param {number} x
     * The x coordinate of the column, left side
     *
     * @param {number} pointWidth
     * The pointWidth, already computed upstream
     *
     * @param {Highcharts.ColumnPoint} point
     * The point instance
     *
     * @param {Highcharts.ColumnMetricsObject} metrics
     * The series-wide column metrics
     *
     * @return {number}
     * The adjusted x position, or the original if not adjusted
     */
    public adjustForMissingColumns(
        x: number,
        pointWidth: number,
        point: ColumnPoint,
        metrics: ColumnMetricsObject
    ): number {
        const stacking = this.options.stacking;
        if (!point.isNull && metrics.columnCount > 1) {
            let indexInCategory = 0;
            let totalInCategory = 0;

            // Loop over all the stacks on the Y axis. When stacking is
            // enabled, these are real point stacks. When stacking is not
            // enabled, but `centerInCategory` is true, there is one stack
            // handling the grouping of points in each category. This is
            // done in the `setGroupedPoints` function.
            objectEach(
                this.yAxis.stacking && this.yAxis.stacking.stacks,
                (stack: Record<string, Highcharts.StackItem>): void => {
                    if (typeof point.x === 'number') {
                        const stackItem = stack[point.x.toString()];

                        if (stackItem) {
                            const pointValues = stackItem.points[this.index as any],
                                total = stackItem.total;

                            // If true `stacking` is enabled, count the
                            // total number of non-null stacks in the
                            // category, and note which index this point is
                            // within those stacks.
                            if (stacking) {
                                if (pointValues) {
                                    indexInCategory = totalInCategory;
                                }
                                if (stackItem.hasValidPoints) {
                                    totalInCategory++;
                                }

                            // If `stacking` is not enabled, look for the
                            // index and total of the `group` stack.
                            } else if (isArray(pointValues)) {
                                indexInCategory = pointValues[1];
                                totalInCategory = total || 0;
                            }
                        }
                    }
                }
            );

            // Compute the adjusted x position
            const boxWidth = (totalInCategory - 1) * metrics.paddedWidth +
                pointWidth;
            x = (point.plotX || 0) + boxWidth / 2 - pointWidth -
                indexInCategory * metrics.paddedWidth;

        }
        return x;
    }

    /**
     * Translate each point to the plot area coordinate system and find
     * shape positions
     *
     * @private
     * @function Highcharts.seriesTypes.column#translate
     */
    public translate(): void {
        const series = this,
            chart = series.chart,
            options = series.options,
            dense = series.dense =
                (series.closestPointRange as any) * series.xAxis.transA < 2,
            borderWidth = series.borderWidth = pick(
                options.borderWidth,
                dense ? 0 : 1 // #3635
            ),
            xAxis = series.xAxis,
            yAxis = series.yAxis,
            threshold = options.threshold,
            translatedThreshold = series.translatedThreshold =
                yAxis.getThreshold(threshold as any),
            minPointLength = pick(options.minPointLength, 5),
            metrics = series.getColumnMetrics(),
            seriesPointWidth = metrics.width,
            seriesXOffset = series.pointXOffset = metrics.offset,
            dataMin = series.dataMin,
            dataMax = series.dataMax;
        // postprocessed for border width
        let seriesBarW = series.barW =
            Math.max(seriesPointWidth, 1 + 2 * borderWidth);

        if (chart.inverted) {
            (translatedThreshold as any) -= 0.5; // #3355
        }

        // When the pointPadding is 0, we want the columns to be packed
        // tightly, so we allow individual columns to have individual sizes.
        // When pointPadding is greater, we strive for equal-width columns
        // (#2694).
        if (options.pointPadding) {
            seriesBarW = Math.ceil(seriesBarW);
        }

        Series.prototype.translate.apply(series);

        // Record the new values
        series.points.forEach(function (point): void {
            const yBottom = pick(point.yBottom, translatedThreshold as any),
                safeDistance = 999 + Math.abs(yBottom),
                plotX = point.plotX || 0,
                // Don't draw too far outside plot area (#1303, #2241,
                // #4264)
                plotY = clamp(
                    point.plotY as any,
                    -safeDistance,
                    yAxis.len + safeDistance
                );
            let up,
                barY = Math.min(plotY, yBottom),
                barH = Math.max(plotY, yBottom) - barY,
                pointWidth = seriesPointWidth,
                barX = plotX + seriesXOffset,
                barW = seriesBarW;

            // Handle options.minPointLength
            if (minPointLength && Math.abs(barH) < minPointLength) {
                barH = minPointLength;
                up = (!yAxis.reversed && !point.negative) ||
                (yAxis.reversed && point.negative);

                // Reverse zeros if there's no positive value in the series
                // in visible range (#7046)
                if (
                    isNumber(threshold) &&
                    isNumber(dataMax) &&
                    point.y === threshold &&
                    dataMax <= threshold &&
                    // and if there's room for it (#7311)
                    (yAxis.min || 0) < threshold &&
                    // if all points are the same value (i.e zero) not draw
                    // as negative points (#10646), but only if there's room
                    // for it (#14876)
                    (dataMin !== dataMax || (yAxis.max || 0) <= threshold)
                ) {
                    up = !up;
                }

                // If stacked...
                barY = (
                    Math.abs(
                        barY - (translatedThreshold as any)
                    ) > minPointLength ?
                        // ...keep position
                        yBottom - minPointLength :
                        // #1485, #4051
                        (translatedThreshold as any) -
                        (up ? minPointLength : 0)
                );
            }

            // Handle point.options.pointWidth
            // @todo Handle grouping/stacking too. Calculate offset properly
            if (defined(point.options.pointWidth)) {
                pointWidth = barW =
                    Math.ceil(point.options.pointWidth as any);
                barX -= Math.round((pointWidth - seriesPointWidth) / 2);
            }

            // Adjust for null or missing points
            if (options.centerInCategory) {
                barX = series.adjustForMissingColumns(barX, pointWidth, point, metrics);
            }

            // Cache for access in polar
            point.barX = barX;
            point.pointWidth = pointWidth;

            // Fix the tooltip on center of grouped columns (#1216, #424,
            // #3648)
            point.tooltipPos = chart.inverted ?
                [
                    clamp(
                        yAxis.len + yAxis.pos - chart.plotLeft - plotY,
                        yAxis.pos - chart.plotLeft,
                        yAxis.len + yAxis.pos - chart.plotLeft
                    ),
                    xAxis.len + xAxis.pos - chart.plotTop - barX - barW / 2,
                    barH
                ] :
                [
                    xAxis.left - chart.plotLeft + barX + barW / 2,
                    clamp(
                        plotY + (yAxis.pos as any) -
                        chart.plotTop,
                        yAxis.pos - chart.plotTop,
                        yAxis.len + yAxis.pos - chart.plotTop
                    ),
                    barH
                ];

            // Register shape type and arguments to be used in drawPoints
            // Allow shapeType defined on pointClass level
            point.shapeType = series.pointClass.prototype.shapeType || 'rect';
            point.shapeArgs = series.crispCol.apply(
                series,
                point.isNull ?
                // #3169, drilldown from null must have a position to work
                // from #6585, dataLabel should be placed on xAxis, not
                // floating in the middle of the chart
                    [barX, translatedThreshold as any, barW, 0] :
                    [barX, barY, barW, barH]
            );
        });
    }

    /**
     * Columns have no graph
     *
     * @private
     * @function Highcharts.seriesTypes.column#drawGraph
     */
    public drawGraph(): void {
        this.group[
            this.dense ? 'addClass' : 'removeClass'
        ]('highcharts-dense-data');
    }

    /**
     * Get presentational attributes
     *
     * @private
     * @function Highcharts.seriesTypes.column#pointAttribs
     */
    public pointAttribs(
        point?: ColumnPoint,
        state?: StatesOptionsKey
    ): SVGAttributes {
        const options = this.options,
            p2o = (this as any).pointAttrToOptions || {},
            strokeOption = p2o.stroke || 'borderColor',
            strokeWidthOption = p2o['stroke-width'] || 'borderWidth';
        let stateOptions: SeriesStateHoverOptions,
            zone,
            brightness,
            fill = (point && point.color) || this.color,
            // set to fill when borderColor null:
            stroke = (
                (point && (point as any)[strokeOption]) ||
                (options as any)[strokeOption] ||
                fill
            ),
            dashstyle =
                (point && point.options.dashStyle) || options.dashStyle,
            strokeWidth = (point && (point as any)[strokeWidthOption]) ||
                (options as any)[strokeWidthOption] ||
                (this as any)[strokeWidthOption] || 0,
            opacity = pick(point && point.opacity, options.opacity, 1);

        // Handle zone colors
        if (point && this.zones.length) {
            zone = point.getZone();
            // When zones are present, don't use point.color (#4267).
            // Changed order (#6527), added support for colorAxis (#10670)
            fill = (
                point.options.color ||
                (zone && (zone.color || point.nonZonedColor)) ||
                this.color
            );

            if (zone) {
                stroke = zone.borderColor || stroke;
                dashstyle = zone.dashStyle || dashstyle;
                strokeWidth = zone.borderWidth || strokeWidth;
            }
        }

        // Select or hover states
        if (state && point) {
            stateOptions = merge(
                (options.states as any)[state],
                // #6401
                point.options.states &&
                (point.options.states as any)[state] ||
                {}
            );
            brightness = stateOptions.brightness;
            fill =
                stateOptions.color || (
                    typeof brightness !== 'undefined' &&
                    color(fill as any)
                        .brighten(stateOptions.brightness as any)
                        .get()
                ) || fill;
            stroke = (stateOptions as any)[strokeOption] || stroke;
            strokeWidth =
                (stateOptions as any)[strokeWidthOption] || strokeWidth;
            dashstyle = stateOptions.dashStyle || dashstyle;
            opacity = pick(stateOptions.opacity, opacity);
        }

        const ret: SVGAttributes = {
            fill: fill as any,
            stroke: stroke,
            'stroke-width': strokeWidth,
            opacity: opacity
        };

        if (dashstyle) {
            ret.dashstyle = dashstyle;
        }

        return ret;
    }

    /**
     * Draw the columns. For bars, the series.group is rotated, so the same
     * coordinates apply for columns and bars. This method is inherited by
     * scatter series.
     *
     * @private
     * @function Highcharts.seriesTypes.column#drawPoints
     */
    public drawPoints(): void {
        const series = this,
            chart = this.chart,
            options = series.options,
            renderer = chart.renderer,
            animationLimit = options.animationLimit || 250;
        let shapeArgs;

        // draw the columns
        series.points.forEach(function (point): void {
            const plotY = point.plotY;
            let graphic = point.graphic,
                hasGraphic = !!graphic,
                verb = graphic && chart.pointCount < animationLimit ?
                    'animate' : 'attr';

            if (isNumber(plotY) && point.y !== null) {
                shapeArgs = point.shapeArgs;

                // When updating a series between 2d and 3d or cartesian and
                // polar, the shape type changes.
                if (graphic && point.hasNewShapeType()) {
                    graphic = graphic.destroy();
                }

                // Set starting position for point sliding animation.
                if (series.enabledDataSorting) {
                    point.startXPos = series.xAxis.reversed ?
                        -(shapeArgs ? (shapeArgs.width || 0) : 0) :
                        series.xAxis.width;
                }

                if (!graphic) {
                    point.graphic = graphic =
                        (renderer as any)[point.shapeType as any](shapeArgs)
                            .add(point.group || series.group);

                    if (
                        graphic &&
                        series.enabledDataSorting &&
                        chart.hasRendered &&
                        chart.pointCount < animationLimit
                    ) {
                        graphic.attr({
                            x: point.startXPos
                        });

                        hasGraphic = true;
                        verb = 'animate';
                    }
                }

                if (graphic && hasGraphic) { // update
                    graphic[verb](
                        merge(shapeArgs)
                    );
                }

                // Border radius is not stylable (#6900)
                if (options.borderRadius) {
                    (graphic as any)[verb]({
                        r: options.borderRadius
                    });
                }

                // Presentational
                if (!chart.styledMode) {
                    (graphic as any)[verb](series.pointAttribs(
                        point,
                        (point.selected && 'select') as any
                    ))
                        .shadow(
                            point.allowShadow !== false && options.shadow,
                            null,
                            options.stacking && !options.borderRadius
                        );
                }

                if (graphic) {
                    graphic.addClass(point.getClassName(), true);

                    graphic.attr({
                        visibility: point.visible ? 'inherit' : 'hidden'
                    });
                }

            } else if (graphic) {
                point.graphic = graphic.destroy(); // #1269
            }
        });
    }

    /**
     * Draw the tracker for a point.
     * @private
     */
    public drawTracker(): void {
        const series = this,
            chart = series.chart,
            pointer = chart.pointer,
            onMouseOver = function (e: PointerEvent): void {
                const point = pointer.getPointFromEvent(e);

                // undefined on graph in scatterchart
                if (typeof point !== 'undefined') {
                    pointer.isDirectTouch = true;
                    point.onMouseOver(e);
                }
            };
        let dataLabels;

        // Add reference to the point
        series.points.forEach(function (point): void {
            dataLabels = (
                isArray(point.dataLabels) ?
                    point.dataLabels :
                    (point.dataLabel ? [point.dataLabel] : [])
            );

            if (point.graphic) {
                (point.graphic.element as any).point = point;
            }
            (dataLabels as any).forEach(function (
                dataLabel: SVGElement
            ): void {
                if (dataLabel.div) {
                    dataLabel.div.point = point;
                } else {
                    (dataLabel.element as any).point = point;
                }
            });
        });

        // Add the event listeners, we need to do this only once
        if (!series._hasTracking) {
            (series.trackerGroups as any).forEach(function (key: string): void {
                if ((series as any)[key]) {
                    // we don't always have dataLabelsGroup
                    (series as any)[key]
                        .addClass('highcharts-tracker')
                        .on('mouseover', onMouseOver)
                        .on('mouseout', function (e: PointerEvent): void {
                            pointer.onTrackerMouseOut(e);
                        });
                    if (hasTouch) {
                        (series as any)[key].on('touchstart', onMouseOver);
                    }

                    if (!chart.styledMode && series.options.cursor) {
                        (series as any)[key]
                            .css(css)
                            .css({ cursor: series.options.cursor });
                    }
                }
            });
            series._hasTracking = true;
        }

        fireEvent(this, 'afterDrawTracker');
    }

    /**
     * Remove this series from the chart
     *
     * @private
     * @function Highcharts.seriesTypes.column#remove
     */
    public remove(): void {
        const series = this,
            chart = series.chart;

        // column and bar series affects other series of the same type
        // as they are either stacked or grouped
        if (chart.hasRendered) {
            chart.series.forEach(function (otherSeries): void {
                if (otherSeries.type === series.type) {
                    otherSeries.isDirty = true;
                }
            });
        }

        Series.prototype.remove.apply(series, arguments as any);
    }

    /* eslint-enable valid-jsdoc */

}

/* *
 *
 *  Class Prototype
 *
 * */

interface ColumnSeries {
    pointClass: typeof ColumnPoint;
}
extend(ColumnSeries.prototype, {
    cropShoulder: 0,

    // When tooltip is not shared, this series (and derivatives) requires
    // direct touch/hover. KD-tree does not apply.
    directTouch: true,

    /**
     * Use a solid rectangle like the area series types
     *
     * @private
     * @function Highcharts.seriesTypes.column#drawLegendSymbol
     *
     * @param {Highcharts.Legend} legend
     *        The legend object
     *
     * @param {Highcharts.Series|Highcharts.Point} item
     *        The series (this) or point
     */
    drawLegendSymbol: LegendSymbol.drawRectangle,

    getSymbol: noop,

    // use separate negative stacks, unlike area stacks where a negative
    // point is substracted from previous (#1910)
    negStacks: true,

    trackerGroups: ['group', 'dataLabelsGroup']
});

/* *
 *
 *  Registry
 *
 * */

declare module '../../Core/Series/SeriesType' {
    interface SeriesTypeRegistry {
        column: typeof ColumnSeries;
    }
}
SeriesRegistry.registerSeriesType('column', ColumnSeries);

/* *
 *
 *  Default Export
 *
 * */

export default ColumnSeries;

/* *
 *
 *  API Declarations
 *
 * */

/**
 * Adjusted width and x offset of the columns for grouping.
 *
 * @private
 * @interface Highcharts.ColumnMetricsObject
 *//**
 * Width of the columns.
 * @name Highcharts.ColumnMetricsObject#width
 * @type {number}
 *//**
 * Offset of the columns.
 * @name Highcharts.ColumnMetricsObject#offset
 * @type {number}
 */

''; // detach doclets above

/* *
 *
 *  API Options
 *
 * */

/**
 * A `column` series. If the [type](#series.column.type) option is
 * not specified, it is inherited from [chart.type](#chart.type).
 *
 * @extends   series,plotOptions.column
 * @excluding connectNulls, dataParser, dataURL, gapSize, gapUnit, linecap,
 *            lineWidth, marker, connectEnds, step
 * @product   highcharts highstock
 * @apioption series.column
 */

/**
 * An array of data points for the series. For the `column` series type,
 * points can be given in the following ways:
 *
 * 1. An array of numerical values. In this case, the numerical values will be
 *    interpreted as `y` options. The `x` values will be automatically
 *    calculated, either starting at 0 and incremented by 1, or from
 *    `pointStart` and `pointInterval` given in the series options. If the axis
 *    has categories, these will be used. Example:
 *    ```js
 *    data: [0, 5, 3, 5]
 *    ```
 *
 * 2. An array of arrays with 2 values. In this case, the values correspond to
 *    `x,y`. If the first value is a string, it is applied as the name of the
 *    point, and the `x` value is inferred.
 *    ```js
 *    data: [
 *        [0, 6],
 *        [1, 2],
 *        [2, 6]
 *    ]
 *    ```
 *
 * 3. An array of objects with named values. The following snippet shows only a
 *    few settings, see the complete options set below. If the total number of
 *    data points exceeds the series'
 *    [turboThreshold](#series.column.turboThreshold), this option is not
 *    available.
 *    ```js
 *    data: [{
 *        x: 1,
 *        y: 9,
 *        name: "Point2",
 *        color: "#00FF00"
 *    }, {
 *        x: 1,
 *        y: 6,
 *        name: "Point1",
 *        color: "#FF00FF"
 *    }]
 *    ```
 *
 * @sample {highcharts} highcharts/chart/reflow-true/
 *         Numerical values
 * @sample {highcharts} highcharts/series/data-array-of-arrays/
 *         Arrays of numeric x and y
 * @sample {highcharts} highcharts/series/data-array-of-arrays-datetime/
 *         Arrays of datetime x and y
 * @sample {highcharts} highcharts/series/data-array-of-name-value/
 *         Arrays of point.name and y
 * @sample {highcharts} highcharts/series/data-array-of-objects/
 *         Config objects
 *
 * @type      {Array<number|Array<(number|string),(number|null)>|null|*>}
 * @extends   series.line.data
 * @excluding marker
 * @product   highcharts highstock
 * @apioption series.column.data
 */

/**
 * The color of the border surrounding the column or bar.
 *
 * In styled mode, the border stroke can be set with the `.highcharts-point`
 * rule.
 *
 * @sample {highcharts} highcharts/plotoptions/column-bordercolor/
 *         Dark gray border
 *
 * @type      {Highcharts.ColorString|Highcharts.GradientColorObject|Highcharts.PatternObject}
 * @product   highcharts highstock
 * @apioption series.column.data.borderColor
 */

/**
 * The width of the border surrounding the column or bar.
 *
 * In styled mode, the stroke width can be set with the `.highcharts-point`
 * rule.
 *
 * @sample {highcharts} highcharts/plotoptions/column-borderwidth/
 *         2px black border
 *
 * @type      {number}
 * @product   highcharts highstock
 * @apioption series.column.data.borderWidth
 */

/**
 * A name for the dash style to use for the column or bar. Overrides
 * dashStyle on the series.
 *
 * In styled mode, the stroke dash-array can be set with the same classes as
 * listed under [data.color](#series.column.data.color).
 *
 * @see [series.pointWidth](#plotOptions.column.dashStyle)
 *
 * @type      {Highcharts.DashStyleValue}
 * @apioption series.column.data.dashStyle
 */

/**
 * A pixel value specifying a fixed width for the column or bar. Overrides
 * pointWidth on the series. The width effects the dimension that is not based
 * on the point value.
 *
 * @see [series.pointWidth](#plotOptions.column.pointWidth)
 *
 * @type      {number}
 * @apioption series.column.data.pointWidth
 */

/**
 * @excluding halo, lineWidth, lineWidthPlus, marker
 * @product   highcharts highstock
 * @apioption series.column.states.hover
 */

/**
 * @excluding halo, lineWidth, lineWidthPlus, marker
 * @product   highcharts highstock
 * @apioption series.column.states.select
 */

''; // keeps doclets above in JS file
