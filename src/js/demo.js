var tags = ['', '通用', '系统'];

var metadata = [
    {

        "name": "begin",
        "tp": "action",
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
        "tp": "action",
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
        "tp": "group",
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
        "tp": "tip",
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
        "tp": "action",
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
        "tp": "action",
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
        "tp": "action",
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
        "tp": "action",
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
        "tp": "action",
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
        "tp": "action",
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
        "tp": "action",
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
        "tp": "action",
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
        "tp": "list",
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
        "tp": "action",
        "title": "自定义类型",
        "des": "自定义类型",
        "group": "自定义",
        "tag": "自定义",
        "icon": "person.png",
        "render": function (meta, action, html) {
            var el = '<div style="width:100px;height:100px;background-image:url(../img/shape/diamond.png);background-size: 100% 100%; background-repeat:no-repeat;">' +

                '<div style="font-size:12px;line-height:12px;position:absolute;text-align:center;height:100%;width:100%;top:calc(50% - 6px);">' + meta.title + '</div>' +
                '<div name="title">aa</div>' +
                '<div name="content"></div>' +
                '</div>';

            return el;
        }
    },
    {
        "name": "custom_group",
        "tp": "group",
        "title": "自定义分组",
        "des": "自定义分组",
        "group": "自定义",
        "tag": "自定义",
        "icon": "person.png",
        "render": function (meta, action, html) {
            var el = '<div style="width:300px;height:300px;border:1px solid #999999;background:white;"></div>';
            return el;
        }
    },
];







var currentLinkInfo;
var currentActionInfo;

//打开连接线配置对话框
function openLinkDialog(link) {
    currentLinkInfo = link;
    var dialog = document.getElementById("linkDialog");
    dialog.querySelector("input[name='source_id']").value = link.source_id;
    dialog.querySelector("input[name='target_id']").value = (link.target_id);
    dialog.querySelector("input[name='title']").value = (link.title || "");
    dialog.querySelector("input[name='label_source']").value = link.label_source || "";
    dialog.querySelector("input[name='label_target']").value = (link.label_target || "");
    dialog.querySelector("select[name='animation']").value = (link.animation ? "true" : "false");

    var arrows = link.arrows || [false, false, true];

    dialog.querySelector("select[name='arrows1']").value = (arrows[0] ? "true" : "false");
    dialog.querySelector("select[name='arrows2']").value = (arrows[1] ? "true" : "false");
    dialog.querySelector("select[name='arrows3']").value = (arrows[2] ? "true" : "false");

    dialog.querySelector("select[name='active']").value = (link.active || "true");
    dialog.querySelector("textarea[name='filter']").value = (link.filter || "");

    var modalLink = new Custombox.modal({
        content: {
            id: 'linkModal',
            effect: 'fadein',
            target: '#linkDialog'
        }
    });
    modalLink.open();
}

function closeLinkDialog() {
    Custombox.modal.close();
}
function saveLinkDialog() {
    if (currentLinkInfo == null) {
        return;
    }
    var dialog = document.getElementById("linkDialog");
    currentLinkInfo.title = dialog.querySelector("input[name='title']").value;
    currentLinkInfo.label_target = dialog.querySelector("input[name='label_target']").value;
    currentLinkInfo.label_source = dialog.querySelector("input[name='label_source']").value;
    currentLinkInfo.animation = dialog.querySelector("select[name='animation']").value == "true" ? true : false;
    var arrows = [false, false, true];
    if (dialog.querySelector("select[name='arrows1']").value == "true") {
        arrows[0] = true
    }
    if (dialog.querySelector("select[name='arrows2']").value == "true") {
        arrows[1] = true
    }
    if (dialog.querySelector("select[name='arrows3']").value == "true") {
        arrows[2] = true
    }
    currentLinkInfo.arrows = arrows;
    currentLinkInfo.active = dialog.querySelector("select[name='active']").value;
    currentLinkInfo.filter = dialog.querySelector("textarea[name='filter']").value;

    andflow.setLinkInfo(currentLinkInfo);
    Custombox.modal.close();
}

//打开节点配置对话框
function openActionDialog(action) {
    currentActionInfo = action;

    var dialog = document.getElementById("actionDialog");
    dialog.querySelector("input[name='name']").value = action.name;
    dialog.querySelector("input[name='title']").value = action.title || "";
    // dialog.querySelector("input[name='des']").value = action.des||"";
    dialog.querySelector("select[name='theme']").value = action.theme || "andflow_theme_default";
    dialog.querySelector("select[name='once']").value = action.once || "false";
    dialog.querySelector("select[name='collect']").value = action.collect || "false";
    if (action.content == null) {
        action.content = {};
    }
    dialog.querySelector("textarea[name='content']").value = (action.content.content || "");
    dialog.querySelector("textarea[name='script']").value = (action.script || "");
    var modalAction = new Custombox.modal({
        content: {
            id: 'actionModal',
            effect: 'fadein',
            target: '#actionDialog'
        }
    });
    modalAction.open();
}
function closeActionDialog() {
    Custombox.modal.close();
}
function saveActionDialog() {
    if (currentActionInfo == null) {
        return;
    }
    var dialog = document.getElementById("actionDialog");

    currentActionInfo.title = dialog.querySelector("input[name='title']").value;
    // currentActionInfo.des = dialog.querySelector("select[name='des']").value;
    currentActionInfo.theme = dialog.querySelector("select[name='theme']").value;
    currentActionInfo.once = dialog.querySelector("select[name='once']").value;
    currentActionInfo.collect = dialog.querySelector("select[name='collect']").value;
    if (currentActionInfo.content == null) {
        currentActionInfo.content = {};
    }
    currentActionInfo.content.content = dialog.querySelector("textarea[name='content']").value;
    currentActionInfo.script = dialog.querySelector("textarea[name='script']").value;

    andflow.setActionInfo(currentActionInfo);

    Custombox.modal.close();
}

//截图
function snap() {

    andflow.snap("流程");
}