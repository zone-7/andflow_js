var tags=['', '通用', '系统'];

var metadata=[
    {

        "name": "begin",
        "tp":"action",
        "title": "开始",
        "des": "开始",
        "group": "通用",
        "tag": "通用",
        "css": "begin",
        "icon": "begin.png", 
        "params": [],
        "params_html": "",
        "params_script": ""
    },
    {
        "name": "end",
        "tp":"action",
        "title": "结束",
        "des": "结束",
        "group": "通用",
        "tag": "通用",
        "css": "end",
        "icon": "end.png", 
        "params": [],
        "params_html": "",
        "params_script": ""
    },
    {
        "name": "group",
        "tp":"group",
        "title": "分组",
        "des": "分组",
        "group": "通用",
        "tag": "通用",
        "css": "group",
        "icon": "group.png", 
        "params": [],
        "params_html": "",
        "params_script": ""
    },
    {
        "name": "tip",
        "tp":"tip",
        "title": "标签",
        "des": "标签",
        "group": "通用",
        "tag": "通用",
        "css": "tip",
        "icon": "tip.png", 
        "params": [],
        "params_html": "",
        "params_script": ""
    },
    {
        "name": "script",
        "tp":"action",
        "title": "执行脚本",
        "des": "",
        "group": "通用",
        "tag": "通用",
        "css": "",
        "icon": "script.png", 
        "params": [],
        "params_html": "",
        "params_script": ""
    },

    {
        "name": "cmd",
        "tp":"action",
        "title": "系统命令",
        "des": "",
        "group": "系统",
        "tag": "系统",
        "css": "",
        "icon": "cmd.png", 
        "params": [
            {
                "name": "command",
                "title": "命令",
                "placeholder": "操作系统指令",
                "element": "textarea",
                "default": "",
                "attrs": {
                    "rows": "4"
                },
                "options": null,
                "option_mode": ""
            },
            {
                "name": "timeout",
                "title": "超时（毫秒）",
                "placeholder": "超时毫秒",
                "element": "input",
                "default": "10000",
                "attrs": {
                    "type": "number"
                },
                "options": null,
                "option_mode": ""
            },
            {
                "name": "cache",
                "title": "执行结果参数名",
                "placeholder": "执行结果存储到哪个参数变量",
                "element": "",
                "default": "",
                "attrs": null,
                "options": null,
                "option_mode": ""
            }
        ],
        "params_html": "",
        "params_script": ""
    },
    {
        "name": "server",
        "tp":"action",
        "title": "服务器",
        "des": "",
        "group": "通用",
        "tag": "通用",
        "css": "",
        "icon": "server.png", 
        "params": [],
        "params_html": "",
        "params_script": ""
    },
    {
        "name": "fireware",
        "tp":"action",
        "title": "防火墙",
        "des": "",
        "group": "通用",
        "tag": "通用",
        "css": "",
        "icon": "fireware.png", 
        "params": [],
        "params_html": "",
        "params_script": ""
    },
    {
        "name": "mysql",
        "tp":"action",
        "title": "Mysql",
        "des": "",
        "group": "通用",
        "tag": "通用",
        "css": "",
        "icon": "mysql.png", 
        "params": [],
        "params_html": "",
        "params_script": ""
    },
    {
        "name": "redis",
        "tp":"action",
        "title": "Redis",
        "des": "",
        "group": "通用",
        "tag": "通用",
        "css": "",
        "icon": "redis.png", 
        "params": [],
        "params_html": "",
        "params_script": ""
    },
    {
        "name": "mongodb",
        "tp":"action",
        "title": "MongoDB",
        "des": "MongogDB 文件服务器",
        "group": "通用",
        "tag": "通用",
        "css": "",
        "icon": "mongodb.png", 
        "params": [],
        "params_html": "",
        "params_script": ""
    },
    {
        "name": "nginx",
        "tp":"action",
        "title": "Nginx",
        "des": "负载均衡",
        "group": "通用",
        "tag": "通用",
        "css": "",
        "icon": "nginx.png", 
        "params": [],
        "params_html": "",
        "params_script": ""
    },
    { 
        "name": "erd",
        "tp":"list",
        "title": "数据库实体",
        "des": "数据库实体",
        "group": "ER图",
        "tag": "ER图",
        "css": "list",
        "icon": "list.png", 
        "params": [],
        "params_html": "",
        "params_script": ""
    },
    {
        "name": "custom_action",
        "tp":"action",
        "title": "自定义类型",
        "des": "自定义类型",
        "group": "自定义",
        "tag": "自定义", 
        "icon": "person.png", 
        "render": function(meta,action,html){
            var el = '<div style="width:100px;height:100px;background-image:url(../img/shape/diamond.png);background-size: 100% 100%; background-repeat:no-repeat;">'+
                
                '<div style="font-size:12px;line-height:12px;position:absolute;text-align:center;height:100%;width:100%;top:calc(50% - 6px);">'+meta.title+'</div>'+
                
                '</div>';
            
            return el;
        }
    }, 
    {
        "name": "custom_group",
        "tp":"group",
        "title": "自定义分组",
        "des": "自定义分组",
        "group": "自定义",
        "tag": "自定义", 
        "icon": "person.png", 
        "render": function(meta,action,html){
            var el = '<div style="width:300px;height:300px;border:1px solid #999999;background:white;"></div>';
            return el;
        }
    },
] ;







