﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace JDT
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "FourIds",
                url: "{controller}/{action}/{id}/{id1}/{id2}/{id3}");

            routes.MapRoute(
                name: "ThreeIds",
                url: "{controller}/{action}/{id}/{id1}/{id2}");

            routes.MapRoute(
                name: "TwoIds",
                url: "{controller}/{action}/{id}/{id1}");

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Index", id = UrlParameter.Optional }
            );
        }
    }
}