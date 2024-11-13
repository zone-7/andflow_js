
var andflow_util = {
  uuid: function () {
    function S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
  },
  confirm: function (msg, callback) {
    var res = confirm(msg);
    if (res) {
      callback();
    }
  },
  extend: function (src, dst) {
    if (src) {
      for (var k in dst) {
        src[k] = dst[k];
      }
    } else {
      src = dst;
    }

    return src;
  },

  parseHtml: function (html) {
    var divEl = document.createElement('div');
    divEl.innerHTML = html;
    return divEl.firstChild;
  },

  addEventList: function (obj, type, callback, useCapture) {
    if (obj.eventList) {
      if (obj.eventList[type]) {
        obj.eventList[type].push({ callback: callback, useCapture: useCapture });
      } else {
        obj.eventList[type] = [{ callback: callback, useCapture: useCapture }];
      }
    } else {
      obj.eventList = {};
      obj.eventList[type] = [{ callback: callback, useCapture: useCapture }];
    }
  },

  removeEventList: function (obj, type, callback, useCapture) {
    var eventList = obj.eventList;
    if (eventList) {
      if (eventList[type]) {
        if (callback) {

          for (var i = 0; i < eventList[type].length; i++) {
            if (eventList[type][i].callback === callback) {
              eventList[type].splice(i, 1);
              if (eventList[type].length === 0) {
                delete eventList[type];
              }
              break;
            }
          }

        } else {
          delete eventList[type];
        }
      }
    }
  },


  getEventList: function (id, type) {
    var obj = id;
    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return;
    }
    var eventList = obj.eventList;
    if (eventList) {
      return eventList[type];
    }
    return null;
  },

  addEventListener: function (id, event, callback, useCapture) {
    var obj = id;
    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return;
    }

    obj.addEventListener(event, callback, useCapture);
    andflow_util.addEventList(obj, event, callback, useCapture);
  },

  removeEventListener: function (id, event, callback, useCapture) {
    var obj = id;
    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return;
    }

    if (callback) {
      obj.removeEventListener(event, callback, useCapture);
      andflow_util.removeEventList(obj, event, callback, useCapture);
    } else {
      var list = andflow_util.getEventList(obj, event);
      if (list && list.length > 0) {
        list.forEach(function (value, index) {
          if (value.callback) {
            obj.removeEventListener(event, value.callback, value.useCapture);
          }
        });
        andflow_util.removeEventList(obj, event);
      }
    }

  },

  isVisible: function (id) {

    var obj = id;
    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return false;
    }

    var ret = obj.style.display === "none" ||
      (obj.currentStyle && obj.currentStyle === "none") ||
      (window.getComputedStyle && window.getComputedStyle(obj, null).display === "none");

    return !ret;
  },

  getRect: function (element) {
    var rect = element.getBoundingClientRect();

    var top = document.documentElement.clientTop;

    var left = document.documentElement.clientLeft;

    return {

      top: rect.top - top,

      bottom: rect.bottom - top,

      left: rect.left - left,

      right: rect.right - left

    }

  },
  getLeftInCanvas(e) {
    if (typeof e === 'string') {
      e = document.querySelector(e);
    }

    if (!e) {
      return 0;
    }

    var left = e.offsetLeft;
    var index = 0;
    while (e.parentNode && e.parentNode.className.indexOf("canvas") < 0 && index++ < 100) {
      left += e.parentNode.offsetLeft;
      e = e.parentNode;
    }
    return left;
  },
  getTopInCanvas(e) {
    if (typeof e === 'string') {
      e = document.querySelector(e);
    }

    if (!e) {
      return 0;
    }

    var top = e.offsetTop;
    var index = 0;
    while (e.parentNode && e.parentNode.className.indexOf("canvas") < 0 && index++ < 100) {
      top += e.parentNode.offsetTop;
      e = e.parentNode;
    }
    return top;
  },




  getPageLeft: function (e) {
    if (typeof e === 'string') {
      e = document.querySelector(e);
    }

    if (!e) {
      return 0;
    }

    return andflow_util.getRect(e).left + window.scrollX;


  },
  getPageTop: function (e) {

    if (typeof e === 'string') {
      e = document.querySelector(e);
    }

    if (!e) {
      return 0;
    }
    return andflow_util.getRect(e).top + window.scrollY;


  },

  show: function (id) {
    var obj = id;

    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return;
    }
    obj.style.display = "block";
  },
  hide: function (id) {
    var obj = id;

    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return;
    }
    obj.style.display = "none";
  },


  setValue: function (id, value) {
    var obj = id;

    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return;
    }

    var name = obj.tagName;
    if (name == 'INPUT') {
      obj.value = value;
    }
    if (name == 'SELECT') {
      obj.value = value;
    }

    if (name == 'TEXTAREA') {
      obj.value = value;
      obj.innerHTML = value;
    }

  },
  getValue: function (id) {
    var obj = id;

    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    var name = obj.tagName;
    if (name == 'INPUT') {
      return obj.value;
    }
    if (name == 'SELECT') {
      return obj.value;
    }

    if (name == 'TEXTAREA') {
      return obj.value || obj.innerHTML;
    }

    return null;

  },

  setAttr: function (id, attr, val) {
    var obj = id;

    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return;
    }

    return obj.setAttribute(attr, val);
  },
  getAttr: function (id, attr) {
    var obj = id;

    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return null;
    }
    return obj.getAttribute(attr);
  },

  setStyle: function (id, prop, value) {
    var obj = id;

    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return;
    }

    obj.style[prop] = value;
  },

  getStyle: function (id, prop) {
    var obj = id;
    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return null;
    }
    if (obj.currentStyle) //IE
    {
      return obj.currentStyle[prop];
    }
    else if (window.getComputedStyle) //非IE
    {
      let propprop = prop.replace(/([A-Z])/g, "-$1");
      propprop = prop.toLowerCase();
      return document.defaultView.getComputedStyle(obj, null)[propprop];
    }
    return null;
  },

  //自定义添加class方法
  addClass: function (id, name) {

    var obj = id;

    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return;
    }

    if (name) {
      if (obj.className && obj.className.indexOf(name) >= 0) {
        return;
      }
      //判断该dom有没有class，有则在原class基础上增加，无则直接赋值
      obj.className ? obj.className = obj.className + " " + name : obj.className = name;
    } else {
      throw new Error("请传递一个有效的class类名");
    };
  },

  //自定义删除class类方法
  removeClass: function (id, name) {
    var obj = id;

    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return;
    }

    //将className属性转为数组
    var classArr = obj.className.split(" ");
    var index = classArr.indexOf(name);
    //将符合条件的class类删除
    if (index > -1) {
      classArr.splice(index, 1);
    }

    obj.className = classArr.join(" ");
  },
  hasClass: function (id, name) {

    var obj = id;

    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return;
    }

    if (name) {
      if (obj.className && obj.className.indexOf(name) >= 0) {
        return true;
      }
    } else {
      throw new Error("请传递一个有效的class类名");
    };
    return false;
  },
  removeElement: function (id) {
    var obj = id;

    if (typeof id === 'string') {
      obj = document.querySelector(id);
    }
    if (!obj) {
      return;
    }
    var parentNode = obj.parentNode;
    if (parentNode) {
      parentNode.removeChild(obj);
    }
  },
  isMobile: function () {
    let userAgentInfo = navigator.userAgent;
    let Agents = ['Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod'];
    let getArr = Agents.filter(i => userAgentInfo.includes(i));
    return getArr.length ? true : false;
  }

};


