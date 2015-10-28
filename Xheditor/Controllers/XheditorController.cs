using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Xheditor.Controllers
{
    public class XheditorController : Controller
    {
        //
        // GET: /Xheditor/

        public ActionResult XheditorInsertVideo()
        {
            return View();
        }
        [ValidateInput(false)]
        [HttpPost]
        public ActionResult XheditorInsertVideoVerify()
        {
            string xheditor= Request.Params["content"];
            ViewBag.XheditorHtml = xheditor;
            //注意：写入数据库时需要将单引号'前面加上'
            GetDoubleQuoteForSQL(xheditor);
            return View();
        }
        public string GetDoubleQuoteForSQL(string singleQuote)
        {
            return singleQuote.Replace("'", "''");
        }
    }
}
