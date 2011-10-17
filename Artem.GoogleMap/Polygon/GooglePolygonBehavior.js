﻿///<reference name="MicrosoftAjax.debug.js"/>
///<reference path="..\Scripts\GoogleCommons.js"/>
///<reference path="..\Scripts\GoogleMap.js"/>
///<reference path="http://maps.googleapis.com/maps/api/js?sensor=false"/>

Type.registerNamespace("Artem.Google");

Artem.Google.PolygonBehavior = function (element) {
    Artem.Google.PolygonBehavior.initializeBase(this, [element]);
};

Artem.Google.PolygonBehavior.prototype = {
    initialize: function () {
        Artem.Google.PolygonBehavior.callBaseMethod(this, 'initialize');
        this.create();
    },
    dispose: function () {
        this.detachEvents();
        Artem.Google.PolygonBehavior.callBaseMethod(this, 'dispose');
    }
};

// members
(function (proto) {

    // Google properties

    var map;
    proto.get_map = function () { return map; };

    var polygon
    proto.get_polygon = function () { return polygon; };

    // properties

    var clickable;
    proto.get_clickable = function () { return clickable; };
    proto.set_clickable = function (value) { clickable = value; };

    var fillColor;
    proto.get_fillColor = function () { return fillColor; };
    proto.set_fillColor = function (value) { fillColor = value; };

    var fillOpacity;
    proto.get_fillOpacity = function () { return fillOpacity; };
    proto.set_fillOpacity = function (value) { fillOpacity = value; };

    var geodesic;
    proto.get_geodesic = function () { return geodesic; };
    proto.set_geodesic = function (value) { geodesic = value; };

    var name;
    proto.get_name = function () { return name; };
    proto.set_name = function (value) { name = value; };

    var paths;
    proto.get_paths = function () { return paths; };
    proto.set_paths = function (value) { paths = value; };

    var strokeColor;
    proto.get_strokeColor = function () { return strokeColor; };
    proto.set_strokeColor = function (value) { strokeColor = value; };

    var strokeOpacity;
    proto.get_strokeOpacity = function () { return strokeOpacity; };
    proto.set_strokeOpacity = function (value) { strokeOpacity = value; };

    var strokeWeight;
    proto.get_strokeWeight = function () { return strokeWeight; };
    proto.set_strokeWeight = function (value) { strokeWeight = value; };

    var zIndex;
    proto.get_zIndex = function () { return zIndex; };
    proto.set_zIndex = function (value) { zIndex = value; };

    // methods

    proto.create = function () {
        map = $find(this.get_element().id);

        var points = Artem.Google.Converter.latlngArray(paths);
        var options = {
            clickable: clickable,
            fillColor: fillColor,
            fillOpacity: fillOpacity,
            geodesic: geodesic,
            map: map.get_map(),
            paths: points,
            strokeColor: strokeColor,
            strokeOpacity: strokeOpacity,
            strokeWeight: strokeWeight,
            zIndex: zIndex
        };

        polygon = new google.maps.Polygon(options);
        this.composeEvents();
    };

    // GoogleMaps API

    proto.getMap = function () {
        ///<summary>Returns the map on which this poly is attached.</summary>
        return polygon.getMap();
    };

    proto.getPath = function () {
        ///<summary>Retrieves the first path.</summary>        
        return polygon.getPath();
    };

    proto.getPaths = function () {
        ///<summary>Retrieves the paths for this Polygon.</summary>
        return polygon.getPaths()
    };

    proto.setMap = function (map) {
        ///<summary>Renders this Polyline or Polygon on the specified map. If map is set to null, the Poly will be removed.</summary>
        polygon.setMap(map);
    };

    proto.setOptions = function (options) {
        ///<summary></summary>
        polygon.setOptions(options);
    };

    proto.setPath = function (path) {
        ///<summary>Sets the first path. See PolylineOptions for more details.</summary>
        polygon.setPath(path);
    };

    proto.setPaths = function (paths) {
        ///<summary>Sets the path for this Polygon.</summary>
        polygon.setPaths(paths);
    };

})(Artem.Google.PolygonBehavior.prototype);

