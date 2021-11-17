var andflow={
    containerId:null, //DOM

    editable:true, //是否可编辑

    tags:null,      //标签
    metadata:null,  //控件信息
    flowModel:null, //流程数据


    show_action_body:true,
    show_action_content:true,
    show_action_state_list:false,

    //渲染器
    render_action:null,
    render_action_helper:null,
    render_link:null,
    render_state_list:null,

    //事件
    event_action_click:null,
    event_action_dblclick:null,
    event_link_click:null,
    event_link_dblclick:null,
    event_canvas_click:null,


    //语言
    lang:{
        metadata_tag_title:"组件",
        flow_state_list_title:"执行记录",
        delete_action_confirm:"确定删除该节点?",
    },


    _themeObj:null,  //当前样式对象
    _plumb:null,  //jsplumb
    _actionScript:{}, //插件脚本，getParam,setParam
    _linkInfos:{},
    _link_states:[],
    _actionInfos:{},
    _actionCharts:{},
    _actionContents:{},
    _action_states:[],


    _timer:null,
    _connectionTypes:{
        "Flowchart":{anchor:"Continuous", connector:[ "Flowchart", { stub: [5, 15], gap: 5, cornerRadius: 5, alwaysRespectStubs: true } ]   },
        "Straight":{ anchor:"Continuous", connector:[ "Straight", { stub: [5, 15], gap: 5, cornerRadius: 5, alwaysRespectStubs: true } ] },
        "Bezier":{ anchor:"Continuous", connector:["Bezier" ,{ stub: [5, 15], gap: 5, cornerRadius: 5, alwaysRespectStubs: true } ] },
        "StateMachine": { anchor:"Continuous", connector:["StateMachine", { stub: [5, 15], gap: 5, cornerRadius: 5, alwaysRespectStubs: true } ] }
    },

    _initHtml:function(containerId){
        var $this=this;
        var css="";
        if($this.editable==false){
            css="state";
        }



        var html='<div class="andflow '+css+'">';

        //begin metadata

        html+='<div class="metadata" >';

        html+='<div class="tags">';
        html+='<label>'+$this.lang.metadata_tag_title+'</label>';
        html+='<select id="tag_select">';
        html+='</select>';
        html+='</div>';
        html+='<div class="actions">';
        html+='<ul id="leftMenu" class="leftMenu" >';
        html+='</ul>';
        html+='</div>';
        html+='</div>';
        //end metadata


        //begin designer
        html+='<div class="designer">';

        html+='<div id="canvasContainer" class="canvasContainer">';
        html+='<div id="canvas" ></div>';
        html+='</div>';

        //begin flow_state_list
        html+='<div id="flow_state_list" class="flow_state_list"  data_fold="false" >';
        html+='<div class="flow_state_list_title" >';
        html+=this.lang.flow_state_list_title;
        html+='<a id="flow_state_list_btn" class="flow_state_list_btn"  >-</a>';
        html+='</div>';
        html+='<div id="flow_state_list_content" class="flow_state_list_content">';

        html+='</div>';
        html+='</div>';
        //end flow_state_list

        html+='</div>';
        //end designer

        html+='</div>';

        $("#"+containerId).html(html);

        $("#"+containerId).find(".flow_state_list_title").bind("dblclick",function(){

            var element = $("#"+$this.containerId+" #flow_state_list");

            var fold=element.attr("data_fold");

            if(fold=="false"){
                element.attr("data_fold","true");
                element.find(".flow_state_list_content").hide();
                element.find("#flow_state_list_btn").html("+")
            }else{
                element.attr("data_fold","false");
                element.find("#flow_state_list_btn").html("-")
                element.find(".flow_state_list_content").show();
            }

        });
        $("#"+containerId).find(".flow_state_list_btn").bind("click",function(){
            var element = $("#"+$this.containerId+" #flow_state_list");

            var fold=element.attr("data_fold");

            if(fold=="false"){
                element.attr("data_fold","true");
                element.find(".flow_state_list_content").hide();
                element.find("#flow_state_list_btn").html("+")
            }else{
                element.attr("data_fold","false");
                element.find("#flow_state_list_btn").html("-")
                element.find(".flow_state_list_content").show();
            }
        })



    },
    _initEvents:function(){
        var $this=this;

        $("#"+$this.containerId).mouseup(function(e) {
            $(this).unbind("mousemove");
            $(this).css("cursor","default");
        });

    },
    //初始化样式
    _initTheme:function(theme){
        this.setTheme(theme);
    },

    //初始化action 列表
    _initMetadata:function(){

        var $this=this;

        var tags=this.tags;
        var metadata = this.metadata;

        if(tags==null){
            tags=[];
        }
        if(metadata==null){
            metadata=[];
        }

        //初始化控件脚本
        var scripts = '<script>\n';
        for(var i in metadata){
            scripts += metadata[i].params_script||'';
            scripts += '\n'
        }
        scripts += '<\/script>';
        $('body').append(scripts);

        //初始化action模板元数据
        if($("#tag_select").length>0){
            var tpdata=[];

            for(var i in tags){
                var t = tags[i];

                $("#tag_select").append('<option value="'+t+'">'+t+'</option>');
            }

            $("#tag_select").on("change",function(e){
                var tag = $(this).val();
                $this._showMetadata(tag);
            });

            //加载Action元数据
            $this._showMetadata($("#tag_select").val());
        }else{
            $this._showMetadata("");
        }




        $("#canvas").droppable({
            scope: "plant",
            drop: function(event, ui){

                var actionId =  jsPlumbUtil.uuid().replaceAll("-","");

                var name = $(ui.draggable).attr("action_name");

                var left = parseInt(ui.offset.left - $(this).offset().left);
                var top = parseInt(ui.offset.top - $(this).offset().top);

                var action = {id: actionId, left: left, top: top, name: name,params:{}};
                var actionInfo = $this.getMetadata(name);
                if(actionInfo!=null){
                    for(var i in actionInfo.params){
                        var p = actionInfo.params[i];
                        var name = p.name;
                        var defaultValue = p.default;
                        if(defaultValue){
                            action.params[name]=defaultValue;
                        }
                    }
                }



                //开始节点只有一个
                if(name=="begin"){

                    if($(".action[name='begin']").length && $(".action[name='begin']").length>0){
                        return;
                    }

                }
                //结束节点只有一个
                if(name=="end"){

                    if($(".action[name='end']").length && $(".action[name='end']").length>0){
                        return;
                    }
                }

                $this._createAction(action);
            }
        });

    },


    _initPlumb:function(){

        var $this = this;

        if($this._plumb !=null){

            $this._plumb.destroy();
            $("#"+this.containerId+" #canvas").html("");
        }

        var linkType = this.flowModel.link_type||"Flowchart";

        var link_color =  this._themeObj.default_link_color;
        var link_radius =  this._themeObj.default_link_radius;
        var link_strokeWidth =  this._themeObj.default_link_strokeWidth;
        var link_color_hover =  this._themeObj.default_link_color_hover;
        var link_strokeWidth_hover =  this._themeObj.default_link_strokeWidth_hover;

        var link_outlineWidth = this._themeObj.default_link_outlineWidth;

        var endpoint_stroke_color =  this._themeObj.default_endpoint_stroke_color;
        var endpoint_stroke_color_hover =  this._themeObj.default_endpoint_stroke_color_hover;
        var endpoint_fill_color =  this._themeObj.default_endpoint_fill_color;
        var endpoint_fill_color_hover =  this._themeObj.default_endpoint_fill_color_hover;

        var endpoint_radius =  this._themeObj.default_endpoint_radius;
        var endpoint_radius_hover =  this._themeObj.default_endpoint_radius_hover;
        var endpoint_strokeWidth =  this._themeObj.default_endpoint_strokeWidth;
        var endpoint_strokeWidth_hover =  this._themeObj.default_endpoint_strokeWidth_hover;


        var cc = $this._connectionTypes[linkType].connector;
        cc.cornerRadius = link_radius;
        this._plumb = jsPlumb.getInstance({
            Endpoint: ["Dot", {radius: 5}],
            Connector: cc,


            EndpointStyle: {
                stroke: endpoint_stroke_color,
                fill: endpoint_fill_color,
                radius: endpoint_radius,
                strokeWidth: endpoint_strokeWidth
            },//端点的颜色样式
            EndpointHoverStyle:{
                stroke: endpoint_stroke_color_hover,
                fill: endpoint_fill_color_hover,
                radius: endpoint_radius_hover,
                strokeWidth: endpoint_strokeWidth_hover
            },
            PaintStyle: {
                stroke: link_color,
                radius: endpoint_radius,
                strokeWidth: link_strokeWidth,
                outlineStroke: "transparent",
                outlineWidth: link_outlineWidth
            },
            HoverPaintStyle: {
                stroke: link_color_hover,
                strokeWidth: link_strokeWidth_hover
            },

            ConnectionOverlays: [
                [ "Arrow", {
                    location: 1,
                    id: "arrow",
                    length: 10,
                    width:10,
                    foldback: 0.8
                } ],
                [ "Label", {
                    label: "",
                    id: "label",
                    cssClass: "linkLabel" ,
                    events:{
                        tap:function(conn,e) {
                            //alert(conn);
                        }
                    }}]
            ],
            Container: "canvas"
        });

        for(var t in $this._connectionTypes){
            $this._plumb.registerConnectionType(t, $this._connectionTypes[t]);
        }

        //监听新的连接
        this._plumb.bind("connection", function (info, event) {
            try{
                var sourceId=info.sourceId;
                var targetId=info.targetId;

                var link = info.connection.data;
                if(link==null){
                    link = $this._linkInfos[sourceId+'-'+targetId];
                    if(link==null){
                        link={};
                    }
                }

                link["source_id"]=sourceId;
                link["target_id"]=targetId;

                $this._linkInfos[sourceId+'-'+targetId]=link;

                $this._paintConnection(info.connection,link);


            }catch(e){

            }

        });



        this._plumb.bind("connectionDetached", function (conn) {
            var sourceId = conn.sourceId
            var targetId = conn.targetId

            $this._linkInfos[sourceId+'-'+targetId]=null;
        });


        this._plumb.bind("connectionMoved", function(info){

            var sourceId=info.originalSourceId;
            var targetId=info.originalTargetId;



            $this._linkInfos[sourceId+'-'+targetId]=null;
        });

        this._plumb.bind('beforeDetach', function(conn){

            if($this.editable){
                return true;
            }
            return false;

        });
        this._plumb.bind('beforeDetach', function(conn){

            if(!$this.editable){
                return false;
            }
            return true;

        });
        //自动避免重复连线
        this._plumb.bind('beforeDrop', function (conn) {
            if(!$this.editable){
                return false;
            }

            //return true;
            var sourceId = conn.sourceId
            var targetId = conn.targetId

            var linkData = $this._linkInfos[sourceId+'-'+targetId]
            if(linkData!=null){
                return false;
            }

            return true
        });


        this._plumb.bind("click", function (conn, event) {
            if( $this.editable  ){
                if($this.event_link_click && $this.event_link_dblclick){
                    $this._timer && clearTimeout($this._timer);
                    $this._timer = setTimeout( function (){
                        var sourceId = conn.sourceId;
                        var targetId = conn.targetId;
                        var link = $this.getLinkInfo(sourceId,targetId);
                        $this.event_link_click(link);

                    },300);

                }else if($this.event_link_click){
                    var sourceId = conn.sourceId;
                    var targetId = conn.targetId;
                    var link = $this.getLinkInfo(sourceId,targetId);
                    $this.event_link_click(link);
                }
            }
        });


        this._plumb.bind("dblclick", function (conn, event) {
            if( $this.editable  ){

                if($this.event_link_dblclick){
                    $this._timer && clearTimeout($this._timer);
                    var sourceId = conn.sourceId;
                    var targetId = conn.targetId;
                    var link = $this.getLinkInfo(sourceId,targetId);

                    $this.event_link_dblclick(link);
                }

            }
        });


        // bind a double click listener to "canvas"; add new node when this occurs.
        this._plumb.on(canvas, "click", function(e) {

            if($this.event_canvas_click){
                $this.event_canvas_click(e);
            }

        });


    },
    /**
     * 设置左边Action菜单
     * @param Data
     */
    _showMetadata:function (tag){
        var $this=this;
        var list = this.metadata;
        //先进行分组
        var groups={};
        for(var i in list ){
            if(tag && tag.length>0 && list[i].tag && list[i].tag.length>0){
                if(list[i].tag!=tag){
                    continue;
                }
            }

            var group = list[i].group||'通用';

            if(groups[group]==null){
                groups[group] = [];
            }
            groups[group].push(list[i]);
        }

        //按分组输出到Html
        $("#leftMenu").html("");
        var index=0;
        for(var g in groups){

            var openClass=index==0?'menu-is-opening menu-open':'';
            var openBody=index==0?'':'display:none';

            var html='<li class="leftMenuGroup"  ><a href="#" class="group-title">'+g+'<i class="pull-right ico"></i></a>';

            html+='<ul class="leftMenuGroupBody" >';

            var item = groups[g];
            for(var i in item){
                var name = item[i].name;
                var title = item[i].title;
                var icon = item[i].icon || '/static/flow/img/node.png';

                var img='';
                if(icon && icon.length>0){
                    img='<img src="'+icon+'" style="height: 16px;width: 16px;" />';
                }

                var element_str = '<li id="' + name + '" action_name="' + name + '" action_title="' + title + '" class="leftMenuItem"  action_icon="'+icon+'" ><a class="item-title">'+ img + title + '</a></li>';
                html+=element_str;
            }

            html+='</ul>';
            html+='</li>';
            $("#leftMenu").append(html);
            index++;
        }


        //初始化拖拽设置
        $("#leftMenu li.leftMenuItem").draggable({

            helper: function (event) {
                var action_name = $(this).attr("action_name");
                var title = $(this).attr("action_title");
                var icon = $(this).attr("action_icon");
                var metadata=$this.getMetadata(action_name);

                var html='<div class="action-drag"><div class="action-header">'+title+'</div><div class="action-icon"><img src="'+icon+'"/></div></div>';


                if($this.render_action_helper){
                    var r = $this.render_action_helper(metadata, html);
                    if(r!=null && r.length>0){
                        html=r;
                    }
                }

                return $(html);

            },
            scope: "plant"
        });

    },
    /**
     * 添加模型
     * @param ui
     * @param selector
     */
    _createAction:function(action) {
        var $this=this;
        var id=action.id;
        if(id==null){
            return;
        }

        var name=action.name;
        if(name==null){
            return;
        }

        this.setActionInfo(action);


        var action_info = this.getMetadata(name);

        if(action_info==null){
            return;
        }

        var title = action_info.title||'';
        var icon = action_info.icon||'';
        var des = action_info.des||'';
        var css = action_info.css||'';

        var left = action.left;
        var top = action.top;
        var width = action.width;
        var height = action.height;

        var body_width = "";
        var body_height = "";

        if(this._themeObj.is_body_resizable){
            body_width = action.body_width;
            body_height = action.body_height;
        }

        var iconImg = '';
        if(icon && icon.length>0){
            iconImg='<img src="'+icon+'" >';
        }else{
            iconImg='<img src="/static/flow/img/node.png">';
        }


        var titleDescription = action.des||title||des;

        var content = '<div class="action-main">';


        content+= '<a href="javascript:void(0)" class="btn-remove"  >X</a>';//工具栏

        content += '<div class="action-icon"  >'+iconImg+'</div>';

        content += '<div class="action-header">' + titleDescription + '</div>';//标题

        //begin action-body
        var bodystyle="";
        if(this.flowModel.show_action_body=="false"){
            bodystyle='style="visibility: hidden"';
        }
        var contentstyle="";
        if(this.flowModel.show_action_content=="false"){
            contentstyle='style="visibility: hidden"';
        }

        content += '<div class="action-body" '+bodystyle+'>';
        content += '<div class="action-content" '+contentstyle+'></div>';  //消息内容,html,chart

        //if(this.editable==true) {
        content += '<div class="body-resize"></div>'; //改变Body内容大小的三角形框
        // }
        content += '</div>';
        //end action-body

        //if(this.editable==true) {
        content += '<div class="action-resize"></div>'; //改变大小的三角形框
        content += '<div class="ep" title="拖拉连线">+</div>';  //拖拉连线焦点
        //}

        content +='</div>'; //end action-main


        var actionHtml='<div class="action action-container '+css+'" id="' + id + '" name="'+ name +'" title="'+title+'" icon="'+icon+'">'+ content + '</div>';


        if($this.render_action){
            var r = $this.render_action(action_info, action, actionHtml);
            if(r && r.length>0){
                actionHtml = r;
            }
        }

        var actionElement=$(actionHtml);
        actionElement.removeClass("action");
        actionElement.addClass("action");
        actionElement.attr("id",id);
        actionElement.attr("name",name);
        actionElement.attr("title",title);
        actionElement.attr("icon",icon);

        actionElement.find(".btn-remove").bind("click",function(){
            if(showConfirm){
                showConfirm("确定删除该节点？",function(){
                    $this.removeAction(id);
                });
            }else {
                var sure = confirm("确定删除该节点?")
                if (sure) {
                    $this.removeAction(id);
                }
            }

        });

        var selector = $("#"+$this.containerId+" #canvas");
        selector.append(actionElement);

        $("#"+id).css("position","absolute").css("left",left).css("top",top);

        if(width && width.length>0){
            $("#"+id).attr("width",width);
            $("#"+id).css("width",width);
        }
        if(height && height.length>0){
            $("#"+id).attr("height",height);
            $("#"+id).css("height",height);
        }


        if(body_width && body_width.length>0){
            $("#"+id).attr("body_width",body_width);
            $("#"+id).find(".action-body").css("width",body_width);
        }else{
            $("#"+id).find(".action-body").css("width","");

        }
        if(body_height && body_height.length>0){
            $("#"+id).attr("body_height",body_height);
            $("#"+id).find(".action-body").css("height",body_height);
        }else{
            $("#"+id).find(".action-body").css("height","");
        }

        //双击打开配置事件,在设计模式和步进模式下才可以用

        $("#"+$this.containerId).find("#" + id).bind("click",function (event) {
            if($this.editable){
                if($this.event_action_click && $this.event_action_dblclick){

                    $this._timer && clearTimeout($this._timer);
                    $this._timer = setTimeout( function (){

                        $this.event_action_click(action_info, action);

                    },300);

                }else if($this.event_action_click){
                    $this.event_action_click(action_info, action);
                }
            }
        });

        $("#"+$this.containerId).find("#" + id).bind("dblclick",function (event) {
            if($this.editable){

                if($this.event_action_dblclick){
                    $this._timer && clearTimeout($this._timer);

                    $this.event_action_dblclick(action_info, action);
                }

            }

        });


        //改变大小事件，鼠标按下去
        $("#"+$this.containerId+" #"+id+" .action-resize").mousedown(function(e){
            $("#"+$this.containerId).css("cursor", "nwse-resize");
            var divEl = $(this)[0];
            var x1 = e.pageX;
            var y1 = e.pageY;
            var width = $("#"+id).width();
            var height = $("#"+id).height();

            $("#"+$this.containerId).mousemove(function(e){
                var x2 = e.pageX;
                var y2 = e.pageY;

                var w = width + ( x2-x1);
                var h = height + ( y2-y1);
                $("#"+id).css({
                    width: w,
                    height: h
                });
                $("#"+id).attr("width",w);
                $("#"+id).attr("height",h);


                var chart = $this._actionCharts[id]
                if(chart!=null){
                    var pw=$("#chart_"+id).parent().width();
                    var ph=$("#chart_"+id).parent().height();
                    $("#chart_"+id).css({
                        width:pw,
                        height:ph
                    });
                    chart.resize();
                }
                $this._plumb.repaintEverything();
                e.preventDefault();
            });
            e.preventDefault();
        });

        //改变Body大小事件，鼠标按下去
        $("#"+$this.containerId+" #"+id+" .body-resize").mousedown(function(e){
            $("#"+$this.containerId).css("cursor", "nwse-resize");
            var divEl = $(this)[0];
            var x1 = e.pageX;
            var y1 = e.pageY;
            var width = $("#"+id).find(".action-body").width();
            var height = $("#"+id).find(".action-body").height();

            $("#"+$this.containerId).mousemove(function(e){
                var x2 = e.pageX;
                var y2 = e.pageY;

                var w = width + ( x2-x1);
                var h = height + ( y2-y1);
                $("#"+id).find(".action-body").css({
                    width: w,
                    height: h
                });
                $("#"+id).attr("body_width",w);
                $("#"+id).attr("body_height",h);

                //刷新图表
                var chart = $this._actionCharts[id]
                if(chart!=null){
                    var pw=$("#chart_"+id).parent().width();
                    var ph=$("#chart_"+id).parent().height();
                    $("#chart_"+id).css({
                        width:pw,
                        height:ph
                    });
                    chart.resize();
                }
                $this._plumb.repaintEverything();
                e.preventDefault();
            });
            e.preventDefault();
        });

        //初始化节点
        this._showActionNode(  $("#" + id).get(0),name);

    },

    _formateDateTime:function(value){
        if(value.indexOf("0001")==0){
            return "";
        }
        var str=value;
        var idx = value.indexOf("+");
        if(idx>=0){
            str = str.substr(0,idx);
        }

        idx = value.indexOf(".");
        if(idx>=0){
            str = str.substr(0,idx);
        }

        idx = value.indexOf("Z");
        if(idx>=0){
            str = str.substr(0,idx);
        }
        str = str.replace("T"," ")
        return str;
    },
    //加载流程执行状态列表数据
    _showFlowStateList:function(datas){
        var $this=this;

        if(datas==null || datas.length==0){
            $("#flow_state_list_content").html("");
            return;
        }

        if($this.render_state_list){
            var r = $this.render_state_list(datas);
            if(r!=null && r.length>0){
                $("#flow_state_list_content").html(r);
                return;
            }
        }

        if($("#flow_state_list_table").length==0){
            var html='<table id="flow_state_list_table" class="flow_state_list_content">';
            html+='<thead>';
            html+='<tr>';
            html+='<th>环节</th>';
            html+='<th>描述</th>';
            html+='<th>状态</th>';
            html+='<th>是否异常</th>';
            html+='<th>到达时间</th>';
            html+='</tr>';
            html+='</thead>';
            html+='<tbody>';
            html+='</tbody>';
            html+='</table>';
            $("#flow_state_list_content").html(html);
        }

        $("#flow_state_list_table tbody").html("");

        for(var k in datas){
            var icon = datas[k].action_icon||'/static/flow/img/node.png';
            var action_title = datas[k].action_title;
            action_title = '<a><img src="'+icon+'" style="height: 20px" /> '+action_title+'</a>';

            var action_des = datas[k].action_des;
            var state = datas[k].state;

            if(state==0 || state=='0'){
                state = '';
            }
            if(state==0 || state=='1'){
                state= '<label class="state-execute">正执行</label>';
            }
            if(state==0 || state=='2'){
                state= '<label class="state-complete">已执行</label>';

            }
            if(state==0 || state=='3'){
                state= '<label class="state-waiting">待执行</label>';
            }


            var is_error = datas[k].is_error;
            if(is_error==1||is_error=="1"){
                is_error = '<label class="error">异常</label>';
            }else{
                is_error = '<label class="success">正常</label>';
            }


            var begin_time = this._formateDateTime(datas[k].begin_time);


            var row='<tr>';
            row+='<td>'+action_title+'</td>';
            row+='<td>'+action_des+'</td>';
            row+='<td>'+state+'</td>';
            row+='<td>'+is_error+'</td>';
            row+='<td>'+begin_time+'</td>';
            row+='</tr>';

            $("#flow_state_list_table tbody").append(row);

        }

    },

    //初始化节点
    _showActionNode:function(el, name) {

        this._plumb.getContainer().appendChild(el);
        // initialise draggable elements.
        this._plumb.draggable(el);

        if(name==null || name!="end"){
            this._plumb.makeSource(el, {
                filter: ".ep",

                anchor: "Continuous",
                extract:{
                    "action":"the-action"
                },
                maxConnections: 20,
                onMaxConnections: function (info, e) {
                    showWarning("已经达到连接最大数 (" + info.maxConnections + ") ");
                }
            });
        }

        if(name==null || name!="begin"){
            this._plumb.makeTarget(el, {
                dropOptions: { hoverClass: "dragHover" },
                anchor: "Continuous",

                allowLoopback: true
            });
        }

    },

    //画连接线基础样式
    _paintConnection:function(conn,link){

        var linktype = this.flowModel.link_type||'Flowchart';

        if(link==null){
            link=={};
        }

        var active = link.active||'true';
        //连线样式
        var paintStyle = {
            stroke: this._themeObj.default_link_color,
            radius: this._themeObj.default_link_radius,
            strokeWidth: this._themeObj.default_link_strokeWidth,
            outlineStroke: "transparent",
            outlineWidth: this._themeObj.default_link_outlineWidth
        };

        var hoverPaintStyle={
            stroke: this._themeObj.default_link_color_hover,
            radius: this._themeObj.default_link_radius_hover,
            strokeWidth: this._themeObj.default_link_strokeWidth_hover,
            outlineStroke: "transparent",
            outlineWidth: this._themeObj.default_link_outlineWidth_hover
        };

        if(active!=null && active == "false"){
            paintStyle.dashstyle="1 2";
            hoverPaintStyle.dashstyle="1 2";
        }else{
            paintStyle.dashstyle="1 0";
            hoverPaintStyle.dashstyle="1 0";
        }

        conn.setType(linktype);
        conn.setPaintStyle(paintStyle);
        conn.setHoverPaintStyle(hoverPaintStyle);

        //连线文本信息
        var linkLabel=$('<div/>').text(link.title||'').html();
        conn.getOverlay("label").setVisible(linkLabel.length>0);
        conn.getOverlay("label").setLabel(linkLabel);
        conn.data = link ;

        if(this.render_link){
            this.render_link(conn,linktype,link);
        }

    },

    //画连接线状态
    _paintConnectionState:function(conn,state){
        if(state==-1 || state=="error"){
            conn.setPaintStyle({
                stroke:  this._themeObj.default_link_color_error ,
                radius: this._themeObj.default_link_radius_error,
                strokeWidth: this._themeObj.default_link_strokeWidth_error,
                outlineStroke: "transparent",
                outlineWidth: this._themeObj.default_link_outlineWidth_error
            });
        }else if(state==1 || state=="execute"){
            conn.setPaintStyle({
                stroke:  this._themeObj.default_link_color_run ,
                radius: this._themeObj.default_link_radius_run,
                strokeWidth: this._themeObj.default_link_strokeWidth_run,
                outlineStroke: "transparent",
                outlineWidth: this._themeObj.default_link_outlineWidth_run
            });
        }else if(state==2 || state=="success"){
            conn.setPaintStyle({
                stroke:  this._themeObj.default_link_color_success ,
                radius: this._themeObj.default_link_radius_success,
                strokeWidth: this._themeObj.default_link_strokeWidth_success,
                outlineStroke: "transparent",
                outlineWidth: this._themeObj.default_link_outlineWidth_success
            });
        }else if(state==3 || state=="reject"){
            conn.setPaintStyle({
                stroke:  this._themeObj.default_link_color_reject ,
                radius: this._themeObj.default_link_radius_reject,
                strokeWidth: this._themeObj.default_link_strokeWidth_reject,
                outlineStroke: "transparent",
                outlineWidth: this._themeObj.default_link_outlineWidth_reject
            });
        }else{
            conn.setPaintStyle({
                stroke:  this._themeObj.default_link_color ,
                radius: this._themeObj.default_link_radius,
                strokeWidth: this._themeObj.default_link_strokeWidth,
                outlineStroke: "transparent",
                outlineWidth: this._themeObj.default_link_outlineWidth
            });
        }



    },

    newInstance:function(containerId,option){
        var instance=this;
        instance.containerId=containerId;

        $.extend(instance, option);

        if(instance.flowModel==null){
            instance.flowModel={};

        }
        if(instance.flowModel.theme==null){
            instance.flowModel.theme = "flow_theme_default";
        }

        if(instance.flowModel.link_type==null){
            instance.flowModel.link_type = "Flowchart";
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


        return instance;
    },

    reflow:function(){

        this.flowModel = this.getFlow();
        //初始化样式风格
        this._initTheme();
        this._initPlumb();
        this.showFlow();
        this.setActionStates();
        this.setLinkStates();

    },
    repaint:function(){
        //重画
        this._plumb.repaintEverything();
    },


    setTheme:function(theme){


        if(theme==undefined || theme==null || theme==""){
            theme=this.flowModel.theme;
        }else{
            this.flowModel.theme = theme;
        }

        this.flowModel.theme = this.flowModel.theme||"flow_theme_default"

        for(var k in flow_themes){
            $("#"+this.containerId).removeClass(k);
        }
        $("#"+this.containerId).addClass(theme);


        this._themeObj = flow_themes[theme];

        // //如果不是在设计模式下，连接点隐藏，避免拖拉操作
        // if(this.editable!=true){
        //     this._themeObj.default_endpoint_radius=0.001;
        //     this._themeObj.default_endpoint_fill_color="transparent";
        //     this._themeObj.default_endpoint_radius_hover=0.001;
        //     this._themeObj.default_endpoint_fill_color_hover="transparent";
        // }

    },


    registActionScript:function(name,obj){
        this._actionScript[name] = obj;
    },

    getActionScript:function(name){
        return this._actionScript[name];
    },

    getMetadata:function(name){
        for(var index in this.metadata){
            var action_info = this.metadata[index];
            if(name == action_info.name){
                return action_info;
            }
        }
        return null;
    },
    getMetadatas:function(){

        return this.metadata;
    },


    getDict:function (name){
        if(name==null||name==""){
            return null;
        }
        var dicts = this.getFlow().dict
        for(var i in dicts){
            var dict = dicts[i];
            if(dict.name==name){
                return dict.label;
            }
        }
        return null;
    },
    getDicts:function (){
        var dicts = this.getFlow().dict

        return dicts;
    },

    getActionInfo:function(id){
        return this._actionInfos[id];
    },
    setActionInfo:function(action){
        this._actionInfos[action.id] = action;
        this._plumb.repaintEverything();
    },
    delActionInfo:function(id){
        this._actionInfos[id] = null;
    },

    getLinkInfo:function(sid,tid){
        return this._linkInfos[sid+"-"+tid]||{};
    },
    setLinkInfo:function(link){
        this._linkInfos[link.source_id+"-"+link.target_id]=link;

        var linkTitle= $('<div/>').text(link.title).html();

        var conn = this.getConnection(link.source_id , link.target_id);
        if(conn!=null){

            this._paintConnection(conn,link);

            this._plumb.repaintEverything();
        }

    },

    delLinkInfo:function(sid,tid){
        this._linkInfos[sid+"-"+tid]=null;
    },


    //删除节点
    removeAction:function(actionId){
        var $this=this;
        var element = $("#canvas #"+actionId);

        if(element==null){
            return;
        }

        $this._plumb.remove(element);
        $(element).remove();

        var id = element.attr("id");
        $this.delActionInfo(id);

        $this._actionCharts[id]=null;
        if($this._actionCharts[id]!=null){
            $this._actionCharts[id].dispose();
        }
        $this._actionContents[id]=null;


    },


    //删除连线
    removeLink:function(sourceId,targetId) {
        var conn = this.getConnection(sourceId,targetId)
        if(conn==null){
            return;
        }

        this.delLinkInfo(sourceId,targetId);

        this._plumb.deleteConnection(conn);
        this._plumb.repaintEverything();
    },

    setEditable:function(editable){
        this.editable=editable;
        if(this.editable==true){
            $("#"+this.containerId+" .andflow").removeClass("state");
        }else{
            $("#"+this.containerId+" .andflow").addClass("state");
        }


    },
    getEditable:function(){
        return this.editable;
    },


    setFlow:function(flowModel){
        this.flowModel=flowModel;
    },
    /**
     *  显示流程画布
     */
    showFlow:function(model){
        var $this=this;
        if(model){
            this.flowModel=model;
        }

        //流程状态列表
        if(this.flowModel.show_action_state_list=="true"){
            $("#flow_state_list").show();
        }else{
            $("#flow_state_list").hide();
        }


        //删除所有连线，重新画
        this._plumb.deleteEveryConnection();
        $(".action").each(function(i,e){
            $this._plumb.remove(e);
            $(e).remove();
        });

        this._actionInfos={};
        this._linkInfos={};

        //清空画布
        $("#canvas").html("");

        //建立节点
        var obj = this.flowModel;
        if(obj && obj.actions){

            for(var k in obj.actions){
                var action = obj.actions[k];
                //创建Action节点
                this._createAction( action );
            }
        }



        //建立节点连线
        if(obj && obj.links){

            var linktype = this.flowModel.link_type||'Flowchart';


            for(var k in obj.links){
                var link = obj.links[k];


                var conn = this._plumb.connect({source: link.source_id,target: link.target_id});

                if(conn==undefined|| conn==null){
                    continue;
                }

                this._paintConnection(conn,link);

                this._linkInfos[link.source_id+"-"+link.target_id]=link;

            }

        }


        //设置端点样式
        for(var k in obj.actions){
            var action = obj.actions[k];
            var endpoints = this._plumb.getEndpoints(action.id);
            for(var k in endpoints){
                var endpoint = endpoints[k];
                endpoint.setPaintStyle({
                    stroke: this._themeObj.default_endpoint_stroke_color,
                    fill: this._themeObj.default_endpoint_fill_color,
                    radius: this._themeObj.default_endpoint_radius,
                    strokeWidth: this._themeObj.default_endpoint_strokeWidth
                });
                endpoint.setHoverPaintStyle({
                    stroke: this._themeObj.default_endpoint_stroke_color_hover,
                    fill: this._themeObj.default_endpoint_fill_color_hover,
                    radius: this._themeObj.default_endpoint_radius_hover,
                    strokeWidth: this._themeObj.default_endpoint_strokeWidth_hover

                });
            }

        }

        this._plumb.repaintEverything();

    },


    getFlow:function (){

        var actions = this.getActions();
        var links = this.getLinks();
        this.flowModel.actions= actions;
        this.flowModel.links= links;

        return this.flowModel;

    },

    clearActionState:function(){
        $("#"+this.containerId).find(".action").removeClass("error");
        $("#"+this.containerId).find(".action").removeClass("execute");
        $("#"+this.containerId).find(".action").removeClass("reject");
        $("#"+this.containerId).find(".action").removeClass("success");
    },
    setActionSelected:function(actionId, selected){
        if(actionId==null || actionId=="" || $("#"+actionId).length==0){
            return;
        }
        if(selected){

            $("#"+actionId).find(".action-main").addClass("selected");

        }else{
            $("#"+actionId).find(".action-main").removeClass("selected");

        }
    },
    //设置节点图标
    setActionIcon:function(actionId,action_icon){
        if(action_icon!=null && action_icon.length>0){
            $("#"+actionId).find(".action-icon img").attr("src",action_icon);
        }
    },
    //设置节点样式状态
    setActionState:function(actionId, state ){
        if(actionId==null||actionId==""){
            return;
        }

        var element= $("#"+this.containerId).find("#"+actionId);

        if(state==null || state=="" || state==0) {
            element.removeClass("error");
            element.removeClass("execute");
            element.removeClass("reject");
            element.removeClass("success");
            return;
        }

        if(state==-1||state=="error"){
            element.removeClass("error");
            element.removeClass("execute");
            element.removeClass("reject");
            element.removeClass("success");

            if(!element.hasClass("error")) {
                element.addClass("error");
            }
        }else if(state==1 || state=="execute"){

            if(!element.hasClass("execute")) {
                element.addClass("execute");
            }
        }else if(state==2 || state=="success"){
            element.removeClass("error");
            element.removeClass("execute");
            element.removeClass("reject");
            element.removeClass("success");

            if(!element.hasClass("success")){
                element.addClass("success");
            }
        }else if(state==3 || state=="reject"){

            element.removeClass("error");
            element.removeClass("execute");
            element.removeClass("reject");
            element.removeClass("success");

            if(!element.hasClass("reject")){
                element.addClass("reject");
            }
        }

    },
    //显示状态
    setActionStates:function(action_states) {
        if(action_states==undefined||action_states==null){
            action_states = this._action_states;
        }
        this._action_states = action_states;
        var elements= $("#"+this.containerId).find(".action");
        elements.removeClass("success");
        elements.removeClass("error");
        elements.removeClass("execute");

        var action_state_map={};
        for(var k in action_states){
            var actionId=action_states[k].action_id;
            action_state_map[actionId] = action_states[k];
        }

        //显示节点状态
        var actions = this.getActions();
        for(var i in actions){
            action = actions[i];
            var actionId = action.id;
            var action_state = action_state_map[actionId];
            if(action_state==null){
                continue;
            }
            //修改文字、颜色等样式
            var state = action_state.state;
            var isError = action_state.is_error;
            if(isError){
                state=-1;
            }
            this.setActionState(actionId,state);

            //修改图标
            var action_icon = action_state.action_icon;
            this.setActionIcon(actionId,action_icon);

            //内容
            var actionContent = action_state.content;
            this.showActionContent(actionContent)

        }

        if(this.flowModel.show_action_state_list=="true"){
            //显示列表
            if($("#flow_state_list") && $("#flow_state_list").length>0){
                this._showFlowStateList(action_states);
            }
        }
    },

    //设置连线状态
    setLinkState(source_id,target_id,state){

        var conn = this.getConnection(source_id , target_id);
        var data = conn.data;
        //如果不可用，就不用修改状态
        if(data!=null && data.active=="false"){
            return;
        }

        this._paintConnectionState(conn,state);

    },
    //修改连线状态
    setLinkStates:function (link_states) {
        if(link_states==undefined || link_states==null){
            link_states=this._link_states;
        }

        this._link_states = link_states;

        var link_state_map={};
        for(var i in link_states) {
            var link_state = link_states[i];

            var source_id=link_state.source_action_id;
            var target_id=link_state.target_action_id;

            var state = link_state.state;
            var isError = link_state.is_error;
            if(isError==1||isError==true||isError=="true"){
                state=-1
            }

            this.setLinkState(source_id, target_id,state);
        }

        this._plumb.repaintEverything();
    },

    setLinkType:function(link_type){

        this.flowModel.link_type=link_type;
        this.reflow();

    },

    //获取Action节点
    getActions:function (){
        var $this=this;
        var actions = [];
        $("#canvas").find(".action").each(function (index, element) {
            var id = $(element).attr('id');

            var action = $this._actionInfos[id];
            if(action==null){
                action={};
            }

            action["id"]= id;
            action["name"]= $(element).attr('name');
            action["title"]= $(element).attr('title');
            action["icon"]= $(element).attr('icon');

            action["left"]=$(element).css('left');
            action["top"]=$(element).css('top');
            action["width"]=$(element).css('width');
            action["height"]=$(element).css('height');

            action["body_width"]=$(element).attr('body_width');
            action["body_height"]=$(element).attr('body_height');


            actions.push(action);
        });

        return actions;
    },
    //获取连线
    getLinks:function (){
        var links = [];

        var conn_list = this._plumb.getAllConnections();

        for (var i = 0; i < conn_list.length; i++) {
            var source_id = conn_list[i]["sourceId"];
            var target_id = conn_list[i]["targetId"];

            var conn = this._linkInfos[source_id+"-"+target_id];
            if(conn==null){
                conn={};
            }
            conn["source_id"]=source_id;
            conn["target_id"]=target_id;

            this._linkInfos[source_id+"-"+target_id]=conn;

            links.push(conn);
        }

        return links;
    },
    getConnection:function(sourceId,targetId){
        var conn_list = this._plumb.getAllConnections();

        for (var i = 0; i < conn_list.length; i++) {
            var source_id = conn_list[i]["sourceId"];
            var target_id = conn_list[i]["targetId"];

            if(source_id==sourceId && target_id==targetId){
                return conn_list[i];
            }

        }

        return null;

    },
    //水平对齐
    horizontal:function() {
        var minTop=999999999;

        var model = this.getFlow();

        for(var k in model.actions){
            var top= model.actions[k].top;
            top = top.replace(/px/ig,"");
            if(minTop>top){
                minTop=top;
            }
        }
        if(minTop<10){
            minTop=10;
        }
        for(var k in model.actions){
            model.actions[k].top = minTop+"px";
        }

        this.showFlow(model);
        this.setActionStates(this._action_states);
        this.setLinkStates(this._link_states);
    },

    vertical:function() {
        var minLeft=999999999;

        var model = this.getFlow();

        for(var k in model.actions){
            var left= model.actions[k].top;
            left = left.replace(/px/ig,"");
            if(minLeft>left){
                minLeft=left;
            }
        }
        if(minLeft<10){
            minLeft=10;
        }
        for(var k in model.actions){
            model.actions[k].left = minLeft+"px";
        }

        this.showFlow(model);
        this.setActionStates(this._action_states);
        this.setLinkStates(this._link_states);
    },

    //获取截图
    getSnapshot:function( callback ){
        if($("#canvas").is(":hidden")){
            return;
        }

        var options={backgroundColor:"white"}

        var cardBox = document.querySelector("#canvas");


        var nodesToRecover = [];
        var nodesToRemove = [];
        var svgElem = $(cardBox).find('svg'); //divReport为需要截取成图片的dom的id
        svgElem.each(function(index, node) {
            var parentNode = node.parentNode;
            var svg = node.outerHTML.trim();
            var subCanvas = document.createElement('canvas');
            canvg(subCanvas, svg);
            if(node.style.position) {
                subCanvas.style.position += node.style.position;
                subCanvas.style.left += node.style.left;
                subCanvas.style.top += node.style.top;
            }
            nodesToRecover.push({
                parent: parentNode,
                child: node
            });
            parentNode.removeChild(node);
            nodesToRemove.push({
                parent: parentNode,
                child: subCanvas
            });
            parentNode.appendChild(subCanvas);
        });

        let canvas = document.createElement('canvas');
        let w=cardBox.scrollWidth+5;
        let h=cardBox.scrollHeight+5;

        let scale = options.scale || 1;
        canvas.width = w*scale;
        canvas.height = h*scale;
        canvas.style.width=w+"px";
        canvas.style.height=h+"px";
        let context = canvas.getContext("2d");
        context.scale(scale,scale);
        //let rect = cardBox.getBoundingClientRect();//获取元素相对于视察的偏移量
        //context.translate(-rect.left,-rect.top);//设置context位置，值为相对于视窗的偏移量负值，让图片复位


        html2canvas(cardBox, {
            canvas: canvas,
            scale: scale,
            dpi:1,
            backgroundColor: options.backgroundColor||'transparent',
            width:w,
            height:h,
            scrollY: 0,
            scrollX: 0,
            useCORS: true
        }).then(function(canvas){


            for(var k in nodesToRemove){
                var node = nodesToRemove[k];
                node.parent.removeChild(node.child);
            }
            for(var k in nodesToRecover){
                var node = nodesToRecover[k];
                node.parent.appendChild(node.child);
            }

            if(callback){
                callback(canvas);
            }
        });


    },


    //截图,并保存为
    snap:function (name){

        name=name||"andflow";

        var ext="jpg";

        this.getSnapshot(function(canvas) {
            var url = canvas.toDataURL("image/jpeg"); //生成下载的url

            var triggerDownload = $("<a></a>").attr("href", url).attr("download", name+"."+ext); // 把url放到我们的a标签中，并得到a标签对象
            triggerDownload[0].click(); //模拟点击一下a标签，即可下载啦！
        });

    },

    setActionContent:function(action_id, content, content_type){
        if(this.flowModel.show_action_content==false || this.flowModel.show_action_content=="false"){
            return;
        }

        content_type = content_type||"msg";

        var element = $("#"+this.containerId).find("#"+action_id+" .action-content");

        switch (content_type) {
            case "msg":
                if(this._actionCharts[action_id]!=null){
                    this._actionCharts[action_id].dispose();
                    this._actionCharts[action_id]=null;
                }

                element.html("<div class='action-msg'>"+content+"</div>");

                break;
            case "grid":
                if(this._actionCharts[action_id]!=null){
                    this._actionCharts[action_id].dispose();
                    this._actionCharts[action_id]=null;
                }

                var griddata = JSON.parse(content);

                var columns = griddata['columns'];
                var data = griddata['rows'];

                var datas=[];
                if(data instanceof Array){
                    datas = data;
                }else{
                    datas.push(data);
                }

                if(columns==null || columns.length==0){
                    columns = [];
                    if(datas.length>0){
                        for(var k in datas[0]){
                            columns.push({name:k,title:k});
                        }
                    }
                }

                var grid=$('<table class="table" style="width:100%"></table>');

                //header
                var headerEl = $('<tr></tr>');
                for( var  j in columns){

                    var title = columns[j].title||columns[j].name;
                    var colEl= $('<th>'+ title +'</th>');
                    headerEl.append(colEl);
                }
                grid.append(headerEl);

                //body
                for(var i in datas){
                    var row = datas[i]
                    var rowDatas=[];

                    if(row instanceof Object){

                        for(var k in columns){
                            rowDatas.push(row[columns[k].name]) ;
                        }

                    }else{
                        rowDatas.push(row);
                    }
                    var rowEl = $('<tr></tr>');
                    for(var j in rowDatas){
                        var val = rowDatas[j];
                        if( val instanceof Object){
                            val=JSON.stringify(val);
                        }
                        var colEl= $('<td>'+ val +'</td>');
                        rowEl.append(colEl);
                    }
                    grid.append(rowEl);
                }
                element.html('');
                element.append(grid);
                element.css("overflow-y","auto");

                break;
            case "html":
                if(this._actionCharts[action_id]!=null){
                    this._actionCharts[action_id].dispose();
                    this._actionCharts[action_id]=null;
                }

                element.html("<div class='action-html'>"+content+"</div>");

                break;
            case "chart":

                var option = JSON.parse(content);

                var id='chart_'+action_id;

                var charDom=element.find("#"+id);
                var actionChart = this._actionCharts[action_id];
                if(actionChart==null||charDom==null||charDom.length==0){
                    element.html("<div id='"+id+"' class='action-chart'></div>");
                    var w = element.width();
                    var h = element.height();
                    $("#"+id).width(w);
                    $("#"+id).height(h);

                    actionChart = echarts.init(document.getElementById(id));
                }
                actionChart.setOption(option);
                this._actionCharts[action_id]=actionChart;

                break;
            case "form":
                if(this._actionCharts[action_id]!=null){
                    this._actionCharts[action_id].dispose();
                    this._actionCharts[action_id]=null;
                }
                var data = JSON.parse(content);
                var url=data.url;

                element.html('<iframe src="'+url+'" style="width:100%;height: 100%;" frameborder="0"></iframe>');

                break;
            case "web":
                if(this._actionCharts[action_id]!=null){
                    this._actionCharts[action_id].dispose();
                    this._actionCharts[action_id]=null;
                }
                element.html('<iframe src="'+content+'" style="width:100%;height: 100%;" frameborder="0"></iframe>');

                break;
            default:
                if(this._actionCharts[action_id]!=null){
                    this._actionCharts[action_id].dispose();
                    this._actionCharts[action_id]=null;
                }

                element.html("<div class='action-msg'>"+content+"</div>");

                break;
        }
        var content = element.html();
        this._actionContents[action_id] = {type:'html', content: content};

    },
    //显示所有action内容
    showAllActionContent:function (states){
        if(states){
            for(var k in states){
                var actionContent = states[k].content;
                if(actionContent!=null){
                    this.showActionContent(actionContent);
                }
            }
        }
    },

    //绘制Action内容 {action_id,content_type,content}
    showActionContent:function (actionContent){

        if(actionContent==null||actionContent.content_type==null||actionContent.content==null){
            return;
        }

        var content_type = actionContent.content_type;
        var content = actionContent.content;
        var action_id = actionContent.action_id;

        this.setActionContent(action_id,content,content_type);
    },

    //状态列表折叠
    closeActionStateList:function (){
        var $this=this;
        var element = $("#"+$this.containerId+" #flow_state_list");

        element.attr("data_fold","true");
        element.find(".flow_state_list_content").hide();
        element.find("#flow_state_list_btn").html("+")

    },
    openActionStateList:function(){
        var $this=this;
        var element = $("#"+$this.containerId+" #flow_state_list");

        var fold=element.attr("data_fold");

        element.attr("data_fold","false");
        element.find("#flow_state_list_btn").html("-")
        element.find(".flow_state_list_content").show();

    },
    //设置状态列表显示否
    setActionStateListVisible:function(v){
        if(v==undefined){
            $("#flow_state_list").hide();
            return;
        }

        if(v){
            this.flowModel.show_action_state_list="true"
        }else{
            this.flowModel.show_action_state_list="false"
        }

        if(this.flowModel.show_action_state_list=="true"){
            $("#flow_state_list").show();
        }else{
            $("#flow_state_list").hide();
        }

    },
    setActionBodyVisible:function(v){
        this.flowModel.show_action_body = (v?"true":"false");
        if(this.flowModel.show_action_body=="false"){
            $("#"+this.containerId+" .action-body").hide();
        }else{
            $("#"+this.containerId+" .action-body").show();
        }
    },
    setActionContentVisible:function(v){
        this.flowModel.show_action_content = (v?"true":"false");
        if(this.flowModel.show_action_content=="false"){
            $("#"+this.containerId+" .action-content").hide();
        }else{
            $("#"+this.containerId+" .action-content").show();
        }
    },

};