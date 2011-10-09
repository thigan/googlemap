﻿<%@ Page Title="" Language="C#" MasterPageFile="~/demo/polylines/Master.master" AutoEventWireup="false" Inherits="Artem.Google.Web.Demo.Polylines.EnableEditingPage" Codebehind="EnableEditing.aspx.cs" %>

<asp:Content ContentPlaceHolderID="head" runat="server">
    <title>GooglePolyline - EnableEditing</title>
    <meta name="description" content="GoogleMap Control - GooglePolyline EnableEditing sample." />
    <meta name="keywords" content="asp.net artem googlemap control polyline enable editing" />
</asp:Content>
<asp:Content ContentPlaceHolderID="main" ID="mainContent" runat="Server">
    <h1>
        GooglePolyline - Enable Editing</h1>
    <p>
        Click on the map below to build points of the polyline<br />
        Then click to button 'Draw' to draw it.</p>
    <artem:GoogleMap ID="GoogleMap1" runat="server" Width="640px" Height="600px" Latitude="42.1229"
        Longitude="24.7879" Zoom="4" EnableScrollWheelZoom="true">
        <Polylines>
            <artem:GooglePolyline Color="Blue" Weight="2" Opacity="1" IsGeodesic="false" EnableEditing="true"
                EditingFromStart="false" EditingMaxVertices="35">
                <artem:GoogleLocation Latitude="42.1229" Longitude="24.7879" />
                <artem:GoogleLocation Latitude="51.34433" Longitude="16.17578" />
                <artem:GoogleLocation Latitude="41.70572" Longitude="12.39257" />
            </artem:GooglePolyline>
        </Polylines>
    </artem:GoogleMap>
</asp:Content>
