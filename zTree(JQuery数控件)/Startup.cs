using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(zTree_JQuery数控件_.Startup))]
namespace zTree_JQuery数控件_
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
