/*
    *
    * Wijmo Library 5.20143.24
    * http://wijmo.com/
    *
    * Copyright(c) GrapeCity, Inc.  All rights reserved.
    * 
    * Licensed under the Wijmo Commercial License. 
    * sales@wijmo.com
    * http://wijmo.com/products/wijmo-5/license/
    *
    */
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (chart) {
        'use strict';

        /**
        * Provides arguments for @see:Series events.
        */
        var RenderEventArgs = (function (_super) {
            __extends(RenderEventArgs, _super);
            /**
            * Initializes a new instance of a @see:RenderEventArgs object.
            *
            * @param engine (@see:IRenderEngine) The rendering engine to use.
            */
            function RenderEventArgs(engine) {
                _super.call(this);
                this._engine = engine;
            }
            Object.defineProperty(RenderEventArgs.prototype, "engine", {
                /**
                * Gets the @see:IRenderEngine object to use for rendering the chart elements.
                */
                get: function () {
                    return this._engine;
                },
                enumerable: true,
                configurable: true
            });
            return RenderEventArgs;
        })(wijmo.EventArgs);
        chart.RenderEventArgs = RenderEventArgs;

        /**
        * The @see:FlexChartBase control from which the FlexChart and FlexPie derive.
        */
        var FlexChartBase = (function (_super) {
            __extends(FlexChartBase, _super);
            function FlexChartBase() {
                _super.apply(this, arguments);
                this._palette = null;
                this._selectionMode = 0 /* None */;
                this._defPalette = chart.Palettes.standard;
                this._notifyCurrentChanged = true;
                this._legendHost = null;
                this._needBind = false;
                /**
                * Occurs before the chart starts rendering data.
                */
                this.rendering = new wijmo.Event();
                /**
                * Occurs after the chart finishes rendering.
                */
                this.rendered = new wijmo.Event();
            }
            Object.defineProperty(FlexChartBase.prototype, "itemsSource", {
                //--------------------------------------------------------------------------
                // ** object model
                /**
                * Gets or sets the array or @see:ICollectionView object that contains the data used to create the chart.
                */
                get: function () {
                    return this._items;
                },
                set: function (value) {
                    if (this._items != value) {
                        // unbind current collection view
                        if (this._cv) {
                            this._cv.currentChanged.removeHandler(this._cvCurrentChanged, this);
                            this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                            this._cv = null;
                        }

                        // save new data source and collection view
                        this._items = value;
                        this._cv = wijmo.asCollectionView(value);

                        // bind new collection view
                        if (this._cv != null) {
                            this._cv.currentChanged.addHandler(this._cvCurrentChanged, this);
                            this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
                        }

                        this._clearCachedValues();

                        // bind chart
                        this._bindChart();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChartBase.prototype, "collectionView", {
                /**
                * Gets the @see:ICollectionView object that contains the chart data.
                */
                get: function () {
                    return this._cv;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChartBase.prototype, "binding", {
                /**
                * Gets or sets the name of the property that contains the Y values.
                */
                get: function () {
                    return this._binding;
                },
                set: function (value) {
                    if (value != this._binding) {
                        this._binding = wijmo.asString(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChartBase.prototype, "palette", {
                /**
                * Gets or sets an array of default colors to use for displaying each series.
                *
                * The array contains strings that represents css-colors. For example:
                * <pre>
                * // use colors specified by name
                * chart.palette = ['red', 'green', 'blue'];
                * // or use colors specified as rgba-values
                * chart.palette = [
                *   'rgba(255,0,0,1)',
                *   'rgba(255,0,0,0.8)',
                *   'rgba(255,0,0,0.6)',
                *   'rgba(255,0,0,0.4)'];
                * </pre>
                *
                * There is a set of predefined palettes in the @see:Palettes class that you can use, for example:
                * <pre>
                * chart.palette = wijmo.chart.Palettes.coral;
                * </pre>
                */
                get: function () {
                    return this._palette;
                },
                set: function (value) {
                    if (value != this._palette) {
                        this._palette = wijmo.asArray(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChartBase.prototype, "plotMargin", {
                /**
                * Gets or sets the plot margin in pixels.
                *
                * The plot margin represents the area between the edges of the control
                * and the plot area.
                *
                * By default, this value is calculated automatically based on the space
                * required by the axis labels, but you can override it if you want
                * to control the precise position of the plot area within the control
                * (for example, when aligning multiple chart controls on a page).
                *
                * You may set this property to a numeric value or to a CSS-style
                * margin specification. For example:
                *
                * <pre>
                * // set the plot margin to 20 pixels on all sides
                * chart.plotMargin = 20;
                * // set the plot margin for top, right, bottom, left sides
                * chart.plotMargin = '10 15 20 25';
                * // set the plot margin for top/bottom (10px) and left/right (20px)
                * chart.plotMargin = '10 20';
                * </pre>
                */
                get: function () {
                    return this._plotMargin;
                },
                set: function (value) {
                    if (value != this._plotMargin) {
                        this._plotMargin = value;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChartBase.prototype, "legend", {
                /**
                * Gets the chart legend.
                */
                get: function () {
                    return this._legend;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChartBase.prototype, "header", {
                /**
                * Gets or sets the text displayed in the chart header.
                */
                get: function () {
                    return this._header;
                },
                set: function (value) {
                    if (value != this._header) {
                        this._header = wijmo.asString(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChartBase.prototype, "footer", {
                /**
                * Gets or sets the text displayed in the chart footer.
                */
                get: function () {
                    return this._footer;
                },
                set: function (value) {
                    if (value != this._footer) {
                        this._footer = wijmo.asString(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChartBase.prototype, "headerStyle", {
                /**
                * Gets or sets the style of the chart header.
                */
                get: function () {
                    return this._headerStyle;
                },
                set: function (value) {
                    if (value != this._headerStyle) {
                        this._headerStyle = value;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChartBase.prototype, "footerStyle", {
                /**
                * Gets or sets the style of the chart footer.
                */
                get: function () {
                    return this._footerStyle;
                },
                set: function (value) {
                    if (value != this._footerStyle) {
                        this._footerStyle = value;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChartBase.prototype, "selectionMode", {
                /**
                * Gets or sets an enumerated value indicating whether or what is
                * selected when the user clicks the chart.
                */
                get: function () {
                    return this._selectionMode;
                },
                set: function (value) {
                    if (value != this._selectionMode) {
                        this._selectionMode = wijmo.asEnum(value, chart.SelectionMode);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChartBase.prototype, "itemFormatter", {
                /**
                * Gets or sets the item formatter function that allows you to customize
                * the appearance of data points. See the Explorer sample's <a target="_blank"
                * href="http://demos.componentone.com/wijmo/5/Angular/Explorer/Explorer/#/chart/itemFormatter">
                * Item Formatter</a> for a demonstration.
                */
                get: function () {
                    return this._itemFormatter;
                },
                set: function (value) {
                    if (value != this._itemFormatter) {
                        this._itemFormatter = wijmo.asFunction(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Raises the @see:rendered event.
            *
            * @param engine The @see:IRenderEngine object used to render the chart.
            */
            FlexChartBase.prototype.onRendered = function (engine) {
                this.rendered.raise(this, new RenderEventArgs(engine));
            };

            /**
            * Raises the @see:rendering event.
            *
            * @param engine The @see:IRenderEngine object used to render the chart.
            */
            FlexChartBase.prototype.onRendering = function (engine) {
                this.rendering.raise(this, new RenderEventArgs(engine));
            };

            /**
            * Refreshes the chart.
            *
            * @param fullUpdate A value indicating whether to update the control layout as well as the content.
            */
            FlexChartBase.prototype.refresh = function (fullUpdate) {
                if (typeof fullUpdate === "undefined") { fullUpdate = true; }
                if (!this.isUpdating) {
                    this._refreshChart();
                }
            };

            //--------------------------------------------------------------------------
            // implementation
            // updates chart to sync with data source
            FlexChartBase.prototype._cvCollectionChanged = function (sender, e) {
                this._clearCachedValues();
                this._bindChart();
            };

            // updates selection to sync with data source
            FlexChartBase.prototype._cvCurrentChanged = function (sender, e) {
                if (this._notifyCurrentChanged) {
                    this._bindChart();
                }
            };

            // IPalette
            /**
            * Gets a color from the palette by index.
            *
            * @param index The index of the color in the palette.
            */
            FlexChartBase.prototype._getColor = function (index) {
                var palette = this._defPalette;
                if (this._palette != null && this._palette.length > 0) {
                    palette = this._palette;
                }
                return palette[index % palette.length];
            };

            /**
            * Gets a lighter color from the palette by index.
            *
            * @param index The index of the color in the palette.
            */
            FlexChartBase.prototype._getColorLight = function (index) {
                var color = this._getColor(index), c = new wijmo.Color(color);
                if (c != null) {
                    c.a *= 0.7;
                    color = c.toString();
                }
                return color;
            };

            // abstract
            // binds the chart to the current data source.
            FlexChartBase.prototype._bindChart = function () {
                this._needBind = true;
                this.invalidate();
            };

            FlexChartBase.prototype._clearCachedValues = function () {
            };

            FlexChartBase.prototype._render = function (engine) {
            };

            FlexChartBase.prototype._performBind = function () {
            };

            // render
            FlexChartBase.prototype._refreshChart = function () {
                if (this._needBind) {
                    this._needBind = false;
                    this._performBind();
                }
                this._render(this._currentRenderEngine);
            };

            FlexChartBase.prototype._drawTitle = function (engine, rect, title, style, isFooter) {
                var lblClass = chart.FlexChart._CSS_TITLE;
                var groupClass = isFooter ? chart.FlexChart._CSS_FOOTER : chart.FlexChart._CSS_HEADER;

                var tsz = null;
                if (isFooter) {
                    this._rectFooter = null;
                } else {
                    this._rectHeader = null;
                }

                if (title != null) {
                    var fontSize = null;
                    var fg = null;
                    var fontFamily = null;
                    var halign = null;

                    if (style) {
                        if (style.fontSize) {
                            fontSize = style.fontSize;
                        }
                        if (style.foreground) {
                            fg = style.foreground;
                        }
                        if (style.fill) {
                            fg = style.fill;
                        }
                        if (style.fontFamily) {
                            fontFamily = style.fontFamily;
                        }
                        if (style.halign) {
                            halign = style.halign;
                        }
                    }

                    engine.fontSize = fontSize;
                    engine.fontFamily = fontFamily;

                    tsz = engine.measureString(title, lblClass, groupClass);
                    rect.height -= tsz.height;

                    engine.textFill = fg;
                    if (isFooter) {
                        if (halign == 'left') {
                            chart.FlexChart._renderText(engine, title, new wijmo.Point(rect.left, rect.bottom), 0, 0, lblClass, groupClass);
                        } else if (halign == 'right') {
                            chart.FlexChart._renderText(engine, title, new wijmo.Point(rect.left + rect.width, rect.bottom), 2, 0, lblClass, groupClass);
                        } else {
                            chart.FlexChart._renderText(engine, title, new wijmo.Point(rect.left + 0.5 * rect.width, rect.bottom), 1, 0, lblClass, groupClass);
                        }

                        this._rectFooter = new wijmo.Rect(rect.left, rect.bottom, rect.width, tsz.height);
                    } else {
                        this._rectHeader = new wijmo.Rect(rect.left, rect.top, rect.width, tsz.height);

                        rect.top += tsz.height;
                        if (halign == 'left') {
                            chart.FlexChart._renderText(engine, title, new wijmo.Point(rect.left, 0), 0, 0, lblClass, groupClass);
                        } else if (halign == 'right') {
                            chart.FlexChart._renderText(engine, title, new wijmo.Point(rect.left + rect.width, 0), 2, 0, lblClass, groupClass);
                        } else {
                            chart.FlexChart._renderText(engine, title, new wijmo.Point(rect.left + 0.5 * rect.width, 0), 1, 0, lblClass, groupClass);
                        }
                    }

                    engine.textFill = null;
                    engine.fontSize = null;
                    engine.fontFamily = null;
                }
                return rect;
            };

            // convert page coordinates to control
            FlexChartBase.prototype._toControl = function (pt, y) {
                if (wijmo.isNumber(pt) && wijmo.isNumber(y)) {
                    pt = new wijmo.Point(pt, y);
                } else if (pt instanceof MouseEvent) {
                    pt = new wijmo.Point(pt.pageX, pt.pageY);
                }
                wijmo.asType(pt, wijmo.Point);

                // control coords
                var cpt = pt.clone();

                // jQuery
                // var host = $(this.hostElement);
                // var offset = host.offset();
                // cpt.x -= offset.left + parseInt(host.css('padding-left'));
                // cpt.y -= offset.top + parseInt(host.css('padding-top'));
                var offset = this._getHostOffset();
                cpt.x -= offset.x;
                cpt.y -= offset.y;

                var cstyle = this._getHostComputedStyle();
                if (cstyle) {
                    var padLeft = parseInt(cstyle.paddingLeft.replace('px', ''));
                    if (padLeft && !isNaN(padLeft)) {
                        cpt.x -= padLeft;
                    }
                    var padTop = parseInt(cstyle.paddingTop.replace('px', ''));
                    if (padTop && !isNaN(padTop)) {
                        cpt.y -= padTop;
                    }
                }

                return cpt;
            };

            FlexChartBase.prototype._highlightItems = function (items, cls, selected) {
                if (selected) {
                    for (var i = 0; i < items.length; i++) {
                        wijmo.addClass(items[i], cls);
                    }
                } else {
                    for (var i = 0; i < items.length; i++) {
                        wijmo.removeClass(items[i], cls);
                    }
                }
            };

            FlexChartBase.prototype._parseMargin = function (value) {
                var margins = {};
                if (wijmo.isNumber(value) && !isNaN(value)) {
                    margins['top'] = margins['bottom'] = margins['left'] = margins['right'] = wijmo.asNumber(value);
                } else if (wijmo.isString(value)) {
                    var s = wijmo.asString(value);
                    var ss = s.split(' ', 4);
                    var top = NaN, bottom = NaN, left = NaN, right = NaN;

                    if (ss) {
                        if (ss.length == 4) {
                            top = parseFloat(ss[0]);
                            right = parseFloat(ss[1]);
                            bottom = parseFloat(ss[2]);
                            left = parseFloat(ss[3]);
                        } else if (ss.length == 2) {
                            top = bottom = parseFloat(ss[0]);
                            left = right = parseFloat(ss[1]);
                        } else if (ss.length == 1) {
                            top = bottom = left = right = parseFloat(ss[1]);
                        }

                        if (!isNaN(top)) {
                            margins['top'] = top;
                        }
                        if (!isNaN(bottom)) {
                            margins['bottom'] = bottom;
                        }
                        if (!isNaN(left)) {
                            margins['left'] = left;
                        }
                        if (!isNaN(right)) {
                            margins['right'] = right;
                        }
                    }
                }

                return margins;
            };

            // shows an automatic tooltip
            FlexChartBase.prototype._showToolTip = function (content, rect) {
                var self = this, showDelay = this._tooltip.showDelay;
                self._clearTimeouts();
                if (showDelay > 0) {
                    self._toShow = setTimeout(function () {
                        self._tooltip.show(self.hostElement, content, rect);
                        if (self._tooltip.hideDelay > 0) {
                            self._toHide = setTimeout(function () {
                                self._tooltip.hide();
                            }, self._tooltip.hideDelay);
                        }
                    }, showDelay);
                } else {
                    self._tooltip.show(self.hostElement, content, rect);
                    if (self._tooltip.hideDelay > 0) {
                        self._toHide = setTimeout(function () {
                            self._tooltip.hide();
                        }, self._tooltip.hideDelay);
                    }
                }
            };

            // hides an automatic tooltip
            FlexChartBase.prototype._hideToolTip = function () {
                this._clearTimeouts();
                this._tooltip.hide();
            };

            // clears the timeouts used to show and hide automatic tooltips
            FlexChartBase.prototype._clearTimeouts = function () {
                if (this._toShow) {
                    clearTimeout(this._toShow);
                    this._toShow = null;
                }
                if (this._toHide) {
                    clearTimeout(this._toHide);
                    this._toHide = null;
                }
            };

            FlexChartBase.prototype._getHostOffset = function () {
                var docElem, win, offset = new wijmo.Point(), host = this.hostElement, doc = host && host.ownerDocument;

                if (!doc) {
                    return offset;
                }

                docElem = doc.documentElement;

                // Make sure it's not a disconnected DOM node
                //if (!jQuery.contains(docElem, elem)) {
                //	return box;
                //}
                var box = host.getBoundingClientRect();
                win = doc.defaultView; // getWindow(doc);
                offset.y = box.top + win.pageYOffset - docElem.clientTop;
                offset.x = box.left + win.pageXOffset - docElem.clientLeft;

                return offset;
            };

            FlexChartBase.prototype._getHostSize = function () {
                var sz = new wijmo.Size();

                var host = this.hostElement;

                var cstyle = this._getHostComputedStyle();
                var w = host.offsetWidth, h = host.offsetHeight;

                if (cstyle) {
                    var padLeft = parseFloat(cstyle.paddingLeft.replace('px', ''));
                    var padRight = parseFloat(cstyle.paddingRight.replace('px', ''));
                    var padTop = parseFloat(cstyle.paddingTop.replace('px', ''));
                    var padBottom = parseFloat(cstyle.paddingBottom.replace('px', ''));

                    if (!isNaN(padLeft)) {
                        w -= padLeft;
                    }
                    if (!isNaN(padRight)) {
                        w -= padRight;
                    }

                    if (!isNaN(padTop)) {
                        h -= padTop;
                    }

                    if (!isNaN(padBottom)) {
                        h -= padBottom;
                    }

                    sz.width = w;
                    sz.height = h;
                }

                return sz;
            };

            FlexChartBase.prototype._getHostComputedStyle = function () {
                var host = this.hostElement;
                if (host && host.ownerDocument && host.ownerDocument.defaultView) {
                    return host.ownerDocument.defaultView.getComputedStyle(this.hostElement);
                }
                return null;
            };

            FlexChartBase.prototype._find = function (elem, names) {
                var found = [];

                for (var i = 0; i < elem.childElementCount; i++) {
                    var child = elem.childNodes.item(i);
                    if (names.indexOf(child.nodeName) >= 0) {
                        found.push(child);
                    } else {
                        var items = this._find(child, names);
                        if (items.length > 0) {
                            found.push(items);
                        }
                    }
                }

                return found;
            };
            FlexChartBase._WIDTH = 300;
            FlexChartBase._HEIGHT = 200;
            FlexChartBase._SELECTION_THRESHOLD = 15;
            return FlexChartBase;
        })(wijmo.Control);
        chart.FlexChartBase = FlexChartBase;

        var _KeyWords = (function () {
            function _KeyWords() {
                this._keys = {};
                this._keys['seriesName'] = null;
                this._keys['pointIndex'] = null;
                this._keys['x'] = null;
                this._keys['y'] = null;
                this._keys['value'] = null;
                this._keys['name'] = null;
            }
            _KeyWords.prototype.replace = function (s, ht) {
                var kw = this;
                return wijmo.format(s, {}, function (data, name, fmt, val) {
                    return kw.getValue(name, ht, fmt);
                });
            };

            _KeyWords.prototype.getValue = function (key, ht, fmt) {
                if (key == 'seriesName' && ht.series) {
                    return ht.series.name;
                }
                if (key == 'pointIndex' && ht.pointIndex !== null) {
                    return ht.pointIndex.toFixed();
                }
                if (key == 'y' && ht.series) {
                    return fmt ? wijmo.Globalize.format(ht.y, fmt) : ht._yfmt;
                }
                if (key == 'x' && ht.series) {
                    return fmt ? wijmo.Globalize.format(ht.x, fmt) : ht._xfmt;
                }
                if (key == 'value') {
                    return fmt ? wijmo.Globalize.format(ht.value, fmt) : ht.value;
                }
                if (key == 'name') {
                    return ht.name;
                }

                return '';
            };
            return _KeyWords;
        })();
        chart._KeyWords = _KeyWords;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FlexChartBase.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (chart) {
        'use strict';

        /**
        * The @see:FlexPie control provides pie and doughnut charts with selectable
        * slices.
        *
        * To use the @see:FlexPie control, set the @see:itemsSource property to an
        * array containing the data and use the @see:binding and @see:bindingName
        * properties to set the properties that contain the item values and names.
        */
        var FlexPie = (function (_super) {
            __extends(FlexPie, _super);
            /**
            * Initializes a new instance of the @see:FlexPie control.
            *
            * @param element The DOM element that hosts the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options A Javascript object containing initialization data for the control.
            */
            function FlexPie(element, options) {
                _super.call(this, element, null, true); // invalidate on resize
                this._areas = [];
                this._keywords = new chart._KeyWords();
                this._startAngle = 0;
                this._innerRadius = 0;
                this._offset = 0;
                this._reversed = false;
                this._isAnimated = false;
                this._selectedItemPosition = 0 /* None */;
                this._selectedItemOffset = 0;
                this._rotationAngle = 0;
                this._center = new wijmo.Point();
                this._selectedOffset = new wijmo.Point();
                this._selectedIndex = -1;
                this._angles = [];
                this._values = [];
                this._labels = [];
                this._pels = [];
                this._sum = 0;

                // add classes to host element
                this.applyTemplate('wj-control wj-flexchart', null, null);

                this._currentRenderEngine = new chart._SvgRenderEngine(this.hostElement);
                this._legend = new chart.Legend(this);
                this._tooltip = new chart.ChartTooltip();
                this._tooltip.content = '<b>{name}</b><br/>{value}';
                this._tooltip.showDelay = 0;

                var self = this;

                // tooltips
                if (!wijmo.isTouchDevice()) {
                    this.hostElement.addEventListener('mousemove', function (evt) {
                        var tip = self._tooltip;
                        var tc = tip.content;
                        if (tc) {
                            var ht = self.hitTest(evt);
                            if (ht.distance <= tip.threshold) {
                                var content = self._getTooltipContent(ht);

                                // tip.show(self.hostElement, content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                                self._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                            } else {
                                // tip.hide();
                                self._hideToolTip();
                            }
                        }
                    });
                }

                // selection
                this.hostElement.addEventListener('click', function (evt) {
                    var showToolTip = true;

                    if (self.selectionMode != 0 /* None */) {
                        var ht = self.hitTest(evt);

                        var thershold = chart.FlexChart._SELECTION_THRESHOLD;
                        if (self.tooltip && self.tooltip.threshold)
                            thershold = self.tooltip.threshold;
                        if (ht.distance <= thershold) {
                            if (ht.pointIndex != self._selectionIndex && self.selectedItemPosition != 0 /* None */) {
                                showToolTip = false;
                            }
                            self._select(ht.pointIndex, true);
                        } else {
                            self._select(null);
                        }
                    }

                    if (showToolTip && wijmo.isTouchDevice()) {
                        var tip = self._tooltip;
                        var tc = tip.content;
                        if (tc) {
                            var ht = self.hitTest(evt);
                            if (ht.distance <= tip.threshold) {
                                var content = self._getTooltipContent(ht);

                                // tip.show(self.hostElement, content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                                self._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                            } else {
                                // tip.hide();
                                self._hideToolTip();
                            }
                        }
                    }
                });

                // apply options only after chart is fully initialized
                this.initialize(options);

                // refresh control to show current state
                this.refresh();
            }
            Object.defineProperty(FlexPie.prototype, "bindingName", {
                /**
                * Gets or sets the name of the property that contains the name of the data item.
                */
                get: function () {
                    return this._bindingName;
                },
                set: function (value) {
                    if (value != this._bindingName) {
                        this._bindingName = wijmo.asString(value, true);
                        this._bindChart();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexPie.prototype, "startAngle", {
                ///**
                // * Gets or sets various chart options.
                // *
                // * The following options are supported: innerRadius, startAngle, reversed, offset.
                // *
                // */
                //get options(): any {
                //    return this._options;
                //}
                //set options(value: any) {
                //    if (value != this._options) {
                //        this._options = value;
                //        this.invalidate();
                //    }
                //}
                /**
                * Gets or sets the starting angle for the pie slices, in degrees.
                *
                * Angles are measured clockwise, starting at the 9 o'clock position.
                */
                get: function () {
                    return this._startAngle;
                },
                set: function (value) {
                    if (value != this._startAngle) {
                        this._startAngle = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexPie.prototype, "offset", {
                /**
                * Gets or sets the offset of the slices from the pie center.
                *
                * The offset is measured as a fraction of the pie radius.
                */
                get: function () {
                    return this._offset;
                },
                set: function (value) {
                    if (value != this._offset) {
                        this._offset = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexPie.prototype, "innerRadius", {
                /**
                * Gets or sets the size of the pie's inner radius.
                *
                * The inner radius is measured as a fraction of the pie radius.
                *
                * The default value for this property is zero, which creates
                * a pie. Setting this property to values greater than zero
                * creates pies with a hole in the middle, also known as
                * doughnut charts.
                */
                get: function () {
                    return this._innerRadius;
                },
                set: function (value) {
                    if (value != this._innerRadius) {
                        this._innerRadius = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexPie.prototype, "reversed", {
                /**
                * Gets or sets whether angles are reversed (counter-clockwise).
                *
                * The default value is false, which causes angles to be measured in
                * the clockwise direction.
                */
                get: function () {
                    return this._reversed;
                },
                set: function (value) {
                    if (value != this._reversed) {
                        this._reversed = wijmo.asBoolean(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexPie.prototype, "selectedItemPosition", {
                /**
                * Gets or sets the position of the selected slice.
                *
                * Setting this property to a value other than 'None' causes
                * the pie to rotate when an item is selected.
                *
                * Note that in order to select slices by clicking the chart,
                * you must set the @see:selectionMode property to "Point".
                */
                get: function () {
                    return this._selectedItemPosition;
                },
                set: function (value) {
                    if (value != this._selectedItemPosition) {
                        this._selectedItemPosition = wijmo.asEnum(value, wijmo.chart.Position, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexPie.prototype, "selectedItemOffset", {
                /**
                * Gets or sets the offset of the selected slice from the pie center.
                *
                * Offsets are measured as a fraction of the pie radius.
                */
                get: function () {
                    return this._selectedItemOffset;
                },
                set: function (value) {
                    if (value != this._selectedItemOffset) {
                        this._selectedItemOffset = wijmo.asNumber(value, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexPie.prototype, "isAnimated", {
                /**
                * Gets or sets a value indicating whether to use animation when items are selected.
                *
                * See also the @see:selectedItemPosition and @see:selectionMode
                * properties.
                */
                get: function () {
                    return this._isAnimated;
                },
                set: function (value) {
                    if (value != this._isAnimated) {
                        this._isAnimated = value;
                        //this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexPie.prototype, "tooltip", {
                /**
                * Gets the chart's @see:Tooltip.
                */
                get: function () {
                    return this._tooltip;
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Gets a @see:HitTestInfo object with information about the specified point.
            *
            * @param pt The point to investigate, in window coordinates.
            * @param y The Y coordinate of the point (if the first parameter is a number).
            * @return A HitTestInfo object containing information about the point.
            */
            FlexPie.prototype.hitTest = function (pt, y) {
                // control coords
                var cpt = this._toControl(pt, y);
                var hti = new chart.HitTestInfo(this, cpt);
                var si = null;
                if (chart.FlexChart._contains(this._rectHeader, cpt)) {
                    hti._chartElement = 5 /* Header */;
                } else if (chart.FlexChart._contains(this._rectFooter, cpt)) {
                    hti._chartElement = 6 /* Footer */;
                } else if (chart.FlexChart._contains(this._rectLegend, cpt)) {
                    hti._chartElement = 4 /* Legend */;
                    si = this.legend._hitTest(cpt);
                    //if (si !== null && si >= 0 && si < this.series.length) {
                    //    hti._series = this.series[si];
                    //}
                } else if (chart.FlexChart._contains(this._rectChart, cpt)) {
                    var len = this._areas.length;
                    var pt1 = cpt.clone();
                    if (this._rotationAngle != 0) {
                        var dx = -this._center.x + pt1.x;
                        var dy = -this._center.y + pt1.y;
                        var r = Math.sqrt(dx * dx + dy * dy);
                        var a = Math.atan2(dy, dx) - this._rotationAngle * Math.PI / 180;
                        pt1.x = this._center.x + r * Math.cos(a);
                        pt1.y = this._center.y + r * Math.sin(a);
                    }

                    for (var i = 0; i < len; i++) {
                        var area = this._areas[i];
                        if (i == this._selectedIndex) {
                            pt1.x -= this._selectedOffset.x;
                            pt1.y -= this._selectedOffset.y;
                        }
                        if (area.contains(pt1)) {
                            hti._pointIndex = area.tag;
                            hti._dist = 0;
                            break;
                        }
                    }
                    hti._chartElement = 3 /* ChartArea */;
                } else {
                    hti._chartElement = 9 /* None */;
                }
                return hti;
            };

            // binds the chart to the current data source.
            FlexPie.prototype._performBind = function () {
                this._sum = 0;
                this._values = [];
                this._labels = [];

                if (this._cv) {
                    this._selectionIndex = this._cv.currentPosition;
                    var items = this._cv.items;
                    if (items) {
                        var len = items.length;
                        for (var i = 0; i < len; i++) {
                            var item = items[i];
                            if (this.binding) {
                                item = item[this.binding];
                            }

                            var val = 0;

                            if (wijmo.isNumber(item) && !isNaN(val) && isFinite(val)) {
                                val = wijmo.asNumber(item);
                            } else {
                                if (item) {
                                    val = parseFloat(item.toString());
                                }
                            }

                            if (!isNaN(val) && isFinite(val)) {
                                this._sum += val;
                                this._values.push(val);
                            } else {
                                val = 0;
                                this._values.push(val);
                            }

                            if (this.bindingName && items[i]) {
                                var name = items[i][this.bindingName];
                                if (name) {
                                    name = name.toString();
                                }
                                this._labels.push(name);
                            } else {
                                this._labels.push(val.toString());
                            }
                        }
                    }
                }
            };

            FlexPie.prototype._render = function (engine) {
                // cancelAnimationFrame(this._selectionAnimationID);
                if (this._selectionAnimationID) {
                    clearInterval(this._selectionAnimationID);
                }

                var el = this.hostElement;

                //  jQuery
                // var w = $(el).width();//el.clientWidth - el.clientLeft;
                // var h = $(el).height(); //el.clientHeight - el.clientTop;
                var sz = this._getHostSize();
                var w = sz.width, h = sz.height;

                if (w == 0 || isNaN(w)) {
                    w = chart.FlexChart._WIDTH;
                }
                if (h == 0 || isNaN(h)) {
                    h = chart.FlexChart._HEIGHT;
                }
                var hostSz = new wijmo.Size(w, h);
                engine.beginRender();

                if (w > 0 && h > 0) {
                    engine.setViewportSize(w, h);
                    this._areas = [];

                    var legend = this.legend;
                    var lsz;
                    var tsz;
                    var lpos;
                    var rect = new wijmo.Rect(0, 0, w, h);

                    this._rectChart = rect.clone();

                    engine.startGroup(chart.FlexChart._CSS_HEADER);
                    rect = this._drawTitle(engine, rect, this.header, this.headerStyle, false);
                    engine.endGroup();

                    engine.startGroup(chart.FlexChart._CSS_FOOTER);
                    rect = this._drawTitle(engine, rect, this.footer, this.footerStyle, true);
                    engine.endGroup();

                    w = rect.width;
                    h = rect.height;

                    //if (w > h) {
                    //    rect.width = h;
                    //    rect.left += 0.5 * (w - h);
                    //    w = h;
                    //} else if (w < h) {
                    //    rect.height = w;
                    //    rect.top += 0.5 * (h - w);
                    //    h = w;
                    //}
                    lsz = legend._getDesiredSize(engine);
                    switch (legend.position) {
                        case 3 /* Right */:
                            w -= lsz.width;
                            lpos = new wijmo.Point(w, rect.top + 0.5 * (h - lsz.height));
                            break;
                        case 1 /* Left */:
                            rect.left += lsz.width;
                            w -= lsz.width;
                            lpos = new wijmo.Point(0, rect.top + 0.5 * (h - lsz.height));
                            break;
                        case 2 /* Top */:
                            h -= lsz.height;
                            lpos = new wijmo.Point(0.5 * (w - lsz.width), rect.top);
                            rect.top += lsz.height;
                            break;
                        case 4 /* Bottom */:
                            h -= lsz.height;
                            lpos = new wijmo.Point(0.5 * (w - lsz.width), rect.top + h);
                            break;
                    }

                    rect.width = w;
                    rect.height = h;

                    //
                    //engine.startGroup(FlexChart._CSS_PLOT_AREA);
                    //var prect = this._plotRect;
                    //engine.fill = 'transparent';
                    //engine.stroke = null;
                    //engine.drawRect(prect.left, prect.top, prect.width, prect.height);
                    ///engine.endGroup();
                    this.onRendering(engine);

                    this._pieGroup = engine.startGroup(null, null, true); // all series

                    var margins = this._parseMargin(this.plotMargin);

                    if (isNaN(margins.left)) {
                        margins.left = FlexPie._MARGIN;
                    }
                    if (isNaN(margins.right)) {
                        margins.right = FlexPie._MARGIN;
                    }
                    if (isNaN(margins.top)) {
                        margins.top = FlexPie._MARGIN;
                    }
                    if (isNaN(margins.bottom)) {
                        margins.bottom = FlexPie._MARGIN;
                    }

                    rect.top += margins.top;
                    rect.height -= margins.top + margins.bottom;
                    rect.left += margins.left;
                    rect.width -= margins.left + margins.right;

                    this._renderData(engine, rect, this._pieGroup);

                    engine.endGroup();

                    if (lsz) {
                        this._legendHost = engine.startGroup(chart.FlexChart._CSS_LEGEND);
                        this._rectLegend = new wijmo.Rect(lpos.x, lpos.y, lsz.width, lsz.height);
                        this.legend._render(engine, lpos);
                        engine.endGroup();
                    } else {
                        this._legendHost = null;
                        this._rectLegend = null;
                    }

                    this._rotationAngle = 0;
                    this._highlightCurrent();

                    this.onRendered(engine);
                }

                engine.endRender();
            };

            FlexPie.prototype._renderData = function (engine, rect, g) {
                var _this = this;
                this._pels = [];
                this._angles = [];

                //engine.strokeWidth = 2;
                var len = this._values.length;
                var sum = this._sum;

                var startAngle = this.startAngle + 180, reversed = this.reversed == true, innerRadius = this.innerRadius, offset = this.offset, offsets = null;

                /*if (options) {
                if (isNumber(options.startAngle)) {
                startingAngle = asNumber(options.startAngle);
                }
                
                if (options.reversed) {
                reversed = true;
                }
                
                if (isNumber(options.innerRadius)) {
                innerRadius = asNumber(options.innerRadius);
                }
                
                if (isNumber(options.offset)) {
                offset = asNumber(options.offset);
                } else if (isArray(options.offset)) {
                offsets = options.offset;
                for (var i = 0; i < offsets.length; i++) {
                if(isNumber(offsets[i])) {
                var o = asNumber(offsets[i]);
                if (o > offset) {
                offset = o;
                }
                }
                }
                }
                }*/
                if (sum > 0) {
                    var angle = startAngle * Math.PI / 180, cx0 = rect.left + 0.5 * rect.width, cy0 = rect.top + 0.5 * rect.height, r = Math.min(0.5 * rect.width, 0.5 * rect.height);

                    this._center.x = cx0;
                    this._center.y = cy0;

                    var maxoff = Math.max(offset, this.selectedItemOffset);
                    if (maxoff > 0) {
                        r = r / (1 + maxoff);
                        offset = offset * r;
                    }
                    this._radius = r;
                    var irad = innerRadius * r;

                    var selectedAngle = 0;

                    for (var i = 0; i < len; i++) {
                        var cx = cx0;
                        var cy = cy0;

                        engine.fill = this._getColorLight(i);
                        engine.stroke = this._getColor(i);

                        var val = this._values[i];
                        var sweep = Math.abs(val - sum) < 1E-10 ? 2 * Math.PI : 2 * Math.PI * val / sum;
                        var pel = engine.startGroup();

                        var currentOffset = offset;

                        var currentAngle = reversed ? angle - 0.5 * sweep : angle + 0.5 * sweep;
                        if (i == this._cv.currentPosition) {
                            selectedAngle = currentAngle;
                        }
                        this._angles.push(currentAngle);

                        if (offsets && i < offsets.length) {
                            currentOffset = offsets[i];
                        }

                        if (currentOffset > 0) {
                            var a = angle + 0.5 * sweep;
                            if (reversed) {
                                a = -a;
                            }
                            cx += offset * Math.cos(currentAngle);
                            cy += offset * Math.sin(currentAngle);
                        }

                        if (sweep >= 2 * Math.PI) {
                            cx = cx0;
                            cy = cy0;
                        }

                        if (this.itemFormatter) {
                            var hti = new chart.HitTestInfo(this, new wijmo.Point(cx + r * Math.cos(currentAngle), cy + r * Math.sin(currentAngle)));
                            hti._chartElement = 8 /* SeriesSymbol */;
                            hti._pointIndex = i;

                            this.itemFormatter(engine, hti, function () {
                                _this._drawSilce(engine, i, reversed, cx, cy, r, irad, angle, sweep);
                            });
                        } else {
                            this._drawSilce(engine, i, reversed, cx, cy, r, irad, angle, sweep);
                        }

                        if (reversed) {
                            angle -= sweep;
                        } else {
                            angle += sweep;
                        }

                        engine.endGroup();
                        this._pels.push(pel);
                    }

                    this._highlightCurrent();
                }
            };

            FlexPie.prototype._drawSilce = function (engine, i, reversed, cx, cy, r, irad, angle, sweep) {
                var area;
                if (reversed) {
                    if (irad > 0) {
                        if (sweep != 0) {
                            engine.drawDonutSegment(cx, cy, r, irad, angle - sweep, sweep);
                        }

                        area = new _DonutSegment(new wijmo.Point(cx, cy), r, irad, angle - sweep, sweep);
                        area.tag = i;
                        this._areas.push(area);
                    } else {
                        if (sweep != 0) {
                            engine.drawPieSegment(cx, cy, r, angle - sweep, sweep);
                        }

                        area = new _PieSegment(new wijmo.Point(cx, cy), r, angle - sweep, sweep);
                        area.tag = i;
                        this._areas.push(area);
                    }
                } else {
                    if (irad > 0) {
                        if (sweep != 0) {
                            engine.drawDonutSegment(cx, cy, r, irad, angle, sweep);
                        }

                        area = new _DonutSegment(new wijmo.Point(cx, cy), r, irad, angle, sweep);
                        area.tag = i;
                        this._areas.push(area);
                    } else {
                        if (sweep != 0) {
                            engine.drawPieSegment(cx, cy, r, angle, sweep);
                        }

                        area = new _PieSegment(new wijmo.Point(cx, cy), r, angle, sweep);
                        area.tag = i;
                        this._areas.push(area);
                    }
                    angle += sweep;
                }
            };

            FlexPie.prototype._measureLegendItem = function (engine, name) {
                var sz = new wijmo.Size();
                sz.width = chart.Series._LEGEND_ITEM_WIDTH;
                sz.height = chart.Series._LEGEND_ITEM_HEIGHT;
                if (name) {
                    var tsz = engine.measureString(name, chart.FlexChart._CSS_LABEL);
                    sz.width += tsz.width;
                    if (sz.height < tsz.height) {
                        sz.height = tsz.height;
                    }
                }
                ;
                sz.width += 3 * chart.Series._LEGEND_ITEM_MARGIN;
                sz.height += 2 * chart.Series._LEGEND_ITEM_MARGIN;
                return sz;
            };

            FlexPie.prototype._drawLegendItem = function (engine, rect, i, name) {
                engine.strokeWidth = 1;

                var marg = chart.Series._LEGEND_ITEM_MARGIN;

                var fill = null;
                var stroke = null;

                if (fill === null)
                    fill = this._getColorLight(i);
                if (stroke === null)
                    stroke = this._getColor(i);

                engine.fill = fill;
                engine.stroke = stroke;

                var yc = rect.top + 0.5 * rect.height;

                var wsym = chart.Series._LEGEND_ITEM_WIDTH;
                var hsym = chart.Series._LEGEND_ITEM_HEIGHT;
                engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null); //, this.style);

                if (name) {
                    chart.FlexChart._renderText(engine, name, new wijmo.Point(rect.left + hsym + 2 * marg, yc), 0, 1, chart.FlexChart._CSS_LABEL);
                }
            };

            //---------------------------------------------------------------------
            // tooltips
            FlexPie.prototype._getTooltipContent = function (ht) {
                var tc = this._tooltip.content;
                if (wijmo.isString(tc)) {
                    return this._keywords.replace(tc, ht);
                } else if (wijmo.isFunction(tc)) {
                    return tc(ht);
                }

                return null;
            };

            //---------------------------------------------------------------------
            // selection
            FlexPie.prototype._select = function (pointIndex, animate) {
                if (typeof animate === "undefined") { animate = false; }
                this._highlight(false, this._selectionIndex);
                this._selectionIndex = pointIndex;
                this._highlight(true, this._selectionIndex, animate);

                if (this.selectionMode == 2 /* Point */) {
                    var cv = this._cv;
                    if (cv) {
                        this._notifyCurrentChanged = false;
                        cv.moveCurrentToPosition(pointIndex);
                        this._notifyCurrentChanged = true;
                    }
                }
            };

            FlexPie.prototype._highlightCurrent = function () {
                if (this.selectionMode != 0 /* None */) {
                    var pointIndex = -1;
                    var cv = this._cv;

                    if (cv) {
                        pointIndex = cv.currentPosition;
                    }

                    this._highlight(true, pointIndex);
                }
            };

            FlexPie.prototype._highlight = function (selected, pointIndex, animate) {
                if (typeof animate === "undefined") { animate = false; }
                if (this.selectionMode == 2 /* Point */ && pointIndex !== undefined && pointIndex !== null) {
                    var gs = this._pels[pointIndex];

                    // var hs = $(gs);
                    if (selected) {
                        gs.parentNode.appendChild(gs);

                        //this._highlightItems(hs.find('path'), FlexChart._CSS_SELECTION, selected);
                        //var ells = hs.find('ellipse');
                        // this._highlightItems(ells, FlexChart._CSS_SELECTION, selected);
                        var ells = this._find(gs, ['ellipse']);
                        this._highlightItems(this._find(gs, ['path', 'ellipse']), chart.FlexChart._CSS_SELECTION, selected);

                        var selectedAngle = this._angles[pointIndex];
                        if (this.selectedItemPosition != 0 /* None */ && selectedAngle != 0) {
                            var angle = 0;
                            if (this.selectedItemPosition == 1 /* Left */) {
                                angle = 180;
                            } else if (this.selectedItemPosition == 2 /* Top */) {
                                angle = -90;
                            } else if (this.selectedItemPosition == 4 /* Bottom */) {
                                angle = 90;
                            }

                            var targetAngle = angle * Math.PI / 180 - selectedAngle;

                            //this._rotationAngle = targetAngle;
                            targetAngle *= 180 / Math.PI;

                            if (animate && this.isAnimated) {
                                this._animateSelectionAngle(targetAngle, 0.5);
                            } else {
                                this._rotationAngle = targetAngle;
                                this._pieGroup.transform.baseVal.getItem(0).setRotate(targetAngle, this._center.x, this._center.y);
                            }
                        }

                        var off = this.selectedItemOffset;
                        if (off > 0 && ells.length == 0) {
                            var x = this._selectedOffset.x = Math.cos(selectedAngle) * off * this._radius;
                            var y = this._selectedOffset.y = Math.sin(selectedAngle) * off * this._radius;

                            //hs.attr('transform', 'translate(' + x.toFixed() + ',' + y.toFixed() + ')');
                            gs.setAttribute('transform', 'translate(' + x.toFixed() + ',' + y.toFixed() + ')');
                        }
                        this._selectedIndex = pointIndex;
                    } else {
                        gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(pointIndex));

                        // jQuery
                        // hs.attr('transform', null);
                        // this._highlightItems(hs.find('path'), FlexChart._CSS_SELECTION, selected);
                        // this._highlightItems(hs.find('ellipse'), FlexChart._CSS_SELECTION, selected);
                        gs.removeAttribute('transform');
                        this._highlightItems(this._find(gs, ['path', 'ellipse']), chart.FlexChart._CSS_SELECTION, selected);

                        if (this._selectedIndex == pointIndex) {
                            this._selectedIndex = -1;
                        }
                    }
                }
            };

            FlexPie.prototype._animateSelectionAngle = function (target, duration) {
                var source = _Math.clampAngle(this._rotationAngle);
                target = _Math.clampAngle(target);

                /*var delta = (target - source) / (60 * duration);
                this._selectionAnimationID = requestAnimationFrame(doAnim);
                var self = this;
                
                function doAnim() {
                
                source += delta;
                
                if ( Math.abs(target-source) < Math.abs(delta)) {
                self._rotationAngle = source = target;
                }
                
                self._pieGroup.transform.baseVal.getItem(0).setRotate(source, self._center.x, self._center.y);
                
                if (target == source) {
                cancelAnimationFrame(self._selectionAnimationID);
                } else {
                self._selectionAnimationID = requestAnimationFrame(doAnim);
                }
                }*/
                var delta = (target - source);
                var self = this;
                var start = source;
                var group = self._pieGroup;

                if (self._selectionAnimationID) {
                    clearInterval(this._selectionAnimationID);
                }

                this._selectionAnimationID = wijmo.animate(function (pct) {
                    if (group == self._pieGroup) {
                        self._rotationAngle = source = start + delta * pct;
                        self._pieGroup.transform.baseVal.getItem(0).setRotate(source, self._center.x, self._center.y);
                        if (pct == 1) {
                            clearInterval(self._selectionAnimationID);
                        }
                    }
                }, duration * 1000);
            };
            FlexPie._MARGIN = 4;
            return FlexPie;
        })(chart.FlexChartBase);
        chart.FlexPie = FlexPie;

        var _Math = (function () {
            function _Math() {
            }
            // degrees [-180, +180]
            _Math.clampAngle = function (angle) {
                var a = (angle + 180) % 360 - 180;
                if (a < -180) {
                    a += 360;
                }
                return a;
            };
            return _Math;
        })();

        var _PieSegment = (function () {
            function _PieSegment(center, radius, angle, sweep) {
                this._isFull = false;
                this._center = center;
                this._radius = radius;
                if (sweep >= 2 * Math.PI) {
                    this._isFull = true;
                }
                this._sweep = 0.5 * sweep * 180 / Math.PI;
                this._angle = _Math.clampAngle(angle * 180 / Math.PI + this._sweep);
                this._radius2 = radius * radius;
            }
            _PieSegment.prototype.contains = function (pt) {
                var dx = pt.x - this._center.x;
                var dy = pt.y - this._center.y;
                var r2 = dx * dx + dy * dy;

                if (r2 <= this._radius2) {
                    var a = Math.atan2(dy, dx) * 180 / Math.PI;
                    var delta = _Math.clampAngle(this._angle - a);
                    if (this._isFull || Math.abs(delta) <= this._sweep) {
                        return true;
                    }
                }
                return false;
            };

            _PieSegment.prototype.distance = function (pt) {
                if (this.contains(pt)) {
                    return 0;
                }

                return undefined;
            };
            return _PieSegment;
        })();

        var _DonutSegment = (function () {
            function _DonutSegment(center, radius, innerRadius, angle, sweep) {
                this._isFull = false;
                this._center = center;
                this._radius = radius;
                this._iradius = innerRadius;
                if (sweep >= 2 * Math.PI) {
                    this._isFull = true;
                }
                this._sweep = 0.5 * sweep * 180 / Math.PI;
                this._angle = _Math.clampAngle(angle * 180 / Math.PI + this._sweep);
                this._radius2 = radius * radius;
                this._iradius2 = innerRadius * innerRadius;
            }
            _DonutSegment.prototype.contains = function (pt) {
                var dx = pt.x - this._center.x;
                var dy = pt.y - this._center.y;
                var r2 = dx * dx + dy * dy;

                if (r2 >= this._iradius2 && r2 <= this._radius2) {
                    var a = Math.atan2(dy, dx) * 180 / Math.PI;
                    var delta = _Math.clampAngle(this._angle - a);
                    if (this._isFull || Math.abs(delta) <= this._sweep) {
                        return true;
                    }
                }
                return false;
            };

            _DonutSegment.prototype.distance = function (pt) {
                if (this.contains(pt)) {
                    return 0;
                }

                return undefined;
            };
            return _DonutSegment;
        })();
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FlexPie.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    /**
    * Defines the @see:FlexChart control and its associated classes.
    *
    * The example below creates a @see:FlexChart control and binds it to a data array.
    * The chart has three series, each corresponding to a property in the objects
    * contained in the source array. The last series in the example uses the
    * <a href="http://wijmo.com/5/docs/topic/wijmo.chart.ChartType.Enum.html"
    * target="_blank">chartType property</a> to override the default chart type used
    * by the other series.
    *
    * @fiddle:6GB66
    */
    (function (_chart) {
        'use strict';

        /**
        * Specifies the chart type.
        */
        (function (ChartType) {
            /** Column charts show vertical bars and allow you to compare values of items across categories. */
            ChartType[ChartType["Column"] = 0] = "Column";

            /** Bar charts show horizontal bars. */
            ChartType[ChartType["Bar"] = 1] = "Bar";

            /** Scatter charts use X and Y coordinates to show patterns within the data. */
            ChartType[ChartType["Scatter"] = 2] = "Scatter";

            /** Line charts show trends over a period of time or across categories. */
            ChartType[ChartType["Line"] = 3] = "Line";

            /** Line and symbol charts are line charts with a symbol on each data point. */
            ChartType[ChartType["LineSymbols"] = 4] = "LineSymbols";

            /** Area charts are line charts with the area below the line filled with color. */
            ChartType[ChartType["Area"] = 5] = "Area";

            /** Bubble charts are Scatter charts with a
            * third data value that determines the size of the symbol. */
            ChartType[ChartType["Bubble"] = 6] = "Bubble";

            /** Candlestick charts present items with high, low, open, and close values.
            * The size of the wick line is determined by the High and Low values, while the size of the bar is
            * determined by the Open and Close values. The bar is displayed using different colors, depending on
            * whether the close value is higher or lower than the open value. */
            ChartType[ChartType["Candlestick"] = 7] = "Candlestick";

            /** High-low-open-close charts display the same information as a candlestick chart, except that opening
            * values are displayed using lines to the left, while lines to the right indicate closing values.  */
            ChartType[ChartType["HighLowOpenClose"] = 8] = "HighLowOpenClose";

            /** Spline charts are line charts that plot curves rather than angled lines through the data points. */
            ChartType[ChartType["Spline"] = 9] = "Spline";

            /** Spline and symbol charts are spline charts with symbols on each data point. */
            ChartType[ChartType["SplineSymbols"] = 10] = "SplineSymbols";

            /** Spline area charts are spline charts with the area below the line filled with color. */
            ChartType[ChartType["SplineArea"] = 11] = "SplineArea";
        })(_chart.ChartType || (_chart.ChartType = {}));
        var ChartType = _chart.ChartType;

        /**
        * Specifies whether and how to stack the chart's data values.
        */
        (function (Stacking) {
            /** No stacking. Each series object is plotted independently. */
            Stacking[Stacking["None"] = 0] = "None";

            /** Stacked charts show how each value contributes to the total. */
            Stacking[Stacking["Stacked"] = 1] = "Stacked";

            /** 100% stacked charts show how each value contributes to the total with the relative size of
            * each series representing its contribution to the total. */
            Stacking[Stacking["Stacked100pc"] = 2] = "Stacked100pc";
        })(_chart.Stacking || (_chart.Stacking = {}));
        var Stacking = _chart.Stacking;

        /**
        * Specifies what is selected when the user clicks the chart.
        */
        (function (SelectionMode) {
            /** Select neither series nor data points when the user clicks the chart. */
            SelectionMode[SelectionMode["None"] = 0] = "None";

            /** Select the whole @see:Series when the user clicks it on the chart. */
            SelectionMode[SelectionMode["Series"] = 1] = "Series";

            /** Select the data point when the user clicks it on the chart. Since Line, Area, Spline,
            * and SplineArea charts do not render individual data points, nothing is selected with this
            * setting on those chart types. */
            SelectionMode[SelectionMode["Point"] = 2] = "Point";
        })(_chart.SelectionMode || (_chart.SelectionMode = {}));
        var SelectionMode = _chart.SelectionMode;
        ;

        /**
        * The @see:FlexChart control provides a powerful and flexible way to visualize
        * data.
        *
        * You can use the @see:FlexChart control to create charts that display data in
        * several formats, including bar, line, symbol, bubble, and others.
        *
        * To use the @see:FlexChart control, set the @see:itemsSource property to an
        * array containing the data, then add one or more @see:Series objects
        * to the @see:series property.
        *
        * Use the @see:chartType property to define the @see:ChartType used for all series.
        * You may override the chart type for each series by setting the @see:chartType
        * property on each @see:Series object.
        */
        var FlexChart = (function (_super) {
            __extends(FlexChart, _super);
            /**
            * Initializes a new instance of the @see:FlexChart control.
            *
            * @param element The DOM element that will host the control, or a selector for the host element (e.g. '#theCtrl').
            * @param options A JavaScript object containing initialization data for the control.
            */
            function FlexChart(element, options) {
                _super.call(this, element, null, true); // invalidate on resize
                // property storage
                this._series = new wijmo.collections.ObservableArray();
                this._axes = new _chart.AxisCollection();
                this._axisX = new _chart.Axis(4 /* Bottom */);
                this._axisY = new _chart.Axis(1 /* Left */);
                this._chartType = 0 /* Column */;
                this._interpolateNulls = false;
                this._legendToggle = false;
                this._symbolSize = 10;
                this._dataInfo = new _DataInfo();
                this.__barPlotter = null;
                this.__linePlotter = null;
                this.__areaPlotter = null;
                this.__bubblePlotter = null;
                this.__financePlotter = null;
                this._rotated = false;
                this._stacking = 0 /* None */;
                this._xlabels = [];
                this._xvals = [];
                this._hitTester = new HitTester();
                /**
                * Occurs after the selection changes, whether programmatically
                * or when the user clicks the chart. This is useful, for example,
                * when you want to update details in a textbox showing the current
                * selection.
                */
                this.selectionChanged = new wijmo.Event();
                /**
                * Occurs when the series visibility changes, for example when the legendToggle
                * property is set to true and the user clicks the legend.
                */
                this.seriesVisibilityChanged = new wijmo.Event();

                // add classes to host element
                this.applyTemplate('wj-control wj-flexchart', null, null);

                // handle changes to chartSeries array
                var self = this;
                self._series.collectionChanged.addHandler(function () {
                    // check that chartSeries array contains Series objects
                    var arr = self._series;
                    for (var i = 0; i < arr.length; i++) {
                        var cs = wijmo.tryCast(arr[i], wijmo.chart.Series);
                        if (!cs) {
                            throw 'chartSeries array must contain Series objects.';
                        }
                        cs._chart = self;
                        if (cs.axisX) {
                            cs.axiX._chart = self;
                        }
                        if (cs.axisY) {
                            cs.axisY._chart = self;
                        }
                    }

                    // refresh chart to show the change
                    self.refresh();
                });

                this._currentRenderEngine = new _chart._SvgRenderEngine(this.hostElement);
                this._legend = new _chart.Legend(this);
                this._tooltip = new ChartTooltip();
                this._tooltip.showDelay = 0;

                var ax = this._axisX;
                var ay = this._axisY;

                // default style
                this._axisX.majorGrid = false;
                this._axisX.name = 'axisX';
                this._axisY.majorGrid = true;
                this._axisY.majorTickMarks = 0 /* None */;
                this._axisY.name = 'axisY';

                ax._chart = this;
                ay._chart = this;

                this._axes.push(ax);
                this._axes.push(ay);

                self._axes.collectionChanged.addHandler(function () {
                    var arr = self._axes;
                    for (var i = 0; i < arr.length; i++) {
                        var axis = wijmo.tryCast(arr[i], wijmo.chart.Axis);
                        if (!axis) {
                            throw 'axes array must contain Axis objects.';
                        }
                        axis._chart = self;
                    }

                    // refresh chart to show the change
                    self.refresh();
                });

                this._keywords = new _chart._KeyWords();

                if (wijmo.isTouchDevice()) {
                    this.hostElement.addEventListener('click', function (evt) {
                        var tip = self._tooltip;
                        var tc = tip.content;
                        if (tc) {
                            var ht = self.hitTest(evt);
                            if (ht.distance <= tip.threshold) {
                                var content = self._getTooltipContent(ht);

                                //tip.show(self.hostElement, content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                                self._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                            } else {
                                //tip.hide();
                                self._hideToolTip();
                            }
                        }
                    });
                } else {
                    this.hostElement.addEventListener('mousemove', function (evt) {
                        var tip = self._tooltip;
                        var tc = tip.content;
                        if (tc) {
                            var ht = self.hitTest(evt);
                            if (ht.distance <= tip.threshold) {
                                var content = self._getTooltipContent(ht);

                                //tip.show(self.hostElement, content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                                self._showToolTip(content, new wijmo.Rect(evt.clientX, evt.clientY, 5, 5));
                            } else {
                                //tip.hide();
                                self._hideToolTip();
                            }
                        }
                    });
                }

                this.hostElement.addEventListener('click', function (evt) {
                    if (self.selectionMode != 0 /* None */) {
                        var ht = self._hitTestData(evt);

                        var thershold = FlexChart._SELECTION_THRESHOLD;
                        if (self.tooltip && self.tooltip.threshold)
                            thershold = self.tooltip.threshold;
                        if (ht.distance <= thershold && ht.series) {
                            self._select(ht.series, ht.pointIndex);
                        } else {
                            if (self.selectionMode == 1 /* Series */) {
                                ht = self.hitTest(evt);
                                if (ht.chartElement == 4 /* Legend */ && ht.series) {
                                    self._select(ht.series, null);
                                } else {
                                    self._select(null, null);
                                }
                            } else {
                                self._select(null, null);
                            }
                        }
                    }

                    if (self.legendToggle === true) {
                        ht = self.hitTest(evt);
                        if (ht.chartElement == 4 /* Legend */ && ht.series) {
                            if (ht.series.visibility == 2 /* Legend */) {
                                ht.series.visibility = 0 /* Visible */;
                            } else if (ht.series.visibility == 0 /* Visible */) {
                                ht.series.visibility = 2 /* Legend */;
                            }
                        }
                    }
                });

                // apply options only after chart is fully initialized
                this.initialize(options);
            }
            Object.defineProperty(FlexChart.prototype, "series", {
                //--------------------------------------------------------------------------
                // ** object model
                /**
                * Gets the collection of @see:Series objects.
                */
                get: function () {
                    return this._series;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "axes", {
                /**
                * Gets the collection of @see:Axis objects.
                */
                get: function () {
                    return this._axes;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "chartType", {
                /**
                * Gets or sets the type of chart to create.
                */
                get: function () {
                    return this._chartType;
                },
                set: function (value) {
                    if (value != this._chartType) {
                        this._chartType = wijmo.asEnum(value, ChartType);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "axisX", {
                /**
                * Gets the main X axis.
                */
                get: function () {
                    return this._axisX;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "axisY", {
                /**
                * Gets the main Y axis.
                */
                get: function () {
                    return this._axisY;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "bindingX", {
                /**
                * Gets or sets the name of the property that contains the X data values.
                */
                get: function () {
                    return this._bindingX;
                },
                set: function (value) {
                    if (value != this._bindingX) {
                        this._bindingX = wijmo.asString(value, true);
                        this._bindChart();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "stacking", {
                /**
                * Gets or sets whether and how series objects are stacked.
                */
                get: function () {
                    return this._stacking;
                },
                set: function (value) {
                    if (value != this._stacking) {
                        this._stacking = wijmo.asEnum(value, Stacking);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "symbolSize", {
                /**
                * Gets or sets the size of the symbols used for all Series objects in this @see:FlexChart.
                *
                * This property may be overridden by the symbolSize property on each @see:Series object.
                */
                get: function () {
                    return this._symbolSize;
                },
                set: function (value) {
                    if (value != this._symbolSize) {
                        this._symbolSize = wijmo.asNumber(value, false, true);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "interpolateNulls", {
                /**
                * Gets or sets whether to interpolate null values in the data.
                *
                * If true, the chart interpolates the value of any missing data
                * based on neighboring points. If false, it leaves a break in
                * lines and areas at the points with null values.
                */
                get: function () {
                    return this._interpolateNulls;
                },
                set: function (value) {
                    if (value != this._interpolateNulls) {
                        this._interpolateNulls = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "legendToggle", {
                /**
                * Gets or sets a value indicating whether clicking legend items toggles the
                * series visibility in the chart.
                */
                get: function () {
                    return this._legendToggle;
                },
                set: function (value) {
                    if (value != this._legendToggle) {
                        this._legendToggle = wijmo.asBoolean(value);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "rotated", {
                /**
                * Gets or sets a value indicating whether to flip the axes so X is vertical and Y horizontal.
                */
                get: function () {
                    return this._rotated;
                },
                set: function (value) {
                    if (value != this._rotated) {
                        this._rotated = wijmo.asBoolean(value);
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "options", {
                /**
                * Gets or sets various chart options.
                *
                * The following options are supported:
                *
                * <b>bubble.maxSize</b>: Specifies the maximum size
                * of symbols in the Bubble chart. The default value is 30 pixels.
                *
                * <b>bubble.minSize</b>: Specifies the minimum size
                * of symbols in the Bubble chart. The default value is 5 pixels.
                *
                * <pre>chart.options = {
                *   bubble: { minSize: 5, maxSize: 30 }
                * }</pre>
                *
                * <b>groupWidth</b>: Specifies the group width for Column charts, or the group height
                * for Bar charts. The group width can be specified in pixels or percent of
                * available space. The default value is '70%'.
                *
                * <pre>chart.options = {
                *   groupWidth : 50; // 50 pixels
                * }
                * chart.options = {
                *   groupWidth : '100%'; // 100% pixels
                * }</pre>
                */
                get: function () {
                    return this._options;
                },
                set: function (value) {
                    if (value != this._options) {
                        this._options = value;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "tooltip", {
                /**
                * Gets the chart @see:Tooltip object.
                *
                * Tooltip content is generated using a template that may contain any of the following
                * parameters:
                *
                * <ul>
                *  <li><b>seriesName</b>: The name of the series that contains the chart element.</li>
                *  <li><b>pointIndex</b>: The index of the chart element within the series.</li>
                *  <li><b>x</b>: The <b>x</b> value of the chart element.</li>
                *  <li><b>y</b>: The <b>y</b> value of the chart element.</li>
                * </ul>
                *
                * To modify the template, assign a new value to the tooltip's content property.
                * For example:
                * <pre>
                * chart.tooltip.content = '&lt;b&gt;{seriesName}&lt;/b&gt; ' +
                *    '&lt;img src="resources/{x}.png"/&gt;&lt;br/&gt;{y}';
                * </pre>
                *
                * You can disable chart tooltips by setting the template to an empty string, or by
                * setting the content to a function that takes a @see:HitTestInfo object as a parameter.
                *
                * You can also use the @see:tooltip property to customize tooltip parameters such
                * as @see:showDelay and @see:hideDelay:
                * <pre>
                * chart.tooltip.showDelay = 1000;
                * </pre>
                * See @see:ChartTooltip properties for other properties that you can set.
                */
                get: function () {
                    return this._tooltip;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "selection", {
                /**
                * Gets or sets the selected chart series.
                */
                get: function () {
                    return this._selection;
                },
                set: function (value) {
                    if (value != this._selection) {
                        this._selection = value;
                        this.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Raises the @see:selectionChanged event.
            */
            FlexChart.prototype.onSelectionChanged = function (e) {
                this.selectionChanged.raise(this, e);
            };

            /**
            * Raises the @see:seriesVisibilityChanged event.
            *
            * @param e The @see:SeriesEventArgs object that contains the event data.
            */
            FlexChart.prototype.onSeriesVisibilityChanged = function (e) {
                this.seriesVisibilityChanged.raise(this, e);
            };

            /**
            * Gets a @see:HitTestInfo object with information about the specified point.
            *
            * @param pt The point to investigate, in window coordinates.
            * @param y The Y coordinate of the point (if the first parameter is a number).
            * @return A HitTestInfo object with information about the point.
            */
            FlexChart.prototype.hitTest = function (pt, y) {
                // control coords
                var cpt = this._toControl(pt, y);

                var hti = new _chart.HitTestInfo(this, cpt);

                var si = null;

                if (FlexChart._contains(this._rectHeader, cpt)) {
                    hti._chartElement = 5 /* Header */;
                } else if (FlexChart._contains(this._rectFooter, cpt)) {
                    hti._chartElement = 6 /* Footer */;
                } else if (FlexChart._contains(this._rectLegend, cpt)) {
                    hti._chartElement = 4 /* Legend */;

                    si = this.legend._hitTest(cpt);
                    if (si !== null && si >= 0 && si < this.series.length) {
                        hti._series = this.series[si];
                    }
                } else if (FlexChart._contains(this._rectChart, cpt)) {
                    var hr = this._hitTester.hitTest(cpt);

                    if (hr && hr.area) {
                        hti._pointIndex = hr.area.tag.pointIndex;
                        si = hr.area.tag.seriesIndex;
                        if (si !== null && si >= 0 && si < this.series.length)
                            hti._series = this.series[si];

                        hti._dist = hr.distance;

                        if (FlexChart._contains(this._plotRect, cpt)) {
                            hti._chartElement = 0 /* PlotArea */;
                        } else if (FlexChart._contains(this.axisX._axrect, cpt)) {
                            hti._chartElement = 1 /* AxisX */;
                        } else if (FlexChart._contains(this.axisY._axrect, cpt)) {
                            hti._chartElement = 2 /* AxisY */;
                        } else {
                            hti._chartElement = 3 /* ChartArea */;
                        }
                    } else if (FlexChart._contains(this._plotRect, cpt)) {
                        hti._chartElement = 0 /* PlotArea */;
                    } else if (FlexChart._contains(this._rectChart, cpt)) {
                        hti._chartElement = 3 /* ChartArea */;
                    }
                } else {
                    hti._chartElement = 9 /* None */;
                }

                return hti;
            };

            /**
            * Converts a @see:Point from control coordinates to chart data coordinates.
            *
            * @param pt The point to convert, in control coordinates.
            * @param y The Y coordinate of the point (if the first parameter is a number).
            * @return The point in chart data coordinates.
            */
            FlexChart.prototype.pointToData = function (pt, y) {
                if (wijmo.isNumber(pt) && wijmo.isNumber(y)) {
                    pt = new wijmo.Point(pt, y);
                }
                if (pt instanceof MouseEvent) {
                    pt = new wijmo.Point(pt.pageX, pt.pageY);
                    pt = this._toControl(pt);
                } else {
                    pt = pt.clone();
                }

                pt.x = this.axisX.convertBack(pt.x);
                pt.y = this.axisY.convertBack(pt.y);
                return pt;
            };

            /**
            * Converts a @see:Point from data coordinates to page coordinates.
            *
            * @param pt @see:Point in data coordinates, or X coordinate of a point in data coordinates.
            * @param y Y coordinate of the point (if the first parameter is a number).
            * @return The @see:Point in page coordinates.
            */
            FlexChart.prototype.dataToPoint = function (pt, y) {
                if (wijmo.isNumber(pt) && wijmo.isNumber(y)) {
                    pt = new wijmo.Point(pt, y);
                }
                wijmo.asType(pt, wijmo.Point);
                var cpt = pt.clone();
                cpt.x = this.axisX.convert(cpt.x);
                cpt.y = this.axisY.convert(cpt.y);

                // var offset = $(this.hostElement).offset();
                // cpt.x -= offset.left;
                // cpt.y -= offset.top;
                return cpt;
            };

            //--------------------------------------------------------------------------
            // implementation
            // method used in JSON-style initialization
            FlexChart.prototype._copy = function (key, value) {
                if (key == 'series') {
                    var arr = wijmo.asArray(value);
                    for (var i = 0; i < arr.length; i++) {
                        var s = new _chart.Series();
                        wijmo.copy(s, arr[i]);
                        this.series.push(s);
                    }
                    return true;
                }
                return false;
            };

            FlexChart.prototype._clearCachedValues = function () {
                for (var i = 0; i < this._series.length; i++) {
                    var series = this._series[i];
                    if (series.itemsSource == null)
                        series._clearValues();
                }
            };

            FlexChart.prototype._performBind = function () {
                this._xDataType = null;
                this._xlabels.splice(0);
                this._xvals.splice(0);
                if (this._cv) {
                    var items = this._cv.items;
                    if (items) {
                        var len = items.length;
                        for (var i = 0; i < len; i++) {
                            var item = items[i];
                            if (this._bindingX) {
                                var x = item[this._bindingX];
                                if (wijmo.isNumber(x)) {
                                    this._xvals.push(wijmo.asNumber(x));
                                    this._xDataType = 2 /* Number */;
                                } else if (wijmo.isDate(x)) {
                                    this._xvals.push(FlexChart._toOADate(wijmo.asDate(x)));
                                    this._xDataType = 4 /* Date */;
                                }
                                this._xlabels.push(item[this._bindingX]);
                            }
                        }
                        if (this._xvals.length == len) {
                            this._xlabels.splice(0);
                        } else {
                            this._xvals.splice(0);
                        }
                    }
                }
            };

            FlexChart.prototype._hitTestSeries = function (pt, seriesIndex) {
                // control coords
                //var cpt = pt.clone();
                //var host = this.hostElement;
                //cpt.x -= host.offsetLeft;
                //cpt.y -= host.offsetTop;
                var cpt = this._toControl(pt);

                var hti = new _chart.HitTestInfo(this, cpt);
                var si = seriesIndex;
                var hr = this._hitTester.hitTestSeries(cpt, seriesIndex);

                if (hr && hr.area) {
                    hti._pointIndex = hr.area.tag.pointIndex;
                    si = hr.area.tag.seriesIndex;
                    if (si !== null && si >= 0 && si < this.series.length)
                        hti._series = this.series[si];
                    hti._chartElement = 0 /* PlotArea */;
                    hti._dist = hr.distance;
                }

                return hti;
            };

            // hitTest including lines
            FlexChart.prototype._hitTestData = function (pt) {
                var cpt = this._toControl(pt);
                var hti = new _chart.HitTestInfo(this, cpt);
                var hr = this._hitTester.hitTest(cpt, true);

                if (hr && hr.area) {
                    hti._pointIndex = hr.area.tag.pointIndex;
                    var si = hr.area.tag.seriesIndex;
                    if (si !== null && si >= 0 && si < this.series.length)
                        hti._series = this.series[si];

                    hti._dist = hr.distance;
                }

                return hti;
            };

            /* private _hitTestLines(hti: HitTestInfo): HitTestInfo {
            if (hti.series) {
            var pi = hti.pointIndex;
            var p0 = hti.series._indexToPoint(pi);
            
            // jQuery
            //var offset = $(this.hostElement).offset();
            var offset = this._getHostOffset();
            
            p0 = this.dataToPoint(p0);
            p0.x -= offset.x;
            p0.y -= offset.y;
            
            var d1 = null,
            d2 = null;
            var p1 = hti.series._indexToPoint(pi - 1);
            var p2 = hti.series._indexToPoint(pi + 1);
            if (p1) {
            p1 = this.dataToPoint(p1);
            p1.x -= offset.x;
            p1.y -= offset.y;
            d1 = FlexChart._dist2(p0, p1);
            }
            if (p2) {
            p2 = this.dataToPoint(p2);
            p2.x -= offset.x;
            p2.y -= offset.y;
            d2 = FlexChart._dist2(p0, p2);
            }
            
            var pt = hti.point.clone();
            var host = this.hostElement;
            pt.x -= host.offsetLeft;
            pt.y -= host.offsetTop;
            
            if (d1 && d2) {
            if (d1 < d2) {
            hti._dist = FlexChart._dist(pt, p0, p1);
            }
            else {
            hti._dist = FlexChart._dist(pt, p0, p2);
            }
            } else if (d1) {
            hti._dist = FlexChart._dist(pt, p0, p1);
            } else if (d2) {
            hti._dist = FlexChart._dist(pt, p0, p2);
            }
            }
            
            return hti;
            }*/
            FlexChart._dist2 = function (p1, p2) {
                var dx = p1.x - p2.x;
                var dy = p1.y - p2.y;
                return dx * dx + dy * dy;
            };

            // line p1-p2 to point p0
            /*static _dist(p0: Point, p1: Point, p2: Point): number {
            var dx = p2.x - p1.x;
            var dy = p2.y - p1.y;
            return Math.sqrt(Math.abs(dy * p0.x - dx * p0.y - p1.x * p2.y + p2.x * p1.y) / Math.sqrt(dx * dx + dy * dy));
            }*/
            FlexChart._dist = function (p0, p1, p2) {
                return Math.sqrt(FlexChart._distToSegmentSquared(p0, p1, p2));
            };

            FlexChart._distToSegmentSquared = function (p, v, w) {
                var l2 = FlexChart._dist2(v, w);
                if (l2 == 0)
                    return FlexChart._dist2(p, v);
                var t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
                if (t < 0)
                    return FlexChart._dist2(p, v);
                if (t > 1)
                    return FlexChart._dist2(p, w);
                return FlexChart._dist2(p, new wijmo.Point(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y)));
            };

            FlexChart.prototype._isRotated = function () {
                return this._chartType == 1 /* Bar */ ? !this._rotated : this._rotated;
            };

            FlexChart.prototype._render = function (engine) {
                var el = this.hostElement;

                //  jQuery
                // var w = $(el).width();//el.clientWidth - el.clientLeft;
                // var h = $(el).height(); //el.clientHeight - el.clientTop;
                var sz = this._getHostSize();
                var w = sz.width, h = sz.height;

                if (w == 0 || isNaN(w)) {
                    w = FlexChart._WIDTH;
                }
                if (h == 0 || isNaN(h)) {
                    h = FlexChart._HEIGHT;
                }

                //
                var hostSz = new wijmo.Size(w, h);
                engine.beginRender();

                if (w > 0 && h > 0) {
                    engine.setViewportSize(w, h);
                    this._hitTester.clear();

                    var legend = this.legend;
                    var lsz;
                    var tsz;
                    var lpos;
                    var rect = new wijmo.Rect(0, 0, w, h);

                    this._rectChart = rect.clone();

                    engine.startGroup(FlexChart._CSS_HEADER);
                    rect = this._drawTitle(engine, rect, this.header, this.headerStyle, false);
                    engine.endGroup();

                    engine.startGroup(FlexChart._CSS_FOOTER);
                    rect = this._drawTitle(engine, rect, this.footer, this.footerStyle, true);
                    engine.endGroup();

                    w = rect.width;
                    h = rect.height;

                    lsz = legend._getDesiredSize(engine);
                    switch (legend.position) {
                        case 3 /* Right */:
                            w -= lsz.width;
                            lpos = new wijmo.Point(w, rect.top + 0.5 * (h - lsz.height));
                            break;
                        case 1 /* Left */:
                            rect.left += lsz.width;
                            w -= lsz.width;
                            lpos = new wijmo.Point(0, rect.top + 0.5 * (h - lsz.height));
                            break;
                        case 2 /* Top */:
                            h -= lsz.height;
                            lpos = new wijmo.Point(0.5 * (w - lsz.width), rect.top);
                            rect.top += lsz.height;
                            break;
                        case 4 /* Bottom */:
                            h -= lsz.height;
                            lpos = new wijmo.Point(0.5 * (w - lsz.width), rect.top + h);
                            break;
                    }

                    rect.width = w;
                    rect.height = h;

                    //
                    var plotter = this._getPlotter(null);
                    plotter.stacking = this._stacking;
                    var isRotated = this._isRotated();

                    this._dataInfo.analyse(this._series, isRotated, plotter.stacking, this._xvals.length > 0 ? this._xvals : null);

                    var rect0 = plotter.adjustLimits(this._dataInfo, rect.clone());

                    if (isRotated) {
                        var ydt = this._dataInfo.getDataTypeX();
                        if (!ydt) {
                            ydt = this._xDataType;
                        }
                        this.axisX._updateActualLimits(this._dataInfo.getDataTypeY(), rect0.left, rect0.right);
                        this.axisY._updateActualLimits(ydt, rect0.top, rect0.bottom, this._xlabels, this._xvals);
                    } else {
                        var xdt = this._dataInfo.getDataTypeX();
                        if (!xdt) {
                            xdt = this._xDataType;
                        }
                        this.axisX._updateActualLimits(xdt, rect0.left, rect0.right, this._xlabels, this._xvals);
                        this.axisY._updateActualLimits(this._dataInfo.getDataTypeY(), rect0.top, rect0.bottom);
                    }

                    var axes = this._getAxes();
                    this._updateAuxAxes(axes, isRotated);

                    //
                    this._layout(rect, hostSz, engine);

                    engine.startGroup(FlexChart._CSS_PLOT_AREA);
                    var prect = this._plotRect;
                    engine.fill = 'transparent';
                    engine.stroke = null;
                    engine.drawRect(prect.left, prect.top, prect.width, prect.height);
                    engine.endGroup();

                    var len = this._series.length;

                    this._clearPlotters();
                    var groups = {};

                    for (var i = 0; i < len; i++) {
                        var series = this._series[i];
                        var ay = series._getAxisY();

                        if (ay) {
                            var axid = ay._uniqueId;
                            if (!groups[axid]) {
                                groups[axid] = { count: 1, index: 0 };
                            } else {
                                groups[axid].count += 1;
                            }
                        }

                        var plotter = this._getPlotter(series);
                        plotter.seriesCount++;
                    }

                    this.onRendering(engine);

                    for (var i = 0; i < axes.length; i++) {
                        var ax = axes[i];
                        if (ax.axisType == 0 /* X */) {
                            engine.startGroup(FlexChart._CSS_AXIS_X);
                        } else {
                            engine.startGroup(FlexChart._CSS_AXIS_Y);
                        }

                        ax._render(engine);
                        engine.endGroup();
                    }

                    engine.startGroup(); // all series

                    this._plotrectId = 'plotRect' + (1000000 * Math.random()).toFixed();

                    engine.addClipRect(this._plotRect, this._plotrectId);

                    for (var i = 0; i < len; i++) {
                        var series = this._series[i];
                        series._pointIndexes = [];
                        var plotter = this._getPlotter(series);
                        series._hostElement = engine.startGroup(series.cssClass, plotter.clipping ? this._plotrectId : null);
                        var vis = series.visibility;
                        var axisX = series.axisX;
                        var axisY = series.axisY;
                        if (!axisX) {
                            axisX = this.axisX;
                        }
                        if (!axisY) {
                            axisY = this.axisY;
                        }

                        if (vis == 0 /* Visible */ || vis == 1 /* Plot */) {
                            var group = groups[axisY._uniqueId];
                            if (group) {
                                plotter.plotSeries(engine, axisX, axisY, series, this, group.index, group.count);
                                group.index++;
                            } else {
                                plotter.plotSeries(engine, axisX, axisY, series, this, plotter.seriesIndex, plotter.seriesCount);
                                plotter.seriesIndex++;
                            }
                        }
                        engine.endGroup();
                    }
                    engine.endGroup();

                    if (lsz) {
                        this._legendHost = engine.startGroup(FlexChart._CSS_LEGEND);
                        this._rectLegend = new wijmo.Rect(lpos.x, lpos.y, lsz.width, lsz.height);
                        this.legend._render(engine, lpos);
                        engine.endGroup();
                    } else {
                        this._legendHost = null;
                        this._rectLegend = null;
                    }

                    this._highlightCurrent();
                    this.onRendered(engine);
                }

                engine.endRender();
            };

            FlexChart.prototype._getAxes = function () {
                var axes = [this.axisX, this.axisY];
                var len = this.series.length;
                for (var i = 0; i < len; i++) {
                    var ser = this.series[i];
                    var ax = ser.axisX;
                    if (ax && axes.indexOf(ax) === -1) {
                        axes.push(ax);
                    }
                    var ay = ser.axisY;
                    if (ay && axes.indexOf(ay) === -1) {
                        axes.push(ay);
                    }
                }

                return axes;
            };

            FlexChart.prototype._clearPlotters = function () {
                this._areaPlotter.clear();
                this._barPlotter.clear();
                this._linePlotter.clear();
            };

            FlexChart.prototype._initPlotter = function (plotter) {
                plotter.chart = this;
                plotter.dataInfo = this._dataInfo;
                plotter.hitTester = this._hitTester;
            };

            Object.defineProperty(FlexChart.prototype, "_barPlotter", {
                get: function () {
                    if (this.__barPlotter === null) {
                        this.__barPlotter = new _BarPlotter();
                        this._initPlotter(this.__barPlotter);
                    }
                    return this.__barPlotter;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "_linePlotter", {
                get: function () {
                    if (this.__linePlotter === null) {
                        this.__linePlotter = new _LinePlotter();
                        this._initPlotter(this.__linePlotter);
                    }
                    return this.__linePlotter;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "_areaPlotter", {
                get: function () {
                    if (this.__areaPlotter === null) {
                        this.__areaPlotter = new _AreaPlotter();
                        this._initPlotter(this.__areaPlotter);
                    }
                    return this.__areaPlotter;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "_bubblePlotter", {
                get: function () {
                    if (this.__bubblePlotter === null) {
                        this.__bubblePlotter = new _BubblePlotter();
                        this._initPlotter(this.__bubblePlotter);
                    }
                    return this.__bubblePlotter;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(FlexChart.prototype, "_financePlotter", {
                get: function () {
                    if (this.__financePlotter === null) {
                        this.__financePlotter = new _FinancePlotter();
                        this._initPlotter(this.__financePlotter);
                    }
                    return this.__financePlotter;
                },
                enumerable: true,
                configurable: true
            });

            FlexChart.prototype._getPlotter = function (series) {
                var chartType = this.chartType;
                var isSeries = false;
                if (series && series.chartType) {
                    if (series.chartType != chartType) {
                        chartType = series.chartType;
                        isSeries = true;
                    }
                }

                var plotter;
                switch (chartType) {
                    case 0 /* Column */:
                        plotter = this._barPlotter;
                        break;
                    case 1 /* Bar */:
                        this._barPlotter.rotated = !this._rotated;
                        plotter = this._barPlotter;
                        break;
                    case 3 /* Line */:
                        this._linePlotter.hasSymbols = false;
                        this._linePlotter.hasLines = true;
                        this._linePlotter.isSpline = false;
                        plotter = this._linePlotter;
                        break;
                    case 2 /* Scatter */:
                        this._linePlotter.hasSymbols = true;
                        this._linePlotter.hasLines = false;
                        this._linePlotter.isSpline = false;
                        plotter = this._linePlotter;
                        break;
                    case 4 /* LineSymbols */:
                        this._linePlotter.hasSymbols = true;
                        this._linePlotter.hasLines = true;
                        this._linePlotter.isSpline = false;
                        plotter = this._linePlotter;
                        break;
                    case 5 /* Area */:
                        this._areaPlotter.isSpline = false;
                        plotter = this._areaPlotter;
                        break;
                    case 6 /* Bubble */:
                        plotter = this._bubblePlotter;
                        break;
                    case 7 /* Candlestick */:
                        this._financePlotter.isCandle = true;
                        plotter = this._financePlotter;
                        break;
                    case 8 /* HighLowOpenClose */:
                        this._financePlotter.isCandle = false;
                        plotter = this._financePlotter;
                        break;
                    case 9 /* Spline */:
                        this._linePlotter.hasSymbols = false;
                        this._linePlotter.hasLines = true;
                        this._linePlotter.isSpline = true;
                        plotter = this._linePlotter;
                        break;
                    case 10 /* SplineSymbols */:
                        this._linePlotter.hasSymbols = true;
                        this._linePlotter.hasLines = true;
                        this._linePlotter.isSpline = true;
                        plotter = this._linePlotter;
                        break;
                    case 11 /* SplineArea */:
                        this._areaPlotter.isSpline = true;
                        plotter = this._areaPlotter;
                        break;
                    default:
                        throw 'Invalid chart type.';
                }

                plotter.rotated = this._rotated;
                if (chartType == 1 /* Bar */)
                    plotter.rotated = !plotter.rotated;
                if (isSeries) {
                    plotter.rotated = this._isRotated();
                }

                return plotter;
            };

            FlexChart.prototype._layout = function (rect, size, engine) {
                var w = rect.width;
                var h = rect.height;
                var mxsz = new wijmo.Size(w, 0.75 * h);
                var mysz = new wijmo.Size(h, 0.75 * w);

                var left = 0, top = 0, right = w, bottom = h;
                var l0 = 0, t0 = 0, r0 = w, b0 = h;

                var axes = this._getAxes();

                for (var i = 0; i < axes.length; i++) {
                    var ax = axes[i];
                    var origin = ax.origin;

                    if (ax.axisType == 0 /* X */) {
                        var ah = ax._getHeight(engine);

                        if (ah > mxsz.height)
                            ah = mxsz.height;

                        ax._desiredSize = new wijmo.Size(mxsz.width, ah);

                        var hasOrigin = ax._hasOrigin = wijmo.isNumber(origin) && origin > this.axisY.actualMin && origin < this.axisY.actualMax;

                        if (ax.position == 4 /* Bottom */) {
                            left = Math.max(left, ax._annoSize.width * 0.5);
                            right = Math.min(right, w - ax._annoSize.width * 0.5);

                            if (hasOrigin) {
                                var yorigin = this._convertY(origin, t0, b0);
                                b0 = b0 - Math.max(0, (yorigin + ah) - b0);
                            } else {
                                b0 = b0 - ah;
                            }
                        } else if (ax.position == 2 /* Top */) {
                            left = Math.max(left, ax._annoSize.width * 0.5);
                            right = Math.min(right, w - ax._annoSize.width * 0.5);

                            if (hasOrigin) {
                                var yorigin = this._convertY(origin, t0, b0);
                                t0 = t0 + Math.max(0, t0 - (yorigin - ah));
                            } else {
                                t0 = t0 + ah;
                            }
                        }
                    } else if (ax.axisType == 1 /* Y */) {
                        var ah = ax._getHeight(engine);
                        if (ah > mysz.height) {
                            ah = mysz.height;
                        }
                        ax._desiredSize = new wijmo.Size(mysz.width, ah);

                        var hasOrigin = ax._hasOrigin = wijmo.isNumber(origin) && origin > this.axisX.actualMin && origin < this.axisX.actualMax;

                        if (ax.position == 1 /* Left */) {
                            top = Math.max(top, ax._annoSize.width * 0.5);
                            bottom = Math.min(bottom, h - ax._annoSize.width * 0.5);

                            if (hasOrigin) {
                                var xorigin = this._convertX(origin, l0, r0);
                                l0 += Math.max(0, l0 - (xorigin - ah));
                            } else {
                                l0 += ah;
                            }
                        } else if (ax.position == 3 /* Right */) {
                            top = Math.max(top, ax._annoSize.width * 0.5);
                            bottom = Math.min(bottom, h - ax._annoSize.width * 0.5);

                            if (hasOrigin) {
                                var xorigin = this._convertX(origin, l0, r0);
                                r0 = r0 - Math.max(0, (xorigin + ah) - r0);
                            } else {
                                r0 = r0 - ah;
                            }
                        }
                    }
                }

                // todo: custom margins
                var margins = this._parseMargin(this.plotMargin);

                if (!isNaN(margins.left)) {
                    left = l0 = margins.left;
                } else {
                    left = l0 = Math.max(left, l0) + rect.left;
                }

                if (!isNaN(margins.right)) {
                    right = r0 = size.width - margins.right;
                } else {
                    right = r0 = Math.min(right, r0) + rect.left;
                }

                if (!isNaN(margins.top)) {
                    top = t0 = margins.top;
                } else {
                    top = t0 = Math.max(top, t0) + rect.top;
                }
                if (!isNaN(margins.bottom)) {
                    bottom = b0 = size.height - margins.bottom;
                } else {
                    bottom = b0 = Math.min(bottom, b0) + rect.top;
                }

                w = Math.max(1, right - left);
                h = Math.max(1, bottom - top);
                this._plotRect = new wijmo.Rect(left, top, w, h);

                engine.stroke = null;

                for (var i = 0; i < axes.length; i++) {
                    var ax = axes[i];

                    //ax._plot = _plot0;
                    var origin = ax.origin;

                    if (ax.axisType == 0 /* X */) {
                        var axr;

                        if (!ax._hasOrigin) {
                            if (ax.position == 4 /* Bottom */) {
                                axr = new wijmo.Rect(left, b0, w, ax._desiredSize.height);
                                b0 += ax._desiredSize.height;
                            } else if (ax.position == 2 /* Top */) {
                                axr = new wijmo.Rect(left, t0 - ax._desiredSize.height, w, ax._desiredSize.height);
                                t0 -= ax._desiredSize.height;
                            } else {
                                axr = new wijmo.Rect(left, t0, w, 1);
                            }
                        } else {
                            var yorigin = this._convertY(origin, this._plotRect.top, this._plotRect.bottom);
                            if (ax.position == 4 /* Bottom */) {
                                axr = new wijmo.Rect(left, yorigin, w, ax._desiredSize.height);
                                b0 += Math.max(0, axr.bottom - this._plotRect.bottom); // ax.DesiredSize.Height;
                            } else if (ax.position == 2 /* Top */) {
                                axr = new wijmo.Rect(left, yorigin - ax._desiredSize.height, w, ax._desiredSize.height);
                                t0 -= Math.max(0, this._plotRect.top - axr.top); // ax.DesiredSize.Height;
                            }
                        }
                        ax._layout(axr, this._plotRect);
                        //ax.render(engine, axr, this.plotRect);
                    } else if (ax.axisType == 1 /* Y */) {
                        var ayr;

                        if (!ax._hasOrigin) {
                            if (ax.position == 1 /* Left */) {
                                ayr = new wijmo.Rect(l0 - ax._desiredSize.height, top, h, ax._desiredSize.height);
                                l0 -= ax._desiredSize.height;
                            } else if (ax.position == 3 /* Right */) {
                                ayr = new wijmo.Rect(r0, top, h, ax._desiredSize.height);
                                r0 += ax._desiredSize.height;
                            } else {
                                ayr = new wijmo.Rect(l0, top, h, 1);
                            }
                        } else {
                            var xorigin = this._convertX(origin, this._plotRect.left, this._plotRect.right);

                            if (ax.position == 1 /* Left */) {
                                ayr = new wijmo.Rect(xorigin - ax._desiredSize.height, top, h, ax._desiredSize.height);
                                l0 -= ax._desiredSize.height;
                            } else if (ax.position == 3 /* Right */) {
                                ayr = new wijmo.Rect(xorigin, top, h, ax._desiredSize.height);
                                r0 += ax._desiredSize.height;
                            }
                        }

                        ax._layout(ayr, this._plotRect);
                        //ax.render(engine, ayr, this.plotRect);
                    }
                }
            };

            //---------------------------------------------------------------------
            FlexChart.prototype._convertX = function (x, left, right) {
                var ax = this.axisX;
                if (ax.reversed)
                    return right - (right - left) * (x - ax.actualMin) / (ax.actualMax - ax.actualMin);
                else
                    return left + (right - left) * (x - ax.actualMin) / (ax.actualMax - ax.actualMin);
            };

            FlexChart.prototype._convertY = function (y, top, bottom) {
                var ay = this.axisY;
                if (ay.reversed)
                    return top + (bottom - top) * (y - ay.actualMin) / (ay.actualMax - ay.actualMin);
                else
                    return bottom - (bottom - top) * (y - ay.actualMin) / (ay.actualMax - ay.actualMin);
            };

            // tooltips
            FlexChart.prototype._getTooltipContent = function (ht) {
                var tc = this._tooltip.content;
                if (wijmo.isString(tc)) {
                    return this._keywords.replace(tc, ht);
                } else if (wijmo.isFunction(tc)) {
                    return tc(ht);
                }

                return null;
            };

            //---------------------------------------------------------------------
            // selection
            FlexChart.prototype._select = function (newSelection, pointIndex) {
                if (this._selection) {
                    this._highlight(this._selection, false, this._selectionIndex);
                }
                this._selection = newSelection;
                this._selectionIndex = pointIndex;
                if (this._selection) {
                    this._highlight(this._selection, true, this._selectionIndex);
                }

                if (this.selectionMode == 2 /* Point */) {
                    if (newSelection) {
                        var cv = newSelection.collectionView;
                        if (!cv) {
                            cv = this._cv;
                        }

                        if (cv) {
                            this._notifyCurrentChanged = false;
                            cv.moveCurrentToPosition(pointIndex);
                            this._notifyCurrentChanged = true;
                        }
                    } else {
                        //
                    }
                }

                this.onSelectionChanged();
            };

            FlexChart.prototype._highlightCurrent = function () {
                if (this.selectionMode != 0 /* None */) {
                    var selection = this._selection;
                    var pointIndex = -1;
                    if (selection) {
                        var cv = selection.collectionView;
                        if (!cv) {
                            cv = this._cv;
                        }

                        if (cv) {
                            pointIndex = cv.currentPosition;
                        }

                        this._highlight(selection, true, pointIndex);
                    }
                }
            };

            FlexChart.prototype._highlight = function (series, selected, pointIndex) {
                // check that the selection is a Series object (or null)
                series = wijmo.asType(series, _chart.Series, true);

                // select the series or the point
                if (this.selectionMode == 1 /* Series */) {
                    var index = this.series.indexOf(series);
                    var gs = series.hostElement;

                    if (selected) {
                        gs.parentNode.appendChild(gs);
                    } else {
                        gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(index));
                    }

                    // jQuery
                    // var hs = $(gs);
                    // this._highlightItems(hs.find('rect'), FlexChart._CSS_SELECTION, selected);
                    // this._highlightItems(hs.find('ellipse'), FlexChart._CSS_SELECTION, selected);
                    // this._highlightItems(hs.find('polyline'), FlexChart._CSS_SELECTION, selected);
                    // this._highlightItems(hs.find('polygon'), FlexChart._CSS_SELECTION, selected);
                    // this._highlightItems(hs.find('line'), FlexChart._CSS_SELECTION, selected);
                    this._highlightItems(this._find(gs, ['rect', 'ellipse', 'polyline', 'polygon', 'line']), FlexChart._CSS_SELECTION, selected);

                    if (series.legendElement) {
                        // jQuery
                        // var ls = $(series.legendElement);
                        // this._highlightItems(ls.find('rect'), FlexChart._CSS_SELECTION, selected);
                        // this._highlightItems(ls.find('ellipse'), FlexChart._CSS_SELECTION, selected);
                        // this._highlightItems(ls.find('line'), FlexChart._CSS_SELECTION, selected);
                        this._highlightItems(this._find(series.legendElement, ['rect', 'ellipse', 'line']), FlexChart._CSS_SELECTION, selected);
                    }
                } else if (this.selectionMode == 2 /* Point */) {
                    var index = this.series.indexOf(series);
                    var gs = series.hostElement;

                    /* jQuery
                    var hs = $(gs);
                    
                    if (selected) {
                    gs.parentNode.appendChild(gs);
                    var pel = $(series.getPlotElement(pointIndex));
                    if (pel.length) {
                    this._highlightItems(pel, FlexChart._CSS_SELECTION, selected);
                    this._highlightItems(pel.find('line'), FlexChart._CSS_SELECTION, selected);
                    this._highlightItems(pel.find('rect'), FlexChart._CSS_SELECTION, selected);
                    }
                    } else {
                    gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(index));
                    
                    this._highlightItems(hs.find('rect'), FlexChart._CSS_SELECTION, selected);
                    this._highlightItems(hs.find('ellipse'), FlexChart._CSS_SELECTION, selected);
                    this._highlightItems(hs.find('line'), FlexChart._CSS_SELECTION, selected);
                    }
                    */
                    if (selected) {
                        gs.parentNode.appendChild(gs);
                        var pel = series.getPlotElement(pointIndex);
                        if (pel) {
                            this._highlightItems([pel], FlexChart._CSS_SELECTION, selected);
                            this._highlightItems(this._find(pel, ['line', 'rect']), FlexChart._CSS_SELECTION, selected);
                        }
                    } else {
                        gs.parentNode.insertBefore(gs, gs.parentNode.childNodes.item(index));
                        this._highlightItems(this._find(gs, ['rect', 'ellipse', 'line']), FlexChart._CSS_SELECTION, selected);
                    }
                }
            };

            // aux axes
            FlexChart.prototype._updateAuxAxes = function (axes, isRotated) {
                for (var i = 2; i < axes.length; i++) {
                    var ax = axes[i];
                    ax._chart = this;
                    var slist = [];
                    for (var iser = 0; iser < this.series.length; iser++) {
                        var ser = this.series[iser];
                        if (ser.axisX == ax || ser.axisY == ax) {
                            slist.push(ser);
                        }
                    }
                    var dataMin, dataMax;
                    for (var iser = 0; iser < slist.length; iser++) {
                        var rect = slist[iser]._getDataRect();
                        if (rect) {
                            if ((ax.axisType == 0 /* X */ && !isRotated) || (ax.axisType == 1 /* Y */ && isRotated)) {
                                if (dataMin === undefined || rect.left < dataMin) {
                                    dataMin = rect.left;
                                }
                                if (dataMax === undefined || rect.right > dataMax) {
                                    dataMax = rect.right;
                                }
                            } else {
                                if (dataMin === undefined || rect.top < dataMin) {
                                    dataMin = rect.top;
                                }
                                if (dataMax === undefined || rect.bottom > dataMax) {
                                    dataMax = rect.bottom;
                                }
                            }
                        }
                    }

                    axes[i]._updateActualLimits(2 /* Number */, dataMin, dataMax);
                }
            };

            //---------------------------------------------------------------------
            // tools
            FlexChart._contains = function (rect, pt) {
                if (rect && pt) {
                    return pt.x >= rect.left && pt.x <= rect.right && pt.y >= rect.top && pt.y <= rect.bottom;
                }

                return false;
            };

            FlexChart._toOADate = function (date) {
                return (date.getTime() - FlexChart._epoch) / FlexChart._msPerDay;
            };

            FlexChart._fromOADate = function (val) {
                var dec = val - Math.floor(val);
                if (val < 0 && dec) {
                    val = Math.floor(val) - dec;
                }
                return new Date(val * FlexChart._msPerDay + FlexChart._epoch);
            };

            FlexChart._renderText = function (engine, text, pos, halign, valign, className, groupName) {
                var sz = engine.measureString(text, className, groupName);
                var x = pos.x;
                var y = pos.y;

                switch (halign) {
                    case 1:
                        x -= 0.5 * sz.width;
                        break;

                    case 2:
                        x -= sz.width;
                        break;
                }
                switch (valign) {
                    case 1:
                        y += 0.5 * sz.height;
                        break;

                    case 0:
                        y += sz.height;
                        break;
                }

                engine.drawString(text, new wijmo.Point(x, y), className);
            };

            FlexChart._renderRotatedText = function (engine, text, pos, halign, valign, center, angle, className) {
                var sz = engine.measureString(text, className);
                var x = pos.x;
                var y = pos.y;

                switch (halign) {
                    case 1:
                        x -= 0.5 * sz.width;
                        break;
                    case 2:
                        x -= sz.width;
                        break;
                }
                switch (valign) {
                    case 1:
                        y += 0.5 * sz.height;
                        break;
                    case 0:
                        y += sz.height;
                        break;
                }

                engine.drawStringRotated(text, new wijmo.Point(x, y), center, angle, className);
            };
            FlexChart._CSS_AXIS_X = 'wj-axis-x';
            FlexChart._CSS_AXIS_Y = 'wj-axis-y';

            FlexChart._CSS_LINE = 'wj-line';
            FlexChart._CSS_GRIDLINE = 'wj-gridline';
            FlexChart._CSS_TICK = 'wj-tick';

            FlexChart._CSS_GRIDLINE_MINOR = 'wj-gridline-minor';
            FlexChart._CSS_TICK_MINOR = 'wj-tick-minor';

            FlexChart._CSS_LABEL = 'wj-label';

            FlexChart._CSS_LEGEND = 'wj-legend';
            FlexChart._CSS_HEADER = 'wj-header';
            FlexChart._CSS_FOOTER = 'wj-footer';

            FlexChart._CSS_TITLE = 'wj-title';

            FlexChart._CSS_SELECTION = 'wj-state-selected';
            FlexChart._CSS_PLOT_AREA = 'wj-plot-area';

            FlexChart._epoch = new Date(1899, 11, 30).getTime();
            FlexChart._msPerDay = 86400000;
            return FlexChart;
        })(_chart.FlexChartBase);
        _chart.FlexChart = FlexChart;

        /**
        * Analyzes chart data.
        */
        var _DataInfo = (function () {
            function _DataInfo() {
                this.stackAbs = {};
                this._xvals = null;
            }
            _DataInfo.prototype.analyse = function (seriesList, isRotated, stacking, xvals) {
                this.minY = NaN;
                this.maxY = NaN;
                this.minX = NaN;
                this.maxX = NaN;
                this.dx = 0;

                var stackPos = {};
                var stackNeg = {};
                var stackAbs = {};

                this.dataTypeX = null;
                this.dataTypeY = null;

                this._xvals = xvals;
                if (xvals != null) {
                    var len = xvals.length;
                    for (var i = 0; i < len; i++) {
                        var xval = xvals[i];
                        if (isNaN(this.minX) || this.minX > xval) {
                            this.minX = xval;
                        }
                        if (isNaN(this.maxX) || this.maxX < xval) {
                            this.maxX = xval;
                        }

                        if (i > 0) {
                            var dx = Math.abs(xval - xvals[i - 1]);
                            if (!isNaN(dx) && (dx < this.dx || this.dx == 0)) {
                                this.dx = dx;
                            }
                        }
                    }
                }

                for (var i = 0; i < seriesList.length; i++) {
                    var series = seriesList[i];
                    var vis = series.visibility;
                    if (vis == 3 /* Hidden */ || vis == 2 /* Legend */) {
                        continue;
                    }

                    var xvalues = null;
                    if (isRotated) {
                        if (!series._isCustomAxisY()) {
                            xvalues = series.getValues(1);
                        }
                    } else {
                        if (!series._isCustomAxisX()) {
                            xvalues = series.getValues(1);
                        }
                    }

                    if (xvalues) {
                        if (!this.dataTypeX) {
                            this.dataTypeX = series.getDataType(1);
                        }
                        for (var j = 0; j < xvalues.length; j++) {
                            var val = xvalues[j];
                            if (_DataInfo.isValid(val)) {
                                if (isNaN(this.minX) || this.minX > val) {
                                    this.minX = val;
                                }
                                if (isNaN(this.maxX) || this.maxX < val) {
                                    this.maxX = val;
                                }

                                if (j > 0) {
                                    var dx = Math.abs(val - xvalues[j - 1]);
                                    if (!isNaN(dx) && (dx < this.dx || this.dx == 0)) {
                                        this.dx = dx;
                                    }
                                }
                            }
                        }
                    }
                    var values = null;
                    if (isRotated) {
                        if (!series._isCustomAxisX()) {
                            values = series.getValues(0);
                        }
                    } else {
                        if (!series._isCustomAxisY()) {
                            values = series.getValues(0);
                        }
                    }

                    if (values) {
                        if (!this.dataTypeY) {
                            this.dataTypeY = series.getDataType(0);
                        }
                        if (isNaN(this.minX)) {
                            this.minX = 0;
                        }

                        if (isNaN(this.maxX)) {
                            this.maxX = values.length - 1;
                        } else if (!xvalues) {
                            this.maxX = Math.max(this.maxX, values.length - 1);
                        }

                        for (var j = 0; j < values.length; j++) {
                            var val = values[j];
                            var xval = xvalues ? wijmo.asNumber(xvalues[j], true) : (xvals ? wijmo.asNumber(xvals[j], true) : j);
                            if (_DataInfo.isValid(val)) {
                                if (isNaN(this.minY) || this.minY > val) {
                                    this.minY = val;
                                }
                                if (isNaN(this.maxY) || this.maxY < val) {
                                    this.maxY = val;
                                }
                                if (val > 0) {
                                    if (isNaN(stackPos[xval])) {
                                        stackPos[xval] = val;
                                    } else {
                                        stackPos[xval] += val;
                                    }
                                } else {
                                    if (isNaN(stackNeg[xval])) {
                                        stackNeg[xval] = val;
                                    } else {
                                        stackNeg[xval] += val;
                                    }
                                }

                                if (isNaN(stackAbs[xval])) {
                                    stackAbs[xval] = Math.abs(val);
                                } else {
                                    stackAbs[xval] += Math.abs(val);
                                }
                            }
                        }
                    }
                }

                if (stacking == 1 /* Stacked */) {
                    for (var key in stackPos) {
                        if (stackPos[key] > this.maxY) {
                            this.maxY = stackPos[key];
                        }
                    }
                    for (var key in stackNeg) {
                        if (stackNeg[key] < this.minY) {
                            this.minY = stackNeg[key];
                        }
                    }
                } else if (stacking == 2 /* Stacked100pc */) {
                    this.minY = 0;
                    this.maxY = 1;
                    for (var key in stackAbs) {
                        var sum = stackAbs[key];
                        if (isFinite(sum) && sum != 0) {
                            var vpos = stackPos[key];
                            var vneg = stackNeg[key];
                            if (isFinite(vpos)) {
                                vpos = Math.min(vpos / sum, this.maxY);
                            }
                            if (isFinite(vneg)) {
                                vneg = Math.max(vneg / sum, this.minY);
                            }
                        }
                    }
                }
                this.stackAbs = stackAbs;
            };

            _DataInfo.prototype.getMinY = function () {
                return this.minY;
            };

            _DataInfo.prototype.getMaxY = function () {
                return this.maxY;
            };

            _DataInfo.prototype.getMinX = function () {
                return this.minX;
            };

            _DataInfo.prototype.getMaxX = function () {
                return this.maxX;
            };

            _DataInfo.prototype.getDeltaX = function () {
                return this.dx;
            };

            _DataInfo.prototype.getDataTypeX = function () {
                return this.dataTypeX;
            };

            _DataInfo.prototype.getDataTypeY = function () {
                return this.dataTypeY;
            };

            _DataInfo.prototype.getStackedAbsSum = function (key) {
                var sum = this.stackAbs[key];
                return isFinite(sum) ? sum : 0;
            };

            _DataInfo.prototype.getXVals = function () {
                return this._xvals;
            };

            _DataInfo.isValid = function (value) {
                return isFinite(value);
            };
            return _DataInfo;
        })();

        

        

        /**
        * Base class for chart plotters of all types (bar, line, area).
        */
        var _BasePlotter = (function () {
            function _BasePlotter() {
                this._DEFAULT_WIDTH = 2;
                this._DEFAULT_SYM_SIZE = 10;
                this.clipping = true;
            }
            _BasePlotter.prototype.clear = function () {
                this.seriesCount = 0;
                this.seriesIndex = 0;
            };

            _BasePlotter.prototype.getNumOption = function (name, parent) {
                var options = this.chart.options;
                if (parent) {
                    options = options ? options[parent] : null;
                }
                if (options && options[name]) {
                    return wijmo.asNumber(options[name], true);
                }
                return undefined;
            };

            _BasePlotter.prototype.cloneStyle = function (style, ignore) {
                if (!style) {
                    return style;
                }
                var newStyle = {};

                for (var key in style) {
                    if (ignore && ignore.indexOf(key) >= 0) {
                        continue;
                    }
                    newStyle[key] = style[key];
                }

                return newStyle;
            };

            _BasePlotter.prototype.isValid = function (datax, datay, ax, ay) {
                return _DataInfo.isValid(datax) && _DataInfo.isValid(datay) && FlexChart._contains(this.chart._plotRect, new wijmo.Point(datax, datay));
            };
            return _BasePlotter;
        })();

        /**
        * Bar/column chart plotter.
        */
        var _BarPlotter = (function (_super) {
            __extends(_BarPlotter, _super);
            function _BarPlotter() {
                _super.apply(this, arguments);
                this.origin = 0;
                this.width = 0.7;
                //isColumn = false;
                this.stackPosMap = {};
                this.stackNegMap = {};
                this.stacking = 0 /* None */;
            }
            _BarPlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
                this.dataInfo = dataInfo;

                var xmin = dataInfo.getMinX();
                var ymin = dataInfo.getMinY();
                var xmax = dataInfo.getMaxX();
                var ymax = dataInfo.getMaxY();

                var dx = dataInfo.getDeltaX();
                if (dx <= 0) {
                    dx = 1;
                }

                if (this.rotated) {
                    if (this.origin > ymax) {
                        ymax = this.origin;
                    } else if (this.origin < ymin) {
                        ymin = this.origin;
                    }
                    return new wijmo.Rect(ymin, xmin - 0.5 * dx, ymax - ymin, xmax - xmin + dx);
                } else {
                    if (this.origin > ymax) {
                        ymax = this.origin;
                    } else if (this.origin < ymin) {
                        ymin = this.origin;
                    }
                    return new wijmo.Rect(xmin - 0.5 * dx, ymin, xmax - xmin + dx, ymax - ymin);
                }
            };

            _BarPlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                var si = this.chart.series.indexOf(series);
                var ser = series;
                var options = this.chart.options;
                var cw = this.width;
                var wpx = 0;

                if (options && options.groupWidth) {
                    var gw = options.groupWidth;
                    if (wijmo.isNumber(gw)) {
                        // px
                        var gwn = wijmo.asNumber(gw);
                        if (isFinite(gwn) && gwn > 0) {
                            wpx = gwn;
                            cw = 1;
                        }
                    } else if (wijmo.isString(gw)) {
                        var gws = wijmo.asString(gw);

                        // %
                        if (gws && gws.indexOf('%') >= 0) {
                            gws = gws.replace('%', '');
                            var gwn = parseFloat(gws);
                            if (isFinite(gwn)) {
                                if (gwn < 0) {
                                    gwn = 0;
                                } else if (gwn > 100) {
                                    gwn = 100;
                                }
                                wpx = 0;
                                cw = gwn / 100;
                            }
                        } else {
                            // px
                            var gwn = parseFloat(gws);
                            if (isFinite(gwn) && gwn > 0) {
                                wpx = gwn;
                                cw = 1;
                            }
                        }
                    }
                }

                //var cw = this.getNumOption("clusterWidth");
                //if (cw == undefined || cw <= 0 || cw > 1) {
                //    cw = this.width;
                //}
                var w = cw / nser;

                var axid = ser._getAxisY()._uniqueId;

                if (iser == 0) {
                    this.stackNegMap[axid] = {};
                    this.stackPosMap[axid] = {};
                }
                var stackNeg = this.stackNegMap[axid];
                var stackPos = this.stackPosMap[axid];

                var yvals = series.getValues(0);
                var xvals = series.getValues(1);

                if (!yvals) {
                    return;
                }

                if (!xvals) {
                    xvals = this.dataInfo.getXVals();
                }

                if (xvals) {
                    // find mininmal distance between point and use it as column width
                    var delta = this.dataInfo.getDeltaX();
                    if (delta > 0) {
                        cw *= delta;
                        w *= delta;
                    }
                }

                // set series fill and stroke from style
                var style = series.style, fill = null, stroke = null;
                if (style) {
                    if (style.fill) {
                        fill = style.fill;
                    }
                    if (style.stroke) {
                        stroke = style.stroke;
                    }
                }

                // get colors not provided from palette
                if (!fill) {
                    fill = palette._getColorLight(si);
                }
                if (!stroke) {
                    stroke = palette._getColor(si);
                }

                // apply fill and stroke
                engine.fill = fill;
                engine.stroke = stroke;

                var len = yvals.length;
                if (xvals != null) {
                    len = Math.min(len, xvals.length);
                }
                var origin = this.origin;

                //var symClass = FlexChart._CSS_SERIES_ITEM;
                var itemIndex = 0;

                if (!this.rotated) {
                    if (origin < ay.actualMin) {
                        origin = ay.actualMin;
                    } else if (origin > ay.actualMax) {
                        origin = ay.actualMax;
                    }

                    var originScreen = ay.convert(origin);

                    for (var i = 0; i < len; i++) {
                        var datax = xvals ? xvals[i] : i;
                        var datay = yvals[i];

                        if (_DataInfo.isValid(datax) && _DataInfo.isValid(datay)) {
                            if (this.stacking != 0 /* None */ && !ser._isCustomAxisY()) {
                                var x0 = ax.convert(datax - 0.5 * cw);
                                var x1 = ax.convert(datax + 0.5 * cw);
                                var y0, y1;

                                if (this.stacking == 2 /* Stacked100pc */) {
                                    var sumabs = this.dataInfo.getStackedAbsSum(datax);
                                    datay = datay / sumabs;
                                }

                                var sum = 0;
                                if (datay > 0) {
                                    sum = isNaN(stackPos[datax]) ? 0 : stackPos[datax];
                                    y0 = ay.convert(sum);
                                    y1 = ay.convert(sum + datay);
                                    stackPos[datax] = sum + datay;
                                } else {
                                    sum = isNaN(stackNeg[datax]) ? 0 : stackNeg[datax];
                                    y0 = ay.convert(sum);
                                    y1 = ay.convert(sum + datay);
                                    stackNeg[datax] = sum + datay;
                                }

                                var rect = new wijmo.Rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
                                if (wpx > 0) {
                                    var ratio = 1 - wpx / rect.width;
                                    if (ratio < 0) {
                                        ratio = 0;
                                    }
                                    var xc = rect.left + 0.5 * rect.width;
                                    rect.left += (xc - rect.left) * ratio;
                                    rect.width = Math.min(wpx, rect.width);
                                }

                                var area = new RectArea(rect);

                                //engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
                                this.drawSymbol(engine, rect, series, i, new wijmo.Point(rect.left + 0.5 * rect.width, y1));
                                series._setPointIndex(i, itemIndex);
                                itemIndex++;

                                area.tag = new DataPoint(si, i, datax, sum + datay);
                                this.hitTester.add(area, si);
                            } else {
                                var x0 = ax.convert(datax - 0.5 * cw + iser * w), x1 = ax.convert(datax - 0.5 * cw + (iser + 1) * w), y = ay.convert(datay), rect = new wijmo.Rect(Math.min(x0, x1), Math.min(y, originScreen), Math.abs(x1 - x0), Math.abs(originScreen - y));

                                if (wpx > 0) {
                                    var sw = wpx / nser;
                                    var ratio = 1 - sw / rect.width;
                                    if (ratio < 0) {
                                        ratio = 0;
                                    }
                                    var xc = ax.convert(datax);
                                    rect.left += (xc - rect.left) * ratio;
                                    rect.width = Math.min(sw, rect.width);
                                }

                                var area = new RectArea(rect);

                                //engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
                                this.drawSymbol(engine, rect, series, i, new wijmo.Point(rect.left + 0.5 * rect.width, y));
                                series._setPointIndex(i, itemIndex);
                                itemIndex++;

                                area.tag = new DataPoint(si, i, datax, datay);
                                this.hitTester.add(area, si);
                            }
                        }
                    }
                } else {
                    if (origin < ax.actualMin) {
                        origin = ax.actualMin;
                    } else if (origin > ax.actualMax) {
                        origin = ax.actualMax;
                    }

                    var originScreen = ax.convert(origin);

                    for (var i = 0; i < len; i++) {
                        var datax = xvals ? xvals[i] : i, datay = yvals[i];

                        if (_DataInfo.isValid(datax) && _DataInfo.isValid(datay)) {
                            if (this.stacking != 0 /* None */) {
                                var y0 = ay.convert(datax - 0.5 * cw);
                                var y1 = ay.convert(datax + 0.5 * cw);
                                var x0, x1;

                                if (this.stacking == 2 /* Stacked100pc */) {
                                    var sumabs = this.dataInfo.getStackedAbsSum(datax);
                                    datay = datay / sumabs;
                                }

                                var sum = 0;
                                if (datay > 0) {
                                    sum = isNaN(stackPos[datax]) ? 0 : stackPos[datax];
                                    x0 = ax.convert(sum);
                                    x1 = ax.convert(sum + datay);
                                    stackPos[datax] = sum + datay;
                                } else {
                                    sum = isNaN(stackNeg[datax]) ? 0 : stackNeg[datax];
                                    x0 = ax.convert(sum);
                                    x1 = ax.convert(sum + datay);
                                    stackNeg[datax] = sum + datay;
                                }

                                var rect = new wijmo.Rect(Math.min(x0, x1), Math.min(y0, y1), Math.abs(x1 - x0), Math.abs(y1 - y0));
                                if (wpx > 0) {
                                    var ratio = 1 - wpx / rect.height;
                                    if (ratio < 0) {
                                        ratio = 0;
                                    }
                                    var yc = rect.top + 0.5 * rect.height;
                                    rect.top += (yc - rect.top) * ratio;
                                    rect.height = Math.min(wpx, rect.height);
                                }

                                var area = new RectArea(rect);

                                //engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
                                this.drawSymbol(engine, rect, series, i, new wijmo.Point(x1, rect.top + 0.5 * rect.height));
                                series._setPointIndex(i, itemIndex);
                                itemIndex++;

                                area.tag = new DataPoint(si, i, sum + datay, datax);
                                this.hitTester.add(area, si);
                            } else {
                                var y0 = ay.convert(datax - 0.5 * cw + iser * w), y1 = ay.convert(datax - 0.5 * cw + (iser + 1) * w), x = ax.convert(datay), rect = new wijmo.Rect(Math.min(x, originScreen), Math.min(y0, y1), Math.abs(originScreen - x), Math.abs(y1 - y0));

                                if (wpx > 0) {
                                    var sw = wpx / nser;
                                    var ratio = 1 - sw / rect.height;
                                    if (ratio < 0) {
                                        ratio = 0;
                                    }
                                    var yc = ay.convert(datax);
                                    rect.top += (yc - rect.top) * ratio;
                                    rect.height = Math.min(sw, rect.height);
                                }

                                var area = new RectArea(rect);

                                //engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
                                this.drawSymbol(engine, rect, series, i, new wijmo.Point(x, rect.top + 0.5 * rect.height));
                                series._setPointIndex(i, itemIndex);
                                itemIndex++;

                                area.tag = new DataPoint(si, i, datay, datax);
                                this.hitTester.add(area, si);
                            }
                        }
                    }
                }
            };

            _BarPlotter.prototype.drawSymbol = function (engine, rect, series, pointIndex, point) {
                var _this = this;
                if (this.chart.itemFormatter) {
                    engine.startGroup();
                    var hti = new _chart.HitTestInfo(this.chart, point);
                    hti._chartElement = 8 /* SeriesSymbol */;
                    hti._pointIndex = pointIndex;
                    hti._series = series;

                    this.chart.itemFormatter(engine, hti, function () {
                        _this.drawDefaultSymbol(engine, rect, series);
                    });
                    engine.endGroup();
                } else {
                    this.drawDefaultSymbol(engine, rect, series);
                }
            };

            _BarPlotter.prototype.drawDefaultSymbol = function (engine, rect, series) {
                engine.drawRect(rect.left, rect.top, rect.width, rect.height, null, series.symbolStyle);
            };
            return _BarPlotter;
        })(_BasePlotter);

        /**
        * Line/scatter chart plotter.
        */
        var _LinePlotter = (function (_super) {
            __extends(_LinePlotter, _super);
            function _LinePlotter() {
                _super.call(this);
                this.hasSymbols = false;
                this.hasLines = true;
                this.isSpline = false;
                this.stacking = 0 /* None */;
                this.stackPos = {};
                this.stackNeg = {};
                this.clipping = false;
            }
            _LinePlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
                this.dataInfo = dataInfo;
                var xmin = dataInfo.getMinX();
                var ymin = dataInfo.getMinY();
                var xmax = dataInfo.getMaxX();
                var ymax = dataInfo.getMaxY();

                if (this.isSpline) {
                    var dy = 0.1 * (ymax - ymin);
                    ymin -= dy;
                    ymax += dy;
                }

                return this.rotated ? new wijmo.Rect(ymin, xmin, ymax - ymin, xmax - xmin) : new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
            };

            _LinePlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                var ser = wijmo.asType(series, _chart.Series);
                var si = this.chart.series.indexOf(series);
                if (iser == 0) {
                    this.stackNeg = {};
                    this.stackPos = {};
                }

                var ys = series.getValues(0);
                var xs = series.getValues(1);
                if (!ys) {
                    return;
                }
                if (!xs) {
                    xs = this.dataInfo.getXVals();
                }

                var style = this.cloneStyle(series.style, ['fill']);
                var len = ys.length;
                var hasXs = true;
                if (!xs) {
                    hasXs = false;
                    xs = new Array(len);
                } else {
                    len = Math.min(len, xs.length);
                }

                var swidth = this._DEFAULT_WIDTH;
                var fill = null;
                var stroke = null;
                var symSize = ser._getSymbolSize();

                if (fill === null) {
                    fill = palette._getColorLight(si);
                }
                if (stroke === null) {
                    stroke = palette._getColor(si);
                }

                engine.stroke = stroke;
                engine.strokeWidth = swidth;
                engine.fill = fill;

                var xvals = new Array();
                var yvals = new Array();

                var rotated = this.rotated;
                var stacked = this.stacking != 0 /* None */ && !ser._isCustomAxisY();
                var stacked100 = this.stacking == 2 /* Stacked100pc */ && !ser._isCustomAxisY();

                var interpolateNulls = this.chart.interpolateNulls;
                var hasNulls = false;

                for (var i = 0; i < len; i++) {
                    var datax = hasXs ? xs[i] : i;
                    var datay = ys[i];

                    if (_DataInfo.isValid(datax) && _DataInfo.isValid(datay)) {
                        if (stacked) {
                            if (stacked100) {
                                var sumabs = this.dataInfo.getStackedAbsSum(datax);
                                datay = datay / sumabs;
                            }

                            if (datay >= 0) {
                                var sum = isNaN(this.stackPos[datax]) ? 0 : this.stackPos[datax];
                                datay = this.stackPos[datax] = sum + datay;
                            } else {
                                var sum = isNaN(this.stackNeg[datax]) ? 0 : this.stackNeg[datax];
                                datay = this.stackNeg[datax] = sum + datay;
                            }
                        }

                        var dpt;

                        if (rotated) {
                            dpt = new DataPoint(si, i, datay, datax);
                            var x = ax.convert(datay);
                            datay = ay.convert(datax);
                            datax = x;
                        } else {
                            dpt = new DataPoint(si, i, datax, datay);
                            datax = ax.convert(datax);
                            datay = ay.convert(datay);
                        }
                        xvals.push(datax);
                        yvals.push(datay);

                        //if (this.hasSymbols) {
                        //    this.drawSymbol(engine, datax, datay, symSize, symSize, symClass + i.toString());
                        //}
                        var area = new CircleArea(new wijmo.Point(datax, datay), 0.5 * symSize);
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    } else {
                        hasNulls = true;
                        if (interpolateNulls !== true) {
                            xvals.push(undefined);
                            yvals.push(undefined);
                        }
                    }
                }

                var itemIndex = 0;

                if (this.hasLines) {
                    engine.fill = null;

                    if (hasNulls && interpolateNulls !== true) {
                        var dx = [];
                        var dy = [];

                        for (var i = 0; i < len; i++) {
                            if (xvals[i] === undefined) {
                                if (dx.length > 1) {
                                    this._drawLines(engine, dx, dy, null, style, this.chart._plotrectId);
                                    this.hitTester.add(new LinesArea(dx, dy), si);
                                    itemIndex++;
                                }
                                dx = [];
                                dy = [];
                            } else {
                                dx.push(xvals[i]);
                                dy.push(yvals[i]);
                            }
                        }
                        if (dx.length > 1) {
                            this._drawLines(engine, dx, dy, null, style, this.chart._plotrectId);
                            this.hitTester.add(new LinesArea(dx, dy), si);
                            itemIndex++;
                        }
                    } else {
                        this._drawLines(engine, xvals, yvals, null, style, this.chart._plotrectId);
                        this.hitTester.add(new LinesArea(xvals, yvals), si);
                        itemIndex++;
                    }
                }

                if ((this.hasSymbols || this.chart.itemFormatter) && symSize > 0) {
                    engine.fill = fill;
                    for (var i = 0; i < len; i++) {
                        var datax = xvals[i];
                        var datay = yvals[i];

                        //if (DataInfo.isValid(datax) && DataInfo.isValid(datay)) {
                        if (this.isValid(datax, datay, ax, ay)) {
                            this._drawSymbol(engine, datax, datay, symSize, ser, i);
                            series._setPointIndex(i, itemIndex);
                            itemIndex++;
                        }
                    }
                }
            };

            _LinePlotter.prototype._drawLines = function (engine, xs, ys, className, style, clipPath) {
                if (this.isSpline) {
                    engine.drawSplines(xs, ys, className, style, clipPath);
                } else {
                    engine.drawLines(xs, ys, className, style, clipPath);
                }
            };

            _LinePlotter.prototype._drawSymbol = function (engine, x, y, sz, series, pointIndex) {
                var _this = this;
                if (this.chart.itemFormatter) {
                    engine.startGroup();
                    var hti = new _chart.HitTestInfo(this.chart, new wijmo.Point(x, y));
                    hti._chartElement = 8 /* SeriesSymbol */;
                    hti._pointIndex = pointIndex;
                    hti._series = series;

                    this.chart.itemFormatter(engine, hti, function () {
                        if (_this.hasSymbols) {
                            _this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                        }
                    });
                    engine.endGroup();
                } else {
                    this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                }
            };

            _LinePlotter.prototype._drawDefaultSymbol = function (engine, x, y, sz, marker, style) {
                if (marker == 0 /* Dot */) {
                    engine.drawEllipse(x, y, 0.5 * sz, 0.5 * sz, null, style);
                } else if (marker == 1 /* Box */) {
                    engine.drawRect(x - 0.5 * sz, y - 0.5 * sz, sz, sz, null, style);
                }
            };
            return _LinePlotter;
        })(_BasePlotter);

        /**
        * Area chart plotter.
        */
        var _AreaPlotter = (function (_super) {
            __extends(_AreaPlotter, _super);
            function _AreaPlotter() {
                _super.call(this);
                this.stacking = 0 /* None */;
                this.isSpline = false;
                this.stackPos = {};
                this.stackNeg = {};
                //this.clipping = false;
            }
            _AreaPlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
                this.dataInfo = dataInfo;
                var xmin = dataInfo.getMinX();
                var ymin = dataInfo.getMinY();
                var xmax = dataInfo.getMaxX();
                var ymax = dataInfo.getMaxY();

                if (this.isSpline) {
                    var dy = 0.1 * (ymax - ymin);
                    ymin -= dy;
                    ymax += dy;
                }

                if (this.rotated) {
                    return new wijmo.Rect(ymin, xmin, ymax - ymin, xmax - xmin);
                } else {
                    return new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                }
            };

            _AreaPlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                var si = this.chart.series.indexOf(series);
                var ser = series;
                if (iser == 0) {
                    this.stackNeg = {};
                    this.stackPos = {};
                }

                var ys = series.getValues(0);
                var xs = series.getValues(1);

                if (!ys) {
                    return;
                }

                var len = ys.length;

                if (!xs)
                    xs = this.dataInfo.getXVals();

                var hasXs = true;
                if (!xs) {
                    hasXs = false;
                    xs = new Array(len);
                } else if (xs.length < len) {
                    len = xs.length;
                }

                var xvals = new Array();
                var yvals = new Array();

                var xvals0 = new Array();
                var yvals0 = new Array();

                var stacked = this.stacking != 0 /* None */ && !ser._isCustomAxisY();
                var stacked100 = this.stacking == 2 /* Stacked100pc */ && !ser._isCustomAxisY();
                var rotated = this.rotated;

                var hasNulls = false;
                var interpolateNulls = this.chart.interpolateNulls;

                var xmax = null;
                var xmin = null;

                var prect = this.chart._plotRect;

                for (var i = 0; i < len; i++) {
                    var datax = hasXs ? xs[i] : i;
                    var datay = ys[i];
                    if (xmax === null || datax > xmax) {
                        xmax = datax;
                    }
                    if (xmin === null || datax < xmin) {
                        xmin = datax;
                    }
                    if (_DataInfo.isValid(datax) && _DataInfo.isValid(datay)) {
                        var x = rotated ? ay.convert(datax) : ax.convert(datax);
                        if (stacked) {
                            if (stacked100) {
                                var sumabs = this.dataInfo.getStackedAbsSum(datax);
                                datay = datay / sumabs;
                            }

                            var sum = 0;

                            if (datay >= 0) {
                                sum = isNaN(this.stackPos[datax]) ? 0 : this.stackPos[datax];
                                datay = this.stackPos[datax] = sum + datay;
                            } else {
                                sum = isNaN(this.stackNeg[datax]) ? 0 : this.stackNeg[datax];
                                datay = this.stackNeg[datax] = sum + datay;
                            }

                            if (rotated) {
                                if (sum < ax.actualMin) {
                                    sum = ax.actualMin;
                                }
                                xvals0.push(ax.convert(sum));
                                yvals0.push(x);
                            } else {
                                xvals0.push(x);
                                if (sum < ay.actualMin) {
                                    sum = ay.actualMin;
                                }
                                yvals0.push(ay.convert(sum));
                            }
                        }
                        if (rotated) {
                            var y = ax.convert(datay);
                            xvals.push(y);
                            yvals.push(x);
                            if (FlexChart._contains(prect, new wijmo.Point(y, x))) {
                                var area = new CircleArea(new wijmo.Point(y, x), this._DEFAULT_SYM_SIZE);
                                area.tag = new DataPoint(si, i, datay, datax);
                                this.hitTester.add(area, si);
                            }
                        } else {
                            var y = ay.convert(datay);
                            xvals.push(x);
                            yvals.push(y);
                            if (FlexChart._contains(prect, new wijmo.Point(x, y))) {
                                var area = new CircleArea(new wijmo.Point(x, y), this._DEFAULT_SYM_SIZE);
                                area.tag = new DataPoint(si, i, datax, datay);
                                this.hitTester.add(area, si);
                            }
                        }
                    } else {
                        hasNulls = true;
                        if (!stacked && interpolateNulls !== true) {
                            xvals.push(undefined);
                            yvals.push(undefined);
                        }
                    }
                }

                var swidth = this._DEFAULT_WIDTH;
                var fill = palette._getColorLight(si);
                var stroke = palette._getColor(si);

                var lstyle = this.cloneStyle(series.style, ['fill']);
                var pstyle = this.cloneStyle(series.style, ['stroke']);

                if (!stacked && interpolateNulls !== true && hasNulls) {
                    var dx = [];
                    var dy = [];

                    for (var i = 0; i < len; i++) {
                        if (xvals[i] === undefined) {
                            if (dx.length > 1) {
                                if (this.isSpline) {
                                    var s = this._convertToSpline(xvals, yvals);
                                    xvals = s.xs;
                                    yvals = s.ys;
                                }

                                engine.stroke = stroke;
                                engine.strokeWidth = swidth;
                                engine.fill = 'none';
                                engine.drawLines(dx, dy, null, lstyle);
                                this.hitTester.add(new LinesArea(dx, dy), si);

                                if (rotated) {
                                    dx.push(ax.convert(ax.actualMin), ax.convert(ax.actualMin));
                                    dy.push(ay.convert(ay.actualMax), ay.convert(ay.actualMin));
                                } else {
                                    dx.push(dx[dx.length - 1], dx[0]);
                                    dy.push(ay.convert(ay.actualMin), ay.convert(ay.actualMin));
                                }
                                engine.fill = fill;
                                engine.stroke = 'none';
                                engine.drawPolygon(dx, dy, null, pstyle);
                            }
                            dx = [];
                            dy = [];
                        } else {
                            dx.push(xvals[i]);
                            dy.push(yvals[i]);
                        }
                    }
                    if (dx.length > 1) {
                        if (this.isSpline) {
                            var s = this._convertToSpline(xvals, yvals);
                            xvals = s.xs;
                            yvals = s.ys;
                        }

                        engine.stroke = stroke;
                        engine.strokeWidth = swidth;
                        engine.fill = 'none';
                        engine.drawLines(dx, dy, null, lstyle);
                        this.hitTester.add(new LinesArea(dx, dy), si);

                        if (rotated) {
                            dx.push(ax.convert(ax.actualMin), ax.convert(ax.actualMin));
                            dy.push(ay.convert(ay.actualMax), ay.convert(ay.actualMin));
                        } else {
                            dx.push(dx[dx.length - 1], dx[0]);
                            dy.push(ay.convert(ay.actualMin), ay.convert(ay.actualMin));
                        }
                        engine.fill = fill;
                        engine.stroke = 'none';
                        engine.drawPolygon(dx, dy, null, pstyle);
                    }
                } else {
                    //
                    if (this.isSpline) {
                        var s = this._convertToSpline(xvals, yvals);
                        xvals = s.xs;
                        yvals = s.ys;
                    }

                    //
                    if (stacked) {
                        if (this.isSpline) {
                            var s0 = this._convertToSpline(xvals0, yvals0);
                            xvals0 = s0.xs;
                            yvals0 = s0.ys;
                        }

                        xvals = xvals.concat(xvals0.reverse());
                        yvals = yvals.concat(yvals0.reverse());
                    } else {
                        if (rotated) {
                            xvals.push(ax.convert(ax.actualMin), ax.convert(ax.actualMin));
                            yvals.push(ay.convert(xmax), ay.convert(xmin));
                        } else {
                            xvals.push(ax.convert(xmax), ax.convert(xmin));
                            yvals.push(ay.convert(ay.actualMin), ay.convert(ay.actualMin));
                        }
                    }

                    engine.fill = fill;
                    engine.stroke = 'none';
                    engine.drawPolygon(xvals, yvals, null, pstyle);

                    if (stacked) {
                        xvals = xvals.slice(0, xvals.length - xvals0.length);
                        yvals = yvals.slice(0, yvals.length - yvals0.length);
                    } else {
                        xvals = xvals.slice(0, xvals.length - 2);
                        yvals = yvals.slice(0, yvals.length - 2);
                    }

                    engine.stroke = stroke;
                    engine.strokeWidth = swidth;
                    engine.fill = 'none';
                    engine.drawLines(xvals, yvals, null, lstyle);
                    this.hitTester.add(new LinesArea(xvals, yvals), si);
                }

                this._drawSymbols(engine, series, si);
            };

            _AreaPlotter.prototype._convertToSpline = function (x, y) {
                if (x && y) {
                    var spline = new _chart._Spline(x, y);
                    var s = spline.calculate();
                    return { xs: s.xs, ys: s.ys };
                } else {
                    return { xs: x, ys: y };
                }
            };

            _AreaPlotter.prototype._drawSymbols = function (engine, series, seriesIndex) {
                if (this.chart.itemFormatter != null) {
                    var areas = this.hitTester._map[seriesIndex];
                    for (var i = 0; i < areas.length; i++) {
                        var area = wijmo.tryCast(areas[i], CircleArea);
                        if (area) {
                            var dpt = area.tag;
                            engine.startGroup();
                            var hti = new _chart.HitTestInfo(this.chart, area.center);
                            hti._chartElement = 8 /* SeriesSymbol */;
                            hti._pointIndex = dpt.pointIndex;
                            hti._series = series;
                            this.chart.itemFormatter(engine, hti, function () {
                            });
                            engine.endGroup();
                        }
                    }
                }
            };
            return _AreaPlotter;
        })(_BasePlotter);

        var _BubblePlotter = (function (_super) {
            __extends(_BubblePlotter, _super);
            function _BubblePlotter() {
                _super.call(this);
                this._MIN_SIZE = 5;
                this._MAX_SIZE = 30;
                this.hasLines = false;
                this.hasSymbols = true;
                this.clipping = true;
            }
            _BubblePlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
                var minSize = this.getNumOption('minSize', 'bubble');
                this._minSize = minSize ? minSize : this._MIN_SIZE;
                var maxSize = this.getNumOption('maxSize', 'bubble');
                this._maxSize = maxSize ? maxSize : this._MAX_SIZE;

                var series = this.chart.series;
                var len = series.length;

                var min = NaN;
                var max = NaN;
                for (var i = 0; i < len; i++) {
                    var ser = series[i];
                    var vals = ser._getBindingValues(1);
                    if (vals) {
                        var vlen = vals.length;
                        for (var j = 0; j < vlen; j++) {
                            if (_DataInfo.isValid(vals[j])) {
                                if (isNaN(min) || vals[j] < min) {
                                    min = vals[j];
                                }
                                if (isNaN(max) || vals[j] > max) {
                                    max = vals[j];
                                }
                            }
                        }
                    }
                }
                this._minValue = min;
                this._maxValue = max;

                var rect = _super.prototype.adjustLimits.call(this, dataInfo, plotRect);

                var w = plotRect.width - this._maxSize;
                var kw = w / rect.width;
                rect.left -= this._maxSize * 0.5 / kw;
                rect.width += this._maxSize / kw;

                var h = plotRect.height - this._maxSize;
                var kh = h / rect.height;
                rect.top -= this._maxSize * 0.5 / kh;
                rect.height += this._maxSize / kh;

                return rect;
            };

            _BubblePlotter.prototype._drawSymbol = function (engine, x, y, sz, series, pointIndex) {
                var _this = this;
                var item = series._getItem(pointIndex);
                if (item) {
                    var szBinding = series._getBinding(1);
                    if (szBinding) {
                        var sz = item[szBinding];
                        if (_DataInfo.isValid(sz)) {
                            var k = this._minValue == this._maxValue ? 1 : Math.sqrt((sz - this._minValue) / (this._maxValue - this._minValue));
                            sz = this._minSize + (this._maxSize - this._minSize) * k;

                            if (this.chart.itemFormatter) {
                                var hti = new _chart.HitTestInfo(this.chart, new wijmo.Point(x, y));
                                hti._chartElement = 8 /* SeriesSymbol */;
                                hti._pointIndex = pointIndex;
                                hti._series = series;

                                engine.startGroup();
                                this.chart.itemFormatter(engine, hti, function () {
                                    _this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                                });
                                engine.endGroup();
                            } else {
                                this._drawDefaultSymbol(engine, x, y, sz, series.symbolMarker, series.symbolStyle);
                            }
                        }
                    }
                }
            };
            return _BubblePlotter;
        })(_LinePlotter);

        var _FinancePlotter = (function (_super) {
            __extends(_FinancePlotter, _super);
            function _FinancePlotter() {
                _super.apply(this, arguments);
                this.isCandle = true;
            }
            _FinancePlotter.prototype.adjustLimits = function (dataInfo, plotRect) {
                this.dataInfo = dataInfo;
                var xmin = dataInfo.getMinX();
                var ymin = dataInfo.getMinY();
                var xmax = dataInfo.getMaxX();
                var ymax = dataInfo.getMaxY();

                var series = this.chart.series;
                var len = series.length;

                for (var i = 0; i < len; i++) {
                    var ser = series[i];
                    if (ser._isCustomAxisY()) {
                        continue;
                    }

                    var bndLow = ser._getBinding(1), bndOpen = ser._getBinding(2), bndClose = ser._getBinding(3);

                    var slen = ser._getLength();
                    if (slen) {
                        for (var j = 0; j < slen; j++) {
                            var item = ser._getItem(j);
                            if (item) {
                                var yvals = [
                                    bndLow ? item[bndLow] : null,
                                    bndOpen ? item[bndOpen] : null,
                                    bndClose ? item[bndClose] : null];

                                yvals.forEach(function (yval) {
                                    if (_DataInfo.isValid(yval) && yval !== null) {
                                        if (isNaN(ymin) || yval < ymin) {
                                            ymin = yval;
                                        }
                                        if (isNaN(ymax) || yval > ymax) {
                                            ymax = yval;
                                        }
                                    }
                                });
                            }
                        }
                    }
                }

                return new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
            };

            _FinancePlotter.prototype.plotSeries = function (engine, ax, ay, series, palette, iser, nser) {
                var _this = this;
                var ser = wijmo.asType(series, _chart.Series);
                var si = this.chart.series.indexOf(series);

                var highs = series.getValues(0);
                var xs = series.getValues(1);

                if (!highs) {
                    return;
                }

                if (!xs) {
                    xs = this.dataInfo.getXVals();
                }

                var style = this.cloneStyle(series.style, null);
                var len = highs.length;
                var hasXs = true;
                if (!xs) {
                    hasXs = false;
                    xs = new Array(len);
                } else {
                    len = Math.min(len, xs.length);
                }

                var swidth = this._DEFAULT_WIDTH;
                var fill = null;
                var stroke = null;
                var symSize = ser._getSymbolSize();
                var symStyle = series.symbolStyle;

                if (symStyle) {
                    fill = symStyle.fill;
                    stroke = symStyle.stroke;
                }

                if (style) {
                    if (fill === null) {
                        fill = style.fill;
                    }
                    if (stroke === null) {
                        stroke = style.stroke;
                    }
                }

                if (fill === null) {
                    fill = palette._getColorLight(si);
                }
                if (stroke === null) {
                    stroke = palette._getColor(si);
                }

                engine.stroke = stroke;
                engine.strokeWidth = swidth;
                engine.fill = fill;

                var bndLow = ser._getBinding(1);
                var bndOpen = ser._getBinding(2);
                var bndClose = ser._getBinding(3);

                var xmin = ax.actualMin, xmax = ax.actualMax;

                var itemIndex = 0;
                for (var i = 0; i < len; i++) {
                    var item = ser._getItem(i);
                    if (item) {
                        var x = hasXs ? xs[i] : i;

                        if (_DataInfo.isValid(x) && xmin <= x && x <= xmax) {
                            var hi = highs[i];
                            var lo = bndLow ? item[bndLow] : null;
                            var open = bndOpen ? item[bndOpen] : null;
                            var close = bndClose ? item[bndClose] : null;

                            engine.startGroup();

                            var currentFill = open < close ? 'transparent' : fill;

                            if (this.chart.itemFormatter) {
                                var hti = new _chart.HitTestInfo(this.chart, new wijmo.Point(ax.convert(x), ay.convert(hi)));
                                hti._chartElement = 8 /* SeriesSymbol */;
                                hti._pointIndex = i;
                                hti._series = ser;

                                this.chart.itemFormatter(engine, hti, function () {
                                    _this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close);
                                });
                            } else {
                                this._drawSymbol(engine, ax, ay, si, i, currentFill, symSize, x, hi, lo, open, close);
                            }
                            engine.endGroup();

                            series._setPointIndex(i, itemIndex);
                            itemIndex++;
                        }
                    }
                }
            };

            _FinancePlotter.prototype._drawSymbol = function (engine, ax, ay, si, pi, fill, w, x, hi, lo, open, close) {
                var dpt = new DataPoint(si, pi, x, hi);
                var area;
                x = ax.convert(x);
                if (this.isCandle) {
                    var y0 = null, y1 = null;
                    if (_DataInfo.isValid(open) && _DataInfo.isValid(close)) {
                        engine.fill = fill;
                        open = ay.convert(open);
                        close = ay.convert(close);
                        y0 = Math.min(open, close);
                        y1 = y0 + Math.abs(open - close);
                        engine.drawRect(x - 0.5 * w, y0, w, y1 - y0);
                        area = new RectArea(new wijmo.Rect(x - 0.5 * w, y0, w, y1 - y0));
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    }
                    if (_DataInfo.isValid(hi)) {
                        hi = ay.convert(hi);
                        if (y0 !== null) {
                            engine.drawLine(x, y0, x, hi);
                        }
                    }
                    if (_DataInfo.isValid(lo)) {
                        lo = ay.convert(lo);
                        if (y1 !== null) {
                            engine.drawLine(x, y1, x, lo);
                        }
                    }
                } else {
                    if (_DataInfo.isValid(hi) && _DataInfo.isValid(lo)) {
                        hi = ay.convert(hi);
                        lo = ay.convert(lo);
                        engine.drawLine(x, lo, x, hi);
                        area = new RectArea(new wijmo.Rect(x - 0.5 * w, Math.min(hi, lo), w, Math.abs(hi - lo)));
                        area.tag = dpt;
                        this.hitTester.add(area, si);
                    }
                    if (_DataInfo.isValid(open)) {
                        open = ay.convert(open);
                        engine.drawLine(x - 0.5 * w, open, x, open);
                    }
                    if (_DataInfo.isValid(close)) {
                        close = ay.convert(close);
                        engine.drawLine(x, close, x + 0.5 * w, close);
                    }
                }
            };
            return _FinancePlotter;
        })(_BasePlotter);

        var DataPoint = (function () {
            function DataPoint(seriesIndex, pointIndex, dataX, dataY) {
                this._seriesIndex = seriesIndex;
                this._pointIndex = pointIndex;
                this._dataX = dataX;
                this._dataY = dataY;
            }
            Object.defineProperty(DataPoint.prototype, "seriesIndex", {
                get: function () {
                    return this._seriesIndex;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DataPoint.prototype, "pointIndex", {
                get: function () {
                    return this._pointIndex;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DataPoint.prototype, "dataX", {
                get: function () {
                    return this._dataX;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(DataPoint.prototype, "dataY", {
                get: function () {
                    return this._dataY;
                },
                enumerable: true,
                configurable: true
            });
            return DataPoint;
        })();

        var MeasureOption;
        (function (MeasureOption) {
            MeasureOption[MeasureOption["X"] = 0] = "X";
            MeasureOption[MeasureOption["Y"] = 1] = "Y";
            MeasureOption[MeasureOption["XY"] = 2] = "XY";
        })(MeasureOption || (MeasureOption = {}));

        var RectArea = (function () {
            function RectArea(rect) {
                this._rect = rect;
            }
            RectArea.prototype.contains = function (pt) {
                var rect = this._rect;
                return pt.x >= rect.left && pt.x <= rect.right && pt.y >= rect.top && pt.y <= rect.bottom;
            };

            RectArea.prototype.pointDistance = function (pt1, pt2, option) {
                var dx = pt2.x - pt1.x;
                var dy = pt2.y - pt1.y;
                if (option == 0 /* X */) {
                    return Math.abs(dx);
                } else if (option == 1 /* Y */) {
                    return Math.abs(dy);
                }

                return Math.sqrt(dx * dx + dy * dy);
            };

            RectArea.prototype.distance = function (pt) {
                var option = 2 /* XY */;
                if (pt.x === null) {
                    option = 1 /* Y */;
                } else if (pt.y === null) {
                    option = 0 /* X */;
                }

                var rect = this._rect;
                if (pt.x < rect.left) {
                    if (pt.y < rect.top) {
                        return this.pointDistance(pt, new wijmo.Point(rect.left, rect.top), option);
                    } else if (pt.y > rect.bottom) {
                        return this.pointDistance(pt, new wijmo.Point(rect.left, rect.bottom), option);
                    } else {
                        if (option == 1 /* Y */) {
                            return 0;
                        }
                        return rect.left - pt.x;
                    }
                } else if (pt.x > rect.right) {
                    if (pt.y < rect.top) {
                        return this.pointDistance(pt, new wijmo.Point(rect.right, rect.top), option);
                    } else if (pt.y > rect.bottom) {
                        return this.pointDistance(pt, new wijmo.Point(rect.right, rect.bottom), option);
                    } else {
                        if (option == 1 /* Y */) {
                            return 0;
                        }

                        return pt.x - rect.right;
                    }
                } else {
                    if (option == 0 /* X */) {
                        return 0;
                    }

                    if (pt.y < rect.top) {
                        return rect.top - pt.y;
                    } else if (pt.y > rect.bottom) {
                        return pt.y - rect.bottom;
                    } else {
                        return 0;
                    }
                }
            };
            return RectArea;
        })();

        var CircleArea = (function () {
            function CircleArea(center, radius) {
                this._center = center;
                this._rad = radius;
                this._rad2 = radius * radius;
            }
            Object.defineProperty(CircleArea.prototype, "center", {
                get: function () {
                    return this._center;
                },
                enumerable: true,
                configurable: true
            });

            CircleArea.prototype.contains = function (pt) {
                var dx = this._center.x - pt.x;
                var dy = this._center.y - pt.y;
                return dx * dx + dy * dy <= this._rad2;
            };

            CircleArea.prototype.distance = function (pt) {
                //var dx = pt.x !== null ? this._center.x - pt.x : 0;
                //var dy = pt.y !== null ? this._center.y - pt.y : 0;
                var dx = !isNaN(pt.x) ? this._center.x - pt.x : 0;
                var dy = !isNaN(pt.y) ? this._center.y - pt.y : 0;

                var d2 = dx * dx + dy * dy;

                if (d2 <= this._rad2)
                    return 0;
                else
                    return Math.sqrt(d2) - this._rad;
            };
            return CircleArea;
        })();

        var LinesArea = (function () {
            function LinesArea(x, y) {
                this._x = [];
                this._y = [];
                this._x = x;
                this._y = y;
            }
            LinesArea.prototype.contains = function (pt) {
                return false;
            };

            LinesArea.prototype.distance = function (pt) {
                var dmin = NaN;
                for (var i = 0; i < this._x.length - 1; i++) {
                    var d = FlexChart._dist(pt, new wijmo.Point(this._x[i], this._y[i]), new wijmo.Point(this._x[i + 1], this._y[i + 1]));
                    if (isNaN(dmin) || d < dmin) {
                        dmin = d;
                    }
                }

                return dmin;
            };
            return LinesArea;
        })();

        var HitResult = (function () {
            function HitResult() {
            }
            return HitResult;
        })();

        var HitTester = (function () {
            function HitTester() {
                this._map = {};
            }
            //private _areas = new Array<IHitArea>();
            HitTester.prototype.add = function (area, seriesIndex) {
                if (!this._map[seriesIndex]) {
                    this._map[seriesIndex] = new Array();
                }
                if (!area.tag) {
                    area.tag = new DataPoint(seriesIndex, NaN, NaN, NaN);
                }
                this._map[seriesIndex].push(area);
            };

            HitTester.prototype.clear = function () {
                this._map = {};
            };

            HitTester.prototype.hitTest = function (pt, testLines) {
                if (typeof testLines === "undefined") { testLines = false; }
                var closest = null;
                var dist = Number.MAX_VALUE;

                for (var key in this._map) {
                    var areas = this._map[key];
                    if (areas) {
                        var len = areas.length;

                        for (var i = len - 1; i >= 0; i--) {
                            var area = areas[i];
                            if (wijmo.tryCast(area, LinesArea) && !testLines) {
                                continue;
                            }

                            var d = area.distance(pt);
                            if (d < dist) {
                                dist = d;
                                closest = area;
                                if (dist == 0)
                                    break;
                            }
                        }

                        if (dist == 0)
                            break;
                    }
                }

                if (closest) {
                    var hr = new HitResult();
                    hr.area = closest;
                    hr.distance = dist;
                    return hr;
                }

                return null;
            };

            HitTester.prototype.hitTestSeries = function (pt, seriesIndex) {
                var closest = null;
                var dist = Number.MAX_VALUE;

                var areas = this._map[seriesIndex];
                if (areas) {
                    var len = areas.length;

                    for (var i = len - 1; i >= 0; i--) {
                        var area = areas[i];

                        var d = area.distance(pt);
                        if (d < dist) {
                            dist = d;
                            closest = area;
                            if (dist == 0)
                                break;
                        }
                    }
                }

                if (closest) {
                    var hr = new HitResult();
                    hr.area = closest;
                    hr.distance = dist;
                    return hr;
                }

                return null;
            };
            return HitTester;
        })();

        /**
        * Extends the @see:Tooltip class to provide chart tooltips.
        */
        var ChartTooltip = (function (_super) {
            __extends(ChartTooltip, _super);
            /**
            * Initializes a new instance of a @see:ChartTooltip.
            */
            function ChartTooltip() {
                _super.call(this);
                this._content = '<b>{seriesName}</b><br/>{x} {y}';
                this._threshold = 15;
            }
            Object.defineProperty(ChartTooltip.prototype, "content", {
                /**
                * Gets or sets the tooltip content.
                */
                get: function () {
                    return this._content;
                },
                set: function (value) {
                    if (value != this._content) {
                        this._content = value;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(ChartTooltip.prototype, "threshold", {
                /**
                * Gets or sets the maximum distance from the element to display the tooltip.
                */
                get: function () {
                    return this._threshold;
                },
                set: function (value) {
                    if (value != this._threshold) {
                        this._threshold = wijmo.asNumber(value);
                    }
                },
                enumerable: true,
                configurable: true
            });
            return ChartTooltip;
        })(wijmo.Tooltip);
        _chart.ChartTooltip = ChartTooltip;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=FlexChart.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (chart) {
        'use strict';

        /**
        * Specifies the position of an axis or legend on the chart.
        */
        (function (Position) {
            /** The item is not visible. */
            Position[Position["None"] = 0] = "None";

            /** The item appears to the left of the chart. */
            Position[Position["Left"] = 1] = "Left";

            /** The item appears above the chart. */
            Position[Position["Top"] = 2] = "Top";

            /** The item appears to the right of the chart. */
            Position[Position["Right"] = 3] = "Right";

            /** The item appears below the chart. */
            Position[Position["Bottom"] = 4] = "Bottom";
        })(chart.Position || (chart.Position = {}));
        var Position = chart.Position;
        ;

        /**
        * Specifies the axis type.
        */
        (function (AxisType) {
            /** Category axis (normally horizontal). */
            AxisType[AxisType["X"] = 0] = "X";

            /** Value axis (normally vertical). */
            AxisType[AxisType["Y"] = 1] = "Y";
        })(chart.AxisType || (chart.AxisType = {}));
        var AxisType = chart.AxisType;

        

        /**
        * Specifies whether and where axis tick marks appear.
        */
        (function (TickMark) {
            /** No tick marks appear. */
            TickMark[TickMark["None"] = 0] = "None";

            /** Tick marks appear outside the plot area. */
            TickMark[TickMark["Outside"] = 1] = "Outside";

            /** Tick marks appear inside the plot area. */
            TickMark[TickMark["Inside"] = 2] = "Inside";

            /** Tick marks cross the axis. */
            TickMark[TickMark["Cross"] = 3] = "Cross";
        })(chart.TickMark || (chart.TickMark = {}));
        var TickMark = chart.TickMark;

        /**
        * Represents an axis in the chart.
        */
        var Axis = (function () {
            /**
            * Initializes a new instance of an @see:Axis object.
            *
            * @param position The position of the axis on the chart.
            */
            function Axis(position) {
                this._GRIDLINE_WIDTH = 0.25;
                this._LINE_WIDTH = 1;
                this._TICK_WIDTH = 1;
                this._TICK_HEIGHT = 4;
                this._TICK_OVERLAP = 1;
                this._TICK_LABEL_DISTANCE = 4;
                this._majorGrid = false;
                this._minorGrid = false;
                this._labels = true;
                this._axisLine = true;
                this._isTimeAxis = false;
                this._fgColor = 'black';
                this.__uniqueId = Axis._id++;

                this._position = position;
                if (position == 4 /* Bottom */ || position == 2 /* Top */) {
                    this._axisType = 0 /* X */;
                } else {
                    this._axisType = 1 /* Y */;
                    this._axisLine = false;
                }

                this._minorTickMarks = 0 /* None */;
            }
            Object.defineProperty(Axis.prototype, "actualMin", {
                //--------------------------------------------------------------------------
                //** object model
                /**
                * Gets the actual axis minimum.
                */
                get: function () {
                    return this._actualMin;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "actualMax", {
                /**
                * Gets the actual axis maximum.
                */
                get: function () {
                    return this._actualMax;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "min", {
                /**
                * Gets or sets the minimum value shown on the axis.
                * If not set, the minimum is calculated automatically.
                */
                get: function () {
                    return this._min;
                },
                set: function (value) {
                    this._min = wijmo.asNumber(value, true);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "max", {
                /**
                * Gets or sets the maximum value shown on the axis.
                * If not set, the maximum is calculated automatically.
                */
                get: function () {
                    return this._max;
                },
                set: function (value) {
                    this._max = wijmo.asNumber(value, true);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "reversed", {
                /**
                * Gets or sets a value indicating whether the axis is
                * reversed (top to bottom or right to left).
                */
                get: function () {
                    return this._reversed;
                },
                set: function (value) {
                    this._reversed = wijmo.asBoolean(value);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "position", {
                /**
                * Gets or sets the enumerated axis position.
                */
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    if (value != this._position) {
                        this._position = wijmo.asEnum(value, Position, false);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "majorUnit", {
                /**
                * Gets or sets the number of units between axis labels.
                *
                * If the axis contains date values, then the units are
                * expressed in days.
                */
                get: function () {
                    return this._majorUnit;
                },
                set: function (value) {
                    if (value != this._majorUnit) {
                        this._majorUnit = wijmo.asNumber(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "minorUnit", {
                /**
                * Gets or sets the number of units between minor axis ticks.
                *
                * If the axis contains date values, then the units are
                * expressed in days.
                */
                get: function () {
                    return this._minorUnit;
                },
                set: function (value) {
                    if (value != this._minorUnit) {
                        this._minorUnit = wijmo.asNumber(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "name", {
                /**
                * Gets or sets the axis name.
                */
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    if (value != this._name) {
                        this._name = wijmo.asString(value, true);
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "title", {
                /**
                * Gets or sets the title text shown next to the axis.
                */
                get: function () {
                    return this._title;
                },
                set: function (value) {
                    if (value != this._title) {
                        this._title = wijmo.asString(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "format", {
                /**
                * Gets or sets the format string used for axis labels
                * (see @see:wijmo.Globalize).
                */
                get: function () {
                    return this._format;
                },
                set: function (value) {
                    if (value != this._format) {
                        this._format = wijmo.asString(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "majorGrid", {
                //
                /**
                * Gets or sets a value indicating whether the axis includes grid lines.
                */
                get: function () {
                    return this._majorGrid;
                },
                set: function (value) {
                    if (value != this._majorGrid) {
                        this._majorGrid = wijmo.asBoolean(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "majorTickMarks", {
                /**
                * Gets or sets the location of axis tick marks.
                */
                get: function () {
                    return this._majorTickMarks;
                },
                set: function (value) {
                    if (value != this._majorTickMarks) {
                        this._majorTickMarks = wijmo.asEnum(value, TickMark, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "minorGrid", {
                /**
                * Gets or sets a value indicating whether the axis includes minor grid lines.
                */
                get: function () {
                    return this._minorGrid;
                },
                set: function (value) {
                    if (value != this._minorGrid) {
                        this._minorGrid = wijmo.asBoolean(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "minorTickMarks", {
                /**
                * Gets or sets the location of minor axis tick marks.
                */
                get: function () {
                    return this._minorTickMarks;
                },
                set: function (value) {
                    if (value != this._minorTickMarks) {
                        this._minorTickMarks = wijmo.asEnum(value, TickMark, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "axisLine", {
                /**
                * Gets or sets a value indicating whether the axis line is visible.
                */
                get: function () {
                    return this._axisLine;
                },
                set: function (value) {
                    if (value != this._axisLine) {
                        this._axisLine = wijmo.asBoolean(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "labels", {
                /**
                * Gets or sets a value indicating whether axis labels are visible.
                */
                get: function () {
                    return this._labels;
                },
                set: function (value) {
                    if (value != this._labels) {
                        this._labels = wijmo.asBoolean(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "labelAngle", {
                /**
                * Gets or sets the rotation angle of axis labels.
                *
                * The angle is measured in degrees with valid values
                * ranging from -90 to 90.
                */
                get: function () {
                    return this._labelAngle;
                },
                set: function (value) {
                    if (value != this._labelAngle) {
                        this._labelAngle = wijmo.asNumber(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Axis.prototype, "origin", {
                /**
                * Gets or sets the axis origin.
                **/
                get: function () {
                    return this._origin;
                },
                set: function (value) {
                    if (value != this._origin) {
                        this._origin = wijmo.asNumber(value, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            //--------------------------------------------------------------------------
            // implementation
            /**
            * Calculates the axis height.
            *
            * @param engine Rendering engine.
            */
            Axis.prototype._getHeight = function (engine) {
                var lblClass = chart.FlexChart._CSS_LABEL;
                var titleClass = chart.FlexChart._CSS_TITLE;

                var range = this._actualMax - this._actualMin;
                var prec = this._nicePrecision(range);
                if (prec < 0 || prec > 15)
                    prec = 0;

                var delta = 0.1 * range;

                var lbls = this._lbls;

                if (this.labels) {
                    if (lbls != null && lbls.length > 0) {
                        this._annoSize = new wijmo.Size();
                        for (var i = 0; i < lbls.length; i++) {
                            var sz = engine.measureString(lbls[i], lblClass);
                            if (sz.width > this._annoSize.width)
                                this._annoSize.width = sz.width;
                            if (sz.height > this._annoSize.height)
                                this._annoSize.height = sz.height;
                        }
                    } else {
                        var text = this._formatValue(this._actualMin - delta);
                        var sz = engine.measureString(text, lblClass);
                        this._annoSize = sz;

                        text = this._formatValue(this._actualMax + delta);

                        sz = engine.measureString(text, lblClass);
                        if (sz.width > this._annoSize.width) {
                            this._annoSize.width = sz.width;
                        }
                        if (sz.height > this._annoSize.height)
                            this._annoSize.height = sz.height;
                    }
                    if (this.labelAngle) {
                        var a = this.labelAngle * Math.PI / 180, w = this._annoSize.width, h = this._annoSize.height;

                        this._annoSize.width = w * Math.abs(Math.cos(a)) + h * Math.abs(Math.sin(a));
                        this._annoSize.height = w * Math.abs(Math.sin(a)) + h * Math.abs(Math.cos(a));
                    }
                } else {
                    this._annoSize = new wijmo.Size();
                }

                var h = 2;

                if (this._axisType == 0 /* X */) {
                    h += this._annoSize.height;
                } else {
                    h += this._annoSize.width + this._TICK_LABEL_DISTANCE + 2;
                }

                var th = this._TICK_HEIGHT;
                var tover = this._TICK_OVERLAP;

                if (tickMarks == 1 /* Outside */) {
                    tover = 1;
                } else if (tickMarks == 2 /* Inside */) {
                    tover = -1;
                } else if (tickMarks == 3 /* Cross */) {
                    tover = 0;
                }

                var tickMarks = this.majorTickMarks;
                if (tickMarks === undefined || tickMarks === null) {
                    tickMarks = 1 /* Outside */;
                }

                if (tickMarks != 0 /* None */) {
                    h += 0.5 * (1 + tover) * th;
                }

                if (this._title) {
                    text = this._title;
                    this._szTitle = engine.measureString(text, titleClass);
                    h += this._szTitle.height;
                }

                engine.fontSize = null;

                return h;
            };

            /**
            * Update actual axis limits based on specified data range.
            *
            * @param dataType Data type.
            * @param dataMin Data minimum.
            * @param dataMax Data maximum.
            * @param labels Category labels(category axis).
            * @param values Values(value axis).
            */
            Axis.prototype._updateActualLimits = function (dataType, dataMin, dataMax, labels, values) {
                if (typeof labels === "undefined") { labels = null; }
                if (typeof values === "undefined") { values = null; }
                this._isTimeAxis = (dataType == 4 /* Date */);
                var ctype = this._chart.chartType;
                if (labels && labels.length > 0 && !this._isTimeAxis && ctype != 0 /* Column */ && ctype != 1 /* Bar */) {
                    dataMin -= 0.5;
                    dataMax += 0.5;
                }
                this._actualMin = this._min != null ? this._min : dataMin;
                this._actualMax = this._max != null ? this._max : dataMax;
                this._lbls = labels;
                this._values = values;

                // todo: validate min&max
                if (this._actualMin == this._actualMax) {
                    this._actualMin -= 0.5;
                    this._actualMax += 0.5;
                }
            };

            /**
            * Set axis position.
            *
            * @param axisRect Axis rectangle.
            * @param plotRect Plot area rectangle.
            */
            Axis.prototype._layout = function (axisRect, plotRect) {
                var isVert = this.axisType == 1 /* Y */;
                var isNear = this._position != 2 /* Top */ && this._position != 3 /* Right */;

                this._plotrect = plotRect;

                if (isVert)
                    this._axrect = new wijmo.Rect(axisRect.left, axisRect.top, axisRect.height, axisRect.width);
                else
                    this._axrect = axisRect;
            };

            /**
            * Render the axis.
            *
            * @param engine Rendering engine.
            */
            Axis.prototype._render = function (engine) {
                if (this.position == 0 /* None */) {
                    return;
                }

                var lblClass = chart.FlexChart._CSS_LABEL;
                var titleClass = chart.FlexChart._CSS_TITLE;
                var lineClass = chart.FlexChart._CSS_LINE;
                var glineClass = chart.FlexChart._CSS_GRIDLINE;
                var tickClass = chart.FlexChart._CSS_TICK;
                var labelAngle = 0;
                if (this.labelAngle) {
                    labelAngle = this.labelAngle;
                    if (labelAngle > 90) {
                        labelAngle = 90;
                    } else if (labelAngle < -90) {
                        labelAngle = -90;
                    }
                }

                var isVert = this.axisType == 1 /* Y */;
                var isNear = this._position != 2 /* Top */ && this._position != 3 /* Right */;

                var fg = this._fgColor;
                var fontSize = null;

                var range = this._actualMax - this._actualMin;

                if (!isNaN(range)) {
                    var delta = this._calcMajorUnit();
                    if (delta == 0)
                        delta = this._niceTickNumber(range) * 0.1;

                    var len = Math.floor(range / delta) + 1;
                    var vals = [];
                    var lbls = [];

                    var st = Math.floor(this._actualMin / delta) * delta;
                    if (st < this._actualMin)
                        st += delta;

                    var isCategory = false;

                    // labels
                    if (this._lbls && this._lbls.length > 0) {
                        isCategory = true;
                        lbls = this._lbls; // category
                        for (var i = 0; i < lbls.length; i++) {
                            vals.push(i);
                        }
                    } else if (this._isTimeAxis) {
                        this._createTimeLabels(st, len, vals, lbls); // time
                    } else {
                        this._createLabels(st, len, delta, vals, lbls); // numeric
                    }

                    len = Math.min(vals.length, lbls.length);

                    engine.textFill = fg;

                    var th = this._TICK_HEIGHT;
                    var tth = this._TICK_WIDTH;
                    var tover = this._TICK_OVERLAP;
                    var tstroke = fg;

                    var tickMarks = this.majorTickMarks;
                    if (tickMarks === undefined || tickMarks === null) {
                        tickMarks = 1 /* Outside */;
                    }

                    var gth = this._GRIDLINE_WIDTH;
                    var gstroke = fg;

                    if (tickMarks == 1 /* Outside */) {
                        tover = 1;
                    } else if (tickMarks == 2 /* Inside */) {
                        tover = -1;
                    } else if (tickMarks == 3 /* Cross */) {
                        tover = 0;
                    }

                    var t1 = 0.5 * (tover - 1) * th;
                    var t2 = 0.5 * (1 + tover) * th;

                    for (var i = 0; i < len; i++) {
                        var val = vals[i];
                        var sval = lbls[i];
                        var showLabel = this.labels;
                        if (showLabel && isCategory && this.majorUnit) {
                            if (i % this.majorUnit != 0) {
                                showLabel = false;
                            }
                        }

                        if (val >= this._actualMin && val <= this._actualMax) {
                            var has_gline = val != this._actualMin && val != this._actualMin && this.majorGrid;
                            if (isVert) {
                                var y = this.convert(val);

                                if (has_gline) {
                                    engine.stroke = gstroke;
                                    engine.strokeWidth = gth;
                                    engine.drawLine(this._plotrect.left, y, this._plotrect.right, y, glineClass);
                                }

                                engine.stroke = tstroke;
                                engine.strokeWidth = tth;
                                if (isNear) {
                                    if (tickMarks != 0 /* None */) {
                                        engine.drawLine(this._axrect.right - t1, y, this._axrect.right - t2, y, tickClass);
                                    }
                                    if (showLabel) {
                                        var lpt = new wijmo.Point(this._axrect.right - t2 - this._TICK_LABEL_DISTANCE, y);
                                        if (labelAngle > 0) {
                                            if (labelAngle == 90) {
                                                chart.FlexChart._renderRotatedText(engine, sval, lpt, 1, 0, lpt, labelAngle, lblClass);
                                            } else {
                                                chart.FlexChart._renderRotatedText(engine, sval, lpt, 2, 1, lpt, labelAngle, lblClass);
                                            }
                                        } else if (labelAngle < 0) {
                                            if (labelAngle == -90) {
                                                chart.FlexChart._renderRotatedText(engine, sval, lpt, 1, 2, lpt, labelAngle, lblClass);
                                            } else {
                                                chart.FlexChart._renderRotatedText(engine, sval, lpt, 2, 1, lpt, labelAngle, lblClass);
                                            }
                                        } else {
                                            chart.FlexChart._renderText(engine, sval, lpt, 2, 1, lblClass);
                                        }
                                    }
                                } else {
                                    if (tickMarks != 0 /* None */) {
                                        engine.drawLine(this._axrect.left + t1, y, this._axrect.left + t2, y, tickClass);
                                    }
                                    if (showLabel) {
                                        var lpt = new wijmo.Point(this._axrect.left + t2 + this._TICK_LABEL_DISTANCE, y);
                                        if (labelAngle > 0) {
                                            if (labelAngle == 90) {
                                                chart.FlexChart._renderRotatedText(engine, sval, lpt, 1, 2, lpt, labelAngle, lblClass);
                                            } else {
                                                chart.FlexChart._renderRotatedText(engine, sval, lpt, 0, 1, lpt, labelAngle, lblClass);
                                            }
                                        } else if (labelAngle < 0) {
                                            if (labelAngle == -90) {
                                                chart.FlexChart._renderRotatedText(engine, sval, lpt, 1, 0, lpt, labelAngle, lblClass);
                                            } else {
                                                chart.FlexChart._renderRotatedText(engine, sval, lpt, 0, 1, lpt, labelAngle, lblClass);
                                            }
                                        } else {
                                            chart.FlexChart._renderText(engine, sval, lpt, 0, 1, lblClass);
                                        }
                                    }
                                }
                            } else {
                                var x = this.convert(val);

                                if (has_gline) {
                                    engine.stroke = gstroke;
                                    engine.strokeWidth = gth;
                                    engine.drawLine(x, this._plotrect.top, x, this._plotrect.bottom, glineClass);
                                }

                                engine.stroke = tstroke;
                                engine.strokeWidth = tth;
                                if (isNear) {
                                    if (showLabel) {
                                        var lpt = new wijmo.Point(x, this._axrect.top + t2);
                                        if (labelAngle != 0) {
                                            var sz = engine.measureString(sval, lblClass);
                                            if (labelAngle != 90 && labelAngle != -90) {
                                                lpt.y += 0.5 * sz.height * Math.abs(Math.sin(labelAngle * Math.PI / 180));
                                            }
                                            if (labelAngle > 0) {
                                                chart.FlexChart._renderRotatedText(engine, sval, lpt, 0, 1, lpt, labelAngle, lblClass);
                                            } else if (labelAngle < 0) {
                                                chart.FlexChart._renderRotatedText(engine, sval, lpt, 2, 1, lpt, labelAngle, lblClass);
                                            }
                                        } else {
                                            chart.FlexChart._renderText(engine, sval, lpt, 1, 0, lblClass);
                                        }
                                    }

                                    if (tickMarks != 0 /* None */) {
                                        if (isCategory) {
                                            val = val - 0.5;
                                            if (val >= this._actualMin && val <= this._actualMax) {
                                                x = this.convert(val);
                                                engine.drawLine(x, this._axrect.top + t1, x, this._axrect.top + t2, tickClass);
                                            }
                                            if (i == len - 1) {
                                                val = val + 1;
                                                if (val >= this._actualMin && val <= this._actualMax) {
                                                    x = this.convert(val);
                                                    engine.drawLine(x, this._axrect.top + t1, x, this._axrect.top + t2, tickClass);
                                                }
                                            }
                                        } else {
                                            x = this.convert(val);
                                            engine.drawLine(x, this._axrect.top + t1, x, this._axrect.top + t2, tickClass);
                                        }
                                    }
                                } else {
                                    if (showLabel) {
                                        var lpt = new wijmo.Point(x, this._axrect.bottom - t2);
                                        if (labelAngle != 0) {
                                            var sz = engine.measureString(sval, lblClass);
                                            if (labelAngle != 90 && labelAngle != -90) {
                                                lpt.y -= 0.5 * sz.height * Math.abs(Math.sin(labelAngle * Math.PI / 180));
                                            }
                                            if (labelAngle > 0) {
                                                chart.FlexChart._renderRotatedText(engine, sval, lpt, 2, 1, lpt, labelAngle, lblClass);
                                            } else if (labelAngle < 0) {
                                                chart.FlexChart._renderRotatedText(engine, sval, lpt, 0, 1, lpt, labelAngle, lblClass);
                                            }
                                        } else {
                                            chart.FlexChart._renderText(engine, sval, lpt, 1, 2, lblClass);
                                        }
                                    }

                                    if (tickMarks != 0 /* None */) {
                                        if (isCategory) {
                                            val = val - 0.5;
                                            if (val >= this._actualMin && val <= this._actualMax) {
                                                x = this.convert(val);
                                                engine.drawLine(x, this._axrect.bottom - t1, x, this._axrect.bottom - t2, tickClass);
                                            }
                                            if (i == len - 1) {
                                                val = val + 1;
                                                if (val >= this._actualMin && val <= this._actualMax) {
                                                    x = this.convert(val);
                                                    engine.drawLine(x, this._axrect.bottom - t1, x, this._axrect.bottom - t2, tickClass);
                                                }
                                            }
                                        } else {
                                            x = this.convert(val);
                                            engine.drawLine(x, this._axrect.bottom - t1, x, this._axrect.bottom - t2, tickClass);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }

                if (!isCategory && (this.minorGrid || this.minorTickMarks != 0 /* None */)) {
                    this._renderMinorTicksGrid(engine, vals, isVert, isNear, tickClass);
                }

                engine.stroke = fg;
                engine.fontSize = fontSize;

                // line and title
                if (isVert) {
                    if (isNear) {
                        if (this._title) {
                            var center = new wijmo.Point(this._axrect.left + this._szTitle.height * 0.5, this._axrect.top + 0.5 * this._axrect.height);
                            chart.FlexChart._renderRotatedText(engine, this._title, center, 1, 1, center, -90, titleClass);
                        }

                        if (this.axisLine) {
                            engine.drawLine(this._axrect.right, this._axrect.top, this._axrect.right, this._axrect.bottom, lineClass);
                        }
                    } else {
                        if (this._title) {
                            var center = new wijmo.Point(this._axrect.right - this._szTitle.height * 0.5, this._axrect.top + 0.5 * this._axrect.height);
                            chart.FlexChart._renderRotatedText(engine, this._title, center, 1, 1, center, 90, titleClass);
                        }

                        if (this.axisLine) {
                            engine.drawLine(this._axrect.left, this._axrect.top, this._axrect.left, this._axrect.bottom, lineClass);
                        }
                    }
                } else {
                    if (isNear) {
                        if (this.axisLine) {
                            engine.drawLine(this._axrect.left, this._axrect.top, this._axrect.right, this._axrect.top, lineClass);
                        }

                        if (this._title) {
                            chart.FlexChart._renderText(engine, this._title, new wijmo.Point(this._axrect.left + 0.5 * this._axrect.width, this._axrect.bottom), 1, 2, titleClass);
                        }
                    } else {
                        if (this.axisLine) {
                            engine.drawLine(this._axrect.left, this._axrect.bottom, this._axrect.right, this._axrect.bottom, lineClass);
                        }

                        if (this._title) {
                            chart.FlexChart._renderText(engine, this._title, new wijmo.Point(this._axrect.left + 0.5 * this._axrect.width, this._axrect.top), 1, 0, titleClass);
                        }
                    }
                }

                engine.stroke = null;
                engine.fontSize = null;
                engine.textFill = null;
                engine.strokeWidth = null;
            };

            Axis.prototype._renderMinorTicksGrid = function (engine, vals, isVert, isNear, tickClass) {
                if (vals && vals.length > 1) {
                    var delta = vals[1] - vals[0];
                    var minorUnit = wijmo.isNumber(this.minorUnit) ? this.minorUnit : delta * 0.5;

                    var ticks = [];

                    for (var val = vals[0]; val > this._actualMin; val -= minorUnit) {
                        if (vals.indexOf(val) == -1)
                            ticks.push(val);
                    }

                    for (var val = vals[0] + minorUnit; val < this._actualMax; val += minorUnit) {
                        if (vals.indexOf(val) == -1)
                            ticks.push(val);
                    }

                    var th = this._TICK_HEIGHT;
                    var tth = this._TICK_WIDTH;
                    var tover = this._TICK_OVERLAP;
                    var tstroke = this._fgColor;

                    var tickMarks = this.minorTickMarks;
                    var hasTicks = true;

                    if (tickMarks == 1 /* Outside */) {
                        tover = 1;
                    } else if (tickMarks == 2 /* Inside */) {
                        tover = -1;
                    } else if (tickMarks == 3 /* Cross */) {
                        tover = 0;
                    } else {
                        hasTicks = false;
                    }

                    var t1 = 0.5 * (tover - 1) * th;
                    var t2 = 0.5 * (1 + tover) * th;

                    var cnt = ticks.length;

                    var grid = this.minorGrid;
                    var prect = this._plotrect;

                    var gth = this._GRIDLINE_WIDTH;
                    var gstroke = this._fgColor;

                    // css
                    var glineClass = chart.FlexChart._CSS_GRIDLINE_MINOR;
                    var tickClass = chart.FlexChart._CSS_TICK_MINOR;

                    for (var i = 0; i < cnt; i++) {
                        if (isVert) {
                            var y = this.convert(ticks[i]);

                            if (hasTicks) {
                                engine.stroke = tstroke;
                                engine.strokeWidth = tth;

                                if (isNear) {
                                    engine.drawLine(this._axrect.right - t1, y, this._axrect.right - t2, y, tickClass);
                                } else {
                                    engine.drawLine(this._axrect.left + t1, y, this._axrect.left + t2, y, tickClass);
                                }
                            }

                            if (grid) {
                                engine.stroke = gstroke;
                                engine.strokeWidth = gth;
                                engine.drawLine(prect.left, y, prect.right, y, glineClass);
                            }
                        } else {
                            var x = this.convert(ticks[i]);

                            if (hasTicks) {
                                engine.stroke = tstroke;
                                engine.strokeWidth = tth;

                                if (isNear) {
                                    engine.drawLine(x, this._axrect.top + t1, x, this._axrect.top + t2, tickClass);
                                } else {
                                    engine.drawLine(x, this._axrect.bottom - t1, x, this._axrect.bottom - t2, tickClass);
                                }
                            }

                            if (grid) {
                                engine.stroke = gstroke;
                                engine.strokeWidth = gth;
                                engine.drawLine(x, prect.top, x, prect.bottom, glineClass);
                            }
                        }
                    }
                }
            };

            /**
            * Converts the specified value from data to pixel coordinates.
            *
            * @param val The data value to convert.
            */
            Axis.prototype.convert = function (val) {
                if (this._actualMax == this._actualMin) {
                    return 0;
                }

                var x = this._axrect.left;
                var w = this._axrect.width;
                var y = this._axrect.top;
                var h = this._axrect.height;

                 {
                    if (this._reversed) {
                        if (this.axisType == 1 /* Y */) {
                            return y + (val - this._actualMin) / (this._actualMax - this._actualMin) * h;
                        } else {
                            return x + w - (val - this._actualMin) / (this._actualMax - this._actualMin) * w;
                        }
                    } else {
                        if (this.axisType == 1 /* Y */) {
                            return y + h - (val - this._actualMin) / (this._actualMax - this._actualMin) * h;
                        } else {
                            return x + (val - this._actualMin) / (this._actualMax - this._actualMin) * w;
                        }
                    }
                }
                /*else
                {
                if (val <= 0)
                return NaN;
                
                if (ReversedInternal) {
                if (_axis.AxisType == AxisType.Y)
                return Math.Log(val / _min, logbase) / Math.Log(_max / _min, logbase) * Width;
                else
                return Width - Math.Log(val / _min, logbase) / Math.Log(_max / _min, logbase) * Width;
                } else {
                if (_axis.AxisType == AxisType.Y)
                return Width - Math.Log(val / _min, logbase) / Math.Log(_max / _min, logbase) * Width;
                else
                return Math.Log(val / _min, logbase) / Math.Log(_max / _min, logbase) * Width;
                }
                }*/
            };

            /**
            * Converts the specified value from pixel to data coordinates.
            *
            * @param val The pixel coordinates to convert back.
            */
            Axis.prototype.convertBack = function (val) {
                if (this._actualMax == this._actualMin) {
                    return 0;
                }

                var x = this._plotrect.left;
                var w = this._plotrect.width;
                var y = this._plotrect.top;
                var h = this._plotrect.height;

                var range = this._actualMax - this._actualMin;

                 {
                    if (this._reversed) {
                        if (this.axisType == 1 /* Y */) {
                            return this._actualMin + (val - y) * range / h;
                        } else {
                            return this._actualMin + (x + w - val) * range / w;
                        }
                    } else {
                        if (this.axisType == 1 /* Y */) {
                            return this._actualMax - (val - y) * range / h;
                        } else {
                            return this._actualMin + (val - x) * range / w;
                        }
                    }
                }
            };

            Object.defineProperty(Axis.prototype, "axisType", {
                /**
                * Gets the axis type.
                */
                get: function () {
                    return this._axisType;
                },
                enumerable: true,
                configurable: true
            });

            //---------------------------------------------------------------------
            // private
            Axis.prototype._invalidate = function () {
                if (this._chart) {
                    this._chart.invalidate();
                }
            };

            Axis.prototype._createLabels = function (start, len, delta, vals, lbls) {
                for (var i = 0; i < len; i++) {
                    var val0 = (start + delta * i).toFixed(14);
                    var val = parseFloat(val0);

                    //if (val > max)
                    //  break;
                    var sval = this._formatValue(val);

                    vals.push(val);
                    lbls.push(sval);
                }
            };

            Axis.prototype._createTimeLabels = function (start, len, vals, lbls) {
                var min = this._actualMin;
                var max = this._actualMax;
                var dtmin0 = chart.FlexChart._fromOADate(this._actualMin);
                var dtmax0 = chart.FlexChart._fromOADate(this._actualMax);

                var fmt = this._format;

                //if (string.IsNullOrEmpty(fmt))
                // fmt = TimeAxis.GetTimeDefaultFormat(max, min);
                var anum = this._getAnnoNumber(this._axisType == 1 /* Y */);

                // alext 10-Jan-2010
                // better precision
                var td = (24.0 * 3600.0 * (this._actualMax - this._actualMin) / anum);

                var range = new _timeSpan(td * _timeSpan.TicksPerSecond);

                var delta = isNaN(this._majorUnit) ? _timeHelper.NiceTimeSpan(range, fmt) : _timeSpan.fromDays(this._majorUnit);

                var delta_ticks = delta.Ticks;

                var newmin = _timeHelper.RoundTime(min, delta.TotalDays, false);
                if (isFinite(newmin))
                    min = newmin;
                var newmax = _timeHelper.RoundTime(max, delta.TotalDays, true);
                if (isFinite(newmax))
                    max = newmax;

                var dtmin = chart.FlexChart._fromOADate(min);
                var dtmax = chart.FlexChart._fromOADate(max);

                if (delta.TotalDays >= 365 && isNaN(this._majorUnit)) {
                    dtmin = new Date(dtmin0.getFullYear(), 1, 1);
                    if (dtmin < dtmin0)
                        //dtmin = dtmin.AddYears(1);
                        dtmin.setFullYear(dtmin.getFullYear() + 1);

                    var years = (delta.TotalDays / 365);
                    years = years - (years % 1);

                    for (var current = dtmin; current <= dtmax0; current.setFullYear(current.getFullYear() + years)) {
                        var val = chart.FlexChart._toOADate(current);
                        vals.push(val);
                        lbls.push(this._formatValue(val));
                    }
                } else if (delta.TotalDays >= 30 && isNaN(this._majorUnit)) {
                    dtmin = new Date(dtmin0.getFullYear(), dtmin0.getMonth(), 1);
                    if (dtmin < dtmin0)
                        //dtmin = dtmin.AddMonths(1);
                        dtmin.setMonth(dtmin.getMonth() + 1);

                    var nmonths = delta.TotalDays / 30;
                    nmonths = nmonths - (nmonths % 1);

                    for (var current = dtmin; current <= dtmax0; current.setMonth(current.getMonth() + nmonths)) {
                        var val = chart.FlexChart._toOADate(current);
                        vals.push(val);
                        lbls.push(this._formatValue(val));
                    }
                } else {
                    var dt = (1000 * delta_ticks) / _timeSpan.TicksPerSecond;
                    var current = dtmin;
                    var timedif = dtmin0.getTime() - current.getTime();
                    if (timedif > dt) {
                        current = new Date(current.getTime() + Math.floor(timedif / dt) * dt);
                    }
                    for (; current <= dtmax0; current = new Date(current.getTime() + dt)) {
                        if (current >= dtmin0) {
                            var val = chart.FlexChart._toOADate(current);

                            vals.push(val);
                            lbls.push(this._formatValue(val));
                        }
                    }
                }
            };

            Axis.prototype._formatValue = function (val) {
                if (this._isTimeAxis) {
                    return wijmo.Globalize.format(chart.FlexChart._fromOADate(val), this._format);
                } else {
                    return wijmo.Globalize.format(val, this._format);
                }
                //return val.toString();
            };

            Axis.prototype._calcMajorUnit = function () {
                var delta = this._majorUnit;

                if (isNaN(delta)) {
                    var range = this._actualMax - this._actualMin;
                    var prec = this._nicePrecision(range);
                    var dx = range / this._getAnnoNumber(this.axisType == 1 /* Y */);

                    delta = this._niceNumber(2 * dx, -prec, true);
                    if (delta < dx) {
                        delta = this._niceNumber(dx, -prec + 1, false);
                    }
                    if (delta < dx) {
                        delta = this._niceTickNumber(dx);
                    }
                }

                return delta;
            };

            Axis.prototype._getAnnoNumber = function (isVert) {
                var w0 = isVert ? this._annoSize.height : this._annoSize.width;
                var w = isVert ? this._axrect.height : this._axrect.width;
                if (w0 > 0 && w > 0) {
                    var n = Math.floor(w / w0);
                    if (n <= 0) {
                        n = 1;
                    }
                    return n;
                } else {
                    return 10;
                }
            };

            Axis.prototype._nicePrecision = function (range) {
                //
                //	Return a nice precision value for this range.
                //	Doesn't take into account font size, window
                //	size, etc.	Just use the log10 of the range.
                //
                if (range <= 0 || isNaN(range)) {
                    return 0;
                }

                var log10 = Math.log(range) / Math.LN10;
                var exp;

                if (log10 >= 0) {
                    exp = Math.floor(log10); //(int)(SignedFloor(log10));
                } else {
                    exp = Math.ceil(log10);
                }

                var f = range / Math.pow(10.0, exp);

                /* we need the extra digit near the lower end */
                if (f < 3.0) {
                    exp = -exp + 1;

                    // more precision for more labels
                    f = range / Math.pow(10.0, exp);
                    if (f < 3.0) {
                        exp = exp + 1;
                    }
                }
                return exp;
            };

            Axis.prototype._niceTickNumber = function (x) {
                if (x == 0) {
                    return x;
                } else if (x < 0) {
                    x = -x;
                }

                var log10 = Math.log(x) / Math.LN10;
                var exp = Math.floor(log10);

                var f = x / Math.pow(10.0, exp);
                var nf = 10.0;

                if (f <= 1.0) {
                    nf = 1.0;
                } else if (f <= 2.0) {
                    nf = 2.0;
                } else if (f <= 5.0) {
                    nf = 5.0;
                }
                return (nf * Math.pow(10.0, exp));
            };

            Axis.prototype._niceNumber = function (x, exp, round) {
                if (x == 0) {
                    return x;
                } else if (x < 0) {
                    x = -x;
                }

                var f = x / Math.pow(10.0, exp);
                var nf = 10.0;

                if (round) {
                    if (f < 1.5) {
                        nf = 1;
                    } else if (f < 3) {
                        nf = 2;
                    } else if (f < 4.5) {
                        nf = 4;
                    } else if (f < 7) {
                        nf = 5;
                    }
                } else {
                    if (f <= 1) {
                        nf = 1;
                    } else if (f <= 2) {
                        nf = 2;
                    } else if (f <= 5) {
                        nf = 5;
                    }
                }

                return (nf * Math.pow(10.0, exp));
            };

            Object.defineProperty(Axis.prototype, "_uniqueId", {
                get: function () {
                    return this.__uniqueId;
                },
                enumerable: true,
                configurable: true
            });
            Axis._id = 0;
            return Axis;
        })();
        chart.Axis = Axis;

        /**
        * Represents a collection of @see:Axis objects in a @see:FlexChart control.
        */
        var AxisCollection = (function (_super) {
            __extends(AxisCollection, _super);
            function AxisCollection() {
                _super.apply(this, arguments);
            }
            /**
            * Gets an axis by name.
            *
            * @param name The name of the axis to look for.
            * @return The axis object with the specified name, or null if not found.
            */
            AxisCollection.prototype.getAxis = function (name) {
                var index = this.indexOf(name);
                return index > -1 ? this[index] : null;
            };

            /**
            * Gets the index of an axis by name.
            *
            * @param name The name of the axis to look for.
            * @return The index of the axis with the specified name, or -1 if not found.
            */
            AxisCollection.prototype.indexOf = function (name) {
                for (var i = 0; i < this.length; i++) {
                    if (this[i].name == name) {
                        return i;
                    }
                }
                return -1;
            };
            return AxisCollection;
        })(wijmo.collections.ObservableArray);
        chart.AxisCollection = AxisCollection;

        var _tmInc;
        (function (_tmInc) {
            _tmInc[_tmInc["tickf7"] = -7] = "tickf7";
            _tmInc[_tmInc["tickf6"] = -6] = "tickf6";
            _tmInc[_tmInc["tickf5"] = -5] = "tickf5";
            _tmInc[_tmInc["tickf4"] = -4] = "tickf4";
            _tmInc[_tmInc["tickf3"] = -3] = "tickf3";
            _tmInc[_tmInc["tickf2"] = -2] = "tickf2";
            _tmInc[_tmInc["tickf1"] = -1] = "tickf1";
            _tmInc[_tmInc["second"] = 1] = "second";
            _tmInc[_tmInc["minute"] = _tmInc.second * 60] = "minute";
            _tmInc[_tmInc["hour"] = _tmInc.minute * 60] = "hour";
            _tmInc[_tmInc["day"] = _tmInc.hour * 24] = "day";
            _tmInc[_tmInc["week"] = _tmInc.day * 7] = "week";
            _tmInc[_tmInc["month"] = _tmInc.day * 31] = "month";
            _tmInc[_tmInc["year"] = _tmInc.day * 365] = "year";
            _tmInc[_tmInc["maxtime"] = Number.MAX_VALUE] = "maxtime";
        })(_tmInc || (_tmInc = {}));

        var _timeSpan = (function () {
            function _timeSpan(ticks) {
                this.ticks = ticks;
            }
            Object.defineProperty(_timeSpan.prototype, "Ticks", {
                get: function () {
                    return this.ticks;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(_timeSpan.prototype, "TotalSeconds", {
                get: function () {
                    return this.ticks / 10000000;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(_timeSpan.prototype, "TotalDays", {
                get: function () {
                    return this.ticks / 10000000 / (24 * 60 * 60);
                },
                enumerable: true,
                configurable: true
            });

            _timeSpan.fromSeconds = function (seconds) {
                return new _timeSpan(seconds * 10000000);
            };

            _timeSpan.fromDays = function (days) {
                return new _timeSpan(days * 10000000 * 24 * 60 * 60);
            };
            _timeSpan.TicksPerSecond = 10000000;
            return _timeSpan;
        })();

        var _timeHelper = (function () {
            function _timeHelper(date) {
                if (wijmo.isDate(date))
                    this.init(date);
                else if (wijmo.isNumber(date))
                    this.init(chart.FlexChart._fromOADate(date));
            }
            _timeHelper.prototype.init = function (dt) {
                this.year = dt.getFullYear();
                this.month = dt.getMonth();
                this.day = dt.getDate();
                this.hour = dt.getHours();
                this.minute = dt.getMinutes();
                this.second = dt.getSeconds();
            };

            _timeHelper.prototype.getTimeAsDateTime = function () {
                var smon = 0, sday = 0, ssec = 0;

                // N3CHT000043
                if (this.hour >= 24) {
                    this.hour -= 24;
                    this.day += 1;
                }

                if (this.month < 0) {
                    smon = -1 - this.day;
                    this.month = 1;
                } else if (this.month > 11) {
                    smon = this.month - 12;
                    this.month = 12;
                }

                if (this.day < 1) {
                    sday = -1 - this.day;
                    this.day = 1;
                } else if (this.day > 28 && this.month == 2) {
                    sday = this.day - 28;
                    this.day = 28;
                } else if (this.day > 30 && (this.month == 4 || this.month == 4 || this.month == 6 || this.month == 9 || this.month == 11)) {
                    sday = this.day - 30;
                    this.day = 30;
                } else if (this.day > 31) {
                    sday = this.day - 31;
                    this.day = 31;
                }

                if (this.second > 59) {
                    ssec = this.second - 59;
                    this.second = 59;
                }

                var smin = 0;
                if (this.minute > 59) {
                    smin = this.minute - 59;
                    this.minute = 59;
                }

                return new Date(this.year, this.month, this.day, this.hour, this.minute, this.second);
                //AddDays(sday).AddMonths(smon).AddSeconds(ssec).AddMinutes(smin);
            };

            _timeHelper.prototype.getTimeAsDouble = function () {
                return chart.FlexChart._toOADate(this.getTimeAsDateTime());
            };

            _timeHelper.tround = function (tval, tunit, roundup) {
                var test = ((tval / tunit) * tunit);
                test = test - (test % 1);
                if (roundup && test != tval) {
                    tunit = tunit - (tunit % 1);
                    test += tunit;
                }
                return test;
            };

            _timeHelper.RoundTime = function (timevalue, unit, roundup) {
                //TimeSpan ts = TimeSpan.FromDays(unit);
                var tunit = unit * 24 * 60 * 60;

                if (tunit > 0) {
                    var th = new _timeHelper(timevalue);

                    if (tunit < _tmInc.minute) {
                        th.second = this.tround(th.second, tunit, roundup);
                        return th.getTimeAsDouble();
                    }

                    th.second = 0;
                    if (tunit < _tmInc.hour) {
                        tunit /= _tmInc.minute;
                        th.minute = this.tround(th.minute, tunit, roundup);
                        return th.getTimeAsDouble();
                    }

                    th.minute = 0;
                    if (tunit < _tmInc.day) {
                        tunit /= _tmInc.hour;
                        th.hour = this.tround(th.hour, tunit, roundup);
                        return th.getTimeAsDouble();
                    }

                    th.hour = 0;
                    if (tunit < _tmInc.month) {
                        tunit /= _tmInc.day;
                        th.day = this.tround(th.day, tunit, roundup);
                        return th.getTimeAsDouble();
                    }

                    th.day = 1;
                    if (tunit < _tmInc.year) {
                        tunit /= _tmInc.month;

                        // Jan - is good enough
                        if (th.month != 1)
                            th.month = this.tround(th.month, tunit, roundup);
                        return th.getTimeAsDouble();
                    }

                    th.month = 1;
                    tunit /= _tmInc.year;
                    th.year = this.tround(th.year, tunit, roundup);
                    return th.getTimeAsDouble();
                } else {
                    // alext 26-Sep-03
                    //double td = ts.TotalSeconds;
                    var td = timevalue;

                    var tx = td - tunit;
                    var tz = ((tx / unit)) * unit;
                    if (roundup && tz != tx)
                        tz += unit;
                    td = tunit + tz;
                    return td;
                }
            };

            _timeHelper.TimeSpanFromTmInc = function (ti) {
                var rv = _timeSpan.fromSeconds(1);

                if (ti != _tmInc.maxtime) {
                    if (ti > -1 /* tickf1 */) {
                        rv = _timeSpan.fromSeconds(ti);
                    } else {
                        var rti = ti;
                        var ticks = 1;
                        rti += 7; // rti is now power of 10 of number of Ticks
                        while (rti > 0) {
                            ticks *= 10;
                            rti--;
                        }
                        rv = new _timeSpan(ticks);
                    }
                }
                return rv;
            };

            _timeHelper.manualTimeInc = function (manualformat) {
                var minSpan = 1 /* second */;

                // only interested in the lowest increment of the format,
                // so it is not necessary that the format be valid, but it
                // must exist as a string to process.
                if (manualformat == null || manualformat.length == 0)
                    return minSpan;

                var f = manualformat.indexOf('f');
                if (f >= 0) {
                    var rv = -1;
                    if (f > 0 && manualformat.substr(f - 1, 1) == '%') {
                        rv = -1;
                    } else {
                        for (var i = 1; i < 6; i++) {
                            // alext 26-Sep-03
                            if ((f + i) >= manualformat.length)
                                break;

                            //
                            var ss = manualformat.substr(f + i, 1);

                            if (ss != 'f')
                                break;

                            //if (!manualformat.Substring(f + i, 1).Equals('f'))
                            //  break;
                            rv--;
                        }
                    }
                    minSpan = rv;
                } else if (manualformat.indexOf('s') >= 0)
                    minSpan = 1 /* second */;
                else if (manualformat.indexOf('m') >= 0)
                    minSpan = _tmInc.minute;
                else if (manualformat.indexOf('h') >= 0 || manualformat.indexOf('H'))
                    minSpan = _tmInc.hour;
                else if (manualformat.indexOf('d') >= 0)
                    minSpan = _tmInc.day;
                else if (manualformat.indexOf('M') >= 0)
                    minSpan = _tmInc.month;
                else if (manualformat.indexOf('y') >= 0)
                    minSpan = _tmInc.year;

                return minSpan;
            };

            _timeHelper.getNiceInc = function (tik, ts, mult) {
                for (var i = 0; i < tik.length; i++) {
                    var tikm = tik[i] * mult;
                    if (ts <= tikm)
                        return tikm;
                }
                return 0;
            };

            _timeHelper.NiceTimeSpan = function (ts, manualformat) {
                var minSpan = 1 /* second */;

                if (manualformat != null && manualformat.length > 0)
                    minSpan = _timeHelper.manualTimeInc(manualformat);

                var tsinc = 0;
                var tinc = 0;

                // have the minimum required by format.
                if (minSpan < 1 /* second */) {
                    // alext 10-Jan-2011
                    //if (ts.TotalSeconds < 1.0)
                    if (ts.TotalSeconds < 10.0) {
                        tsinc = ts.Ticks;
                        tinc = _timeHelper.TimeSpanFromTmInc(minSpan).Ticks;

                        while (tsinc > 10 * tinc)
                            tinc *= 10;

                        // alext 10-Jan-2011
                        var tinc1 = tinc;
                        if (tsinc > tinc1)
                            tinc1 *= 2;
                        if (tsinc > tinc1)
                            tinc1 = 5 * tinc;
                        if (tsinc > tinc1)
                            tinc1 = 10 * tinc;

                        //
                        return new _timeSpan(tinc1);
                    }
                }

                // alext 25-Jan-06
                // when tsinc < ts the annos are overlapping
                // using larger integer
                // tsinc = (long)ts.TotalSeconds;
                tsinc = Math.ceil(ts.TotalSeconds);

                if (tsinc == 0)
                    return _timeHelper.TimeSpanFromTmInc(minSpan);

                tinc = 1;

                if (minSpan < _tmInc.minute) {
                    // seconds
                    if (tsinc < _tmInc.minute) {
                        tinc = _timeHelper.getNiceInc([1, 2, 5, 10, 15, 30], tsinc, minSpan); // alext 11-Mar-11 TimeSpanFromTmInc(minSpan).Ticks  /*(long)minSpan*/); // alext 25-Jan-06 added 2 as 'nice' number
                        if (tinc != 0)
                            return _timeSpan.fromSeconds(tinc);
                    }
                    minSpan = _tmInc.minute;
                }
                if (minSpan < _tmInc.hour) {
                    // minutes
                    if (tsinc < _tmInc.hour) {
                        tinc = _timeHelper.getNiceInc([1, 2, 5, 10, 15, 30], tsinc, minSpan); // alext 25-Jan-06 added 2 as 'nice' number
                        if (tinc != 0)
                            return _timeSpan.fromSeconds(tinc);
                    }
                    minSpan = _tmInc.hour;
                }
                if (minSpan < _tmInc.day) {
                    // hours
                    if (tsinc < _tmInc.day) {
                        tinc = _timeHelper.getNiceInc([1, 3, 6, 12], tsinc, minSpan);
                        if (tinc != 0)
                            return _timeSpan.fromSeconds(tinc);
                    }
                    minSpan = _tmInc.day;
                }
                if (minSpan < _tmInc.month) {
                    // days
                    if (tsinc < _tmInc.month) {
                        tinc = _timeHelper.getNiceInc([1, 2, 7, 14], tsinc, minSpan);
                        if (tinc != 0)
                            return _timeSpan.fromSeconds(tinc);
                    }
                    minSpan = _tmInc.month;
                }
                if (minSpan < _tmInc.year) {
                    // months
                    if (tsinc < _tmInc.year) {
                        tinc = _timeHelper.getNiceInc([1, 2, 3, 4, 6], tsinc, minSpan);
                        if (tinc != 0)
                            return _timeSpan.fromSeconds(tinc);
                    }
                    minSpan = _tmInc.year;
                }

                // years
                tinc = 100 * _tmInc.year;
                if (tsinc < tinc) {
                    tinc = _timeHelper.getNiceInc([1, 2, 5, 10, 20, 50], tsinc, minSpan);
                    if (tinc == 0)
                        tinc = 100 * _tmInc.year;
                }
                return _timeSpan.fromSeconds(tinc);
            };

            _timeHelper.NiceTimeUnit = function (timeinc, manualformat) {
                var tsRange = _timeSpan.fromDays(timeinc);
                tsRange = _timeHelper.NiceTimeSpan(tsRange, manualformat);
                return tsRange.TotalDays;
            };

            _timeHelper.GetTimeDefaultFormat = function (maxdate, mindate) {
                if (isNaN(maxdate) || isNaN(mindate)) {
                    return '';
                }

                var format = 's';

                //DateTime amax = DateTime.FromOADate(maxdate);
                //DateTime amin = DateTime.FromOADate(mindate);
                var tsRange = _timeSpan.fromDays(maxdate - mindate);
                var range = tsRange.TotalSeconds;

                if (range > 2 * _tmInc.year) {
                    format = 'yyyy';
                } else if (range > _tmInc.year) {
                    format = 'MMM yy';
                } else if (range > 3 * _tmInc.month) {
                    format = 'MMM';
                } else if (range > 2 * _tmInc.week) {
                    format = 'MMM d';
                } else if (range > 2 * _tmInc.day) {
                    format = 'ddd d';
                } else if (range > _tmInc.day) {
                    format = 'ddd H:mm';
                } else if (range > _tmInc.hour) {
                    format = 'H:mm';
                } else if (range >= 1) {
                    format = 'H:mm:ss';
                } else if (range > 0) {
                    var ticks = tsRange.Ticks;
                    format = 's' + '.'; //System.Globalization.NumberFormatInfo.CurrentInfo.NumberDecimalSeparator;
                    while (ticks < _timeSpan.TicksPerSecond) {
                        ticks *= 10;
                        format += 'f';
                    }
                }

                return format;
            };
            _timeHelper.secInYear = (24 * 60 * 60);
            return _timeHelper;
        })();
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Axis.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (_chart) {
        'use strict';

        /**
        * Specifies whether and where the Series is visible.
        */
        (function (SeriesVisibility) {
            /** The series is visible on the plot and in the legend. */
            SeriesVisibility[SeriesVisibility["Visible"] = 0] = "Visible";

            /** The series is visible only on the plot. */
            SeriesVisibility[SeriesVisibility["Plot"] = 1] = "Plot";

            /** The series is visible only in the legend. */
            SeriesVisibility[SeriesVisibility["Legend"] = 2] = "Legend";

            /** The series is hidden. */
            SeriesVisibility[SeriesVisibility["Hidden"] = 3] = "Hidden";
        })(_chart.SeriesVisibility || (_chart.SeriesVisibility = {}));
        var SeriesVisibility = _chart.SeriesVisibility;

        /**
        * Specifies the type of marker to use for the @see:symbolMarker property.
        * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
        */
        (function (Marker) {
            /**
            * Uses a circle to mark each data point.
            */
            Marker[Marker["Dot"] = 0] = "Dot";

            /**
            * Uses a square to mark each data point.
            */
            Marker[Marker["Box"] = 1] = "Box";
        })(_chart.Marker || (_chart.Marker = {}));
        var Marker = _chart.Marker;
        ;

        

        var DataArray = (function () {
            function DataArray() {
            }
            return DataArray;
        })();

        /**
        * Provides arguments for @see:Series events.
        */
        var SeriesEventArgs = (function (_super) {
            __extends(SeriesEventArgs, _super);
            /**
            * Initializes a new instance of a @see:SeriesEventArgs object.
            *
            * @param series Specifies the @see:Series object affected by this event.
            */
            function SeriesEventArgs(series) {
                _super.call(this);
                this._series = wijmo.asType(series, Series);
            }
            Object.defineProperty(SeriesEventArgs.prototype, "series", {
                /**
                * Gets the @see:Series object affected by this event.
                */
                get: function () {
                    return this._series;
                },
                enumerable: true,
                configurable: true
            });
            return SeriesEventArgs;
        })(wijmo.EventArgs);
        _chart.SeriesEventArgs = SeriesEventArgs;

        /**
        * Represents a series of data points to display in the chart.
        *
        * The @see:Series class supports all basic chart types. You may define
        * additional chart types by creating classes that derive from the @see:Series
        * class and override the @see:renderSeries method.
        */
        var Series = (function () {
            function Series() {
                this._symbolMarker = 0 /* Dot */;
                this._visibility = 0 /* Visible */;
            }
            Object.defineProperty(Series.prototype, "style", {
                //--------------------------------------------------------------------------
                // ** implementation
                /**
                * Gets or sets the series style.
                */
                get: function () {
                    return this._style;
                },
                set: function (value) {
                    if (value != this._style) {
                        this._style = value;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "symbolStyle", {
                /**
                * Gets or sets the series symbol style.
                * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
                */
                get: function () {
                    return this._symbolStyle;
                },
                set: function (value) {
                    if (value != this._symbolStyle) {
                        this._symbolStyle = value;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "symbolSize", {
                /**
                * Gets or sets the size in pixels of the symbols used to render this @see:Series.
                * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
                */
                get: function () {
                    return this._symbolSize;
                },
                set: function (value) {
                    if (value != this._symbolSize) {
                        this._symbolSize = wijmo.asNumber(value, true, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });
            Series.prototype._getSymbolSize = function () {
                return this.symbolSize != null ? this.symbolSize : this.chart.symbolSize;
            };

            Object.defineProperty(Series.prototype, "symbolMarker", {
                /**
                * Gets or sets the shape of marker to use for each data point in the series.
                * Applies to Scatter, LineSymbols, and SplineSymbols chart types.
                */
                get: function () {
                    return this._symbolMarker;
                },
                set: function (value) {
                    if (value != this._symbolMarker) {
                        this._symbolMarker = wijmo.asEnum(value, Marker, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "chartType", {
                /**
                * Gets or sets the chart type for a specific series, overriding the chart type
                * set on the overall chart.
                */
                get: function () {
                    return this._chartType;
                },
                set: function (value) {
                    if (value != this._chartType) {
                        this._chartType = wijmo.asEnum(value, _chart.ChartType, true);
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "binding", {
                /**
                * Gets or sets the name of the property that contains Y values for the series.
                */
                get: function () {
                    return this._binding ? this._binding : this._chart ? this._chart.binding : null;
                },
                set: function (value) {
                    if (value != this._binding) {
                        this._binding = wijmo.asString(value, true);
                        this._values = null;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "bindingX", {
                /**
                * Gets or sets the name of the property that contains X values for the series.
                */
                get: function () {
                    return this._bindingX ? this._bindingX : this._chart ? this._chart.bindingX : null;
                },
                set: function (value) {
                    if (value != this._bindingX) {
                        this._bindingX = wijmo.asString(value, true);
                        this._values = null;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "name", {
                /**
                * Gets or sets the series name.
                *
                * The series name is displayed in the chart legend. Any series without a name
                * does not appear in the legend.
                */
                get: function () {
                    return this._name;
                },
                set: function (value) {
                    this._name = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "itemsSource", {
                /**
                * Gets or sets the array or @see:ICollectionView object that contains the series data.
                */
                get: function () {
                    return this._itemsSource;
                },
                set: function (value) {
                    if (value != this._itemsSource) {
                        // unbind current collection view
                        if (this._cv) {
                            this._cv.currentChanged.removeHandler(this._cvCurrentChanged, this);
                            this._cv.collectionChanged.removeHandler(this._cvCollectionChanged, this);
                            this._cv = null;
                        }

                        // save new data source and collection view
                        this._itemsSource = value;
                        this._cv = wijmo.asCollectionView(value);

                        // bind new collection view
                        if (this._cv != null) {
                            this._cv.currentChanged.addHandler(this._cvCurrentChanged, this);
                            this._cv.collectionChanged.addHandler(this._cvCollectionChanged, this);
                        }

                        this._values = null;
                        this._itemsSource = value;
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "collectionView", {
                /**
                * Gets the @see:ICollectionView object that contains the data for this series.
                */
                get: function () {
                    return this._cv ? this._cv : this._chart ? this._chart.collectionView : null;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "chart", {
                /**
                * Gets the @see:FlexChart object that owns this series.
                */
                get: function () {
                    return this._chart;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "hostElement", {
                /**
                * Gets the series host element.
                */
                get: function () {
                    return this._hostElement;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "legendElement", {
                /**
                * Gets the series element in the legend.
                */
                get: function () {
                    return this._legendElement;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "cssClass", {
                /**
                * Gets or sets the series CSS class.
                */
                get: function () {
                    return this._cssClass;
                },
                set: function (value) {
                    this._cssClass = wijmo.asString(value, true);
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "visibility", {
                /**
                * Gets or sets an enumerated value indicating whether and where the series appears.
                */
                get: function () {
                    return this._visibility;
                },
                set: function (value) {
                    if (value != this._visibility) {
                        this._visibility = wijmo.asEnum(value, SeriesVisibility);
                        this._clearValues();
                        this._invalidate();
                        if (this._chart) {
                            this._chart.onSeriesVisibilityChanged(new SeriesEventArgs(this));
                        }
                    }
                },
                enumerable: true,
                configurable: true
            });

            /**
            * Gets a @see:HitTestInfo object with information about the specified point.
            *
            * @param pt The point to investigate, in window coordinates.
            * @param y The Y coordinate of the point (if the first parameter is a number).
            */
            Series.prototype.hitTest = function (pt, y) {
                if (wijmo.isNumber(pt) && wijmo.isNumber(y)) {
                    pt = new wijmo.Point(pt, y);
                } else if (pt instanceof MouseEvent) {
                    pt = new wijmo.Point(pt.pageX, pt.pageY);
                }
                wijmo.asType(pt, wijmo.Point);

                if (this._chart) {
                    return this._chart._hitTestSeries(pt, this._chart.series.indexOf(this));
                } else {
                    return null;
                }
            };

            /**
            * Gets the plot element that corresponds to the specified point index.
            *
            * @param pointIndex The index of the data point.
            */
            Series.prototype.getPlotElement = function (pointIndex) {
                if (this.hostElement) {
                    if (pointIndex < this._pointIndexes.length) {
                        var elementIndex = this._pointIndexes[pointIndex];
                        if (elementIndex < this.hostElement.childNodes.length) {
                            return this.hostElement.childNodes[elementIndex];
                        }
                    }
                }
                return null;
            };

            Object.defineProperty(Series.prototype, "axisX", {
                /**
                * Gets or sets the x-axis for the series.
                */
                get: function () {
                    return this._axisX;
                },
                set: function (value) {
                    if (value != this._axisX) {
                        this._axisX = wijmo.asType(value, _chart.Axis, true);
                        if (this._axisX) {
                            var chart = this._axisX._chart = this._chart;
                            if (chart && chart.axes.indexOf(this._axisX) == -1) {
                                chart.axes.push(this._axisX);
                            }
                        }
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(Series.prototype, "axisY", {
                /**
                * Gets or sets the y-axis for the series.
                */
                get: function () {
                    return this._axisY;
                },
                set: function (value) {
                    if (value != this._axisY) {
                        this._axisY = wijmo.asType(value, _chart.Axis, true);
                        if (this._axisY) {
                            var chart = this._axisY._chart = this._chart;
                            if (chart && chart.axes.indexOf(this._axisY) == -1) {
                                chart.axes.push(this._axisY);
                            }
                        }
                        this._invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            //--------------------------------------------------------------------------
            // ** implementation
            Series.prototype.getDataType = function (dim) {
                if (dim == 0) {
                    return this._valueDataType;
                } else if (dim == 1) {
                    return this._xvalueDataType;
                }

                return null;
            };

            Series.prototype.getValues = function (dim) {
                if (dim == 0) {
                    if (this._values == null) {
                        this._valueDataType = null;
                        if (this._cv != null) {
                            var da = this._bindValues(this._cv.items, this._getBinding(0));
                            this._values = da.values;
                            this._valueDataType = da.dataType;
                        } else if (this.binding != null) {
                            if (this._chart != null && this._chart.collectionView != null) {
                                var da = this._bindValues(this._chart.collectionView.items, this._getBinding(0));
                                this._values = da.values;
                                this._valueDataType = da.dataType;
                            }
                        }
                    }
                    return this._values;
                } else if (dim == 1) {
                    if (this._xvalues == null) {
                        this._xvalueDataType = null;

                        var base = this;

                        if (this.bindingX != null) {
                            if (base._cv != null) {
                                var da = this._bindValues(base._cv.items, this.bindingX);
                                this._xvalueDataType = da.dataType;
                                this._xvalues = da.values;
                            } else {
                                if (this._bindingX == null) {
                                    return null;
                                }

                                if (base._chart != null && base._chart.collectionView != null) {
                                    var da = this._bindValues(base._chart.collectionView.items, this.bindingX);
                                    this._xvalueDataType = da.dataType;
                                    this._xvalues = da.values;
                                }
                            }
                        }
                    }
                    return this._xvalues;
                }

                return null;
            };

            /**
            * Draw a legend item at the specified position.
            *
            * @param engine The rendering engine to use.
            * @param rect The position of the legend item.
            */
            Series.prototype.drawLegendItem = function (engine, rect) {
                var chartType = this._chartType;
                if (chartType == null) {
                    chartType = this._chart.chartType;
                }

                //var style = this.style;
                engine.strokeWidth = 1;

                var marg = Series._LEGEND_ITEM_MARGIN;

                var fill = null;
                var stroke = null;

                //if (style) {
                //    if (style.fill) {
                //        fill = style.fill;
                //    }
                //    if (style.stroke) {
                //        stroke = style.stroke;
                //}
                //}
                if (fill === null)
                    fill = this._chart._getColorLight(this._chart.series.indexOf(this));
                if (stroke === null)
                    stroke = this._chart._getColor(this._chart.series.indexOf(this));

                engine.fill = fill;
                engine.stroke = stroke;

                var yc = rect.top + 0.5 * rect.height;

                var wsym = Series._LEGEND_ITEM_WIDTH;
                var hsym = Series._LEGEND_ITEM_HEIGHT;
                switch (chartType) {
                    case 5 /* Area */:
                    case 11 /* SplineArea */:
                         {
                            engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null, this.style);
                        }
                        break;
                    case 1 /* Bar */:
                    case 0 /* Column */:
                         {
                            engine.drawRect(rect.left + marg, yc - 0.5 * hsym, wsym, hsym, null, this.symbolStyle ? this.symbolStyle : this.style);
                        }
                        break;
                    case 2 /* Scatter */:
                    case 6 /* Bubble */:
                         {
                            var rx = 0.3 * wsym;
                            var ry = 0.3 * hsym;
                            if (this.symbolMarker == 1 /* Box */) {
                                engine.drawRect(rect.left + marg + 0.5 * wsym - rx, yc - ry, 2 * rx, 2 * ry, null, this.symbolStyle);
                            } else {
                                engine.drawEllipse(rect.left + 0.5 * wsym + marg, yc, rx, ry, null, this.symbolStyle);
                            }
                        }
                        break;
                    case 3 /* Line */:
                    case 9 /* Spline */:
                         {
                            engine.drawLine(rect.left + marg, yc, rect.left + wsym + marg, yc, null, this.style);
                        }
                        break;
                    case 4 /* LineSymbols */:
                    case 10 /* SplineSymbols */:
                         {
                            var rx = 0.3 * wsym;
                            var ry = 0.3 * hsym;
                            if (this.symbolMarker == 1 /* Box */) {
                                engine.drawRect(rect.left + marg + 0.5 * wsym - rx, yc - ry, 2 * rx, 2 * ry, null, this.symbolStyle);
                            } else {
                                engine.drawEllipse(rect.left + 0.5 * wsym + marg, yc, rx, ry, null, this.symbolStyle);
                            }

                            engine.drawLine(rect.left + marg, yc, rect.left + wsym + marg, yc, null, this.style);
                        }
                        break;
                    case 7 /* Candlestick */:
                    case 8 /* HighLowOpenClose */:
                         {
                            engine.drawLine(rect.left + marg, yc, rect.left + wsym + marg, yc, null, this.symbolStyle ? this.symbolStyle : this.style);
                        }
                        break;
                }
                if (this._name) {
                    _chart.FlexChart._renderText(engine, this._name, new wijmo.Point(rect.left + hsym + 2 * marg, yc), 0, 1, _chart.FlexChart._CSS_LABEL);
                }
            };

            /**
            * Measures the height and width of the legend item.
            *
            * @param engine The rendering engine to use.
            */
            Series.prototype.measureLegendItem = function (engine) {
                var sz = new wijmo.Size();
                sz.width = Series._LEGEND_ITEM_WIDTH;
                sz.height = Series._LEGEND_ITEM_HEIGHT;
                if (this._name) {
                    var tsz = engine.measureString(this._name, _chart.FlexChart._CSS_LABEL);
                    sz.width += tsz.width;
                    if (sz.height < tsz.height) {
                        sz.height = tsz.height;
                    }
                }
                ;
                sz.width += 3 * Series._LEGEND_ITEM_MARGIN;
                sz.height += 2 * Series._LEGEND_ITEM_MARGIN;
                return sz;
            };

            /**
            * Clears any cashed data values.
            */
            Series.prototype._clearValues = function () {
                this._values = null;
            };

            Series.prototype._getBinding = function (index) {
                var binding = null;
                if (this.binding) {
                    var props = this.binding.split(',');
                    if (props && props.length > index) {
                        binding = props[index].trim();
                    }
                }
                return binding;
            };

            Series.prototype._getBindingValues = function (index) {
                var items;
                if (this._cv != null) {
                    items = this._cv.items;
                } else if (this._chart != null && this._chart.collectionView != null) {
                    items = this._chart.collectionView.items;
                }

                var da = this._bindValues(items, this._getBinding(index));
                return da.values;
            };

            Series.prototype._getItem = function (pointIndex) {
                var item = null;
                if (this.itemsSource != null) {
                    item = this.itemsSource[pointIndex];
                } else if (this._chart.itemsSource != null) {
                    item = this._chart.itemsSource[pointIndex];
                }
                return item;
            };

            Series.prototype._getLength = function () {
                var len = null;
                if (this.itemsSource != null) {
                    len = this.itemsSource.length;
                } else if (this._chart.itemsSource != null) {
                    len = this._chart.itemsSource.length;
                }
                return len;
            };

            Series.prototype._setPointIndex = function (pointIndex, elementIndex) {
                this._pointIndexes[pointIndex] = elementIndex;
            };

            Series.prototype._getDataRect = function () {
                var values = this.getValues(0);
                var xvalues = this.getValues(1);
                if (values) {
                    var xmin = NaN, ymin = NaN, xmax = NaN, ymax = NaN;

                    var len = values.length;

                    for (var i = 0; i < len; i++) {
                        var val = values[i];
                        if (isFinite(val)) {
                            if (isNaN(ymin)) {
                                ymin = ymax = val;
                            } else {
                                if (val < ymin) {
                                    ymin = val;
                                } else if (val > ymax) {
                                    ymax = val;
                                }
                            }
                        }
                        if (xvalues) {
                            var xval = xvalues[i];
                            if (isFinite(xval)) {
                                if (isNaN(xmin)) {
                                    xmin = xmax = xval;
                                } else {
                                    if (xval < xmin) {
                                        xmin = xval;
                                    } else if (val > ymax) {
                                        xmax = xval;
                                    }
                                }
                            }
                        }
                    }

                    if (!xvalues) {
                        xmin = 0;
                        xmax = len - 1;
                    }

                    if (!isNaN(ymin)) {
                        return new wijmo.Rect(xmin, ymin, xmax - xmin, ymax - ymin);
                    }
                }

                return null;
            };

            Series.prototype._isCustomAxisX = function () {
                if (this._axisX) {
                    if (this._chart) {
                        return this._axisX != this.chart.axisX;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            };

            Series.prototype._isCustomAxisY = function () {
                if (this._axisY) {
                    if (this._chart) {
                        return this._axisY != this.chart.axisY;
                    } else {
                        return true;
                    }
                } else {
                    return false;
                }
            };

            Series.prototype._getAxisY = function () {
                if (this._axisY) {
                    return this._axisY;
                } else if (this._chart) {
                    return this.chart.axisY;
                }
                return null;
            };

            Series.prototype._cvCollectionChanged = function (sender, e) {
                this._values = null;
                this._invalidate();
            };

            // updates selection to sync with data source
            Series.prototype._cvCurrentChanged = function (sender, e) {
                this._invalidate();
            };

            Series.prototype._bindValues = function (items, binding) {
                var values;
                var dataType;
                if (items != null) {
                    var len = items.length;
                    values = new Array(items.length);

                    for (var i = 0; i < len; i++) {
                        var val = items[i];
                        if (binding != null) {
                            val = val[binding];
                        }

                        if (wijmo.isNumber(val)) {
                            values[i] = val;
                            dataType = 2 /* Number */;
                        } else if (wijmo.isDate(val)) {
                            values[i] = _chart.FlexChart._toOADate(val);
                            dataType = 4 /* Date */;
                        }
                    }
                }
                var darr = new DataArray();
                darr.values = values;
                darr.dataType = dataType;
                return darr;
            };

            Series.prototype._invalidate = function () {
                if (this._chart) {
                    this._chart.invalidate();
                }
            };

            Series.prototype._indexToPoint = function (pointIndex) {
                if (pointIndex >= 0 && pointIndex < this._values.length) {
                    var y = this._values[pointIndex];
                    var x = this._xvalues ? this._xvalues[pointIndex] : pointIndex;

                    return new wijmo.Point(x, y);
                }

                return null;
            };
            Series._LEGEND_ITEM_WIDTH = 10;
            Series._LEGEND_ITEM_HEIGHT = 10;
            Series._LEGEND_ITEM_MARGIN = 4;
            Series._DEFAULT_SYM_SIZE = 10;
            return Series;
        })();
        _chart.Series = Series;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Series.js.map

var wijmo;
(function (wijmo) {
    (function (chart) {
        'use strict';

        
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=IRenderEngine.js.map

var wijmo;
(function (wijmo) {
    (function (chart) {
        'use strict';

        /**
        * Render to svg.
        */
        var _SvgRenderEngine = (function () {
            function _SvgRenderEngine(element) {
                this._strokeWidth = 1;
                this._fontSize = null;
                this._fontFamily = null;
                this._element = element;
                this._create();
                this._element.appendChild(this._svg);
            }
            _SvgRenderEngine.prototype.beginRender = function () {
                while (this._svg.firstChild) {
                    this._svg.removeChild(this._svg.firstChild);
                }
                this._svg.appendChild(this._textGroup);
            };

            _SvgRenderEngine.prototype.endRender = function () {
                if (this._textGroup.parentNode) {
                    this._svg.removeChild(this._textGroup);
                }
            };

            _SvgRenderEngine.prototype.setViewportSize = function (w, h) {
                this._svg.setAttribute('width', w.toString());
                this._svg.setAttribute('height', h.toString());
            };

            Object.defineProperty(_SvgRenderEngine.prototype, "fill", {
                get: function () {
                    return this._fill;
                },
                set: function (value) {
                    this._fill = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(_SvgRenderEngine.prototype, "fontSize", {
                get: function () {
                    return this._fontSize;
                },
                set: function (value) {
                    this._fontSize = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(_SvgRenderEngine.prototype, "fontFamily", {
                get: function () {
                    return this._fontFamily;
                },
                set: function (value) {
                    this._fontFamily = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(_SvgRenderEngine.prototype, "stroke", {
                get: function () {
                    return this._stroke;
                },
                set: function (value) {
                    this._stroke = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(_SvgRenderEngine.prototype, "strokeWidth", {
                get: function () {
                    return this._strokeWidth;
                },
                set: function (value) {
                    this._strokeWidth = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(_SvgRenderEngine.prototype, "textFill", {
                get: function () {
                    return this._textFill;
                },
                set: function (value) {
                    this._textFill = value;
                },
                enumerable: true,
                configurable: true
            });

            _SvgRenderEngine.prototype.addClipRect = function (clipRect, id) {
                if (clipRect && id) {
                    var clipPath = document.createElementNS(_SvgRenderEngine.svgNS, 'clipPath');
                    var rect = document.createElementNS(_SvgRenderEngine.svgNS, 'rect');
                    rect.setAttribute('x', (clipRect.left - 1).toFixed());
                    rect.setAttribute('y', (clipRect.top - 1).toFixed());
                    rect.setAttribute('width', (clipRect.width + 2).toFixed());
                    rect.setAttribute('height', (clipRect.height + 2).toFixed());
                    clipPath.appendChild(rect);

                    clipPath.setAttribute('id', id);

                    this._svg.appendChild(clipPath);
                    //this._defs.appendChild(clipPath);
                }
            };

            _SvgRenderEngine.prototype.drawEllipse = function (cx, cy, rx, ry, className, style) {
                var ell = document.createElementNS(_SvgRenderEngine.svgNS, 'ellipse');
                ell.setAttribute('stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    ell.setAttribute('stroke-width', this._strokeWidth.toString());
                }
                ell.setAttribute('fill', this._fill);
                ell.setAttribute('cx', cx.toFixed(1));
                ell.setAttribute('cy', cy.toFixed(1));
                ell.setAttribute('rx', rx.toFixed(1));
                ell.setAttribute('ry', ry.toFixed(1));

                //ell.setAttribute('cx', cx.toString());
                //ell.setAttribute('cy', cy.toString());
                //ell.setAttribute('rx', rx.toString());
                //ell.setAttribute('ry', ry.toString());
                if (className) {
                    ell.setAttribute('class', className);
                }
                this._applyStyle(ell, style);

                //this._svg.appendChild(ell);
                this._appendChild(ell);
            };

            _SvgRenderEngine.prototype.drawRect = function (x, y, w, h, className, style, clipPath) {
                var rect = document.createElementNS(_SvgRenderEngine.svgNS, 'rect');

                rect.setAttribute('fill', this._fill);
                rect.setAttribute('stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    rect.setAttribute('stroke-width', this._strokeWidth.toString());
                }
                rect.setAttribute('x', x.toFixed(1));
                rect.setAttribute('y', y.toFixed(1));
                rect.setAttribute('width', w.toFixed(1));
                rect.setAttribute('height', h.toFixed(1));

                //rect.setAttribute('x', x.toString());
                //rect.setAttribute('y', y.toString());
                //rect.setAttribute('width', w.toString());
                //rect.setAttribute('height', h.toString());
                if (clipPath) {
                    rect.setAttribute('clip-path', 'url(#' + clipPath + ')');
                }

                if (className) {
                    rect.setAttribute('class', className);
                }
                this._applyStyle(rect, style);

                this._appendChild(rect);
            };

            _SvgRenderEngine.prototype.drawLine = function (x1, y1, x2, y2, className, style) {
                var line = document.createElementNS(_SvgRenderEngine.svgNS, 'line');
                line.setAttribute('stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    line.setAttribute('stroke-width', this._strokeWidth.toString());
                }
                line.setAttribute('x1', x1.toFixed(1));
                line.setAttribute('x2', x2.toFixed(1));
                line.setAttribute('y1', y1.toFixed(1));
                line.setAttribute('y2', y2.toFixed(1));

                //line.setAttribute('x1', x1.toString());
                //line.setAttribute('x2', x2.toString());
                //line.setAttribute('y1', y1.toString());
                //line.setAttribute('y2', y2.toString());
                if (className) {
                    line.setAttribute('class', className);
                }
                this._applyStyle(line, style);

                this._appendChild(line);
            };

            _SvgRenderEngine.prototype.drawLines = function (xs, ys, className, style, clipPath) {
                if (xs && ys) {
                    var len = Math.min(xs.length, ys.length);
                    if (len > 0) {
                        var pline = document.createElementNS(_SvgRenderEngine.svgNS, 'polyline');

                        pline.setAttribute('stroke', this._stroke);
                        if (this._strokeWidth !== null) {
                            pline.setAttribute('stroke-width', this._strokeWidth.toString());
                        }

                        pline.setAttribute('fill', 'none');
                        var spts = '';
                        for (var i = 0; i < len; i++) {
                            spts += xs[i].toFixed(1) + ',' + ys[i].toFixed(1) + ' ';
                            //spts += xs[i].toString() + ',' + ys[i].toString() + ' ';
                        }
                        pline.setAttribute('points', spts);

                        if (className) {
                            pline.setAttribute('class', className);
                        }
                        if (clipPath) {
                            pline.setAttribute('clip-path', 'url(#' + clipPath + ')');
                        }
                        this._applyStyle(pline, style);

                        this._appendChild(pline);
                    }
                }
            };

            _SvgRenderEngine.prototype.drawSplines = function (xs, ys, className, style, clipPath) {
                if (xs && ys) {
                    var spline = new chart._Spline(xs, ys);
                    var s = spline.calculate();
                    var sx = s.xs;
                    var sy = s.ys;

                    var len = Math.min(sx.length, sy.length);
                    if (len > 0) {
                        var pline = document.createElementNS(_SvgRenderEngine.svgNS, 'polyline');

                        pline.setAttribute('stroke', this._stroke);
                        if (this._strokeWidth !== null) {
                            pline.setAttribute('stroke-width', this._strokeWidth.toString());
                        }

                        pline.setAttribute('fill', 'none');
                        var spts = '';
                        for (var i = 0; i < len; i++) {
                            spts += sx[i].toFixed(1) + ',' + sy[i].toFixed(1) + ' ';
                        }
                        pline.setAttribute('points', spts);

                        if (className) {
                            pline.setAttribute('class', className);
                        }
                        if (clipPath) {
                            pline.setAttribute('clip-path', 'url(#' + clipPath + ')');
                        }
                        this._applyStyle(pline, style);

                        this._appendChild(pline);
                    }
                }
            };

            _SvgRenderEngine.prototype.drawPolygon = function (xs, ys, className, style, clipPath) {
                if (xs && ys) {
                    var len = Math.min(xs.length, ys.length);
                    if (len > 0) {
                        var poly = document.createElementNS(_SvgRenderEngine.svgNS, 'polygon');

                        poly.setAttribute('stroke', this._stroke);
                        if (this._strokeWidth !== null) {
                            poly.setAttribute('stroke-width', this._strokeWidth.toString());
                        }
                        poly.setAttribute('fill', this._fill);

                        var spts = '';
                        for (var i = 0; i < len; i++) {
                            //spts += xs[i].toString() + ',' + ys[i].toString() + ' ';
                            spts += xs[i].toFixed(1) + ',' + ys[i].toFixed(1) + ' ';
                        }
                        poly.setAttribute('points', spts);

                        if (className) {
                            poly.setAttribute('class', className);
                        }
                        if (clipPath) {
                            poly.setAttribute('clip-path', 'url(#' + clipPath + ')');
                        }
                        this._applyStyle(poly, style);

                        this._appendChild(poly);
                    }
                }
            };

            _SvgRenderEngine.prototype.drawPieSegment = function (cx, cy, r, startAngle, sweepAngle, className, style, clipPath) {
                if (sweepAngle >= Math.PI * 2) {
                    return this.drawEllipse(cx, cy, r, r, className, style);
                }

                var path = document.createElementNS(_SvgRenderEngine.svgNS, 'path');

                path.setAttribute('fill', this._fill);
                path.setAttribute('stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    path.setAttribute('stroke-width', this._strokeWidth.toString());
                }

                var p1 = new wijmo.Point(cx, cy);
                p1.x += r * Math.cos(startAngle);
                p1.y += r * Math.sin(startAngle);

                var a2 = startAngle + sweepAngle;
                var p2 = new wijmo.Point(cx, cy);
                p2.x += r * Math.cos(a2);
                p2.y += r * Math.sin(a2);

                var opt = ' 0 0,1 ';
                if (Math.abs(sweepAngle) > Math.PI) {
                    opt = ' 0 1,1 ';
                }

                var d = 'M ' + cx.toFixed(1) + ',' + cy.toFixed(1);
                d += 'L ' + p1.x.toFixed(1) + ',' + p1.y.toFixed(1);
                d += ' A ' + r.toFixed(1) + ',' + r.toFixed(1) + opt;
                d += p2.x.toFixed(1) + ',' + p2.y.toFixed(1) + ' z';

                path.setAttribute('d', d);

                if (clipPath) {
                    path.setAttribute('clip-path', 'url(#' + clipPath + ')');
                }

                if (className) {
                    path.setAttribute('class', className);
                }
                this._applyStyle(path, style);

                this._appendChild(path);
            };

            _SvgRenderEngine.prototype.drawDonutSegment = function (cx, cy, radius, innerRadius, startAngle, sweepAngle, className, style, clipPath) {
                var isFull = false;
                if (sweepAngle >= Math.PI * 2) {
                    isFull = true;
                    sweepAngle -= 0.001;
                }
                var path = document.createElementNS(_SvgRenderEngine.svgNS, 'path');

                path.setAttribute('fill', this._fill);
                path.setAttribute('stroke', this._stroke);
                if (this._strokeWidth !== null) {
                    path.setAttribute('stroke-width', this._strokeWidth.toString());
                }

                var p1 = new wijmo.Point(cx, cy);
                p1.x += radius * Math.cos(startAngle);
                p1.y += radius * Math.sin(startAngle);

                var a2 = startAngle + sweepAngle;
                var p2 = new wijmo.Point(cx, cy);
                p2.x += radius * Math.cos(a2);
                p2.y += radius * Math.sin(a2);

                var p3 = new wijmo.Point(cx, cy);
                p3.x += innerRadius * Math.cos(a2);
                p3.y += innerRadius * Math.sin(a2);

                var p4 = new wijmo.Point(cx, cy);
                p4.x += innerRadius * Math.cos(startAngle);
                p4.y += innerRadius * Math.sin(startAngle);

                var opt1 = ' 0 0,1 ', opt2 = ' 0 0,0 ';
                if (Math.abs(sweepAngle) > Math.PI) {
                    opt1 = ' 0 1,1 ';
                    opt2 = ' 0 1,0 ';
                }

                var d = 'M ' + p1.x.toFixed(3) + ',' + p1.y.toFixed(3);

                d += ' A ' + radius.toFixed(3) + ',' + radius.toFixed(3) + opt1;
                d += p2.x.toFixed(3) + ',' + p2.y.toFixed(3);
                if (isFull) {
                    d += ' M ' + p3.x.toFixed(3) + ',' + p3.y.toFixed(3);
                } else {
                    d += ' L ' + p3.x.toFixed(3) + ',' + p3.y.toFixed(3);
                }
                d += ' A ' + innerRadius.toFixed(3) + ',' + innerRadius.toFixed(3) + opt2;
                d += p4.x.toFixed(3) + ',' + p4.y.toFixed(3);
                if (!isFull) {
                    d += ' z';
                }

                path.setAttribute('d', d);

                if (clipPath) {
                    path.setAttribute('clip-path', 'url(#' + clipPath + ')');
                }

                if (className) {
                    path.setAttribute('class', className);
                }
                this._applyStyle(path, style);

                this._appendChild(path);
            };

            _SvgRenderEngine.prototype.drawString = function (s, pt, className) {
                var text = this._createText(pt, s);
                if (className) {
                    text.setAttribute('class', className);
                }

                this._appendChild(text);

                var bb = text.getBBox();
                text.setAttribute('y', (pt.y - (bb.y + bb.height - pt.y)).toFixed(1));
            };

            _SvgRenderEngine.prototype.drawStringRotated = function (s, pt, center, angle, className) {
                var text = this._createText(pt, s);
                if (className) {
                    text.setAttribute('class', className);
                }

                var g = document.createElementNS(_SvgRenderEngine.svgNS, 'g');
                g.setAttribute('transform', 'rotate(' + angle.toFixed(1) + ',' + center.x.toFixed(1) + ',' + center.y.toFixed(1) + ')');

                //g.setAttribute('transform', 'rotate(' + angle.toString() + ',' + center.x.toString() + ',' + center.y.toString() + ')');
                g.appendChild(text);

                //this._svg.appendChild(g);
                this._appendChild(g);
                var bb = text.getBBox();
                text.setAttribute('y', (pt.y - (bb.y + bb.height - pt.y)).toFixed(1));
            };

            _SvgRenderEngine.prototype.measureString = function (s, className, groupName) {
                var sz = new wijmo.Size(0, 0);

                if (this._fontSize) {
                    this._text.setAttribute('font-size', this._fontSize);
                }
                if (this._fontFamily) {
                    this._text.setAttribute('font-family', this._fontFamily);
                }
                if (className) {
                    this._text.setAttribute('class', className);
                }
                if (groupName) {
                    this._textGroup.setAttribute('class', groupName);
                }

                this._setText(this._text, s);

                var rect = this._text.getBBox();
                sz.width = rect.width;
                sz.height = rect.height;

                this._text.removeAttribute('font-size');
                this._text.removeAttribute('font-family');
                this._text.removeAttribute('class');
                this._textGroup.removeAttribute('class');
                this._text.textContent = null;
                return sz;
            };

            _SvgRenderEngine.prototype.startGroup = function (className, clipPath, createTransform) {
                if (typeof createTransform === "undefined") { createTransform = false; }
                var group = document.createElementNS(_SvgRenderEngine.svgNS, 'g');
                if (className) {
                    group.setAttribute('class', className);
                }
                if (clipPath) {
                    group.setAttribute('clip-path', 'url(#' + clipPath + ')');
                }
                this._appendChild(group);
                if (createTransform) {
                    group.transform.baseVal.appendItem(this._svg.createSVGTransform());
                }
                this._group = group;
                return group;
            };

            _SvgRenderEngine.prototype.endGroup = function () {
                if (this._group) {
                    var parent = this._group.parentNode;
                    if (parent == this._svg) {
                        this._group = null;
                    } else {
                        this._group = parent;
                    }
                }
            };

            _SvgRenderEngine.prototype._appendChild = function (element) {
                var group = this._group;
                if (!group) {
                    group = this._svg;
                }
                group.appendChild(element);
            };

            _SvgRenderEngine.prototype._create = function () {
                this._svg = document.createElementNS(_SvgRenderEngine.svgNS, 'svg');
                this._defs = document.createElementNS(_SvgRenderEngine.svgNS, 'defs');
                this._svg.appendChild(this._defs);
                this._text = this._createText(new wijmo.Point(-1000, -1000), '');
                this._textGroup = document.createElementNS(_SvgRenderEngine.svgNS, 'g');
                this._textGroup.appendChild(this._text);
                this._svg.appendChild(this._textGroup);
            };

            _SvgRenderEngine.prototype._setText = function (element, s) {
                var text = s ? s.toString() : null;
                if (text && text.indexOf('tspan') >= 0) {
                    try  {
                        element.textContent = null;

                        // Parse the markup into valid nodes.
                        var dXML = new DOMParser();

                        //dXML.async = false;
                        // Wrap the markup into a SVG node to ensure parsing works.
                        var sXML = '<svg xmlns="http://www.w3.org/2000/svg\">' + text + '</svg>';
                        var svgDocElement = dXML.parseFromString(sXML, 'text/xml').documentElement;

                        // Now take each node, import it and append to this element.
                        var childNode = svgDocElement.firstChild;

                        while (childNode) {
                            element.appendChild(element.ownerDocument.importNode(childNode, true));
                            childNode = childNode.nextSibling;
                        }
                    } catch (e) {
                        throw new Error('Error parsing XML string.');
                    }
                    ;
                } else {
                    element.textContent = text;
                }
            };

            _SvgRenderEngine.prototype._createText = function (pos, text) {
                var textel = document.createElementNS(_SvgRenderEngine.svgNS, 'text');

                this._setText(textel, text);
                textel.setAttribute('fill', this._textFill);
                textel.setAttribute('x', pos.x.toFixed(1));
                textel.setAttribute('y', pos.y.toFixed(1));

                //textel.setAttribute('x', pos.x.toString());
                //textel.setAttribute('y', pos.y.toString());
                if (this._fontSize) {
                    textel.setAttribute('font-size', this._fontSize);
                }
                if (this._fontFamily) {
                    textel.setAttribute('font-family', this._fontFamily);
                }
                return textel;
            };

            _SvgRenderEngine.prototype._applyStyle = function (el, style) {
                if (style) {
                    for (var key in style) {
                        el.setAttribute(this._deCase(key), style[key]);
                    }
                }
            };

            _SvgRenderEngine.prototype._deCase = function (s) {
                return s.replace(/[A-Z]/g, function (a) {
                    return '-' + a.toLowerCase();
                });
            };
            _SvgRenderEngine.svgNS = 'http://www.w3.org/2000/svg';
            return _SvgRenderEngine;
        })();
        chart._SvgRenderEngine = _SvgRenderEngine;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=SvgRenderEngine.js.map

var wijmo;
(function (wijmo) {
    (function (_chart) {
        'use strict';

        /**
        * Represents the chart legend.
        */
        var Legend = (function () {
            function Legend(chart) {
                this._position = 3 /* Right */;
                this._areas = new Array();
                this._sz = new wijmo.Size();
                this._chart = chart;
            }
            Object.defineProperty(Legend.prototype, "position", {
                //--------------------------------------------------------------------------
                //** object model
                /**
                * Gets or sets the enumerated value that determines whether and where the
                * legend appears in relation to the chart.
                */
                get: function () {
                    return this._position;
                },
                set: function (value) {
                    if (this._position != value) {
                        this._position = wijmo.asEnum(value, _chart.Position);
                        this._chart.invalidate();
                    }
                },
                enumerable: true,
                configurable: true
            });

            //--------------------------------------------------------------------------
            //** implementation
            Legend.prototype._getDesiredSize = function (engine) {
                // no legend? no size.
                var pos = this.position;
                if (pos == 0 /* None */) {
                    return null;
                }

                var isVertical = pos == 3 /* Right */ || pos == 1 /* Left */;

                if (this._chart instanceof wijmo.chart.FlexChart) {
                    this._sz = this._getDesiredSizeSeriesChart(engine, isVertical);
                } else if (this._chart instanceof wijmo.chart.FlexPie) {
                    this._sz = this._getDesiredSizePieChart(engine, isVertical);
                } else {
                    return null;
                }

                return this._sz;
            };

            Legend.prototype._getDesiredSizeSeriesChart = function (engine, isVertical) {
                // measure all series
                var sz = new wijmo.Size();
                var arr = this._chart.series;
                var len = arr.length;
                for (var i = 0; i < len; i++) {
                    // get the series
                    var series = wijmo.tryCast(arr[i], wijmo.chart.Series);

                    // skip hidden series and series with no names
                    var vis = series.visibility;
                    if (!series.name || vis == 3 /* Hidden */ || vis == 1 /* Plot */) {
                        continue;
                    }

                    // measure the legend
                    var isz = series.measureLegendItem(engine);
                    if (isVertical) {
                        sz.height += isz.height;
                        if (sz.width < isz.width) {
                            sz.width = isz.width;
                        }
                    } else {
                        sz.width += isz.width;
                        if (sz.height < isz.height) {
                            sz.height = isz.height;
                        }
                    }
                }

                return sz;
            };

            Legend.prototype._renderSeriesChart = function (engine, pos, isVertical) {
                var arr = this._chart.series;
                var len = arr.length;

                for (var i = 0; i < len; i++) {
                    // get the series
                    var series = wijmo.tryCast(arr[i], wijmo.chart.Series);

                    // skip hidden series and series with no names
                    var vis = series.visibility;
                    if (!series.name || vis == 3 /* Hidden */ || vis == 1 /* Plot */) {
                        series._legendElement = null;
                        continue;
                    }

                    // create legend item
                    var sz = series.measureLegendItem(engine);
                    var rect = new wijmo.Rect(pos.x, pos.y, sz.width, sz.height);
                    var g = engine.startGroup(series.cssClass);
                    if (vis == 2 /* Legend */) {
                        g.setAttribute('opacity', '0.5');
                        series._legendElement = g;
                        series.drawLegendItem(engine, rect);
                    } else if (vis == 0 /* Visible */) {
                        series._legendElement = g;
                        series.drawLegendItem(engine, rect);
                    } else {
                        series._legendElement = null;
                    }

                    // done, move on to next item
                    engine.endGroup();
                    this._areas.push(rect);
                    if (isVertical) {
                        pos.y += sz.height;
                    } else {
                        pos.x += sz.width;
                    }
                }
            };

            Legend.prototype._getDesiredSizePieChart = function (engine, isVertical) {
                var sz = new wijmo.Size();
                var pieChart = this._chart;
                var labels = pieChart._labels;
                var len = labels.length;
                for (var i = 0; i < len; i++) {
                    // measure the legend
                    var isz = pieChart._measureLegendItem(engine, labels[i]);
                    if (isVertical) {
                        sz.height += isz.height;
                        if (sz.width < isz.width) {
                            sz.width = isz.width;
                        }
                    } else {
                        sz.width += isz.width;
                        if (sz.height < isz.height) {
                            sz.height = isz.height;
                        }
                    }
                }
                return sz;
            };

            Legend.prototype._renderPieChart = function (engine, pos, isVertical) {
                var pieChart = this._chart;
                var labels = pieChart._labels;
                var len = labels.length;

                for (var i = 0; i < len; i++) {
                    var sz = pieChart._measureLegendItem(engine, labels[i]);
                    var rect = new wijmo.Rect(pos.x, pos.y, sz.width, sz.height);
                    pieChart._drawLegendItem(engine, rect, i, labels[i]);

                    this._areas.push(rect);
                    if (isVertical) {
                        pos.y += sz.height;
                    } else {
                        pos.x += sz.width;
                    }
                }
            };

            Legend.prototype._render = function (engine, pos) {
                this._areas = [];
                var isVertical = this.position == 3 /* Right */ || this.position == 1 /* Left */;

                // draw legend area
                engine.fill = 'transparent';
                engine.stroke = null;
                engine.drawRect(pos.x, pos.y, this._sz.width, this._sz.height);

                if (this._chart instanceof wijmo.chart.FlexChart) {
                    this._renderSeriesChart(engine, pos, isVertical);
                } else if (this._chart instanceof wijmo.chart.FlexPie) {
                    this._renderPieChart(engine, pos, isVertical);
                } else {
                    return null;
                }
            };

            Legend.prototype._hitTest = function (pt) {
                var areas = this._areas;
                for (var i = 0; i < areas.length; i++) {
                    if (_chart.FlexChart._contains(areas[i], pt))
                        return i;
                }

                return null;
            };
            return Legend;
        })();
        _chart.Legend = Legend;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Legend.js.map

var wijmo;
(function (wijmo) {
    (function (_chart) {
        'use strict';

        /**
        * The enumerated type of chart element that may be found by the hitTest method.
        */
        (function (ChartElement) {
            /** The area within the axes. */
            ChartElement[ChartElement["PlotArea"] = 0] = "PlotArea";

            /** X-axis. */
            ChartElement[ChartElement["AxisX"] = 1] = "AxisX";

            /** Y-axis. */
            ChartElement[ChartElement["AxisY"] = 2] = "AxisY";

            /** The area within the control but outside of the axes. */
            ChartElement[ChartElement["ChartArea"] = 3] = "ChartArea";

            /** The chart legend. */
            ChartElement[ChartElement["Legend"] = 4] = "Legend";

            /** The chart header. */
            ChartElement[ChartElement["Header"] = 5] = "Header";

            /** The chart footer. */
            ChartElement[ChartElement["Footer"] = 6] = "Footer";

            /** A chart series. */
            ChartElement[ChartElement["Series"] = 7] = "Series";

            /** A chart series symbol. */
            ChartElement[ChartElement["SeriesSymbol"] = 8] = "SeriesSymbol";

            /** No chart element. */
            ChartElement[ChartElement["None"] = 9] = "None";
        })(_chart.ChartElement || (_chart.ChartElement = {}));
        var ChartElement = _chart.ChartElement;
        ;

        /**
        * Contains information about a part of a @see:FlexChart control at
        * a specified page coordinate.
        */
        var HitTestInfo = (function () {
            /**
            * Initializes a new instance of a @see:HitTestInfo object.
            *
            * @param chart The chart control.
            * @param point The original point in window coordinates.
            */
            function HitTestInfo(chart, point) {
                this._pointIndex = null;
                this._chartElement = 9 /* None */;
                this._chart = chart;
                this._pt = point;
            }
            Object.defineProperty(HitTestInfo.prototype, "point", {
                /**
                * Gets the point in control coordinates that this HitTestInfo object refers to.
                */
                get: function () {
                    return this._pt;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(HitTestInfo.prototype, "series", {
                /**
                * Gets the chart series at the specified coordinates.
                */
                get: function () {
                    return this._series;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(HitTestInfo.prototype, "pointIndex", {
                /**
                * Gets the data point index at the specified coordinates.
                */
                get: function () {
                    return this._pointIndex;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(HitTestInfo.prototype, "chartElement", {
                /**
                * Gets the chart element at the specified coordinates.
                */
                get: function () {
                    return this._chartElement;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(HitTestInfo.prototype, "distance", {
                /**
                * Gets the distance from the closest data point.
                */
                get: function () {
                    return this._dist;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(HitTestInfo.prototype, "item", {
                /**
                * Gets the data object that corresponds to the closest data point.
                */
                get: function () {
                    if (this._item === undefined) {
                        this._item = null;
                        if (this.series !== null && this.pointIndex !== null) {
                            if (this.series.itemsSource != null) {
                                this._item = this.series.itemsSource[this.pointIndex];
                            } else if (this._chart.itemsSource != null) {
                                this._item = this._chart.itemsSource[this.pointIndex];
                            }
                        }
                    }
                    return this._item;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(HitTestInfo.prototype, "x", {
                /**
                * Gets the x-value of the closest data point.
                */
                get: function () {
                    if (this._x === undefined) {
                        this._x = this._getValue(1, false);
                    }
                    return this._x;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(HitTestInfo.prototype, "y", {
                /**
                * Gets the y-value of the closest data point.
                */
                get: function () {
                    if (this._y === undefined) {
                        this._y = this._getValue(0, false);
                    }
                    return this._y;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(HitTestInfo.prototype, "value", {
                get: function () {
                    if (this._chart instanceof _chart.FlexPie) {
                        var pchart = this._chart;
                        return pchart._values[this.pointIndex];
                    } else {
                        return this.y;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(HitTestInfo.prototype, "name", {
                get: function () {
                    if (this._chart instanceof _chart.FlexPie) {
                        var pchart = this._chart;
                        return pchart._labels[this.pointIndex];
                    } else {
                        return this.series.name;
                    }
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(HitTestInfo.prototype, "_xfmt", {
                // formatted x-value
                get: function () {
                    if (this.__xfmt === undefined) {
                        this.__xfmt = this._getValue(1, true);
                    }
                    return this.__xfmt;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(HitTestInfo.prototype, "_yfmt", {
                // formatted y-value
                get: function () {
                    if (this.__yfmt === undefined) {
                        this.__yfmt = this._getValue(0, true);
                    }
                    return this.__yfmt;
                },
                enumerable: true,
                configurable: true
            });

            // y: index=0
            // x: index=1
            HitTestInfo.prototype._getValue = function (index, formatted) {
                if (this._chart instanceof _chart.FlexPie) {
                    var pchart = this._chart;
                    return pchart._values[this.pointIndex];
                }

                // todo: rotated charts?
                var val = null, chart = this._chart, pi = this.pointIndex;

                if (this.series !== null && pi !== null) {
                    var vals = this.series.getValues(index);
                    var type = this.series.getDataType(index);

                    // normal values
                    if (vals && this.pointIndex < vals.length) {
                        val = vals[this.pointIndex];
                        if (type == 4 /* Date */ && !formatted) {
                            val = _chart.FlexChart._fromOADate(val);
                        }
                    } else if (index == 1) {
                        // category axis
                        if (chart._xlabels && chart._xlabels.length > 0 && pi < chart._xlabels.length) {
                            val = chart._xlabels[pi];
                            // automatic axis values
                        } else if (chart._xvals && pi < chart._xvals.length) {
                            val = chart._xvals[pi];
                            if (chart._xDataType == 4 /* Date */ && !formatted) {
                                val = _chart.FlexChart._fromOADate(val);
                            }
                        }
                    }
                }
                if (val !== null && formatted) {
                    if (index == 0) {
                        val = chart.axisY._formatValue(val);
                    } else if (index == 1) {
                        val = chart.axisX._formatValue(val);
                    }
                }

                return val;
            };
            return HitTestInfo;
        })();
        _chart.HitTestInfo = HitTestInfo;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=HitTestInfo.js.map

var wijmo;
(function (wijmo) {
    (function (chart) {
        'use strict';

        /**
        * These are predefined color palettes for chart @see:Series objects.
        *
        * To create custom color palettes, supply an array of strings or rgba values.
        *
        * You can specify palettes for @see:FlexChart and @see:FlexPie controls.
        * For example:
        *
        * <pre>chart.palette = Palettes.light;</pre>
        *
        * The following palettes are pre-defined:
        * <ul>
        *   <li>standard (default)</li>
        *   <li>cocoa</li>
        *   <li>coral</li>
        *   <li>dark</li>
        *   <li>highcontrast</li>
        *   <li>light</li>
        *   <li>midnight</li>
        *   <li>minimal</li>
        *   <li>modern</li>
        *   <li>organic</li>
        *   <li>slate</li>
        */
        var Palettes = (function () {
            function Palettes() {
            }
            Palettes.standard = ['#88bde6', '#fbb258', '#90cd97', '#f6aac9', '#bfa554', '#bc99c7', '#eddd46', '#f07e6e', '#8c8c8c'];
            Palettes.cocoa = ['#466bb0', '#c8b422', '#14886e', '#b54836', '#6e5944', '#8b3872', '#73b22b', '#b87320', '#141414'];
            Palettes.coral = ['#84d0e0', '#f48256', '#95c78c', '#efa5d6', '#ba8452', '#ab95c2', '#ede9d0', '#e96b7d', '#888888'];
            Palettes.dark = ['#005fad', '#f06400', '#009330', '#e400b1', '#b65800', '#6a279c', '#d5a211', '#dc0127', '#000000'];
            Palettes.highcontrast = ['#ff82b0', '#0dda2c', '#0021ab', '#bcf28c', '#19c23b', '#890d3a', '#607efd', '#1b7700', '#000000'];
            Palettes.light = ['#ddca9a', '#778deb', '#778deb', '#b5eae2', '#7270be', '#a6c7a7', '#9e95c7', '#95b0c7', '#9b9b9b'];
            Palettes.midnight = ['#83aaca', '#e37849', '#14a46a', '#e097da', '#a26d54', '#a584b7', '#d89c54', '#e86996', '#2c343b'];
            Palettes.minimal = ['#92b8da', '#e2d287', '#accdb8', '#eac4cb', '#bbbb7a', '#cab1ca', '#cbd877', '#dfb397', '#c8c8c8'];
            Palettes.modern = ['#2d9fc7', '#ec993c', '#89c235', '#e377a4', '#a68931', '#a672a6', '#d0c041', '#e35855', '#68706a'];
            Palettes.organic = ['#9c88d9', '#a3d767', '#8ec3c0', '#e9c3a9', '#91ab36', '#d4ccc0', '#61bbd8', '#e2d76f', '#80715a'];
            Palettes.slate = ['#7493cd', '#f99820', '#71b486', '#e4a491', '#cb883b', '#ae83a4', '#bacc5c', '#e5746a', '#505d65'];
            return Palettes;
        })();
        chart.Palettes = Palettes;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=Palettes.js.map

var wijmo;
(function (wijmo) {
    (function (chart) {
        'use strict';

        /**
        * Calculates Spline curves.
        */
        var _Spline = (function () {
            //public Point[] Points
            //{
            //    get { return _pts; }
            //}
            function _Spline(x, y) {
                //
                this.k = 0.002;
                this._a = [];
                this._b = [];
                this._c = [];
                this._d = [];
                //  T^3     -1     +3    -3    +1     /
                //  T^2     +2     -5     4    -1    /
                //  T^1     -1      0     1     0   /  2
                //  T^0      0      2     0     0  /
                this.m = [
                    [-1 * 0.5, +3 * 0.5, -3 * 0.5, +1 * 0.5],
                    [+2 * 0.5, -5 * 0.5, +4 * 0.5, -1 * 0.5],
                    [-1 * 0.5, 0, +1 * 0.5, 0],
                    [0, +2 * 0.5, 0, 0]
                ];
                this._x = x;
                this._y = y;

                var len = this._len = Math.min(x.length, y.length);

                if (len > 3) {
                    for (var i = 0; i < len - 1; i++) {
                        var p1 = (i == 0) ? new wijmo.Point(x[i], y[i]) : new wijmo.Point(x[i - 1], y[i - 1]);
                        var p2 = new wijmo.Point(x[i], y[i]);
                        var p3 = new wijmo.Point(x[i + 1], y[i + 1]);
                        var p4 = (i == len - 2) ? new wijmo.Point(x[i + 1], y[i + 1]) : new wijmo.Point(x[i + 2], y[i + 2]);

                        var a = new wijmo.Point();
                        var b = new wijmo.Point();
                        var c = new wijmo.Point();
                        var d = new wijmo.Point();

                        a.x = p1.x * this.m[0][0] + p2.x * this.m[0][1] + p3.x * this.m[0][2] + p4.x * this.m[0][3];
                        b.x = p1.x * this.m[1][0] + p2.x * this.m[1][1] + p3.x * this.m[1][2] + p4.x * this.m[1][3];
                        c.x = p1.x * this.m[2][0] + p2.x * this.m[2][1] + p3.x * this.m[2][2] + p4.x * this.m[2][3];
                        d.x = p1.x * this.m[3][0] + p2.x * this.m[3][1] + p3.x * this.m[3][2] + p4.x * this.m[3][3];

                        a.y = p1.y * this.m[0][0] + p2.y * this.m[0][1] + p3.y * this.m[0][2] + p4.y * this.m[0][3];
                        b.y = p1.y * this.m[1][0] + p2.y * this.m[1][1] + p3.y * this.m[1][2] + p4.y * this.m[1][3];
                        c.y = p1.y * this.m[2][0] + p2.y * this.m[2][1] + p3.y * this.m[2][2] + p4.y * this.m[2][3];
                        d.y = p1.y * this.m[3][0] + p2.y * this.m[3][1] + p3.y * this.m[3][2] + p4.y * this.m[3][3];

                        this._a.push(a);
                        this._b.push(b);
                        this._c.push(c);
                        this._d.push(d);
                    }
                }
            }
            _Spline.prototype.calculatePoint = function (val) {
                var i = Math.floor(val);

                if (i < 0) {
                    i = 0;
                }

                if (i > this._len - 2) {
                    i = this._len - 2;
                }

                var d = val - i;

                var x = ((this._a[i].x * d + this._b[i].x) * d + this._c[i].x) * d + this._d[i].x;
                var y = ((this._a[i].y * d + this._b[i].y) * d + this._c[i].y) * d + this._d[i].y;

                return { x: x, y: y };
            };

            _Spline.prototype.calculate = function () {
                if (this._len <= 3) {
                    return { xs: this._x, ys: this._y };
                }

                var xs = [];
                var ys = [];

                var p0 = this.calculatePoint(0);
                xs.push(p0.x);
                ys.push(p0.y);

                var delta = this._len * this.k;
                var d = 3;

                for (var i = delta; ; i += delta) {
                    var p = this.calculatePoint(i);

                    if (Math.abs(p0.x - p.x) >= d || Math.abs(p0.y - p.y) >= d) {
                        xs.push(p.x);
                        ys.push(p.y);
                        p0 = p;
                    }

                    if (i > this._len - 1)
                        break;
                }

                return { xs: xs, ys: ys };
            };
            return _Spline;
        })();
        chart._Spline = _Spline;
    })(wijmo.chart || (wijmo.chart = {}));
    var chart = wijmo.chart;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=_Spline.js.map

