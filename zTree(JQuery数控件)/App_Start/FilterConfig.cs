using System.Web;
using System.Web.Mvc;

namespace zTree_JQuery数控件_
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
