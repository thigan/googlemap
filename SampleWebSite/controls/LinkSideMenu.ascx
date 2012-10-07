﻿<%@ Control Language="C#" AutoEventWireup="false" CodeFile="LinkSideMenu.ascx.cs" Inherits="controls_LinkSideMenu" %>
<%@ OutputCache Duration="1800" VaryByParam="none" %>
<div class="sidebar_box">
    <h3 style="margin-bottom: 5px;">
        Links</h3>
    <asp:Repeater ID="_rptLinks" runat="server" DataSourceID="LinksSiteMap" EnableViewState="false">
        <HeaderTemplate>
            <ul>
        </HeaderTemplate>
        <FooterTemplate>
            </ul>
        </FooterTemplate>
        <ItemTemplate>
            <li>
                <asp:HyperLink ID="HyperLink1" runat="server" NavigateUrl='<%# Eval("Url") %>' EnableViewState="false">&raquo; <%# Eval("Title") %></asp:HyperLink>
            </li>
        </ItemTemplate>
    </asp:Repeater>
    <asp:SiteMapDataSource ID="LinksSiteMap" runat="server" SiteMapProvider="LinksSiteMap" ShowStartingNode="false" />
</div>
