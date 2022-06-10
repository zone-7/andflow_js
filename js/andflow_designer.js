var andflow_designer = {
    andflow: null,
    currentSnapshot: null,
    his_option: {},
    runtime: null,
    is_runing: false,
    client_id: '',
    socket_retry_times: 0,
    socket: null,
    token: null,
    init: function (containerId, option) {
      this.his_option = option;
      this.runtime = null;
      this.client_id = jsPlumbUtil.uuid().replaceAll('-', '');
  
      this.token = option.token;
  
      if (option.flowModel) {
        $('.designer-title').html(option.flowModel.name || '');
      }
  
      this._initHtml(containerId);
  
      this._initEvents(option);
  
      this.andflow = this.showFlow(option);
  
      this._initWebsocket();
  
      return this.andflow;
    },
  
    _initHtml: function(id){
      var html = '';
      html += '<div class="designer-box">';
      html += '    <div class="designer-header">';
      html += '      <div class="designer-tab">';
      html += '        <a class="designer-tab-btn active">设计</a>';
      html += '        <a class="designer-tab-btn" target="designer_source">脚本</a>';
      html += '        <a class="designer-tab-btn" target="designer_runtime">运行时</a>';
      html += '      </div>';
      html += '      <div class="designer-title"> </div>';
      html += '      <div class="designer-tool">';
      html += '        <a id="andflow_tool_btn_horizontal" class="designer-tool-btn">水平对齐</a>';
      html += '        <a id="andflow_tool_btn_vertical" class="designer-tool-btn">垂直对齐</a>';
      html += '        <a class="designer-tool-split"></a>';
      html += '        <a id="andflow_tool_btn_snapshot" class="designer-tool-btn">截图</a>';
      html += '        <a id="andflow_tool_btn_run" class="designer-tool-btn">运行</a>';
      html += '        <a id="andflow_tool_btn_stop" class="designer-tool-btn">停止</a>';
      html += '        <a class="designer-tool-split"></a>';
      html += '        <a id="andflow_tool_btn_save" class="designer-tool-btn">保存</a>';
      html += '        <a id="andflow_tool_btn_reload" class="designer-tool-btn">重置</a>';
      html += '      </div>';
      html += '    </div>';
      html += '    <div class="designer-dialog-mask"></div>';
      html += '    <div class="designer-dialog">';
      html += '      <div class="designer-dialog-header">';
      html += '        <div class="designer-dialog-title"></div>';
      html += '        <div class="designer-dialog-tool">';
      html += '           <a id="designer_dialog_max_btn" class="designer-dialog-header-btn">+</a>';
      html += '           <a id="designer_dialog_close_btn" class="designer-dialog-header-btn">x</a>';
      html += '        </div>';
      html += '      </div>';
      html += '      <div class="designer-dialog-body"></div>';
      html += '      <div class="designer-dialog-footer"></div>';
      html += '    </div>';
      html += '    <div id="designer_source" class="designer-source designer-tab-content">';
      html += '      <textarea> </textarea>';
      html += '    </div>';
      html += '    <div id="designer_runtime" class="designer-runtime designer-tab-content"> </div>';
      html += '    <div id="designer_body" class="designer-body">';
      html += '      <div class="main-box">';
      html += '        <div id="andflow" style="width: 100%; height: 100%; padding: 0px"> </div>';
      html += '      </div>';
      html += '      <div class="right-box">';
      html += '        <div class="tab-bar">';
      html += '          <div class="tab-btn active" target="flow_property">属性</div>';
      html += '          <div class="tab-btn" target="flow_param">参数</div>';
      html += '          <div class="tab-btn" target="flow_dict">字典</div>';
      html += '        </div>';
      html += '        <div class="tab-body">';
      html += '          <div class="tab-content active" id="flow_property">';
      html += '            <form id="flowPropertyForm" class="property-form">';
      html += '              <div class="form-item">';
      html += '                <label for="flow_type">流程类型</label>';
      html += '                <select name="flow_type">';
      html += '                  <option value="disposable">一次性完成</option>';
      html += '                  <option value="stages">分步执行</option>';
      html += '                </select>';
      html += '              </div>';
      html += '              <div class="form-item">';
      html += '                <label for="link_type">连线类型</label>';
      html += '                <select name="link_type">';
      html += '                  <option value="Flowchart">流程</option>';
      html += '                  <option value="Straight">直线</option>';
      html += '                  <option value="Bezier">曲线</option>';
      html += '                  <option value="StateMachine">状态</option>';
      html += '                </select>';
      html += '              </div>';
      html += '              <div class="form-item">';
      html += '                <label for="theme">节点样式</label>';
      html += '                <select name="theme">';
      html += '                  <option value="flow_theme_default">默认样式</option>';
      html += '                  <option value="flow_theme_zone">右置标题</option>';
      html += '                  <option value="flow_theme_icon">大图标</option>';
      html += '                </select>';
      html += '              </div>';
      html += '              <div class="form-item">';
      html += '                <label for="show_action_content">是否显示节点信息</label>';
      html += '                <select name="show_action_content">';
      html += '                  <option value="true">是</option>';
      html += '                  <option value="false">否</option>';
      html += '                </select>';
      html += '              </div>';
      html += '              <div class="form-item">';
      html += '                <label for="log_type">日志类型</label>';
      html += '                <select name="log_type">';
      html += '                  <option value="false">不记录</option>';
      html += '                  <option value="true">记录</option>';
      html += '                </select>';
      html += '              </div>';
      html += '              <div class="form-item">';
      html += '                <label for="store_type">执行过程存储</label>';
      html += '                <select name="store_type">';
      html += '                  <option value="true">持久化</option>';
      html += '                  <option value="false">临时缓存</option>';
      html += '                </select>';
      html += '              </div>';
      html += '              <div class="form-item">';
      html += '                <label for="timeout">运行时效(毫秒）</label>';
      html += '                <input type="number" name="timeout" placeholder="执行超时时间(毫秒）" value="" />';
      html += '              </div>';
      html += '              <div class="form-item">';
      html += '                <label for="cache_timeout">缓存时效(毫秒）</label>';
      html += '                <input  type="number" name="cache_timeout" placeholder="缓存有效期(毫秒）" value="" />';
      html += '              </div>';
      html += '            </form>';
      html += '          </div>';
      html += '          <div class="tab-content" id="flow_param">';
      html += '            <table class="param-table" border="0" cellspacing="1" cellpadding="0">';
      html += '              <thead>';
      html += '                <tr><th>Key</th><th>Value</th><th class="table-btn add">+</th></tr>';
      html += '              </thead>';
      html += '              <tbody> </tbody>';
      html += '            </table>';
      html += '          </div>';
      html += '          <div class="tab-content" id="flow_dict">';
      html += '            <table class="dict-table" border="0" cellspacing="1" cellpadding="0">';
      html += '              <thead>';
      html += '                <tr>';
      html += '                  <th>Name</th><th>Label</th><th class="table-btn add">+</th>';
      html += '                </tr>';
      html += '              </thead>';
      html += '              <tbody> </tbody>';
      html += '            </table>';
      html += '          </div>';
      html += '        </div>';
      html += '      </div>';
      html += '    </div>';
      html += '  </div>';
      $('#'+id).html(html);
  
    },
    setOption: function (option) {
      var a = JSON.stringify(option);
      this.his_option = JSON.parse(a);
  
      this.token = option.token;
  
      if (option.flowModel) {
        $('.designer-title').html(option.flowModel.name || '');
      }
  
      this._initEvents(option);
  
      this.andflow = this.showFlow(option);
  
      return this.andflow;
    },
    setProperty: function (flowmodel) {
      $('.property-form')
        .find('input')
        .each(function (index, el) {
          var name = $(el).attr('name');
          var value = flowmodel[name] || '';
  
          $(el).val(value);
        });
      $('.property-form')
        .find('select')
        .each(function (index, el) {
          var name = $(el).attr('name');
          var value = flowmodel[name] || '';
          $(el).val(value);
        });
    },
    getProperty: function () {
      var prop = {};
      $('.property-form')
        .find('input')
        .each(function (index, el) {
          var name = $(el).attr('name');
          var value = $(el).val();
          prop[name] = value;
        });
      $('.property-form')
        .find('select')
        .each(function (index, el) {
          var name = $(el).attr('name');
          var value = $(el).val();
          prop[name] = value;
        });
      return prop;
    },
  
    addParam: function (data) {
      var row = $(
        '<tr><td><input name="name" /></td><td><input name="value" /></td><td class="table-btn del">-</td></tr>',
      );
      row.find("input[name='name']").val(data.name);
      row.find("input[name='value']").val(data.value);
  
      row.find('.del').bind('click', function () {
        $(this).parent().remove();
      });
  
      $('.param-table').find('tbody').append(row);
    },
  
    clearParam: function () {
      $('.param-table').find('tbody').html('');
    },
  
    setParams: function (flowmodel) {
      this.clearParam();
      if (flowmodel.params) {
        for (var k in flowmodel.params) {
          var data = flowmodel.params[k];
          this.addParam(data);
        }
      }
    },
  
    getParams: function () {
      var params = [];
      $('#flow_param .param-table')
        .find('tbody tr')
        .each(function (index, el) {
          var name = $(el).find("input[name='name']").val();
          var value = $(el).find("input[name='value']").val();
          if (name.length > 0) {
            params.push({ name: name, value: value });
          }
        });
      return params;
    },
  
    addDict: function (data) {
      var row = $(
        '<tr><td><input name="name" /></td><td><input name="label" /></td><td class="table-btn del">-</td></tr>',
      );
      row.find("input[name='name']").val(data.name);
      row.find("input[name='label']").val(data.label);
  
      row.find('.del').bind('click', function () {
        $(this).parent().remove();
      });
  
      $('.dict-table').find('tbody').append(row);
    },
  
    clearDict: function () {
      $('.dict-table').find('tbody').html('');
    },
  
    setDicts: function (flowmodel) {
      this.clearDict();
      if (flowmodel.dict) {
        for (var k in flowmodel.dict) {
          var data = flowmodel.dict[k];
          this.addDict(data);
        }
      }
    },
  
    getDicts: function () {
      var dicts = [];
      $('#flow_dict .dict-table')
        .find('tbody tr')
        .each(function (index, el) {
          var name = $(el).find("input[name='name']").val();
          var label = $(el).find("input[name='label']").val();
          if (name.length > 0) {
            dicts.push({ name: name, label: label });
          }
        });
      return dicts;
    },
  
    showFlow: function (option) {
      var a = JSON.stringify(option);
      opt = JSON.parse(a);
  
      var root = this;
  
      root.setProperty(opt.flowModel);
      root.setParams(opt.flowModel);
      root.setDicts(opt.flowModel);
  
      var options = {
        img_path: opt.img_path || '',
        tags: opt.tags || ['', '通用', '系统'], //组件过滤标签列表
        metadata: opt.metadata || [], //组件元素
        flowModel: opt.flowModel || {}, //流程模型
        editable: opt.editable || true, //是否可编辑，默认true
        show_toolbar: opt.show_toolbar || true,
        metadata_style: opt.metadata_style || 'metadata_fix_left', //metadata_fix_left 、metadata_float_left、metadata_float_top
        render_action: function (metadata, action, html) {
          return html;
  
          // return '<div style="display: block;min-width:50px;min-height:50px;width: 100%;height: 100%; border:5px solid blue;border-radius: 15px;">'+metadata.title+'</div>';
        }, //节点渲染
        render_action_helper: function (metadata, html) {
          return null;
        }, //节点拖拉渲染
        render_link: function (conn, linktype, linkdata) {
          return null;
        }, //连接线渲染
        render_endpoint: function (metadata, action, html) {
          return html;
        }, //连接点渲染
        render_btn_remove: function (metadata, action, html) {
          return html;
        }, //删除按钮渲染
        render_btn_resize: function (metadata, action, html) {
          return html;
        }, //大小拖拉按钮渲染
  
        //节点单击事件
        event_action_click: function (metadata, action) {
          //var oldid = $('#current_action_id').val();
          //root.andflow.setActionSelected(oldid, false);
          //$('#current_action_id').val(action.id);
          //root.andflow.setActionSelected(action.id, true);
        },
        //节点双击事件
        event_action_dblclick: function (metadata, action) {
          root.showActionDialog(metadata, action);
        },
        //连线单击事件
        event_link_click: function (link) {
          //alert('link  click');
        },
        //连线双击事件
        event_link_dblclick: function (link) {
          root.showLinkDialog(link);
        },
        //画图板单击事件
        event_canvas_click: function (e) {
          //var oldid = $('#current_action_id').val();
          //root.andflow.setActionSelected(oldid, false);
          //$('#current_action_id').val('');
        },
  
        event_action_remove: function (action) {
          //alert(action.id);
        },
        event_link_remove: function (link) {
          //alert(link.source_id, link.target_id);
        },
      };
  
      root.andflow = andflow.newInstance('andflow', options);
      root.andflow.showFlow();
      return root.andflow;
    },
  
    getFlow: function () {
      var flow = this.andflow.getFlow();
  
      var prop = this.getProperty();
      var params = this.getParams();
      var dict = this.getDicts();
      $.extend(flow, prop);
      flow.params = params;
      flow.dict = dict;
  
      return flow;
    },
  
    snap: function (title) {
      this.andflow.snap(title);
    },
    getSnapshot: function (callback) {
      this.andflow.getSnapshot(callback);
    },
    refresh: function () {
      this.showFlow(this.his_option);
    },
    reset: function () {
      this.runtime = null;
      $('#designer_runtime').html('');
      this.showFlow(this.his_option);
      this.andflow.setActionStates([]);
      this.andflow.setLinkStates([]);
      this.andflow.refresh();
    },
  
    setEditable: function (editable) {
      this.andflow.setEditable(editable);
    },
  
    //清空运行时状态
    clearRuntime: function () {
      this.is_runing = false;
      this.runtime = null;
  
      this.andflow.setActionStates([]);
      this.andflow.setLinkStates([]);
    },
    showRuntime: function (runtime) {
      var root = this;
  
      $('#designer_runtime').html('');
  
      if (runtime == null) {
        return;
      }
      this.runtime = runtime;
  
      var logs = runtime.logs;
      var param_infos = runtime.param_infos;
      var actionstates = runtime.action_states;
      var linkstates = runtime.link_states;
      var datas = runtime.data;
      console.log(actionstates);
  
      this.andflow.setActionStates(actionstates);
      this.andflow.setLinkStates(linkstates);
  
      if (!$('#designer_runtime').is(':visible')) {
        return;
      }
      //运行时信息
      $('#designer_runtime').append('<h4>状态</h4>');
  
      var table_info = $(
        '<table class="runtime-table"><thead><tr><th>状态</th><th>开始时间</th><th>停止时间</th><th>耗时</th></tr></thead><tbody></tbody></table>',
      );
      var info = '<tr>';
      info += '<td>' + (runtime.is_error == 1 ? '异常' : '正常') + '</td>';
      info += '<td>' + (runtime.current_start_time || '') + '</td>';
      info += '<td>' + (runtime.current_stop_time || '') + '</td>';
      info += '<td>' + (runtime.current_time_used || '') + 'ms</td>';
      info += '</tr>';
      table_info.find('tbody').append(info);
      $('#designer_runtime').append(table_info);
  
      //param
      $('#designer_runtime').append('<h4>参数</h4>');
  
      var table_params = $(
        '<table class="runtime-table"><thead><tr><th style="width:100px;">参数</th><th>类型</th><th>有效期</th><th>大小</th><th style="width:50%;">值</th></tr></thead><tbody></tbody></table>',
      );
  
      for (var key in param_infos) {
        var info = param_infos[key];
        var size = info.size || 0;
        var type_name = info.type_name || '';
        var expire_millisecond = info.expire_millisecond;
  
        var html = '<tr key="' + key + '">';
        html += '<td style="text-align: center;">' + key + '</td>';
        html += '<td style="text-align: center;">' + type_name + '</td>';
        html += '<td style="text-align: center;">' + expire_millisecond + '</td>';
        html += '<td style="text-align: right;">' + size + 'b</td>';
        html += '<td class="val" style="text-align: center;"><a>点击加载</a></td>';
  
        html += '</tr>';
        var item = $(html);
        item.find('.val').click(function (e) {
          if (root.his_option.event_getcache) {
            var k = $(this).attr('key');
            var value = root.his_option.event_getcache(runtime.id, k);
            $(this).html(value);
          }
        });
  
        table_params.find('tbody').append(item);
      }
      $('#designer_runtime').append(table_params);
  
      //data
      $('#designer_runtime').append('<h4>数据</h4>');
      var table_data = $(
        '<table class="runtime-table"><thead><tr><th style="width:100px;">参数</th><th>值</th></tr></thead><tbody></tbody></table>',
      );
      for (var key in datas) {
        var name = datas[key].name;
        var value = datas[key].value;
  
        table_data.find('tbody').append('<tr><td>' + name + '</td><td>' + value + '</td></tr>');
      }
      $('#designer_runtime').append(table_data);
      //action data
      $('#designer_runtime').append('<h4>节点数据</h4>');
      var table_actiondata = $(
        '<table class="runtime-table"><thead><tr><th style="width:30px;">节点</th><th>描述</th><th>名称</th><th>值</th></tr></thead><tbody></tbody></table>',
      );
      for (var i in actionstates) {
        var action_name = actionstates[i].action_name;
        var action_title = actionstates[i].action_title || action_name || '';
        var action_des = actionstates[i].action_des || '';
        var datas = actionstates[i].data;
        for (var j in datas) {
          var name = datas[j].name;
          var value = datas[j].value;
  
          table_actiondata
            .find('tbody')
            .append(
              '<tr><td>' +
                action_title +
                '</td><td>' +
                action_des +
                '</td><td>' +
                name +
                '</td><td>' +
                value +
                '</td></tr>',
            );
        }
      }
      $('#designer_runtime').append(table_actiondata);
      //log
      $('#designer_runtime').append('<h4>日志</h4>');
      var table_log = $(
        '<table class="runtime-table"><thead><tr><th style="width:30px;">序号</th><th>类型</th><th>名称</th><th>标签</th><th>时间</th><th>内容</th></tr></thead><tbody></tbody></table>',
      );
      for (var k in logs) {
        var log = logs[k];
        var tp = log.tp;
        var name = log.name;
        var tag = log.tag;
        var time = log.time;
        var content = log.content;
  
        var html = '<tr class="logRow ' + tag + '">';
        html += '<td>' + (k * 1 + 1) + '</td>';
        html += '<td>' + tp + '</td>';
        html += '<td>' + name + '</td>';
        html += '<td>' + tag + '</td>';
        html += '<td>' + time + '</td>';
        html += '<td>' + content + '</td>';
        html += '</tr>';
  
        table_log.append(html);
      }
      $('#designer_runtime').append(table_log);
    },
    getRunParams: function () {
      var params = {};
      $('.run-param-table')
        .find('tbody tr')
        .each(function (index, el) {
          var inputEl = $(el).find('input');
          var name = inputEl.attr('name');
          var value = inputEl.val();
          if (name.length > 0) {
            params[name] = value;
          }
        });
      return params;
    },
    run: function () {
      if (this.his_option.event_run) {
        var flow = this.getFlow();
        var param = this.getRunParams();
        this.his_option.event_run(this.client_id, flow, param);
      }
      this.closeDialog();
    },
    runStep: function () {
      if(this.runtime == null){
        return this.run();
      }
      if (this.his_option.event_step) {
        var flow = this.getFlow();
        var runtime = this.runtime;
        var param = this.getRunParams();
        this.his_option.event_step(this.client_id, flow, runtime, param);
      }
      this.closeDialog();
    },
    closeDialog: function () {
      $('.designer-dialog-mask').hide();
      $('.designer-dialog').hide();
    },
  
    showDialog: function (opt) {
      var root = this;
      opt = opt || {};
  
      if (opt.full == true) {
        $('.designer-dialog').css('width', '100%');
        $('.designer-dialog').css('height', '100%');
        $('.designer-dialog').css('left', '0');
        $('.designer-dialog').css('top', '0');
  
        $('.designer-dialog').attr('default_width', '100%');
        $('.designer-dialog').attr('default_height', '100%');
        $('.designer-dialog').attr('default_left', '0');
        $('.designer-dialog').attr('default_top', '0');
      } else {
        var parent_w = $('.designer-dialog').parent().width();
        var parent_h = $('.designer-dialog').parent().height();
        var w = opt.width || ( parent_w / 2 );
        var h = opt.height || ( parent_h / 2 );
        var left = parent_w / 2 - w / 2;
        var top = parent_h / 2 - h / 2;
  
        if (w >= parent_w - 20 || h >= parent_h - 20 || left < 0 || top < 0) {
          w = parent_w - 20;
          h = parent_h - 20;
          left = 0;
          top = 0;
        }
  
        $('.designer-dialog').width(w);
        $('.designer-dialog').height(h);
        $('.designer-dialog').css('left', left + 'px');
        $('.designer-dialog').css('top', top + 'px');
  
        $('.designer-dialog').attr('default_width', w);
        $('.designer-dialog').attr('default_height', h);
        $('.designer-dialog').attr('default_left', left);
        $('.designer-dialog').attr('default_top', top);
      }
  
      $('.designer-dialog-mask').show();
      $('.designer-dialog').show();
  
      $('.designer-dialog .designer-dialog-title').html(opt.title || '');
      $('.designer-dialog .designer-dialog-footer').html('');
  
      if (opt.buttons) {
        for (var k in opt.buttons) {
          var btnInfo = opt.buttons[k];
          var btn = $('<a class="designer-dialog-footer-btn">' + btnInfo.text + '</a>');
          if (btnInfo.click) {
            btn.bind('click', btnInfo.click);
          }
          $('.designer-dialog .designer-dialog-footer').append(btn);
        }
      }
  
      var close_btn = $('<a class="designer-dialog-footer-btn">关闭</a>');
      close_btn.bind('click', function () {
        root.closeDialog();
      });
  
      $('.designer-dialog .designer-dialog-footer').append(close_btn);
  
      $('.designer-dialog .designer-dialog-body').html('');
      $('.designer-dialog .designer-dialog-body').append(opt.content || '');
    },
    showActionDialog: function (actionMetadata, action) {
      var root = this;
      var oldAction = action;
      var actionparams = action.params || {};
  
      var content_action = $(
        '<table class="action-info-table param-table"><tbody></tbody></tbody></table>',
      );
      //title
      var row_title = $(
        '<tr><td class="param-table-label">名称</td><td><input name="title" value="" readonly></td></tr>',
      );
      row_title.find('input').val(action.title || actionMetadata.title);
      content_action.find('tbody').append(row_title);
      //des
      var row_des = $(
        '<tr><td class="param-table-label">描述/标题</td><td><input name="des" value=""></td></tr>',
      );
  
      row_des.find('input').val(action.des);
      content_action.find('tbody').append(row_des);
  
      var content_param = $(
        '<table class="action-param-table param-table"><tbody></tbody></tbody></table>',
      );
  
      for (var k in actionMetadata.params) {
        const param = actionMetadata.params[k];
        const name = param.name;
        const title = param.title;
        const placeholder = param.placeholder;
        const element = param.element || 'input';
        const def = param.default;
        const attrs = param.attrs || [];
        const options = param.options;
  
        const value = actionparams[name];
  
        let row = null;
  
        if (element == 'input') {
          row = $(
            '<tr><td class="param-table-label">' +
              title +
              '</td><td><input name="' +
              name +
              '" /></td></tr>',
          );
          row.find('input').val(value || def || '');
          row.find('input').attr('placeholder', placeholder);
          for (var a in attrs) {
            var attr = attrs[a];
            row.find('input').attr(a, attr);
          }
        } else if (element == 'textarea') {
          row = $(
            '<tr><td class="param-table-label">' +
              title +
              '</td><td><textarea name="' +
              name +
              '" ></textarea></td></tr>',
          );
          row.find('textarea').val(value || def || '');
          row.find('textarea').attr('placeholder', placeholder);
          for (var a in attrs) {
            var attr = attrs[a];
            row.find('textarea').attr(a, attr);
          }
        } else if (element == 'select') {
          row = $(
            '<tr><td class="param-table-label">' +
              title +
              '</td><td><select name="' +
              name +
              '" ></select></td></tr>',
          );
          for (var o in options) {
            var op = options[o];
            row.find('select').append('<option value="' + op.value + '">' + op.label + '</option>');
          }
          row.find('select').val(value || def || '');
          row.find('select').attr('placeholder', placeholder);
          for (var a in attrs) {
            var attr = attrs[a];
            row.find('select').attr(a, attr);
          }
        } else if (element == 'select_user') {
          row = $(
            '<tr><td class="param-table-label">' +
              title +
              '</td><td>'+
              '<div class="userselect">'+
              '<span class="param-value-labels" ></span>'+
              '<input name="' + name + '" readonly="true" style="display:none;" />'+
              '</div>'+
              '</td></tr>',
          );
  
          if (value != null && value.length > 0) {
            const userList = JSON.parse(value);
            let usernames = root._getUserNames(userList);
            row.find('.param-value-labels').html(usernames.join(','));
          }
  
          row.find('input').val(value || def || '');
          row.find('input').attr('placeholder', placeholder);
  
          const currentrow = row;
          row.find('.userselect').bind('click', function () {
            function callback(val) {
              let usernames = root._getUserNames(val).join(',');
              let user_value = JSON.stringify(val);
              currentrow.find('input').val(user_value);
              currentrow.find('.param-value-labels').html(usernames);
            }
  
            if (root.his_option.event_selectuser) {
              let v = row.find('input').val();
  
              root.his_option.event_selectuser(v, callback);
            }
          });
          for (var a in attrs) {
            var attr = attrs[a];
            row.find('input').attr(a, attr);
          }
        } else {
          row = $(
            '<tr><td class="param-table-label">' +
              title +
              '</td><td><input name="' +
              name +
              '" /></td></tr>',
          );
          row.find('input').val(value || def || '');
          row.find('input').attr('placeholder', placeholder);
          for (var a in attrs) {
            var attr = attrs[a];
            row.find('input').attr(a, attr);
          }
        }
  
        if (row != null) {
          content_param.append(row);
        }
      }
      //end for
  
      var content_script = $(
        '<table class="action-script-table param-table"><tbody></tbody></tbody></table>',
      );
      var row_filter = $(
        '<tr><td class="param-table-label">过滤脚本</td><td><textarea name="filter" style="height:200px;"></textarea></td></tr>',
      );
      row_filter.find('textarea').val(action.filter);
      content_script.find('tbody').append(row_filter);
      var row_script = $(
        '<tr><td class="param-table-label">执行脚本</td><td><textarea name="script" style="height:200px;"></textarea></td></tr>',
      );
      row_script.find('textarea').val(action.script);
      content_script.find('tbody').append(row_script);
  
      var content = $('<div></div>');
      content.append(content_action);
      content.append(content_param);
      content.append(content_script);
  
      this.showDialog({
        title: '节点属性',
        content: content,
        full: true,
        buttons: [
          {
            text: '确定',
            click: function () {
              //info table
              $('.action-info-table')
                .find('input')
                .each(function (index, e) {
                  var name = $(e).attr('name');
                  var value = $(e).val();
                  oldAction[name] = value;
                });
              $('.action-info-table')
                .find('select')
                .each(function (index, e) {
                  var name = $(e).attr('name');
                  var value = $(e).val();
                  oldAction[name] = value;
                });
              $('.action-info-table')
                .find('textarea')
                .each(function (index, e) {
                  var name = $(e).attr('name');
                  var value = $(e).val();
                  oldAction[name] = value;
                });
  
              //script table
              $('.action-script-table')
                .find('input')
                .each(function (index, e) {
                  var name = $(e).attr('name');
                  var value = $(e).val();
                  oldAction[name] = value;
                });
              $('.action-script-table')
                .find('select')
                .each(function (index, e) {
                  var name = $(e).attr('name');
                  var value = $(e).val();
                  oldAction[name] = value;
                });
              $('.action-script-table')
                .find('textarea')
                .each(function (index, e) {
                  var name = $(e).attr('name');
                  var value = $(e).val();
                  oldAction[name] = value;
                });
  
              //param table
              oldAction.params = oldAction.params || {};
              $('.action-param-table')
                .find('input')
                .each(function (index, e) {
                  var name = $(e).attr('name');
                  var value = $(e).val();
                  oldAction.params[name] = value;
                });
              $('.action-param-table')
                .find('select')
                .each(function (index, e) {
                  var name = $(e).attr('name');
                  var value = $(e).val();
                  oldAction.params[name] = value;
                });
              $('.action-param-table')
                .find('textarea')
                .each(function (index, e) {
                  var name = $(e).attr('name');
                  var value = $(e).val();
                  oldAction.params[name] = value;
                });
  
              root.closeDialog();
              root.andflow.setActionInfo(oldAction);
            },
          },
        ],
      });
    },
  
    showLinkDialog: function (link) {
      var root = this;
      var oldlink = link;
  
      var content = $('<table class="link-param-table param-table"><tbody></tbody></tbody></table>');
  
      var row_title = $('<tr><td>标题</td><td><input name="title" value=""></td></tr>');
      row_title.find('input').val(link.title);
      content.find('tbody').append(row_title);
  
      var row_active = $(
        '<tr><td>是否可用</td><td><select name="active"><option value="true">是</option><option value="false">否</option></select></td></tr>',
      );
      row_active.find('select').val(link.active || 'true');
      content.find('tbody').append(row_active);
  
      var row_filter = $(
        '<tr><td>过滤脚本</td><td><textarea name="filter" style="height:200px;"></textarea></td></tr>',
      );
      row_filter.find('textarea').val(link.filter);
      content.find('tbody').append(row_filter);
  
      this.showDialog({
        title: '连线属性',
        content: content,
        full: true,
        buttons: [
          {
            text: '确定',
            click: function () {
              $('.link-param-table')
                .find('input')
                .each(function (index, e) {
                  var name = $(e).attr('name');
                  var value = $(e).val();
                  oldlink[name] = value;
                });
              $('.link-param-table')
                .find('select')
                .each(function (index, e) {
                  var name = $(e).attr('name');
                  var value = $(e).val();
                  oldlink[name] = value;
                });
              $('.link-param-table')
                .find('textarea')
                .each(function (index, e) {
                  var name = $(e).attr('name');
                  var value = $(e).val();
                  oldlink[name] = value;
                });
              root.andflow.setLinkInfo(oldlink);
              root.closeDialog();
            },
          },
        ],
      });
    },
    showRunDialog: function () {
      var root = this;
  
      var content = $(
        '<table class="run-param-table param-table"><thead><tr><td>名称</td><td>值</td></tr></thead><tbody></tbody></tbody></table>',
      );
      var params = root.getParams();
      for (var k in params) {
        var name = params[k].name;
        var value = params[k].value;
        var row = $('<tr><td>' + name + '</td><td><input name="' + name + '" value=""></td></tr>');
        row.find('input').val(value);
        content.find('tbody').append(row);
      }
  
      this.showDialog({
        title: '执行',
        content: content,
        buttons: [
          {
            text: '执行',
            click: function () {
              root.run();
            },
          },
          {
            text: '执行下一步',
            click: function () {
              root.runStep();
            },
          },
        ],
      });
    },
    _getUserNames: function (userList) {
      let usernames = [];
      for (var i in userList) {
        let u = userList[i];
        usernames.push(u.name);
      }
      return usernames;
    },
    _initEvents: function (opt) {
      var root = this;
  
      $('.tab-bar .tab-btn').bind('click', function () {
        var self = $(this);
        var target = self.attr('target');
        self.parent().find('.tab-btn').removeClass('active');
        self.addClass('active');
  
        self.parent().parent().find('.tab-content').removeClass('active');
        self
          .parent()
          .parent()
          .find('#' + target)
          .addClass('active');
      });
  
      $('.param-table')
        .find('.table-btn.add')
        .bind('click', function () {
          root.addParam({ name: '', value: '' });
        });
      $('.dict-table')
        .find('.table-btn.add')
        .bind('click', function () {
          root.addDict({ name: '', label: '' });
        });
  
      //dialog
      $('.designer-dialog').draggable({ handle: '.designer-dialog-header' });
      $('#designer_dialog_close_btn').bind('click', function () {
        root.closeDialog();
      });
      $('#designer_dialog_max_btn').bind('click', function () {
        var max = $('.designer-dialog').attr('max');
        if (max == 'true') {
          var w = $('.designer-dialog').attr('default_width') || '100%';
          var h = $('.designer-dialog').attr('default_height') || '100%';
          var left = $('.designer-dialog').attr('default_left') || 0;
          var top = $('.designer-dialog').attr('default_top') || 0;
  
          $('.designer-dialog').css('width', w);
          $('.designer-dialog').css('height', h);
          $('.designer-dialog').css('left', left + 'px');
          $('.designer-dialog').css('top', top + 'px');
          $('.designer-dialog').attr('max', 'false');
          $('#designer_dialog_max_btn').html('+');
        } else {
          $('.designer-dialog').css('width', '100%');
          $('.designer-dialog').css('height', '100%');
          $('.designer-dialog').css('left', '0');
          $('.designer-dialog').css('top', '0');
          $('.designer-dialog').attr('max', 'true');
          $('#designer_dialog_max_btn').html('-');
        }
      });
  
      //property
      $(".property-form select[name='link_type']").change(function (el) {
        var link_type = $(this).val();
        root.andflow.setLinkType(link_type);
        root.andflow.refresh();
      });
  
      $(".property-form select[name='theme']").change(function (el) {
        var theme = $(this).val();
        root.andflow.setTheme(theme);
        root.andflow.refresh();
      });
      $(".property-form select[name='show_action_content']").change(function (el) {
        var show = $(this).val();
  
        if (show == 'true' || show == true) {
          root.andflow.setActionContentVisible(true);
        } else {
          root.andflow.setActionContentVisible(false);
        }
      });
  
      //header tab
      $('.designer-tab .designer-tab-btn').bind('click', function () {
        var self = $(this);
        var target = self.attr('target');
        self.parent().find('.designer-tab-btn').removeClass('active');
        self.addClass('active');
  
        $('.designer-box').find('.designer-tab-content').removeClass('active');
        $('#' + target).addClass('active');
  
        //源码
        if (target == 'designer_source') {
          var flow = root.getFlow();
          var content = JSON.stringify(flow, null, 2);
          $('.designer-box .designer-source textarea').html(content);
        }
  
        //runtime
        if (target == 'designer_runtime') {
          root.showRuntime(root.runtime);
        }
      });
      //对齐
      $('.designer-tool #andflow_tool_btn_horizontal').bind('click', function () {
        root.andflow.horizontal();
      });
      $('.designer-tool #andflow_tool_btn_vertical').bind('click', function () {
        root.andflow.vertical();
      });
  
      //截图
      $('.designer-tool #andflow_tool_btn_snapshot').bind('click', function () {
        root.andflow.snap();
      });
      //运行
      $('.designer-tool #andflow_tool_btn_run').bind('click', function () {
        root.showRunDialog();
      });
  
      //停止
      $('.designer-tool #andflow_tool_btn_stop').bind('click', function () {
        if (opt.event_stop && root.is_runing) {
          opt.event_stop(root.runtime);
        }
      });
      //保存
      $('.designer-tool #andflow_tool_btn_save').bind('click', function () {
        if (opt.event_save) {
          if ($('.andflow #canvas').is(':visible')) {
            root.andflow.getSnapshot(function (canvas) {
              var baseStr = canvas.toDataURL('image/png', 0.3);
              if (baseStr && baseStr.length > 5) {
                root.currentSnapshot = baseStr;
              }
              var flow = root.getFlow();
              opt.event_save(flow, root.currentSnapshot);
            });
          } else {
            var flow = root.getFlow();
            opt.event_save(flow, root.currentSnapshot);
          }
        }
        root.his_option.flowModel = root.getFlow();
      });
      //重置
      $('.designer-tool #andflow_tool_btn_reload').bind('click', function () {
        root.reset();
      });
    },
  
    //websocket连接
    _initWebsocket: function () {
      var root = this;
      var runtimeId = '';
      if (root.runtime && root.runtime.id) {
        runtimeId = root.runtime.id;
      }
  
      var protocal_ws = 'ws:';
      if (window.location.protocol.startsWith('https')) {
        protocal_ws = 'wss:';
      }
  
      var hostname = window.location.hostname;
      var port = window.location.port;
      var ws_address = protocal_ws + '//' + hostname + ':' + port + '/ws/api/flow/websocket';
  
      var url =
        ws_address +
        '?TokenId=' +
        root.token +
        '&clientId=' +
        root.client_id +
        '&runtimeId=' +
        runtimeId;
  
      if (root.socket != null) {
        root.socket.close();
        root.socket = null;
      }
  
      root.socket = new WebSocket(url);
      root.socket.onerror = function (e) {
        console.error(e);
      };
      // 当webSocket连接成功的回调函数
      root.socket.onopen = function () {
        root.socket_retry_times = 0;
        console.log('webSocket open');
      };
  
      // 断开webSocket连接的回调函数
      root.socket.onclose = function () {
        console.log('webSocket close');
        root.socket = null;
      };
  
      // 接受webSocket连接中，来自服务端的消息
      root.socket.onmessage = function (event) {
        // 将服务端发送来的消息进行json解析
        var data = event.data;
        msg = JSON.parse(data);
  
        switch (msg.cmd) {
          case 'runtime':
            root.runtime = JSON.parse(msg.content);
            root.showRuntime(root.runtime);
            break;
  
          case 'content':
            var actionContent = JSON.parse(msg.content);
            root.andflow.showActionContent(actionContent);
            break;
          case 'alert':
            var content = msg.content;
            alert(content);
            break;
        }
      };
    },
  };
  