var andflow = {
  containerId: null, //DOM
  img_path: '', //图谱跟路径
  editable: true, //是否可编辑

  tags: null, //标签
  metadata: null, //控件信息
  flowModel: null, //流程数据

  show_grid: true,
  show_toolbar: true, //是否显示工具栏 
  show_code_btn: true,
  show_scale_btn: true,
  show_small_btn: true, //缩略图


  metadata_style: '',
  metadata_position: '',

  drag_step: 10, //拖拉步进，<=1表示可以任意拖拉

  isMobile: false,

  mousedown_event_name: 'mousedown',//touchstart
  mouseup_event_name: 'mouseup',  //touchend
  mousemove_event_name: 'mousemove', //touchmove
  click_event_name: 'click',//touchend
  dblclick_event_name: 'dblclick',
  //渲染器
  render_action: null,
  render_action_helper: null,
  render_link: null,
  render_endpoint: null,
  render_btn_resize: null,
  render_btn_remove: null,

  //事件
  event_action_click: null,
  event_action_dblclick: null,
  event_action_remove: null,

  event_group_click: null,
  event_group_dblclick: null,
  event_group_remove: null,

  event_link_click: null,
  event_link_dblclick: null,
  event_link_remove: null,

  event_canvas_click: null,
  event_canvas_dblclick: null,
  event_canvas_changed: null,

  animation_timer: null,
  //语言
  lang: {
    metadata_tag_all: '所有组件',
    delete_action_confirm: '确定删除该节点?',
  },

  _themeObj: null, //当前样式对象
  _plumb: null, //jsplumb
  _actionInfos: {},
  _actionScript: {}, //插件脚本，getParam,setParam
  _actionCharts: {},
  _action_states: [],
  _actionContents: {},

  _linkInfos: {},
  _link_states: [],

  _groupInfos: {},
  _listInfos: {},
  _tipInfos: {},

  _timer_link: null,
  _timer_group: null,
  _timer_action: null,
  _timer_thumbnail: null,

  _drag_name: null,
  _connectionTypes: {
    Flowchart: {
      anchor: 'Continuous',
      connector: [
        'Flowchart',
        { stub: [5, 15], gap: 5, cornerRadius: 5, alwaysRespectStubs: true },
      ],
    },
    Straight: {
      anchor: 'Continuous',
      connector: ['Straight', { stub: [5, 15], gap: 5, cornerRadius: 25, alwaysRespectStubs: true }],
    },
    Bezier: {
      anchor: 'Continuous',
      connector: ['Bezier', { stub: [5, 15], gap: 5, cornerRadius: 25, alwaysRespectStubs: true }],
    },
    StateMachine: {
      anchor: 'Continuous',
      connector: [
        'StateMachine',
        { stub: [5, 15], gap: 5, cornerRadius: 25, margin: 5, alwaysRespectStubs: true },
      ],
    },
  },

  _initHtml: function (containerId) {
    var $this = this;
    var css_state = '';
    if ($this.editable == false) {
      css_state = 'state';
    }

    var css_showtoolbar = '';
    if ($this.show_toolbar == false || $this.show_toolbar == 'false') {
      css_showtoolbar = 'toolbar_hide';
    }
    // metadata position: metadata_float_top,metadata_float_left
    var metadata_style = $this.metadata_style;
    if (metadata_style == null || metadata_style == "") {
      if ($this.metadata_position == "top") {
        metadata_style = "metadata_float_top";
      } else if ($this.metadata_position == "left") {
        metadata_style = "metadata_float_left";
      }
    }

    var html = '<div class="andflow  ' + metadata_style + ' ' + css_state + ' ' + css_showtoolbar + '">';

    //begin metadata

    html += '<div class="metadata" >';

    html += '<div class="tags">';
    html += '<select id="tag_select">';
    html += '</select>';
    html += '</div>';
    html += '<div class="actions">';
    html += '<ul id="actionMenu" class="actionMenu" >';
    html += '</ul>';
    html += '</div>';
    html += '</div>';
    //end metadata

    //begin designer
    html += '<div class="designer">';

    // begin tools
    html += '<div class="flow_tools">';
    html += '<div class="left">';
    html += '<a class="nav_btn">&nbsp;</a>';
    html += '</div>';
    html += '<div class="right">';
    if ($this.show_code_btn) {
      html += '<a class="code_btn" title="code">&nbsp;</a>';
    }
    if ($this.show_scale_btn) {
      html += '<a class="scale_down_btn" title="缩小">-</a>';
      html += '<a class="scale_info" title="还原"><span class="scale_value">100</span><span>%</span></a>';
      html += '<a class="scale_up_btn"  title="放大">+</a>';
    }
    if ($this.show_small_btn) {
      html += '<a class="thumbnail_btn"  title="缩略图">&nbsp;</a>';
    }
    html += '</div>';

    html += '</div>';
    //end tools

    //begin flow_thumbnail
    html += '<div class="flow_thumbnail">';
    html += '<div class="flow_thumbnail_mask"></div>';
    html += '</div>';
    //end flow_thumbnail

    //begin canvasContainer
    var bgstyle = "";
    if (!$this.show_grid) {
      bgstyle = "background:none";
    }

    html += '<div id="canvasContainer" class="canvasContainer" style="' + bgstyle + '">';
    html += '<div id="canvas" class="canvas" ></div>';
    html += '</div>';
    //end canvasContainer

    //begin codeContainer
    html += '<div id="codeContainer" class="codeContainer">';
    html += '<textarea></textarea>';
    html += '</div>';

    html += '</div>';
    //end designer

    html += '</div>';

    var htmlEl = andflow_util.parseHtml(html);

    document.getElementById(containerId).innerHTML = '';
    document.getElementById(containerId).appendChild(htmlEl);

    document.getElementById(containerId).style.position = document.getElementById(containerId).style.position || 'relative';

    //nav button  
    andflow_util.setAttr('#' + containerId + ' .nav_btn', 'state', 'open');
    //thumbnail
    andflow_util.setAttr('#' + containerId + ' .thumbnail_btn', 'state', 'close');


  },


  //定时动画
  _initAnimaction: function () {
    var $this = this;
    var dashstyle = ['0 1 1', '1 1 1'];

    this.animation_timer && clearInterval(this.animation_timer);
    this.animation_timer = setInterval(function () {

      var conn_list = $this._plumb.getAllConnections();
      for (var i in conn_list) {

        var conn = conn_list[i];
        var link = $this.getLinkInfo(conn.sourceId, conn.targetId);
        if (link.animation) {
          var arrow_source = conn.getOverlay("arrow_source");
          var arrow_target = conn.getOverlay("arrow_target");
          //方向

          var diract = 0;
          if (!arrow_source.visible && arrow_target.visible) {
            diract = 1;
          } else if (arrow_source.visible && !arrow_target.visible) {
            diract = 2;
          }

          var arrow = conn.getOverlay("animation");
          arrow.setVisible(true);

          if (diract == 1) {
            arrow.loc = arrow.loc + 0.05;
            if (arrow.loc > 0.9) {
              arrow.loc = 0.1;
            }
          } else if (diract == 2) {
            arrow.loc = arrow.loc - 0.05;
            if (arrow.loc < 0.1) {
              arrow.loc = 0.9;
            }
          } else {
            if (arrow.diract == null || arrow.diract == 1) {
              arrow.loc = arrow.loc + 0.05;
              if (arrow.loc > 0.9) {
                arrow.diract = 2;
              }
            } else {
              arrow.loc = arrow.loc - 0.05;
              if (arrow.loc < 0.1) {
                arrow.diract = 1;
              }
            }

          }

        } else {
          var arrow = conn.getOverlay("animation");
          arrow.setVisible(false);
        }

      }

    }, 100);

  },


  _initEvents: function () {
    var $this = this;
    var containerId = $this.containerId;
    var containerEl = document.getElementById(containerId);

    //nav btn
    andflow_util.addEventListener(containerEl.querySelector('.nav_btn'), 'click', function (e) {

      var state = andflow_util.getAttr('#' + $this.containerId + ' .nav_btn', 'state');

      if (state == 'open') {
        andflow_util.setAttr('#' + containerId + ' .nav_btn', 'state', 'close');
        andflow_util.addClass('#' + containerId + ' .andflow', 'fold');
        andflow_util.addClass('#' + containerId + ' .nav_btn', 'close');

      } else {
        andflow_util.setAttr('#' + containerId + ' .nav_btn', 'state', 'open');
        andflow_util.removeClass('#' + containerId + ' .andflow', 'fold');
        andflow_util.removeClass('#' + containerId + ' .nav_btn', 'close');

      }
    });

    //scale 
    andflow_util.addEventListener(containerEl.querySelector('.scale_up_btn'), 'click', function (e) {

      var value = document.querySelector('#' + containerId + ' .scale_value').innerHTML * 1.0;


      value = value + 1;
      var v = value / 100.0;

      andflow_util.setStyle('#' + containerId + ' .canvas', 'transform', 'scale(' + v + ')');


      document.querySelector('#' + containerId + ' .scale_value').innerHTML = value;

    });
    //scale down
    andflow_util.addEventListener(containerEl.querySelector('.scale_down_btn'), 'click', function (e) {

      var value = document.querySelector('#' + containerId + ' .scale_value').innerHTML * 1.0;


      value = value - 1;
      var v = value / 100.0;

      andflow_util.setStyle('#' + containerId + ' .canvas', 'transform', 'scale(' + v + ')');

      document.querySelector('#' + containerId + ' .scale_value').innerHTML = value;

    });
    //scale info  
    andflow_util.addEventListener(containerEl.querySelector('.scale_info'), 'click', function (e) {

      andflow_util.setStyle('#' + containerId + ' .canvas', 'transform', 'scale(1)');

      document.querySelector('#' + containerId + ' .scale_value').innerHTML = '100';

    });


    //drag and move start, canvas mouse down
    andflow_util.addEventListener(containerEl.querySelector('.canvas'), $this.mousedown_event_name, function (e) {

      if (!e.target || !e.target.className || !e.target.className.indexOf || e.target.className.indexOf('canvas') < 0) {
        return;
      }

      var pageX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
      var pageY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;

      var offsetX = e.offsetX;
      var offsetY = e.offsetY;

      if (!offsetX) {
        offsetX = pageX - andflow_util.getPageLeft('#' + containerId + ' .canvas');
      }
      if (!offsetY) {
        offsetY = pageY - andflow_util.getPageTop('#' + containerId + ' .canvas');
      }

      andflow_util.setAttr('#' + containerId + ' .canvas', 'drag', 'true');
      andflow_util.setAttr('#' + containerId + ' .canvas', 'offset_x', offsetX);
      andflow_util.setAttr('#' + containerId + ' .canvas', 'offset_y', offsetY);
      andflow_util.setAttr('#' + containerId + ' .canvas', 'page_x', pageX);
      andflow_util.setAttr('#' + containerId + ' .canvas', 'page_y', pageY);
      andflow_util.addClass('#' + containerId + ' .canvas', 'canvas-move');

      $this._resizeCanvas();

    });

    //canvas mouseup
    andflow_util.addEventListener(containerEl.querySelector('.canvas'), $this.mouseup_event_name, function (e) {

      var drag = andflow_util.getAttr('#' + containerId + ' .canvas', 'drag');
      if (drag == "true") {
        $this._onCanvasChanged();
      }

      andflow_util.setAttr('#' + containerId + ' .canvas', 'drag', 'false');
      andflow_util.removeClass('#' + containerId + ' .canvas', 'canvas-move');

      //click
      if ($this.event_canvas_click) {
        if ($this.event_canvas_dblclick) {
          $this._timer_action && clearTimeout($this._timer_action);
          $this._timer_action = setTimeout(function () {
            $this.event_canvas_click(e);
          }, 300);

        } else {
          $this.event_canvas_click(e);
        }
      }
      e.preventDefault();
    });
    //canvas mouse out
    andflow_util.addEventListener(containerEl.querySelector('.canvas'), 'mouseout', function (e) {

      andflow_util.setAttr('#' + containerId + ' .canvas', 'drag', 'false');

    });
    //canvas mousemove
    andflow_util.addEventListener(containerEl.querySelector('.canvas'), $this.mousemove_event_name, function (e) {

      var drag = andflow_util.getAttr('#' + containerId + ' .canvas', 'drag');

      if (drag == "true") {


        let startOffsetX = andflow_util.getAttr('#' + containerId + ' .canvas', 'offset_x');
        let startOffsetY = andflow_util.getAttr('#' + containerId + ' .canvas', 'offset_y');

        var endPageX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
        var endPageY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;

        var endOffsetX = e.offsetX;
        var endOffsetY = e.offsetY;

        if (!endOffsetX) {
          endOffsetX = endPageX - andflow_util.getPageLeft('#' + containerId + ' .canvas');

        }
        if (!endOffsetY) {
          endOffsetY = endPageY - andflow_util.getPageTop('#' + containerId + ' .canvas');
        }



        let offsetX = endOffsetX - startOffsetX;
        let offsetY = endOffsetY - startOffsetY;


        var scrollLeft = document.querySelector('#' + containerId + ' .canvasContainer').scrollLeft - offsetX;
        var scrollTop = document.querySelector('#' + containerId + ' .canvasContainer').scrollTop - offsetY;
        document.querySelector('#' + containerId + ' .canvasContainer').scrollLeft = scrollLeft;
        document.querySelector('#' + containerId + ' .canvasContainer').scrollTop = scrollTop;
      }
    });

    // bind a double click listener to "canvas"; add new node when this occurs.
    andflow_util.addEventListener(document.querySelector('.canvas'), $this.dblclick_event_name, function (e) {

      if ($this.event_canvas_dblclick) {
        $this._timer_action && clearTimeout($this._timer_action);
        $this.event_canvas_dblclick(e);
      }
    });

    //show code 
    andflow_util.addEventListener(containerEl.querySelector('.code_btn'), 'click', function (e) {

      try {

        if (andflow_util.isVisible('#codeContainer')) {
          if ($this.editable) {
            var txt = andflow_util.getValue('#codeContainer textarea') || "{}";

            var m = JSON.parse(txt);

            $this.showFlow(m);
          }


          andflow_util.hide('#codeContainer');
          andflow_util.removeClass('#' + containerId + ' .code_btn', 'design');
        } else {
          var code = $this.getFlow();
          var content = JSON.stringify(code, null, '\t');
          andflow_util.setValue('#codeContainer textarea', content);

          andflow_util.show('#codeContainer');
          andflow_util.addClass('#' + containerId + ' .code_btn', 'design');

        }

      } catch (e) {
        console.error(e);
      }

    });

    //thumbnail
    //thumbnail_btn click
    andflow_util.addEventListener(containerEl.querySelector('.thumbnail_btn'), 'click', function (e) {

      var state = andflow_util.getAttr('#' + containerId + ' .thumbnail_btn', 'state');

      if (state == 'open') {
        andflow_util.setAttr('#' + containerId + ' .thumbnail_btn', 'state', 'close');

        andflow_util.hide('#' + containerId + ' .flow_thumbnail');

        andflow_util.removeClass('#' + containerId + ' .thumbnail_btn', 'open');

      } else {
        andflow_util.setAttr('#' + containerId + ' .thumbnail_btn', 'state', 'open');


        andflow_util.show('#' + containerId + ' .flow_thumbnail');

        andflow_util.addClass('#' + containerId + ' .thumbnail_btn', 'open');


        $this._showThumbnail();

      }
    });

    //thumbnail_mask
    andflow_util.addEventListener(containerEl.querySelector('.flow_thumbnail_mask'), $this.mousedown_event_name, function (e) {

      var xx = e.pageX;
      var yy = e.pageY;

      andflow_util.addEventListener(containerEl, $this.mousemove_event_name, function (e) {

        var elSel = '#' + containerId + ' .flow_thumbnail_mask';

        var el = document.querySelector(elSel);
        var parentEl = el.parentElement;

        if (el) {
          var x = e.pageX - xx;
          var y = e.pageY - yy;

          if (x < 0) {
            x = 0;
          }
          if (y < 0) {
            y = 0;
          }

          if (x + el.offsetWidth > parentEl.offsetWidth) {
            x = (parentEl.offsetWidth - el.offsetWidth);
          }
          if (y + el.offsetHeight > parentEl.offsetHeight) {
            y = (parentEl.offsetHeight - el.offsetHeight);
          }

          andflow_util.setStyle(elSel, 'left', x + 'px');
          andflow_util.setStyle(elSel, 'top', y + 'px');

          var canvasEl = document.querySelector('#' + containerId + ' .canvas');
          var canvasContainerEl = canvasEl.parentElement;

          var sca = canvasContainerEl.offsetWidth / el.offsetWidth;


          var l = el.offsetLeft * sca;
          var t = el.offsetTop * sca;

          canvasContainerEl.scrollLeft = l;
          canvasContainerEl.scrollTop = t;


        }

      });
    });


    andflow_util.addEventListener(document.getElementById(containerId), $this.mouseup_event_name, function (e) {

      if (e.target && e.target.className && e.target.className.indexOf && e.target.className.indexOf('canvas') >= 0) {
        document.querySelectorAll('.canvas .focus').forEach(function (e) {
          andflow_util.removeClass(e, 'focus');
        });
      }

      //helper
      var drag_helperEl = document.getElementById('drag_helper');
      if (drag_helperEl) {

        //drop helper
        var canvasEl = document.querySelector('#' + $this.containerId + ' .canvas');

        var ll = drag_helperEl.getAttribute("p_x") || 10;
        var tt = drag_helperEl.getAttribute("p_y") || 10;

        var pageX = drag_helperEl.getAttribute("page_x") || 0;
        var pageY = drag_helperEl.getAttribute("page_y") || 0;

        if (pageX >= 0 && pageY >= 0) {
          var l = pageX - andflow_util.getPageLeft(canvasEl) - ll * 1;
          var t = pageY - andflow_util.getPageTop(canvasEl) - tt * 1;

          if (l >= 0 && t >= 0) {
            $this._dropComponent($this._drag_name, l, t);
          }
        }
        //remove helper 
        andflow_util.removeElement(drag_helperEl)
      }


      //move event
      andflow_util.removeEventListener(this, $this.mousemove_event_name);

      andflow_util.setStyle('#' + $this.containerId, 'cursor', 'default');

      $this._drag_name = null;


    });



  },
  //初始化样式
  _initTheme: function (theme) {
    this.setTheme(theme);
  },



  //初始化action 列表
  _initMetadata: function () {
    var $this = this;

    var tags = this.tags || [];
    var metadata = this.metadata || [];

    if (tags == null) {
      tags = [];
    }
    if (metadata == null) {
      metadata = [];
    }

    //初始化控件脚本
    var scripts = '<script>\n';
    for (var i in metadata) {
      scripts += metadata[i].params_script || '';
      scripts += '\n';
    }
    scripts += '</script>';

    var scriptsEl = andflow_util.parseHtml(scripts);

    document.body.appendChild(scriptsEl);


    //初始化action模板元数据
    var tag_selectEl = document.querySelector('#tag_select');

    if (tag_selectEl) {
      var tpdata = [];
      tag_selectEl.innerHTML = '';


      var tagEl = andflow_util.parseHtml('<option value="">' + $this.lang.metadata_tag_all + '</option>');

      tag_selectEl.appendChild(tagEl);


      for (var i in tags) {
        var t = tags[i];
        if (t == null || t == '') {
          continue;
        }
        tag_selectEl.appendChild(andflow_util.parseHtml('<option value="' + t + '">' + t + '</option>'));


      }
      andflow_util.addEventListener(document.getElementById('tag_select'), 'change', function (e) {


        var tag = andflow_util.getValue('#tag_select');

        $this._showMetadata(tag);
      });

      //加载Action元数据
      var tag = andflow_util.getValue('#tag_select');
      $this._showMetadata(tag);
    } else {
      $this._showMetadata('');
    }

  },


  _dropComponent: function (name, left, top) {
    var $this = this;

    var metaInfo = $this.getMetadata(name);
    if (!metaInfo) {
      return;
    }
    if (metaInfo.tp == "group") {
      var groupId = 'group_' + andflow_util.uuid().replaceAll('-', '');
      var group = { id: groupId, name: metaInfo.name, left: left, top: top, members: [] };


      $this._createGroup(group);

    } else if (metaInfo.tp == "list") {
      var listId = 'list_' + andflow_util.uuid().replaceAll('-', '');
      var list = { id: listId, name: metaInfo.name, left: left, top: top, items: [] };

      $this._createList(list);

    } else if (metaInfo.tp == "tip") {
      var tipId = 'tip_' + andflow_util.uuid().replaceAll('-', '');
      var tip = { id: tipId, name: metaInfo.name, left: left, top: top, content: "" };
      $this._createTip(tip);

    } else {
      var actionId = andflow_util.uuid().replaceAll('-', '');
      var action = { id: actionId, left: left, top: top, name: name, params: {} };

      if (metaInfo != null) {
        for (var i in metaInfo.params) {
          var p = metaInfo.params[i];
          var name = p.name;
          var defaultValue = p.default;
          if (defaultValue) {
            action.params[name] = defaultValue;
          }
        }
      }

      //开始节点只有一个
      if (name == 'begin') {
        var beginEl = document.querySelector(".action[name='begin']");
        if (beginEl) {
          return;
        }

      }
      //结束节点只有一个
      if (name == 'end') {
        var endEl = document.querySelector(".action[name='end']");

        if (endEl) {
          return;
        }
      }
      action.title = action.title || metaInfo.title;

      $this._createAction(action);

    }
  },


  _initPlumb: function () {
    var $this = this;

    if ($this._plumb != null) {
      $this._plumb.destroy();

      document.querySelector('#' + this.containerId + ' #canvas').innerHTML = '';


    }

    var linkType = this.flowModel.link_type || 'Flowchart';

    var link_color = this._themeObj.default_link_color;
    var link_radius = this._themeObj.default_link_radius;
    var link_strokeWidth = this._themeObj.default_link_strokeWidth;
    var link_color_hover = this._themeObj.default_link_color_hover;
    var link_strokeWidth_hover = this._themeObj.default_link_strokeWidth_hover;

    var link_outlineWidth = this._themeObj.default_link_outlineWidth;

    var endpoint_stroke_color = this._themeObj.default_endpoint_stroke_color;
    var endpoint_stroke_color_hover = this._themeObj.default_endpoint_stroke_color_hover;
    var endpoint_fill_color = this._themeObj.default_endpoint_fill_color;
    var endpoint_fill_color_hover = this._themeObj.default_endpoint_fill_color_hover;

    var endpoint_radius = this._themeObj.default_endpoint_radius;
    var endpoint_radius_hover = this._themeObj.default_endpoint_radius_hover;
    var endpoint_strokeWidth = this._themeObj.default_endpoint_strokeWidth;
    var endpoint_strokeWidth_hover = this._themeObj.default_endpoint_strokeWidth_hover;

    var cc = $this._connectionTypes[linkType].connector;
    cc.cornerRadius = link_radius;
    this._plumb = jsPlumb.getInstance({
      Endpoint: ['Dot', { radius: 5 }],
      Connector: cc,
      Anchor: "Center",
      EndpointStyle: {
        stroke: endpoint_stroke_color,
        fill: endpoint_fill_color,
        radius: endpoint_radius,
        strokeWidth: endpoint_strokeWidth,
      }, //端点的颜色样式
      EndpointHoverStyle: {
        stroke: endpoint_stroke_color_hover,
        fill: endpoint_fill_color_hover,
        radius: endpoint_radius_hover,
        strokeWidth: endpoint_strokeWidth_hover,
      },
      PaintStyle: {
        stroke: link_color,
        radius: link_radius,
        strokeWidth: link_strokeWidth,
        outlineStroke: 'transparent',
        outlineWidth: link_outlineWidth,
      },
      HoverPaintStyle: {
        stroke: link_color_hover,
        strokeWidth: link_strokeWidth_hover,
      },

      ConnectionOverlays: [
        [
          'Arrow',
          {
            location: 0,
            id: 'arrow_source',
            length: 10,
            width: 10,
            direction: -1,
            foldback: 0.8,
            show: false,
          },

        ],
        [
          'Label',
          {
            label: 'X',
            id: 'label_remove',
            cssClass: 'linkBtn',
            visible: false,
            events: {
              tap: function (conn, e) {
                $this._plumb.deleteConnection(conn.component);
              },
            },
          },
        ],
        [
          'Label',
          {
            label: '',
            id: 'label',
            cssClass: 'linkLabel',
            visible: false
          },
        ],
        [
          'Label',
          {
            id: 'label_source',
            location: 20,
            label: '',
            cssClass: 'linkLabelSource',
            visible: false
          },
        ],
        [
          'Label',
          {
            id: 'label_target',
            location: -20,
            label: '',
            cssClass: 'linkLabelTarget',
            visible: false
          },
        ],
        [
          'Arrow',
          {
            location: 1,
            id: 'arrow_target',
            length: 10,
            width: 10,
            foldback: 0.8,
            show: true,
          },
        ],

        [
          'Arrow',
          {
            location: 0.5,
            id: 'arrow_middle',
            length: 10,
            width: 10,
            foldback: 0.8,
            show: false,
          },
        ],
        [
          'Diamond',
          {
            location: 0.5,
            id: 'animation',
            length: 10,
            width: 10,
            show: false,
          },
        ],
      ],
      Container: 'canvas',
    });

    for (var t in $this._connectionTypes) {
      $this._plumb.registerConnectionType(t, $this._connectionTypes[t]);
    }

    //监听新的连接
    this._plumb.bind('connection', function (info, event) {
      try {
        var sourceId = info.sourceId;
        var targetId = info.targetId;

        var link = info.connection.data;
        if (link == null) {
          link = $this._linkInfos[sourceId + '-' + targetId];
          if (link == null) {
            link = {};
          }
        }
        link['source_id'] = sourceId;
        link['target_id'] = targetId;

        $this._linkInfos[sourceId + '-' + targetId] = link;

        $this._paintConnection(info.connection, link);

        $this._onCanvasChanged();
      } catch (e) { }
    });

    this._plumb.bind('connectionDetached', function (conn) {
      var sourceId = conn.sourceId;
      var targetId = conn.targetId;

      $this.delLinkInfo(sourceId, targetId);

      $this._plumb.repaintEverything();
    });

    this._plumb.bind('connectionMoved', function (info) {
      var sourceId = info.originalSourceId;
      var targetId = info.originalTargetId;

      $this.delLinkInfo(sourceId, targetId);

      $this._plumb.repaintEverything();
    });

    this._plumb.bind('beforeDetach', function (conn) {
      if ($this.editable) {
        return true;
      }
      return false;
    });



    //自动避免重复连线
    this._plumb.bind('beforeDrop', function (conn) {

      if (!$this.editable) {
        return false;
      }

      //return true;
      var sourceId = conn.sourceId;
      var targetId = conn.targetId;

      var linkData = $this._linkInfos[sourceId + '-' + targetId];
      if (linkData != null) {
        return false;
      }

      return true;
    });

    this._plumb.bind('click', function (conn, event) {
      if ($this.editable) {
        event.preventDefault();

        if ($this.event_link_click && $this.event_link_dblclick) {
          $this._timer_link && clearTimeout($this._timer_link);
          $this._timer_link = setTimeout(function () {
            var sourceId = conn.sourceId;
            var targetId = conn.targetId;
            var link = $this.getLinkInfo(sourceId, targetId);
            $this.event_link_click(link);
          }, 300);
        } else if ($this.event_link_click) {
          var sourceId = conn.sourceId;
          var targetId = conn.targetId;
          var link = $this.getLinkInfo(sourceId, targetId);
          $this.event_link_click(link);

        }
      }
    });

    this._plumb.bind('dblclick', function (conn, event) {
      event.preventDefault();

      if ($this.editable) {
        if ($this.event_link_dblclick) {
          $this._timer_link && clearTimeout($this._timer_link);
          var sourceId = conn.sourceId;
          var targetId = conn.targetId;
          var link = $this.getLinkInfo(sourceId, targetId);
          $this.event_link_dblclick(link);

        }
      }
    });



  },

  /**
   * 设置左边Action菜单
   * @param Data
   */
  _showMetadata: function (tag) {

    var $this = this;
    var list = this.metadata;
    //先进行分组
    var groups = {};
    for (var i in list) {
      if (tag && tag.length > 0 && list[i].tag && list[i].tag.length > 0) {
        if (list[i].tag != tag) {
          continue;
        }
      }

      var group = list[i].group || '通用';

      if (groups[group] == null) {
        groups[group] = [];
      }
      groups[group].push(list[i]);
    }

    //按分组输出到Html
    document.getElementById('actionMenu').innerHTML = '';


    var index = 0;
    for (var g in groups) {
      var openClass = index == 0 ? 'menu-is-opening menu-open' : '';
      var openBody = index == 0 ? '' : 'display:none';

      if (index > 0) {
        var group_spliter_html = '<li class="actionMenuSpliter"  ></li>';
        document.getElementById('actionMenu').appendChild(andflow_util.parseHtml(group_spliter_html));

      }

      var group_title_html = '<li class="actionMenuGroup"  ><a href="#" class="group-title"><span class="group-label">' + g + '</span></a></li>';
      document.getElementById('actionMenu').appendChild(andflow_util.parseHtml(group_title_html));

      var item = groups[g];
      for (var i in item) {
        var name = item[i].name;
        var title = item[i].title;
        var icon = item[i].icon || 'img/node.png';

        var img = '';
        if (icon && icon.length > 0) {
          img = '<img src="' + ($this.img_path || '') + icon + '" draggable="false" />';
        }

        var element_html =
          '<li id="' +
          name +
          '"  action_name="' +
          name +
          '" action_title="' +
          title +
          '" class="actionMenuItem"  action_icon="' +
          icon +
          '" ><a class="item-title">' +
          img +
          '<span class="item-label">' + title + '</span>' +
          '</a></li>';

        document.getElementById('actionMenu').appendChild(andflow_util.parseHtml(element_html));

      }


      index++;
    }

    document.querySelectorAll('#actionMenu .actionMenuItem').forEach(function (item, index) {

      andflow_util.addEventListener(item, $this.mousedown_event_name, function (e) {

        //如果是编码状态不可拖动 
        if (andflow_util.isVisible('#codeContainer')) {
          return;
        }

        var name = this.getAttribute("action_name");

        $this._drag_name = name;
        andflow_util.addEventListener(document.querySelector('#' + $this.containerId + " .andflow"), $this.mousemove_event_name, function (e) {
          if ($this._drag_name == null) {
            return;
          }

          var endflowEl = document.querySelector('#' + $this.containerId + ' .andflow');

          var helper = document.getElementById('drag_helper');

          if (!helper) {
            helper = $this._createHelper($this._drag_name);
            if (helper == null) {
              return;
            }
            endflowEl.appendChild(helper);

          }

          var ll = helper.offsetWidth / 2 || 10;
          var tt = helper.offsetHeight / 2 || 10;


          var pageX = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
          var pageY = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;

          var x = pageX - andflow_util.getPageLeft(endflowEl) - ll;
          var y = pageY - andflow_util.getPageTop(endflowEl) - tt;


          helper.style.left = x + "px";
          helper.style.top = y + "px";
          helper.setAttribute('p_x', ll);
          helper.setAttribute('p_y', tt);

          helper.setAttribute('page_x', pageX);
          helper.setAttribute('page_y', pageY);


        });

      });

    });




  },
  _createHelper: function (action_name) {
    var $this = this;

    if (action_name == null) return;
    var metadata = $this.getMetadata(action_name);
    if (metadata == null) return;

    var icon = metadata.icon;
    var title = metadata.title;

    var helperHtml = '<div class="action-drag"></div>';

    var contentHtml = '<div class="action-drag-main" ><div class="action-header">' + title + '</div><div class="action-icon"><img src="' +
      ($this.img_path || '') +
      icon + '"  draggable="false"/></div></div>';

    if (metadata.tp == "group") {
      helperHtml = '<div class="group-drag"></div>';
      contentHtml = '<div class="group-drag-main"><div class="group-header">' + title + '</div><div class="group-body"></div></div>';
    } else if (metadata.tp == "list") {
      helperHtml = '<div class="list-drag"></div>';
      contentHtml = '<div class="list-drag-main"><div class="list-header">' + title + '</div><div class="list-body"></div></div>';
    } else if (metadata.tp == "tip") {
      helperHtml = '<div class="tip-drag"></div>';
      contentHtml = '<div class="tip-drag-main"><div class="tip-header"></div><div class="tip-body">' + title + '</div></div>';
    } else {
      helperHtml = '<div class="action-drag"></div>';

      contentHtml = '<div class="action-drag-main" ><div class="action-header">' + title + '</div><div class="action-icon"><img src="' +
        ($this.img_path || '') +
        icon + '" draggable="false"/></div></div>';
    }

    var render = metadata.render_helper || metadata.render || $this.render_action_helper;
    if (render) {
      let r = render(metadata);
      if (r != null && r.length > 0) {
        contentHtml = r;
      }
    }

    var helperEl = andflow_util.parseHtml(helperHtml);
    var contentEl = andflow_util.parseHtml(contentHtml);

    helperEl.appendChild(contentEl);
    helperEl.setAttribute('id', 'drag_helper');
    helperEl.style.position = 'absolute';
    helperEl.querySelectorAll('img').forEach(element => {
      element.setAttribute('draggable', 'false');
    });

    return helperEl;

  },


  _createGroup: function (group) {
    var $this = this;

    var id = group.id;
    var name = group.name;
    if (id == null) {
      return;
    }
    if (name == null) {
      return;
    }

    var members = group.members || [];

    var group_meta = this.getMetadata(name) || {};

    var groupElement = document.getElementById(group.id);

    if (!groupElement) {
      var groupHtml = '<div id="' + group.id + '" class="group group-container" > </div>';
      groupElement = andflow_util.parseHtml(groupHtml);

      var group_main_html = '<div class="group-main group-master"><div class="group-header"></div><div class="group-body"></div></div>';

      //render
      if (group.render) {

        var r = group.render(group_meta, group, group_main_html);

        if (r && r.length > 0) {
          group_main_html = r;
        }
      } else if (group_meta.render) {
        var r = group_meta.render(group_meta, group, group_main_html);
        if (r && r.length > 0) {
          group_main_html = r;
        }
      }

      var group_main_element = andflow_util.parseHtml(group_main_html);

      //removebtn 
      group_main_element.appendChild(andflow_util.parseHtml('<div class="group-remove-btn">X</div>'));
      //resize
      group_main_element.appendChild(andflow_util.parseHtml('<div class="group-resize"></div>'));

      //endpoint
      var epHtml = '<div class="group-ep" title="拖拉连线">→</div>'; //拖拉连线焦点
      if ($this.render_endpoint) {
        var epr = $this.render_endpoint(group_meta, group, epHtml);
        if (epr && epr.length > 0) {
          epHtml = epr;
        }
      }
      var epElement = andflow_util.parseHtml(epHtml);
      andflow_util.addClass(epElement, 'group-ep');

      group_main_element.appendChild(epElement);

      groupElement.appendChild(group_main_element);

      var canvasElement = document.querySelector('#' + $this.containerId + ' #canvas');
      canvasElement.appendChild(groupElement);

    }

    $this.setGroupInfo(group);


    //plumb add group 
    $this._plumb.addGroup({
      el: groupElement,
      id: group.id,
      orphan: true,
      droppable: true,
      dropOverride: true,
      revert: true,
      endpoint: ["Dot", { radius: 3 }],

      dragOptions: {
        start: function (params) {
          // console.log("start");

        },
        drag: function (params) {
          // console.log("drag");
          // 判断条件，例如拖动超出某个范围时停止拖动
          if (params.pos[0] < 0) { //  X 轴坐标<0 
            params.pos[0] = 0;
            andflow_util.setStyle(params.el, "left", "0px");
          }
          if (params.pos[1] < 0) { //  Y 轴坐标<0 
            params.pos[1] = 0;
            andflow_util.setStyle(params.el, "top", "0px");
          }

        },
        stop: function (params) {
          // console.log("stop");

          if ($this.drag_step > 1) {
            var x = Math.round(params.pos[0] / $this.drag_step) * $this.drag_step;
            var y = Math.round(params.pos[1] / $this.drag_step) * $this.drag_step;

            andflow_util.setStyle(params.el, 'left', x + 'px');
            andflow_util.setStyle(params.el, 'top', y + 'px');

          }

        }

      }

    });



    $this._plumb.makeSource(groupElement, {
      filter: '.group-ep',
      anchor: 'Continuous',
      extract: {
        action: 'the-action',
      }
    });

    //target
    $this._plumb.makeTarget(groupElement, {
      dropOptions: { hoverClass: 'dragHover' },
      anchor: 'Continuous',
      allowLoopback: true,
    });


    // add menmbers
    if (members && members.length > 0) {
      var actionElements = [];
      for (var i in members) {
        actionElements.push(document.getElementById(members[i]));
      }

      $this._plumb.addToGroup(id, actionElements);

    }


    //group mouse up event
    andflow_util.addEventListener(groupElement, $this.mouseup_event_name, function (el) {



      //如果是移动就根据点击来显示编辑
      if ($this.editable && $this.isMobile) {
        document.querySelectorAll(".canvas .group.focus").forEach(function (e, index) {
          andflow_util.removeClass(e, 'focus');
        });
        andflow_util.addClass(groupElement, 'focus');
      }

      $this._onCanvasChanged();

      el.preventDefault();
    });


    //group remove button click
    andflow_util.addEventListener(groupElement.querySelector('.group-remove-btn'), $this.click_event_name, function () {
      andflow_util.confirm('确定删除分组?', function () {
        $this.removeGroup(id);
      });

    });

    //group header dblclick
    andflow_util.addEventListener(groupElement.querySelector('.group-header'), $this.dblclick_event_name, function (event) {
      if ($this.editable) {
        event.preventDefault();

        if (groupElement.querySelector('.content_editor')) {
          return;
        }

        var editorEl = andflow_util.parseHtml('<input class="content_editor"  />');
        andflow_util.setStyle(editorEl, 'position', 'absolute');
        andflow_util.setStyle(editorEl, 'z-index', '9999');
        andflow_util.setStyle(editorEl, 'left', '0px');
        andflow_util.setStyle(editorEl, 'top', '0px');
        andflow_util.setStyle(editorEl, 'width', '100%');
        andflow_util.setStyle(editorEl, 'height', '100%');
        andflow_util.setStyle(editorEl, 'box-sizing', 'border-box');

        andflow_util.setValue(editorEl, groupElement.querySelector('.group-header').innerHTML);


        groupElement.querySelector('.group-header').appendChild(editorEl);

        editorEl.focus();
        andflow_util.addEventListener(editorEl, "blur", function (e) {

          var value = andflow_util.getValue(editorEl);
          editorEl.parentElement.innerHTML = value;

          $this._groupInfos[id].title = value;

          andflow_util.removeElement(editorEl);

        });
        andflow_util.addEventListener(editorEl, "keydown", function (e) {
          if (e.code == "Enter") {
            var value = andflow_util.getValue(editorEl);
            editorEl.parentElement.innerHtml = value;

            $this._groupInfos[id].title = value;

            andflow_util.removeElement(editorEl);

          }

        });
      }
    });

    //group body dblclick
    andflow_util.addEventListener(groupElement.querySelector('.group-body'), $this.dblclick_event_name, function (event) {
      if ($this.editable) {
        event.preventDefault();

        if (groupElement.querySelector('.content_editor')) {
          return;
        }

        var editorEl = andflow_util.parseHtml('<textarea class="content_editor"></textarea>');
        andflow_util.setStyle(editorEl, 'position', 'absolute');
        andflow_util.setStyle(editorEl, 'z-index', '9999');
        andflow_util.setStyle(editorEl, 'left', '0px');
        andflow_util.setStyle(editorEl, 'top', '0px');
        andflow_util.setStyle(editorEl, 'width', '100%');
        andflow_util.setStyle(editorEl, 'height', '100%');
        andflow_util.setStyle(editorEl, 'box-sizing', 'border-box');



        andflow_util.setValue(editorEl, groupElement.querySelector('.group-body').innerHTML);

        groupElement.querySelector('.group-body').appendChild(editorEl);

        editorEl.focus();

        andflow_util.addEventListener(editorEl, "blur", function (e) {
          var value = andflow_util.getValue(editorEl);
          editorEl.parentElement.innerHTML = value;
          $this._groupInfos[id].des = value;

          andflow_util.removeElement(editorEl);

        });

      }
    });


    //group resize event
    andflow_util.addEventListener(groupElement.querySelector('.group-resize'), $this.mousedown_event_name, function (e) {
      var containerEl = document.querySelector('#' + $this.containerId);
      containerEl.style.cursor = 'nwse-resize';

      var group_main = groupElement.querySelector(".group-master");
      // var x1 = e.pageX;
      // var y1 = e.pageY;

      var x1 = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
      var y1 = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;


      var width = group_main.offsetWidth;
      var height = group_main.offsetHeight;

      andflow_util.addEventListener(containerEl, $this.mousemove_event_name, function (e) {
        // var x2 = e.pageX;
        // var y2 = e.pageY;

        var x2 = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
        var y2 = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;


        var w = width + (x2 - x1);
        var h = height + (y2 - y1);

        andflow_util.setStyle(group_main, 'width', w + 'px');
        andflow_util.setStyle(group_main, 'height', h + 'px');


        andflow_util.setAttr(groupElement, 'width', w);
        andflow_util.setAttr(groupElement, 'height', h);


        $this._plumb.repaintEverything();

        $this._onCanvasChanged();

        e.preventDefault();
      });
      e.preventDefault();
    });






    $this._onCanvasChanged();

  }, //end createGroup

  //添加列表
  _createList: function (list) {
    var $this = this;
    var id = list.id;
    if (id == null) {
      return;
    }

    var meta = this.getMetadata(name) || {};

    var listElement = document.querySelector('#' + $this.containerId + ' #' + list.id);
    if (!listElement) {
      var html = '<div id="' + list.id + '" class="list list-container">';
      html += '<div class="list-remove-btn">X</div>';
      html += '<div class="list-resize"></div>';
      html += '<div class="list-main">';//begin main
      html += '<div class="list-header"></div>';
      html += '<div class="list-body"></div>';
      html += '</div>'; //end main 
      html += '</div>'; //end list 
      listElement = andflow_util.parseHtml(html);

      var canvasElement = document.querySelector('#' + $this.containerId + ' #canvas');
      canvasElement.appendChild(listElement);

    }


    $this.setListInfo(list);

    //event
    andflow_util.addEventListener(listElement, $this.mouseup_event_name, function () {
      if ($this.editable && $this.isMobile) {
        document.querySelectorAll('.focus').forEach(function (e) {
          andflow_util.removeClass(e, 'focus');
        });
        andflow_util.addClass(listElement, 'focus');
      }

      $this._onCanvasChanged();
    });
    andflow_util.addEventListener(listElement.querySelector('.list-remove-btn'), $this.click_event_name, function () {
      andflow_util.confirm('确定删除?', function () {
        $this.removeList(id);
      });

    });

    //resize
    var list_main = listElement.querySelector(".list-main");

    andflow_util.addEventListener(listElement.querySelector('.list-resize'), $this.mousedown_event_name, function (e) {

      var containerEl = document.getElementById($this.containerId);
      containerEl.style.cursor = 'nwse-resize';

      var x1 = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
      var y1 = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;


      var width = list_main.offsetWidth;
      var height = list_main.offsetHeight;

      andflow_util.addEventListener(containerEl, $this.mousemove_event_name, function (e) {


        var x2 = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
        var y2 = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;


        var w = width + (x2 - x1);
        var h = height + (y2 - y1);

        andflow_util.setStyle(list_main, 'width', w + 'px');
        andflow_util.setStyle(list_main, 'height', h + 'px');

        andflow_util.setAttr(listElement, 'width', w);
        andflow_util.setAttr(listElement, 'height', h);

        $this._plumb.repaintEverything();

        $this._onCanvasChanged();

        e.preventDefault();
      });
      e.preventDefault();
    });

    andflow_util.addEventListener(listElement.querySelector('.list-header'), $this.dblclick_event_name, function (event) {

      if ($this.editable) {

        event.preventDefault();

        if (listElement.querySelector('.content_editor')) {
          return;
        }

        let editorEl = andflow_util.parseHtml('<input class="content_editor"  />');
        andflow_util.setStyle(editorEl, 'position', 'absolute');
        andflow_util.setStyle(editorEl, 'z-index', '9999');
        andflow_util.setStyle(editorEl, 'left', '0px');
        andflow_util.setStyle(editorEl, 'top', '0px');
        andflow_util.setStyle(editorEl, 'width', '100%');
        andflow_util.setStyle(editorEl, 'height', '100%');
        andflow_util.setStyle(editorEl, 'box-sizing', 'border-box');

        andflow_util.setValue(editorEl, listElement.querySelector('.list-header').innerHTML);

        listElement.querySelector('.list-header').appendChild(editorEl);

        editorEl.focus();
        andflow_util.addEventListener(editorEl, "blur", function (e) {
          var value = andflow_util.getValue(editorEl);

          editorEl.parentElement.innerHTML = value;
          $this._listInfos[id].title = value;

          andflow_util.removeElement(editorEl);

          $this._onCanvasChanged();
        });

        andflow_util.addEventListener(editorEl, "keydown", function (e) {
          if (e.code == "Enter") {
            var value = andflow_util.getValue(editorEl);

            editorEl.parentElement.innerHTML = value;

            $this._listInfos[id].title = value;

            andflow_util.removeElement(editorEl);

            $this._onCanvasChanged();

          }

        });

      }

    });

    andflow_util.addEventListener(listElement.querySelector('.list-body'), $this.dblclick_event_name, function (event) {

      if ($this.editable) {

        event.preventDefault();

        if (listElement.querySelector('.content_editor')) {
          return;
        }

        let editorEl = andflow_util.parseHtml('<textarea></textarea>');

        andflow_util.addClass(editorEl, 'content_editor');
        andflow_util.setStyle(editorEl, 'position', 'absolute');
        andflow_util.setStyle(editorEl, 'z-index', '9999');
        andflow_util.setStyle(editorEl, 'left', '0px');
        andflow_util.setStyle(editorEl, 'top', '0px');
        andflow_util.setStyle(editorEl, 'width', '100%');
        andflow_util.setStyle(editorEl, 'height', '100%');
        andflow_util.setStyle(editorEl, 'box-sizing', 'border-box');

        var items = $this._listInfos[id].items;

        var rows = '';

        if (items && items.length > 0) {
          for (var i in items) {
            rows += items[i].title + '\n';
          }
        }

        andflow_util.setValue(editorEl, rows);

        listElement.querySelector('.list-body').appendChild(editorEl);

        editorEl.focus();
        andflow_util.addEventListener(editorEl, "blur", function (e) {

          var value = andflow_util.getValue(this);


          var rows = value.split("\n");

          var items = [];
          for (var i in rows) {
            var itemid = 'list_item_' + id + '_' + i;
            var title = rows[i];
            if (title == null || title.trim() == "") {
              continue;
            }
            var item = { id: itemid, title: rows[i] };
            items.push(item);
          }
          $this.setListItems(id, items);

          $this._onCanvasChanged();

          andflow_util.removeElement(this);

        });

      }
    });

    $this._plumb.draggable(listElement, {
      start: function (params) {
        // console.log("开始拖动:", params);
      },
      drag: function (params) {

        // 判断条件，例如拖动超出某个范围时停止拖动
        if (params.pos[0] < 0) { //  X 轴坐标<0 
          params.pos[0] = 0;
          andflow_util.setStyle(params.el, "left", "0px");
        }
        if (params.pos[1] < 0) { //  Y 轴坐标<0 
          params.pos[1] = 0;
          andflow_util.setStyle(params.el, "top", "0px");
        }

      },
      stop: function (params) {
        if ($this.drag_step > 1) {
          var x = Math.round(params.pos[0] / $this.drag_step) * $this.drag_step;
          var y = Math.round(params.pos[1] / $this.drag_step) * $this.drag_step;

          andflow_util.setStyle(params.el, 'left', x + 'px');
          andflow_util.setStyle(params.el, 'top', y + 'px');

        }
      }

    });

    $this._plumb.addList(listElement, {
      endpoint: ["Rectangle", { width: 20, height: 20 }]
    });

    $this._onCanvasChanged();

  }, //end createList

  _setListItems: function (listid, items) {
    var $this = this;

    var listEl = listid;
    if (typeof listid === 'string') {
      listEl = document.getElementById(listid);
    }

    if (!listEl) {
      return;
    }

    //remove
    if (listEl.querySelector(".list-item")) {
      var tobe_dels = [];
      listEl.querySelectorAll(".list-item").forEach(function (el, index) {

        let el_id = el.id;

        let exist = false;
        for (var i in items) {
          if (el_id == items[i].id) {
            exist = true;
          }
        }
        if (!exist) {
          tobe_dels.push(el);
        }
      });

      for (var i in tobe_dels) {

        let el_id = tobe_dels[i].id;

        $this.removeLinkBySource(el_id);
        $this.removeLinkByTarget(el_id);
        $this._plumb.remove(tobe_dels[i]);

        andflow_util.removeElement(tobe_dels[i]);

      }

    }

    //append
    for (var i in items) {
      var item = items[i];
      if (item.id == null || item.title == null || item.title == '') {
        continue;
      }

      var id = item.id;

      var itemEl = document.getElementById(id);

      if (!itemEl) {

        itemEl = andflow_util.parseHtml('<div id="' + id + '" class="list-item"><div class="list-item-title"></div></div>');

        listEl.querySelector(".list-body").appendChild(itemEl);


        $this._plumb.makeSource(itemEl, {
          allowLoopback: false,
          anchor: ["Left", "Right"]
        });
        $this._plumb.makeTarget(itemEl, {
          allowLoopback: false,
          anchor: ["Left", "Right"]
        });

      }

      itemEl.querySelector(".list-item-title").innerHTML = (item.title || '');

      if (item.item_color) {
        andflow_util.setStyle(itemEl, 'background-color', item.item_color);
      }

      if (item.item_text_color) {
        andflow_util.setStyle(itemEl.querySelector('.list-item-title'), 'color', item.item_text_color);
      }

      if (item.style) {
        for (var n in item.style) {
          andflow_util.setStyle(itemEl, n, item.style[n]);
        }
      }

    }

  },

  _deleteListItem: function (listid, itemid) {
    var $this = this;

    for (var j in $this._listInfos[listid].items) {
      if ($this._listInfos[listid].items[j].id == itemid) {
        $this._listInfos[listid].items[j] = null;
      }
    }

  },

  _getBase64Image: function (img) {
    try {
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL;
    } catch (e) {
      return null;
    }

  },

  //添加节点
  _createAction: function (action) {
    const $this = this;
    const id = action.id;
    if (id == null) {
      return;
    }

    const name = action.name;
    if (name == null) {
      return;
    }
    var action_meta = this.getMetadata(name) || {};

    var actionElement = document.getElementById(action.id);
    if (!actionElement) {

      var actionHtml = '<div id="' + id + '"  draggable="true" ondragend="" class="action-container" ><div  class="action" ></div></div>';

      actionElement = andflow_util.parseHtml(actionHtml);

      //main
      var action_main_html = '<div class="action-main action-master" >';
      action_main_html += '<div class="action-icon" ><img src=""  ></div>';
      action_main_html += '<div class="action-header" ></div>'; //标题  
      action_main_html += '<div class="action-body"  >';
      action_main_html += '<div class="action-content"  ></div>'; //消息内容,html,chart
      action_main_html += '<div class="body-resize"></div>'; //改变Body内容大小的三角形框
      action_main_html += '</div>';
      action_main_html += '</div>'; //end action-main

      var render = action.render || action_meta.render || $this.render_action;

      if (render) {
        var r = render(action_meta, action, action_main_html);
        if (r && r.length > 0) {
          action_main_html = r;
        }
      }
      var action_main_el = andflow_util.parseHtml(action_main_html);
      andflow_util.addClass(action_main_el, 'action-master');

      actionElement.querySelector(".action").appendChild(action_main_el);

      //ep
      var epHtml = '<div class="ep" title="拖拉连线">→</div>'; //拖拉连线焦点
      if ($this.render_endpoint) {
        var epr = $this.render_endpoint(action_meta, action, epHtml);
        if (epr && epr.length > 0) {
          epHtml = epr;
        }
      }
      var epElement = andflow_util.parseHtml(epHtml);
      andflow_util.addClass(epElement, 'ep');

      actionElement.querySelector(".action").appendChild(epElement);

      //resizer
      var resizerHtml = '<div class="action-resize"></div>'; //改变大小的三角形框
      if ($this.render_btn_resize) {
        var resizer_new = $this.render_btn_resize(action_meta, action, resizerHtml);
        if (resizer_new && resizer_new.length > 0) {
          resizerHtml = resizer_new;
        }
      }

      var resizerElement = andflow_util.parseHtml(resizerHtml);
      andflow_util.addClass(resizerElement, 'action-resize');
      actionElement.querySelector(".action").appendChild(resizerElement);

      //remove button 
      var removeBtn = '<a href="javascript:void(0)" class="action-remove-btn"  >X</a>'; //工具栏
      if ($this.render_btn_remove) {
        var removeBtn_new = $this.render_btn_remove(action_meta, action, removeBtn);
        if (removeBtn_new && removeBtn_new.length > 0) {
          removeBtn = removeBtn_new;
        }
      }
      var removeBtnElement = andflow_util.parseHtml(removeBtn);
      andflow_util.addClass(removeBtnElement, 'action-remove-btn');

      actionElement.querySelector(".action").appendChild(removeBtnElement);

      var canvasElement = document.querySelector('#' + $this.containerId + ' #canvas');
      canvasElement.appendChild(actionElement);
    }

    actionElement.id = id;

    this.setActionInfo(action);


    //事件
    //image load
    andflow_util.addEventListener(actionElement.querySelector(".action-icon img"), 'load', function () {
      var d = andflow_util.getAttr(this, 'src');

      if (d.indexOf("data:image/") < 0) {
        var data = $this._getBase64Image(this);
        if (data != null) {
          this.src = data;
        }
      }
    });
    //mouseup
    andflow_util.addEventListener(actionElement, $this.mouseup_event_name, function () {
      $this._onCanvasChanged();
    });

    andflow_util.addEventListener(actionElement.querySelector('.action-remove-btn'), $this.click_event_name, function () {
      andflow_util.confirm('确定删除该节点?', function () {
        $this.removeAction(id);
      });

    });

    andflow_util.addEventListener(actionElement, $this.mousedown_event_name, function (event) {
      andflow_util.setAttr(actionElement, 'mousedown', 'true');
      andflow_util.setAttr(actionElement, 'mousedown_time', new Date().getTime());


    });
    //双击打开配置事件,在设计模式和步进模式下才可以用
    andflow_util.addEventListener(actionElement, $this.mouseup_event_name, function (event) {
      andflow_util.setAttr(actionElement, 'mousedown', 'false');
      //如果是移动就根据点击来显示编辑
      if ($this.editable && $this.isMobile) {
        document.querySelectorAll(".canvas .focus").forEach(function (e, index) {
          andflow_util.removeClass(e, 'focus');
        });

        andflow_util.addClass(actionElement.querySelector(".action"), 'focus');
      }

      if ($this.editable) {
        var act = $this.getAction(id);

        if ($this.event_action_click) {
          if ($this.event_action_dblclick) {
            $this._timer_action && clearTimeout($this._timer_action);
            $this._timer_action = setTimeout(function () {

              $this.event_action_click(action_meta, act);
            }, 300);

          } else {
            $this.event_action_click(action_meta, act);
          }
        }

      }


      event.preventDefault();

    });



    andflow_util.addEventListener(actionElement, $this.dblclick_event_name, function (event) {

      if ($this.editable) {
        if ($this.event_action_dblclick) {
          $this._timer_action && clearTimeout($this._timer_action);
          var act = $this.getAction(id);
          $this.event_action_dblclick(action_meta, act);
        }
      }
      event.preventDefault();
    });


    //改变大小事件，鼠标按下去
    andflow_util.addEventListener(actionElement.querySelector('.action-resize'), $this.mousedown_event_name, function (e) {

      var containerEl = document.getElementById($this.containerId);

      containerEl.style.cursor = 'nwse-resize';

      // var x1 = e.pageX;
      // var y1 = e.pageY;

      var x1 = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
      var y1 = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;

      var width = actionElement.querySelector(".action-master").offsetWidth;
      var height = actionElement.querySelector(".action-master").offsetHeight;

      andflow_util.addEventListener(containerEl, $this.mousemove_event_name, function (e2) {
        // var x2 = e2.pageX;
        // var y2 = e2.pageY;

        var x2 = e2.targetTouches ? e2.targetTouches[0].pageX : e2.pageX;
        var y2 = e2.targetTouches ? e2.targetTouches[0].pageY : e2.pageY;


        var w = width + (x2 - x1);
        var h = height + (y2 - y1);

        var minWidth = andflow_util.getStyle(actionElement.querySelector(".action-master"), 'min-width') || '0';
        var minHeight = andflow_util.getStyle(actionElement.querySelector(".action-master"), 'min-height') || '0';


        var mw = minWidth.replace("px", "") * 1;
        var mh = minHeight.replace("px", "") * 1;

        if (mw == null || w > mw) {

          andflow_util.setStyle(actionElement.querySelector(".action-master"), 'width', w + 'px');
          andflow_util.setStyle(actionElement.querySelector(".action"), 'width', w + 'px');

        }

        if (mh == null || h > mh) {

          andflow_util.setStyle(actionElement.querySelector(".action-master"), 'height', h + 'px');
          andflow_util.setStyle(actionElement.querySelector(".action"), 'height', h + 'px');

        }


        var chart = $this._actionCharts[id];
        if (chart != null) {
          var chatEl = document.getElementById('chart_' + id);

          var pw = chatEl.parentElement.offsetWidth;
          var ph = chatEl.parentElement.offsetHeight;

          andflow_util.setStyle(chatEl, 'width', pw + 'px');
          andflow_util.setStyle(chatEl, 'height', ph + 'px');

          chart.resize();
        }

        $this._plumb.repaintEverything();

        $this._onCanvasChanged();

        e.preventDefault();
      });
      e.preventDefault();
    });

    //改变Body大小事件，鼠标按下去
    andflow_util.addEventListener(actionElement.querySelector('.body-resize'), $this.mousedown_event_name, function (e) {

      var containerEl = document.getElementById($this.containerId);
      containerEl.style.cursor = 'nwse-resize';

      // var x1 = e.pageX;
      // var y1 = e.pageY;

      var x1 = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
      var y1 = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;

      var width = actionElement.querySelector('.action-body').offsetWidth;
      var height = actionElement.querySelector('.action-body').offsetHeight;

      andflow_util.addEventListener(containerEl, $this.mousemove_event_name, function (e) {
        // var x2 = e.pageX;
        // var y2 = e.pageY; 

        var x2 = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
        var y2 = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;

        var w = width + (x2 - x1);
        var h = height + (y2 - y1);

        andflow_util.setStyle(actionElement.querySelector('.action-body'), 'width', w + 'px');
        andflow_util.setStyle(actionElement.querySelector('.action-body'), 'height', h + 'px');
        andflow_util.setAttr(actionElement, 'body_width', w);
        andflow_util.setAttr(actionElement, 'body_height', h);

        //刷新图表
        var chart = $this._actionCharts[id];
        if (chart != null) {

          var chartEl = document.getElementById('chart_' + id);

          var pw = chartEl.parentElement.offsetWidth;
          var ph = chartEl.parentElement.offsetHeight;

          andflow_util.setStyle(chartEl, 'width', pw + 'px');
          andflow_util.setStyle(chartEl, 'height', ph + 'px');

          chart.resize();
        }

        $this._plumb.repaintEverything();

        $this._onCanvasChanged();

        e.preventDefault();
      });
      e.preventDefault();
    });

    //初始化节点
    this._showActionNode(actionElement, name);
    $this._onCanvasChanged();

  },

  //初始化节点
  _showActionNode: function (el, name) {
    var $this = this;

    // initialise draggable elements.
    $this._plumb.draggable(el, {
      start: function (params) {
        // console.log("开始拖动:", params);
      },
      drag: function (params) {

        // 判断条件，例如拖动超出某个范围时停止拖动
        if (params.pos[0] < 0) { //  X 轴坐标<0 
          params.pos[0] = 0;
          andflow_util.setStyle(params.el, "left", "0px");
        }
        if (params.pos[1] < 0) { //  Y 轴坐标<0 
          params.pos[1] = 0;
          andflow_util.setStyle(params.el, "top", "0px");
        }

      },
      stop: function (params) {
        if ($this.drag_step > 1) {
          var x = Math.round(params.pos[0] / $this.drag_step) * $this.drag_step;
          var y = Math.round(params.pos[1] / $this.drag_step) * $this.drag_step;
          andflow_util.setStyle(params.el, "left", x + "px");
          andflow_util.setStyle(params.el, "top", y + "px");
        }
      }
    });


    if (name == null || name != 'end') {
      $this._plumb.makeSource(el, {
        filter: '.ep',

        anchor: 'Continuous',
        extract: {
          action: 'the-action',
        },
        maxConnections: 20,
        onMaxConnections: function (info, e) {
          showWarning('已经达到连接最大数 (' + info.maxConnections + ') ');
        },
      });
    }

    if (name == null || name != 'begin') {
      $this._plumb.makeTarget(el, {
        dropOptions: { hoverClass: 'dragHover' },
        anchor: 'Continuous',
        allowLoopback: true,
      });
    }
  },

  _createTip: function (tip) {
    var $this = this;

    const id = tip.id;
    if (id == null) {
      return;
    }

    var name = tip.name;

    var tip_meta = this.getMetadata(name) || {};

    var tipElement = document.querySelector('#' + this.containerId + ' #' + tip.id);
    if (!tipElement) {
      var html = '<div id="' + tip.id + '" class="tip tip-container">';
      html += '<div class="tip-remove-btn">X</div>';
      html += '<div class="tip-resize"></div>';
      html += '</div>';
      tipElement = andflow_util.parseHtml(html);

      //main
      var tip_main_html = '<div class="tip-main"><div class="tip-header"></div><div class="tip-body"></div></div>';

      //render
      if (tip.render) {
        let r = tip.render(tip_meta, tip, tip_main_html);
        if (r && r.length > 0) {
          tip_main_html = r;
        }
      } else if (tip_meta.render) {
        let r = tip_meta.render(tip_meta, tip, tip_main_html);
        if (r && r.length > 0) {
          tip_main_html = r;
        }
      } else if ($this.render_tip) {
        let r = $this.render_tip(tip_meta, tip, tip_main_html);
        if (r && r.length > 0) {
          tip_main_html = r;
        }
      }
      var tip_main_element = andflow_util.parseHtml(tip_main_html);
      andflow_util.addClass(tip_main_element, "tip-master");
      tipElement.appendChild(tip_main_element);

      //endpoint
      var epHtml = '<div class="tip-ep" title="拖拉连线">→</div>'; //拖拉连线焦点
      if ($this.render_endpoint) {
        var epr = $this.render_endpoint(tip_meta, tip, epHtml);
        if (epr && epr.length > 0) {
          epHtml = epr;
        }
      }

      var epElement = andflow_util.parseHtml(epHtml);
      andflow_util.addClass(epElement, 'tip-ep');
      tipElement.appendChild(epElement);

      var canvasElement = document.getElementById('canvas');
      canvasElement.appendChild(tipElement);

    }

    $this.setTipInfo(tip);


    //draggable
    $this._plumb.getContainer().appendChild(tipElement);
    // initialise draggable elements.
    $this._plumb.draggable(tipElement, {
      start: function (params) {
        // console.log("开始拖动:", params);
      },
      drag: function (params) {

        // 判断条件，例如拖动超出某个范围时停止拖动
        if (params.pos[0] < 0) { //  X 轴坐标<0 
          params.pos[0] = 0;
          andflow_util.setStyle(params.el, "left", "0px");
        }
        if (params.pos[1] < 0) { //  Y 轴坐标<0 
          params.pos[1] = 0;
          andflow_util.setStyle(params.el, "top", "0px");
        }

      },
      stop: function (params) {
        if ($this.drag_step > 1) {
          var x = Math.round(params.pos[0] / $this.drag_step) * $this.drag_step;
          var y = Math.round(params.pos[1] / $this.drag_step) * $this.drag_step;
          andflow_util.setStyle(params.el, 'left', x + 'px');
          andflow_util.setStyle(params.el, 'top', y + 'px');

        }
      }
    });

    //source
    $this._plumb.makeSource(tipElement, {
      filter: '.tip-ep',
      anchor: 'Continuous'
    });

    //target
    $this._plumb.makeTarget(tipElement, {
      dropOptions: { hoverClass: 'dragHover' },
      anchor: 'Continuous',
      allowLoopback: true,
    });

    //event
    andflow_util.addEventListener(tipElement, $this.mouseup_event_name, function () {

      if ($this.editable && $this.isMobile) {
        document.querySelectorAll('.focus').forEach(function (e) {
          andflow_util.removeClass(e, 'focus');
        });
        andflow_util.addClass(tipElement, 'focus');
      }

      $this._onCanvasChanged();
    });

    andflow_util.addEventListener(tipElement.querySelector('.tip-remove-btn'), $this.click_event_name, function () {
      andflow_util.confirm('确定删除?', function () {
        $this.removeTip(id);

      });

    });

    andflow_util.addEventListener(tipElement.querySelector('.tip-header'), $this.dblclick_event_name, function (event) {

      if ($this.editable) {

        if (tipElement.querySelector('.content_editor')) {
          return;
        }

        var editor = andflow_util.parseHtml('<input class="content_editor" />');
        andflow_util.setStyle(editor, 'position', 'absolute');
        andflow_util.setStyle(editor, 'z-index', '9999');
        andflow_util.setStyle(editor, 'left', '0px');
        andflow_util.setStyle(editor, 'top', '0px');
        andflow_util.setStyle(editor, 'width', '100%');
        andflow_util.setStyle(editor, 'height', '100%');
        andflow_util.setStyle(editor, 'box-sizing', 'border-box');
        andflow_util.setValue(editor, tipElement.querySelector('.tip-header').innerHTML);

        tipElement.querySelector('.tip-header').appendChild(editor);

        editor.focus();

        andflow_util.addEventListener(editor, "blur", function (e) {
          var value = andflow_util.getValue(editor);
          editor.parentElement.innerHTML = value;
          $this._tipInfos[id].title = value;

          $this._onCanvasChanged();
          andflow_util.removeElement(editor);

        });
        andflow_util.addEventListener(editor, "keydown", function (e) {
          if (e.code == "Enter") {
            var value = andflow_util.getValue(editor);
            editor.parentElement.innerHtml = value;
            $this._tipInfos[id].title = value;

            $this._onCanvasChanged();

            andflow_util.removeElement(editor);
          }

        });
      }
    });
    andflow_util.addEventListener(tipElement.querySelector('.tip-body'), $this.dblclick_event_name, function (event) {

      if ($this.editable) {

        if (tipElement.querySelector('.content_editor')) {
          return;
        }

        var editor = andflow_util.parseHtml('<textarea class="content_editor"></textarea>');

        andflow_util.setStyle(editor, 'position', 'absolute');
        andflow_util.setStyle(editor, 'z-index', '9999');
        andflow_util.setStyle(editor, 'left', '0px');
        andflow_util.setStyle(editor, 'top', '0px');
        andflow_util.setStyle(editor, 'width', '100%');
        andflow_util.setStyle(editor, 'height', '100%');
        andflow_util.setStyle(editor, 'box-sizing', 'border-box');

        var content = $this._tipInfos[id].content;

        andflow_util.setValue(editor, content);

        tipElement.querySelector('.tip-body').appendChild(editor);

        editor.focus();

        andflow_util.addEventListener(editor, "blur", function (e) {
          var value = andflow_util.getValue(editor);
          $this._tipInfos[id].content = value;

          value = value.replaceAll("\n", "<br/>");

          editor.parentElement.innerHTML = value;

          $this._onCanvasChanged();
          andflow_util.removeElement(editor);

        });

      }
    });


    //event
    andflow_util.addEventListener(tipElement.querySelector('.tip-resize'), $this.mousedown_event_name, function (e) {

      var containerEl = document.getElementById($this.containerId);

      containerEl.style.cursor = 'nwse-resize';

      var tip_main = tipElement.querySelector(".tip-master");

      // var x1 = e.pageX;
      // var y1 = e.pageY;

      var x1 = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
      var y1 = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;

      var width = tip_main.offsetWidth;
      var height = tip_main.offsetHeight;


      andflow_util.addEventListener(containerEl, $this.mousemove_event_name, function (e) {
        // var x2 = e.pageX;
        // var y2 = e.pageY;


        var x2 = e.targetTouches ? e.targetTouches[0].pageX : e.pageX;
        var y2 = e.targetTouches ? e.targetTouches[0].pageY : e.pageY;


        var w = width + (x2 - x1);
        var h = height + (y2 - y1);

        andflow_util.setStyle(tip_main, 'width', w + 'px');
        andflow_util.setStyle(tip_main, 'height', h + 'px');

        andflow_util.setAttr(tipElement, 'width', w);
        andflow_util.setAttr(tipElement, 'height', h);

        $this._plumb.repaintEverything();

        $this._onCanvasChanged();

        e.preventDefault();
      });
      e.preventDefault();
    });

  }, //end createTip

  // 显示缩略图-图片
  _showThumbnailImage: function () {

    var $this = this;

    const cardBox = document.getElementById('canvas');
    const width = cardBox.scrollWidth;
    const height = cardBox.scrollHeight;
    const scale = 1;

    var dist_canvas = document.createElement('canvas');
    dist_canvas.width = width;
    dist_canvas.height = height;

    document.body.append(dist_canvas);

    try {

      if (dist_canvas.getContext) {
        var ctx = dist_canvas.getContext("2d");
        // draw action
        ctx.fillStyle = "#CCCCCC";
        cardBox.querySelectorAll('.action-container').forEach(function (el, index) {
          var x = andflow_util.getLeftInCanvas(el);
          var y = andflow_util.getTopInCanvas(el);
          var w = el.offsetWidth;
          var h = el.offsetHeight;
          ctx.fillRect(x, y, w, h);
        });

        // draw tip
        ctx.fillStyle = "#CCCCCC";
        cardBox.querySelectorAll('.tip-container').forEach(function (el, index) {
          var x = andflow_util.getLeftInCanvas(el);
          var y = andflow_util.getTopInCanvas(el);
          var w = el.offsetWidth;
          var h = el.offsetHeight;
          ctx.fillRect(x, y, w, h);
        });
        // draw list
        ctx.fillStyle = "#CCCCCC";
        cardBox.querySelectorAll('.list-container').forEach(function (el, index) {
          var x = andflow_util.getLeftInCanvas(el);
          var y = andflow_util.getTopInCanvas(el);
          var w = el.offsetWidth;
          var h = el.offsetHeight;
          ctx.fillRect(x, y, w, h);
        });

        // draw group
        ctx.lineWidth = "3";
        ctx.strokeStyle = "#CCCCCC";
        ctx.beginPath();
        cardBox.querySelectorAll('.group-container').forEach(function (el, index) {
          var x = andflow_util.getLeftInCanvas(el);
          var y = andflow_util.getTopInCanvas(el);
          var w = el.offsetWidth;
          var h = el.offsetHeight;

          ctx.rect(x, y, w, h);
        });
        ctx.stroke();
      }

      var url = dist_canvas.toDataURL('image/png', 0.3); //生成下载的url
      andflow_util.setStyle(document.getElementById($this.containerId).querySelector('.flow_thumbnail'), 'background-image', 'url(' + url + ')');


    } finally {
      andflow_util.removeElement(dist_canvas);
    }

  },
  //缩略图框
  _showThumbnail: function () {
    var $this = this;

    var isvisible = andflow_util.isVisible('#' + $this.containerId + ' .flow_thumbnail');
    if (!isvisible) {
      return;
    }


    //视觉框
    var canvas = document.getElementById($this.containerId).querySelector(".canvas");

    var canvasView = canvas.parentElement;
    var thumbnail = document.getElementById($this.containerId).querySelector('.flow_thumbnail');


    var mask = document.getElementById($this.containerId).querySelector('.flow_thumbnail_mask');

    var full_width = canvas.offsetWidth;
    var full_height = canvas.offsetHeight;

    var canvas_width = canvasView.offsetWidth;
    var canvas_height = canvasView.offsetHeight;

    var thumbnail_width = 1 / 5 * full_width;

    var scale = thumbnail_width * 1.0 / full_width * 1.0;


    andflow_util.setStyle(thumbnail, 'width', thumbnail_width + 'px');
    andflow_util.setStyle(thumbnail, 'height', scale * full_height + 'px');

    var mask_w = (canvas_width * scale) + "px";
    var mask_h = (canvas_height * scale) + "px";

    var mask_l = (canvasView.scrollLeft * scale) + "px";
    var mask_t = (canvasView.scrollTop * scale) + "px";

    andflow_util.setStyle(mask, 'width', mask_w);
    andflow_util.setStyle(mask, 'height', mask_h);
    andflow_util.setStyle(mask, 'left', mask_l);
    andflow_util.setStyle(mask, 'top', mask_t);


    $this._showThumbnailImage();

  },

  // 重新调整canvas大小
  _resizeCanvas: function () {
    var maxWidth = 0;
    var maxHeight = 0;
    var canvasEl = document.getElementById(this.containerId).querySelector('.canvas');

    canvasEl.querySelectorAll('div').forEach(function (e, index) {


      let left = e.offsetLeft;
      let width = e.offsetWidth;
      let top = e.offsetTop;
      let height = e.offsetHeight;

      if (left + width > maxWidth) {
        maxWidth = left + width;
      }
      if (top + height > maxHeight) {
        maxHeight = top + height;
      }

    });

    andflow_util.setStyle(canvasEl, 'width', maxWidth + 'px');
    andflow_util.setStyle(canvasEl, 'height', maxHeight + 'px');


  },


  _onCanvasChanged: function () {
    var $this = this;
    setTimeout(function () {
      //调整画布大小调整
      $this._resizeCanvas();
      if ($this.event_canvas_changed) {
        $this.event_canvas_changed();
      }

      //显示缩略图
      $this._showThumbnail();


    }, 10);

  },

  _formateDateTime: function (value) {
    if (value.indexOf('0001') == 0) {
      return '';
    }
    var str = value;
    var idx = value.indexOf('+');
    if (idx >= 0) {
      str = str.substr(0, idx);
    }

    idx = value.indexOf('.');
    if (idx >= 0) {
      str = str.substr(0, idx);
    }

    idx = value.indexOf('Z');
    if (idx >= 0) {
      str = str.substr(0, idx);
    }
    str = str.replace('T', ' ');
    return str;
  },

  _isGroup: function (id) {
    var gs = this._plumb.getGroups();
    for (var i in gs) {
      if (gs[i].id == id) {
        return true;
      }
    }
    return false;
  },

  //画连接线基础样式 
  _paintConnection: function (conn, link) {
    if (link == null) {
      link = {};
    }

    var linktype = link.link_type || this.flowModel.link_type || 'Flowchart';

    //如果与tip连线
    var istip = link.source_id.indexOf("tip_") >= 0 || link.target_id.indexOf("tip_") >= 0;
    //如果是与group连接的线
    var isgroup = this._isGroup(link.source_id) || this._isGroup(link.target_id);
    var islist = link.source_id.indexOf("list_") >= 0 || link.target_id.indexOf("list_") >= 0;

    var style = link.lineStyle || 'solid';  //solid、dotted 
    var active = link.active || 'true';
    var ps = link.paintStyle;
    var hps = link.hoverPaintStyle;


    //连线样式
    var paintStyle = {
      stroke: this._themeObj.default_link_color,
      radius: this._themeObj.default_link_radius,
      strokeWidth: this._themeObj.default_link_strokeWidth,
      outlineStroke: 'transparent',
      outlineWidth: this._themeObj.default_link_outlineWidth,
    };
    paintStyle = andflow_util.extend(paintStyle, ps);


    var hoverPaintStyle = {
      stroke: this._themeObj.default_link_color_hover,
      radius: this._themeObj.default_link_radius_hover,
      strokeWidth: this._themeObj.default_link_strokeWidth_hover,
      outlineStroke: 'transparent',
      outlineWidth: this._themeObj.default_link_outlineWidth_hover,
    };
    hoverPaintStyle = andflow_util.extend(hoverPaintStyle, hps);


    if (style == 'dotted' || (active != null && active == 'false')) {
      paintStyle.dashstyle = '2 1';
      hoverPaintStyle.dashstyle = '2 1';
    } else {
      paintStyle.dashstyle = '1 0';
      hoverPaintStyle.dashstyle = '1 0';
    }


    //线条样式 
    if (istip) {
      paintStyle.stroke = this._themeObj.default_link_color_t;
      paintStyle.radius = this._themeObj.default_link_radius_t;
      paintStyle.strokeWidth = this._themeObj.default_link_strokeWidth_t;
      paintStyle.outlineStroke = 'transparent';
      paintStyle.outlineWidth = this._themeObj.default_link_outlineWidth_t;

      hoverPaintStyle.stroke = this._themeObj.default_link_color_t_hover;
      hoverPaintStyle.radius = this._themeObj.default_link_radius_t_hover;
      hoverPaintStyle.strokeWidth = this._themeObj.default_link_strokeWidth_t_hover;
      hoverPaintStyle.outlineStroke = 'transparent';
      hoverPaintStyle.outlineWidth = this._themeObj.default_link_outlineWidth_t_hover;

      paintStyle.dashstyle = '5 3';
      hoverPaintStyle.dashstyle = '5 3';


    } else if (isgroup) {

      paintStyle.stroke = this._themeObj.default_link_color_g;
      paintStyle.radius = this._themeObj.default_link_radius_g;
      paintStyle.strokeWidth = this._themeObj.default_link_strokeWidth_g;
      paintStyle.outlineStroke = 'transparent';
      paintStyle.outlineWidth = this._themeObj.default_link_outlineWidth_g;

      hoverPaintStyle.stroke = this._themeObj.default_link_color_g_hover;
      hoverPaintStyle.radius = this._themeObj.default_link_radius_g_hover;
      hoverPaintStyle.strokeWidth = this._themeObj.default_link_strokeWidth_g_hover;
      hoverPaintStyle.outlineStroke = 'transparent';
      hoverPaintStyle.outlineWidth = this._themeObj.default_link_outlineWidth_g_hover;

    }


    conn.setType(linktype);
    conn.setPaintStyle(paintStyle);
    conn.setHoverPaintStyle(hoverPaintStyle);

    //默认arrow
    conn.getOverlay('arrow_source').setVisible(false);
    conn.getOverlay('arrow_middle').setVisible(false);
    conn.getOverlay('arrow_target').setVisible(true);


    if (link.source_id.indexOf("list_") >= 0) {
      conn.getOverlay('arrow_source').setVisible(false);
      conn.getOverlay('label_source').setVisible(true);
    }
    if (link.target_id.indexOf("list_") >= 0) {
      conn.getOverlay('arrow_target').setVisible(false);
      conn.getOverlay('label_target').setVisible(true);
    }

    if (link.arrows && link.arrows.length > 0) {
      if (link.arrows[0]) {
        conn.getOverlay('arrow_source').setVisible(true);
      } else {
        conn.getOverlay('arrow_source').setVisible(false);
      }

      if (link.arrows.length > 1 && link.arrows[1]) {
        conn.getOverlay('arrow_middle').setVisible(true);
      } else {
        conn.getOverlay('arrow_middle').setVisible(false);
      }

      if (link.arrows.length > 2 && link.arrows[2]) {
        conn.getOverlay('arrow_target').setVisible(true);
      } else {
        conn.getOverlay('arrow_target').setVisible(false);
      }
    }


    //动画元素
    conn.getOverlay('animation').width = this._themeObj.default_link_strokeWidth_g * 2;
    conn.getOverlay('animation').length = this._themeObj.default_link_strokeWidth_g * 2;
    conn.getOverlay('animation').setVisible(false);

    //连线文本信息 
    var linkLabel = link.title || link.label || '';

    conn.getOverlay('label').setVisible(linkLabel.length > 0);
    conn.getOverlay('label').setLabel(linkLabel);

    var linkLabelSource = link.label_source || '';

    conn.getOverlay('label_source').setVisible(linkLabelSource.length > 0);
    conn.getOverlay('label_source').setLabel(linkLabelSource);

    var linkLabelTarget = link.label_target || '';

    conn.getOverlay('label_target').setVisible(linkLabelTarget.length > 0);
    conn.getOverlay('label_target').setLabel(linkLabelTarget);


    //删除按钮 
    if (link.show_remove || islist) {
      conn.getOverlay('label_remove').setVisible(true);
    } else {
      conn.getOverlay('label_remove').setVisible(false);
    }

    //箭头
    if (istip) {
      conn.getOverlay('arrow_source').setVisible(false);
      conn.getOverlay('arrow_middle').setVisible(false);
      conn.getOverlay('arrow_target').setVisible(false);

    } else if (isgroup) {
      conn.getOverlay('arrow_source').width = this._themeObj.default_link_strokeWidth_g * 3;
      conn.getOverlay('arrow_source').length = this._themeObj.default_link_strokeWidth_g * 3;
      conn.getOverlay('arrow_target').width = this._themeObj.default_link_strokeWidth_g * 3;
      conn.getOverlay('arrow_target').length = this._themeObj.default_link_strokeWidth_g * 3;
      conn.getOverlay('arrow_middle').width = this._themeObj.default_link_strokeWidth_g * 3;
      conn.getOverlay('arrow_middle').length = this._themeObj.default_link_strokeWidth_g * 3;
    }


    conn.data = link;

    if (this.render_link) {
      this.render_link(conn, linktype, link);
    }

  },

  //画连接线状态
  _paintConnectionState: function (conn, state) {

    if (state == -1 || state == 'error') {
      conn.setPaintStyle({
        stroke: this._themeObj.default_link_color_error,
        radius: this._themeObj.default_link_radius_error,
        strokeWidth: this._themeObj.default_link_strokeWidth_error,
        outlineStroke: 'transparent',
        outlineWidth: this._themeObj.default_link_outlineWidth_error,
      });
    } else if (state == 1 || state == 'success') {
      conn.setPaintStyle({
        stroke: this._themeObj.default_link_color_success,
        radius: this._themeObj.default_link_radius_success,
        strokeWidth: this._themeObj.default_link_strokeWidth_success,
        outlineStroke: 'transparent',
        outlineWidth: this._themeObj.default_link_outlineWidth_success,
      });
    } else if (state == 0 || state == 'reject') {
      conn.setPaintStyle({
        stroke: this._themeObj.default_link_color_reject,
        radius: this._themeObj.default_link_radius_reject,
        strokeWidth: this._themeObj.default_link_strokeWidth_reject,
        outlineStroke: 'transparent',
        outlineWidth: this._themeObj.default_link_outlineWidth_reject,
      });
    } else {
      conn.setPaintStyle({
        stroke: this._themeObj.default_link_color,
        radius: this._themeObj.default_link_radius,
        strokeWidth: this._themeObj.default_link_strokeWidth,
        outlineStroke: 'transparent',
        outlineWidth: this._themeObj.default_link_outlineWidth,
      });
    }
  },

  newInstance: function (containerId, option) {
    var instance = this;
    instance.containerId = containerId;

    instance.isMobile = andflow_util.isMobile();

    if (instance.isMobile) {
      instance.mousedown_event_name = 'touchstart';
      instance.mouseup_event_name = 'touchend';
      instance.mousemove_event_name = 'touchmove';
      instance.click_event_name = 'touchend';
      instance.dblclick_event_name = 'longtap';
    }

    instance = andflow_util.extend(instance, option);

    if (instance.flowModel == null) {
      instance.flowModel = {};
    }
    if (instance.flowModel.theme == null) {
      instance.flowModel.theme = 'flow_theme_default';
    }

    if (instance.flowModel.link_type == null) {
      instance.flowModel.link_type = 'Flowchart';
    }
    if (instance._connectionTypes[instance.flowModel.link_type] == null) {
      instance.flowModel.link_type = 'Flowchart';
    }

    //初始化html
    instance._initHtml(containerId);

    //初始化元数据
    instance._initMetadata();

    //初始化样式风格
    instance._initTheme();

    //初始化流程实例
    instance._initPlumb();

    instance._initEvents();

    instance._initAnimaction();

    return instance;
  },

  //刷新
  refresh: function () {
    this.flowModel = this.getFlow();

    this._initTheme();
    this._initPlumb();
    this.showFlow();
    this.setActionStates();
    this.setLinkStates();
    this.setActionContents();
  },
  repaint: function () {
    //重画
    if (this._plumb) {
      this._plumb.repaintEverything();
    }

  },

  setTheme: function (theme) {

    this.flowModel.theme = theme || this.flowModel.theme || 'flow_theme_default';
    this._themeObj = flow_themes[this.flowModel.theme];

    var andflowEl = document.getElementById(this.containerId).querySelector('.andflow');

    for (var k in flow_themes) {
      andflow_util.removeClass(andflowEl, k);

    }
    andflow_util.addClass(andflowEl, this.flowModel.theme);

    if (this._plumb) {
      this._plumb.repaintEverything();
    }

  },

  registActionScript: function (name, obj) {
    this._actionScript[name] = obj;
  },

  getActionScript: function (name) {
    return this._actionScript[name];
  },

  getMetadata: function (name) {
    for (var index in this.metadata) {
      var action_meta = this.metadata[index];
      if (name == action_meta.name) {
        return action_meta;
      }
    }
    return null;
  },

  getMetadatas: function () {
    return this.metadata;
  },

  getDict: function (name) {
    if (name == null || name == '') {
      return null;
    }
    var dicts = this.getFlow().dict;
    for (var i in dicts) {
      var dict = dicts[i];
      if (dict.name == name) {
        return dict.label;
      }
    }
    return null;
  },

  getDicts: function () {
    var dicts = this.getFlow().dict;

    return dicts;
  },

  getActionInfo: function (id) {
    return this.getAction(id);
  },

  setActionInfo: function (action) {
    this._actionInfos[action.id] = action;
    //渲染
    this.renderAction(action);
  },

  renderAction: function (action) {
    var $this = this;

    var actionElement = document.getElementById(action.id);

    if (!actionElement) {
      return;
    }

    var id = action.id;

    if (id == null) {
      return;
    }

    var name = action.name;
    if (name == null) {
      return;
    }


    var action_meta = this.getMetadata(name) || {};

    var title = action.title || action.des || action_meta.title || action_meta.des || '';

    var icon = action.icon || action_meta.icon || '';
    var des = action.des || action_meta.des || '';
    var css = action.css || action_meta.css || '';

    var border_color = action.border_color;
    var header_color = action.header_color;
    var header_text_color = action.header_text_color;
    var body_color = action.body_color;
    var body_text_color = action.body_text_color;

    var actionThemeName = action.theme || action_meta.theme || '';

    var action_themeObj = action_themes[actionThemeName || ''] || this._themeObj;

    var content = action.content;

    var left = action.left;
    var top = action.top;
    var width = action.width;
    var height = action.height;

    var body_width = '';
    var body_height = '';

    if (action_themeObj.is_body_resizable) {
      body_width = action.body_width;
      body_height = action.body_height;
    }

    //action
    if (css && css.length > 0) {
      andflow_util.addClass(actionElement.querySelector('.action'), css);
    }

    andflow_util.setAttr(actionElement.querySelector('.action'), 'title', title);
    andflow_util.setAttr(actionElement.querySelector('.action'), 'name', name);
    andflow_util.setAttr(actionElement.querySelector('.action'), 'icon', icon);

    //样式 
    for (var k in action_themes) {
      andflow_util.removeClass(actionElement, k)
    }
    if (actionThemeName && actionThemeName.length > 0) {
      andflow_util.addClass(actionElement, actionThemeName);
    }


    //图标
    var iconImgPath = '';
    if (icon && icon.length > 0 && icon.indexOf("base64") >= 0) {
      iconImgPath = icon;
    } else if (icon && icon.length > 0) {
      iconImgPath = ($this.img_path || '') + icon;
    } else {
      iconImgPath = ($this.img_path || '') + 'node.png';
    }


    andflow_util.setAttr(actionElement.querySelector('.action-icon img'), 'src', iconImgPath);

    if (actionElement.querySelector('.action-header')) {
      actionElement.querySelector('.action-header').innerHTML = title;
    }


    if (this.flowModel.show_action_body == 'false') {
      andflow_util.hide(actionElement.querySelector('.action-body'));
    }

    if (this.flowModel.show_action_content == 'false') {
      andflow_util.hide(actionElement.querySelector('.action-content'));
    }



    //color
    if (border_color) {
      actionElement.style.setProperty("--action-border-color", border_color);
    }
    if (header_color) {
      actionElement.style.setProperty("--action-header-color", header_color);
    }
    if (header_text_color) {
      actionElement.style.setProperty("--action-header-text-color", header_text_color);
    }
    if (body_color) {
      actionElement.style.setProperty("--action-body-color", body_color);
    }
    if (body_text_color) {
      actionElement.style.setProperty("--action-body-text-color", body_text_color);
    }


    //content
    if (content) {
      if (typeof content === 'string') {
        content = { content_type: "msg", content: content };
      }

      this.setActionContent(action.id, content.content || '', content.content_type || 'msg');
    }


    //position
    andflow_util.setStyle(actionElement, 'position', 'absolute');

    if (left && (left + "").indexOf('px') >= 0) {
      andflow_util.setStyle(actionElement, 'left', left);
    } else {
      andflow_util.setStyle(actionElement, 'left', left + 'px');
    }
    if (top && (top + "").indexOf('px') >= 0) {
      andflow_util.setStyle(actionElement, 'top', top);
    } else {
      andflow_util.setStyle(actionElement, 'top', top + 'px');

    }
    //size 
    if (width) {

      if (width && (width + "").indexOf("px") >= 0) {
        andflow_util.setStyle(actionElement.querySelector('.action-master'), 'width', width);
      } else {
        andflow_util.setStyle(actionElement.querySelector('.action-master'), 'width', width + 'px');
      }

    }
    if (height) {

      if (height && (height + "").indexOf("px") >= 0) {
        andflow_util.setStyle(actionElement.querySelector('.action-master'), 'height', height);
      } else {
        andflow_util.setStyle(actionElement.querySelector('.action-master'), 'height', height + "px");
      }
    }

    //body
    if (body_width && body_width.length > 0) {
      andflow_util.setAttr(actionElement, 'body_width', body_width);
      if (body_width.indexOf('px') < 0) {
        body_width = body_width + 'px';
      }
      andflow_util.setStyle(actionElement.querySelector('.action-body'), 'width', body_width);
    } else {
      andflow_util.setStyle(actionElement.querySelector('.action-body'), 'width', '');
    }

    if (body_height && body_height.length > 0) {
      andflow_util.setAttr(actionElement, 'body_height', body_height);
      if (body_height.indexOf('px') < 0) {
        body_height = body_height + 'px';
      }
      andflow_util.setStyle(actionElement.querySelector('.action-body'), 'height', body_height);

    } else {
      andflow_util.setStyle(actionElement.querySelector('.action-body'), 'height', '');
    }
  },

  delActionInfo: function (id) {
    this._actionInfos[id] = null;
  },
  setActionParam: function (actionId, key, value) {
    if (this._actionInfos && this._actionInfos[actionId]) {
      if (!this._actionInfos[actionId].params) {
        this._actionInfos[actionId].params = {};
      }
      this._actionInfos[actionId].params[key] = value;
    }
  },
  getActionParam: function (actionId, key) {
    if (this._actionInfos && this._actionInfos[actionId]) {
      if (this._actionInfos[actionId].params) {
        return this._actionInfos[actionId].params[key];
      }
    }
    return null;
  },
  setActionBorderColor: function (actionId, color) {
    if (this._actionInfos && this._actionInfos[actionId]) {
      this._actionInfos[actionId].border_color = color;
      this.renderAction(this._actionInfos[actionId]);
    }
  },
  setActionHeaderColor: function (actionId, color) {
    if (this._actionInfos && this._actionInfos[actionId]) {
      this._actionInfos[actionId].header_color = color;
      this.renderAction(this._actionInfos[actionId]);
    }
  },
  setActionHeaderTextColor: function (actionId, color) {
    if (this._actionInfos && this._actionInfos[actionId]) {
      this._actionInfos[actionId].header_text_color = color;
      this.renderAction(this._actionInfos[actionId]);
    }
  },
  setActionBodyColor: function (actionId, color) {
    if (this._actionInfos && this._actionInfos[actionId]) {
      this._actionInfos[actionId].body_color = color;
      this.renderAction(this._actionInfos[actionId]);
    }
  },
  setActionBodyTextColor: function (actionId, color) {
    if (this._actionInfos && this._actionInfos[actionId]) {
      this._actionInfos[actionId].body_text_color = color;
      this.renderAction(this._actionInfos[actionId]);
    }
  },
  getGroupInfo: function (id) {
    return this._groupInfos[id];
  },
  setGroupInfo: function (group) {
    this._groupInfos[group.id] = group;
    //渲染
    this.renderGroup(group);
  },

  renderGroup: function (group) {

    var $this = this;


    var groupElement = document.getElementById(group.id);
    if (!groupElement) {
      return;
    }

    var id = group.id;
    var name = group.name;

    var meta = this.getMetadata(name) || {};

    var border_color = group.border_color;
    var header_color = group.header_color;
    var header_text_color = group.header_text_color;
    var body_color = group.body_color;
    var body_text_color = group.body_text_color;

    var theme = group.theme || meta.theme || '';

    var members = group.members || [];

    for (var k in action_themes) {
      andflow_util.removeClass(groupElement, k);
    }
    if (theme && theme.length > 0) {
      andflow_util.addClass(groupElement, theme);
    }


    if (border_color) {
      groupElement.style.setProperty("--group-border-color", border_color);
    }
    if (header_color) {
      groupElement.style.setProperty("--group-header-color", header_color);
    }
    if (header_text_color) {
      groupElement.style.setProperty("--group-header-text-color", header_text_color);
    }
    if (body_color) {
      groupElement.style.setProperty("--group-body-color", body_color);
    }
    if (body_text_color) {
      groupElement.style.setProperty("--group-body-text-color", body_text_color);
    }

    //title\body
    if (groupElement.querySelector('.group-header')) {
      groupElement.querySelector('.group-header').innerHTML = (group.title || '');
    }
    if (groupElement.querySelector('.group-body')) {
      groupElement.querySelector('.group-body').innerHTML = (group.des || '');
    }



    //位置
    var padding_top = 30;
    var padding_left = 10;
    var padding_right = 10;
    var padding_bottom = 10;


    var canvasElement = document.querySelector('#' + $this.containerId + ' #canvas');
    //left
    if (group.left == null || group.left == "auto") {
      if (members.length > 0) {
        var minLeft = 9999999999999;

        for (var i in members) {

          let l = document.getElementById(members[i]).offsetLeft - canvasElement.offsetLeft;

          if (minLeft > l) {
            minLeft = l;
          }
        }
        minLeft = minLeft - padding_left;

        andflow_util.setStyle(groupElement, 'left', minLeft + 'px');

      }
    } else {
      if ((group.left + "").indexOf("px") >= 0) {
        andflow_util.setStyle(groupElement, 'left', group.left);
      } else {
        andflow_util.setStyle(groupElement, 'left', group.left + 'px');
      }
    }

    //top
    if (group.top == null || group.top == "auto") {
      if (members.length > 0) {
        var minTop = 999999999;

        for (var i in members) {

          let t = document.getElementById(members[i]).offsetTop - canvasElement.offsetTop;
          if (minTop > t) {
            minTop = t;
          }
        }
        minTop = minTop - padding_top;
        andflow_util.setStyle(groupElement, 'top', minTop + "px");

      }
    } else {
      if ((group.top + "").indexOf("px") >= 0) {
        andflow_util.setStyle(groupElement, 'top', group.top);
      } else {
        andflow_util.setStyle(groupElement, 'top', group.top + 'px');
      }
    }

    //width
    if (group.width == null || group.width == "auto") {
      if (members.length > 0) {
        var maxWidth = 0;

        for (var i in members) {

          document.getElementById(members[i]).querySelectorAll("div").forEach(function (el, index) {

            let w = el.offsetLeft + el.offsetWidth;
            w = w - groupElement.offsetLeft - canvasElement.offsetLeft;

            if (w > maxWidth) {
              maxWidth = w;
            }
          });
        }
        maxWidth = maxWidth + padding_right;

        andflow_util.setStyle(groupElement.querySelector(".group-main"), 'width', maxWidth);
      }
    } else {
      if ((group.width + "").indexOf("px") >= 0) {
        andflow_util.setStyle(groupElement.querySelector(".group-main"), "width", group.width);
      } else {
        andflow_util.setStyle(groupElement.querySelector(".group-main"), "width", group.width + "px");
      }
    }

    //height
    if (group.height == null || group.height == "auto") {
      if (members.length > 0) {
        var maxHeight = 0;

        for (var i in members) {

          document.getElementById(members[i]).querySelector("div").forEach(function (el, index) {

            let h = el.offsetTop + el.offsetHeight;
            h = h - groupElement.offsetTop - canvasElement.offsetTop;

            if (h > maxHeight) {
              maxHeight = h;
            }
          });
        }
        maxHeight = maxHeight + padding_bottom;

        andflow_util.setStyle(groupElement.querySelector(".group-main"), 'height', maxHeight);
      }
    } else {

      if ((group.height + "").indexOf("px") >= 0) {
        andflow_util.setStyle(groupElement.querySelector(".group-main"), 'height', group.height);
      } else {
        andflow_util.setStyle(groupElement.querySelector(".group-main"), 'height', group.height + 'px');
      }

    }

  },

  getGroupTitle: function (id) {
    var group = this._groupInfos[id];
    return group.title;
  },
  setGroupTitle: function (id, title) {
    var group = this._groupInfos[id];
    if (group == null) {
      return;
    }
    group.title = title;
    this._groupInfos[group.id] = group;
    var groupEl = document.querySelector('#' + this.containerId + ' #' + group.id);
    groupEl.querySelector('.group-header').innerHTML = group.title;
  },

  setGroupBorderColor: function (id, color) {
    if (this._groupInfos[id]) {
      this._groupInfos[id].border_color = color;
      this.renderGroup(this._groupInfos[id]);
    }
  },
  setGroupHeaderColor: function (id, color) {
    if (this._groupInfos[id]) {
      this._groupInfos[id].header_color = color;
      this.renderGroup(this._groupInfos[id]);
    }
  },
  setGroupHeaderTextColor: function (id, color) {
    if (this._groupInfos[id]) {
      this._groupInfos[id].header_text_color = color;
      this.renderGroup(this._groupInfos[id]);
    }
  },
  setGroupBodyColor: function (id, color) {
    if (this._groupInfos[id]) {
      this._groupInfos[id].body_color = color;
      this.renderGroup(this._groupInfos[id]);
    }
  },
  setGroupBodyTextColor: function (id, color) {
    if (this._groupInfos[id]) {
      this._groupInfos[id].body_text_color = color;
      this.renderGroup(this._groupInfos[id]);
    }
  },
  getListInfo: function (id) {
    return this._listInfos[id];
  },
  setListInfo: function (list) {
    this._listInfos[list.id] = list;
    this.renderList(list);
  },

  renderList: function (list) {
    var $this = this;

    var listElement = document.getElementById(list.id);
    if (!listElement) {
      return;
    }

    var id = list.id;
    var name = list.name;
    var meta = this.getMetadata(name) || {};
    var theme = list.theme || meta.theme || '';
    var border_color = list.border_color;
    var header_color = list.header_color;
    var header_text_color = list.header_text_color;
    var body_color = list.body_color;
    var body_text_color = list.body_text_color;
    var item_color = list.item_color;
    var item_text_color = list.item_text_color;

    var items = list.items;
    var left = list.left;
    var top = list.top;

    for (var k in action_themes) {
      andflow_util.removeClass(listElement, k);
    }
    if (theme && theme.length > 0) {
      andflow_util.addClass(listElement, theme);
    }

    listElement.querySelector('.list-header').innerHTML = list.title || '';

    if (border_color) {
      listElement.style.setProperty("--list-border-color", border_color);
    }
    if (header_color) {
      listElement.style.setProperty("--list-header-color", header_color);
    }
    if (header_text_color) {
      listElement.style.setProperty("--list-header-text-color", header_text_color);
    }
    if (body_color) {
      listElement.style.setProperty("--list-body-color", body_color);
    }
    if (body_text_color) {
      listElement.style.setProperty("--list-body-text-color", body_text_color);
    }
    if (item_color) {
      listElement.style.setProperty("--list-item-color", item_color);
    }
    if (item_text_color) {
      listElement.style.setProperty("--list-item-text-color", item_text_color);
    }

    //width
    if (list.width != undefined && list.width != null) {
      if ((list.width + "").indexOf("px") >= 0) {
        andflow_util.setStyle(listElement.querySelector(".list-main"), "width", list.width);

      } else {
        andflow_util.setStyle(listElement.querySelector(".list-main"), "width", list.width + 'px');
      }
    }

    //height
    if (list.height != undefined && list.height != null) {

      if ((list.height + "").indexOf("px") >= 0) {
        andflow_util.setStyle(listElement.querySelector(".list-main"), "height", list.height);
      } else {
        andflow_util.setStyle(listElement.querySelector(".list-main"), "height", list.height + 'px');

      }
    }


    //top
    if ((top + "").indexOf("px") >= 0) {
      andflow_util.setStyle(listElement, 'top', top);
    } else {
      andflow_util.setStyle(listElement, 'top', top + 'px');
    }
    //left
    if ((left + "").indexOf("px") >= 0) {
      andflow_util.setStyle(listElement, 'left', left);
    } else {
      andflow_util.setStyle(listElement, 'left', left + 'px');
    }
    //items
    $this._setListItems(id, items);

  },

  getListTitle: function (id) {
    return (this._listInfos[id] || {}).title;
  },
  setListTitle: function (id, title) {
    var list = this._listInfos[id];
    if (list == null) {
      return;
    }
    list.title = title;
    this._listInfos[list.id] = list;
    document.getElementById(list.id).querySelector('.list-header').innerHTML = list.title || '';
  },

  getListItems: function (id) {
    return (this._listInfos[id] || {}).items;
  },
  setListItems: function (id, items) {
    var list = this._listInfos[id];
    if (list == null) {
      return;
    }
    list.items = items;
    this._listInfos[id] = list;
    this._setListItems(id, items);
    this.refresh();
  },
  setListBorderColor: function (id, color) {
    if (this._listInfos[id]) {
      this._listInfos[id].border_color = color;
      this.renderList(this._listInfos[id]);
    }
  },
  setListHeaderColor: function (id, color) {
    if (this._listInfos[id]) {
      this._listInfos[id].header_color = color;
      this.renderList(this._listInfos[id]);
    }
  },
  setListHeaderTextColor: function (id, color) {
    if (this._listInfos[id]) {
      this._listInfos[id].header_text_color = color;
      this.renderList(this._listInfos[id]);
    }
  },
  setListBodyColor: function (id, color) {
    if (this._listInfos[id]) {
      this._listInfos[id].body_color = color;
      this.renderList(this._listInfos[id]);
    }
  },
  setListBodyTextColor: function (id, color) {
    if (this._listInfos[id]) {
      this._listInfos[id].body_text_color = color;
      this.renderList(this._listInfos[id]);
    }
  },
  setListItemColor: function (id, color) {
    if (this._listInfos[id]) {
      this._listInfos[id].item_color = color;
      this.renderList(this._listInfos[id]);
    }
  },
  setListItemTextColor: function (id, color) {
    if (this._listInfos[id]) {
      this._listInfos[id].item_text_color = color;
      this.renderList(this._listInfos[id]);
    }
  },
  getTipInfo: function (id) {
    return this._tipInfos[id];
  },
  setTipInfo: function (tip) {
    this._tipInfos[tip.id] = tip;
    //渲染
    this.renderTip(tip);
  },

  renderTip: function (tip) {

    var tipElement = document.getElementById(tip.id);
    if (!tipElement) {
      return;
    }

    var id = tip.id;
    var name = tip.name;
    var meta = this.getMetadata(name) || {};

    var theme = tip.theme || meta.theme || '';

    var content = tip.content;
    var border_color = tip.border_color;
    var body_color = tip.body_color;
    var body_text_color = tip.body_text_color;
    var header_color = tip.header_color;
    var header_text_color = tip.header_text_color;


    for (var k in action_themes) {
      andflow_util.removeClass(tipElement, k);
    }
    if (theme && theme.length > 0) {
      andflow_util.addClass(tipElement, theme);
    }


    //位置 
    //left
    if ((tip.left + "").indexOf("px") >= 0) {
      andflow_util.setStyle(tipElement, 'left', tip.left);
    } else {
      andflow_util.setStyle(tipElement, 'left', tip.left + 'px');
    }
    //top
    if ((tip.top + "").indexOf("px") >= 0) {
      andflow_util.setStyle(tipElement, 'top', tip.top);
    } else {
      andflow_util.setStyle(tipElement, 'top', tip.top + 'px');
    }

    //width 
    if ((tip.width + "").indexOf("px") >= 0) {
      andflow_util.setStyle(tipElement.querySelector(".tip-main"), 'width', tip.width);
    } else {
      andflow_util.setStyle(tipElement.querySelector(".tip-main"), 'width', tip.width + 'px');
    }


    //height 
    if ((tip.height + "").indexOf("px") >= 0) {
      andflow_util.setStyle(tipElement.querySelector(".tip-main"), 'height', tip.height);
    } else {
      andflow_util.setStyle(tipElement.querySelector(".tip-main"), 'height', tip.height + 'px');
    }

    //color
    if (border_color) {
      tipElement.style.setProperty("--tip-border-color", border_color);
    }
    if (header_color) {
      tipElement.style.setProperty("--tip-header-color", header_color);
    }
    if (header_text_color) {
      tipElement.style.setProperty("--tip-header-text-color", header_text_color);
    }
    if (body_color) {
      tipElement.style.setProperty("--tip-body-color", body_color);
    }
    if (body_text_color) {
      tipElement.style.setProperty("--tip-body-text-color", body_text_color);
    }

    if (content) {
      content = content.replaceAll("\n", "<br/>");
    }


    //title\body
    tipElement.querySelector('.tip-header').innerHTML = (tip.title || '');
    tipElement.querySelector('.tip-body').innerHTML = (content || '');

  },
  getTipTitle: function (id) {
    if (this._tipInfos[id]) {
      return this._tipInfos[id].title;
    }
    return null;
  },
  setTipTitle: function (id, title) {
    if (this._tipInfos[id]) {

      var tipElement = document.getElementById(id);
      this._tipInfos[id].title = title;
      tipElement.querySelector('.tip-header').innerHTML = (title || '');
    }
  },
  getTipContent: function (id) {
    if (this._tipInfos[id]) {
      return this._tipInfos[id].content;
    }
    return null;
  },
  setTipContent: function (id, content) {
    if (this._tipInfos[id]) {
      var tipElement = document.getElementById(id);
      this._tipInfos[id].content = content;
      tipElement.querySelector('.tip-body').innerHTML = (content || '');
    }
  },
  setTipBorderColor: function (id, color) {
    if (this._tipInfos[id]) {
      var tipElement = document.getElementById(id);
      this._tipInfos[id].border_color = color;
      tipElement.style.setProperty("--tip-border-color", color);
    }
  },
  setTipBodyColor: function (id, color) {
    if (this._tipInfos[id]) {
      var tipElement = document.getElementById(id);
      this._tipInfos[id].body_color = color;
      tipElement.style.setProperty("--tip-body-color", color);
    }
  },
  setTipBodyTextColor: function (id, color) {
    if (this._tipInfos[id]) {
      var tipElement = document.getElementById(id);
      this._tipInfos[id].body_text_color = color;
      tipElement.style.setProperty("--tip-body-text-color", color);
    }
  },

  getLinkInfo: function (sid, tid) {
    return this._linkInfos[sid + '-' + tid] || {};
  },

  setLinkInfo: function (link) {
    var linkInfo = this._linkInfos[link.source_id + '-' + link.target_id];
    linkInfo = andflow_util.extend(linkInfo, link);
    this._linkInfos[link.source_id + '-' + link.target_id] = linkInfo;

    this.renderLink(linkInfo);

  },
  renderLink: function (link) {
    var conn = this.getConnection(link.source_id, link.target_id);

    if (conn != null) {

      this._paintConnection(conn, link);

      this._plumb.repaintEverything();
    }
  },
  delLinkInfo: function (sid, tid) {
    this._linkInfos[sid + '-' + tid] = null;
  },
  getLinkPaintStyle: function (source_id, target_id) {
    var link = this._linkInfos[link.source_id + '-' + link.target_id] || { source_id: source_id, target_id: target_id };
    return link.paintStyle;
  },
  setLinkPaintStyle: function (source_id, target_id, paintStyle) {
    var link = this._linkInfos[link.source_id + '-' + link.target_id] || { source_id: source_id, target_id: target_id };
    link.paintStyle = paintStyle;
    this.setLinkInfo(link);
  },
  setLinkTitle: function (source_id, target_id, title) {
    var link = this._linkInfos[link.source_id + '-' + link.target_id] || { source_id: source_id, target_id: target_id };
    link.title = title;
    this.setLinkInfo(link);
  },
  getLinkTitle: function (source_id, target_id) {
    var link = this._linkInfos[source_id + '-' + target_id] || {};
    return link.title;
  },
  setLinkLabel: function (source_id, target_id, title) {
    this.setLinkTitle(source_id, target_id, title);
  },
  getLinkLabel: function (source_id, target_id) {
    return this.sgtLinkTitle(source_id, target_id);
  },
  setLinkSourceLabel: function (source_id, target_id, label) {
    var link = this._linkInfos[link.source_id + '-' + link.target_id] || { source_id: source_id, target_id: target_id };
    link.label_source = label;
    this.setLinkInfo(link);
  },
  getLinkSourceLabel: function (source_id, target_id) {
    var link = this._linkInfos[source_id + '-' + target_id] || {};
    return link.label_source;
  },
  setLinkTargetLabel: function (source_id, target_id, label) {
    var link = this._linkInfos[link.source_id + '-' + link.target_id] || { source_id: source_id, target_id: target_id };
    link.label_target = label;
    this.setLinkInfo(link);
  },
  getLinkTargetLabel: function (source_id, target_id) {
    var link = this._linkInfos[source_id + '-' + target_id] || {};
    return link.label_target;
  },

  //删除组
  removeGroup: function (groupId, deleteMembers) {
    var $this = this;
    var group = $this._plumb.getGroup(groupId);
    var all = deleteMembers || $this._groupInfos[group.id].delete_all || false;
    if (all != true) {
      all = false;
    }
    group.getEl();
    $this._plumb.removeGroup(group, all);
  },
  //删除列表
  removeList: function (id) {
    var $this = this;
    var element = document.getElementById(id);

    $this._plumb.remove(element);

    andflow_util.removeElement(element);
  },

  //删除Tip
  removeTip: function (id) {
    var $this = this;

    var element = document.getElementById(id);

    $this._plumb.remove(element);
    andflow_util.removeElement(element);

  },
  //删除节点
  removeAction: function (actionId) {
    var $this = this;
    var element = document.getElementById(actionId);

    if (!element) {
      return;
    }

    //remove from group
    var groups = $this._plumb.getGroups();

    for (var i in groups) {
      var ms = groups[i].getMembers();
      for (var j in ms) {
        if (ms[j].id == actionId) {
          groups[i].remove(element, null, true);
        }
      }
    }

    //remove from canvas
    $this._plumb.remove(element);

    andflow_util.removeElement(element);


    var action_info = $this._actionInfos[actionId];

    $this.delActionInfo(actionId);

    $this._actionCharts[actionId] = null;
    if ($this._actionCharts[actionId] != null) {
      $this._actionCharts[actionId].dispose();
    }
    $this._actionContents[actionId] = null;


    //event
    if ($this.event_action_remove) {
      $this.event_action_remove(action_info);
    }

    $this._onCanvasChanged();
  },

  //删除连线
  removeLink: function (sourceId, targetId) {
    var $this = this;

    var conn = this.getConnection(sourceId, targetId);
    if (conn == null) {
      return;
    }

    this.delLinkInfo(sourceId, targetId);

    this._plumb.deleteConnection(conn);
    this._plumb.repaintEverything();

    if (this.event_link_remove) {
      var link_info = this._linkInfos[sourceId + '-' + targetId];
      this.event_link_remove(link_info);
    }

    $this._onCanvasChanged();
  },
  removeLinkBySource: function (sourceId) {
    var $this = this;
    var conns = $this.getConnectionsBySource(sourceId);
    for (var i in conns) {
      var conn = conns[i];
      var targetId = conn["targetId"];
      $this.delLinkInfo(sourceId, targetId);

      $this._plumb.deleteConnection(conn);
      $this._plumb.repaintEverything();

      if ($this.event_link_remove) {
        var link_info = this._linkInfos[sourceId + '-' + targetId];
        $this.event_link_remove(link_info);
      }

      $this._onCanvasChanged();
    }
  },
  removeLinkByTarget: function (targetId) {
    var $this = this;
    var conns = $this.getConnectionsByTarget(targetId);
    for (var i in conns) {
      var conn = conns[i];
      var sourceId = conn["sourceId"];
      $this.delLinkInfo(sourceId, targetId);

      $this._plumb.deleteConnection(conn);
      $this._plumb.repaintEverything();

      if ($this.event_link_remove) {
        var link_info = this._linkInfos[sourceId + '-' + targetId];
        $this.event_link_remove(link_info);
      }

      $this._onCanvasChanged();
    }
  },

  setEditable: function (editable) {
    this.editable = editable;
    if (this.editable == true) {
      andflow_util.removeClass('#' + this.containerId + ' .andflow', 'state');
    } else {
      andflow_util.addClass('#' + this.containerId + ' .andflow', 'state');
    }
  },
  getEditable: function () {
    return this.editable;
  },

  setFlow: function (flowModel) {
    this.flowModel = flowModel;
  },
  /**
   *  显示流程画布
   */
  showFlow: function (model) {
    var $this = this;
    if (model) {
      this.flowModel = model;
    }
    this._actionInfos = {};
    this._linkInfos = {};
    this._groupInfos = {};
    this._listInfos = {};
    this._tipInfos = {};

    this._actionContents = {};
    this._actionCharts = {};
    this._action_states = [];
    this._link_states = [];

    //删除所有连线，重新画
    this._plumb.deleteEveryConnection();
    document.querySelectorAll('.action').forEach(function (e, i) {
      var act = e.parentElement;

      $this._plumb.remove(act);
      andflow_util.removeElement(act);
    });

    document.querySelectorAll('.group').forEach(function (e, i) {
      $this._plumb.remove(e);
      andflow_util.removeElement(e);
    });
    document.querySelectorAll('.tip').forEach(function (e, i) {
      $this._plumb.remove(e);
      andflow_util.removeElement(e);
    });

    document.querySelectorAll('.list-item').forEach(function (e, i) {
      $this._plumb.remove(e);
      andflow_util.removeElement(e);
    });

    //删除所有组，和成员节点
    this._plumb.removeAllGroups(true);


    //清空画布
    document.getElementById('canvas').innerHtml = '';

    //建立节点
    var obj = this.flowModel;
    if (obj && obj.actions) {
      for (var k in obj.actions) {
        var action = obj.actions[k];
        //创建Action节点
        this._createAction(action);
      }
    }
    //建立TIP
    if (obj && obj.tips) {
      for (var k in obj.tips) {
        var tip = obj.tips[k];
        this._createTip(tip);
      }
    }

    //建立列表
    if (obj && obj.lists) {
      for (var l in obj.lists) {
        var list = obj.lists[l];
        this._createList(list);
      }
    }

    //建立组
    if (obj && obj.groups) {
      for (var g in obj.groups) {
        var group = obj.groups[g];

        this._createGroup(group);

      }
    }


    //建立节点连线
    if (obj && obj.links) {
      var linktype = this.flowModel.link_type || 'Flowchart';

      for (var lk in obj.links) {
        var link = obj.links[lk];

        var conn = this._plumb.connect({ source: link.source_id, target: link.target_id });

        if (conn == undefined || conn == null) {
          continue;
        }
        this.setLinkInfo(link);
        // this._paintConnection(conn, link); 
        // this._linkInfos[link.source_id + '-' + link.target_id] = link;
      }
    }


    //设置端点样式
    for (var a in obj.actions) {
      var act = obj.actions[a];
      var endpoints = this._plumb.getEndpoints(act.id);
      for (var ep in endpoints) {
        var endpoint = endpoints[ep];
        endpoint.setPaintStyle({
          stroke: this._themeObj.default_endpoint_stroke_color,
          fill: this._themeObj.default_endpoint_fill_color,
          radius: this._themeObj.default_endpoint_radius,
          strokeWidth: this._themeObj.default_endpoint_strokeWidth,
        });
        endpoint.setHoverPaintStyle({
          stroke: this._themeObj.default_endpoint_stroke_color_hover,
          fill: this._themeObj.default_endpoint_fill_color_hover,
          radius: this._themeObj.default_endpoint_radius_hover,
          strokeWidth: this._themeObj.default_endpoint_strokeWidth_hover,
        });
      }
    }

    this._plumb.repaintEverything();
  },

  getFlow: function () {
    var actions = this.getActions();
    var links = this.getLinks();
    var groups = this.getGroups();
    var lists = this.getLists();
    var tips = this.getTips();

    this.flowModel.actions = actions;
    this.flowModel.groups = groups;
    this.flowModel.lists = lists;
    this.flowModel.links = links;
    this.flowModel.tips = tips;

    return this.flowModel;
  },
  clearActionState: function () {
    var actionEl = document.querySelector('#' + this.containerId + ' .action');
    andflow_util.removeClass(actionEl, 'error');
    andflow_util.removeClass(actionEl, 'execute');
    andflow_util.removeClass(actionEl, 'reject');
    andflow_util.removeClass(actionEl, 'success');

  },

  setActionSelected: function (actionId, selected) {
    if (actionId == null || actionId == '' || !document.getElementById(actionId)) {
      return;
    }

    if (selected) {
      andflow_util.addClass(document.getElementById(actionId).querySelector(".action"), 'selected');
    } else {
      andflow_util.removeClass(document.getElementById(actionId).querySelector(".action"), 'selected');
    }
  },


  //设置节点图标
  setActionIcon: function (actionId, action_icon) {
    if (action_icon != null && action_icon.length > 0) {

      andflow_util.setAttr(document.getElementById(actionId).querySelector('.action-icon img'), 'src', this.img_path + action_icon);
    }
  },

  //设置节点样式状态
  setActionState: function (actionId, state) {
    if (actionId == null || actionId == '') {
      return;
    }

    var element = document.getElementById(actionId).querySelector('.action');

    if (state == null || state == '' || state == 0) {
      andflow_util.removeClass(element, 'error');
      andflow_util.removeClass(element, 'execute');
      andflow_util.removeClass(element, 'reject');
      andflow_util.removeClass(element, 'success');
      return;
    }


    if (state == -1 || state == 'error') {
      andflow_util.removeClass(element, 'error');
      andflow_util.removeClass(element, 'execute');
      andflow_util.removeClass(element, 'reject');
      andflow_util.removeClass(element, 'success');

      if (element.className.indexOf('error') < 0) {
        andflow_util.addClass(element, 'error');
      }
    } else if (state == 1 || state == 'success') {
      andflow_util.removeClass(element, 'error');
      andflow_util.removeClass(element, 'execute');
      andflow_util.removeClass(element, 'reject');
      andflow_util.removeClass(element, 'success');

      if (element.className.indexOf('success') < 0) {
        andflow_util.addClass(element, 'success');
      }

    } else if (state == 0 || state == 'reject') {
      andflow_util.removeClass(element, 'error');
      andflow_util.removeClass(element, 'execute');
      andflow_util.removeClass(element, 'reject');
      andflow_util.removeClass(element, 'success');

      if (element.className.indexOf('reject') < 0) {
        andflow_util.addClass(element, 'reject');
      }
    }
  },


  //设置节点状态样式
  setActionStates: function (action_states) {
    if (action_states == undefined || action_states == null) {
      action_states = this._action_states;
    }
    this._action_states = action_states;
    var elements = document.querySelectorAll('#' + this.containerId + ' .action');
    elements.forEach(function (e, index) {
      andflow_util.removeClass(e, 'success');
      andflow_util.removeClass(e, 'error');
      andflow_util.removeClass(e, 'execute');

    });


    var action_state_map = {};
    for (var k in action_states) {
      var actionId = action_states[k].action_id;
      action_state_map[actionId] = action_states[k];
    }

    //显示节点状态
    var actions = this.getActions();

    for (var i in actions) {
      var actionId = actions[i].id;
      var action_state = action_state_map[actionId];
      if (action_state == null) {
        continue;
      }
      //修改文字、颜色等样式
      var state = action_state.state;
      var isError = action_state.is_error;
      if (isError) {
        state = -1;
      }
      this.setActionState(actionId, state);

      //修改图标
      var action_icon = action_state.action_icon;
      this.setActionIcon(actionId, action_icon);

      //内容
      var actionContent = action_state.content;
      actionContent.action_id = actionId;
      this.showActionContent(actionContent);
    }

  },

  //设置连线状态
  setLinkState(source_id, target_id, state) {
    var conn = this.getConnection(source_id, target_id);
    if (conn == null) {
      return;
    }
    var data = conn.data;
    //如果不可用，就不用修改状态
    if (data != null && data.active == 'false') {
      return;
    }

    this._paintConnectionState(conn, state);
  },

  //修改连线状态
  setLinkStates: function (link_states) {

    var conn_list = this._plumb.getAllConnections();
    for (var i = 0; i < conn_list.length; i++) {
      this._paintConnectionState(conn_list[i], 9);
    }


    if (link_states == undefined || link_states == null) {
      link_states = this._link_states;
    }

    this._link_states = link_states;

    var link_state_map = {};
    for (var i in link_states) {
      var link_state = link_states[i];

      var source_id = link_state.source_action_id;
      var target_id = link_state.target_action_id;

      var state = link_state.state;
      var isError = link_state.is_error;
      if (isError == 1 || isError == true || isError == 'true') {
        state = -1;
      }

      this.setLinkState(source_id, target_id, state);
    }

    this._plumb.repaintEverything();
  },

  setLinkType: function (link_type) {
    this.flowModel.link_type = link_type;
    this.refresh();
  },

  //获取group
  getGroups: function () {
    var $this = this;

    var groups = [];
    var gs = this._plumb.getGroups();

    for (var i in gs) {
      var item = gs[i];
      var id = item.id;
      var el = item.getEl();
      var ms = item.getMembers();
      var group = $this._groupInfos[id];
      //children
      group.members = [];
      for (var j in ms) {
        let memberid = ms[j].id;
        group.members.push(memberid);

      }

      if (group.left != "auto") {
        let left = el.offsetLeft + "px";
        group.left = left;
      }
      if (group.top != "auto") {
        let top = el.offsetTop + "px";
        group.top = top;
      }
      if (group.width != "auto") {
        let w = el.offsetWidth + "px";
        group.width = w;
      }
      if (group.height != "auto") {
        let h = el.offsetHeight + "px";
        group.height = h;
      }

      groups.push(group);
    }


    return groups;
  },

  getLists: function () {
    var $this = this;

    var lists = [];

    document.querySelectorAll("#" + $this.containerId + " #canvas" + " .list").forEach(function (el, index) {

      var id = el.id;

      var item = $this._listInfos[id] || { id: id, left: "", top: "", width: "", height: "" };



      let ingroup = el.parentElement.className.indexOf("group-container") >= 0;

      if (ingroup) {

        item.left = (el.offsetLeft + el.parentElement.offsetLeft) + "px";
        item.top = (el.offsetTop + el.parentElement.offsetTop) + "px";
      } else {
        item.left = el.offsetLeft + "px";
        item.top = el.offsetTop + "px";
      }

      item.width = el.offsetWidth + "px";
      item.height = el.offsetHeight + "px";

      lists.push(item);
    });

    return lists;

  },


  getTips: function () {
    var $this = this;

    var tips = [];
    document.querySelectorAll("#" + $this.containerId + " #canvas" + " .tip").forEach(function (el, index) {

      var id = el.id;
      var item = $this._tipInfos[id] || { id: id, left: "", top: "", width: "", height: "" };

      let ingroup = el.parentElement.className.indexOf("group-container") >= 0;

      if (ingroup) {

        item.left = (el.offsetLeft + el.parentElement.offsetLeft) + "px";
        item.top = (el.offsetTop + el.parentElement.offsetTop) + "px";
      } else {
        item.left = el.offsetLeft + "px";
        item.top = el.offsetTop + "px";
      }

      item.width = el.offsetWidth + "px";
      item.height = el.offsetHeight + "px";

      tips.push(item);
    });

    return tips;

  },

  //获取Action节点信息
  getAction: function (id) {

    var $this = this;

    var actionBox = document.getElementById(id);
    var actionEl = actionBox.querySelector(".action");

    var action = $this._actionInfos[id];
    if (action == null) {
      action = {};
    }

    let ingroup = actionBox.parentElement.className.indexOf("group-container") >= 0;


    action['id'] = id;
    action['name'] = andflow_util.getAttr(actionEl, 'name') || action.name;

    action['title'] = andflow_util.getAttr(actionEl, 'title') || action.title;
    action['icon'] = andflow_util.getAttr(actionEl, 'icon') || action.icon;
    action['des'] = andflow_util.getAttr(actionEl, 'des') || action.des;
    action['tp'] = andflow_util.getAttr(actionEl, 'tp') || action.tp;


    if (ingroup) {
      action['left'] = (actionBox.offsetLeft + actionBox.parentElement.offsetLeft) + "px";
      action['top'] = (actionBox.offsetTop + actionBox.parentElement.offsetTop) + "px";
    } else {
      action['left'] = actionBox.offsetLeft + "px";
      action['top'] = actionBox.offsetTop + "px";
    }

    action['width'] = actionBox.offsetWidth + "px";
    action['height'] = actionBox.offsetHeight + "px";
    action['body_width'] = andflow_util.getAttr(actionBox, 'body_width');
    action['body_height'] = andflow_util.getAttr(actionBox, 'body_height');
    return action;
  },
  //获取所有Action节点信息
  getActions: function () {
    var $this = this;
    var actions = [];
    var canvas = document.querySelector('#' + this.containerId + ' #canvas');

    canvas.querySelectorAll('.action').forEach(function (actionEl, index) {

      var actionBox = actionEl.parentElement;

      var id = actionBox.id;

      var action = $this.getAction(id);

      actions.push(action);
    });

    return actions;
  },

  //获取连线
  getLinks: function () {
    var links = [];

    var conn_list = this._plumb.getAllConnections();

    for (var i = 0; i < conn_list.length; i++) {
      var source_id = conn_list[i]['sourceId'];
      var target_id = conn_list[i]['targetId'];

      var conn = this._linkInfos[source_id + '-' + target_id];
      if (conn == null) {
        conn = {};
      }
      conn['source_id'] = source_id;
      conn['target_id'] = target_id;

      this._linkInfos[source_id + '-' + target_id] = conn;

      links.push(conn);
    }

    return links;
  },
  getConnection: function (sourceId, targetId) {
    var conn_list = this._plumb.getAllConnections();

    for (var i = 0; i < conn_list.length; i++) {
      var source_id = conn_list[i]['sourceId'];
      var target_id = conn_list[i]['targetId'];

      if (source_id == sourceId && target_id == targetId) {

        return conn_list[i];
      }
    }

    return null;
  },
  getConnectionsBySource: function (sourceId) {
    var conn_list = this._plumb.getAllConnections();
    var conns = [];

    for (var i = 0; i < conn_list.length; i++) {
      var source_id = conn_list[i]['sourceId'];

      if (source_id == sourceId) {
        conns.push(conn_list[i]);
      }
    }

    return conns;
  },
  getConnectionsByTarget: function (targetId) {
    var conn_list = this._plumb.getAllConnections();
    var conns = [];

    for (var i = 0; i < conn_list.length; i++) {
      var target_id = conn_list[i]['targetId'];

      if (target_id == targetId) {
        conns.push(conn_list[i]);
      }
    }

    return conns;
  },



  //水平对齐
  horizontal: function () {
    var minTop = 999999999;

    var model = this.getFlow();

    for (var k in model.actions) {
      var top = model.actions[k].top;
      top = top.replace(/px/gi, '');
      if (minTop > top) {
        minTop = top;
      }
    }
    if (minTop < 10) {
      minTop = 10;
    }
    for (var k in model.actions) {
      model.actions[k].top = minTop + 'px';
    }

    this.showFlow(model);
    this.setActionStates(this._action_states);
    this.setLinkStates(this._link_states);
  },

  vertical: function () {
    var minLeft = 999999999;

    var model = this.getFlow();

    for (var k in model.actions) {
      var left = model.actions[k].top;
      left = left.replace(/px/gi, '');
      if (minLeft > left) {
        minLeft = left;
      }
    }
    if (minLeft < 10) {
      minLeft = 10;
    }
    for (var k in model.actions) {
      model.actions[k].left = minLeft + 'px';
    }

    this.showFlow(model);
    this.setActionStates(this._action_states);
    this.setLinkStates(this._link_states);
  },

  test: function () {
    alert(html2canvas);
    alert(jsPlumb.getInstance);
  },
  //获取截图
  getSnapshot: function (callback, opts) {

    if (!andflow_util.isVisible('#canvas')) {

      return;
    }

    var options = { backgroundColor: 'white', ignore_svg: false };

    if (opts) {
      options = andflow_util.extend(options, opts);
    }

    const cardBox = document.getElementById('canvas');

    const rect = cardBox.getBoundingClientRect();
    const offsetX = andflow_util.getPageLeft(cardBox);
    const offsetY = andflow_util.getPageTop(cardBox);
    const w = cardBox.scrollWidth;
    const h = cardBox.scrollHeight;
    const scale = options.scale || 1;

    let dist_canvas = document.createElement('canvas');

    document.body.append(dist_canvas);

    dist_canvas.style.width = w + 'px';
    dist_canvas.style.height = h + 'px';

    html2canvas(cardBox, {
      canvas: dist_canvas,
      scale: scale,
      allowTaint: true,
      foreignObjectRendering: true,
      backgroundColor: options.backgroundColor || 'transparent',
      dpi: 300,
      width: w,
      height: h,
      x: -offsetX,
      y: -offsetY,
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
      ignoreElements: e => {

        return false;

      }

    }).then(function (cvs) {

      if (callback) {
        callback(cvs);
      }
    });
    andflow_util.removeElement(dist_canvas);

  },

  //截图,并保存为
  snap: function (name) {
    var $this = this;

    name = name || 'andflow';

    var ext = 'jpeg';

    this.getSnapshot(
      function (canvas) {

        var url = canvas.toDataURL('image/jpeg'); //生成下载的url

        var triggerDownload = andflow_util.parseHtml('<a href="' + url + '" download="' + name + '.' + ext + '"></a>');
        // 把url放到我们的a标签中，并得到a标签对象
        triggerDownload.click(); //模拟点击一下a标签，即可下载啦！

      },
      { scale: 1, backgroundColor: 'white', ignore_svg: false }
    );

  },

  setActionContents: function (actioncontentMap) {
    if (actioncontentMap) {
      this._actionContents = actioncontentMap;
    }
    if (this._actionContents == null || this._actionContents.length == 0) {
      return;
    }
    for (var actionId in this._actionContents) {
      var ac = this._actionContents[actionId];
      this.setActionContent(actionId, ac.content, ac.content_type);
    }
  },
  getActionTitle: function (action_id) {
    var action = this._actionInfos[action_id];
    return action.title;
  },


  setActionTitle: function (action_id, title) {
    this._actionInfos[action_id].title = title;
    document.getElementById(action_id).querySelector(".action-header").innerHTML = (title);
  },
  setActionTheme: function (action_id, theme) {
    this._actionInfos[action_id].theme = theme;

    for (var k in flow_themes) {
      andflow_util.removeClass(document.getElementById(action_id), k)
    }

    andflow_util.addClass(document.getElementById(action_id), theme);
    if (this._plumb) {
      this._plumb.repaintEverything();
    }

  },
  getActionContent: function (action_id) {
    var actioncontent = this._actionContents[action_id];
    return actioncontent;
  },

  setActionContent: function (action_id, content, content_type) {
    if (action_id == undefined || action_id == null || action_id == "" || this._actionInfos[action_id] == null) {
      return;
    }

    this._actionInfos[action_id].content = { content_type: content_type, content: content };
    this._actionContents[action_id] = { content_type: content_type, content: content };

    if (
      this.flowModel.show_action_content == false ||
      this.flowModel.show_action_content == 'false'
    ) {
      return;
    }

    var element = document.getElementById(action_id).querySelector('.action-content');
    if (!element) {
      return;
    }
    switch (content_type) {
      case 'msg':
        if (this._actionCharts[action_id] != null) {
          this._actionCharts[action_id].dispose();
          this._actionCharts[action_id] = null;
        }

        element.innerHTML = ("<div class='action-msg'>" + content + '</div>');

        break;
      case 'keyvalue':
        var data = JSON.parse(content);
        var grid = andflow_util.parseHtml('<table class="action-result-table" style="width:100%"></table>');
        for (var k in data) {
          var row = andflow_util.parseHtml('<tr><td class="action-result-label">' +
            k +
            '</td><td class="action-result-value">' +
            data[k] +
            '</td></tr>');

          grid.appendChild(row);
        }

        element.innerHTML = '';
        element.appendChild(grid);
        andflow_util.setStyle(element, 'overflow-y', 'auto');
        break;
      case 'grid':
        if (this._actionCharts[action_id] != null) {
          this._actionCharts[action_id].dispose();
          this._actionCharts[action_id] = null;
        }

        var griddata = JSON.parse(content);

        var columns = griddata['columns'];
        var data = griddata['rows'];

        var datas = [];
        if (data instanceof Array) {
          datas = data;
        } else {
          datas.push(data);
        }

        if (columns == null || columns.length == 0) {
          columns = [];
          if (datas.length > 0) {
            for (var k in datas[0]) {
              columns.push({ name: k, title: k });
            }
          }
        }

        var grid = andflow_util.parseHtml('<table class="table" style="width:100%"></table>');

        //header
        var headerEl = andflow_util.parseHtml('<tr></tr>');
        for (var j in columns) {
          var title = columns[j].title || columns[j].name;
          var colEl = andflow_util.parseHtml('<th>' + title + '</th>');
          headerEl.appendChild(colEl);
        }
        grid.appendChild(headerEl);

        //body
        for (var i in datas) {
          var row = datas[i];
          var rowDatas = [];

          if (row instanceof Object) {
            for (var k in columns) {
              rowDatas.push(row[columns[k].name]);
            }
          } else {
            rowDatas.push(row);
          }
          var rowEl = andflow_util.parseHtml('<tr></tr>');
          for (var j in rowDatas) {
            var val = rowDatas[j];
            if (val instanceof Object) {
              val = JSON.stringify(val);
            }
            var colEl = andflow_util.parseHtml('<td>' + val + '</td>');
            rowEl.appendChild(colEl);
          }
          grid.appendChild(rowEl);
        }
        element.innerHTML = '';
        element.appendChild(grid);
        andflow_util.setStyle(element, 'overflow-y', 'auto');

        break;
      case 'html':

        if (this._actionCharts[action_id] != null) {
          this._actionCharts[action_id].dispose();
          this._actionCharts[action_id] = null;
        }

        element.innerHTML = ("<div class='action-html'>" + content + '</div>');

        break;
      case 'chart':
        var option = JSON.parse(content);

        var id = 'chart_' + action_id;

        var charDom = element.querySelector('#' + id);

        var actionChart = this._actionCharts[action_id];
        if (actionChart == null || !charDom) {
          element.innerHTML = "<div id='" + id + "' class='action-chart'></div>";
          var w = element.offsetWidth;
          var h = element.offsetHeight;
          var charEl = element.querySelector('#' + id);
          andflow_util.setStyle(charEl, 'width', w + 'px');
          andflow_util.setStyle(charEl, 'height', h + 'px');

          actionChart = echarts.init(document.getElementById(id));

        }
        actionChart.setOption(option);
        this._actionCharts[action_id] = actionChart;

        break;
      case 'form':
        if (this._actionCharts[action_id] != null) {
          this._actionCharts[action_id].dispose();
          this._actionCharts[action_id] = null;
        }
        var data = JSON.parse(content);
        var url = data.url;

        element.innerHTML = '<iframe src="' + url + '" style="width:100%;height: 100%;" frameborder="0"></iframe>';

        break;
      case 'web':
        if (this._actionCharts[action_id] != null) {
          this._actionCharts[action_id].dispose();
          this._actionCharts[action_id] = null;
        }
        element.innerHTML = '<iframe src="' + content + '" style="width:100%;height: 100%;" frameborder="0"></iframe>';

        break;
      default:
        if (this._actionCharts[action_id] != null) {
          this._actionCharts[action_id].dispose();
          this._actionCharts[action_id] = null;
        }

        element.innerHTML = content;

        break;
    }

  },

  //显示所有action内容
  showAllActionContent: function (states) {
    if (states) {
      for (var k in states) {
        var actionContent = states[k].content;
        if (actionContent != null) {
          this.showActionContent(actionContent);
        }
      }
    }
  },

  //绘制Action内容 {action_id,content_type,content}
  showActionContent: function (actionContent) {
    if (
      actionContent == null ||
      actionContent.content_type == null ||
      actionContent.content == null
    ) {
      return;
    }

    var content_type = actionContent.content_type;
    var content = actionContent.content;
    var action_id = actionContent.action_id;

    this.setActionContent(action_id, content, content_type);
  },

  setActionBodyVisible: function (v) {
    this.flowModel.show_action_body = v ? 'true' : 'false';
    if (this.flowModel.show_action_body == 'false') {
      document.querySelectorAll('#' + this.containerId + ' .action-body').forEach(function (el) {
        andflow_util.hide(el);
      });

    } else {
      document.querySelectorAll('#' + this.containerId + ' .action-body').forEach(function (el) {
        andflow_util.show(el);
      });

    }
  },

  setActionContentVisible: function (v) {
    this.flowModel.show_action_content = v ? 'true' : 'false';
    if (this.flowModel.show_action_content == 'false' || this.flowModel.show_action_content == false) {
      document.querySelectorAll('#' + this.containerId + ' .action-content').forEach(function (el) {
        andflow_util.hide(el);
      });


    } else {
      document.querySelectorAll('#' + this.containerId + ' .action-content').forEach(function (el) {
        andflow_util.show(el);
      });

    }
  }
};
