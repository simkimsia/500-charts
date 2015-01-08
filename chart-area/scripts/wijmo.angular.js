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
var wijmo;
(function (wijmo) {
    // prevent double loading
    if (wijmo && wijmo.interop) {
        return;
    }

    (function (interop) {
        /*
        Represents a shared metadata (control properties/events descriptions) storage used by interop services like
        Angular directives and Knockout custom bindings.
        Control metadata is retrieved using the getMetaData method by passing the control's metaDataId (see the
        method description for details).
        Descriptor objects are created using the CreateProp, CreateEvent and CreateComplexProp static methods.
        The specific interop service should create a class derived from ControlMetaFactory and override these methods to
        create descriptors of the platform specific types (see the wijmo.angular.MetaFactory class as an example).
        To initialize platform specific properties of the descriptors an interop services can use the findProp, findEvent and
        findComplexProp methods to find a necessary descriptor object by name.
        */
        var ControlMetaFactory = (function () {
            function ControlMetaFactory() {
            }
            // Creates a property descriptor object. A specific interop service should override this method in the derived
            // metadata factory class to create platrorm specific descriptor object.
            ControlMetaFactory.CreateProp = function (propertyName, propertyType, bindingMode, enumType, isNativeControlProperty, priority) {
                return new PropDescBase(propertyName, propertyType, bindingMode, enumType, isNativeControlProperty, priority);
            };

            // Creates an event descriptor object. A specific interop service should override this method in the derived
            // metadata factory class to create platrorm specific descriptor object.
            ControlMetaFactory.CreateEvent = function (eventName, isPropChanged) {
                return new EventDescBase(eventName, isPropChanged);
            };

            // Creates a complex property descriptor object. A specific interop service should override this method in the derived
            // metadata factory class to create platrorm specific descriptor object.
            ControlMetaFactory.CreateComplexProp = function (propertyName, isArray, ownsObject) {
                return new ComplexPropDescBase(propertyName, isArray, ownsObject);
            };

            // Finds a property descriptor by the property name in the specified array.
            ControlMetaFactory.findProp = function (propName, props) {
                return this.findInArr(props, 'propertyName', propName);
            };

            // Finds an event descriptor by the event name in the specified array.
            ControlMetaFactory.findEvent = function (eventName, events) {
                return this.findInArr(events, 'eventName', eventName);
            };

            // Finds a complex property descriptor by the property name in the specified array.
            ControlMetaFactory.findComplexProp = function (propName, props) {
                return this.findInArr(props, 'propertyName', propName);
            };

            /*
            Returns metadata for the control by its metadata ID.In the most cases the control type (constructor function)
            is used as metadata ID. In cases where this is not applicable an arbitrary object can be used as an ID, e.g.
            'MenuItem' string is used as the ID for Menu Item.
            
            The sets of descriptors returned for the specific metadata ID take into account the controls inheritance chain
            and include metadata defined for the control's base classes.
            In case of a control that has no a base class metadata you create its metadata object with a constructor:
            return new MetaDataBase(... descriptor arrays ...);
            
            If the control has the base control metadata then you create its metadata object by a recursive call to
            the getMetaData method with the base control's metadata ID passed, and add the controls own metadata to
            the returned object using the 'add' method. E.g. for the ComboBox derived from the DropDown this looks like:
            return this.getMetaData(wijmo.input.DropDown).add(... descriptor arrays ...);
            
            The specific platforms provide the following implementations of the metadata ID support:
            Angular
            =======
            The WjDirective._getMetaDataId method returns a metadata ID. By default it returns a value of the
            WjDirective._controlConstructor property. Because of this approach it's reasonable to override the
            _controlConstructor property even in the abstract classes like WjDropDown, in this case it's not necessary
            to override the _getMetaDataId method itself.
            ----------------
            WARNING: if you overridden the _getMetaDataId method, don't forget to override it in the derived classes!
            ----------------
            You usually need to override the _getMetaDataId method only for classes like WjMenuItem and WjCollectionViewNavigator
            for which the _controlConstructor as an ID approach doesn't work.
            
            Knockout
            ========
            TBD
            */
            ControlMetaFactory.getMetaData = function (metaDataId) {
                switch (metaDataId) {
                    case wijmo.input && wijmo.input.DropDown:
                        return new MetaDataBase([
                            this.CreateProp('isDroppedDown', 0 /* Boolean */, 1 /* TwoWay */),
                            this.CreateProp('showDropDownButton', 0 /* Boolean */),
                            this.CreateProp('placeholder', 3 /* String */),
                            this.CreateProp('text', 3 /* String */, 1 /* TwoWay */, null, true, 1000)
                        ], [
                            this.CreateEvent('isDroppedDownChanged', true),
                            this.CreateEvent('textChanged', true)
                        ]);

                    case wijmo.input && wijmo.input.ComboBox:
                        return this.getMetaData(wijmo.input.DropDown).add([
                            this.CreateProp('displayMemberPath', 3 /* String */),
                            this.CreateProp('selectedValuePath', 3 /* String */),
                            this.CreateProp('isContentHtml', 0 /* Boolean */),
                            this.CreateProp('isEditable', 0 /* Boolean */),
                            this.CreateProp('required', 0 /* Boolean */),
                            this.CreateProp('maxDropDownHeight', 1 /* Number */),
                            this.CreateProp('maxDropDownWidth', 1 /* Number */),
                            this.CreateProp('itemFormatter', 5 /* Function */),
                            this.CreateProp('itemsSource', 7 /* Any */, 0 /* OneWay */, null, true, 900),
                            this.CreateProp('selectedIndex', 1 /* Number */, 1 /* TwoWay */, null, true, 1000),
                            this.CreateProp('selectedItem', 7 /* Any */, 1 /* TwoWay */, null, true, 1000),
                            this.CreateProp('selectedValue', 7 /* Any */, 1 /* TwoWay */, null, true, 1000)
                        ], [
                            this.CreateEvent('selectedIndexChanged', true)
                        ]);

                    case wijmo.input && wijmo.input.AutoComplete:
                        return this.getMetaData(wijmo.input.ComboBox).add([
                            this.CreateProp('delay', 1 /* Number */),
                            this.CreateProp('maxItems', 1 /* Number */),
                            this.CreateProp('minLength', 1 /* Number */),
                            this.CreateProp('cssMatch', 3 /* String */),
                            this.CreateProp('itemsSourceFunction', 5 /* Function */)
                        ]);

                    case wijmo.input && wijmo.input.Calendar:
                        return new MetaDataBase([
                            this.CreateProp('itemFormatter', 5 /* Function */),
                            this.CreateProp('monthView', 0 /* Boolean */),
                            this.CreateProp('showHeader', 0 /* Boolean */),
                            this.CreateProp('max', 2 /* Date */),
                            this.CreateProp('min', 2 /* Date */),
                            this.CreateProp('value', 2 /* Date */, 1 /* TwoWay */),
                            this.CreateProp('displayMonth', 2 /* Date */, 1 /* TwoWay */),
                            this.CreateProp('firstDayOfWeek', 1 /* Number */)
                        ], [
                            this.CreateEvent('valueChanged', true),
                            this.CreateEvent('displayMonthChanged', true)
                        ]);

                    case wijmo.input && wijmo.input.ColorPicker:
                        return new MetaDataBase([
                            this.CreateProp('showAlphaChannel', 0 /* Boolean */),
                            this.CreateProp('showColorString', 0 /* Boolean */),
                            this.CreateProp('palette', 7 /* Any */),
                            this.CreateProp('value', 3 /* String */, 1 /* TwoWay */)
                        ], [
                            this.CreateEvent('valueChanged', true)
                        ]);

                    case wijmo.input && wijmo.input.ListBox:
                        return new MetaDataBase([
                            this.CreateProp('isContentHtml', 0 /* Boolean */),
                            this.CreateProp('maxHeight', 1 /* Number */),
                            this.CreateProp('selectedValuePath', 3 /* String */),
                            this.CreateProp('itemFormatter', 5 /* Function */),
                            this.CreateProp('displayMemberPath', 3 /* String */),
                            this.CreateProp('itemsSource', 7 /* Any */),
                            this.CreateProp('selectedIndex', 1 /* Number */, 1 /* TwoWay */),
                            this.CreateProp('selectedItem', 7 /* Any */, 1 /* TwoWay */),
                            this.CreateProp('selectedValue', 7 /* Any */, 1 /* TwoWay */)
                        ], [
                            this.CreateEvent('itemsChanged', true),
                            this.CreateEvent('selectedIndexChanged', true)
                        ]);

                    case wijmo.input && wijmo.input.Menu:
                        return this.getMetaData(wijmo.input.ComboBox).add([
                            this.CreateProp('header', 3 /* String */),
                            this.CreateProp('commandParameterPath', 3 /* String */),
                            this.CreateProp('commandPath', 3 /* String */),
                            this.CreateProp('value', 7 /* Any */, 1 /* TwoWay */, null, false, 1000)
                        ], [
                            this.CreateEvent('itemClicked')
                        ]);

                    case 'MenuItem':
                        return new MetaDataBase([
                            this.CreateProp('value', 7 /* Any */, 0 /* OneWay */),
                            this.CreateProp('cmd', 7 /* Any */, 0 /* OneWay */),
                            this.CreateProp('cmdParam', 7 /* Any */, 0 /* OneWay */)
                        ]);

                    case wijmo.input && wijmo.input.InputDate:
                        return this.getMetaData(wijmo.input.DropDown).add([
                            this.CreateProp('required', 0 /* Boolean */),
                            this.CreateProp('format', 3 /* String */),
                            this.CreateProp('mask', 3 /* String */),
                            this.CreateProp('max', 2 /* Date */),
                            this.CreateProp('min', 2 /* Date */),
                            this.CreateProp('value', 2 /* Date */, 1 /* TwoWay */, null, true, 1000)
                        ], [
                            this.CreateEvent('valueChanged', true)
                        ]);

                    case wijmo.input && wijmo.input.InputNumber:
                        return new MetaDataBase([
                            this.CreateProp('showSpinner', 0 /* Boolean */),
                            this.CreateProp('max', 1 /* Number */),
                            this.CreateProp('min', 1 /* Number */),
                            this.CreateProp('step', 1 /* Number */),
                            this.CreateProp('required', 0 /* Boolean */),
                            this.CreateProp('placeholder', 3 /* String */),
                            this.CreateProp('inputType', 3 /* String */),
                            this.CreateProp('value', 1 /* Number */, 1 /* TwoWay */),
                            this.CreateProp('text', 3 /* String */, 1 /* TwoWay */),
                            this.CreateProp('format', 3 /* String */)
                        ], [
                            this.CreateEvent('valueChanged', true),
                            this.CreateEvent('textChanged', true)
                        ]);

                    case wijmo.input && wijmo.input.InputMask:
                        return new MetaDataBase([
                            this.CreateProp('mask', 3 /* String */),
                            this.CreateProp('promptChar', 3 /* String */),
                            this.CreateProp('placeholder', 3 /* String */),
                            this.CreateProp('value', 3 /* String */, 1 /* TwoWay */)
                        ], [
                            this.CreateEvent('valueChanged', true)
                        ]);

                    case wijmo.input && wijmo.input.InputTime:
                        return this.getMetaData(wijmo.input.ComboBox).add([
                            this.CreateProp('max', 2 /* Date */),
                            this.CreateProp('min', 2 /* Date */),
                            this.CreateProp('step', 1 /* Number */),
                            this.CreateProp('format', 3 /* String */),
                            this.CreateProp('mask', 3 /* String */),
                            this.CreateProp('value', 2 /* Date */, 1 /* TwoWay */, null, true, 1000)
                        ], [
                            this.CreateEvent('valueChanged', true)
                        ]);

                    case wijmo.input && wijmo.input.InputColor:
                        return this.getMetaData(wijmo.input.DropDown).add([
                            this.CreateProp('required', 0 /* Boolean */),
                            this.CreateProp('showAlphaChannel', 0 /* Boolean */),
                            this.CreateProp('value', 3 /* String */, 1 /* TwoWay */)
                        ], [
                            this.CreateEvent('valueChanged', true)
                        ]);

                    case 'CollectionViewNavigator':
                        return new MetaDataBase([
                            this.CreateProp('cv', 7 /* Any */)
                        ]);

                    case 'CollectionViewPager':
                        return new MetaDataBase([
                            this.CreateProp('cv', 7 /* Any */)
                        ]);

                    case wijmo.grid && wijmo.grid.FlexGrid:
                        return new MetaDataBase([
                            this.CreateProp('allowAddNew', 0 /* Boolean */),
                            this.CreateProp('allowDelete', 0 /* Boolean */),
                            this.CreateProp('allowDragging', 4 /* Enum */, 0 /* OneWay */, wijmo.grid.AllowDragging),
                            this.CreateProp('allowMerging', 4 /* Enum */, 0 /* OneWay */, wijmo.grid.AllowMerging),
                            this.CreateProp('allowResizing', 4 /* Enum */, 0 /* OneWay */, wijmo.grid.AllowResizing),
                            this.CreateProp('allowSorting', 0 /* Boolean */),
                            this.CreateProp('autoGenerateColumns', 0 /* Boolean */),
                            this.CreateProp('childItemsPath', 7 /* Any */),
                            this.CreateProp('groupHeaderFormat', 3 /* String */),
                            this.CreateProp('headersVisibility', 4 /* Enum */, 0 /* OneWay */, wijmo.grid.HeadersVisibility),
                            this.CreateProp('itemFormatter', 5 /* Function */),
                            this.CreateProp('isReadOnly', 0 /* Boolean */),
                            this.CreateProp('mergeManager', 7 /* Any */),
                            this.CreateProp('selectionMode', 4 /* Enum */, 0 /* OneWay */, wijmo.grid.SelectionMode),
                            this.CreateProp('showGroups', 0 /* Boolean */),
                            this.CreateProp('showSort', 0 /* Boolean */),
                            this.CreateProp('treeIndent', 1 /* Number */),
                            this.CreateProp('itemsSource', 7 /* Any */),
                            this.CreateProp('autoClipboard', 0 /* Boolean */)
                        ], [
                            this.CreateEvent('beginningEdit'),
                            this.CreateEvent('cellEditEnded'),
                            this.CreateEvent('cellEditEnding'),
                            this.CreateEvent('prepareCellForEdit'),
                            this.CreateEvent('resizingColumn'),
                            this.CreateEvent('resizedColumn'),
                            this.CreateEvent('draggedColumn'),
                            this.CreateEvent('draggingColumn'),
                            this.CreateEvent('sortedColumn'),
                            this.CreateEvent('sortingColumn'),
                            this.CreateEvent('deletingRow'),
                            this.CreateEvent('draggingRow'),
                            this.CreateEvent('draggedRow'),
                            this.CreateEvent('resizingRow'),
                            this.CreateEvent('resizedRow'),
                            this.CreateEvent('rowAdded'),
                            this.CreateEvent('rowEditEnded'),
                            this.CreateEvent('rowEditEnding'),
                            this.CreateEvent('loadedRows'),
                            this.CreateEvent('loadingRows'),
                            this.CreateEvent('groupCollapsedChanged'),
                            this.CreateEvent('groupCollapsedChanging'),
                            this.CreateEvent('itemsSourceChanged', true),
                            this.CreateEvent('selectionChanging'),
                            this.CreateEvent('selectionChanged', true),
                            this.CreateEvent('scrollPositionChanged', false),
                            this.CreateEvent('pasting'),
                            this.CreateEvent('pasted'),
                            this.CreateEvent('copying'),
                            this.CreateEvent('copied')
                        ]);

                    case wijmo.grid && wijmo.grid.Column:
                        return new MetaDataBase([
                            this.CreateProp('name', 3 /* String */),
                            this.CreateProp('dataMap', 7 /* Any */),
                            this.CreateProp('dataType', 4 /* Enum */, 0 /* OneWay */, wijmo.DataType),
                            this.CreateProp('binding', 3 /* String */),
                            this.CreateProp('format', 3 /* String */),
                            this.CreateProp('header', 3 /* String */),
                            this.CreateProp('width', 1 /* Number */),
                            this.CreateProp('minWidth', 1 /* Number */),
                            this.CreateProp('maxWidth', 1 /* Number */),
                            this.CreateProp('align', 3 /* String */),
                            this.CreateProp('allowDragging', 0 /* Boolean */),
                            this.CreateProp('allowSorting', 0 /* Boolean */),
                            this.CreateProp('allowResizing', 0 /* Boolean */),
                            this.CreateProp('allowMerging', 0 /* Boolean */),
                            this.CreateProp('aggregate', 4 /* Enum */, 0 /* OneWay */, wijmo.Aggregate),
                            this.CreateProp('isReadOnly', 0 /* Boolean */),
                            this.CreateProp('cssClass', 3 /* String */),
                            this.CreateProp('isContentHtml', 0 /* Boolean */),
                            this.CreateProp('isSelected', 0 /* Boolean */, 1 /* TwoWay */),
                            this.CreateProp('visible', 0 /* Boolean */),
                            this.CreateProp('wordWrap', 0 /* Boolean */),
                            this.CreateProp('mask', 3 /* String */),
                            this.CreateProp('inputType', 3 /* String */),
                            this.CreateProp('required', 0 /* Boolean */),
                            this.CreateProp('showDropDown', 0 /* Boolean */)
                        ], [], [], 'columns', true);

                    case wijmo.chart && wijmo.chart.FlexChartBase:
                        return new MetaDataBase([
                            this.CreateProp('binding', 3 /* String */),
                            this.CreateProp('footer', 3 /* String */),
                            this.CreateProp('header', 3 /* String */),
                            this.CreateProp('selectionMode', 4 /* Enum */, 0 /* OneWay */, wijmo.chart.SelectionMode),
                            this.CreateProp('palette', 7 /* Any */),
                            this.CreateProp('plotMargin', 7 /* Any */),
                            this.CreateProp('footerStyle', 7 /* Any */),
                            this.CreateProp('headerStyle', 7 /* Any */),
                            this.CreateProp('tooltipContent', 3 /* String */, 0 /* OneWay */, null, false),
                            this.CreateProp('itemsSource', 7 /* Any */)
                        ], [
                            this.CreateEvent('rendering'),
                            this.CreateEvent('rendered')
                        ]);

                    case wijmo.chart && wijmo.chart.FlexChart:
                        return this.getMetaData(wijmo.chart.FlexChartBase).add([
                            this.CreateProp('bindingX', 3 /* String */),
                            this.CreateProp('chartType', 4 /* Enum */, 0 /* OneWay */, wijmo.chart.ChartType),
                            this.CreateProp('interpolateNulls', 0 /* Boolean */),
                            this.CreateProp('legendToggle', 0 /* Boolean */),
                            this.CreateProp('rotated', 0 /* Boolean */),
                            this.CreateProp('stacking', 4 /* Enum */, 0 /* OneWay */, wijmo.chart.Stacking),
                            this.CreateProp('symbolSize', 1 /* Number */),
                            this.CreateProp('options', 7 /* Any */),
                            this.CreateProp('selection', 7 /* Any */, 1 /* TwoWay */),
                            this.CreateProp('itemFormatter', 5 /* Function */)
                        ], [
                            this.CreateEvent('seriesVisibilityChanged'),
                            this.CreateEvent('selectionChanged', true)
                        ], [
                            this.CreateComplexProp('axisX', false, false),
                            this.CreateComplexProp('axisY', false, false),
                            this.CreateComplexProp('axes', true)
                        ]);

                    case wijmo.chart && wijmo.chart.FlexPie:
                        return this.getMetaData(wijmo.chart.FlexChartBase).add([
                            this.CreateProp('bindingName', 3 /* String */),
                            this.CreateProp('innerRadius', 1 /* Number */),
                            this.CreateProp('isAnimated', 0 /* Boolean */),
                            this.CreateProp('offset', 1 /* Number */),
                            this.CreateProp('reversed', 0 /* Boolean */),
                            this.CreateProp('startAngle', 1 /* Number */),
                            this.CreateProp('selectedItemPosition', 4 /* Enum */, 0 /* OneWay */, wijmo.chart.Position),
                            this.CreateProp('selectedItemOffset', 1 /* Number */),
                            this.CreateProp('itemFormatter', 5 /* Function */)
                        ]);

                    case wijmo.chart && wijmo.chart.Axis:
                        return new MetaDataBase([
                            this.CreateProp('axisLine', 0 /* Boolean */),
                            this.CreateProp('format', 3 /* String */),
                            this.CreateProp('labels', 0 /* Boolean */),
                            this.CreateProp('majorGrid', 0 /* Boolean */),
                            this.CreateProp('majorTickMarks', 4 /* Enum */, 0 /* OneWay */, wijmo.chart.TickMark),
                            this.CreateProp('majorUnit', 1 /* Number */),
                            this.CreateProp('max', 1 /* Number */),
                            this.CreateProp('min', 1 /* Number */),
                            this.CreateProp('position', 4 /* Enum */, 0 /* OneWay */, wijmo.chart.Position),
                            this.CreateProp('reversed', 0 /* Boolean */),
                            this.CreateProp('title', 3 /* String */),
                            this.CreateProp('labelAngle', 1 /* Number */),
                            this.CreateProp('minorGrid', 0 /* Boolean */),
                            this.CreateProp('minorTickMarks', 4 /* Enum */, 0 /* OneWay */, wijmo.chart.TickMark),
                            this.CreateProp('origin', 1 /* Number */)
                        ], [], [], 'axes', true);

                    case wijmo.chart && wijmo.chart.Legend:
                        return new MetaDataBase([
                            this.CreateProp('position', 4 /* Enum */, 0 /* OneWay */, wijmo.chart.Position)
                        ], [], [], 'legend', false, false);

                    case wijmo.chart && wijmo.chart.Series:
                        return new MetaDataBase([
                            this.CreateProp('binding', 3 /* String */),
                            this.CreateProp('bindingX', 3 /* String */),
                            this.CreateProp('chartType', 4 /* Enum */, 0 /* OneWay */, wijmo.chart.ChartType),
                            this.CreateProp('cssClass', 3 /* String */),
                            this.CreateProp('name', 3 /* String */),
                            this.CreateProp('style', 7 /* Any */),
                            this.CreateProp('symbolMarker', 4 /* Enum */, 0 /* OneWay */, wijmo.chart.Marker),
                            this.CreateProp('symbolSize', 1 /* Number */),
                            this.CreateProp('symbolStyle', 7 /* Any */),
                            this.CreateProp('visibility', 4 /* Enum */, 1 /* TwoWay */, wijmo.chart.SeriesVisibility),
                            this.CreateProp('itemsSource', 7 /* Any */)
                        ], [], [
                            this.CreateComplexProp('axisX', false, true),
                            this.CreateComplexProp('axisY', false, true)
                        ], 'series', true);

                    case wijmo.gauge && wijmo.gauge.Gauge:
                        return new MetaDataBase([
                            this.CreateProp('value', 1 /* Number */, 1 /* TwoWay */),
                            this.CreateProp('min', 1 /* Number */),
                            this.CreateProp('max', 1 /* Number */),
                            this.CreateProp('isReadOnly', 0 /* Boolean */),
                            this.CreateProp('step', 1 /* Number */),
                            this.CreateProp('format', 3 /* String */),
                            this.CreateProp('thickness', 1 /* Number */),
                            this.CreateProp('hasShadow', 0 /* Boolean */),
                            this.CreateProp('isAnimated', 0 /* Boolean */),
                            this.CreateProp('showText', 4 /* Enum */, 0 /* OneWay */, wijmo.gauge.ShowText),
                            this.CreateProp('showRanges', 0 /* Boolean */)
                        ], [
                            this.CreateEvent('valueChanged', true)
                        ], [
                            this.CreateComplexProp('ranges', true),
                            this.CreateComplexProp('pointer', false, false),
                            this.CreateComplexProp('face', false, false)
                        ]);

                    case wijmo.gauge && wijmo.gauge.LinearGauge:
                        return this.getMetaData(wijmo.gauge.Gauge).add([
                            this.CreateProp('direction', 4 /* Enum */, 0 /* OneWay */, wijmo.gauge.GaugeDirection)
                        ]);

                    case wijmo.gauge && wijmo.gauge.BulletGraph:
                        return this.getMetaData(wijmo.gauge.LinearGauge).add([
                            this.CreateProp('target', 1 /* Number */),
                            this.CreateProp('good', 1 /* Number */),
                            this.CreateProp('bad', 1 /* Number */)
                        ]);

                    case wijmo.gauge && wijmo.gauge.RadialGauge:
                        return this.getMetaData(wijmo.gauge.Gauge).add([
                            this.CreateProp('autoScale', 0 /* Boolean */),
                            this.CreateProp('startAngle', 1 /* Number */),
                            this.CreateProp('sweepAngle', 1 /* Number */)
                        ]);

                    case wijmo.gauge && wijmo.gauge.Range:
                        return new MetaDataBase([
                            this.CreateProp('color', 3 /* String */),
                            this.CreateProp('min', 1 /* Number */),
                            this.CreateProp('max', 1 /* Number */),
                            this.CreateProp('name', 3 /* String */),
                            this.CreateProp('thickness', 1 /* Number */)
                        ], [], [], 'ranges', true);
                }

                return new MetaDataBase([]);
            };

            // For the specified class reference returns its name as a string, e.g.
            // getClassName(wijmo.input.ComboBox) returns 'ComboBox'.
            ControlMetaFactory.getClassName = function (classRef) {
                return (classRef.toString().match(/function (.+?)\(/) || [, ''])[1];
            };

            ControlMetaFactory.findInArr = function (arr, propName, value) {
                for (var i in arr) {
                    if (arr[i][propName] === value) {
                        return arr[i];
                    }
                }
                return null;
            };
            return ControlMetaFactory;
        })();
        interop.ControlMetaFactory = ControlMetaFactory;

        // Describes a scope property: name, type, binding mode.
        // Also defines enum type and custom watcher function extender
        var PropDescBase = (function () {
            // Initializes a new instance of a PropDesc
            function PropDescBase(propertyName, propertyType, bindingMode, enumType, isNativeControlProperty, priority) {
                if (typeof bindingMode === "undefined") { bindingMode = 0 /* OneWay */; }
                if (typeof isNativeControlProperty === "undefined") { isNativeControlProperty = true; }
                if (typeof priority === "undefined") { priority = 0; }
                this._priority = 0;
                this._propertyName = propertyName;
                this._propertyType = propertyType;
                this._bindingMode = bindingMode;
                this._enumType = enumType;
                this._isNativeControlProperty = isNativeControlProperty;
                this._priority = priority;
            }
            Object.defineProperty(PropDescBase.prototype, "propertyName", {
                // Gets the property name
                get: function () {
                    return this._propertyName;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PropDescBase.prototype, "propertyType", {
                // Gets the property type (number, string, boolean, enum, or any)
                get: function () {
                    return this._propertyType;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PropDescBase.prototype, "enumType", {
                // Gets the property enum type
                get: function () {
                    return this._enumType;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PropDescBase.prototype, "bindingMode", {
                // Gets the property binding mode
                get: function () {
                    return this._bindingMode;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PropDescBase.prototype, "isNativeControlProperty", {
                // Gets whether the property belongs to the control is just to the directive
                get: function () {
                    return this._isNativeControlProperty;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PropDescBase.prototype, "priority", {
                // Gets an initialization priority. Properties with higher priority are assigned to directive's underlying control
                // property later than properties with lower priority. Properties with the same priority are assigned in the order of
                // their index in the _props collection.
                get: function () {
                    return this._priority;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PropDescBase.prototype, "shouldUpdateSource", {
                // Indicates whether a bound 'controller' property should be updated on this property change (i.e. two-way binding).
                get: function () {
                    return this.bindingMode === 1 /* TwoWay */ && this.propertyType != 6 /* EventHandler */;
                },
                enumerable: true,
                configurable: true
            });

            PropDescBase.prototype.initialize = function (options) {
                wijmo.copy(this, options);
            };
            return PropDescBase;
        })();
        interop.PropDescBase = PropDescBase;

        // Property types as used in the PropDesc class.
        (function (PropertyType) {
            PropertyType[PropertyType["Boolean"] = 0] = "Boolean";
            PropertyType[PropertyType["Number"] = 1] = "Number";
            PropertyType[PropertyType["Date"] = 2] = "Date";
            PropertyType[PropertyType["String"] = 3] = "String";
            PropertyType[PropertyType["Enum"] = 4] = "Enum";
            PropertyType[PropertyType["Function"] = 5] = "Function";
            PropertyType[PropertyType["EventHandler"] = 6] = "EventHandler";
            PropertyType[PropertyType["Any"] = 7] = "Any";
        })(interop.PropertyType || (interop.PropertyType = {}));
        var PropertyType = interop.PropertyType;

        // Gets a value indicating whether the specified type is simple (true) or complex (false).
        function isSimpleType(type) {
            return type <= 4 /* Enum */;
        }
        interop.isSimpleType = isSimpleType;

        (function (BindingMode) {
            BindingMode[BindingMode["OneWay"] = 0] = "OneWay";
            BindingMode[BindingMode["TwoWay"] = 1] = "TwoWay";
        })(interop.BindingMode || (interop.BindingMode = {}));
        var BindingMode = interop.BindingMode;

        // Describes a scope event
        var EventDescBase = (function () {
            // Initializes a new instance of an EventDesc
            function EventDescBase(eventName, isPropChanged) {
                this._eventName = eventName;
                this._isPropChanged = isPropChanged;
            }
            Object.defineProperty(EventDescBase.prototype, "eventName", {
                // Gets the event name
                get: function () {
                    return this._eventName;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(EventDescBase.prototype, "isPropChanged", {
                // Gets whether this event is a property change notification
                get: function () {
                    return this._isPropChanged === true;
                },
                enumerable: true,
                configurable: true
            });
            return EventDescBase;
        })();
        interop.EventDescBase = EventDescBase;

        // Describe property info for nested directives.
        var ComplexPropDescBase = (function () {
            function ComplexPropDescBase(propertyName, isArray, ownsObject) {
                if (typeof ownsObject === "undefined") { ownsObject = false; }
                this.isArray = false;
                this._ownsObject = false;
                this.propertyName = propertyName;
                this.isArray = isArray;
                this._ownsObject = ownsObject;
            }
            Object.defineProperty(ComplexPropDescBase.prototype, "ownsObject", {
                get: function () {
                    return this.isArray || this._ownsObject;
                },
                enumerable: true,
                configurable: true
            });
            return ComplexPropDescBase;
        })();
        interop.ComplexPropDescBase = ComplexPropDescBase;

        // Stores a control metadata as arrays of property, event and complex property descriptors.
        var MetaDataBase = (function () {
            function MetaDataBase(props, events, complexProps, parentProperty, isParentPropertyArray, ownsObject) {
                this.props = props;
                this.events = events;
                this.complexProps = complexProps;
                this.parentProperty = parentProperty;
                this.isParentPropertyArray = isParentPropertyArray;
                this.ownsObject = ownsObject;
            }
            Object.defineProperty(MetaDataBase.prototype, "props", {
                get: function () {
                    return this._props;
                },
                set: function (value) {
                    this._props = value || [];
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MetaDataBase.prototype, "events", {
                get: function () {
                    return this._events;
                },
                set: function (value) {
                    this._events = value || [];
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(MetaDataBase.prototype, "complexProps", {
                get: function () {
                    return this._complexProps;
                },
                set: function (value) {
                    this._complexProps = value || [];
                },
                enumerable: true,
                configurable: true
            });

            // Adds the specified arrays to the end of corresponding arrays of this object, and overwrite the simple properties
            // if specified. Returns 'this'.
            MetaDataBase.prototype.add = function (props, events, complexProps, parentProperty, isParentPropertyArray, ownsObject) {
                this._props = this._props.concat(props || []);
                this._events = this._events.concat(events || []);
                this._complexProps = this._complexProps.concat(complexProps || []);
                if (parentProperty !== undefined) {
                    this.parentProperty = parentProperty;
                }
                if (isParentPropertyArray !== undefined) {
                    this.isParentPropertyArray = isParentPropertyArray;
                }
                if (ownsObject !== undefined) {
                    this.ownsObject = ownsObject;
                }
                return this;
            };

            // Prepares a raw defined metadata for a usage, for exmple sorts the props array on priority.
            MetaDataBase.prototype.prepare = function () {
                // stable sort of props on priority
                var baseArr = [].concat(this._props);
                this._props.sort(function (a, b) {
                    var ret = a.priority - b.priority;
                    if (!ret) {
                        ret = baseArr.indexOf(a) - baseArr.indexOf(b);
                    }
                    return ret;
                });
            };
            return MetaDataBase;
        })();
        interop.MetaDataBase = MetaDataBase;
    })(wijmo.interop || (wijmo.interop = {}));
    var interop = wijmo.interop;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=ControlMetaFactory.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    (function (angular) {
        var MetaFactory = (function (_super) {
            __extends(MetaFactory, _super);
            function MetaFactory() {
                _super.apply(this, arguments);
            }
            // Override to return wijmo.angular.PropDesc
            MetaFactory.CreateProp = function (propertyName, propertyType, bindingMode, enumType, isNativeControlProperty, priority) {
                return new PropDesc(propertyName, propertyType, bindingMode, enumType, isNativeControlProperty, priority);
            };

            // Override to return wijmo.angular.EventDesc
            MetaFactory.CreateEvent = function (eventName, isPropChanged) {
                return new EventDesc(eventName, isPropChanged);
            };

            // Override to return wijmo.angular.ComplexPropDesc
            MetaFactory.CreateComplexProp = function (propertyName, isArray, ownsObject) {
                return new ComplexPropDesc(propertyName, isArray, ownsObject);
            };

            // Typecast override.
            MetaFactory.findProp = function (propName, props) {
                return wijmo.interop.ControlMetaFactory.findProp(propName, props);
            };

            // Typecast override.
            MetaFactory.findEvent = function (eventName, events) {
                return wijmo.interop.ControlMetaFactory.findEvent(eventName, events);
            };

            // Typecast override.
            MetaFactory.findComplexProp = function (propName, props) {
                return wijmo.interop.ControlMetaFactory.findComplexProp(propName, props);
            };
            return MetaFactory;
        })(wijmo.interop.ControlMetaFactory);
        angular.MetaFactory = MetaFactory;

        // Describes a scope property: name, type, binding mode.
        // Also defines enum type and custom watcher function extender
        var PropDesc = (function (_super) {
            __extends(PropDesc, _super);
            // Initializes a new instance of a PropDesc
            function PropDesc(propertyName, propertyType, bindingMode, enumType, isNativeControlProperty, priority) {
                _super.call(this, propertyName, propertyType, bindingMode, enumType, isNativeControlProperty, priority);

                this._scopeBindingMode = this.propertyType === 6 /* EventHandler */ ? '&' : (this.bindingMode == 0 /* OneWay */ && wijmo.interop.isSimpleType(this.propertyType) ? '@' : '=');
            }
            Object.defineProperty(PropDesc.prototype, "scopeBindingMode", {
                // Gets or sets the property binding mode ('@' - by val, '=' - by ref, '&' - expression)
                get: function () {
                    return this._scopeBindingMode;
                },
                set: function (value) {
                    this._scopeBindingMode = value;
                },
                enumerable: true,
                configurable: true
            });

            Object.defineProperty(PropDesc.prototype, "customHandler", {
                // Gets related property custom watcher function extender
                get: function () {
                    return this._customHandler;
                },
                set: function (value) {
                    this._customHandler = value;
                },
                enumerable: true,
                configurable: true
            });
            return PropDesc;
        })(wijmo.interop.PropDescBase);
        angular.PropDesc = PropDesc;

        // Describes a scope event
        var EventDesc = (function (_super) {
            __extends(EventDesc, _super);
            function EventDesc() {
                _super.apply(this, arguments);
            }
            return EventDesc;
        })(wijmo.interop.EventDescBase);
        angular.EventDesc = EventDesc;

        // Describes property info for nested directives.
        var ComplexPropDesc = (function (_super) {
            __extends(ComplexPropDesc, _super);
            function ComplexPropDesc() {
                _super.apply(this, arguments);
            }
            return ComplexPropDesc;
        })(wijmo.interop.ComplexPropDescBase);
        angular.ComplexPropDesc = ComplexPropDesc;
    })(wijmo.angular || (wijmo.angular = {}));
    var angular = wijmo.angular;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.MetaFactory.js.map

var wijmo;
(function (wijmo) {
    //
    // AngularJS base directive class
    //
    (function (angular) {
        // Base class for AngularJS directives (abstract class).
        var WjDirective = (function () {
            // Initializes a new instance of the DirectiveBase class
            function WjDirective() {
                // Tells directive to replace or not original tag with the template
                this.replace = true;
                // Defines the way directive can be used in HTML
                this.restrict = 'E';
                // Defines directive's template
                this.template = '<div />';
                // Tells directive to move content into template element marked with
                // 'ng-transclude' attribute
                this.transclude = false;
                //#endregion Settings
                // Directive property map
                // Holds PropDesc[] array with Wijmo control's properties available in directive's scope
                this._props = [];
                // Directive events map
                // Holds EventDesc[] array with Wijmo control's events available in directive's scope
                this._events = [];
                // Property descriptions used by nested directives.
                this._complexProps = [];
                var self = this;
                this.link = this._postLinkFn();
                this.controller = function ($scope, $parse, $element) {
                    // 'this' points to the controller instance here
                    self._$parse = $parse;
                    this[WjDirective._cntrlScopeProp] = $scope;
                    $scope[WjDirective._scopeChildrenProp] = [];
                    self._controllerImpl(this, $scope, $element);
                };
                this._initDirective();
            }
            Object.defineProperty(WjDirective.prototype, "_controlConstructor", {
                // Gets the constructor for the related Wijmo control.
                // Abstract member, must be overridden in inherited class
                get: function () {
                    throw 'Abstract method call';
                },
                enumerable: true,
                configurable: true
            });

            // Gets the metadata ID, see the wijmo.interop.getMetaData method description for details.
            WjDirective.prototype._getMetaDataId = function () {
                return this._controlConstructor;
            };

            // Initializes DDO properties
            WjDirective.prototype._initDirective = function () {
                this._initSharedMeta();
                this._prepareProps();
                this._initEvents();
                this._initScopeEvents();
                this._initScopeDescription();
            };

            // Initialize _props, _events and _complexProps with the shared metadata from wijmo.interop.ControlMetaFactory.
            WjDirective.prototype._initSharedMeta = function () {
                var metaId = this._getMetaDataId();
                if (metaId == null) {
                    throw 'Directive metadata ID is undefined';
                }
                var meta = angular.MetaFactory.getMetaData(metaId);
                this._props = meta.props;
                this._events = meta.events;
                this._complexProps = meta.complexProps;
                this._property = meta.parentProperty;
                this._isPropertyArray = meta.isParentPropertyArray;
                this._ownObject = meta.ownsObject;
            };

            // Initializes control's property map. Abstract member, must be overridden in inherited class
            WjDirective.prototype._initProps = function () {
            };

            // Initializes control's event map. Abstract member, must be overridden in inherited class
            WjDirective.prototype._initEvents = function () {
            };

            // Creates and returns WjLink instance pertain to the directive.
            WjDirective.prototype._createLink = function () {
                return new WjLink();
            };

            // Implements a controller body, override it to implement a custom controller logic.
            // controller - a pointer to controller object.
            // scope - controller (and corresponding WjLink) scope.
            //
            // The DDO.controller property is occupied by our wrapper that creates a controller with the _cntrlScope property assigned
            // to the controller's scope. The wrapper then calls this method that is intended to implement a custom controller logic.
            WjDirective.prototype._controllerImpl = function (controller, scope, tElement) {
            };

            // Indicates whether this directictive can operate as a child directictive.
            WjDirective.prototype._isChild = function () {
                return this._property != undefined;
            };

            // For the specified scope/control property name returns its corresponding directive tag attribute name.
            WjDirective.prototype._scopeToAttrName = function (scopeName) {
                var alias = this.scope[scopeName];
                if (alias) {
                    var bindMarkLen = 1, aliasLen = alias.length;
                    if (aliasLen < 2) {
                        return scopeName;
                    }
                    if (alias.charAt(1) === '?') {
                        bindMarkLen = 2;
                    }
                    if (aliasLen === bindMarkLen) {
                        return scopeName;
                    }
                    return alias.substr(bindMarkLen);
                }
                return scopeName;
            };

            WjDirective.prototype._getComplexPropDesc = function (propName) {
                return angular.MetaFactory.findComplexProp(propName, this._complexProps);
            };

            // Extends control's property map with events
            // Do not confuse with _initEvents(), which is abstract.
            WjDirective.prototype._initScopeEvents = function () {
                for (var i in this._events) {
                    var event = this._events[i];
                    this._props.push(new angular.PropDesc(event.eventName, 6 /* EventHandler */));
                }
            };

            // Creates isolated scope based on directive property map
            WjDirective.prototype._initScopeDescription = function () {
                var props = this._props, scope = {}, byRefMark = WjDirective._optionalAttr ? '=?' : '=';

                // fill result object with control properties
                if (props != null) {
                    var prop;
                    for (var i = 0; i < props.length; i++) {
                        prop = props[i];
                        scope[prop.propertyName] = prop.scopeBindingMode;

                        //1.1.1
                        if (WjDirective._optionalAttr && prop.scopeBindingMode == '=')
                            scope[prop.propertyName] = '=?';
                    }
                }

                // add property for control
                scope['control'] = byRefMark;
                scope[WjDirective._initPropAttr] = byRefMark;
                scope[WjDirective._initEventAttr] = '&';
                scope[WjDirective._parPropAttr] = '@';

                // save result
                this.scope = scope;
            };

            // Returns the directive's 'link' function.
            // This is a virtual method, can be overridden by derived classes.
            // @param beforeLinkDelegate Delegate to run before the link function
            // @param afterLinkDelegate Delegate to run after the link function
            // @return Directive's link function
            WjDirective.prototype._postLinkFn = function ( /*beforeLinkDelegate?: (scope: any, tElement: ng.IAugmentedJQuery, tAttrs: ng.IAttributes, controller: any) => void, afterLinkDelegate?: (scope: any, tElement: ng.IAugmentedJQuery, tAttrs: ng.IAttributes, control: wijmo.Control) => void*/ ) {
                var self = this;

                // Final directive link function
                var linkFunction = function (scope, tElement, tAttrs, controller) {
                    var link = self._createLink();
                    link.directive = self;
                    link.scope = scope;
                    link.tElement = tElement;
                    link.tAttrs = tAttrs;

                    if (wijmo.isArray(controller)) {
                        var parEl = tElement.parent();

                        // If working Angular version supports the isolateScope function then we use it, because in this case
                        // the scope function returns a non-isolated scope; otherwise we use scope that returns an isolated scope
                        // in this case.
                        var scopeFunc = parEl.isolateScope || parEl.scope;
                        var parScope = scopeFunc.call(parEl);
                        for (var i in controller) {
                            var curCntrl = controller[i];
                            if (curCntrl != undefined) {
                                if (curCntrl[WjDirective._cntrlScopeProp] === scope) {
                                    //require parent controller by name
                                    curCntrl = tElement.parent().controller(self._stripRequire(i));
                                }
                                if (curCntrl && curCntrl[WjDirective._cntrlScopeProp] === parScope) {
                                    link.controller = curCntrl;
                                    break;
                                }
                            }
                        }
                    } else
                        link.controller = controller;

                    //}
                    link._link();
                };
                return linkFunction;
            };

            // Gathers PropertyDesc(s) and sorts them (using stable sort) in a priority order.
            WjDirective.prototype._prepareProps = function () {
                // gather property descriptors
                this._initProps();

                // stable sort on priority
                var baseArr = [].concat(this._props);
                this._props.sort(function (a, b) {
                    var ret = a.priority - b.priority;
                    if (!ret) {
                        ret = baseArr.indexOf(a) - baseArr.indexOf(b);
                    }
                    return ret;
                });
            };

            // For the 'require' property represented by an array, returns its value at the specified index stripped of a leading specifier.
            WjDirective.prototype._stripRequire = function (index) {
                if (!this._stripReq) {
                    this._stripReq = [];
                    this._stripReq.length = this['require'].length;
                }
                if (!this._stripReq[index]) {
                    var patt = /^[^A-Za-z]*(.*)/;
                    var res = patt.exec(this['require'][index]);
                    this._stripReq[index] = res ? res[1] : '';
                }
                return this._stripReq[index];
            };

            // Determines whether the specified version is not older than the current Angular version.
            WjDirective._versionOk = function (minVer) {
                var angVer = window['angular'].version;
                var angVerParts = [angVer.major, angVer.minor, angVer.dot];
                var verParts = minVer.split(".");
                if (verParts.length !== angVerParts.length)
                    throw 'Unrecognizable version number.';
                for (var i = 0; i < verParts.length; i++) {
                    if (angVerParts[i] < verParts[i]) {
                        return false;
                    } else if (angVerParts[i] > verParts[i]) {
                        return true;
                    }
                }

                return true;
            };
            WjDirective._parPropAttr = 'wjProperty';

            WjDirective._initPropAttr = 'isInitialized';

            WjDirective._initEventAttr = 'initialized';

            WjDirective._cntrlScopeProp = '_cntrlScope';

            WjDirective._scopeChildrenProp = '_childLinks';

            WjDirective._optionalAttr = WjDirective._versionOk("1.1.4");

            WjDirective._angStripPrefixes = ['data', 'x'];
            return WjDirective;
        })();
        angular.WjDirective = WjDirective;

        var WjLink = (function () {
            function WjLink() {
                // Hash containing <property name> - true pairs for scope properties that can't be assigned.
                this._nonAssignable = {};
                // Hash containing <property name> - PropDesc pairs for all properties that have defined tag attributes.
                this._definedProps = {};
                // Hash containing <property name> - any pairs containing previous scope values for the $watch function.
                this._oldValues = {};
                this._isInitialized = false;
                this._scopeSuspend = 0;
                this._suspendedEvents = [];
                // #region 'initialized' stuff
                this._isAppliedToParent = false;
            }
            WjLink.prototype._link = function () {
                var dir = this.directive;
                this.directiveTemplateElement = dir.replace ? this.tElement : window['angular'].element(this.tElement.children()[0]);
                this._initNonAssignable();
                if (this._isChild()) {
                    //Defines initial _parentPropDesc, which can be overridden later in the _parentReady method.
                    this._parentPropDesc = new angular.ComplexPropDesc(dir._property, dir._isPropertyArray, dir._ownObject);

                    // Register this link as a child in the parent link's scope and postpone initialization
                    this.controller[WjDirective._cntrlScopeProp][WjDirective._scopeChildrenProp].push(this);
                } else {
                    this._createInstance();
                    this._notifyReady();
                    this._prepareControl();
                }
            };

            // This method can be overridden to implement custom application of child directives. Child directives are already
            // initialized at this moment.
            WjLink.prototype._onChildrenReady = function () {
            };

            WjLink.prototype._createInstance = function () {
                this.control = this._initControl();
                this._safeApply(this.scope, 'control', this.control);
            };

            // This method is called by the parent link for the child link to notify that parent link's control is created.
            WjLink.prototype._parentReady = function (parentLink) {
                if (!this._isChild())
                    return;
                var self = this;

                // In case where parent property name is defined via attribute by a user, in early Angular versions (e.g. 1.1.1)
                // the scope is not initialized with attribute values defined on directive tag. To manage this we watch this attribute
                // and init the link when its value appears.
                //if (!(this.directive._property || this.scope[WjDirective._parPropAttr])) {
                if (this._isAttrDefined(WjDirective._parPropAttr) && !this.scope[WjDirective._parPropAttr]) {
                    this.scope.$watch(WjDirective._parPropAttr, function () {
                        self._parentReady(parentLink);
                    });
                    return;
                }
                var parProp = this._getParentProp();

                //Override _parentPropDesc if it's defined for the servicing property in the parent link's directive.
                var parPropDescOverride = parentLink.directive._getComplexPropDesc(parProp);
                if (parPropDescOverride) {
                    this._parentPropDesc = parPropDescOverride;
                } else {
                    this._parentPropDesc.propertyName = parProp;
                }
                this.parent = parentLink;
                if (this._useParentObj()) {
                    this.control = parentLink.control[parProp];
                    this._safeApply(this.scope, 'control', this.control);
                } else {
                    this._createInstance();
                }
                this._notifyReady();
                this._prepareControl();
                this._initParent();
                this.directiveTemplateElement[0].style.display = 'none';
                this._appliedToParent();
            };

            // Assigns/adds this directive's object to the parent object.
            WjLink.prototype._initParent = function () {
                if (this._useParentObj())
                    return;
                var dir = this.directive, propName = this._getParentProp(), parCtrl = this.parent.control;
                if (this._isParentArray()) {
                    parCtrl[propName].push(this.control);
                } else {
                    parCtrl[propName] = this.control;
                }
            };

            // Notify child links after this directive was attached to its control.
            WjLink.prototype._notifyReady = function () {
                // Notify child links
                var childLinks = this.scope[WjDirective._scopeChildrenProp];
                for (var i = 0; i < childLinks.length; i++) {
                    childLinks[i]._parentReady(this);
                }

                // Clear children list to free references for GC.
                //childLinks.length = 0; //cleared one by one by the _childInitialized method
                this._onChildrenReady();
            };

            // Initializes control owned by the directive
            WjLink.prototype._initControl = function () {
                try  {
                    var controlConstructor = this.directive._controlConstructor;
                    var control = new controlConstructor(this.directiveTemplateElement[0]);
                    return control;
                } catch (e) {
                    // Do nothing. Return 'undefined' explicitly
                    return undefined;
                }
            };

            // Defines scope's default values, registers properties watchers and event handlers
            WjLink.prototype._prepareControl = function () {
                this._addEventHandlers();
                this._addWatchers();
            };

            // Sets control's default values to scope properties
            WjLink.prototype._setupScopeWithControlProperties = function () {
                var prop, name, scopeValue, controlValue, control = this.control, scope = this.scope, props = this.directive._props;

                for (var i = 0; i < props.length; i++) {
                    prop = props[i];
                    if (prop.scopeBindingMode === '=' && prop.isNativeControlProperty) {
                        name = prop.propertyName;
                        scopeValue = scope[name];
                        controlValue = control[name];

                        var isFunction = prop.propertyType == 5 /* Function */;
                        var isEventHandler = prop.propertyType == 6 /* EventHandler */;

                        if (this._canApply(scope, prop.propertyName) && controlValue != scopeValue && !isFunction && !isEventHandler) {
                            scope[prop.propertyName] = controlValue;
                        }
                    }
                }

                if (!scope['$root'].$$phase) {
                    scope.$apply();
                }
            };

            WjLink.prototype._initNonAssignable = function () {
                var parse = this.directive._$parse, scopeDef = this.directive.scope, binding;
                for (var name in scopeDef) {
                    if (scopeDef[name].charAt(0) === '=') {
                        binding = this.tAttrs[this.directive._scopeToAttrName(name)];
                        if (binding === undefined || parse(binding).assign == undefined) {
                            this._nonAssignable[name] = true;
                        }
                    }
                }
            };

            WjLink.prototype._suspendScope = function () {
                this._scopeSuspend++;
            };

            WjLink.prototype._resumeScope = function () {
                if (this._scopeSuspend > 0) {
                    if (--this._scopeSuspend === 0 && this._suspendedEvents.length > 0) {
                        this._updateScope();
                    }
                }
            };

            WjLink.prototype._isScopeSuspended = function () {
                return this._scopeSuspend > 0;
            };

            WjLink.prototype._isAttrDefined = function (name) {
                return this.tAttrs.hasOwnProperty(this.directive._scopeToAttrName(name));
            };

            // Called by child link when its fully initialized
            WjLink.prototype._childInitialized = function (child) {
                var childLinks = this.scope[WjDirective._scopeChildrenProp], idx = childLinks.indexOf(child);
                if (idx >= 0) {
                    childLinks.splice(idx, 1);
                    this._checkRaiseInitialized();
                }
            };

            // Called after first watch on this links has worked out.
            WjLink.prototype._initialized = function () {
                this._checkRaiseInitialized();
            };

            // For the child link, called after this link has applied (added to array, assigned) its object to the parent.
            WjLink.prototype._appliedToParent = function () {
                this._isAppliedToParent = true;
                this._checkRaiseInitialized();
            };

            WjLink.prototype._checkRaiseInitialized = function () {
                if (this.scope[WjDirective._scopeChildrenProp].length === 0 && this._isInitialized && (!this._isChild() || this._isAppliedToParent)) {
                    // set the scope isInitialized property to true
                    this._safeApply(this.scope, WjDirective._initPropAttr, true);

                    // raise the initialized event
                    var handler = this.scope[WjDirective._initEventAttr], self = this;
                    if (handler) {
                        // delay the event to allow the 'isInitialized' property value be propagated to a controlles scope before
                        // the event is raised
                        setTimeout(function () {
                            handler({ s: self.control, e: undefined });
                        }, 0);
                    }

                    //notify parent
                    if (this._isChild() && this.parent) {
                        this.parent._childInitialized(this);
                    }
                }
            };

            //#endregion 'initialized' stuff
            // Adds watchers for scope properties to update control values
            WjLink.prototype._addWatchers = function () {
                var props = this.directive._props;
                if (!props) {
                    return;
                }
                var i, name, prop;
                for (i = 0; i < props.length; i++) {
                    prop = props[i];
                    name = prop.propertyName;
                    if (prop.propertyType !== 6 /* EventHandler */ && this._isAttrDefined(name)) {
                        this._definedProps[name] = prop;
                    }
                }
                var self = this, control = this.control, scope = this.scope;
                scope.$watch(function (scope) {
                    try  {
                        var assignValues = {};
                        for (var name in self._definedProps) {
                            if (scope[name] !== self._oldValues[name]) {
                                assignValues[name] = scope[name];
                            }
                        }

                        for (var i in props) {
                            var prop = props[i];
                            name = prop.propertyName;
                            if (assignValues.hasOwnProperty(name) && assignValues[name] !== self._oldValues[name]) {
                                self._oldValues[name] = assignValues[name];
                                if (typeof (assignValues[name]) !== 'undefined' || self._isInitialized) {
                                    // get value from scope
                                    var value = self._nullOrValue(self._castValueToType(assignValues[name], prop));

                                    // check that the control value is out-of-date
                                    if (control[name] != value) {
                                        var oldVal = control[name];

                                        // apply value to control if it's a native property
                                        // (as opposed to directive-only property)
                                        if (prop.isNativeControlProperty) {
                                            control[name] = value;
                                        }

                                        // invoke custom handler (if any) to handle the change
                                        if (prop.customHandler != null) {
                                            prop.customHandler(scope, control, value, oldVal, self);
                                        }
                                    }
                                }
                            }
                        }
                    } finally {
                        if (!self._isInitialized) {
                            self._isInitialized = true;
                            self._setupScopeWithControlProperties();
                            self._initialized();
                        }
                    }
                });
            };

            // Adds handlers for control events
            WjLink.prototype._addEventHandlers = function () {
                var i, event, evList = this.directive._events;
                for (i = 0; i < evList.length; i++) {
                    event = evList[i];
                    this._addEventHandler(event); // avoiding 'i' closure
                }
            };
            WjLink.prototype._addEventHandler = function (eventDesc) {
                var self = this, controlEvent = this.control[eventDesc.eventName];

                // check that the event name is valid
                if (controlEvent == null) {
                    throw 'Event "' + eventDesc.eventName + '" not found in ' + self.constructor.name;
                }

                var scope = this.scope, props = this.directive._props, control = this.control;

                // add the event handler
                controlEvent.addHandler(function (s, e) {
                    var eventInfo = { eventDesc: eventDesc, s: s, e: e };
                    if (self._isScopeSuspended()) {
                        self._suspendedEvents.push(eventInfo);
                    } else {
                        self._updateScope(eventInfo);
                    }
                }, control);
            };

            // Updates scope values with control values for two-way bindings.
            WjLink.prototype._updateScope = function (eventInfo) {
                if (typeof eventInfo === "undefined") { eventInfo = null; }
                // apply changes to scope
                var update = eventInfo ? eventInfo.eventDesc.isPropChanged : this._suspendedEvents.some(function (value) {
                    return value.eventDesc.isPropChanged;
                });
                var hasChanges = false;
                if (update) {
                    var props = this.directive._props;
                    for (var i = 0; i < props.length; i++) {
                        var p = props[i];
                        if (p.scopeBindingMode == '=' && p.isNativeControlProperty) {
                            var name = p.propertyName, value = this.control[name];
                            if (this._shouldApply(this.scope, name, value)) {
                                this.scope[name] = value;

                                //
                                this.directive._$parse(this.tAttrs[this.directive._scopeToAttrName(name)]).assign(this.scope.$parent, value);

                                //
                                hasChanges = true;
                            }
                        }
                    }
                }

                var raiseEvents = function () {
                    var suspEvArr = eventInfo ? [eventInfo] : this._suspendedEvents;

                    for (var i = 0; i < suspEvArr.length; i++) {
                        var suspInfo = suspEvArr[i], scopeHandler = this.scope[suspInfo.eventDesc.eventName];
                        if (scopeHandler) {
                            scopeHandler({ s: suspInfo.s, e: suspInfo.e });
                        }
                    }
                    if (!eventInfo) {
                        this._suspendedEvents.length = 0;
                    }
                }.bind(this);

                if (!this.scope['$root'].$$phase) {
                    this.scope.$apply();
                    //raiseEvents();
                } else if (hasChanges) {
                    // We may be in a call to directive's scope $watch finalizing the digest, so there is a chance that
                    // there will be no more digests and changes made here to directive scope will not propagate to controller
                    // scope. To manage with this we initiate one more digest cycle by adding a dummy watch to the scope.
                    // We don't use setTimeout($apply(), 0) for this purpose to guarantee that all changes will be applied
                    // in this digest where we are now.
                    var dispose = this.scope.$watch('value', function () {
                        // dispose the watch right away
                        dispose();
                        //raiseEvents();
                    });
                }
                raiseEvents();
            };

            // Casts value to the property type
            WjLink.prototype._castValueToType = function (value, prop) {
                if (value == undefined) {
                    //return undefined;
                    return value;
                }

                var type = prop.propertyType;
                switch (type) {
                    case 1 /* Number */:
                        if (typeof value == 'string') {
                            if (value.indexOf('*') >= 0) {
                                return value;
                            }
                            if (value.trim() === '') {
                                return null;
                            }
                        }
                        return +value;
                    case 0 /* Boolean */:
                        if (value === 'true') {
                            return true;
                        }
                        if (value === 'false') {
                            return false;
                        }
                        return !!value;
                    case 3 /* String */:
                        return value + '';
                    case 2 /* Date */:
                        return this._parseDate(value);
                    case 4 /* Enum */:
                        if (typeof value === 'number') {
                            return value;
                        }
                        return prop.enumType[value];
                    default:
                        return value;
                }
            };

            // Parsing DateTime values from string
            WjLink.prototype._parseDate = function (value) {
                if (value && wijmo.isString(value)) {
                    // For by-val attributes Angular converts a Date object to a
                    // string wrapped in quotation marks, so we strip them.
                    value = value.replace(/["']/g, '');

                    // parse date/time using RFC 3339 pattern
                    var dt = wijmo.changeType(value, 4 /* Date */, 'r');
                    if (wijmo.isDate(dt)) {
                        return dt;
                    }
                }
                return value;
            };

            //Determines whether this is a child link.
            //NOTE: functionality is *not* based on _parentPropDesc
            WjLink.prototype._isChild = function () {
                return this.directive._isChild();
            };

            //For the child directives returns parent's property name that it services. Property name defined via
            //the wjProperty attribute of directive tag has priority over the directive._property definition.
            //NOTE: functionality is *not* based on _parentPropDesc
            WjLink.prototype._getParentProp = function () {
                return this._isChild() ? this.scope[WjDirective._parPropAttr] || this.directive._property : undefined;
            };

            // Determines whether the child link uses an object created by the parent property, instead of creating it by
            // itself, and thus object's initialization should be delayed until parent link's control is created.
            //IMPORTANT: functionality is *based* on _parentPropDesc
            WjLink.prototype._useParentObj = function () {
                return this._isChild() && !this._parentPropDesc.isArray && !this._parentPropDesc.ownsObject;
            };

            // For the child link, determines whether the servicing parent property is an array.
            //IMPORTANT: functionality is *based* on _parentPropDesc
            WjLink.prototype._isParentArray = function () {
                return this._parentPropDesc.isArray;
            };

            // apply value to scope and notify
            WjLink.prototype._safeApply = function (scope, name, value) {
                // check that value and scope are defined, and that value changed
                if (this._shouldApply(scope, name, value)) {
                    // apply new value to scope and notify
                    scope[name] = value;
                    if (!scope.$root.$$phase) {
                        scope.$apply();
                    }
                }
            };

            // Detrmines whether value should be assigned to scope[name], depending on optional attribute support in current Angular version.
            WjLink.prototype._shouldApply = function (scope, name, value) {
                return this._canApply(scope, name) && value != scope[name];
            };

            // Detrmines whether scope[name] can be safely updated without getting an exception.
            WjLink.prototype._canApply = function (scope, name) {
                return !this._nonAssignable[name];
            };

            // Returns null for undefined or null value; otherwise, the original value.
            WjLink.prototype._nullOrValue = function (value) {
                return value != undefined ? value : null;
            };
            return WjLink;
        })();
        angular.WjLink = WjLink;
    })(wijmo.angular || (wijmo.angular = {}));
    var angular = wijmo.angular;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.directiveBase.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    //
    // AngularJS directives for wijmo module
    //
    (function (angular) {
        //#region "Container directives registration"
        var wijmoContainers = window['angular'].module('wj.container', []);

        wijmoContainers.directive('wjTooltip', [function () {
                return new WjTooltip();
            }]);

        //#endregion "Container directives definitions"
        //#region "Container directives classes"
        /**
        * AngularJS directive for the @see:Tooltip class.
        *
        * Use the <b>wj-tooltip</b> directive to add tooltips to elements on the page.
        * The wj-tooltip directive supports HTML content, smart positioning, and touch.
        *
        * The wj-tooltip directive is specified as a parameter added to the
        * element that the tooltip applies to. The parameter value is the tooltip
        * text or the id of an element that contains the text. For example:
        *
        * <pre>&lt;p wj-tooltip="#fineprint" &gt;
        *     Regular paragraph content...&lt;/p&gt;
        * ...
        * &lt;div id="fineprint" style="display:none"&gt;
        *   &lt;h3&gt;Important Note&lt;/h3&gt;
        *   &lt;p&gt;
        *     Data for the current quarter is estimated
        *     by pro-rating etc.&lt;/p&gt;
        * &lt;/div&gt;</pre>
        */
        var WjTooltip = (function (_super) {
            __extends(WjTooltip, _super);
            // Initializes a new instance of WjTooltip
            function WjTooltip() {
                _super.call(this);
                this.restrict = 'A';
                this.template = '';
            }
            Object.defineProperty(WjTooltip.prototype, "_controlConstructor", {
                // Returns Wijmo Tooltip control constructor
                get: function () {
                    return wijmo.Tooltip;
                },
                enumerable: true,
                configurable: true
            });

            WjTooltip.prototype._createLink = function () {
                return new WjTooltipLink();
            };
            return WjTooltip;
        })(angular.WjDirective);

        var WjTooltipLink = (function (_super) {
            __extends(WjTooltipLink, _super);
            function WjTooltipLink() {
                _super.apply(this, arguments);
            }
            //override
            WjTooltipLink.prototype._link = function () {
                _super.prototype._link.call(this);

                var tt = this.control;
                tt.setTooltip(this.tElement[0], this.tAttrs['wjTooltip']);
            };
            return WjTooltipLink;
        })(angular.WjLink);
    })(wijmo.angular || (wijmo.angular = {}));
    var angular = wijmo.angular;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.core.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    //
    // AngularJS directives for wijmo.input module
    //
    (function (angular) {
        //#region "Input directives registration"
        var wijmoInput = window['angular'].module('wj.input', []);

        wijmoInput.directive('wjAutoComplete', [function () {
                return new WjAutoComplete();
            }]);

        wijmoInput.directive('wjCalendar', [function () {
                return new WjCalendar();
            }]);

        wijmoInput.directive('wjColorPicker', [function () {
                return new WjColorPicker();
            }]);

        wijmoInput.directive('wjComboBox', [function () {
                return new WjComboBox();
            }]);

        wijmoInput.directive('wjInputDate', [function () {
                return new WjInputDate();
            }]);

        wijmoInput.directive('wjInputNumber', [function () {
                return new WjInputNumber();
            }]);

        wijmoInput.directive('wjInputMask', [function () {
                return new WjInputMask();
            }]);

        wijmoInput.directive('wjInputTime', [function () {
                return new WjInputTime();
            }]);

        wijmoInput.directive('wjInputColor', [function () {
                return new WjInputColor();
            }]);

        wijmoInput.directive('wjListBox', [function () {
                return new WjListBox();
            }]);

        wijmoInput.directive('wjMenu', [function () {
                return new WjMenu();
            }]);

        wijmoInput.directive('wjMenuItem', [function () {
                return new WjMenuItem();
            }]);

        wijmoInput.directive('wjMenuSeparator', [function () {
                return new WjMenuSeparator();
            }]);

        wijmoInput.directive('wjCollectionViewNavigator', [function () {
                return new WjCollectionViewNavigator();
            }]);

        wijmoInput.directive('wjCollectionViewPager', [function () {
                return new WjCollectionViewPager();
            }]);

        //#endregion "Input directives definitions"
        //#region "Input directives classes"
        // DropDown control directive
        // Provides base setup for all directives related to controls derived from DropDown
        // Abstract class, not for use in markup
        var WjDropDown = (function (_super) {
            __extends(WjDropDown, _super);
            function WjDropDown() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjDropDown.prototype, "_controlConstructor", {
                get: function () {
                    return wijmo.input.DropDown;
                },
                enumerable: true,
                configurable: true
            });
            return WjDropDown;
        })(angular.WjDirective);

        /**
        * AngularJS directive for the @see:ComboBox control.
        *
        * Use the <b>wj-combo-box</b> directive to add <b>ComboBox</b> controls to your AngularJS applications.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>&lt;p&gt;Here is a ComboBox control:&lt;/p&gt;
        * &lt;wj-combo-box
        *   text="theCountry"
        *   items-source="countries"
        *   is-editable="false"
        *   placeholder="country"&gt;
        * &lt;/wj-combo-box&gt;</pre>
        *
        * The example below creates a <b>ComboBox</b> control and binds it to a 'countries' array
        * exposed by the controller. The <b>ComboBox</b> searches for the country as the user
        * types. The <b>isEditable</b> property is set to false, so the user is forced to
        * select one of the items in the list.
        *
        * @fiddle:37GHw
        *
        * The <b>wj-combo-box</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>control</dt>              <dd><code>=</code> A reference to the @see:ComboBox
        *                                 control created by this directive.</dd>
        *   <dt>display-member-path</dt>    <dd><code>@</code> The name of the property to use as
        *                                 the visual representation of the items.</dd>
        *   <dt>is-content-html</dt>        <dd><code>@</code> A value indicating whether the drop-down
        *                                 list displays the items as plain text or as HTML.</dd>
        *   <dt>is-dropped-down</dt>        <dd><code>@</code> A value indicating whether the drop down
        *                                 list is currently visible.</dd>
        *   <dt>is-editable</dt>           <dd><code>@</code> A value indicating whether the user can
        *                                 enter values not present on the list.</dd>
        *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
        *                                 initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
        *                                 initializing the control with attribute values. </dd>
        *   <dt>item-formatter</dt>        <dd><code>=</code> A function used to customize the values
        *                                 shown in the drop-down list.</dd>
        *   <dt>items-source</dt>          <dd><code>=</code> An array or @see:ICollectionView that
        *                                 contains items to show in the list.</dd>
        *   <dt>max-drop-down-height</dt>    <dd><code>@</code> The maximum height of the drop-down
        *                                 list.</dd>
        *   <dt>max-drop-down-width</dt>     <dd><code>@</code> The maximum width of the drop-down
        *                                 list.</dd>
        *   <dt>placeholder</dt>          <dd><code>@</code> A string shown as a hint when the
        *                                 control is empty.</dd>
        *   <dt>required</dt>             <dd><code>@</code> A value indicating whether to prevent
        *                                 null values.</dd>
        *   <dt>show-drop-down-button</dt>   <dd><code>@</code> A value indicating whether the control
        *                                 displays a drop-down button.</dd>
        *   <dt>selected-index</dt>        <dd><code>=</code> The index of the currently selected
        *                                 item in the drop-down list.</dd>
        *   <dt>selected-item</dt>         <dd><code>=</code> The currently selected item in the
        *                                 drop-down list.</dd>
        *   <dt>selected-value</dt>        <dd><code>=</code> The value of the selected item, obtained
        *                                 using the <b>selected-value-[ath</b>.</dd>
        *   <dt>selected-value-path</dt>    <dd><code>@</code> The name of the property used to get the
        *                                 <b>selected-value</b> from the <b>selected-item</b>.</dd>
        *   <dt>text</dt>                 <dd><code>=</code> The text to show in the control.</dd>
        *   <dt>is-dropped-down-changed</dt> <dd><code>&</code> The @see:isDroppedDownChanged event
        *                                 handler.</dd>
        *   <dt>selected-index-changed</dt> <dd><code>&</code> The @see:selectedIndexChanged event
        *                                 handler.</dd>
        *   <dt>text-changed</dt>          <dd><code>&</code> The @see:textChanged event handler.</dd>
        * </dl>
        */
        var WjComboBox = (function (_super) {
            __extends(WjComboBox, _super);
            function WjComboBox() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjComboBox.prototype, "_controlConstructor", {
                // Gets the Combobox control constructor
                get: function () {
                    return wijmo.input.ComboBox;
                },
                enumerable: true,
                configurable: true
            });
            return WjComboBox;
        })(WjDropDown);

        /**
        * AngularJS directive for the @see:AutoComplete control.
        *
        * Use the <b>wj-auto-complete</b> directive to add <b>AutoComplete</b> controls to your
        * AngularJS applications. Note that directive and parameter names must be
        * formatted as lower-case with dashes instead of camel-case. For example:
        *
        * <pre>&lt;p&gt;Here is an AutoComplete control:&lt;/p&gt;
        * &lt;wj-auto-complete
        *   text="theCountry"
        *   items-source="countries"
        *   is-editable="false"
        *   placeholder="country"&gt;
        * &lt;/wj-auto-complete&gt;</pre>
        *
        * The example below creates an <b>AutoComplete</b> control and binds it to a 'countries' array
        * exposed by the controller. The <b>AutoComplete</b> searches for the country as the user
        * types, and narrows down the list of countries that match the current input.
        *
        * @fiddle:37GHw
        *
        * The <b>wj-auto-complete</b> directive extends @see:WjComboBox with the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>css-match</dt>            <dd><code>@</code> The name of the css class used to highlight
        *                                 parts of the content that match the search terms.</dd>
        *   <dt>delay</dt>                <dd><code>@</code> The amount of delay in milliseconds between
        *                                 when a keystroke occurs and when the search is performed.</dd>
        *   <dt>items-source-function</dt><dd><code>=</code> A function that provides the items
        *                                 dynamically as the user types.</dd>
        *   <dt>max-items</dt>            <dd><code>@</code> The maximum number of items to display
        *                                 in the dropdown.</dd>
        *   <dt>min-length</dt>           <dd><code>@</code> The minimum input length to require before
        *                                 triggering autocomplete suggestions.</dd>
        * </dl>
        */
        var WjAutoComplete = (function (_super) {
            __extends(WjAutoComplete, _super);
            function WjAutoComplete() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjAutoComplete.prototype, "_controlConstructor", {
                // Gets AutoComplete control constructor
                get: function () {
                    return wijmo.input.AutoComplete;
                },
                enumerable: true,
                configurable: true
            });
            return WjAutoComplete;
        })(WjComboBox);

        /**
        * AngularJS directive for the @see:Calendar control.
        *
        * Use the <b>wj-calendar</b> directive to add <b>Calendar</b> controls to your
        * AngularJS applications.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>&lt;p&gt;Here is a Calendar control:&lt;/p&gt;
        * &lt;wj-calendar
        *   value="theDate"&gt;
        * &lt;/wj-calendar&gt;</pre>
        *
        * @fiddle:46PhD
        *
        * This example creates a <b>Calendar</b> control and binds it to a 'date' variable
        * exposed by the controller. The range of dates that may be selected is limited
        * by the <b>min</b> and <b>max</b> properties.
        *
        * The <b>wj-calendar</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>control</dt>        <dd><code>=</code> A reference to the @see:Calendar control
        *                           created by this directive.</dd>
        *   <dt>display-month</dt>  <dd><code>=</code> The month being displayed in the calendar.</dd>
        *   <dt>first-day-of-week</dt> <dd><code>@</code> The first day of the week.</dd>
        *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
        *                                 initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
        *                                 initializing the control with attribute values. </dd>
        *   <dt>item-formatter</dt> <dd><code>=</code> The function used to customize the dates
        *                           shown in the calendar.</dd>
        *   <dt>max</dt>            <dd><code>@</code> The latest valid date (string in the
        *                           format "yyyy-MM-dd").</dd>
        *   <dt>min</dt>            <dd><code>@</code> The earliest valid date (string in the
        *                           format "yyyy-MM-dd").</dd>
        *   <dt>month-view</dt>     <dd><code>@</code> A value indicating whether the control displays
        *                           a month or the entire year.</dd>
        *   <dt>show-header</dt>    <dd><code>@</code> A value indicating whether the control displays
        *                           the header area.</dd>
        *   <dt>value</dt>          <dd><code>=</code> The date being edited.</dd>
        *   <dt>value-changed</dt>  <dd><code>&</code> The @see:valueChanged event handler.</dd>
        * </dl>
        *
        * If provided, the <b>min</b> and <b>max</b> attributes are strings in the format
        * "yyyy-MM-dd." Technically, you can use any full date as defined in the W3C
        * <a href="http://tools.ietf.org/html/rfc3339" target="_blank">[RFC 3339]</a>,
        * which is also the format used with regular HTML5 input elements.
        */
        var WjCalendar = (function (_super) {
            __extends(WjCalendar, _super);
            function WjCalendar() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjCalendar.prototype, "_controlConstructor", {
                // Gets the Calendar control constructor
                get: function () {
                    return wijmo.input.Calendar;
                },
                enumerable: true,
                configurable: true
            });
            return WjCalendar;
        })(angular.WjDirective);

        /**
        * AngularJS directive for the @see:ColorPicker control.
        *
        * Use the <b>wj-color-picker</b> directive to add <b>ColorPicker</b> controls to your
        * AngularJS applications. Note that directive and parameter names must be
        * formatted as lower-case with dashes instead of camel-case. For example:
        *
        * <pre>&lt;p&gt;Here is a ColorPicker control:&lt;/p&gt;
        * &lt;wj-color-picker
        *   value="theColor"
        *   show-alpha-channel="false"&gt;
        * &lt;/wj-color-picker&gt;</pre>
        *
        * The <b>wj-color-picker</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>control</dt>           <dd><code>=</code> A reference to the @see:ColorPicker
        *                              control created by this directive.</dd>
        *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
        *                                 initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
        *                                 initializing the control with attribute values. </dd>
        *   <dt>show-alpha-channel</dt><dd><code>@</code> A value indicating whether the control
        *                              displays the alpha channel (transparency) editor.</dd>
        *   <dt>show-color-string</dt> <dd><code>@</code> A value indicating whether the control
        *                              displays a string representation of the color being edited.</dd>
        *   <dt>palette</dt>           <dd><code>=</code> An array with ten color values to use
        *                              as the palette.</dd>
        *   <dt>value</dt>             <dd><code>=</code> The color being edited.</dd>
        *   <dt>value-changed</dt>     <dd><code>&</code> The @see:valueChanged event handler.</dd>
        * </dl>
        */
        var WjColorPicker = (function (_super) {
            __extends(WjColorPicker, _super);
            function WjColorPicker() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjColorPicker.prototype, "_controlConstructor", {
                // Gets the ColorPicker control constructor
                get: function () {
                    return wijmo.input.ColorPicker;
                },
                enumerable: true,
                configurable: true
            });
            return WjColorPicker;
        })(angular.WjDirective);

        /**
        * AngularJS directive for the @see:ListBox control.
        *
        * Use the <b>wj-list-box</b> directive to add @see:ListBox controls to your
        * AngularJS applications.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>b&gt;Here is a ListBox control:&lt;/p&gt;
        * &lt;wj-list-box
        *   selected-item="theCountry"
        *   items-source="countries"
        *   placeholder="country"&gt;
        * &lt;/wj-list-box&gt;</pre>
        *
        * The example below creates a <b>ListBox</b> control and binds it to a 'countries' array
        * exposed by the controller. The value selected is bound to the 'theCountry'
        * controller property using the <b>selected-item</b> attribute.
        *
        * @fiddle:37GHw
        *
        * The <b>wj-list-box</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>control</dt>              <dd><code>=</code> A reference to the @see:ListBox
        *                                 control created by this directive.</dd>
        *   <dt>display-member-path</dt>  <dd><code>@</code> The property to use as the visual
        *                                 representation of the items.</dd>
        *   <dt>is-content-html</dt>      <dd><code>@</code> A value indicating whether items
        *                                 contain plain text or HTML.</dd>
        *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
        *                                 initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
        *                                 initializing the control with attribute values. </dd>
        *   <dt>item-formatter</dt>       <dd><code>=</code> A function used to customize the
        *                                 values to show in the list.</dd>
        *   <dt>items-source</dt>         <dd><code>=</code> An array or @see:ICollectionView
        *                                 that contains the list items.</dd>
        *   <dt>max-height</dt>           <dd><code>@</code> The maximum height of the list.</dd>
        *   <dt>selected-index</dt>       <dd><code>=</code> The index of the currently selected
        *                                 item.</dd>
        *   <dt>selected-item</dt>        <dd><code>=</code> The item that is currently selected.</dd>
        *   <dt>selected-value</dt>       <dd><code>=</code> The value of the <b>selected-item</b>
        *                                 obtained using the <b>selected-value-path</b>.</dd>
        *   <dt>selected-value-path</dt>  <dd><code>@</code> The property used to get the
        *                                 <b>selected-value</b> from the <b>selected-item</b>.</dd>
        *   <dt>items-changed</dt>        <dd><code>&</code> The @see:itemsChanged event handler.</dd>
        *   <dt>selected-index-changed</dt> <dd><code>&</code> The s@see:electedIndexChanged event handler.</dd>
        * </dl>
        */
        var WjListBox = (function (_super) {
            __extends(WjListBox, _super);
            function WjListBox() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjListBox.prototype, "_controlConstructor", {
                // Gets the ListBox control constructor
                get: function () {
                    return wijmo.input.ListBox;
                },
                enumerable: true,
                configurable: true
            });
            return WjListBox;
        })(angular.WjDirective);

        /**
        * AngularJS directive for the @see:Menu control.
        *
        * Use the <b>wj-menu</b> directive to add drop-down menus to your AngularJS applications.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>&lt;p&gt;Here is a Menu control used as a value picker:&lt;/p&gt;
        * &lt;wj-menu header="Tax" value="tax"&gt;
        *   &lt;wj-menu-item value="0"&gt;Exempt&lt;/wj-menu-item&gt;
        *   &lt;wj-menu-item value=".05"&gt;5%&lt;/wj-menu-item&gt;
        *   &lt;wj-menu-item value=".1"&gt;10%&lt;/wj-menu-item&gt;
        *   &lt;wj-menu-item value=".15"&gt;15%&lt;/wj-menu-item&gt;
        * &lt;/wj-menu&gt;</pre>
        *
        * @fiddle:Wc5Mq
        *
        * This example creates three <b>Menu</b> controls. The first is used as a value picker,
        * the second uses a list of commands with parameters, and the third is a group of
        * three menus handled by an <b>itemClicked</b> function in the controller.
        *
        * The <b>wj-menu</b> directive extends @see:WjComboBox with the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>command-path</dt>          <dd><code>@</code> A property that contains the command
        *                                  to be executed when the item is clicked.</dd>
        *   <dt>command-parameter-path</dt><dd><code>@</code> A property that contains a parameter
        *                                  to be used with the command.</dd>
        *   <dt>header</dt>                <dd><code>@</code> The text shown on the control.</dd>
        *   <dt>value</dt>                 <dd><code>@</code> The value of the selected <b>wj-menu-item</b>
        *                                  value property. </dd>
        *   <dt>item-clicked</dt>          <dd><code>&</code> The @see:itemClicked event handler.</dd>
        * </dl>
        *
        * The <b>wj-menu</b> directive may contain the following child directives:
        * @see:WjMenuItem and @see:WjMenuSeparator.
        */
        var WjMenu = (function (_super) {
            __extends(WjMenu, _super);
            // Initializes a new instance of a WjMenu
            function WjMenu() {
                _super.call(this);

                this.template = '<div ng-transclude />';
                this.transclude = true;
            }
            Object.defineProperty(WjMenu.prototype, "_controlConstructor", {
                // Gets the Menu control constructor
                get: function () {
                    return wijmo.input.Menu;
                },
                enumerable: true,
                configurable: true
            });

            WjMenu.prototype._createLink = function () {
                return new WjMenuLink();
            };

            // WjMenu property map
            WjMenu.prototype._initProps = function () {
                _super.prototype._initProps.call(this);
                var self = this;
                var valueDesc = angular.MetaFactory.findProp('value', this._props);
                valueDesc.customHandler = function (scope, control, value, oldValue, link) {
                    self.updateControlValue(scope, control, link);
                };
            };

            WjMenu.prototype._controllerImpl = function (controller, scope) {
                // stores collection of menu items defined as nested tags
                var items = scope.items = [];

                // adds menu items defined as nested tags into scope collection
                controller.addItem = function (scope, element) {
                    items.push({ scope: scope, header: element[0].innerHTML });
                };
            };

            WjMenu.prototype.updateControlValue = function (scope, control, link) {
                if (scope.value != null) {
                    control.selectedValue = scope.value;
                    link.directive.updateHeader(scope, control, link);
                }
            };

            // update header to show the currently selected value
            WjMenu.prototype.updateHeader = function (scope, control, link) {
                control.header = scope.header;
                if (typeof (scope.value) != 'undefined' && control.selectedItem && control.displayMemberPath) {
                    var currentValue = control.selectedItem[control.displayMemberPath];
                    if (currentValue != null) {
                        control.header += ': <b>' + currentValue + '</b>';
                    }
                }
            };
            return WjMenu;
        })(WjComboBox);

        var WjMenuLink = (function (_super) {
            __extends(WjMenuLink, _super);
            function WjMenuLink() {
                _super.apply(this, arguments);
            }
            //override
            WjMenuLink.prototype._link = function () {
                _super.prototype._link.call(this);

                var self = this, control = this.control, scope = this.scope, directive = this.directive;

                // populate menu
                if (scope.items.length) {
                    var itemsource = [];
                    for (var i = 0; i < scope.items.length; i++) {
                        var itemScope = scope.items[i].scope;
                        itemsource.push({
                            header: itemScope.header ? itemScope.header : scope.items[i].header,
                            cmd: itemScope.cmd,
                            cmdParam: itemScope.cmdParam,
                            value: itemScope.value
                        });
                    }
                    control.displayMemberPath = 'header';
                    control.commandPath = 'cmd';
                    control.commandParameterPath = 'cmdParam';
                    control.selectedValuePath = 'value';
                    control.itemsSource = itemsource;
                    control.selectedIndex = 0;
                }

                // update 'value' and header when an item is clicked
                control.itemClicked.addHandler(function () {
                    self._safeApply(scope, 'value', control.selectedValue);
                    directive.updateHeader(scope, control, self);
                });

                // and update the header now
                directive.updateHeader(scope, control, self);
            };
            return WjMenuLink;
        })(angular.WjLink);
        angular.WjMenuLink = WjMenuLink;

        /**
        * AngularJS directive for menu items.
        *
        * The <b>wj-menu-item</b> directive must be contained in a @see:WjMenu directive.
        * It supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>cmd</dt>       <dd><code>=</code> The function to execute in the controller
        *                      when the item is clicked.</dd>
        *   <dt>cmd-param</dt>  <dd><code>=</code> The parameter passed to the <b>cmd</b> function
        *                      when the item is clicked.</dd>
        *   <dt>value</dt>     <dd><code>=</code> The value to select when the item is clicked
        *                      (use either this or <b>cmd</b>).</dd>
        * </dl class="dl-horizontal">
        *
        * The content displayed by the item is defined by the HTML contained in <b>wj-menu-item</b> directive.
        */
        var WjMenuItem = (function (_super) {
            __extends(WjMenuItem, _super);
            // Initializes a new instance of a WjMenuItem
            function WjMenuItem() {
                _super.call(this);

                this.template = '<span ng-transclude/>';
                this.require = '^wjMenu';
                this.transclude = true;
                this.replace = true;
            }
            WjMenuItem.prototype._getMetaDataId = function () {
                return 'MenuItem';
            };

            // Gets the WjMenuItem directive's link function. Overrides parent method
            WjMenuItem.prototype._postLinkFn = function () {
                var self = this;
                return function (scope, tElement, tAttrs, menu) {
                    menu.addItem(scope, tElement);
                    tElement[0].style.display = 'none';
                };
            };
            return WjMenuItem;
        })(angular.WjDirective);

        /**
        * AngularJS directive for menu separators.
        *
        * The <b>wj-menu-item-separator</b> directive must be contained in a @see:WjMenu directive.
        * It adds a non-selectable separator to the menu, and has no attributes.
        */
        var WjMenuSeparator = (function (_super) {
            __extends(WjMenuSeparator, _super);
            // Initializes a new instance of a WjMenuSeparator
            function WjMenuSeparator() {
                _super.call(this);
                this.template = '<span />';
                this.require = '^wjMenu';
            }
            WjMenuSeparator.prototype._getMetaDataId = function () {
                return 'MenuSeparator';
            };

            // Gets the WjMenuSeparator's link function. Overrides parent member
            WjMenuSeparator.prototype._postLinkFn = function () {
                return function (scope, tElement, tAttrs, menu) {
                    scope.header = '<div style="width:100%;height:1px;background-color:lightgray;opacity:.2"/>';
                    menu.addItem(scope, tElement);
                    tElement[0].style.display = 'none';
                };
            };
            return WjMenuSeparator;
        })(angular.WjDirective);

        /**
        * AngularJS directive for the @see:InputDate control.
        *
        * Use the <b>wj-input-date</b> directive to add @see:InputDate controls to your
        * AngularJS applications.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>&lt;p&gt;Here is an InputDate control:&lt;/p&gt;
        * &lt;wj-input-date
        *   value="theDate"
        *   format="M/d/yyyy"&gt;
        * &lt;/wj-input-date&gt;</pre>
        *
        * The example below shows a <b>Date</b> value (that includes date and time information)
        * using an @see:InputDate and an an @see:InputTime control. Notice how both controls
        * are bound to the same controller variable, and each edits the appropriate information
        * (either date or time). The example also shows a @see:Calendar control that can be
        * used to select the date with a single click.
        *
        * @fiddle:46PhD
        *
        * The <b>wj-input-date</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>control</dt>             <dd><code>=</code> A reference to the @see:InputDate
        *                                control created by this directive.</dd>
        *   <dt>format</dt>              <dd><code>@</code> The format used to display the date
        *                                being edited (see @see:Globalize).</dd>
        *   <dt>mask</dt>                <dd><code>@</code> The mask used to validate the input as
        *                                the user types (see @see:wijmo.input.InputMask).</dd>
        *   <dt>is-dropped-down</dt>     <dd><code>@</code> A value indicating whether the drop-down
        *                                is currently visible.</dd>
        *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
        *                                 initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
        *                                 initializing the control with attribute values. </dd>
        *   <dt>max</dt>                 <dd><code>@</code> The latest valid date (a string in the
        *                                format "yyyy-MM-dd").</dd>
        *   <dt>min</dt>                 <dd><code>@</code> The earliest valid date (a string in the
        *                                format "yyyy-MM-dd").</dd>
        *   <dt>place-holder</dt>        <dd><code>@</code> The string to show as a hint when the
        *                                control is empty.</dd>
        *   <dt>required</dt>            <dd><code>@</code> A value indicating whether to prevent
        *                                null values.</dd>
        *   <dt>show-drop-down-button</dt><dd><code>@</code> A value indicating whether the control
        *                                displays a drop-down button.</dd>
        *   <dt>text</dt>                <dd><code>=</code> The text to show in the control.</dd>
        *   <dt>value</dt>               <dd><code>=</code> The date being edited.</dd>
        *   <dt>is-dropped-down-changed</dt> <dd><code>&</code> The @see:isDroppedDownChanged event
        *                                handler.</dd>
        *   <dt>text-changed</dt>         <dd><code>&</code> The @see:textChanged event handler.</dd>
        *   <dt>value-changed</dt>        <dd><code>&</code> The @see:valueChanged event handler.</dd>
        * </dl class="dl-horizontal">
        *
        * If provided, the <b>min</b> and <b>max</b> attributes are strings in the format
        * "yyyy-MM-dd". Technically, you can use any full date as defined in the W3C
        * <a href="http://tools.ietf.org/html/rfc3339" target="_blank">[RFC 3339]<a>, which is also
        * the format used with regular HTML5 input elements.
        */
        var WjInputDate = (function (_super) {
            __extends(WjInputDate, _super);
            function WjInputDate() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjInputDate.prototype, "_controlConstructor", {
                // Gets the InputDate control constructor
                get: function () {
                    return wijmo.input.InputDate;
                },
                enumerable: true,
                configurable: true
            });
            return WjInputDate;
        })(WjDropDown);

        /**
        * AngularJS directive for the @see:InputNumber control.
        *
        * Use the <b>wj-input-number</b> directive to add <b>InputNumber</b> controls to your
        * AngularJS applications.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>&lt;p&gt;Here is an InputNumber control:&lt;/p&gt;
        * &lt;wj-input-number
        *   value="theNumber"
        *   min="0"
        *   max="10"
        *   format="n0"
        *   placeholder="number between zero and ten"&gt;
        * &lt;/wj-input-number&gt;</pre>
        *
        * The example below creates several <b>InputNumber</b> controls and shows the effect
        * of using different formats, ranges, and step values.
        *
        * @fiddle:u7HpD
        *
        * The <b>wj-input-number</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>control</dt>       <dd><code>=</code> A reference to the @see:InputNumber
        *                          control created by this directive.</dd>
        *   <dt>format</dt>        <dd><code>@</code> The format used to display the number
        *                          (see @see:Globalize).</dd>
        *   <dt>input-type</dt>    <dd><code>@</code> The "type" attribute of the HTML
        *                          input element hosted by the control.</dd>
        *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
        *                                 initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
        *                                 initializing the control with attribute values. </dd>
        *   <dt>max</dt>           <dd><code>@</code> The largest valid number.</dd>
        *   <dt>min</dt>           <dd><code>@</code> The smallest valid number.</dd>
        *   <dt>place-holder</dt>  <dd><code>@</code> The string to show as a hint when the
        *                          control is empty.</dd>
        *   <dt>required</dt>      <dd><code>@</code> A value indicating whether to prevent null
        *                          values.</dd>
        *   <dt>show-spinner</dt>  <dd><code>@</code> A value indicating whether to display spinner
        *                          buttons to change the value by <b>step</b> units.</dd>
        *   <dt>step</dt>          <dd><code>@</code> The amount to add or subtract to the value
        *                          when the user clicks the spinner buttons.</dd>
        *   <dt>text</dt>          <dd><code>=</code> The text to show in the control.</dd>
        *   <dt>value</dt>         <dd><code>=</code> The number being edited.</dd>
        *   <dt>text-changed</dt>  <dd><code>&</code> The @see:textChanged event handler.</dd>
        *   <dt>value-changed</dt> <dd><code>&</code> The @see:valueChanged event handler.</dd>
        * </dl class="dl-horizontal">
        */
        var WjInputNumber = (function (_super) {
            __extends(WjInputNumber, _super);
            function WjInputNumber() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjInputNumber.prototype, "_controlConstructor", {
                // Gets the InputNumber control constructor
                get: function () {
                    return wijmo.input.InputNumber;
                },
                enumerable: true,
                configurable: true
            });
            return WjInputNumber;
        })(angular.WjDirective);

        /**
        * AngularJS directive for the @see:InputMask control.
        *
        * Use the <b>wj-input-mask</b> directive to add @see:InputMask controls to your
        * AngularJS applications.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>&lt;p&gt;Here is an InputMask control:&lt;/p&gt;
        * &lt;wj-input-mask
        *   mask="99/99/99"
        *   mask-placeholder="*"&gt;
        * &lt;/wj-input-mask&gt;</pre>
        *
        * The <b>wj-input-mask</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>control</dt>           <dd><code>=</code> A reference to the @see:InputNumber
        *                              control created by this directive.</dd>
        *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
        *                                 initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
        *                                 initializing the control with attribute values. </dd>
        *   <dt>mask</dt>              <dd><code>@</code> The string mask used to format the value
        *                              as the user types.</dd>
        *   <dt>prompt-char</dt>       <dd><code>@</code> A character used to show input locations
        *                              within the mask.</dd>
        *   <dt>place-holder</dt>      <dd><code>@</code> The string to show as a hint when the control
        *                              is empty.</dd>
        *   <dt>value</dt>             <dd><code>=</code> The number being edited.</dd>
        *   <dt>value-changed</dt>     <dd><code>&</code> The @see:valueChanged event handler.</dd>
        * </dl class="dl-horizontal">
        */
        var WjInputMask = (function (_super) {
            __extends(WjInputMask, _super);
            function WjInputMask() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjInputMask.prototype, "_controlConstructor", {
                // Gets the InputMask control constructor
                get: function () {
                    return wijmo.input.InputMask;
                },
                enumerable: true,
                configurable: true
            });
            return WjInputMask;
        })(angular.WjDirective);

        /**
        * AngularJS directive for the @see:InputTime control.
        *
        * Use the <b>wj-input-time</b> directive to add <b>InputTime</b> controls to your AngularJS applications.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>&lt;p&gt;Here is an InputTime control:&lt;/p&gt;
        * &lt;wj-input-time
        *   value="theDate"
        *   format="h:mm tt"
        *   min="09:00" max="17:00"
        *   step="15"&gt;
        * &lt;/wj-input-time&gt;</pre>
        *
        * @fiddle:46PhD
        *
        * This example edits a <b>Date</b> value (that includes date and time information)
        * using an @see:InputDate and an an InputTime control. Notice how both controls
        * are bound to the same controller variable, and each edits the appropriate information
        * (either date or time). The example also shows a @see:Calendar control that can be
        * used to select the date with a single click.
        *
        * The <b>wj-input-time</b> directive extends @see:WjComboBox with the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>control</dt>   <dd><code>=</code> A reference to the @see:InputDate control
        *                      created by this directive.</dd>
        *   <dt>format</dt>    <dd><code>@</code> The format used to display the selected time.</dd>
        *   <dt>mask</dt>      <dd><code>@</code> A mask used to validate the input as the
        *                      user types (see @see:InputMask).</dd>
        *   <dt>max</dt>       <dd><code>@</code> The earliest valid time (a string in the format
        *                      "hh:mm").</dd>
        *   <dt>min</dt>       <dd><code>@</code> The latest valid time (a string in the format
        *                      "hh:mm").</dd>
        *   <dt>step</dt>      <dd><code>@</code> The number of minutes between entries in the
        *                      drop-down list.</dd>
        *   <dt>value</dt>     <dd><code>=</code> The time being edited (as a Date object).</dd>
        *   <dt>value-changed</dt>
        *                      <dd><code>&</code> The@see: valueChanged event handler.</dd>
        * </dl>
        *
        * If provided, the <b>min</b> and <b>max</b> attributes are strings in the format
        * "hh:mm". Technically, you can use any full date as defined in the W3C
        * <a href="http://tools.ietf.org/html/rfc3339" target="_blank">[RFC 3339]</a>, which is also the format
        * used with regular HTML5 input elements.
        */
        var WjInputTime = (function (_super) {
            __extends(WjInputTime, _super);
            function WjInputTime() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjInputTime.prototype, "_controlConstructor", {
                // Gets the InputTime control constructor
                get: function () {
                    return wijmo.input.InputTime;
                },
                enumerable: true,
                configurable: true
            });
            return WjInputTime;
        })(WjComboBox);

        /**
        * AngularJS directive for the @see:InputColor control.
        *
        * Use the <b>wj-input-color</b> directive to add @see:InputColor controls to your
        * AngularJS applications.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>&lt;p&gt;Here is an InputColor control:&lt;/p&gt;
        * &lt;wj-input-color
        *   value="theColor"
        *   show-alpha-channel="false"&gt;
        * &lt;/wj-input-color&gt;</pre>
        *
        * The <b>wj-input-color</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>control</dt>               <dd><code>=</code> A reference to the InputColor
        *                                  control created by this directive.</dd>
        *   <dt>is-dropped-down</dt>       <dd><code>@</code> A value indicating whether the drop-down
        *                                  is currently visible.</dd>
        *   <dt>initialized</dt>          <dd><code>&</code> This event occurs after the binding has finished
        *                                 initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt>       <dd><code>=</code> A value indicating whether the binding has finished
        *                                 initializing the control with attribute values. </dd>
        *   <dt>show-alpha-channel</dt>    <dd><code>@</code> A value indicatinbg whether the drop-down
        *                                  displays the alpha channel (transparency) editor.</dd>
        *   <dt>place-holder</dt>          <dd><code>@</code> The string to show as a hint when the
        *                                  control is empty.</dd>
        *   <dt>required</dt>              <dd><code>@</code> A value indicating whether to prevent null
        *                                  values.</dd>
        *   <dt>show-drop-down-button</dt> <dd><code>@</code> A value indicating whether the control
        *                                  displays a drop-down button.</dd>
        *   <dt>text</dt>                  <dd><code>=</code> The text to show in the control.</dd>
        *   <dt>value</dt>                 <dd><code>=</code> The color being edited.</dd>
        *   <dt>is-dropped-down-changed</dt><dd><code>&</code> The @see:isDroppedDownChanged event handler.</dd>
        *   <dt>text-changed</dt>          <dd><code>&</code> The @see:textChanged event handler.</dd>
        *   <dt>value-changed</dt>         <dd><code>&</code> The @see:valueChanged event handler.</dd>
        * </dl class="dl-horizontal">
        */
        var WjInputColor = (function (_super) {
            __extends(WjInputColor, _super);
            function WjInputColor() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjInputColor.prototype, "_controlConstructor", {
                // Gets the InputColor control constructor
                get: function () {
                    return wijmo.input.InputColor;
                },
                enumerable: true,
                configurable: true
            });
            return WjInputColor;
        })(WjDropDown);

        /**
        * AngularJS directive for an @see:ICollectionView navigator element.
        *
        * Use the <b>wj-collection-view-navigator</b> directive to add an element that allows users to
        * navigate through the items in an @see:ICollectionView.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>Here is a CollectionViewNavigator:&lt;/p&gt;
        * &lt;wj-collection-view-navigator
        *   cv="myCollectionView"&gt;
        * &lt;/wj-collection-view-navigator&gt;</pre>
        *
        * @fiddle:s8tT4
        *
        * This example creates a CollectionView with 100,000 items and 20 items per page.
        * It defines a navigator to select the current page, another to select the current item,
        * and shows the data in a @see:FlexGrid.
        *
        * The <b>wj-collection-view-navigator</b> directive has a single attribute:
        *
        * <dl class="dl-horizontal">
        *   <dt>cv</dt>  <dd><code>=</code> A reference to the @see:ICollectionView object to navigate.</dd>
        * </dl>
        */
        var WjCollectionViewNavigator = (function (_super) {
            __extends(WjCollectionViewNavigator, _super);
            // Initializes a new instance of a WjCollectionViewNavigator
            function WjCollectionViewNavigator() {
                _super.call(this);

                this.template = '<div class="wj-control wj-content wj-pager">' + '    <div class="wj-input-group">' + '        <span class="wj-input-group-btn" >' + '            <button class="wj-btn wj-btn-default" type="button"' + '               ng-click="cv.moveCurrentToFirst()"' + '               ng-disabled="cv.currentPosition <= 0">' + '                <span class="wj-glyph-left" style="margin-right: -4px;"></span>' + '                <span class="wj-glyph-left"></span>' + '             </button>' + '        </span>' + '        <span class="wj-input-group-btn" >' + '           <button class="wj-btn wj-btn-default" type="button"' + '               ng-click="cv.moveCurrentToPrevious()"' + '               ng-disabled="cv.currentPosition <= 0">' + '                <span class="wj-glyph-left"></span>' + '           </button>' + '        </span>' + '        <input type="text" class="wj-form-control" value="' + '           {{cv.currentPosition + 1 | number}} / {{cv.itemCount | number}}' + '           " disabled />' + '        <span class="wj-input-group-btn" >' + '            <button class="wj-btn wj-btn-default" type="button"' + '               ng-click="cv.moveCurrentToNext()"' + '               ng-disabled="cv.currentPosition >= cv.itemCount - 1">' + '                <span class="wj-glyph-right"></span>' + '            </button>' + '        </span>' + '        <span class="wj-input-group-btn" >' + '            <button class="wj-btn wj-btn-default" type="button"' + '               ng-click="cv.moveCurrentToLast()"' + '               ng-disabled="cv.currentPosition >= cv.itemCount - 1">' + '                <span class="wj-glyph-right"></span>' + '                <span class="wj-glyph-right" style="margin-left: -4px;"></span>' + '            </button>' + '        </span>' + '    </div>' + '</div>';
            }
            WjCollectionViewNavigator.prototype._getMetaDataId = function () {
                return 'CollectionViewNavigator';
            };

            // Gets the WjCollectionViewNavigator directive's link function. Overrides parent member
            WjCollectionViewNavigator.prototype._postLinkFn = function () {
                return function (scope, tElement, tAttrs, dropDownController) {
                };
            };
            return WjCollectionViewNavigator;
        })(angular.WjDirective);

        /**
        * AngularJS directive for an @see:ICollectionView pager element.
        *
        * Use the <b>wj-collection-view-pager</b> directive to add an element that allows users to
        * navigate through the pages in a paged @see:ICollectionView.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>Here is a CollectionViewPager:&lt;/p&gt;
        * &lt;wj-collection-view-pager
        *   cv="myCollectionView"&gt;
        * &lt;/wj-collection-view-pager&gt;</pre>
        *
        * @fiddle:s8tT4
        *
        * This example creates a CollectionView with 100,000 items and 20 items per page.
        * It defines a navigator to select the current page, another to select the current item,
        * and shows the data in a @see:FlexGrid.
        *
        * The <b>wj-collection-view-pager</b> directive has a single attribute:
        *
        * <dl class="dl-horizontal">
        *   <dt>cv</dt>  <dd><code>=</code> A reference to the paged @see:ICollectionView object to navigate.</dd>
        * </dl>
        */
        var WjCollectionViewPager = (function (_super) {
            __extends(WjCollectionViewPager, _super);
            // Initializes a new instance of a WjCollectionViewPager
            function WjCollectionViewPager() {
                _super.call(this);

                this.template = '<div class="wj-control wj-content wj-pager" >' + '    <div class="wj-input-group">' + '        <span class="wj-input-group-btn" >' + '            <button class="wj-btn wj-btn-default" type="button"' + '                ng-click="cv.moveToFirstPage()"' + '                ng-disabled="cv.pageIndex <= 0">' + '                <span class="wj-glyph-left" style="margin-right: -4px;"></span>' + '                <span class="wj-glyph-left"></span>' + '            </button>' + '        </span>' + '        <span class="wj-input-group-btn" >' + '        <button class="wj-btn wj-btn-default" type="button"' + '                ng-click="cv.moveToPreviousPage()"' + '                ng-disabled="cv.pageIndex <= 0">' + '                <span class="wj-glyph-left"></span>' + '            </button>' + '        </span>' + '        <input type="text" class="wj-form-control" value="' + '            {{cv.pageIndex + 1 | number}} / {{cv.pageCount | number}}' + '        " disabled />' + '        <span class="wj-input-group-btn" >' + '            <button class="wj-btn wj-btn-default" type="button"' + '                ng-click="cv.moveToNextPage()"' + '                ng-disabled="cv.pageIndex >= cv.pageCount - 1">' + '                <span class="wj-glyph-right"></span>' + '            </button>' + '        </span>' + '        <span class="wj-input-group-btn" >' + '            <button class="wj-btn wj-btn-default" type="button"' + '                ng-click="cv.moveToLastPage()"' + '                ng-disabled="cv.pageIndex >= cv.pageCount - 1">' + '                <span class="wj-glyph-right"></span>' + '                <span class="wj-glyph-right" style="margin-left: -4px;"></span>' + '            </button>' + '        </span>' + '    </div>' + '</div>';
            }
            WjCollectionViewPager.prototype._getMetaDataId = function () {
                return 'CollectionViewPager';
            };

            // Gets the WjCollectionViewPager directive's link function. Overrides parent member
            WjCollectionViewPager.prototype._postLinkFn = function () {
                return function (scope, tElement, tAttrs, dropDownController) {
                };
            };
            return WjCollectionViewPager;
        })(angular.WjDirective);
    })(wijmo.angular || (wijmo.angular = {}));
    var angular = wijmo.angular;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.input.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    //
    // AngularJS directives for wijmo.chart module
    //
    (function (angular) {
        //#region "Charts directives registration"
        var wijmoChart = window['angular'].module('wj.chart', []);

        wijmoChart.directive('wjFlexChart', [function () {
                return new WjFlexChart();
            }]);

        wijmoChart.directive('wjFlexChartAxis', [function () {
                return new WjFlexChartAxis();
            }]);

        wijmoChart.directive('wjFlexChartSeries', [function () {
                return new WjFlexChartSeries();
            }]);

        wijmoChart.directive('wjFlexChartLegend', [function () {
                return new WjFlexChartLegend();
            }]);

        wijmoChart.directive('wjFlexPie', [function () {
                return new WjFlexPie();
            }]);

        //#endregion "Charts directives definitions"
        //#region "Charts directives classes"
        // Base class for WjFlexChart and FlexPie directives with common prop and event dictionaries
        var WjFlexChartBase = (function (_super) {
            __extends(WjFlexChartBase, _super);
            // Initializes a new instance of a WjFlexChart
            function WjFlexChartBase() {
                _super.call(this);

                var self = this;

                this.template = '<div ng-transclude />';
                this.transclude = true;
            }
            Object.defineProperty(WjFlexChartBase.prototype, "_controlConstructor", {
                get: function () {
                    return wijmo.chart.FlexChartBase;
                },
                enumerable: true,
                configurable: true
            });

            WjFlexChartBase.prototype._initProps = function () {
                _super.prototype._initProps.call(this);
                var self = this;
                var tooltipDesc = angular.MetaFactory.findProp('tooltipContent', this._props);
                tooltipDesc.customHandler = function (scope, control, value, oldValue, link) {
                    if (value != null) {
                        control.tooltip.content = value;
                    }
                };
            };
            return WjFlexChartBase;
        })(angular.WjDirective);

        /**
        * AngularJS directive for the @see:FlexChart control.
        *
        * Use the <b>wj-flex-chart</b> directive to add charts to your AngularJS applications.
        * Note that directive and parameter names must be formatted using lower-case letters
        * with dashes instead of camel case. For example:
        *
        * <pre>&lt;p&gt;Here is a FlexChart control:&lt;/p&gt;
        * &lt;wj-flex-chart
        *   style="height:300px"
        *   items-source="data"
        *   binding-x="country"&gt;
        *   &lt;wj-flex-chart-axis
        *     wj-property="axisY"
        *     major-unit="5000"&gt;
        *   &lt;/wj-flex-chart-axis&gt;
        *   &lt;wj-flex-chart-series
        *     binding="sales"
        *     name="Sales"&gt;
        *   &lt;/wj-flex-chart-series&gt;
        *   &lt;wj-flex-chart-series
        *     binding="expenses"
        *     name="Expenses"&gt;
        *   &lt;/wj-flex-chart-series&gt;
        *   &lt;wj-flex-chart-series
        *     binding="downloads"
        *     name="Downloads"
        *     chart-type="LineSymbols"&gt;
        *   &lt;/wj-flex-chart-series&gt;
        * &lt;/wj-flex-chart&gt;</pre>
        *
        * The example below creates a @see:FlexChart control and binds it to a 'data' array
        * exposed by the controller. The chart has three series objects, each corresponding to
        * a property in the objects contained in the source array. The last series in the
        * example uses the 'chart-type' attribute to override the default chart type used
        * for the other series objects.
        *
        * @fiddle:QNb9X
        *
        * The wj-flex-chart directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>binding</dt>           <dd><code>@</code> The name of the property that contains Y
        *                              values for the chart. You can override this at the series level.</dd>
        *   <dt>binding-x</dt>         <dd><code>@</code> The name of the property that contains X
        *                              values for the chart. You can override this at the series level.</dd>
        *   <dt>chart-type</dt>        <dd><code>@</code> The default chart type to use in rendering series
        *                              objects. You can override this at the series level. See @see:ChartType.</dd>
        *   <dt>control</dt>           <dd><code>=</code> A reference to the @see:FlexChart control
        *                              that this directive creates.</dd>
        *   <dt>footer</dt>            <dd><code>@</code> The text to display in the chart footer (plain
        *                              text).</dd>
        *   <dt>footer-style</dt>       <dd><code>=</code> The style to apply to the chart footer.</dd>
        *   <dt>header</dt>            <dd><code>@</code> The text to display in the chart header (plain
        *                              text).</dd>
        *   <dt>header-style</dt>      <dd><code>=</code> The style to apply to the chart header.</dd>
        *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished
        *                              initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt><dd><code>=</code> A value indicating whether the binding has finished
        *                              initializing the control with attribute values. </dd>
        *   <dt>interpolate-nulls</dt> <dd><code>@</code> The value indicating whether to interpolate or
        *                              leave gaps when there are null values in the data.</dd>
        *   <dt>item-formatter</dt>    <dd><code>=</code> The formatter function that customizes the
        *                              appearance of data points.</dd>
        *   <dt>items-source</dt>      <dd><code>=</code> An array or @see:ICollectionView object that contains
        *                              the data used to create the chart.</dd>
        *   <dt>legend-toggle</dt>     <dd><code>@</code> The value indicating whether clicking legend items
        *                              toggles series visibility.</dd>
        *   <dt>options</dt>           <dd><code>=</code> Chart options that only apply to certain chart types.
        *                              See <b>options</b> under @see:FlexChart for details.</dd>
        *   <dt>palette</dt>           <dd><code>=</code> An array that contains the default colors used for
        *                              displaying each series.</dd>
        *   <dt>plot-margin</dt>       <dd><code>=</code> The number of pixels of space to leave between the
        *                              edges of the control and the plot area, or CSS-style margins.</dd>
        *   <dt>rotated</dt>           <dd><code>@</code> The value indicating whether to flip the axes so that
        *                              X is vertical and Y is horizontal.</dd>
        *   <dt>selection</dt>         <dd><code>=</code> The series object that is selected.</dd>
        *   <dt>selection-mode</dt>    <dd><code>@</code> The @see:SelectionMode value indicating whether or what is
        *                              selected when the user clicks a series.</dd>
        *   <dt>stacking</dt>          <dd><code>@</code> The @see:Stacking value indicating whether or how series
        *                              objects are stacked or plotted independently.</dd>
        *   <dt>symbol-size</dt>       <dd><code>@</code> The size in pixels of the symbols used to render data
        *                              points in Scatter, LineSymbols, and SplineSymbols charts. You can override
        *                              this at the series level.</dd>
        *   <dt>tooltip-content</dt>   <dd><code>@</code> The value to display in the
        *                              @see:ChartTooltip content property.</dd>
        *   <dt>rendered</dt>          <dd><code>&</code> The @see:rendered event handler.</dd>
        *   <dt>series-visibility-changed</dt>
        *                              <dd><code>&</code> The @see:seriesVisibilityChanged event handler.</dd>
        *   <dt>selection-changed</dt> <dd><code>&</code> The @see:selectionChanged event handler.</dd>
        * </dl>
        *
        * The wj-flex-chart directive may contain the following child directives:
        * wj-flex-chart-axis, wj-flex-chart-series, and wj-flex-chart-legend.
        * See @see:WjFlexChartAxis, @see:WjFlexChartSeries, and @see:WjFlexChartLegend for details.
        */
        var WjFlexChart = (function (_super) {
            __extends(WjFlexChart, _super);
            function WjFlexChart() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjFlexChart.prototype, "_controlConstructor", {
                // gets the Wijmo FlexChart control constructor
                get: function () {
                    return wijmo.chart.FlexChart;
                },
                enumerable: true,
                configurable: true
            });
            return WjFlexChart;
        })(WjFlexChartBase);

        /**
        * AngularJS directive for the @see:FlexChart @see:Axis object.
        *
        * The <b>wj-flex-chart-axis</b> directive must be contained in a @see:WjFlexChart directive.
        * It supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>wj-property</dt>     <dd><code>@</code> Defines the @see:FlexChart property name,
        *                            axis-x or axis-y, to initialize with this directive.</dd>
        *   <dt>axis-line</dt>       <dd><code>@</code> The value indicating whether the axis line is visible.</dd>
        *   <dt>format</dt>          <dd><code>@</code> The format string used for the axis labels
        *                            (see @see:wijmo.Globalize).</dd>
        *   <dt>labels</dt>          <dd><code>@</code> The value indicating whether the axis labels are visible.</dd>
        *   <dt>label-angle</dt>     <dd><code>@</code> The rotation angle of axis labels in degrees.</dd>
        *   <dt>major-grid</dt>      <dd><code>@</code> The value indicating whether the axis includes grid lines.</dd>
        *   <dt>major-tick-marks</dt><dd><code>@</code> Defines the appearance of tick marks on the axis
        *                            (see @see:TickMark).</dd>
        *   <dt>major-unit</dt>      <dd><code>@</code> The number of units between axis labels.</dd>
        *   <dt>max</dt>             <dd><code>@</code> The minimum value shown on the axis.</dd>
        *   <dt>min</dt>             <dd><code>@</code> The maximum value shown on the axis.</dd>
        *   <dt>minor-grid</dt>      <dd><code>@</code> The value indicating whether the axis includes minor grid lines.</dd>
        *   <dt>minor-tick-marks</dt><dd><code>@</code> Defines the appearance of minor tick marks on the axis
        *                            (see @see:TickMark).</dd>
        *   <dt>minor-unit</dt>      <dd><code>@</code> The number of units between minor axis ticks.</dd>
        *   <dt>origin</dt>          <dd><code>@</code> The axis origin.</dd>
        *   <dt>position</dt>        <dd><code>@</code> The @see:Position value indicating the position of the axis.</dd>
        *   <dt>reversed</dt>        <dd><code>@</code> The value indicating whether the axis is reversed (top to
        *                            bottom or right to left).</dd>
        *   <dt>title</dt>           <dd><code>@</code> The title text shown next to the axis.</dd>
        * </dl>
        */
        var WjFlexChartAxis = (function (_super) {
            __extends(WjFlexChartAxis, _super);
            // Initializes a new instance of a WjFlexCharAxis.
            function WjFlexChartAxis() {
                _super.call(this);

                this.require = ['?^wjFlexChartSeries', '?^wjFlexChart'];
                this.template = '<div class="wjFlexChartAxis" />';
            }
            Object.defineProperty(WjFlexChartAxis.prototype, "_controlConstructor", {
                get: function () {
                    return wijmo.chart.Axis;
                },
                enumerable: true,
                configurable: true
            });
            return WjFlexChartAxis;
        })(angular.WjDirective);

        /**
        * AngularJS directive for the @see:FlexChart @see:Legend object.
        *
        * The <b>wj-flex-chart-legend</b> directive must be contained in a @see:WjFlexChart directive.
        * It supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>position</dt>       <dd><code>@</code> The @see:Position value indicating the position of the
        *                           legend.</dd>
        * </dl>
        *
        * The example below shows how you can use the wj-flex-chart-legend directive
        * to change the position of the chart legend:
        *
        * <pre>&lt;wj-flex-chart
        *   items-source="data"
        *   binding-x="country"&gt;
        *   &lt;wj-flex-chart-axis
        *       wj-property="axisY"
        *       major-unit="5000"&gt;
        *     &lt;/wj-flex-chart-axis&gt;
        *     &lt;wj-flex-chart-series
        *       binding="sales"
        *       name="Sales"&gt;
        *     &lt;/wj-flex-chart-series&gt;
        *   &lt;wj-flex-chart-legend
        *     position="Bottom"&gt;
        *   &lt;/wj-flex-chart-legend&gt;
        * &lt;/wj-flex-chart&gt;</pre>
        */
        var WjFlexChartLegend = (function (_super) {
            __extends(WjFlexChartLegend, _super);
            // Initializes a new instance of a WjFlexChartLegend.
            function WjFlexChartLegend() {
                _super.call(this);

                this.require = ['?^wjFlexChart', '?^wjFlexPie'];
                this.template = '<div />';
            }
            Object.defineProperty(WjFlexChartLegend.prototype, "_controlConstructor", {
                get: function () {
                    return wijmo.chart.Legend;
                },
                enumerable: true,
                configurable: true
            });
            return WjFlexChartLegend;
        })(angular.WjDirective);

        /**
        * AngularJS directive for the @see:FlexChart @see:Series object.
        *
        * The <b>wj-flex-chart-series</b> directive must be contained in a @see:WjFlexChart directive.
        * It supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>binding</dt>      <dd><code>@</code> The name of the property that contains Y values for the
        *                         series. This value overrides any binding set for the chart.</dd>
        *   <dt>binding-x</dt>    <dd><code>@</code> The name of the property that contains X values for the
        *                         series. This value overrides any binding set for the chart.</dd>
        *   <dt>chart-type</dt>   <dd><code>@</code> The chart type to use in rendering objects for this series
        *                         objects. This value overrides the default chart type set on the chart. See
        *                         @see:ChartType.</dd>
        *   <dt>css-class</dt>    <dd><code>@</code> The CSS class to use for the series.</dd>
        *   <dt>items-source</dt> <dd><code>=</code> An array or @see:ICollectionView object that contains
        *                         data for this series.</dd>
        *   <dt>name</dt>         <dd><code>@</code> The name of the series to show in the legend.</dd>
        *   <dt>style</dt>        <dd><code>=</code> The series style. Use ng-attr-style to specify the series
        *                         style object as an object. See the section on ngAttr attribute bindings in
        *                         <a target="_blank" href="https://docs.angularjs.org/guide/directive">
        *                         AngularJS Creating Custom Directives</a> and the <a target="_blank" href=
        *                         "http://demos.componentone.com/wijmo/5/Angular/FlexChartIntro/FlexChartIntro/#Styling">
        *                         FlexChart 101 Styling Series</a> sample for more information.</dd>
        *   <dt>symbol-marker</dt><dd><code>@</code> The shape of marker to use for the series. This value
        *                         overrides the default marker set on the chart. See @see:Marker.</dd>
        *   <dt>symbol-size</dt>  <dd><code>@</code> The size in pixels of the symbols used to render data
        *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
        *                         This value overrides any set at the chart level.</dd>
        *   <dt>symbol-style</dt> <dd><code>=</code> The style of the symbols used to render data
        *                         points in this series for Scatter, LineSymbols, and SplineSymbols charts.
        *                         This value overrides any set at the chart level.</dd>
        *   <dt>visibility</dt>   <dd><code>=</code> The @see:SeriesVisibility value indicating whether and where to
        *                         display the series.</dd>
        * </dl>
        *
        * In most cases, the <b>wj-flex-chart-series</b> specifies only the "name" and "binding" properties.
        * The remaining values are inherited from the parent <b>wj-flex-chart</b> directive.
        */
        var WjFlexChartSeries = (function (_super) {
            __extends(WjFlexChartSeries, _super);
            // Initializes a new instance of a WjFlexChartSeries
            function WjFlexChartSeries() {
                _super.call(this);
                this.require = '^wjFlexChart';
                this.template = '<div class="wjFlexChartSeries" ng-transclude />';
                this.transclude = true;
            }
            Object.defineProperty(WjFlexChartSeries.prototype, "_controlConstructor", {
                // Returns constructor of related Wijmo object. Abstract member, must be overridden in inherited class
                get: function () {
                    return wijmo.chart.Series;
                },
                enumerable: true,
                configurable: true
            });
            return WjFlexChartSeries;
        })(angular.WjDirective);

        /**
        * AngularJS directive for the @see:FlexPie control.
        *
        * <dl class="dl-horizontal">
        *   <dt>items-source</dt>      <dd><code>=</code> An array or @see:ICollectionView
        *                              object that contains data for this series.</dd>
        *   <dt>binding</dt>           <dd><code>@</code> The name of the property that
        *                              contains item values.</dd>
        *   <dt>binding-name</dt>      <dd><code>@</code> The name of the property that
        *                              contains item names.</dd>
        *   <dt>initialized</dt>       <dd><code>&</code> This event occurs after the binding has finished
        *                              initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt><dd><code>=</code> A value indicating whether the binding has finished
        *                              initializing the control with attribute values. </dd>
        *   <dt>inner-radius</dt>      <dd><code>@</code> The size of the hole inside the
        *                              pie, measured as a fraction of the pie radius.</dd>
        *   <dt>is-animated</dt>       <dd><code>@</code> A value indicating whether to use animation
        *                              to move selected items to the selectedItemPosition.</dd>
        *   <dt>offset</dt>            <dd><code>@</code> The extent to which pie slices are pulled
        *                              out from the center, as a fraction of the pie radius.</dd>
        *   <dt>reversed</dt>          <dd><code>@</code> A value indicating whether to draw pie
        *                              slices in a counter-clockwise direction.</dd>
        *   <dt>start-angle</dt>       <dd><code>@</code> The starting angle for pie slices,
        *                              measured clockwise from the 9 o'clock position.</dd>
        *   <dt>selected-item-offset</dt>
        *                              <dd><code>@</code> The extent to which the selected pie slice is
        *                              pulled out from the center, as a fraction of the pie radius.</dd>
        *   <dt>selected-item-position</dt>
        *                              <dd><code>@</code> The @see:Position value indicating where to display
        *                              the selected slice.</dd>
        *   <dt>tooltip-content</dt>   <dd><code>@</code> The value to display in the
        *                              @see:ChartTooltip content property.</dd>
        * </dl>
        */
        var WjFlexPie = (function (_super) {
            __extends(WjFlexPie, _super);
            function WjFlexPie() {
                _super.apply(this, arguments);
            }
            Object.defineProperty(WjFlexPie.prototype, "_controlConstructor", {
                // gets the Wijmo FlexPie control constructor
                get: function () {
                    return wijmo.chart.FlexPie;
                },
                enumerable: true,
                configurable: true
            });
            return WjFlexPie;
        })(WjFlexChartBase);
    })(wijmo.angular || (wijmo.angular = {}));
    var angular = wijmo.angular;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.chart.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    //
    // AngularJS directives for wijmo.gauge module
    //
    (function (angular) {
        //#region "Gauge directives registration"
        var wijmoGauge = window['angular'].module('wj.gauge', []);

        wijmoGauge.directive('wjLinearGauge', [function () {
                return new WjLinearGauge();
            }]);

        wijmoGauge.directive('wjBulletGraph', [function () {
                return new WjBulletGraph();
            }]);

        wijmoGauge.directive('wjRadialGauge', [function () {
                return new WjRadialGauge();
            }]);

        wijmoGauge.directive('wjRange', [function () {
                return new WjRange();
            }]);

        //#endregion "Gauge directives definitions"
        //#region "Gauge directives classes"
        // Gauge control directive
        // Provides base setup for all directives related to controls derived from Gauge
        // Abstract class, not for use in markup
        var WjGauge = (function (_super) {
            __extends(WjGauge, _super);
            // Creates a new instance of a WjGauge
            function WjGauge() {
                _super.call(this);
                this.template = '<div ng-transclude />';
                this.transclude = true;
            }
            Object.defineProperty(WjGauge.prototype, "_controlConstructor", {
                get: function () {
                    return wijmo.gauge.Gauge;
                },
                enumerable: true,
                configurable: true
            });
            return WjGauge;
        })(angular.WjDirective);

        /**
        * AngularJS directive for the @see:LinearGauge control.
        *
        * Use the <b>wj-linear-gauge</b> directive to add linear gauges to your AngularJS applications.
        * Note that directive and parameter names must be formatted in lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>&lt;wj-linear-gauge
        *   value="ctx.gauge.value"
        *   show-text="Value"
        *   is-read-only="false"&gt;
        *   &lt;wj-range
        *     wj-property="pointer"
        *     thickness="0.2"&gt;
        *     &lt;wj-range
        *       min="0"
        *       max="33"
        *       color="green"&gt;
        *     &lt;/wj-range&gt;
        *     &lt;wj-range
        *       min="33"
        *       max="66"
        *       color="yellow"&gt;
        *     &lt;/wj-range&gt;
        *     &lt;wj-range
        *       min="66"
        *       max="100"
        *       color="red"&gt;
        *     &lt;/wj-range&gt;
        *   &lt;/wj-range&gt;
        * &lt;/wj-linear-gauge&gt;</pre>
        *
        * The <b>wj-linear-gauge</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>control</dt>       <dd><code>=</code> A reference to the @see:LinearGauge
        *                          control created by this directive.</dd>
        *   <dt>direction</dt>     <dd><code>@</code> The @see:GaugeDirection value in
        *                          which the gauge fills as the value grows.</dd>
        *   <dt>format</dt>        <dd><code>@</code> The format string used for displaying
        *                          the gauge values as text.</dd>
        *   <dt>has-shadow</dt>    <dd><code>@</code> A value indicating whether the gauge
        *                          displays a shadow effect.</dd>
        *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished
        *                          initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt> <dd><code>=</code> A value indicating whether the binding has finished
        *                           initializing the control with attribute values. </dd>
        *   <dt>is-animated</dt>   <dd><code>@</code> A value indicating whether the gauge
        *                          animates value changes.</dd>
        *   <dt>is-read-only</dt>  <dd><code>@</code> A value indicating whether users are
        *                          prevented from editing the value.</dd>
        *   <dt>min</dt>           <dd><code>@</code> The minimum value that the gauge
        *                          can display.</dd>
        *   <dt>max</dt>           <dd><code>@</code> The maximum value that the gauge
        *                          can display.</dd>
        *   <dt>show-text</dt>     <dd><code>@</code> The @see:ShowText value indicating
        *                          which values display as text within the gauge.</dd>
        *   <dt>step</dt>          <dd><code>@</code> The amount to add or subtract to the value
        *                          property when the user presses the arrow keys.</dd>
        *   <dt>thickness</dt>     <dd><code>@</code> The thickness of the gauge, on a scale
        *                          of zero to one.</dd>
        *   <dt>value</dt>         <dd><code>=</code> The value displayed on the gauge.</dd>
        * </dl>
        *
        * The <b>wj-linear-gauge</b> directive may contain one or more @see:WjRange directives.
        *
        * @fiddle:t842jozb
        */
        var WjLinearGauge = (function (_super) {
            __extends(WjLinearGauge, _super);
            // Initializes a new instance of a WjLinearGauge
            function WjLinearGauge() {
                _super.call(this);
            }
            Object.defineProperty(WjLinearGauge.prototype, "_controlConstructor", {
                // gets the Wijmo LinearGauge control constructor
                get: function () {
                    return wijmo.gauge.LinearGauge;
                },
                enumerable: true,
                configurable: true
            });
            return WjLinearGauge;
        })(WjGauge);

        /**
        * AngularJS directive for the @see:BulletGraph control.
        *
        * Use the <b>wj-bullet-graph</b> directive to add bullet graphs to your AngularJS applications.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>&lt;wj-bullet-graph
        *   value="ctx.gauge.value"
        *   min="0" max="10"
        *   target="{&#8203;{item.target}}"
        *   bad="{&#8203;{item.target * .75}}"
        *   good="{&#8203;{item.target * 1.25}}"&gt;
        * &lt;/wj-bullet-graph&gt;</pre>
        *
        * The <b>wj-bullet-graph</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>control</dt>       <dd><code>=</code> A reference to the BulletGraph control
        *                          created by this directive.</dd>
        *   <dt>direction</dt>     <dd><code>@</code> The @see:GaugeDirection value
        *                          indicating which direction the gauge fills as the value grows.</dd>
        *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished
        *                          initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt> <dd><code>=</code> A value indicating whether the binding has finished
        *                           initializing the control with attribute values. </dd>
        *   <dt>target</dt>        <dd><code>@</code> The target value for the measure.</dd>
        *   <dt>good</dt>          <dd><code>@</code> A reference value considered good for the
        *                          measure.</dd>
        *   <dt>bad</dt>           <dd><code>@</code> A reference value considered bad for the
        *                          measure.</dd>
        *   <dt>value</dt>         <dd><code>=</code> The actual value of the measure.</dd>
        * </dl>
        *
        * The <b>wj-bullet-graph</b> directive may contain one or more @see:WjRange directives.
        *
        * @fiddle:8uxb1vwf
        */
        var WjBulletGraph = (function (_super) {
            __extends(WjBulletGraph, _super);
            // Initializes a new instance of a WjBulletGraph
            function WjBulletGraph() {
                _super.call(this);
            }
            Object.defineProperty(WjBulletGraph.prototype, "_controlConstructor", {
                // gets the Wijmo BulletGraph control constructor
                get: function () {
                    return wijmo.gauge.BulletGraph;
                },
                enumerable: true,
                configurable: true
            });
            return WjBulletGraph;
        })(WjLinearGauge);

        /**
        * AngularJS directive for the @see:RadialGauge control.
        *
        * Use the <b>wj-radial-gauge</b> directive to add radial gauges to your AngularJS applications.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>Here is a &lt;b&gt;RadialGauge&lt;/b&gt; control:&lt;/p&gt;
        * &lt;wj-radial-gauge
        *   style="height:300px"
        *   value="count"
        *   min="0" max="10"
        *   is-read-only="false"&gt;
        * &lt;/wj-radial-gauge&gt;</pre>
        *
        * The <b>wj-radial-gauge</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>control</dt>       <dd><code>=</code> A reference to the RadialGauge
        *                          control created by this directive.</dd>
        *   <dt>auto-scale</dt>    <dd><code>@</code> A value indicating whether the gauge
        *                          scales the display to fill the host element.</dd>
        *   <dt>format</dt>        <dd><code>@</code> The format string used for displaying
        *                          gauge values as text.</dd>
        *   <dt>has-shadow</dt>    <dd><code>@</code> A value indicating whether the gauge
        *                          displays a shadow effect.</dd>
        *   <dt>initialized</dt>   <dd><code>&</code> This event occurs after the binding has finished
        *                          initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt> <dd><code>=</code> A value indicating whether the binding has finished
        *                           initializing the control with attribute values. </dd>
        *   <dt>is-animated</dt>   <dd><code>@</code> A value indicating whether the gauge
        *                          animates value changes.</dd>
        *   <dt>is-read-only</dt>  <dd><code>@</code> A value indicating whether users are
        *                          prevented from editing the value.</dd>
        *   <dt>min</dt>           <dd><code>@</code> The minimum value that the gauge
        *                          can display.</dd>
        *   <dt>max</dt>           <dd><code>@</code> The maximum value that the gauge
        *                          can display.</dd>
        *   <dt>show-text</dt>     <dd><code>@</code> A @see:ShowText value indicating
        *                          which values display as text within the gauge.</dd>
        *   <dt>step</dt>          <dd><code>@</code> The amount to add or subtract to the
        *                          value property when the user presses the arrow keys.</dd>
        *   <dt>start-angle</dt>   <dd><code>@</code> The starting angle for the gauge, in
        *                          degreees, measured clockwise from the 9 o'clock position.</dd>
        *   <dt>sweep-angle</dt>   <dd><code>@</code> The sweeping angle for the gauge in degrees
        *                          (may be positive or negative).</dd>
        *   <dt>thickness</dt>     <dd><code>@</code> The thickness of the gauge, on a scale
        *                          of zero to one.</dd>
        *   <dt>value</dt>         <dd><code>=</code> The value displayed on the gauge.</dd>
        * </dl>
        *
        * The <b>wj-radial-gauge</b> directive may contain one or more @see:WjRange directives.
        *
        * @fiddle:7ec2144u
        */
        var WjRadialGauge = (function (_super) {
            __extends(WjRadialGauge, _super);
            // Initializes a new instance of a WjRadialGauge
            function WjRadialGauge() {
                _super.call(this);
            }
            Object.defineProperty(WjRadialGauge.prototype, "_controlConstructor", {
                // gets the Wijmo RadialGauge control constructor
                get: function () {
                    return wijmo.gauge.RadialGauge;
                },
                enumerable: true,
                configurable: true
            });
            return WjRadialGauge;
        })(WjGauge);

        /**
        * AngularJS directive for the @see:Range object.
        *
        * The <b>wj-range</b> directive must be contained in a @see:WjLinearGauge, @see:WjRadialGauge
        * or @see:WjBulletGraph directive. It adds the Range object to the 'ranges' array property
        * of the parent directive. You may also initialize other Range type properties of the parent
        * directive by specifying the property name with the wj-property attribute.
        *
        * For example:
        * <pre>&lt;wj-radial-gauge
        *     min="0"
        *     max="200"
        *     step="20"
        *     value="theValue"
        *     is-read-only="false"&gt;
        *     &lt;wj-range
        *       min="0"
        *       max="100"
        *       color="red"&gt;
        *     &lt;/wj-range&gt;
        *     &lt;wj-range
        *       min="100"
        *       max="200"
        *       color="green"&gt;
        *     &lt;/wj-range&gt;
        *     &lt;wj-range
        *       wj-property="pointer"
        *       color="blue"&gt;
        *     &lt;/wj-range&gt;
        * &lt;/wj-radial-gauge&gt;</pre>
        *
        * The <b>wj-range</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>min</dt>           <dd><code>@</code> The minimum value in the range.</dd>
        *   <dt>max</dt>           <dd><code>@</code> The maximum value in the range.</dd>
        *   <dt>color</dt>         <dd><code>@</code> The color used to display the range.</dd>
        *   <dt>thickness</dt>     <dd><code>@</code> The thickness of the range, on a scale
        *                          of zero to one.</dd>
        *   <dt>name</dt>          <dd><code>@</code> The name of the range.</dd>
        *   <dt>wj-property</dt>   <dd><code>@</code> The name of the property to initialize
        *                          with this directive.</dd>
        * </dl>
        */
        var WjRange = (function (_super) {
            __extends(WjRange, _super);
            // Initializes a new instance of a WjRange
            function WjRange() {
                _super.call(this);
                this.require = ['?^wjLinearGauge', '?^wjRadialGauge', '?^wjBulletGraph'];
                this.template = '<div ng-transclude />';
                this.transclude = true;

                // set up as a child directive
                this._property = 'ranges';
                this._isPropertyArray = true;
            }
            Object.defineProperty(WjRange.prototype, "_controlConstructor", {
                // Returns constructor of related Wijmo object. Abstract member, must be overridden in inherited class
                get: function () {
                    return wijmo.gauge.Range;
                },
                enumerable: true,
                configurable: true
            });
            return WjRange;
        })(angular.WjDirective);
    })(wijmo.angular || (wijmo.angular = {}));
    var angular = wijmo.angular;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.gauge.js.map

var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var wijmo;
(function (wijmo) {
    //
    // AngularJS directives for wijmo.grid module
    //
    (function (angular) {
        //#region "Grid directives registration"
        var wijmoGrid = window['angular'].module('wj.grid', []);

        wijmoGrid.directive('wjFlexGrid', [
            '$compile', '$interpolate', function ($compile, $interpolate) {
                return new WjFlexGrid($compile, $interpolate);
            }]);

        wijmoGrid.directive('wjFlexGridColumn', [function () {
                return new WjFlexGridColumn();
            }]);

        //#endregion "Grid directives definitions"
        //#region "Grid directives classes"
        /**
        * AngularJS directive for the @see:FlexGrid control.
        *
        * Use the <b>wj-flex-grid</b> directive to add grids to your AngularJS applications.
        * Note that directive and parameter names must be formatted as lower-case with dashes
        * instead of camel-case. For example:
        *
        * <pre>&lt;p&gt;Here is a FlexGrid control:&lt;/p&gt;
        * &lt;wj-flex-grid items-source="data"&gt;
        *   &lt;wj-flex-grid-column
        *     header="Country"
        *     binding="country"&gt;
        *   &lt;/wj-flex-grid-column&gt;
        *   &lt;wj-flex-grid-column
        *     header="Sales"
        *     binding="sales"&gt;
        *   &lt;/wj-flex-grid-column&gt;
        *   &lt;wj-flex-grid-column
        *     header="Expenses"
        *     binding="expenses"&gt;
        *   &lt;/wj-flex-grid-column&gt;
        *   &lt;wj-flex-grid-column
        *     header="Downloads"
        *     binding="downloads"&gt;
        *   &lt;/wj-flex-grid-column&gt;
        * &lt;/wj-flex-grid&gt;</pre>
        *
        * The example below creates a FlexGrid control and binds it to a 'data' array
        * exposed by the controller. The grid has three columns, each corresponding to
        * a property of the objects contained in the source array.
        *
        * @fiddle:QNb9X
        *
        * The <b>wj-flex-grid</b> directive supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>allowAddNew</dt>              <dd><code>@</code> A value indicating whether to show a new row
        *                                     template so users can add items to the source collection.</dd>
        *   <dt>allow-delete</dt>             <dd><code>@</code> A value indicating whether the grid deletes
        *                                     selected rows when the user presses the Delete key.</dd>
        *   <dt>allow-dragging</dt>           <dd><code>@</code> An @see:AllowDragging value indicating
        *                                     whether and how the user can drag rows and columns with the mouse.</dd>
        *   <dt>allow-merging</dt>            <dd><code>@</code> An @see:AllowMerging value indicating
        *                                     which parts of the grid provide cell merging.</dd>
        *   <dt>allow-resizing</dt>           <dd><code>@</code> An @see:AllowResizing value indicating
        *                                     whether users are allowed to resize rows and columns with the mouse.</dd>
        *   <dt>allow-sorting</dt>            <dd><code>@</code> A boolean value indicating whether users can sort
        *                                     columns by clicking the column headers.</dd>
        *   <dt>auto-generate-columns</dt>    <dd><code>@</code> A boolean value indicating whether the grid generates
        *                                     columns automatically based on the <b>items-source</b>.</dd>
        *   <dt>child-items-path</dt>         <dd><code>@</code> The name of the property used to generate
        *                                     child rows in hierarchical grids.</dd>
        *   <dt>control</dt>                  <dd><code>=</code> A reference to the @see:FlexGrid control
        *                                     created by this directive.</dd>
        *   <dt>group-header-format</dt>      <dd><code>@</code> The format string used to create the group
        *                                     header content.</dd>
        *   <dt>headers-visibility</dt>       <dd><code>=</code> A @see:HeadersVisibility value
        *                                     indicating whether the row and column headers are visible. </dd>
        *   <dt>initialized</dt>              <dd><code>&</code> This event occurs after the binding has finished
        *                                     initializing the control with attribute values.</dd>
        *   <dt>is-initialized</dt>           <dd><code>=</code> A value indicating whether the binding has finished
        *                                     initializing the control with attribute values. </dd>
        *   <dt>item-formatter</dt>           <dd><code>=</code> A function that customizes
        *                                     cells on this grid.</dd>
        *   <dt>items-source</dt>             <dd><code>=</code> An array or @see:ICollectionView object that
        *                                     contains the items shown on the grid.</dd>
        *   <dt>is-read-only</dt>             <dd><code>@</code> A boolean value indicating whether the user is
        *                                     prevented from editing grid cells by typing into them.</dd>
        *   <dt>merge-manager</dt>            <dd><code>=</code> A @see:MergeManager object that specifies
        *                                     the merged extent of the specified cell.</dd>
        *   <dt>scroll-position</dt>          <dd><code>=</code> A @see:Point that represents the value of the
        *                                     grid's scrollbars.</dd>
        *   <dt>selection</dt>                <dd><code>=</code> A @see:CellRange that represents the
        *                                     currently selected cells.</dd>
        *   <dt>selection-mode</dt>           <dd><code>@</code> A @see:SelectionMode value
        *                                     indicating whether and how the user can select cells.</dd>
        *   <dt>show-groups</dt>              <dd><code>@</code> A boolean value indicating whether to insert group
        *                                     rows to delimit data groups.</dd>
        *   <dt>show-sort</dt>                <dd><code>@</code> A boolean value indicating whether to display sort
        *                                     indicators in the column headers.</dd>
        *   <dt>tree-indent</dt>              <dd><code>@</code> The indentation, in pixels, used to offset row
        *                                     groups of different levels.</dd>
        *   <dt>beginning-edit</dt>           <dd><code>&</code> Handler for the @see:beginningEdit event.</dd>
        *   <dt>cell-edit-ended</dt>          <dd><code>&</code> Handler for the @see:cellEditEnded event.</dd>
        *   <dt>cell-edit-ending</dt>         <dd><code>&</code> Handler for the @see:cellEditEnding event.</dd>
        *   <dt>prepare-cell-for-edit</dt>    <dd><code>&</code> Handler for the @see:prepareCellForEdit event.</dd>
        *   <dt>resizing-column</dt>          <dd><code>&</code> Handler for the @see:resizingColumn event.</dd>
        *   <dt>resized-column</dt>           <dd><code>&</code> Handler for the @see:resizedColumn event.</dd>
        *   <dt>dragged-column</dt>           <dd><code>&</code> Handler for the @see:draggedColumn event.</dd>
        *   <dt>dragging-column</dt>          <dd><code>&</code> Handler for the @see:draggingColumn event.</dd>
        *   <dt>sorted-column</dt>            <dd><code>&</code> Handler for the @see:sortedColumn event.</dd>
        *   <dt>sorting-column</dt>           <dd><code>&</code> Handler for the @see:sortingColumn event.</dd>
        *   <dt>deleting-row</dt>             <dd><code>&</code> Handler for the @see:deletingRow event.</dd>
        *   <dt>dragging-row</dt>             <dd><code>&</code> Handler for the @see:draggingRow event.</dd>
        *   <dt>dragged-row</dt>              <dd><code>&</code> Handler for the @see:draggedRow event.</dd>
        *   <dt>resizing-row</dt>             <dd><code>&</code> Handler for the @see:resizingRow event.</dd>
        *   <dt>resized-row</dt>              <dd><code>&</code> Handler for the @see:resizedRow event.</dd>
        *   <dt>row-added</dt>                <dd><code>&</code> Handler for the @see:rowAdded event.</dd>
        *   <dt>row-edit-ended</dt>           <dd><code>&</code> Handler for the @see:rowEditEnded event.</dd>
        *   <dt>row-edit-ending</dt>          <dd><code>&</code> Handler for the @see:rowEditEnding event.</dd>
        *   <dt>loaded-rows</dt>              <dd><code>&</code> Handler for the @see:loadedRows event.</dd>
        *   <dt>loading-rows</dt>             <dd><code>&</code> Handler for the @see:loadingRows event.</dd>
        *   <dt>group-collapsed-changed</dt>  <dd><code>&</code> Handler for the @see:groupCollapsedChanged event.</dd>
        *   <dt>group-collapsed-changing</dt> <dd><code>&</code> Handler for the @see:groupCollapsedChanging event.</dd>
        *   <dt>items-source-changed</dt>     <dd><code>&</code> Handler for the @see:itemsSourceChanged event.</dd>
        *   <dt>selection-changing</dt>       <dd><code>&</code> Handler for the @see:selectionChanging event.</dd>
        *   <dt>selection-changed</dt>        <dd><code>&</code> Handler for the @see:selectionChanged event.</dd>
        *   <dt>scroll-position-changed</dt>  <dd><code>&</code> Handler for the @see:scrollPositionChanged event.</dd>
        * </dl>
        *
        * The <b>wj-flex-grid</b> directive may contain @see:WjFlexGridColumn child directives.
        */
        var WjFlexGrid = (function (_super) {
            __extends(WjFlexGrid, _super);
            // Initializes a new instance of a WjFlexGrid
            function WjFlexGrid($compile, $interpolate) {
                this._$compile = $compile;
                this._$interpolate = $interpolate;
                var self = this;

                _super.call(this);

                this.transclude = true;
                this.template = '<div ng-transclude />';
            }
            Object.defineProperty(WjFlexGrid.prototype, "_controlConstructor", {
                // Gets the Wijmo FlexGrid control constructor
                get: function () {
                    return wijmo.grid.FlexGrid;
                },
                enumerable: true,
                configurable: true
            });

            WjFlexGrid.prototype._createLink = function () {
                return new WjFlexGridLink();
            };

            // Initializes WjFlexGrid property map
            WjFlexGrid.prototype._initProps = function () {
                angular.MetaFactory.findProp('childItemsPath', this._props).initialize({ scopeBindingMode: '@' });
                angular.MetaFactory.findProp('itemFormatter', this._props).initialize({ customHandler: this._formatterPropHandler.bind(this) });
            };

            // Under 1.1.4+ undefined scope value is updated by processing control's events, as a result of
            // scope- > control transfer.
            // The _wrapperFormatter handler overwrites user's item formatter. This handler tries to retain it.
            WjFlexGrid.prototype._formatterPropHandler = function (scope, control, value, oldValue, link) {
                var name = 'itemFormatter';
                var ctrlVal = control[name], isNew = ctrlVal !== link._wrapperFormatter, isOld = oldValue !== link._wrapperFormatter;
                if (isNew || isOld) {
                    var newUserFormatter = isNew ? ctrlVal : oldValue;
                    link._userFormatter = newUserFormatter;
                    if (isNew) {
                        control[name] = link._wrapperFormatter;
                        if (link._canApply(scope, name)) {
                            scope[name] = link._wrapperFormatter;
                        }
                    }
                }
            };
            return WjFlexGrid;
        })(angular.WjDirective);

        var WjFlexGridLink = (function (_super) {
            __extends(WjFlexGridLink, _super);
            function WjFlexGridLink() {
                _super.apply(this, arguments);
            }
            //override
            WjFlexGridLink.prototype._onChildrenReady = function () {
                // apply column info
                var self = this, control = this.control, scope = this.scope;

                // honor cell templates
                self._userFormatter = control.itemFormatter;
                control.itemFormatter = self._wrapperFormatter = function (panel, rowIndex, colIndex, cell) {
                    // call original formatter if any
                    if (self._userFormatter) {
                        self._userFormatter(panel, rowIndex, colIndex, cell);
                    }

                    // do not format in edit mode
                    var editRange = panel.grid.editRange;
                    if (editRange && editRange.row === rowIndex && editRange.col === colIndex) {
                        return;
                    }

                    // apply directive template and style
                    if (panel.cellType == 1 /* Cell */) {
                        var col = panel.columns[colIndex];
                        var tpl = self._getCellTemplate(col);

                        // apply cell template
                        if (!wijmo.isNullOrWhiteSpace(tpl)) {
                            // Create a new cell scope, as a child of the controller scope, or reuse the one created earlier
                            // for this cell and cached in the cell.__wjCellScope property. In any case initialize the scope with
                            // cell specific properties.
                            var cellScope_ = cell.__wjCellScope;
                            if (!cellScope_) {
                                cellScope_ = cell.__wjCellScope = scope.$parent.$new();
                            }
                            self._initCellScope(cellScope_, panel, rowIndex, colIndex);

                            // Compile column template to get a link function, or reuse the link function got earlier
                            // for this column and cached in the col.__whCellLink property.
                            var cellLink = col.__whCellLink;
                            if (!cellLink) {
                                cellLink = col.__whCellLink = self.directive._$compile(tpl);
                            }

                            // Link the cell template to the cell scope and get a bound DOM subtree to use as the cell content,
                            // or reuse the bound subtree linked earlier and cached in the cell.__wjClonedElement property.
                            // We pass a clone function to the link function to force it to return a clone of the template.
                            var clonedElement = cell.__wjClonedElement;
                            if (!clonedElement) {
                                cell.__wjClonedElement = clonedElement = window['angular'].element('<div>').append(cellLink(cellScope_, function (clonedEl, scope) {
                                }));
                            }

                            // Apply new scope values to the bound cell content subtree. Do it before inserting the subtree to
                            // the cell in order to prevent flickering.
                            if (!cellScope_.$root.$$phase) {
                                cellScope_.$apply();
                            }

                            // Insert the bound content subtree to the cell, after $apply to prevent flickering.
                            cell.innerHTML = '';
                            cell.appendChild(clonedElement[0]);

                            //Enlarge rows height if cell doesn't fit in the current row height.
                            var cellHeight = cell.scrollHeight;
                            if (panel.rows[rowIndex].renderHeight < cellHeight) {
                                panel.rows.defaultSize = cellHeight;
                            }
                        }

                        // apply cell style
                        if (col.cellStyle) {
                            // build cell style object
                            var cellStyle = col.cellStyle, cellScope = self._initCellScope({}, panel, rowIndex, colIndex), style = scope.$parent.$eval(cellStyle, cellScope);

                            // apply style to cell
                            if (style) {
                                for (var key in style) {
                                    cell.style[key] = style[key];
                                }
                            }
                        }
                    }
                };
            };

            // creates, initializes and adds new instance of wijmo.grid.Column according to WjFlexGridColumn DDO
            WjFlexGridLink.prototype._initCellScope = function (scope, panel, rowIndex, columnIndex) {
                scope.$row = panel.rows[rowIndex];
                scope.$col = panel.rows[columnIndex];
                scope.$item = panel.rows[rowIndex].dataItem;
                return scope;
            };

            WjFlexGridLink.prototype._getCellTemplate = function (column) {
                var tpl = column.cellTemplate;
                if (tpl) {
                    tpl = tpl.replace(/ class\=\"ng\-scope\"( \"ng\-binding\")?/g, '');
                    tpl = tpl.replace(/<span>\s*<\/span>/g, '');
                    tpl = tpl.trim();
                }
                return tpl;
            };
            return WjFlexGridLink;
        })(angular.WjLink);

        /**
        * AngularJS directive for the @see:FlexGrid @see:Column object.
        *
        * The <b>wj-flex-grid-column</b> directive must be contained in a @see:WjFlexGrid directive.
        * It supports the following attributes:
        *
        * <dl class="dl-horizontal">
        *   <dt>aggregate</dt>         <dd><code>@</code> The @see:Aggregate object to display in
        *                              the group header rows for this column.</dd>
        *   <dt>align</dt>             <dd><code>@</code> The string value that sets the horizontal
        *                              alignment of items in the column to left, right, or center.</dd>
        *   <dt>allow-dragging</dt>    <dd><code>@</code> The value indicating whether the user can move
        *                              the column to a new position with the mouse.</dd>
        *   <dt>allow-sorting</dt>     <dd><code>@</code> The value indicating whether the user can sort
        *                              the column by clicking its header.</dd>
        *   <dt>allow-resizing</dt>    <dd><code>@</code> The value indicating whether the user can
        *                              resize the column with the mouse.</dd>
        *   <dt>allow-merging</dt>     <dd><code>@</code> The value indicating whether the user can merge
        *                              cells in the column.</dd>
        *   <dt>binding</dt>           <dd><code>@</code> The name of the property to which the column is
        *                              bound.</dd>
        *   <dt>css-class</dt>         <dd><code>@</code> The name of a CSS class to use when
        *                              rendering the column.</dd>
        *   <dt>data-map</dt>          <dd><code>=</code> The @see:DataMap object to use to convert raw
        *                              values into display values for the column.</dd>
        *   <dt>data-type</dt>         <dd><code>@</code> The enumerated @see:DataType value that indicates
        *                              the type of value stored in the column.</dd>
        *   <dt>format</dt>            <dd><code>@</code> The format string to use to convert raw values
        *                              into display values for the column (see @see:Globalize).</dd>
        *   <dt>header</dt>            <dd><code>@</code> The string to display in the column header.</dd>
        *   <dt>input-type</dt>        <dd><code>@</code> The type attribute to specify the input element
        *                              used to edit values in the column. The default is "tel" for numeric
        *                              columns, and "text" for all other non-Boolean columns.</dd>
        *   <dt>is-content-html</dt>   <dd><code>@</code> The value indicating whether cells in the column
        *                              contain HTML content rather than plain text.</dd>
        *   <dt>is-read-only</dt>      <dd><code>@</code> The value indicating whether the user is prevented
        *                              from editing values in the column.</dd>
        *   <dt>is-selected</dt>       <dd><code>@</code> The value indicating whether the column is selected.</dd>
        *   <dt>mask</dt>              <dd><code>@</code> The mask string used to edit values in the
        *                              column.</dd>
        *   <dt>max-width</dt>         <dd><code>@</code> The maximum width for the column.</dd>
        *   <dt>min-width</dt>         <dd><code>@</code> The minimum width for the column.</dd>
        *   <dt>name</dt>              <dd><code>@</code> The column name. You can use it to retrieve the
        *                              column.</dd>
        *   <dt>required</dt>          <dd><code>@</code> The value indicating whether the column must contain
        *                              non-null values.</dd>
        *   <dt>show-drop-down</dt>    <dd><code>@</code> The value indicating whether to show drop-down buttons
        *                              for editing based on the column's @see:DataMap.</dd>
        *   <dt>visible</dt>           <dd><code>@</code> The value indicating whether the column is visible.</dd>
        *   <dt>width</dt>             <dd><code>@</code> The width of the column in pixels or as a
        *                              star value.</dd>
        *   <dt>word-wrap</dt>         <dd><code>@</code> The value indicating whether cells in the column wrap
        *                              their content.</dd>
        * </dl class="dl-horizontal">
        *
        * In addition to regular attributes that match properties in the @see:Column class,
        * wj-flex-grid-column directives may contain an <b>ng-style</b> attribute that provides
        * conditional formatting and an HTML fragment that is used as a cell template. Grid rows
        * automatically stretch vertically to fit custom cell contents.
        *
        * Both the <b>ng-style</b> attribute and the HTML fragment can use the <b>$item</b> property in
        * AngularJS bindings to refer to the item that is bound to the current row. For example:
        *
        * <pre>&lt;wj-flex-grid-column
        *     header="Symbol"
        *     binding="symbol"
        *     read-only="true"
        *     width="*"&gt;
        *   &lt;a href="https://finance.yahoo.com/q?s={&#8203;{$item.symbol}}"&gt;
        *     {&#8203;{$item.symbol}}
        *   &lt;/a&gt;
        * &lt;/wj-flex-grid-column&gt;
        * &lt;wj-flex-grid-column
        *     header="Change"
        *     binding="changePercent"
        *     format="p2"
        *     width="*"
        *     ng-style="{color:getAmountColor($item.change)}"&gt;
        * &lt;/wj-flex-grid-column&gt;</pre>
        *
        * These directives create two columns.
        * The first has a template that produces a hyperlink based on the bound item's <b>symbol</b> property.
        * The second has a conditional style that renders values with a color determined by a function
        * implemented in the controller.
        *
        * @fiddle:5L423
        */
        var WjFlexGridColumn = (function (_super) {
            __extends(WjFlexGridColumn, _super);
            // Initializes a new instance of a WjGridColumn
            function WjFlexGridColumn() {
                _super.call(this);

                // The 'data-map' HTML attribute is converted to 'map' by Angular, so we give it the 'map' alias.
                this.scope["dataMap"] += "map";
                this.scope["dataType"] += "type";

                this.require = '^wjFlexGrid';
                this.transclude = true;
                this.template = '<div class="wjGridColumn" ng-transclude/>';
            }
            Object.defineProperty(WjFlexGridColumn.prototype, "_controlConstructor", {
                get: function () {
                    return wijmo.grid.Column;
                },
                enumerable: true,
                configurable: true
            });

            WjFlexGridColumn.prototype._createLink = function () {
                return new WjFlexGridColumnLink();
            };
            return WjFlexGridColumn;
        })(angular.WjDirective);

        var WjFlexGridColumnLink = (function (_super) {
            __extends(WjFlexGridColumnLink, _super);
            function WjFlexGridColumnLink() {
                _super.apply(this, arguments);
            }
            WjFlexGridColumnLink.prototype._initParent = function () {
                var grid = this.parent.control;
                if (grid.autoGenerateColumns) {
                    grid.autoGenerateColumns = false;
                    this._safeApply(this.scope, 'autoGenerateColumns', false);
                    grid.columns.clear();
                }

                _super.prototype._initParent.call(this);

                // get column template (HTML content)
                var template = this.tElement[0].innerHTML;
                if (!wijmo.isNullOrWhiteSpace(template)) {
                    this.control['cellTemplate'] = template;
                }

                // get column style
                var style = this.tAttrs['ngStyle'];
                if (style) {
                    this.control['cellStyle'] = style;
                }
            };
            return WjFlexGridColumnLink;
        })(angular.WjLink);
    })(wijmo.angular || (wijmo.angular = {}));
    var angular = wijmo.angular;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.grid.js.map

var wijmo;
(function (wijmo) {
    /**
    * Contains AngularJS directives for the Wijmo controls.
    *
    * The directives allow you to add Wijmo controls to
    * <a href="https://angularjs.org/" target="_blank">AngularJS</a>
    * applications using simple markup in HTML pages.
    *
    * You can use directives as regular HTML tags in the page markup. The
    * tag name corresponds to the control name, prefixed with "wj-," and the
    * attributes correspond to the names of control properties and events.
    *
    * All control, property, and event names within directives follow
    * the usual AngularJS convention of replacing camel-casing with hyphenated
    * lower-case names.
    *
    * AngularJS directive parameters come in three flavors, depending on the
    * type of binding they use. The table below describes each one:
    *
    * <dl class="dl-horizontal">
    *   <dt><code>@</code></dt>   <dd>By value, or one-way binding. The attribute
    *                             value is interpreted as a literal.</dd>
    *   <dt><code>=</code></dt>   <dd>By reference, or two-way binding. The
    *                             attribute value is interpreted as an expression.</dd>
    *   <dt><code>&</code></dt>   <dd>Function binding. The attribute value
    *                             is interpreted as a function call, including the parameters.</dd>
    * </dl>
    *
    * For more details on the different binding types, please see <a href=
    * "http://weblogs.asp.net/dwahlin/creating-custom-angularjs-directives-part-2-isolate-scope"
    * target="_blank"> Dan Wahlin's blog on directives</a>.
    *
    * The documentation does not describe directive events because they are identical to
    * the control events, and the binding mode is always the same (function binding).
    *
    * To illustrate, here is the markup used to create a @see:ComboBox control:
    *
    * <pre>&lt;wj-combo-box
    *   text="ctx.theCountry"
    *   items-source="ctx.countries"
    *   is-editable="true"
    *   selected-index-changed="ctx.selChanged(s, e)"&gt;
    *   &lt;/wj-combo-box&gt;</pre>
    *
    * Notice that the <b>text</b> property of the @see:ComboBox is bound to a controller
    * variable called "ctx.theCountry." The binding goes two ways; changes in the control
    * update the scope, and changes in the scope update the control. To
    * initialize the <b>text</b> property with a string constant, enclose
    * the attribute value in single quotes (for example, <code>text="'constant'"</code>).
    *
    * Notice also that the <b>selected-index-changed</b> event is bound to a controller
    * method called "selChanged," and that the binding includes the two event parameters
    * (without the parameters, the method is not called).
    * Whenever the control raises the event, the directive invokes the controller method.
    */
    (function (angular) {
        // define the wijmo module with all dependencies
        var wijModule = window['angular'].module('wj', ['wj.input', 'wj.grid', 'wj.chart', 'wj.container', 'wj.gauge']);
    })(wijmo.angular || (wijmo.angular = {}));
    var angular = wijmo.angular;
})(wijmo || (wijmo = {}));
//# sourceMappingURL=wijmo.angular.all.js.map

