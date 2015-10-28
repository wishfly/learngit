/// <reference path="myxheditor.js" />

$(document).ready(function () {
    //js初始化只能用id,不能用class,否则编辑器会以class方式自动初始化
    /*xheditor = $('#xheditor').xheditor({
					width:550,height:150,	//大小设置
					tools: getXeditorTools().join(',')	//工具栏组：full,mfull,simple,mini
				});*/
    //1.0 定义插件
    var plugins = {
        InsertVideo: {
            c: 'btnInsertVideoCode', t: '插入视频', h: 1, e: function () {
                var _this = this;
                var htmlCode = '<div><label for="xheVideoUrl">视频地址(仅限于MP4格式的视频地址): </label><input type="text" id="xheVideoUrl" value="http://"></div>';
                htmlCode += '<div> <label for="xheVideoPic">视频封面: </label><input type="text" id="xheVideoPic" value="http://"></div>';
                htmlCode += '<div> <label for="xheVideoAlign">对齐方式: </label><select id="xheVideoAlign"><option selected="selected" value="0">居中</option><option value="1">左对齐</option><option value="2" >右对齐</option></select></div>';
                htmlCode += '<div><label for="xheVideoWidth">宽　　度:</label>  <input type="text" id="xheVideoWidth" style="width:40px;" value="1000"><strong>px</strong></div>';
                htmlCode += '<div><label for="xheVideoHeight">高　　度: </label><input type="text" id="xheVideoHeight" style="width:40px;" value="600"><strong>px</strong></div>'
                htmlCode += '<div style="text-align:center;"><input type="button" id="xheSave" value="确定">';
                var jCode = $(htmlCode),
                    jXheVideoUrl = $('#xheVideoUrl', jCode),
                    jXheVideoPic = $('#xheVideoPic', jCode),
                    jXheVideoAlign = $('#xheVideoAlign', jCode),
                    jXheVideoWidth = $('#xheVideoWidth', jCode),
                    jXheVideoHeight = $('#xheVideoHeight', jCode),
                    jSave = $('#xheSave', jCode);
                //点击确定
                jSave.click(function () {
                    var videoUrl = _this.domEncode(jXheVideoUrl.val());
                    var videoPic = _this.domEncode(jXheVideoPic.val());
                    var videoAlign = _this.domEncode(jXheVideoAlign.val());
                    var videoWidth = _this.domEncode(jXheVideoWidth.val());
                    var videoHeight = _this.domEncode(jXheVideoHeight.val());

                    var alignMargin = "";
                    var d_alignTextAlign = "";
                    if (videoAlign == "0")//默认居中
                    {
                        alignMargin = 'margin-right: auto; margin-left: auto';
                        d_alignTextAlign = 'text-align:center';
                    }
                    else if (videoAlign == "1")//居左
                    {
                        alignMargin = 'margin-right: auto; margin-left: 0';
                        d_alignTextAlign = 'text-align:left';
                    }
                    else if (videoAlign == "2")//居右
                    {
                        alignMargin = 'margin-right: 0; margin-left: auto';
                        d_alignTextAlign = 'text-align:right';
                    }
                    var jsJquery = '<script src="/Scripts/jquery-1.8.2.js"><' + '/script>';
                    var jsVideoJs = '<script src="/xheditor/video/videojs.js"><' + '/script>';
                    //产生随机数，并转成正整数(以十进制为单位)
                    var videoRandomNum = parseInt(Math.random() * 1000, 10);
                    var videoNumId = "_insertvideo" + videoRandomNum;
                    var videoId = '<div id="' + videoNumId + '" style="' + alignMargin + '"></div> ';
                    var videoClear = '<div style="clear:both;"><div class="v_videotxt">视频</div></div>';
                    
                    var videoJsStart = '<script type="text/javascript">';
                    var videoValue = "['" + videoUrl + "']";
                    var videoJudege = "if (window.innerWidth <= 480) {SuveePlayer.embed('/xheditor/video/flvplayer.swf', '" + videoNumId + "', 'videoid', innerWidth, (innerWidth - 10) * 0.66, true, " + videoValue + ", " + videoValue + ", '" + videoPic + "'); $('.vv_outerdiv').height((innerWidth - 10) * 0.66);$('.vv_outerdiv').width(window.innerWidth);}else {SuveePlayer.embed('/xheditor/video/flvplayer.swf', '" + videoNumId + "', 'videoid', " + videoWidth + ", " + videoHeight + ", true, " + videoValue + ", " + videoValue + ",'" + videoPic + "');} $('.vv_outerdiv').css('border','0px');";
                    var videoJsEnd = '</';
                    var videoJsEnd2 = 'script>';
                    //如果支持html5标签
                    var outerDiv = '<div class="vv_outerdiv" style="' + alignMargin + ';height:' + videoHeight + 'px;width:' + videoWidth + 'px;border:solid 1px #000000; ' + d_alignTextAlign + '">';
                    _this.pasteHTML(outerDiv + jsJquery + jsVideoJs + videoId + videoClear + videoJsStart + videoJudege + videoJsEnd + videoJsEnd2 + "</div>" + "<br>");

                    //_this.pasteText(jsJquery + jsVideoJs + videoId + videoClear + videoJsStart + videoJudege + videoJsEnd + videoJsEnd2);
                    _this.hidePanel();
                    _this.focus();
                    return false;
                });
                _this.saveBookmark();
                _this.showDialog(jCode);
            }
        },

    };
    //2.0 初始化数据(注意：尽量不要用class='xheditor'或id=xheditor初始化)
    xheditor = $('.editor').xheditor({
        loadCSS: '/xheditor/extracss.css',//加载外部css,多个css时[a.css,b.css,c.css]
        width: 700, height: 410,	//大小设置
        internalScript: true,
        inlineScript: true,//保留js代码(默认会将js代码过滤)
        internalStyle: true,
        inlineStyle: true,
        tools: getXeditorTools().join(','),	//工具栏组：full,mfull,simple,mini
        plugins: plugins,  //使用我们定义的插件
    });

});

