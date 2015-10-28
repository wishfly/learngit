using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebVideoPlay.Controllers
{
    public class VideoController : Controller
    {
        /// <summary>
        /// 使用html+flash两种方式播放
        /// </summary>
        /// <returns></returns>
        public ActionResult UseHtmlPlusFlash()
        {
            return View();
        }
        /// <summary>
        /// 单纯使用Html5形式播放
        /// </summary>
        /// <returns></returns>
        public ActionResult UseHtml5Play()
        {
            return View();
        }
        /// <summary>
        /// 单纯使用FlashPlay形式播放
        /// </summary>
        /// <returns></returns>
        public ActionResult FlashPlay()
        {
            return View();
        }

    }
}