// events
(function (proto) {

    // fields
    var delegates = {
        "click": null,
        "dblclick": null,
        "mousedown": null,
        "mousemove": null,
        "mouseout": null,
        "mouseover": null,
        "mouseup": null,
        "rightclick": null
    };
    var handlers = {
        "click": raiseClick,
        "dblclick": raiseDoubleClick,
        "mousedown": raiseMouseDown,
        "mousemove": raiseMouseMove,
        "mouseout": raiseMouseOut,
        "mouseover": raiseMouseOver,
        "mouseup": raiseMouseUp,
        "rightclick": raiseRightClick
    };
    var listeners = {
        "click": null,
        "dblclick": null,
        "mousedown": null,
        "mousemove": null,
        "mouseout": null,
        "mouseover": null,
        "mouseup": null,
        "rightclick": null
    };

    // utility

    proto.composeEvents = function () {

        var polygon = this.get_polygon();
        if (polygon) {
            var handler;
            for (var name in handlers) {
                handler = this.get_events().getHandler(name);
                if (handler) {
                    if (!listeners[name]) {
                        if (!delegates[name]) delegates[name] = Function.createDelegate(this, handlers[name]);
                        listeners[name] = google.maps.event.addListener(polygon, name, delegates[name]);
                    }
                }
                else if (listeners[name]) {
                    google.maps.event.removeListener(listeners[name]);
                }
            }
        }
    };

    proto.detachEvents = function () {
        google.maps.event.clearInstanceListeners(this.get_polygon());
    };

    // click
    proto.add_click = function (handler) {
        this.get_events().addHandler("click", handler);
        this.composeEvents();
    };
    proto.remove_click = function (handler) {
        this.get_events().removeHandler("click", handler);
        this.composeEvents();
    };
    function raiseClick(e) {
        var handler = this.get_events().getHandler("click");
        if (handler) handler(this, e);
    }

    // double click
    proto.add_doubleClick = function (handler) {
        this.get_events().addHandler("dblclick", handler);
        this.composeEvents();
    };
    proto.remove_doubleClick = function (handler) {
        this.get_events().removeHandler("dblclick", handler);
        this.composeEvents();
    };
    function raiseDoubleClick(e) {
        var handler = this.get_events().getHandler("dblclick");
        if (handler) handler(this, e);
    }

    // mouse down
    proto.add_mouseDown = function (handler) {
        this.get_events().addHandler("mousedown", handler);
        this.composeEvents();
    };
    proto.remove_mouseDown = function (handler) {
        this.get_events().removeHandler("mousedown", handler);
        this.composeEvents();
    };
    function raiseMouseDown(e) {
        var handler = this.get_events().getHandler("mousedown");
        if (handler) handler(this, e);
    }

    // mouse move
    proto.add_mouseMove = function (handler) {
        this.get_events().addHandler("mousemove", handler);
        this.composeEvents();
    };
    proto.remove_mouseMove = function (handler) {
        this.get_events().removeHandler("mousemove", handler);
        this.composeEvents();
    };
    function raiseMouseMove(e) {
        var handler = this.get_events().getHandler("mousemove");
        if (handler) handler(this, e);
    }

    // mouse out
    proto.add_mouseOut = function (handler) {
        this.get_events().addHandler("mouseout", handler);
        this.composeEvents();
    };
    proto.remove_mouseOut = function (handler) {
        this.get_events().removeHandler("mouseout", handler);
        this.composeEvents();
    };
    function raiseMouseOut(e) {
        var handler = this.get_events().getHandler("mouseout");
        if (handler) handler(this, e);
    }

    // mouse over
    proto.add_mouseOver = function (handler) {
        this.get_events().addHandler("mouseover", handler);
        this.composeEvents();
    };
    proto.remove_mouseOver = function (handler) {
        this.get_events().removeHandler("mouseover", handler);
        this.composeEvents();
    };
    function raiseMouseOver(e) {
        var handler = this.get_events().getHandler("mouseover");
        if (handler) handler(this, e);
    }

    // mouse up
    proto.add_mouseUp = function (handler) {
        this.get_events().addHandler("mouseup", handler);
        this.composeEvents();
    };
    proto.remove_mouseUp = function (handler) {
        this.get_events().removeHandler("mouseup", handler);
        this.composeEvents();
    };
    function raiseMouseUp(e) {
        var handler = this.get_events().getHandler("mouseup");
        if (handler) handler(this, e);
    }

    // mouse right
    proto.add_rightClick = function (handler) {
        this.get_events().addHandler("rightclick", handler);
        this.composeEvents();
    };
    proto.remove_rightClick = function (handler) {
        this.get_events().removeHandler("rightclick", handler);
        this.composeEvents();
    };
    function raiseRightClick(e) {
        var handler = this.get_events().getHandler("rightclick");
        if (handler) handler(this, e);
    }

})(Artem.Google.PolygonBehavior.prototype);

