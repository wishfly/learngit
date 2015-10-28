(function () {
    var SuveePlayer = {
        _K_: function (d) { return document.getElementById(d); },
        _T_: false,
        _M_: false,
        _G_: false,
        _Y_: false,
        _I_: null,
        _J_: 0,
        _O_: {},
        //平台_判断标准
        browser: function () {
            var u = navigator.userAgent,
			rMsie = /(msie\s|trident.*rv:)([\w.]+)/,
			rFirefox = /(firefox)\/([\w.]+)/,
			rOpera = /(opera).+version\/([\w.]+)/,
			rChrome = /(chrome)\/([\w.]+)/,
			rSafari = /version\/([\w.]+).*(safari)/,
			rSafari2 = /(safari)\/([\w.]+)/,
			mozilla = /(mozilla)\/([\w.]+)/,
			mobile = /(mobile)\/([\w.]+)/;
            var c = u.toLowerCase();
            var d = this.uaMatch(c, rMsie, rFirefox, rOpera, rChrome, rSafari, rSafari2, mozilla, mobile);
            if (d.b) {
                b = d.b;
                v = d.v;
            }
            return { B: b, V: v };
        },
        Platform: function () {
            var w = '';
            var u = navigator.userAgent,
            app = navigator.appVersion;
            var b = {
                //iPhone: u.indexOf('iPhone') > -1 || u.indexOf('Mac') > -1,
                iPhone: u.indexOf('iPhone') > -1,
                iPad: u.indexOf('iPad') > -1,
                ios: !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/),
                android: u.indexOf('Android') > -1 || u.indexOf('Linux') > -1,
                webKit: u.indexOf('AppleWebKit') > -1,
                trident: u.indexOf('Trident') > -1,
                gecko: u.indexOf('Gecko') > -1 && u.indexOf('KHTML') == -1,
                presto: u.indexOf('Presto') > -1,
                mobile: !!u.match(/AppleWebKit.*Mobile.*/) || !!u.match(/AppleWebKit/),
                webApp: u.indexOf('Safari') == -1
            };
            for (var k in b) {
                if (b[k]) {
                    w = k;
                    break;
                }
            }
            return w;
        },
        isHTML5: function () {
            return !!document.createElement('video').canPlayType;
        },
        Flash: function () {
            var f = false, v = 0;
            if (document.all || this.browser()['B'].toLowerCase().indexOf('ie') > -1) {
                try {
                    var s = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
                    f = true;
                    var z = s.GetVariable('$version');
                    v = parseInt(z.split(' ')[1].split(',')[0]);
                } catch (e) { }
            } else {
                if (navigator.plugins && navigator.plugins.length > 0) {
                    var s = navigator.plugins['Shockwave Flash'];
                    if (s) {
                        f = true;
                        var w = s.description.split(' ');
                        for (var i = 0; i < w.length; ++i) {
                            if (isNaN(parseInt(w[i]))) continue;
                            v = parseInt(w[i]);
                        }
                    }
                }
            }
            return {
                f: f,
                v: v
            };
        },
        uaMatch: function (u, rMsie, rFirefox, rOpera, rChrome, rSafari, rSafari2, mozilla, mobile) {
            var match = rMsie.exec(u);
            if (match != null) {
                return {
                    b: 'IE',
                    v: match[2] || '0'
                }
            }
            match = rFirefox.exec(u);
            if (match != null) {
                return {
                    b: match[1] || '',
                    v: match[2] || '0'
                }
            }
            match = rOpera.exec(u);
            if (match != null) {
                return {
                    b: match[1] || '',
                    v: match[2] || '0'
                }
            }
            match = rChrome.exec(u);
            if (match != null) {
                return {
                    b: match[1] || '',
                    v: match[2] || '0'
                }
            }
            match = rSafari.exec(u);
            if (match != null) {
                return {
                    b: match[2] || '',
                    v: match[1] || '0'
                }
            }
            match = rSafari2.exec(u);
            if (match != null) {
                return {
                    b: match[1] || '',
                    v: match[2] || '0'
                }
            }
            match = mozilla.exec(u);
            if (match != null) {
                return {
                    b: match[1] || '',
                    v: match[2] || '0'
                }
            }
            match = mobile.exec(u);
            if (match != null) {
                return {
                    b: match[1] || '',
                    v: match[2] || '0'
                }
            }
            else {
                return {
                    b: 'unknown',
                    v: '0'
                }
            }
        },
        //判断是否是手机浏览器发来的请求
        isMobile: function () {
            var mobile = ["android", "windows phone", "ipad", "iphone"];
            for (var i = 0; i < mobile.length; i++) {

                if (navigator.userAgent.toLowerCase().indexOf(mobile[i]) > 0)
                    return true;
            }
            return false;
        },
        //生成视频
        //f:flashPlugsSrc_falsh插件地址
        //d:videoDivID_视频Div的ID
        //i:videoID_视频ID
        //w:videoWidth_视频宽度
        //h:videoHeigth_视频高度
        //b:isHtml5First
        //e:html5VideoSrc
        //p:flashVideoSrc
        embed: function (flashPlugsSrc, videoDivID, videoID, videoWidth, videoHeigth, isHtml5First, html5VideoSrc, flashVideoSrc, VideoPic, j) {
            var s = ['all'];
            //true为html5
            if (isHtml5First) {
                if (this.isHTML5()) {
                    this.embedHTML5(videoDivID, videoID, videoWidth, videoHeigth, html5VideoSrc, VideoPic, s, j);
                }
                else {
                    this.embedFlvFlash(flashPlugsSrc, videoDivID, videoID, videoWidth, videoHeigth, flashVideoSrc, VideoPic);
                }
            }
                //false为flash播放
            else {
                if (this.Flash()['f'] && parseInt(this.Flash()['v']) > 10) {
                    this.embedFlvFlash(flashPlugsSrc, videoDivID, videoID, videoWidth, videoHeigth, flashVideoSrc, VideoPic);
                }
                else if (this.isHTML5()) {
                    this.embedHTML5(videoDivID, videoID, videoWidth, videoHeigth, html5VideoSrc, VideoPic, s, j);
                }
                else {
                    this.embedFlvFlash(flashPlugsSrc, videoDivID, videoID, videoWidth, videoHeigth, flashVideoSrc, VideoPic);
                }
            }
        },
        //C,D,N,W,H,P
        embedFlvFlash: function (flashPlugsSrc, videoDivID, videoID, videoWidth, videoHeigth, flashVideoSrc, VideoPic) {
            if (!videoID) {
                videoID = 'suveeplayer_a1'
            }
            //this.getX();
            var u = 'undefined',
            g = false,
            j = document,
            r = 'https://get.adobe.com/cn/flashplayer/',
            //r = 'http://www.macromedia.com/go/getflashplayer',
            //t = '<a href="' + r + '" target="_blank">请点击此处下载安装最新的flash插件</a>',
            error = {
                w: '您的网页不符合w3c标准，无法显示播放器',
                f: '<a href="' + r + '" target="_blank" style="color:#ffffff">您没有安装flash插件，无法播放视频，请点击此处下载安装最新的flash插件</a>',
                v: '<a href="' + r + '" target="_blank" style="color:#ffffff">您的flash插件版本过低，无法播放视频，请点击此处下载安装最新版本的flash插件</a>',
                mr: '<p>您没有安装flash插件或flash插件版本过低,<br/>建议通过对应系统的应用中心下载最新版本的flash插件或更换拥有flash插件的浏览器重新访问</p>'
            },
            w3c = typeof j.getElementById != u && typeof j.getElementsByTagName != u && typeof j.createElement != u,
            i = 'id="' + videoID + '" name="' + videoID + '" ',
            s = '',
            l = '';
            //宽度如果设置有问题
            if (videoWidth == -1) {
                d = true;
                this._K_(videoDivID).style.width = '100%';
                videoWidth = '100%';
            }
            //s播放器
            //<embed type="application/x-shockwave-flash" src="/content/flvplayer.swf" width="1200" height="490" 
            //flashvars="file=/content/data/vrbojinglh/longhuivideo.flv&autostart=true&displayheight=490" 
            //wmode="transparent" allowfullscreen="true" />
            s = '<embed type="application/x-shockwave-flash"';
            s += ' src="' + flashPlugsSrc + '"';
            s += ' width="' + videoWidth + '" height="' + videoHeigth + '"';
            s += ' flashvars="file=' + flashVideoSrc + '&autostart=false&displayheight=' + videoWidth + '"';
            s += ' wmode="transparent"   allowfullscreen="true"/>';
            if (!w3c) {
                l = error['w'];
                g = true;
            }
            else {
                ////PC
                //if (this.isMobile() == false) {
                    if (!this.Flash()['f']) {
                        l = SuveePlayer.isMobile() ? error['mr'] : error['f'];
                        //l = error['f'];
                        g = true;
                    } else {
                        if (this.Flash()['v'] < 11) {
                            l = SuveePlayer.isMobile() ? error['mr'] : error['v'];
                            //l = error['v'];
                            g = true;
                        } else {
                            l = s;
                        }
                    }
                //    手机和Pad
                //else { //用下面的是浏览器可以提示下载的，但是不是所有浏览器都可以（UC和手机QQ浏览器可以，360和内置的安卓浏览器不可以）
                //    l = s;
                //    g = true;
                //}
            }
            this._T_ = false;
            if (l) {
                this._K_(videoDivID).innerHTML = l;
            }
            if (g) {
                this._K_(videoDivID).style.color = '#0094ff';
                this._K_(videoDivID).style.border = '#0094ff';
                //this._K_(videoDivID).style.lineHeight = this._K_(videoDivID).style.height;
                this._K_(videoDivID).style.textAlign = 'center';
            }
        },
        //C,P,W,H,V,S,J //videoDivID, videoID, videoWidth, videoHeigth, html5VideoSrc, s, j
        embedHTML5: function (C, P, W, H, V, P, S, J) {
            //V:video参数
            S = ['all'],
            this._E_ = {
                c: C,
                p: P,
                w: W,
                h: H,
                v: V,
                s: S,
                j: J == undefined || J ? true : false
            };
            //this._A_ = A;
            //this.getX();
            b = this.browser()['B'],
            v = this.browser()['V'],
            x = v.split('.'),
            t = x[0],
            m = b + v,
            n = b + t,
            w = '',
            s = false,
            f = this.Flash()['f'],
            a = false;
            if (!S) {
                S = ['iPad', 'iPhone', 'ios'];
            }
            for (var i = 0; i < S.length; i++) {
                w = S[i];
                if (w.toLowerCase() == 'all') {
                    s = true;
                    break;
                }
                if (w.toLowerCase() == 'all+false' && !f) {
                    s = true;
                    break;
                }
                if (w.indexOf('+') > -1) {
                    w = w.split('+')[0];
                    a = true;
                } else {
                    a = false;
                }
                if (this.Platform() == w || m == w || n == w || b == w) {
                    if (a) {
                        if (!f) {
                            s = true;
                            break;
                        }
                    } else {
                        s = true;
                        break;
                    }
                }
            }
            if (s) {
                if (V) {
                    var l = V[0].split('->');
                    if (l && l.length == 2 && l[1].indexOf('ajax') > -1) {
                        this.getUrl(l, true, P);
                        return;
                    }
                }
                this.showHtml5(P);
            }
        },
        showHtml5: function (P) {
            var C = SuveePlayer;
            var p = C._E_['p'],
            a = C._E_['v'],
            c = C._E_['c'],
            j = '',
            b = false;
            var s = this._E_['v'];
            var w = C._E_['w'], h = C._E_['h'];
            var d = false;
            var r = '';
            if (s.length == 1) {
                r = ' src="' + s[0].split('->')[0] + '"';
            }
            if (w == -1) {
                d = true;
                C._K_(c).style.width = '100%';
                w = '100%';
            }
            if (w.toString().indexOf('%') > -1) {
                w = '100%';
            }
            if (h.toString().indexOf('%') > -1) {
                h = '100%';
            }
            if (C._E_['j']) {
                j = 'controls="controls"';
            }
            //poster = "http://video-js.zencoder.com/oceans-clip.png" 设置封面
            var v = '<video ' + j + r + '  poster="' + P + '"  id="' + p + '" width="' + w + '" height="' + h + '"' + C.getParams() + '>' + C.getVideo() + '</video>';
            C._K_(c).innerHTML = v;
            C._K_(c).style.backgroundColor = '#000';
            C._V_ = C._K_(p);
            if (!d) {
                C._K_(c).style.width = C._E_['w'].toString().indexOf('%') > -1 ? (C._K_(c).offsetWidth * parseInt(C._E_['w']) * 0.01) + 'px' : C._V_.width + 'px';
                C._K_(c).style.height = C._E_['h'].toString().indexOf('%') > -1 ? (C._K_(c).offsetHeight * parseInt(C._E_['h']) * 0.01) + 'px' : C._V_.height + 'px';
            }
            C._P_ = false;
            C._T_ = true;
            if (C.getVars('loaded') != '') {
                var f = C.getVars('loaded') + '()';
                try {
                    if (typeof (eval(f)) == 'function') {
                        eval(f);
                    }
                } catch (e) {
                    try {
                        if (typeof (eval(loadedHandler)) == 'function') {
                            loadedHandler();
                        }
                    } catch (e) {
                    }
                }
            }
        },
        //公共方法
        getObjectById: function (s) {
            if (this._T_) {
                return this;
            }
            var x = null,
            y = this._K_(s),
            r = 'embed';
            if (y && y.nodeName == 'OBJECT') {
                if (typeof y.SetVariable != 'undefined') {
                    x = y;
                } else {
                    var z = y.getElementsByTagName(r)[0];
                    if (z) {
                        x = z;
                    }
                }
            }
            return x;
        },
        getType: function () {
            return this._T_;
        },

        getVideo: function () {
            var v = '';
            var s = this._E_['v'];
            if (s && s.length > 1) {
                for (var i = 0; i < s.length; i++) {
                    var a = s[i].split('->');
                    if (a.length >= 1 && a[0] != '') {
                        v += '<source src="' + a[0] + '"';
                    }
                    if (a.length >= 2 && a[1] != '') {
                        v += ' type="' + a[1] + '"';
                    }
                    v += '>';
                }
            }
            return v;
        },
        getVars: function (k) {
            var o = this._A_;
            if (typeof (o) == 'undefined') {
                return null;
            }
            if (k in o) {
                return o[k];
            } else {
                return null;
            }
        },
        getParams: function () {
            var p = '';
            if (this._A_) {
                if (parseInt(this.getVars('p')) == 1) {
                    p += ' autoplay="autoplay"';
                }
                if (parseInt(this.getVars('e')) == 1) {
                    p += ' loop="loop"';
                }
                if (parseInt(this.getVars('p')) == 2) {
                    p += ' preload="metadata"';
                }
                if (this.getVars('i')) {
                    p += ' poster="' + this.getVars('i') + '"';
                }
            }
            return p;
        },
        getUrl: function (L, B, P) {
            var b = ['get', 'utf-8'];
            if (L && L.length == 2) {
                var a = L[0];
                var c = L[1].split('/');
                if (c.length >= 2) {
                    b[0] = c[1];
                }
                if (c.length >= 3) {
                    b[1] = c[2];
                }
                this.ajax(b[0], b[1], a,
                function (s) {
                    var C = SuveePlayer;
                    if (s && s != 'error') {
                        var d = '',
                        e = s;
                        if (s.indexOf('}') > -1) {
                            var f = s.split('}');
                            for (var i = 0; i < f.length - 1; i++) {
                                d += f[i] + '}';
                                var h = f[i].replace('{', '').split('->');
                                if (h.length == 2) {
                                    C._A_[h[0]] = h[1];
                                }
                            }
                            e = f[f.length - 1];
                        }
                        C._E_['v'] = e.split(',');
                        if (B) {
                            C.showHtml5(P);
                        } else {
                            C.changeParams(d);
                            C.newAdr();
                        }
                    }
                });
            }
        },
        newAdr: function () {
            var s = this._E_['v'];
            this._V_.pause();
            if (s.length == 1) {
                this._V_.src = s[0].split('->')[0];
            }
            else {
                this._V_['innerHTML'] = this.getVideo();
            }
            this._V_.load();
        },
        changeParams: function (f) {
            if (f) {
                var a = f.replace(/{/g, '');
                var b = a.split('}');
                var c = '';
                for (var i = 0; i < b.length; i++) {
                    var d = b[i].split('->');
                    if (d.length == 2) {
                        switch (d[0]) {
                            case 'p':
                                if (parseInt(d[1]) == 1) {
                                    this._V_.autoplay = true;
                                }
                                else if (parseInt(d[1]) == 2) {
                                    this._V_.preload = 'metadata';
                                }
                                else {
                                    this._V_.autoplay = false;
                                    if (this._I_ != null) {
                                        clearInterval(this._I_);
                                        this._I_ = null;
                                    }
                                }
                                break;
                            case 'e':
                                if (parseInt(d[1]) == 1) {
                                    this._V_.loop = true;
                                }
                                else {
                                    this._V_.loop = false;
                                }
                                break;
                            case 'i':
                                this._V_.poster = d[1];
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
        }
    }
    window.SuveePlayer = SuveePlayer;
})();
