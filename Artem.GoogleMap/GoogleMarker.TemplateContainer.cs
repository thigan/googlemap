﻿using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI;
using System.Web.UI.WebControls;

namespace Artem.Web.UI.Controls {
    public partial class GoogleMarker {

        /// <summary>
        /// 
        /// </summary>
        public class TemplateContainer : WebControl, INamingContainer {

            #region Properties  /////////////////////////////////////////////////////////////

            /// <summary>
            /// Gets the <see cref="T:System.Web.UI.HtmlTextWriterTag"/> value that corresponds to this Web server control. This property is used primarily by control developers.
            /// </summary>
            /// <value></value>
            /// <returns>One of the <see cref="T:System.Web.UI.HtmlTextWriterTag"/> enumeration values.</returns>
            protected override HtmlTextWriterTag TagKey {
                get { return HtmlTextWriterTag.Div; }
            }

            #endregion
        }
    }
}