// server events - entry points
(function (behavior) {

    function raiseServerEvent(target, args) {
        __doPostBack(target, Sys.Serialization.JavaScriptSerializer.serialize(args));
    }

    behavior.raiseServerClick = function (sender, e) {
        ///<summary>An entry point handler to fire server click event post back.</summary>
        raiseServerEvent(
            sender.get_name(),
            { lat: e.latLng.lat(), lng: e.latLng.lng(), name: "click" });
    };

    behavior.raiseServerDoubleClick = function (sender, e) {
        ///<summary>An entry point handler to fire server double click event post back.</summary>
        raiseServerEvent(
            sender.get_name(),
            { lat: e.latLng.lat(), lng: e.latLng.lng(), name: "doubleClick" });
    };

    behavior.raiseServerMouseDown = function (sender, e) {
        ///<summary>An entry point handler to fire server mouse down event post back.</summary>
        raiseServerEvent(
            sender.get_name(),
            { lat: e.latLng.lat(), lng: e.latLng.lng(), name: "mouseDown" });
    };

    behavior.raiseServerMouseMove = function (sender, e) {
        ///<summary>An entry point handler to fire server mouse move event post back.</summary>
        raiseServerEvent(
            sender.get_name(),
            { lat: e.latLng.lat(), lng: e.latLng.lng(), name: "mouseMove" });
    };

    behavior.raiseServerMouseOut = function (sender, e) {
        ///<summary>An entry point handler to fire server mouse out event post back.</summary>
        raiseServerEvent(
            sender.get_name(),
            { lat: e.latLng.lat(), lng: e.latLng.lng(), name: "mouseOut" });
    };

    behavior.raiseServerMouseOver = function (sender, e) {
        ///<summary>An entry point handler to fire server mouse over event post back.</summary>
        raiseServerEvent(
            sender.get_name(),
            { lat: e.latLng.lat(), lng: e.latLng.lng(), name: "mouseOver" });
    };

    behavior.raiseServerMouseUp = function (sender, e) {
        ///<summary>An entry point handler to fire server mouse up event post back.</summary>
        raiseServerEvent(
            sender.get_name(),
            { lat: e.latLng.lat(), lng: e.latLng.lng(), name: "mouseUp" });
    };

    behavior.raiseServerRightClick = function (sender, e) {
        ///<summary>An entry point handler to fire server right click event post back.</summary>
        raiseServerEvent(
            sender.get_name(),
            { lat: e.latLng.lat(), lng: e.latLng.lng(), name: "rightClick" });
    };

})(Artem.Google.PolygonBehavior);

Artem.Google.PolygonBehavior.registerClass('Artem.Google.PolygonBehavior', Sys.UI.Behavior);
