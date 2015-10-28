using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebProject.Controllers
{
    using System.IO;
    /// <summary>
    /// 网页文件上传控制器
    /// </summary>
    public class WebFileUploadController : Controller
    {
        /// <summary>上传UI
        ///上传UI 
        /// </summary>
        /// <returns></returns>
        public ActionResult UpLoadUI()
        {
            return View();
        }

        /// <summary>上传验证
        /// 上传验证
        /// </summary>
        /// <returns></returns>
        public ActionResult UploadSave(string name)//插件将会把上传前的文件进行转换，转换后的文件名不会重复(注意：文件名称不可更改，否则取不到值)
        {
            //1   上传前的注意事项，参见文本文件：/Controllers/Notice/WebFileUpload.txt
            //2   开始上传
            //2.1 如果是分隔截断文件
            int chunk = 0;
            int chunks = 0;
            string strchunk = Request["chunk"];//分割文件处于第几次上传
            string strchunks = Request["chunks"];//分割文件要上传多少次
            int.TryParse(strchunk, out chunk);
            int.TryParse(strchunks, out chunks);
            //2.2 循环遍历多个文件
            foreach (string uploadFile in Request.Files)
            {
                if (string.IsNullOrWhiteSpace(uploadFile) == false)
                {
                    //2.2 保存文件(如果文件需要多次分割上传那么就是先保存多次_注意需要重命名)
                    string targetDir = Path.Combine(System.AppDomain.CurrentDomain.BaseDirectory, "Media");
                    if (Directory.Exists(targetDir) == false)
                        Directory.CreateDirectory(targetDir);
                    HttpPostedFileBase postedFile = Request.Files[uploadFile];
                    string newFileName = name;
                    if (chunks > 1)//如果文件过长，那么就分隔上传，如果有多个文件那么久
                        newFileName = chunk + "_" + name;//分割文件需要重命名
                    string fileNamePath = Path.Combine(targetDir, newFileName);
                    postedFile.SaveAs(fileNamePath);
                    //2.3 将已经存在物理路径中的文件合并成一个文件
                    if (chunks > 1 && chunks == chunk + 1)//多个文件且是最后一次
                    {
                        string chunksFilePath = Path.Combine(targetDir, name);
                        using (FileStream fsw = new FileStream(chunksFilePath, FileMode.Create, FileAccess.Write))
                        {
                            BinaryWriter bw = new BinaryWriter(fsw);
                            // 遍历文件合并 
                            for (int i = 0; i < chunks; i++)
                            {
                                string partFilePath = Path.Combine(targetDir, i.ToString() + "_" + name);
                                bw.Write(System.IO.File.ReadAllBytes(partFilePath));
                                bw.Flush();
                                //删除掉文件
                                System.IO.File.Delete(partFilePath);

                            }
                        }
                        //2.4 partA 将文件写入数据库To
                    }
                    if (chunks <= 1 && chunk >= 0)//只有一个文件
                    {
                        //2.4 partB 将文件写入数据库To
 
                    }
                }
            }
            return Json(new { });
            //return Json(new { jsonrpc = "2.0", result = "", id = "id" });
        }

    }
}
