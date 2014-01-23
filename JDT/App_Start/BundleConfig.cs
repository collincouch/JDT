using System.Web;
using System.Web.Optimization;

namespace JDT
{
    public class BundleConfig
    {
        // For more information on Bundling, visit http://go.microsoft.com/fwlink/?LinkId=254725
        public static void RegisterBundles(BundleCollection bundles)
        {

            bundles.Add(new ScriptBundle("~/bundles/fireBase").Include(
                        "~/Content/js/fireBaseAuth.js"));
           

            bundles.Add(new ScriptBundle("~/bundles/jquery").Include(
                        "~/Content/js/libs/jquery/jquery-{version}.js"));


            bundles.Add(new ScriptBundle("~/bundles/jqueryval").Include(
                        "~/Content/js/libs/jquery.unobtrusive*",
                        "~/Content/js/libs/jquery.validate*"));

            bundles.Add(new ScriptBundle("~/bundles/jqueryplugins").Include(
                       "~/Content/js/libs/jquery-maskedinput/jquery.maskedinput.js",
                       "~/Content/js/libs/parsley/parsley.js",
                    "~/Content/js/libs/icheck.js/jquery.icheck.js",
                    "~/Content/js/libs/select2.js",
                    "~/Content/js/libs/jquery.dataTables-{version}.js",
                    "~/Content/js/libs/TableTools.js",
                    "~/Content/js/libs/dataTables.editor.js",
                    "~/Content/js/libs/dataTables.bootstrap.js",
                    "~/Content/js/libs/dataTables.editor.bootstrap.js",
                    "~/Content/js/libs/jquery.timer.js"));

            bundles.Add(new ScriptBundle("~/bundles/dashboard/jqueryplugins").Include(
                       "~/Content/js/libs/icheck.js/jquery.icheck.js",
                       "~/Content/js/libs/sparkline/jquery.sparkline.js",
                    "~/Content/js/libs/jquery-ui-1.10.3.custom.js",
                    "~/Content/js/libs/jquery.slimscroll.js"));

             bundles.Add(new ScriptBundle("~/bundles/nvd3").Include(
                       "~/Content/js/libs/nvd3/nv.d3.custom.js",
                        "~/Content/js/libs/nvd3/lib/d3.v2.js"));

            bundles.Add(new ScriptBundle("~/bundles/nvd3models").Include(
                       "~/Content/js/libs/nvd3/src/models/scatter.js",
                        "~/Content/js/libs/nvd3/src/models/axis.js",
                     "~/Content/js/libs/nvd3/src/models/legend.js",
                     "~/Content/js/libs/nvd3/src/models/multiBar.js",
                     "~/Content/js/libs/nvd3/src/models/multiBarChart.js",
                     "~/Content/js/libs/nvd3/src/models/line.js",
                     "~/Content/js/libs/nvd3/src/models/lineChart.js",
                     "~/Content/js/libs/nvd3/stream_layers.js"));

            bundles.Add(new ScriptBundle("~/bundles/backboneunderscore").Include(
                        "~/Content/js/libs/backbone/underscore.js"));

            bundles.Add(new ScriptBundle("~/bundles/backbone").Include(
                        "~/Content/js/libs/backbone/underscore.js",
                        "~/Content/js/libs/backbone/backbone.js",
                        "~/Content/js/libs/backbone/backbone.localStorage.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrap").Include(
                        
                       "~/Content/js/libs/bootstrap/transition.js",
                       "~/Content/js/libs/bootstrap/collapse.js",
                       "~/Content/js/libs/bootstrap/alert.js",
                       "~/Content/js/libs/bootstrap/tooltip.js",
                       "~/Content/js/libs/bootstrap/popover.js",
                       "~/Content/js/libs/bootstrap/button.js",
                       "~/Content/js/libs/bootstrap/dropdown.js",
                       "~/Content/js/libs/bootstrap/modal.js",
                       "~/Content/js/libs/bootstrap/tab.js"));

            bundles.Add(new ScriptBundle("~/bundles/bootstrapplugins").Include(
                       "~/Content/js/libs/bootstrap-datepicker.js",
                       "~/Content/js/libs/bootstrap-select/bootstrap-select.js",
                       "~/Content/js/libs/wysihtml5/wysihtml5-0.3.0_rc2.js",
                       "~/Content/js/libs/bootstrap-wysihtml5/bootstrap-wysihtml5.js"));

            bundles.Add(new ScriptBundle("~/bundles/formelements").Include(
                "~/Content/js/forms-elements.js"));

            bundles.Add(new ScriptBundle("~/bundles/forms").Include(
                "~/Content/js/forms.js"));

            // Use the development version of Modernizr to develop with and learn from. Then, when you're
            // ready for production, use the build tool at http://modernizr.com to pick only the tests you need.
            //bundles.Add(new ScriptBundle("~/bundles/modernizr").Include(
            //            "~/Scripts/modernizr-*"));

            bundles.Add(new ScriptBundle("~/bundles/site").
                Include("~/Content/js/libs/consolelog.js",
                "~/Content/js/app.js",
                "~/Content/js/settings.js",
                "~/Content/js/JDT.js"));

            bundles.Add(new StyleBundle("~/Content/css/bundles").
                Include("~/Content/css/application.css"));

            bundles.Add(new StyleBundle("~/Content/css/datatables/bundles").
                Include(
                "~/Content/css/TableTools.css",
                "~/Content/css/dataTables.bootstrap.css"));

        }
    }
}