//卸载编辑器方法：
//$('#elm1').xheditor(false);

//将内容插入光标中
//$('#elm1').xheditor().loadBookmark();
//$('#elm1').xheditor().pasteText('返回值：\r\n'+v);

function getXeditorTools() {
    var $tools = new Array();
    //$tools[] = '|'; //分隔符
    //$tools[] = '/'; //强制换行
    $tools[0] = 'Cut'; //剪切
    //$tools[1] = 'Copy'; //复制
    //$tools[2] = 'Paste'; //粘贴
    $tools[3] = 'Pastetext'; //文本粘贴
    $tools[4] = '|'; //分隔符
    $tools[5] = 'Blocktag'; //段落标签
    $tools[6] = 'Fontface'; //字体
    $tools[7] = 'FontSize'; //字体大小
    $tools[8] = 'Bold'; //粗体
    $tools[9] = 'Italic'; //斜体
    $tools[10] = 'Underline'; //下划线
    $tools[11] = 'Strikethrough'; //中划线
    $tools[12] = 'FontColor'; //字体颜色
    $tools[13] = 'BackColor'; //字体背景色
    //$tools[14] = 'SelectAll'; //全选
    $tools[15] = 'Removeformat'; //删除文字格式
    $tools[16] = '|'; //分隔符
    $tools[17] = 'Align'; //对齐
    $tools[18] = 'List'; //列表
    $tools[19] = 'Outdent'; //减少缩进
    $tools[20] = 'Indent'; //增加缩进
    $tools[21] = '|'; //分隔符
    $tools[22] = 'Link'; //超链接
    $tools[23] = 'Unlink'; //删除链接
    //$tools[24] = 'Anchor'; //锚点
    $tools[25] = 'Img'; //图片
    //$tools[26] = 'Flash'; //Flash动画
    //$tools[27] = 'Media'; //Windows media player视频
    //$tools[28] = 'Hr'; //插入水平线
    $tools[29] = 'Emot'; //表情
    $tools[30] = 'Table'; //表格
    $tools[31] = '|'; //分隔符
    $tools[32] = 'InsertVideo'; //插入视频
    $tools[33] = 'Source'; //切换源代码模式
    $tools[34] = 'Preview'; //预览当前代码
    //$tools[35] = 'Print'; //打印
    $tools[36] = 'Fullscreen'; //切换全屏模式
    $tools[37] = 'About'; //关于xhEditor
    return $tools;
}

