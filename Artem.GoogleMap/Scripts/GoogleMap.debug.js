﻿/// <reference name="MicrosoftAjax.js"/>
// --------------------------------------------------------------------------------
// Copyright (C) ArtemBG. All rights reserved.
// --------------------------------------------------------------------------------
// GoogleMap.js
// GoogleMap control (http://http://www.codeplex.com/googlemap) javascipt library.
// Author: Velio Ivanov velio@artembg.com
//
// namespace Artem.Web
// 
if(!Artem) var Artem = {};
if(!Artem.Web) Artem.Web = {};
//
// Delegate
// 
Artem.Web.Delegate = {
    create: function(instance, method) {
        return function() { return method.apply(instance, arguments); };
    },
    createFromString: function(instance, methodString) {
        var rex = new RegExp("\\(.*\\)");
        if(rex.test(methodString))
            return function() { eval(methodString); };
        else {
            var method = eval(methodString);
            return function() { return method.apply(instance, arguments); };
        }
    }
};
//
// GoogleMapManager
//
Artem.Web.GoogleMapManager = {
    // fields
    _disposed: false,
    Maps : new Array(),
    Geocoder : new GClientGeocoder(),
    // methods
    addMap: function(map) {
        Artem.Web.GoogleMapManager.Maps[map._elementId] = map;
    },
    dispose: function() {
        if(!Artem.Web.GoogleMapManager._disposed) {
            GUnload();
            Artem.Web.GoogleMapManager._disposed = true;
        }
    },
    initialize: function() {
        if (GBrowserIsCompatible()) {
            Artem.Web.GoogleMapManager._disposed = false;
            document.body.onunload = Artem.Web.GoogleMapManager.dispose;
        }
    }
};
//
// GoogleMapView
//
Artem.Web.GoogleMapView = {
    Normal: 0,
    Satellite: 1,
    Hybrid: 2,
    Physical: 3,
    MoonElevation: 4,
    MoonVisible: 5,
    MarsElevation: 6,
    MarsVisible: 7,
    MarsInfrared: 8,
    SkyVisible: 9
};
//
// GoogleMapView
//
Artem.Web.OpenInfoBehaviour = {
    None: 0,
    Click: 1,
    DoubleClick: 2,
    MouseDown: 3,
    MouseOut: 4,
    MouseOver: 5,
    MouseUp: 6
};
//
// GoogleMap
//
Artem.Web.GoogleMap = function(elementId, config) {
    // fields
    this._config = config;
    this._elementId = elementId;
    this._gmap = null;
    this._gmarkers = null;
    this._gdirections = null;
    this._gpolylines = null;
    this._gpolygons = null;
    this._index = 0;
    this._markerManager;
    //
    Artem.Web.GoogleMapManager.addMap(this);
};
Artem.Web.GoogleMap.prototype = {
    // properties
    get_Center: function() {
        return new GLatLng(this._config.lat, this._config.lng);
    },
    get_Element: function() {
        return document.getElementById(this._elementId);
    },
    get_ElementId: function() {
        return this._elementId;
    },
    get_GMap: function() {
        return this._gmap;
    },
    get_MarkerManager: function() {
        return this._markerManager;
    },
    get_Options: function() {
        return this._config;
    },
    // methods
    addMarker: function(config) {
        if(!this._gmarkers) this._gmarkers = new Array();
        this._gmarkers[this._gmarkers.length] = config;
    },
    addDirection: function(config) {
        if(!this._gdirections) this._gdirections = new Array();
        this._gdirections[this._gdirections.length] = config;
    },
    addPolyline: function(config) {
        if(!this._gpolylines) this._gpolylines = new Array();
        this._gpolylines[this._gpolylines.length] = config;
    },
    addPolygon: function(config) {
        if(!this._gpolygons) this._gpolygons = new Array();
        this._gpolygons[this._gpolygons.length] = config;
    },
    createIcon: function(options) {
        var icon = null;
        if(options.image) {
            icon = new GIcon(G_DEFAULT_ICON);
            icon.image = options.image;
            if(options.imageWidth && options.imageHeight) 
                icon.iconSize = new GSize(options.imageWidth, options.imageHeight);
            if(options.shadow)
                icon.shadow = options.shadow;
            if(options.shadowWidth && options.shadowHeight) 
                icon.shadowSize = new GSize(options.shadowWidth, options.shadowHeight);
        }
        return icon;
    },
    load: function() {
        if (GBrowserIsCompatible()) {
            var mapOptions;
            if(this._config.width && this._config.height)
                mapOptions = {size: new GSize(this._config.width, this._config.height)};
            // create
            this._gmap = new GMap2(this.get_Element(), mapOptions); 
            if(this._gmap) {
                //  
                if(this._config.zoomPanType && this._config.zoomPanType == 1) 
                    this._gmap.addControl(new GLargeMapControl());
                else
                    this._gmap.addControl(new GSmallMapControl());
                if(this._config.typeControl)                        
                    this._gmap.addControl(new GMapTypeControl());
                if(this._config.baseCountryCode)
                    Artem.Web.GoogleMapManager.Geocoder.setBaseCountryCode(this._config.baseCountryCode);    
                if(this._config.enableGoogleBar)
                    this._gmap.enableGoogleBar();
                if(this._config.enableScrollWheelZoom)
                    this._gmap.enableScrollWheelZoom();
                if(this._config.enableMarkerManager)
                    this._markerManager = new MarkerManager(this._gmap);
                if(this._config.traffic)
                    this._gmap.addOverlay(new GTrafficOverlay());
                // setup
                if(this._config.address) {
                    Artem.Web.GoogleMapManager.Geocoder.getLatLng(
                        this._config.address, Artem.Web.Delegate.create(this, this.setup));
                }
                else 
                    this.setup(new GLatLng(this._config.lat, this._config.lng)); 
            }
        }
    },
    loadStatic: function() {
        if(this._config) {
            if(this._config.address) {
                Artem.Web.GoogleMapManager.Geocoder.getLatLng(
                    this._config.address, Artem.Web.Delegate.create(this, this.setupStaticMap));
            }
            else 
                this.setupStaticMap(new GLatLng(this._config.lat, this._config.lng)); 
        }
    },
    setup: function(point) {
        // TODO plug static map here
        this._gmap.setCenter(point, this._config.zoom);
        if(this._config.text)
            this._gmap.openInfoWindow(point, this._config.text);
        // persist point for post back
        if(this._config.field) {
            var field = document.getElementById(this._config.field);
            if(field) {
                field.value = point.lat() + ";" + point.lng();
            }
        }
        // attach events
        if(this._config.events) {
            var handler;
            var config = this._config;
            // click
            if(config.events.click)
                GEvent.addListener(this._gmap, "click", 
                    Artem.Web.Delegate.createFromString(this, config.events.click));
            // double click
            if(config.events.dblclick) 
                GEvent.addListener(this._gmap, "dblclick", 
                    Artem.Web.Delegate.createFromString(this, config.events.dblclick));
            // drag
            if(config.events.drag) 
                GEvent.addListener(this._gmap, "drag", 
                    Artem.Web.Delegate.createFromString(this, config.events.drag));
            // drag end
            if(config.events.dragend) 
                GEvent.addListener(this._gmap, "dragend", 
                    Artem.Web.Delegate.createFromString(this, config.events.dragend));
            // drag start
            if(config.events.dragstart)
                GEvent.addListener(this._gmap, "dragstart", 
                    Artem.Web.Delegate.createFromString(this, config.events.dragstart));
            // geo load
            if(config.events.geoload && config.field) {
                if(config.events.geoload.match("__doPostBack"))
                    handler = function(lat, lng) { eval(config.events.geoload); };
                else 
                    handler = function(lat, lng) { eval(config.events.geoload).call(this, lat, lng); };
                handler(point.lat(), point.lng());
            } 
            // info window before close
            if(config.events.infowindowbeforeclose) 
                GEvent.addListener(this._gmap, "infowindowbeforeclose", 
                    Artem.Web.Delegate.createFromString(this, config.events.infowindowbeforeclose));
            // info window close
            if(config.events.infowindowclose) 
                GEvent.addListener(this._gmap, "infowindowclose", 
                    Artem.Web.Delegate.createFromString(this, config.events.infowindowclose));
            // info window open
            if(config.events.infowindowopen) 
                GEvent.addListener(this._gmap, "infowindowopen", 
                    Artem.Web.Delegate.createFromString(this, config.events.infowindowopen));
            // load
            if(config.events.load) 
                GEvent.addListener(this._gmap, "load", 
                    Artem.Web.Delegate.createFromString(this, config.events.load));
            // add map type
            if(config.events.addmaptype) 
                GEvent.addListener(this._gmap, "addmaptype", 
                    Artem.Web.Delegate.createFromString(this, config.events.addmaptype));
            // map type changed
            if(config.events.maptypechanged) 
                GEvent.addListener(this._gmap, "maptypechanged", 
                    Artem.Web.Delegate.createFromString(this, config.events.maptypechanged));
            // remove map type
            if(config.events.removemaptype) 
                GEvent.addListener(this._gmap, "removemaptype", 
                    Artem.Web.Delegate.createFromString(this, config.events.removemaptype));
            // mouse move
            if(config.events.mousemove) 
                GEvent.addListener(this._gmap, "mousemove", 
                    Artem.Web.Delegate.createFromString(this, config.events.mousemove));
            // mouse out
            if(config.events.mouseout) 
                GEvent.addListener(this._gmap, "mouseout", 
                    Artem.Web.Delegate.createFromString(this, config.events.mouseout));
            // mouse over
            if(config.events.mouseover) 
                GEvent.addListener(this._gmap, "mouseover", 
                    Artem.Web.Delegate.createFromString(this, config.events.mouseover));
            // move
            if(config.events.move) 
                GEvent.addListener(this._gmap, "move", 
                    Artem.Web.Delegate.createFromString(this, config.events.move));
            // move end
            if(config.events.moveend) 
                GEvent.addListener(this._gmap, "moveend", 
                    Artem.Web.Delegate.createFromString(this, config.events.moveend));
            // move start
            if(config.events.movestart) 
                GEvent.addListener(this._gmap, "movestart", 
                    Artem.Web.Delegate.createFromString(this, config.events.movestart));
            // add overlay
            if(config.events.addoverlay) 
                GEvent.addListener(this._gmap, "addoverlay", 
                    Artem.Web.Delegate.createFromString(this, config.events.addoverlay));
            // remove overlay
            if(config.events.removeoverlay) 
                GEvent.addListener(this._gmap, "removeoverlay", 
                    Artem.Web.Delegate.createFromString(this, config.events.removeoverlay));
            // clear overlays
            if(config.events.clearoverlays) 
                GEvent.addListener(this._gmap, "clearoverlays", 
                    Artem.Web.Delegate.createFromString(this, config.events.clearoverlays));
            // single right click
            if(config.events.singlerightclick) 
                GEvent.addListener(this._gmap, "singlerightclick", 
                    Artem.Web.Delegate.createFromString(this, config.events.singlerightclick));
             // zoom end
            if(config.events.zoomend) 
                GEvent.addListener(this._gmap, "zoomend", 
                    Artem.Web.Delegate.createFromString(this, config.events.zoomend));
        }
        //
        this.setupMapView();
    },
    setupMapView: function() {
        // set view
        if(this._config.view) {
            switch(this._config.view) {
                case Artem.Web.GoogleMapView.Normal:
                    this._gmap.setMapType(G_NORMAL_MAP);
                    break;
                case Artem.Web.GoogleMapView.Satellite:
                    this._gmap.setMapType(G_SATELLITE_MAP);
                    break;
                case Artem.Web.GoogleMapView.Hybrid:
                    this._gmap.setMapType(G_HYBRID_MAP);
                    break;
                case Artem.Web.GoogleMapView.Physical:
                    this._gmap.addMapType(G_PHYSICAL_MAP);
                    this._gmap.setMapType(G_PHYSICAL_MAP);
                    break;
                case Artem.Web.GoogleMapView.MoonElevation:
                    this._gmap.addMapType(G_MOON_ELEVATION_MAP);
                    this._gmap.setMapType(G_MOON_ELEVATION_MAP);
                    break;
                case Artem.Web.GoogleMapView.MoonVisible:
                    this._gmap.addMapType(G_MOON_VISIBLE_MAP);
                    this._gmap.setMapType(G_MOON_VISIBLE_MAP);
                    break;
                case Artem.Web.GoogleMapView.MarsElevation:
                    this._gmap.addMapType(G_MARS_ELEVATION_MAP);
                    this._gmap.setMapType(G_MARS_ELEVATION_MAP);
                    break;
                case Artem.Web.GoogleMapView.MarsVisible:
                    this._gmap.addMapType(G_MARS_VISIBLE_MAP);
                    this._gmap.setMapType(G_MARS_VISIBLE_MAP);
                    break;
                case Artem.Web.GoogleMapView.MarsInfrared:
                    this._gmap.addMapType(G_MARS_INFRARED_MAP);
                    this._gmap.setMapType(G_MARS_INFRARED_MAP);
                    break;
                case Artem.Web.GoogleMapView.SkyVisible:
                    this._gmap.addMapType(G_SKY_VISIBLE_MAP);
                    this._gmap.setMapType(G_SKY_VISIBLE_MAP);
                    break;
            }
        }  
        //
        this.setupMarkers();
    },
    setupMarkers: function() {
        this.setupMarker(this._index = 0);
    },
    setupMarker: function(index) {
        if(this._gmarkers && this._gmarkers[index]) {
            var config = this._gmarkers[index];
            if(config.address) {
                try {
                    var map = this;
                    Artem.Web.GoogleMapManager.Geocoder.getLatLng(
                        config.address, 
                        function(point) { map.setupMarkerItem(point); });
                }
                catch(ex){
                    this.setupMarker(++this._index);
                }
            }
            else
                this.setupMarkerItem(new GLatLng(config.lat, config.lng));
        }
        else
            this.setupDirections();
    },
    setupMarkerItem: function(point) {
        try {
            var config = this._gmarkers[this._index];
            var markerOptions = {draggable: config.draggable, icon: null};
            markerOptions.icon = this.createIcon(config);
            var marker = new GMarker(point, markerOptions);
            // persist geo point for post back
            if(config.field) {
                var field = document.getElementById(config.field);
                if(field) {
                    field.value = point.lat() + ";" + point.lng();
                }
                
            }
            if(marker) {
                var eventName = "click";
                if(!config.events || !config.events.click) {
                    switch(config.infoWindowEvent) {
                        case Artem.Web.OpenInfoBehaviour.Click:
                            eventName = "click";
                            break;
                        case Artem.Web.OpenInfoBehaviour.DoubleClick:
                            eventName = "dblclick";
                            break;
                        case Artem.Web.OpenInfoBehaviour.MouseDown:
                            eventName = "mousedown";
                            break;
                        case Artem.Web.OpenInfoBehaviour.MouseOut:
                            eventName = "mouseout";
                            break;
                        case Artem.Web.OpenInfoBehaviour.MouseOver:
                            eventName = "mouseover";
                            break;
                        case Artem.Web.OpenInfoBehaviour.MouseUp:
                            eventName = "mouseup";
                            break;
                    }
                         
                }
                this.setupMarkerEvents(marker, config, point);
                this._gmap.addOverlay(marker);
            }
        }
        catch(ex) { }
        this.setupMarker(++this._index);
    },
    setupMarkerEvents: function(marker, config, point) {
        // atach events
        if(config.events) {         
            var handler;
            // click
            if(config.events.click) 
                GEvent.addListener(marker, "click", 
                    Artem.Web.Delegate.createFromString(this, config.events.click));
            // double click
            if(config.events.dblclick) 
                GEvent.addListener(marker, "dblclick", 
                    Artem.Web.Delegate.createFromString(this, config.events.dblclick));
            // drag
            if(config.events.drag) 
                GEvent.addListener(marker, "drag", 
                    Artem.Web.Delegate.createFromString(this, config.events.drag));
            // drag end
            if(config.events.dragend) 
                GEvent.addListener(marker, "dragend", 
                    Artem.Web.Delegate.createFromString(this, config.events.dragend));
            // drag start
            if(config.events.dragstart) 
                GEvent.addListener(marker, "dragstart", 
                    Artem.Web.Delegate.createFromString(this, config.events.dragstart));
            // geo load
            if(config.events.geoload && config.field) {
                if(config.events.geoload.match("__doPostBack"))
                    handler = function(point) { eval(config.events.geoload); };
                else 
                    handler = function(point) { eval(config.events.geoload).call(this, point); };
                handler(point);
            } 
            // info window before close
            if(config.events.infowindowbeforeclose) 
                GEvent.addListener(marker, "infowindowbeforeclose", 
                    Artem.Web.Delegate.createFromString(this, config.events.infowindowbeforeclose));
            // info window close
            if(config.events.infowindowclose) 
                GEvent.addListener(marker, "infowindowclose", 
                    Artem.Web.Delegate.createFromString(this, config.events.infowindowclose));
            // info window open
            if(config.events.infowindowopen) 
                GEvent.addListener(marker, "infowindowopen", 
                    Artem.Web.Delegate.createFromString(this, config.events.infowindowopen));
            // mouse down
            if(config.events.mousedown) 
                GEvent.addListener(marker, "mousedown", 
                    Artem.Web.Delegate.createFromString(this, config.events.mousedown));
            // mouse out
            if(config.events.mouseout) 
                GEvent.addListener(marker, "mouseout", 
                    Artem.Web.Delegate.createFromString(this, config.events.mouseout));
            // mouse over
            if(config.events.mouseover) 
                GEvent.addListener(marker, "mouseover", 
                    Artem.Web.Delegate.createFromString(this, config.events.mouseover));
            // mouse up
            if(config.events.mouseup) 
                GEvent.addListener(marker, "mouseup", 
                    Artem.Web.Delegate.createFromString(this, config.events.mouseup));
            // remove
            if(config.events.remove) 
                GEvent.addListener(marker, "remove", 
                    Artem.Web.Delegate.createFromString(this, config.events.remove));
            // visibility changed
            if(config.events.visibilitychanged) 
                GEvent.addListener(marker, "visibilitychanged", 
                    Artem.Web.Delegate.createFromString(this, config.events.visibilitychanged));
        }
    },
    setupDirections: function() {
        if(this._gdirections) {
            var i, config;
            for(i = 0; i < this._gdirections.length; i ++) {
                try {
                    config = this._gdirections[i];
                    var directionsPanel = document.getElementById(config.routePanelId);
                    var directions = new GDirections(this._gmap, directionsPanel);
                    var options = {locale: config.locale};
                    if(config.locale)
                        directions.load(config.text, options);
                    else
                        directions.load(config.text);
                }
                catch(ex){}
            }
        }
        this.setupPolylines();
    },
    setupPolylines: function() {
        if(this._gpolylines) {
            var i;
            for(i = 0; i < this._gpolylines.length; i++) {
                this._gmap.addOverlay(this._gpolylines[i]);
            }
        }
        this.setupPolygons();
    },
    setupPolygons: function() {
        if(this._gpolygons) {
            var i;
            for(i = 0; i < this._gpolygons.length; i++) {
                try {
                    this._gmap.addOverlay(this._gpolygons[i]);
                }
                catch(ex) { }
            }
        }
    },
    setupStaticMap: function(point) {
        this._config.lat = point.lat();
        this._config.lng = point.lng();
        this._index = 0;
        this.setupStaticGeoLocation();
    },
    setupStaticGeoLocation: function() {
        var m = this._gmarkers[this._index];
        if(m) {
            if(m.address) {
                var handler = function(mp) {
                    this._gmarkers[this._index].lat = mp.lat();
                    this._gmarkers[this._index].lng = mp.lng();
                    this._index ++;
                    this.setupStaticGeoLocation();
                };
                Artem.Web.GoogleMapManager.Geocoder.getLatLng(m.address, 
                    Artem.Web.Delegate.create(this, handler));
            }
            else {
                this._index ++;
                this.setupStaticGeoLocation();
            }
        }
        else
            this.setupStaticImage();
    },
    setupStaticImage: function() {
        var el = this.get_Element();
        var config = this._config;
        //
        var width = 512;
        if(config.width && config.width < 512) width = config.width;
        var height = 512;
        if(config.height && config.height < 512) height = config.height;
        //
        var src = "http://maps.google.com/staticmap?";
        src += "center=" + config.lat + "," + config.lng + "&";
        src += "zoom=" + config.zoom + "&";
        src += "size=" + width + "x" + height + "&";
        src += "key=" + config.key;
        // markers
        var markers = this._gmarkers;
        if(markers) {
            var i;
            src += "&markers=";
            for(i = 0; i < markers.length; i ++) 
                src += markers[i].lat + "," + markers[i].lng + "|";
        }
        // 
        var img = document.createElement("img");
        img.src = src;
        el.appendChild(img);
    }
};