var currentLinkInfo;
var currentActionInfo; 

//打开连接线配置对话框
function openLinkDialog(link){
    currentLinkInfo = link;
    var dialog = $("#linkDialog");
    dialog.find("input[name='source_id']").val(link.source_id);
    dialog.find("input[name='target_id']").val(link.target_id);
    dialog.find("input[name='title']").val(link.title||"");
    dialog.find("input[name='label_source']").val(link.label_source||"");
    dialog.find("input[name='label_target']").val(link.label_target||"");
    dialog.find("select[name='animation']").val(link.animation?"true":"false");

    var arrows = link.arrows||[false,false,true];

    dialog.find("select[name='arrows1']").val(arrows[0]?"true":"false");
    dialog.find("select[name='arrows2']").val(arrows[1]?"true":"false");
    dialog.find("select[name='arrows3']").val(arrows[2]?"true":"false");


    dialog.find("select[name='active']").val(link.active||"true");
    dialog.find("textarea[name='filter']").val(link.filter||"");
    

    var modalLink = new Custombox.modal({
        content: {
            id:'linkModal',
            effect: 'fadein',
            target: '#linkDialog'
        }
    });
    modalLink.open();
}
function closeLinkDialog(){ 
    Custombox.modal.close();
}
function saveLinkDialog(){ 
    if(currentLinkInfo==null){
        return;
    }
    var dialog = $("#linkDialog");
    currentLinkInfo.title = dialog.find("input[name='title']").val();
    currentLinkInfo.label_target = dialog.find("input[name='label_target']").val();
    currentLinkInfo.label_source = dialog.find("input[name='label_source']").val();
    currentLinkInfo.animation = dialog.find("select[name='animation']").val()=="true"?true:false;
    var arrows=[false,false,true];
    if(dialog.find("select[name='arrows1']").val()=="true"){
        arrows[0]=true
    }
    if(dialog.find("select[name='arrows2']").val()=="true"){
        arrows[1]=true
    }
    if(dialog.find("select[name='arrows3']").val()=="true"){
        arrows[2]=true
    }
    currentLinkInfo.arrows = arrows;
    currentLinkInfo.active = dialog.find("select[name='active']").val();
    currentLinkInfo.filter = dialog.find("textarea[name='filter']").val();

    andflow.setLinkInfo(currentLinkInfo);
    Custombox.modal.close();
}

//打开节点配置对话框
function openActionDialog(action){
    currentActionInfo = action;
     
    var dialog = $("#actionDialog");
    dialog.find("input[name='name']").val(action.name);
    dialog.find("input[name='title']").val(action.title||"");
    dialog.find("input[name='des']").val(action.des||"");
    dialog.find("select[name='theme']").val(action.theme||"andflow_theme_default");
    dialog.find("select[name='once']").val(action.once||"false");
    dialog.find("select[name='collect']").val(action.collect||"false"); 
    if(action.content==null){
        action.content={};
    }
    dialog.find("textarea[name='content']").val(action.content.content||""); 
    dialog.find("textarea[name='script']").val(action.script||"");
    var modalAction = new Custombox.modal({ 
        content: { 
            id:'actionModal',
            effect: 'fadein',
            target: '#actionDialog'
        }
    });
    modalAction.open();
}
function closeActionDialog(){ 
    Custombox.modal.close(); 
}
function saveActionDialog(){
    if(currentActionInfo==null){
        return;
    }
    var dialog = $("#actionDialog");
  
    currentActionInfo.title = dialog.find("input[name='title']").val();
    currentActionInfo.des = dialog.find("select[name='des']").val();
    currentActionInfo.theme = dialog.find("select[name='theme']").val(); 
    currentActionInfo.once = dialog.find("select[name='once']").val();
    currentActionInfo.collect = dialog.find("select[name='collect']").val(); 
    if(currentActionInfo.content==null){
        currentActionInfo.content={};
    }
    currentActionInfo.content.content = dialog.find("textarea[name='content']").val(); 
    currentActionInfo.script = dialog.find("textarea[name='script']").val();

    andflow.setActionInfo(currentActionInfo);

    Custombox.modal.close(); 
}

//截图
function snap(){

    andflow.snap("流程");
}