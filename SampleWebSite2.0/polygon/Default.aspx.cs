﻿using System;
using System.Collections;
using System.Configuration;
using System.Data;
using System.Drawing;
using System.Web;
using System.Web.Security;
using System.Web.UI;
using System.Web.UI.HtmlControls;
using System.Web.UI.WebControls;
using System.Web.UI.WebControls.WebParts;
using Artem.Web.UI.Controls;

public partial class polygon_GooglePolygon : Artem.GoogleMap.WebSite.UI.PageBase {

    #region Methods /////////////////////////////////////////////////////////////////

    protected void HandleDrawClick(object sender, EventArgs e) {

        string value = this.Request["__points"];
        if (!string.IsNullOrEmpty(value)) {
            GooglePolygon gon = new GooglePolygon();
            gon.FillColor = Color.Red;
            gon.FillOpacity = .8F;
            gon.StrokeColor = Color.Blue;
            gon.StrokeWeight = 2;
            string[] points = value.Split(';');
            GoogleLocation startPoint = null;
            foreach (string point in points) {
                if (startPoint != null)
                    gon.Points.Add(GoogleLocation.Parse(point));
                else
                    gon.Points.Add(startPoint = GoogleLocation.Parse(point));
            }
            gon.Points.Add(startPoint);
            GoogleMap1.Polygons.Clear();
            GoogleMap1.Polygons.Add(gon);
        }
    }

    protected void HandleShowExtraDataClick(object sender, EventArgs e) {

        if (GoogleMap1.Polygons.Count > 0) {
            GooglePolygon gon = GoogleMap1.Polygons[0];
            _ltrInfo.Text = string.Format("Bounds: {0}", gon.Bounds.ToString());
        }
    }
    #endregion
}
