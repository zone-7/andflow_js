/*!
 * andflow.js v1.0.0
 * @url https://github.com/zone-7/andflow_js
 * @date 2021-11-17
 * @author zone-7
 * @email 502782757@qq.com
 *
 * Released under the MIT License
 *
 */

var andflow = {
  containerId: null, //DOM
  img_path: '', //图谱跟路径
  editable: true, //是否可编辑

  tags: null, //标签
  metadata: null, //控件信息
  flowModel: null, //流程数据

  show_toolbar: true, //是否显示工具栏
  show_grid:true,
  metadata_style: '',
  metadata_position: '',

  drag_step: 10, //拖拉步进，<=1表示可以任意拖拉

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
  _listInfos:{},
  _tipInfos:{},

  _timer_link: null,
  _timer_group: null,
  _timer_action: null,
  _timer_thumbnail: null, 

  _drag_name: null, 
  _icon_nav:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAHJJREFUWEftlkEKgDAMBNOfKeRj/muhPk1yEbVaFCm5TO/tDAMlKZZ8SjLfEKAABW4LuHs1s2nEF5V0YvYEgr9cJEJs/iFWPwlI2mHuHkWaB97KPN3vFkCAAhSgAAUokF0gdR8YAo/RLWk9jnB2QgpQYAN8cboh/l0GAAAAAABJRU5ErkJggg==',
  _icon_eye:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAjNJREFUWEft1kuoT1EUx/HPzWuiPCZiTCEhlDwmBsiACUKiJAxMiBEDDK6Rx0Apj7yTRwYmihQDQogMPEtGlAkGJK+0ah8du///nnP/Ayd1V51OZ++z1/ru31577d2lYetqOL4+gP9egfH4heed5lJvFViPmZiQnkEp8Fc8xlPcw+G6QHUBInA8U2s6fpggKkGqAGbgQCnwWxzBG7zCi7QEYzAa8V6HUQk0QDbhVjvwngAW4yiGogh8CO8qVBiJDSWQT+n7fKtx7QCCen8acBdrWiTaREzBd9zHyyzAWJzA9NS+BftyiFYAy3Au/XgVq/G+NHApNiOWp2wXE/SdUuMInMbc1LYcfymRAwzEbUzDZSzBj5LDVTiVvq+lHOiH2QhFwibhSWnMAFzCQjzALHwr+nOAbehOnTHDkL+wCHADw7ELO0t90XYcixBg8zN15iHUDNuO3a0AxqXZD8NebM2crMBZPEoz/pL1x8yKbA8FYweU7QxW4kNS4Vl0lhWIGe1IIwbjc+YgkmgPjmFt1ld8XsGClPV5DRiCj+nHPwr2BqDYGQexsQ3ABUSSxq6JHVC2SoCqJQjHEaDOEuSJGCCVSxA/9ZSEk1MSRmHKkzDaTqYkvIk5nSRhjKnahnEeRDUMu47X6J8KUgCG5QnYq20YDhotRIVydUpxnIzx/ERUvziKy9ZxKS6cNHoYFRCNHsdlORu7kOT1prErWZvC559fStuBdNxedSfs2HHdgX0AjSvwG5F4nCH6feA0AAAAAElFTkSuQmCC',
  _icon_eye_close:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAspJREFUWEft1kvoVVUUx/HPHwmCwBrkwHz0Es3EF2I0CQoEwVdOfIyUQs03DoQUlYp8gA4ExYRKJBv4GulARRDDB6IYRBYqJVqaOBBf+AhEkCX7yOl0zr3n/v/8+TtwTS7su/Za3/3ba6192nSxtXVxfs8sQH/cx5XOVqhKgVMYicnY3ZkQVQBf4ouUuAxiGAbiNdzDOfyBf1qFbVQDjSAu4o2SZMexF3twvg5MsyKsgoj1zLqjN97B4Nz6WqzD9UYgzQDexS4ManAd+fhDMREZYKiwCj9WQTQCiOS/p41RiJNqQoTbGKxGAIV9lYP6D0sVwIc4nDw/xdakRCsQryaImSlO/H5fVKIMIJ98LPblNsV1tAIRW9dgSYrxFqKAn1oRYAj2p/aqkq09EN9gDg5hVCOA7ZiKLZhRUTj5zgiXusMqix3d8XkWO69AJA6nh+iLayUAL+NWOwuzH37BS/gIP0WcPEAUXdz/LHxXcfro819xFb3aUZgLsCENq4+LAJswN83+kLXMsta8gDhRWCs1cQLvYyMWFgHeRjj0wHRsKyF4EZE83oCnMtaEWI6vk3ojsisudkEm0R2Mx5ESiNnYnNYvo1sCyrsWC3M4jqb7z+bKE/+yObADU3A2tUzcd9FiFoT0eZuHN7E4LeYh4mWN7jmGD/Kbqibh3+iDg6ktb5ZAvJJexEcI/9vJ5wdMK4GIAj+Nu3UAwife9yi0M1hZcuKKOn2yfACjSyD+t6fZa5iv8JjjAfJXo8zoic8Qsz+KNaxyWDUDiM2RdFkKdCON6hjX8fFxKa2/kJ7seIrziWOcN/qyqv1VPA4r8F7h9NGSDzAAAZHZt1iKAJ6f+r5UiToK5HNGIU1IMyA+UrKkkegkfsNO/FwAXYT1aS06JVOutgJl1x7J4+T/4s8mdRF/Rxu+jk/qdkGNmB13afUKOp6xEOE5QJcr8BhVNZUhAZa4eAAAAABJRU5ErkJggg==',
  _icon_cursor_hand:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAfJJREFUWEft1r+rz1Ecx/HHLdNdlGK4g1gw3IHUNRgw2GxSBuqSDErcJIv8GCySDAqDRUnXaiJhUTJQymJScv+A272Tgd51jo6P637P53z79o186vSp8/mc9/t5Xud93u/3hDE/E2P2768H2IRv+Nqq5DAKvMGu5PghjrRA9AWYxSS24XRy+Ap7E8B6vMCHWpg+AI9xqGM41ofzl535C7heA1ELcAWX8QhrCpASYBl3cRARG1cRc6HG0z/B1ALEDmOn+xCSf08GS4CYj+8ZtvQZMDH/2zNKgHC6FmexgK1Y6hKMGiB2nRXJ6v3C8E8ARMC9xjMcK3acz30oBU5iCns6Qfg26TizQlxFsMaIoIzRDHAfxzsO8jluSfOfKu56E0Ck2Ei1T9LdPt9RoMLvz1+aAM7hRkomYaCbB0YOcCDt/jn2p7QaaTiO4HMf760xEOn2PaaxE+96Oi1/bzqCMJCPYR6HxwGwLqmwEZsbpM/MzQqEgUgml3AHpxpVGAogdh6xEEUlxmIDRJTiHdjQWg1v4Qyu4WJPgAc4ittFB9W7GG1PKnzEiZSgajjyVf6C3Yh3cz9QtmO58RgEkW9R9I6hwIpPbTmOxVGY7iUrNetWDb5MU2OoJC9bsUEK/AeYw82ikR06BgZJ3vS9bww0OVlt0Q8nvokhubPnZQAAAABJRU5ErkJggg==',
  _icon_cursor_auto:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAlZJREFUWEfV10vITWEUxvHfN1IkmRhgIERSiiRKuUwkjMhIbgMmQkpMhFIYuSdKiEgiyTXFRy7lOpOBXDKiyIARoaW1azvOOd85Ovsrq87ofc/7/Pd617P22l2YjiVYqrrYjdu4UCvRhS2YlhuqQpiLb5hSD+AntiZIVQDxkJsxA91lkcjAfwUwAu/xpc1UdSwD5zEGy/GgDYiOAdxK13xIiMstQnQUIDTDut+xDCdbgOg4wHo8SuE12NsDRMcBwk5D8BSD0sJh5UZRCUCI9cFDjMssRDbqRWUAhdg1zMp6WJy9pQxSOUCIHct3SjgjID6VCHoFIPS2Y2P2iIB4mRC9BhB6a7ELLzIjUSNh2/gFyB/R7rsgGlFEuKBZLMIJRMOKTFxvtLkqgNCbjSvZsALidD2IKgFCbxJuoh9W4UBvXUFZZ3hewUhswrbyYtUZKLQG4GpORFGg64qFqgCi4utFCM/D8WIGrQJgGF734JLCSd3NhtIY1WK9iPBwIxvGWuHxvviKG7jfBOT3/hBoZSwvhtZ6AEULjg64MwUPYQUm4FmzbJSfsIWs/ZWBmPfjDXgvrTY+D5mY88I+rK4KoOjv+/Eun34hzqZgXMFk9K8C4BQO4xwWYDTu4g7mp2B0v6j2lbm3Lse/XkHUTUzFU/EjTz6Sg+pYPMdAPMbH7IgdAwjxN1m8b0unzsGlvIooyIgd2ICoiSf1CNrNwMWcfGZm4dWeGdcQfWBojbsafvq1CzAKg2u/70oUUfF7cj0y9QpHEYX6uRMZ6MmqMSGfSUseTPGm//kFAJG9IcmEOX4AAAAASUVORK5CYII=',
  _icon_drag_start:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAhxJREFUWEft1kvITHEYx/HPu2EhRYnEwpawkZV7IgrJZcEKJRGFhcsKK1m4RBZs3BZKSZIUC5QoiY0QCxYkykYWFoqe+o+OMTPv/z9nXi/lqWk6M8//PN/ze26nzyBb3yDH9x+grgJzcadOGksBxuEd9mNOJfCBBDIBb0qAcgHWYR8iwEEsw9YUdBvW4gXCLwAC6GwOSA5ABH2NpXiKW/iGiZUA33Eee7EQZzA+qdWRIwcg5A5rfG9PaoxsAtiBY+m3e/iM4Qn2Mi7iUzPNQAE8x1AswWhcwq5WaRkogI94hRnpiU9iDFZ1o0CjmKLAGhb1cK1yfQQ7K9cPcT0VYyN90TXzSgEuYD6uYnNOVSefSXhW8W+0bRFAHJqKl/haKcICjp+uxQCLU1vNxJqmLvgjAEcxAusRcoZVJS2FKFbgNu7WlL0K+e8BXEnFt7tU6zb+xQrEgolVu7JHAPFA77Eldw5EAcY8P5wWSx2OIfiA2BW/bchOo3h1muEbakKsQCyj6KbYEb9Yf7tgEW5gE053KcPbNLZbTtL+ACJmLJRIxx4cKoSIdo50zsKXVmdzAOLcNJxLIzneBwKok43FCczGctxv55wL0Dgf7RSvZsfxAI9Tu8b/UWwLMD35nEpFHGu5rZUCxI2imDamV7IpGIYniL0RQPGJtruZk65uAJrvOwqT8ahdnnutQM6DZfv0QoHsYHW6oFaQvzoFPwAAmG4hmL5K1gAAAABJRU5ErkJggg==',
  _icon_code:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAAAf5JREFUWEftl79rFEEUx79v4FotQqwsTB1IZWmRNBYai0BiKRF2392hV8RKsDAH/gdy4e7NgmdrSCFoI0LSpEwRCLZerQimOzhunsw5e2zMSbjcJkvITbXszrz5zPf9mLeEggcVvD+mAKcUiKJokYjWAKwR0ax3kXNuKUmSvXHc5e0YY3bDmg6AxDm3/6+dUwDM/ArAm+xmOQAMzKnqlrX2Wdb2KIDvAO6o6vDEqlo/jwJE9DrdjIgWVfWntfbWWQAaaPestUvjyP6/uXEc73oA/11EThx6lAJTgGusQDZ3fRZcRBAS0Xyr1fo2zI5s5DLzWwDPw7sdEVnNIwvK5fI7VV0PtjZFpD4ECJVvxhizrKqPAMyENHxqrW3nARBF0QNjzOdg65iI9p1z26raIWYeBF1mfAWwXSqVdhqNxq88AJj5JoAqgIcA7p0oRIUDFO6CAoKwLiKbI7Og8DT0VGlMZOsAM98H0ALwPqWv1Wo3ut3uR7+m1+uttNvt32G9P92qMeZls9n85N9NfBkx8wffoADoiMicN1qtVhf6/f6hf3bO3U2S5CAAHAGY/3vxSTkXgGDYK+CL05fUf8w88GXWp5VKZdk590REHqfzJlZg0lpwtQDiOP7hm9EiWzLva87KfqlNaQi4DQAvANwOUX55bfmkATfu+umvWeEK/AFYAJFq0iBzXAAAAABJRU5ErkJggg==',
  _icon_design:'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAAXNSR0IArs4c6QAABBBJREFUWEfFl1mIXUUQhv86CAHBxzwEQXxRXNA4JLhBHBRUhEBccERRBLldDerkQSOCC+OOkkwEdZSuvkpQUDBRRxExuCGJGcVM4oYE9zyYgD4p+OTcLik9Zzj3zFnuBGQaDvfC6e7/66rqqjqEFR60wvroBGBmTinN9/v9+eXAOudOjTF+17WmFYCZlYj2qOoGALeLyEzXhvbeey8ppSuJaDWACRHZ2bSuEcDEATwoIg/0er2zsyz7DMB9IjLdBsHMzwM4S0TOZeZrAbzaBlELUBYvxLz3Z6jqXgDbROSxOghmPkhEFEI4p3jfBbEEoE68AvE+ADHLlCGY+SUA4wD+JKKJEMK3JYibAeyos8QQQJt4BeJtAC8WEM65l4noRBEZd849TkQbR4VYBGBmO9EaEfFlsZTSTIzx4vJpc3dYYO0kotNVdbWIXFI68XYAlzVBiMii7uKfXq+3Lsuy/UR0YQhhLhexANpVNXce6RYTcwC+F5H11Zjw3s+o6ngNxO8ANojIIVtTdQEDeArALQDuaRK3hcxscCeIyBVNt6IKwcz7AcyXrVwXhAbxrKruiDH26tyRix8vIhu78oJzbpqILs8Pu7csvsQCxWb5opuIaFPZHUT0gqqeD2CViGzqEi/FxBEAR+pc1ZaINgO4C8Dd5g4ielhVryGi40IIVy9D/HMAB6onL9a3pmLn3BYi2grAWVSrKsUYLbuNNJj5UwBfNok3uqC8u3NulojsGu4WkYmRlP8L0m8AfNImPhKABZwVlRDCUC7oqAd7AJwJYFpEHm2b21UN7apZ3l3OyT8GcEhVnyOi1+w3xritCaItCI9F/MM8Mf2bTb33F6iq7bNVRCy/LBlN1fBYxK1I/Vj1eQ7xJoD7RSRUCeoS0ZT5b5lm301Eh1X1PVW9taZ2mCXetWttZbQMsQTAe/96SumtGKOVz87BzO8AOArABMxyV4nIbHVhbomPAGwuQ9RZ4Id8k6+71L33c6p6GoCHAGxX1UtjjOaK2pFD7EsprS96zGoxOgnA4XK5bNqMmc2vfwD4CcAUEd0QQnilmG+dUJ07mNni4GhRYYcAnHPWSDwhInaHGwczv0FEf4UQbrRJzGzuusgaEeuEmtqwvOeYqu0H8o3uVVVrp62Fqh3MvAvA3yJyfXlCvrlVUkvd1pAMdcN14ra+aoHZLMs+CCE8bS8nJydXLSwsjA0GgzEiGkspnZJl2W8hhOvq6JjZegjLfHeIyJMld1i3NXTy4l0V4Ncsy7aklNYS0VoA9qwB8AuAL/LCMtSMVkGY+U4Aj6SUzuv3+181nbwWgJn3AThZVa29tufAYDA42O/3f+66ERV33AbgmeKjpi2oOz/NliNcnpv3mOuqiae63/8GMCr4igP8A88tOz9MyKreAAAAAElFTkSuQmCC',
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
    if(metadata_style==null || metadata_style==""){
      if($this.metadata_position=="top"){
        metadata_style = "metadata_float_top"; 
      }else  if($this.metadata_position=="left"){
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
    html += '<a class="code_btn" title="code">&nbsp;</a>';
    html += '<a class="scale_down_btn" title="缩小">-</a>';
    html += '<a class="scale_info" title="还原"><span class="scale_value">100</span><span>%</span></a>';
    html += '<a class="scale_up_btn"  title="放大">+</a>';

    html += '<a class="thumbnail_btn"  title="缩略图">&nbsp;</a>';
    html += '</div>';

    html += '</div>';
    //end tools

    //begin flow_thumbnail
    html += '<div class="flow_thumbnail">';
    html += '<div class="flow_thumbnail_mask"></div>';
    html += '</div>';
    //end flow_thumbnail

    //begin canvasContainer
    var bgstyle="";
    if(!$this.show_grid){
      bgstyle="background:none";
    }
    
    html += '<div id="canvasContainer" class="canvasContainer" style="'+bgstyle+'">'; 
    html += '<div id="canvas" class="canvas"></div>';  
    html += '</div>'; 
    //end canvasContainer
 
    //begin codeContainer
    html += '<div id="codeContainer" class="codeContainer">'; 
    html += '<textarea></textarea>';  
    html += '</div>'; 

    html += '</div>';
    //end designer

    html += '</div>';

    $('#' + containerId).html(html);
 
    //events
    
    
    //nav button
    $('#' + containerId)
      .find('.nav_btn')
      .css('background-image', 'url(' + this._icon_nav + ')');
    $('#' + containerId)
      .find('.nav_btn')
      .attr('state', 'open');
    $('#' + containerId)
      .find('.nav_btn')
      .bind('click', function (e) {
        var btn = $('#' + $this.containerId).find('.nav_btn');
        var state = btn.attr('state');
        if (state == 'open') {
          btn.attr('state', 'close');
          $('#' + $this.containerId)
            .find('.andflow')
            .addClass('fold');
        } else {
          btn.attr('state', 'open');
          $('#' + $this.containerId)
            .find('.andflow')
            .removeClass('fold');
        }
      });

    //scale
    $('#' + containerId)
      .find('.scale_up_btn')
      .bind('click', function (e) {
        var value =
          $('#' + $this.containerId)
            .find('.scale_value')
            .html() * 1.0;
        value = value + 1;
        var v = value / 100.0;
        $('#' + $this.containerId)
          .find('.canvas')
          .css('transform', 'scale(' + v + ')');
        $('#' + $this.containerId)
          .find('.scale_value')
          .html(value);
      });
    $('#' + containerId)
      .find('.scale_down_btn')
      .bind('click', function (e) {
        var value =
          $('#' + $this.containerId)
            .find('.scale_value')
            .html() * 1.0;
        value = value - 1;
        var v = value / 100.0;
        $('#' + $this.containerId)
          .find('.canvas')
          .css('transform', 'scale(' + v + ')');
        $('#' + $this.containerId)
          .find('.scale_value')
          .html(value);
      });
    $('#' + containerId)
      .find('.scale_info')
      .bind('click', function (e) {
        $('#' + $this.containerId)
          .find('.canvas')
          .css('transform', 'scale(1)');
        $('#' + $this.containerId)
          .find('.scale_value')
          .html('100');
      });

    
    //drag and move
    var canvasContainer = $('#' + containerId).find(".canvasContainer");
    $('#' + containerId).find('.canvas').bind('mousedown',function(e){
      var masker = $('#' + containerId).find('.canvas');

      masker.attr("drag","true");
      masker.attr("offset_x",e.offsetX);
      masker.attr("offset_y",e.offsetY);
      masker.addClass("canvas-move");

      $this._resizeCanvas();

    });
    $('#' + containerId).find('.canvas').bind('mouseup',function(e){
      var masker = $('#' + containerId).find('.canvas');
      
      var drag = masker.attr("drag");
      if(drag=="true"){
        $this._onCanvasChanged();
      }

      masker.attr("drag","false");
      masker.attr("offset_x",e.offsetX);
      masker.attr("offset_y",e.offsetY); 
      masker.removeClass("canvas-move");
 

    });

    $('#' + containerId).find('.canvas').bind('mouseout',function(e){
      var masker = $('#' + containerId).find('.canvas');

      masker.attr("drag","false");
      masker.attr("offset_x",e.offsetX);
      masker.attr("offset_y",e.offsetY); 
    });

    $('#' + containerId).find('.canvas').bind('mousemove',function(e){
      var masker = $('#' + containerId).find('.canvas'); 
      var drag = masker.attr("drag");
      if(drag=="true"){
        let startX = masker.attr("offset_x");
        let startY = masker.attr("offset_y");
        let offsetX = e.offsetX - startX;
        let offsetY = e.offsetY - startY;
        
         
        scrollLeft = canvasContainer.scrollLeft() - offsetX;
        scrollTop = canvasContainer.scrollTop() - offsetY;

        canvasContainer.scrollLeft(scrollLeft); 
        canvasContainer.scrollTop(scrollTop); 
      }
    });

    //show code
    $('#'+containerId).find('.code_btn').css('background-image','url('+$this._icon_code+')');
    $('#'+containerId).find('.code_btn').bind('click', function (e) {
      try{
        if($('#codeContainer').is(':visible')){
          var txt = $('#codeContainer textarea').val()||"{}";
          
          var m = JSON.parse(txt); 
          $('#codeContainer').hide();  
          $this.showFlow(m); 
 
          $('#'+containerId).find('.code_btn').css('background-image','url('+$this._icon_code+')');

        }else{
          var code = $this.getFlow();
          var content = JSON.stringify(code,null,'\t');

          $('#codeContainer').show(); 
          $('#codeContainer textarea').val(content);
          
          $('#'+containerId).find('.code_btn').css('background-image','url('+$this._icon_design+')');

        }

      }catch(e){ 
        console.error(e);
      }

    });

    //thumbnail
    $('#' + containerId).find('.thumbnail_btn').css('background-image', 'url(' + this._icon_eye_close + ')');
    $('#' + containerId).find('.thumbnail_btn').attr('state', 'close');
    $('#' + containerId).find('.thumbnail_btn').bind('click', function (e) {
        var element = $('#' + $this.containerId).find('.flow_thumbnail');
        var btn = $('#' + $this.containerId).find('.thumbnail_btn');
        var state = btn.attr('state');
        if (state == 'open') {
          btn.attr('state', 'close');
          btn.css('background-image', 'url(' + $this._icon_eye_close + ')');
          element.hide();
        } else {
          btn.attr('state', 'open');
          btn.css('background-image', 'url(' + $this._icon_eye + ')');
          element.show();
          $this._showThumbnail();
        }
    });

    $('#' + containerId).find('.flow_thumbnail_mask').mousedown(function (e) {
        
        var xx = e.offsetX;
        var yy = e.offsetY;
         
        $('#' + $this.containerId).mousemove(function (e) {
          var el = $('#' + $this.containerId).find('.flow_thumbnail_mask');
          if(el.length>0){
            var x = e.pageX - el.parent().offset().left - xx;
            var y = e.pageY - el.parent().offset().top - yy;
            if(x<0){
              x =0 ;
            }
            if(y<0){
              y=0;
            }

            if(x+el.outerWidth()>el.parent().width()){ 
              x = (el.parent().width()-el.outerWidth()); 
            }
            if(y+el.outerHeight()>el.parent().height()){
              y= (el.parent().height()-el.outerHeight());
            }
          
            el.css("left",x+"px");
            el.css("top",y+"px"); 

            var sca = $('#' + $this.containerId).find(".canvas").parent().width()/el.width();

            var l = el.position().left * sca;
            var t = el.position().top * sca;
            $('#' + $this.containerId).find(".canvas").parent().scrollLeft(l);
            $('#' + $this.containerId).find(".canvas").parent().scrollTop(t);

          }
          
        });
    });    
     
  }, 
  //定时动画
  _initAnimaction: function(){
    var $this = this;
    var dashstyle = ['0 1 1','1 1 1'];
    
    this.animation_timer && clearInterval(this.animation_timer); 
    this.animation_timer =  setInterval(function(){

      var conn_list = $this._plumb.getAllConnections();
      for(var i in conn_list){

        var conn = conn_list[i]; 
        var link = $this.getLinkInfo(conn.sourceId, conn.targetId);
        if(link.animation){
          var arrow_source = conn.getOverlay("arrow_source"); 
          var arrow_target = conn.getOverlay("arrow_target"); 
          //方向
           
          var diract = 0;
          if(!arrow_source.visible  && arrow_target.visible){
            diract = 1;
          }else if(arrow_source.visible && !arrow_target.visible){
            diract = 2;
          }

          var arrow = conn.getOverlay("animation"); 
          arrow.setVisible(true); 
           
          if(diract == 1){
            arrow.loc = arrow.loc + 0.05;
            if (arrow.loc > 0.9) {
              arrow.loc = 0.1;
            }
          }else if(diract == 2){
            arrow.loc = arrow.loc - 0.05;
            if (arrow.loc < 0.1) {
              arrow.loc = 0.9;
            }
          } else {
            if(arrow.diract ==null || arrow.diract == 1){
              arrow.loc = arrow.loc + 0.05;
              if (arrow.loc > 0.9) { 
                arrow.diract = 2;
              }   
            }else{
              arrow.loc = arrow.loc - 0.05;
              if (arrow.loc < 0.1) { 
                arrow.diract = 1 ;
              }   
            }
           
          }

        }else{
          var arrow = conn.getOverlay("animation"); 
          arrow.setVisible(false);
        }
        
      }

    },100);

  },
  _initEvents: function () {
    var $this = this;

    $('#' + $this.containerId).mouseup(function (e) {
      
      $(this).unbind('mousemove');
      $(this).css('cursor', 'default');
      $this._drag_name=null;
      $('#drag_helper').remove();

    });
    $(document).mouseup(function(e){
      
      $('#' + $this.containerId).unbind('mousemove');
      $('#' + $this.containerId).css('cursor', 'default');
      $this._drag_name=null;
      $('#drag_helper').remove();
    })


  },
  //初始化样式
  _initTheme: function (theme) {
    this.setTheme(theme);
  },

  //初始化action 列表
  _initMetadata: function () {
    var $this = this;

    var tags = this.tags ||[];
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
    $('body').append(scripts);

    //初始化action模板元数据
    if ($('#tag_select').length > 0) {
      var tpdata = [];

      $('#tag_select').html('');
      $('#tag_select').append('<option value="">' + $this.lang.metadata_tag_all + '</option>');
      for (var i in tags) {
        var t = tags[i];
        if (t == null || t == '') {
          continue;
        }
        $('#tag_select').append('<option value="' + t + '">' + t + '</option>');
      }

      $('#tag_select').on('change', function (e) {
        var tag = $(this).val();
        $this._showMetadata(tag);
      });

      //加载Action元数据
      $this._showMetadata($('#tag_select').val());
    } else {
      $this._showMetadata('');
    }
 
  },
  _dropComponent:function(name,left,top){
    var $this = this;
         
    var metaInfo = $this.getMetadata(name);
     
    if(metaInfo.tp=="group"){
      var groupId = 'group_'+jsPlumbUtil.uuid().replaceAll('-', '');
      var group = { id: groupId, name:metaInfo.name, left: left, top: top, actions:[]};
        
      $this._createGroup(group);

    }else if(metaInfo.tp=="list"){
      var listId = 'list_'+jsPlumbUtil.uuid().replaceAll('-', '');
      var list = { id: listId, name:metaInfo.name, left: left, top: top, items:[]};
        
      $this._createList(list);

    }else if(metaInfo.tp=="tip"){
      var tipId = 'tip_'+jsPlumbUtil.uuid().replaceAll('-', '');
      var tip = { id: tipId, name:metaInfo.name, left: left, top: top, content:""};
        
      $this._createTip(tip);

    }else{
      var actionId = jsPlumbUtil.uuid().replaceAll('-', '');
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
        if ($(".action[name='begin']").length && $(".action[name='begin']").length > 0) {
          return;
        }
      }
      //结束节点只有一个
      if (name == 'end') {
        if ($(".action[name='end']").length && $(".action[name='end']").length > 0) {
          return;
        }
      }
      action.title=action.title||metaInfo.title;

      $this._createAction(action);

    }
  },
  _initPlumb: function () {
    var $this = this;

    if ($this._plumb != null) {
      $this._plumb.destroy();
      $('#' + this.containerId + ' #canvas').html('');
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
      Anchor:"Center",
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
            show:false,
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
            show:true,
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
            show:false,
          }, 
        ],
        [
          'Diamond',
          {
            location: 0.5,
            id: 'animation',
            length: 10,
            width: 10,    
            show:false, 
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
      } catch (e) {}
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

    // bind a double click listener to "canvas"; add new node when this occurs.
    $("#canvas").bind("click", function(e) {
        if($this.event_canvas_click){

          $this.event_canvas_click(e);

        }
    });


    // $this._plumb.draggable("standalone");


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
    $('#actionMenu').html('');
    var index = 0;
    for (var g in groups) {
      var openClass = index == 0 ? 'menu-is-opening menu-open' : '';
      var openBody = index == 0 ? '' : 'display:none';

      var html =
        '<li class="actionMenuGroup"  ><a href="#" class="group-title">' +
        g +
        '<i class="pull-right ico"></i></a></li>';

      //html+='<ul class="actionMenuGroupBody" >';

      var item = groups[g];
      for (var i in item) {
        var name = item[i].name;
        var title = item[i].title;
        var icon = item[i].icon || 'img/node.png';

        var img = '';
        if (icon && icon.length > 0) {
          img = '<img src="' + ($this.img_path || '') + icon + '" draggable="false" />';
        }

        var element_str =
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
          title +
          '</a></li>';
        html += element_str;
      }

      //html+='</ul>';
      //html+='</li>';
      $('#actionMenu').append(html);
      index++;
    }

    $('#actionMenu li.actionMenuItem').bind("mousedown", function(e){
      var el = $(this);  


      //如果是编码状态不可拖动
      if($('#codeContainer').is(':visible')){
        return;
      }


      var inner_x = e.offsetX;
      var inner_y = e.offsetY;

      var name = el.attr("action_name");
      $this._drag_name = name; 
      $('#' + $this.containerId).find(".andflow").mousemove(function (e) {
        if($this._drag_name==null){
          return;
        }
         

        var helper=  $('#' + $this.containerId).find(".andflow").find('#drag_helper');
        if(helper==null || helper.length==0){
          helper = $this._createHelper($this._drag_name);
          if(helper==null){
            return;
          }
           
          $('#' + $this.containerId).find(".andflow").append(helper);

        }
        
        var ll = helper.width()/2 || 10;
        var tt = helper.height()/2 || 10;
 
        var x = e.pageX - $('#' + $this.containerId).find(".andflow").offset().left - ll;
        var y = e.pageY - $('#' + $this.containerId).find(".andflow").offset().top - tt;

        helper.css("left",x+"px");
        helper.css("top",y+"px");
        
        helper.attr("p_x",ll);
        helper.attr("p_y",tt);


      });

    });

 
  },
  _createHelper: function(action_name){
    var $this = this;

    if(action_name==null)return;
    var metadata = $this.getMetadata(action_name);
    if(metadata==null)return;
     
    var icon = metadata.icon;
    var title = metadata.title;

    var helperEl = $('<div class="action-drag"></div>');

    var contentEl = $('<div class="action-drag-main" ><div class="action-header">' +title + '</div><div class="action-icon"><img src="' +
      ($this.img_path || '') +
      icon + '"  draggable="false"/></div></div>'); 

    if(metadata.tp=="group") {
      helperEl = $('<div class="group-drag"></div>');
      contentEl = $('<div class="group-drag-main"><div class="group-header">' + title + '</div><div class="group-body"></div></div>');
    }else if(metadata.tp=="list") {
      helperEl = $('<div class="list-drag"></div>');
      contentEl = $('<div class="list-drag-main"><div class="list-header">' + title + '</div><div class="list-body"></div></div>');
    }else if(metadata.tp=="tip") {
      helperEl = $('<div class="tip-drag"></div>');
      contentEl = $('<div class="tip-drag-main"><div class="tip-header"></div><div class="tip-body">' + title + '</div></div>');
    }else{
      helperEl = $('<div class="action-drag"></div>');

      contentEl = $('<div class="action-drag-main" ><div class="action-header">' +title + '</div><div class="action-icon"><img src="' +
      ($this.img_path || '') +
      icon + '" draggable="false"/></div></div>'); 
    }

    var render = metadata.render_helper || metadata.render || $this.render_action_helper;
    if(render) {
      let r = render(metadata);
      if (r != null && r.length > 0) {
        contentEl = $(r); 
      }
    }
    

    helperEl.append(contentEl);
    helperEl.attr("id","drag_helper");
    helperEl.css("position","absolute");
    helperEl.find("img").attr("draggable","false");

    helperEl.bind("mouseup",function(e){
      
      var ll = helperEl.attr("p_x")||10;
      var tt = helperEl.attr("p_y")||10; 
      var l = e.pageX - $('#' + $this.containerId).find('.canvas').offset().left - ll*1;
      var t = e.pageY - $('#' + $this.containerId).find('.canvas').offset().top -  tt*1;
      
      if(l >= 0 && t>=0){
        $this._dropComponent($this._drag_name,l,t);
      }

     

    });

    return helperEl; 

  },
  _createGroup: function(group){
    var $this= this;
     
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
    
    var groupElement = $('#' + $this.containerId+ ' #' + group.id);
    if(!groupElement || !groupElement.length || groupElement.length<=0){
      var html='<div id="'+group.id+'" class="group group-container" > </div>';  
      groupElement = $(html);
     
      var group_main_dom = '<div class="group-main group-master"><div class="group-header"></div><div class="group-body"></div></div>';

      //render
      if(group.render){
        var r = group.render(group_meta, group, group_main_dom);
        if (r && r.length > 0) {
          group_main_dom = r;
        }
      }else if(group_meta.render){
        var r = group_meta.render(group_meta, group, group_main_dom);
        if (r && r.length > 0) {
          group_main_dom = r;
        }
      } 

      group_main_element = $(group_main_dom); 

      //removebtn 
      group_main_element.append('<div class="group-remove-btn">X</div>');
      //resize
      group_main_element.append('<div class="group-resize"></div>');

      //endpoint
      var ep = '<div class="group-ep" title="拖拉连线">→</div>'; //拖拉连线焦点
      if ($this.render_endpoint) {
        var epr = $this.render_endpoint(action_meta, action, ep);
        if (epr && epr.length > 0) {
          ep = epr;
        }
      }
      var epElement = $(ep);
      epElement.removeClass('group-ep');
      epElement.addClass('group-ep');
      group_main_element.append(epElement);

      groupElement.append(group_main_element); 

      var canvasElement = $('#' + $this.containerId + ' #canvas');
      canvasElement.append(groupElement); 
       
    }
    
    $this.setGroupInfo(group);
   
 
    //plumb add group 
    $this._plumb.addGroup({
      el:groupElement.get(0),
      id:group.id, 
      orphan:true,
      droppable:true,
      dropOverride: true,
      revert:true,
      endpoint:["Dot", { radius:3 }] 
    }); 


    $this._plumb.makeSource(groupElement.get(0), {
      filter: '.group-ep', 
      anchor: 'Continuous',
      extract: {
        action: 'the-action',
      }
    });

    //target
    $this._plumb.makeTarget(groupElement.get(0), {
      dropOptions: { hoverClass: 'dragHover' },
      anchor: 'Continuous', 
      allowLoopback: true,
    });

    $this._plumb.draggable(groupElement.get(0),{
      stop:function(event){
        if($this.drag_step>1){
          x = Math.round(event.pos[0]/$this.drag_step) * $this.drag_step;
          y = Math.round(event.pos[1]/$this.drag_step) * $this.drag_step; 
          $(event.el).css("left",x+"px");
          $(event.el).css("top",y+"px");
        }
      }
    });
    
   
    if(members && members.length>0){
      var actionElements = [];
      for(var i in members){
        actionElements.push($("#"+members[i]).get(0));
      }
      $this._plumb.addToGroup(id, actionElements);
    }
    
    //event
    groupElement.bind('mouseup', function () {
      $this._onCanvasChanged();
    });
    groupElement.find('.group-remove-btn').bind('click', function () {
      var sure = confirm('确定删除分组?');
      if (sure) {
        $this.removeGroup(id);
      }  
    });
 
    groupElement.find('.group-header').bind('dblclick',function(event){
      if ($this.editable) {
        event.preventDefault();
        if(groupElement.find('.group-header').find('.content_editor').length>0){
          return;
        }

        var editor=$('<input class="content_editor"  />');
        editor.css("position","absolute");
        editor.css("z-index","9999");
        editor.css("left","0px");
        editor.css("top","0px");
        editor.css("width","100%");
        editor.css("height","100%");
        editor.css("box-sizing","border-box");
        editor.val(groupElement.find('.group-header').html());
        groupElement.find('.group-header').append(editor);

        editor.focus();
        editor.on("blur",function(e){
          
          var value = editor.val(); 
          editor.parent().html(value);
          $this._groupInfos[id].title = value;
          editor.remove();
        });
        editor.on("keydown",function(e){ 
          if(e.code=="Enter"){ 
            var value = editor.val(); 
            editor.parent().html(value);
            $this._groupInfos[id].title = value;
            editor.remove();
          } 
         
        });
      } 
    });
    groupElement.find('.group-body').bind('dblclick',function(event){
      if ($this.editable) {
        event.preventDefault();
        if(groupElement.find('.group-body').find('.content_editor').length>0){
          return;
        }
        
        var editor=$('<textarea class="content_editor"></textarea>');
        editor.css("position","absolute");
        editor.css("z-index","9999");
        editor.css("left","0px");
        editor.css("top","0px");
        editor.css("width","100%");
        editor.css("height","100%");
        editor.css("box-sizing","border-box");

        editor.val(groupElement.find('.group-body').html());
        groupElement.find('.group-body').append(editor);

        editor.focus();
        editor.on("blur",function(e){
          var value = editor.val(); 
          editor.parent().html(value);
          $this._groupInfos[id].des = value;
          editor.remove();
        });

      } 
    });

    
    //group event
    groupElement.find('.group-resize').mousedown(function (e) {
      $('#' + $this.containerId).css('cursor', 'nwse-resize');
     
      var group_main = groupElement.find(".group-master");
      var x1 = e.pageX;
      var y1 = e.pageY;
      
      
      var width = group_main.width();
      var height = group_main.height();

      $('#' + $this.containerId).mousemove(function (e) {
        var x2 = e.pageX;
        var y2 = e.pageY;

        var w = width + (x2 - x1);
        var h = height + (y2 - y1);
        group_main.css({
          width: w,
          height: h,
        });
        groupElement.attr('width', w);
        groupElement.attr('height', h);
 
        $this._plumb.repaintEverything();

        $this._onCanvasChanged();

        e.preventDefault();
      });
      e.preventDefault();
    }); 
    
    $this._onCanvasChanged();

  }, //end createGroup

  //添加列表
  _createList: function(list){
    var $this = this;

    var meta = this.getMetadata(name) || {};

    var listElement = $('#' + $this.containerId+ ' #' + list.id);
    if(!listElement || !listElement.length || listElement.length<=0){
      var html='<div id="'+list.id+'" class="list list-container">';
      html+='<div class="list-remove-btn">X</div>';
      html+='<div class="list-resize"></div>';
      html+='<div class="list-main">';//begin main
      html+='<div class="list-header"></div>';
      html+='<div class="list-body"></div>';
      html+='</div>'; //end main 
      html+='</div>'; //end list 
      listElement = $(html);

      var canvasElement = $('#' + $this.containerId + ' #canvas');
      canvasElement.append(listElement);
      
    }


    $this.setListInfo(list);

   
   
    //event
    listElement.bind('mouseup', function () {
      $this._onCanvasChanged();
    });
    listElement.find('.list-remove-btn').bind('click', function () {
      var sure = confirm('确定删除?');
      if (sure) {
        $this.removeList(id);
      }  
    });
    
    //resize
    var list_main = listElement.find(".list-main");
    listElement.find('.list-resize').mousedown(function (e) {
      $('#' + $this.containerId).css('cursor', 'nwse-resize'); 
      var x1 = e.pageX;
      var y1 = e.pageY;
      var width = list_main.width();
      var height = list_main.height();

      $('#' + $this.containerId).mousemove(function (e) {
        var x2 = e.pageX;
        var y2 = e.pageY;

        var w = width + (x2 - x1);
        var h = height + (y2 - y1);
        list_main.css({
          width: w,
          height: h,
        });
        listElement.attr('width', w);
        listElement.attr('height', h);
 
        $this._plumb.repaintEverything();

        $this._onCanvasChanged();

        e.preventDefault();
      });
      e.preventDefault();
    }); 

    listElement.find('.list-header').bind('dblclick',function(event){
     
      if ($this.editable) {
        event.preventDefault();
        if(listElement.find('.list-header').find('.content_editor').length>0){
          return;
        }

        let editor=$('<input class="content_editor"  />');
        editor.css("position","absolute");
        editor.css("z-index","9999");
        editor.css("left","0px");
        editor.css("top","0px");
        editor.css("width","100%");
        editor.css("height","100%");
        editor.css("box-sizing","border-box");
        editor.val(listElement.find('.list-header').html());
        listElement.find('.list-header').append(editor);

        editor.focus();
        editor.on("blur",function(e){ 
          var value = editor.val(); 
          editor.parent().html(value);
          $this._listInfos[id].title = value;
          editor.remove();
          $this._onCanvasChanged();
        });
        editor.on("keydown",function(e){ 
          if(e.code=="Enter"){
            var value = editor.val(); 
            editor.parent().html(value);
            $this._listInfos[id].title = value;
            editor.remove();
            $this._onCanvasChanged();
          } 
         
        });
      } 
    });
    listElement.find('.list-body').bind('dblclick',function(event){
      
      if ($this.editable) {
        event.preventDefault();
        if(listElement.find('.list-body').find('.content_editor').length>0){
          return;
        }
         
        let editor=$('<textarea></textarea>');
        editor.addClass("content_editor");
        editor.css("position","absolute");
        editor.css("z-index","9999");
        editor.css("left","0px");
        editor.css("top","0px");
        editor.css("width","100%");
        editor.css("height","100%");
        editor.css("box-sizing","border-box");
         
        var items = $this._listInfos[id].items;
        var rows = '';
        if(items && items.length>0){
          for(var i in items){  
            rows += items[i].title+'\n';
          } 
        }
        editor.val(rows);
       
        listElement.find('.list-body').append(editor);
       
        editor.focus();
        editor.on("blur",function(e){
          
          var value = $(this).val(); 
          $(this).remove();
          var rows = value.split("\n");
 
          var items = [];
          for(var i in rows){
            var itemid = 'list_item_'+id+'_'+i;
            var title=rows[i];
            if(title==null || title.trim()==""){
              continue;
            }
            var item = {id: itemid, title:rows[i]};
            items.push(item);
          }
          $this._setListItems(id, items);
         
          $this._onCanvasChanged();
         
        });

      } 
    });

    $this._plumb.draggable(listElement.get(0),{
      stop:function(event){
        if($this.drag_step>1){
          x = Math.round(event.pos[0]/$this.drag_step) * $this.drag_step;
          y = Math.round(event.pos[1]/$this.drag_step) * $this.drag_step; 
          $(event.el).css("left",x+"px");
          $(event.el).css("top",y+"px");
        }
      }
    });
 
    $this._plumb.addList(listElement.get(0), {
      endpoint:["Rectangle", {width:20, height:20}]
    });
 
    
    $this._onCanvasChanged();
  }, //end createList

  _setListItems: function(listid, items){
    var $this = this;
     
    if($("#"+listid).find(".list-item").length>0){  
      var tobe_dels = [];
      $("#"+listid).find(".list-item").each(function(index, el){
         
        let el_id = $(el).attr("id");
        let exist = false;
        for(var i in items){ 
          if(el_id==items[i].id){
            exist=true;
          } 
        }
        if(!exist){
          tobe_dels.push($(el)); 
        }
      });

      for(var i in tobe_dels){
        
        let el_id = tobe_dels[i].attr("id"); 
        $this.removeLinkBySource(el_id);
        $this.removeLinkByTarget(el_id); 
        $this._plumb.remove(tobe_dels[i].get(0));
        tobe_dels[i].remove();
      }

    }

    for(var i in items){ 
      var item = items[i];
      if(item.id==null || item.title==null || item.title==''){
        continue;
      }
      var id=item.id;

      var itemEl = $("#"+listid).find(".list-body").find("#"+id);

      if(itemEl.length==0){
        itemEl = $('<div id="'+id+'" class="list-item"><div class="list-item-title"></div></div>');
        $("#"+listid).find(".list-body").append(itemEl); 
        var item_dom = itemEl.get(0);
        $this._plumb.makeSource(item_dom, {
          allowLoopback: false,
          anchor: ["Left", "Right" ]
        });
        $this._plumb.makeTarget(item_dom, {
          allowLoopback: false,
          anchor: ["Left", "Right" ]
        }); 
      }
      itemEl.find(".list-item-title").html(item.title||'');
      
      if(item.item_color){
        itemEl.css("background-color",item.item_color);
      }
      if(item.item_text_color){
        itemEl.find(".list-item-title").css("color",item.item_text_color);
      }
      if(item.style){
         
        for(var n in item.style){ 
          itemEl.css(n,item.style[n]);
        } 
      }

    }  
    
  },

  _deleteListItem: function(listid, itemid){
    var $this = this;

    for(var j in $this._listInfos[listid].items){
      if($this._listInfos[listid].items[j].id==itemid){
        $this._listInfos[listid].items[j]=null;
      }
    }

  },
  _getBase64Image: function(img) {
    try{
      var canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      var ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, img.width, img.height);
      var dataURL = canvas.toDataURL("image/png");
      return dataURL;
    }catch(e){
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
     
    var actionElement = $('#'+this.containerId + ' #' + action.id);
    if(actionElement==0 || !actionElement.length || actionElement.length<=0){
    
      var actionHtml ='<div id="' + id + '"  draggable="true" ondragend="" class="action-container"><div  class="action" ></div></div>'; 

      actionElement = $(actionHtml); 

      //main
      var action_main_dom = '<div class="action-main action-master" >';
      action_main_dom += '<div class="action-icon"  ><img src=""  ></div>'; 
      action_main_dom += '<div class="action-header"></div>'; //标题  
      action_main_dom += '<div class="action-body" >';
      action_main_dom += '<div class="action-content" ></div>'; //消息内容,html,chart
      action_main_dom += '<div class="body-resize"></div>'; //改变Body内容大小的三角形框
      action_main_dom += '</div>'; 
      action_main_dom += '</div>'; //end action-main

      var render = action.render || action_meta.render || $this.render_action;

      if(render){
        var r = render(action_meta, action, action_main_dom);
        if (r && r.length > 0) {
          action_main_dom = r;
        }
      }
      var action_main_el = $(action_main_dom);
      action_main_el.addClass("action-master"); 
      actionElement.find(".action").append(action_main_el);

      //ep
      var ep = '<div class="ep" title="拖拉连线">→</div>'; //拖拉连线焦点
      if ($this.render_endpoint) {
        var epr = $this.render_endpoint(action_meta, action, ep);
        if (epr && epr.length > 0) {
          ep = epr;
        }
      }
      var epElement = $(ep); 
      epElement.removeClass('ep');
      epElement.addClass('ep');
      actionElement.append(epElement);
      
      //resizer
      var resizer = '<div class="action-resize"></div>'; //改变大小的三角形框
      if ($this.render_btn_resize) {
        var resizer_new = $this.render_btn_resize(action_meta, action, resizer);
        if (resizer_new && resizer_new.length > 0) {
          resizer = resizer_new;
        }
      }

      var resizerElement = $(resizer);
      resizerElement.removeClass('action-resize');
      resizerElement.addClass('action-resize'); 
      actionElement.find(".action").append(resizerElement);

      //remove button 
      var removeBtn = '<a href="javascript:void(0)" class="action-remove-btn"  >X</a>'; //工具栏
      if ($this.render_btn_remove) {
        var removeBtn_new = $this.render_btn_remove(action_meta, action, removeBtn);
        if (removeBtn_new && removeBtn_new.length > 0) {
          removeBtn = removeBtn_new;
        }
      }
      var removeBtnElement = $(removeBtn);
      removeBtnElement.removeClass('action-remove-btn');
      removeBtnElement.addClass('action-remove-btn');

      actionElement.find(".action").append(removeBtnElement);
  
      var canvasElement = $('#' + $this.containerId + ' #canvas');
      canvasElement.append(actionElement);
    }
   
    this.setActionInfo(action);
 
    
    //事件
    //image load
    actionElement.find(".action-icon img").bind('load',function(){ 
      var d =  $(this).attr("src");
      if(d.indexOf("data:image/")<0){
        var data = $this._getBase64Image(this);
        if(data!=null){
          this.src=data;
        }  
      } 
    });
    //mouseup
    actionElement.bind('mouseup', function () {
      $this._onCanvasChanged();
    });

    actionElement.find('.action-remove-btn').bind('click', function () {
      var sure = confirm('确定删除该节点?');
      if (sure) {
        $this.removeAction(id);
      }
    });

    //双击打开配置事件,在设计模式和步进模式下才可以用
    actionElement.bind('click', function (event) {
      if ($this.editable) {
        if ($this.event_action_click && $this.event_action_dblclick) {
          $this._timer_action && clearTimeout($this._timer_action);
          $this._timer_action = setTimeout(function () {
            $this.event_action_click(action_meta, action);
          }, 300);
        } else if ($this.event_action_click) {
          $this.event_action_click(action_meta, action);
        }
      }
    });

    actionElement.bind('dblclick', function (event) {
      if ($this.editable) {
        if ($this.event_action_dblclick) {
          $this._timer_action && clearTimeout($this._timer_action);

          $this.event_action_dblclick(action_meta, action);
        }
      }
    });

    actionElement.bind('mouseover', function (e) {
      if (name != 'end') {
        $(this).find('.ep').show();
      }
    });

    actionElement.bind('mouseout', function (e) {
      $(this).find('.ep').hide();
    });

    //改变大小事件，鼠标按下去
    actionElement.find('.action-resize').mousedown(function (e) {
      $('#' + $this.containerId).css('cursor', 'nwse-resize');
      var divEl = $(this)[0];
      var x1 = e.pageX;
      var y1 = e.pageY;
      var width = $('#' + id).find(".action-master").width();
      var height = $('#' + id).find(".action-master").height();

      $('#' + $this.containerId).mousemove(function (e) {
        var x2 = e.pageX;
        var y2 = e.pageY;

        var w = width + (x2 - x1);
        var h = height + (y2 - y1);

        var mw=$('#' + id).find(".action-master").css("min-width").replace("px","")*1;
        var mh=$('#' + id).find(".action-master").css("min-height").replace("px","")*1;
         
        if(mw==null || w>mw){
          $('#' + id).find(".action-master").css({
            width: w+"px"
          });
   
          $('#' + id).css({
            width: w+"px"
          }); 
        }
        if(mh==null || h>mh){
          $('#' + id).find(".action-master").css({ 
            height: h+"px"
          });
   
          $('#' + id).css({
            height: h+"px"
          }); 
        }
 

        var chart = $this._actionCharts[id];
        if (chart != null) {
          var pw = $('#chart_' + id)
            .parent()
            .width();
          var ph = $('#chart_' + id)
            .parent()
            .height();
          $('#chart_' + id).css({
            width: pw,
            height: ph,
          });
          chart.resize();
        }
        $this._plumb.repaintEverything();

        $this._onCanvasChanged();

        e.preventDefault();
      });
      e.preventDefault();
    });

    //改变Body大小事件，鼠标按下去
    actionElement.find('.body-resize').mousedown(function (e) {
      $('#' + $this.containerId).css('cursor', 'nwse-resize');
      var divEl = $(this)[0];
      var x1 = e.pageX;
      var y1 = e.pageY;
      var width = $('#' + id)
        .find('.action-body')
        .width();
      var height = $('#' + id)
        .find('.action-body')
        .height();

      $('#' + $this.containerId).mousemove(function (e) {
        var x2 = e.pageX;
        var y2 = e.pageY;

        var w = width + (x2 - x1);
        var h = height + (y2 - y1);
        $('#' + id)
          .find('.action-body')
          .css({
            width: w,
            height: h,
          });
        $('#' + id).attr('body_width', w);
        $('#' + id).attr('body_height', h);

        //刷新图表
        var chart = $this._actionCharts[id];
        if (chart != null) {
          var pw = $('#chart_' + id)
            .parent()
            .width();
          var ph = $('#chart_' + id)
            .parent()
            .height();
          $('#chart_' + id).css({
            width: pw,
            height: ph,
          });
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
    this._plumb.draggable(el.get(0),{ 
      stop:function(event){
        if($this.drag_step>1){
          x = Math.round(event.pos[0]/$this.drag_step) * $this.drag_step;
          y = Math.round(event.pos[1]/$this.drag_step) * $this.drag_step; 
          $(event.el).css("left",x+"px");
          $(event.el).css("top",y+"px");
        }
      }
    });
 

    if (name == null || name != 'end') {
      this._plumb.makeSource(el.get(0), {
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
      this._plumb.makeTarget(el.get(0), {
        dropOptions: { hoverClass: 'dragHover' },
        anchor: 'Continuous', 
        allowLoopback: true,
      });
    }
  },

  _createTip: function(tip){
    var $this= this;
     
    

    var id = tip.id;
    var name = tip.name;

    var tip_meta = this.getMetadata(name) || {};

    var tipElement = $('#'+this.containerId + ' #' + tip.id);
    if(tipElement==0 || !tipElement.length || tipElement.length<=0){
      var html='<div id="'+tip.id+'" class="tip tip-container">';
      html+='<div class="tip-remove-btn">X</div>';
      html+='<div class="tip-resize"></div>'; 
      html+='</div>'; 
      tipElement = $(html);

      //main
      var tip_main_dom = '<div class="tip-main"><div class="tip-header"></div><div class="tip-body"></div></div>';

      //render
      if(tip.render){
        var r = tip.render(tip_meta, tip, tip_main_dom);
        if (r && r.length > 0) {
          tip_main_dom = r;
        }
      }else if(tip_meta.render){
        var r = tip_meta.render(tip_meta, tip, tip_main_dom);
        if (r && r.length > 0) {
          tip_main_dom = r;
        }
      }else if ($this.render_tip) {
        var r = $this.render_tip(tip_meta, tip, tip_main_dom);
        if (r && r.length > 0) {
          tip_main_dom = r;
        }
      }
      tip_main_element = $(tip_main_dom);
      tip_main_element.addClass("tip-master");
      tipElement.append(tip_main_element);
  
      //endpoint
      var ep = '<div class="tip-ep" title="拖拉连线">→</div>'; //拖拉连线焦点
      if ($this.render_endpoint) {
        var epr = $this.render_endpoint(action_meta, tip, ep);
        if (epr && epr.length > 0) {
          ep = epr;
        }
      }
      var epElement = $(ep);
      epElement.removeClass('tip-ep');
      epElement.addClass('tip-ep');
      tipElement.append(epElement);


      var canvasElement = $('#' + $this.containerId + ' #canvas');
      canvasElement.append(tipElement); 
  
    }

    $this.setTipInfo(tip);
   
   
    //draggable
    this._plumb.getContainer().appendChild(tipElement.get(0));
    // initialise draggable elements.
    this._plumb.draggable(tipElement.get(0),{
      stop:function(event){
        if($this.drag_step>1){
          x = Math.round(event.pos[0]/$this.drag_step) * $this.drag_step;
          y = Math.round(event.pos[1]/$this.drag_step) * $this.drag_step; 
          $(event.el).css("left",x+"px");
          $(event.el).css("top",y+"px");
        }
      }
    });
    //source
    $this._plumb.makeSource(tipElement.get(0), {
      filter: '.tip-ep', 
      anchor: 'Continuous'
    });

    //target
    $this._plumb.makeTarget(tipElement.get(0), {
      dropOptions: { hoverClass: 'dragHover' },
      anchor: 'Continuous', 
      allowLoopback: true,
    });

    //event
    tipElement.bind('mouseup', function () {
      $this._onCanvasChanged();
    });
    tipElement.find('.tip-remove-btn').bind('click', function () {
      var sure = confirm('确定删除?');
      if (sure) {
        $this.removeTip(id);
      }  
    });
 
    tipElement.find('.tip-header').bind('dblclick',function(event){
      if ($this.editable) {
        if(tipElement.find('.tip-header').find('.content_editor').length>0){
          return;
        }
         
        var editor=$('<input class="content_editor" />');
        editor.css("position","absolute");
        editor.css("z-index","9999");
        editor.css("left","0px");
        editor.css("top","0px");
        editor.css("width","100%");
        editor.css("height","100%");
        editor.css("box-sizing","border-box");
        editor.val(tipElement.find('.tip-header').html());
        tipElement.find('.tip-header').append(editor);

        editor.focus();
        editor.on("blur",function(e){ 
          var value = editor.val(); 
          editor.parent().html(value);
          $this._tipInfos[id].title = value;
          editor.remove();
          $this._onCanvasChanged();
        });
        editor.on("keydown",function(e){ 
          if(e.code=="Enter"){ 
            var value = editor.val(); 
            editor.parent().html(value);
            $this._tipInfos[id].title = value;
            editor.remove();
            $this._onCanvasChanged();
          } 
         
        });
      } 
    });
    tipElement.find('.tip-body').bind('dblclick',function(event){
      if ($this.editable) {
        if(tipElement.find('.tip-body').find('.content_editor').length>0){
          return;
        }
        var editor=$('<textarea class="content_editor"></textarea>');
        editor.css("position","absolute");
        editor.css("z-index","9999");
        editor.css("left","0px");
        editor.css("top","0px");
        editor.css("width","100%");
        editor.css("height","100%");
        editor.css("box-sizing","border-box");
       
        var content = $this._tipInfos[id].content;
       
        editor.val(content);

        tipElement.find('.tip-body').append(editor);

        editor.focus();
        editor.on("blur",function(e){
          var value = editor.val();  
          $this._tipInfos[id].content = value; 
          value = value.replaceAll("\n","<br/>"); 
          editor.parent().html(value); 
          editor.remove();
          $this._onCanvasChanged();
        });

      } 
    });

   

    //event
    tipElement.find('.tip-resize').mousedown(function (e) {
      $('#' + $this.containerId).css('cursor', 'nwse-resize');
     
      var tip_main = tipElement.find(".tip-master");
      var x1 = e.pageX;
      var y1 = e.pageY;
      
      
      var width = tip_main.width();
      var height = tip_main.height();

      $('#' + $this.containerId).mousemove(function (e) {
        var x2 = e.pageX;
        var y2 = e.pageY;

        var w = width + (x2 - x1);
        var h = height + (y2 - y1);
        tip_main.css({
          width: w,
          height: h,
        });
        tipElement.attr('width', w);
        tipElement.attr('height', h);
 
        $this._plumb.repaintEverything();

        $this._onCanvasChanged();

        e.preventDefault();
      });
      e.preventDefault();
    }); 
 
  }, //end createTip
  //缩略图
  _showThumbnail: function () {
    var $this = this;

    if (
      $('#' + this.containerId)
        .find('.flow_thumbnail')
        .is(':hidden')
    ) {
      return;
    }
    //视觉框
    var canvas = $('#' + $this.containerId).find(".canvas");
    var canvasView = $('#' + $this.containerId).find(".canvas").parent();
    var thumbnail=$('#' + $this.containerId).find('.flow_thumbnail');
 
    var full_width = canvas.width(); 
    var full_height = canvas.height();
    var canvas_width = canvasView.width();
    var canvas_height = canvasView.height();

    var scale = thumbnail.width()*1.0/full_width*1.0;
    $('#' + $this.containerId).find('.flow_thumbnail').height(scale*full_height);

    var mask_w=(canvas_width * scale)+"px"; 
    var mask_h=(canvas_height * scale)+"px";
    var mask_l = (canvasView.scrollLeft() * scale)+"px";
    var mask_t = (canvasView.scrollTop() * scale)+"px";
    
    $('#' + $this.containerId).find('.flow_thumbnail_mask').css("width",mask_w);
    $('#' + $this.containerId).find('.flow_thumbnail_mask').css("height",mask_h);
    $('#' + $this.containerId).find('.flow_thumbnail_mask').css("left",mask_l);
    $('#' + $this.containerId).find('.flow_thumbnail_mask').css("top",mask_t);
    

    //缩略图
    $this._timer_thumbnail && clearTimeout($this._timer_thumbnail);
    $this._timer_thumbnail = setTimeout(function () {
      
      $this.getSnapshot(
        function (canvas) {
          try { 
            
            var url = canvas.toDataURL('image/png'); //生成下载的url
            
            $('#' + $this.containerId)
              .find('.flow_thumbnail')
              .css('background-image', 'url(' + url + ')');

          } catch (e) {
             console.error(e);
          }  
        },
        { scale: 0.5, backgroundColor: 'transparent' ,ignore_svg: true},
      );
    }, 10);


  },
  _resizeCanvas: function(){
    //调整canvas大小
    var maxWidth=0;
    var maxHeight=0;
    $('#' + this.containerId).find(".canvas").find("div").each(function(index,e){
      let left = $(e).position().left;
      let width = $(e).width(); 
      let top = $(e).position().top;
      let height = $(e).height(); 
      if(left + width>maxWidth){
        maxWidth=left + width;
      } 
      if(top + height>maxHeight){
        maxHeight=top + height;
      } 
    });
  
    $('#' + this.containerId).find(".canvas").width(maxWidth);
    $('#' + this.containerId).find(".canvas").height(maxHeight);
    
  },
  _onCanvasChanged: function () {
    var $this = this;
    setTimeout(function(){
      //显示缩略图
      $this._showThumbnail(); 
      //调整画布大晓 
      $this._resizeCanvas(); 
      if ($this.event_canvas_changed) {
        $this.event_canvas_changed();
      }
    },50);
   
    
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
 
  _isGroup: function(id){
    var gs = this._plumb.getGroups();
    for(var i in gs){
      if(gs[i].id==id){
        return true;
      }
    }
    return false;
  },
  //画连接线基础样式 
  _paintConnection: function (conn, link) {
    if (link == null) {
      link == {};
    }

    var linktype = link.link_type || this.flowModel.link_type || 'Flowchart';

    //如果与tip连线
    var istip = link.source_id.indexOf("tip_")>=0 || link.target_id.indexOf("tip_")>=0  ; 
    //如果是与group连接的线
    var isgroup = this._isGroup(link.source_id) || this._isGroup(link.target_id) ;
    var islist = link.source_id.indexOf("list_")>=0 || link.target_id.indexOf("list_")>=0  ; 

    var style = link.lineStyle || 'solid';  //solid、dotted 
    var active = link.active || 'true'; 
    var ps = link.paintStyle;
    var hps = link.hoverPaintStyle;
     

    //连线样式
    var paintStyle = { 
      stroke:  this._themeObj.default_link_color,
      radius: this._themeObj.default_link_radius,
      strokeWidth: this._themeObj.default_link_strokeWidth,
      outlineStroke: 'transparent',
      outlineWidth: this._themeObj.default_link_outlineWidth,
    };
    $.extend(paintStyle, ps);
   

    var hoverPaintStyle ={ 
      stroke: this._themeObj.default_link_color_hover,
      radius: this._themeObj.default_link_radius_hover,
      strokeWidth: this._themeObj.default_link_strokeWidth_hover,
      outlineStroke: 'transparent',
      outlineWidth: this._themeObj.default_link_outlineWidth_hover,
    };
    $.extend(hoverPaintStyle, hps);
    
   
    if( style == 'dotted' || (active != null && active == 'false')) {
      paintStyle.dashstyle = '2 1';
      hoverPaintStyle.dashstyle = '2 1';
    } else {
      paintStyle.dashstyle = '1 0';
      hoverPaintStyle.dashstyle = '1 0';
    }
    
 
    //线条样式 
    if(istip){ 
      paintStyle.stroke = this._themeObj.default_link_color_t;
      paintStyle.radius = this._themeObj.default_link_radius_t;
      paintStyle.strokeWidth = this._themeObj.default_link_strokeWidth_t;
      paintStyle.outlineStroke = 'transparent';
      paintStyle.outlineWidth = this._themeObj.default_link_outlineWidth_t;
 
      hoverPaintStyle.stroke = this._themeObj.default_link_color_t_hover;
      hoverPaintStyle.radius = this._themeObj.default_link_radius_t_hover;
      hoverPaintStyle.strokeWidth =  this._themeObj.default_link_strokeWidth_t_hover;
      hoverPaintStyle.outlineStroke = 'transparent';
      hoverPaintStyle.outlineWidth = this._themeObj.default_link_outlineWidth_t_hover;
      
      paintStyle.dashstyle = '5 3';
      hoverPaintStyle.dashstyle = '5 3';
      
     
    }else if(isgroup){
       
      paintStyle.stroke = this._themeObj.default_link_color_g;
      paintStyle.radius = this._themeObj.default_link_radius_g;
      paintStyle.strokeWidth = this._themeObj.default_link_strokeWidth_g;
      paintStyle.outlineStroke = 'transparent';
      paintStyle.outlineWidth = this._themeObj.default_link_outlineWidth_g;
 
      hoverPaintStyle.stroke = this._themeObj.default_link_color_g_hover;
      hoverPaintStyle.radius = this._themeObj.default_link_radius_g_hover;
      hoverPaintStyle.strokeWidth =  this._themeObj.default_link_strokeWidth_g_hover;
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

    
    if(link.source_id.indexOf("list_")>=0){
      conn.getOverlay('arrow_source').setVisible(false); 
      conn.getOverlay('label_source').setVisible(true);  
    }
    if(link.target_id.indexOf("list_")>=0){
      conn.getOverlay('arrow_target').setVisible(false); 
      conn.getOverlay('label_target').setVisible(true); 
    }

    if(link.arrows && link.arrows.length>0){
      if(link.arrows[0]){
        conn.getOverlay('arrow_source').setVisible(true);
      }else{
        conn.getOverlay('arrow_source').setVisible(false);
      }

      if(link.arrows.length>1 && link.arrows[1]){
        conn.getOverlay('arrow_middle').setVisible(true);
      }else{
        conn.getOverlay('arrow_middle').setVisible(false);
      }

      if(link.arrows.length>2 && link.arrows[2]){
        conn.getOverlay('arrow_target').setVisible(true); 
      }else{
        conn.getOverlay('arrow_target').setVisible(false);
      } 
    }
 
    
    //动画元素
    conn.getOverlay('animation').width = this._themeObj.default_link_strokeWidth_g * 2;
    conn.getOverlay('animation').length = this._themeObj.default_link_strokeWidth_g * 2;
    conn.getOverlay('animation').setVisible(false);
   
    //连线文本信息
    var linkLabel = $('<div/>')
      .text(link.title || link.label || '')
      .html();
    conn.getOverlay('label').setVisible(linkLabel.length > 0);
    conn.getOverlay('label').setLabel(linkLabel);
    
    var linkLabelSource = $('<div/>')
    .text(link.label_source || '')
    .html();
    conn.getOverlay('label_source').setVisible(linkLabelSource.length > 0);
    conn.getOverlay('label_source').setLabel(linkLabelSource);
    
    var linkLabelTarget = $('<div/>')
    .text(link.label_target || '')
    .html();
   
    conn.getOverlay('label_target').setVisible(linkLabelTarget.length > 0);
    conn.getOverlay('label_target').setLabel(linkLabelTarget);
 

    //删除按钮 
    if(link.show_remove || islist){
      conn.getOverlay('label_remove').setVisible(true); 
    }else{ 
      conn.getOverlay('label_remove').setVisible(false); 
    }

    //箭头
    if(istip){
      conn.getOverlay('arrow_source').setVisible(false);
      conn.getOverlay('arrow_middle').setVisible(false); 
      conn.getOverlay('arrow_target').setVisible(false); 
        
    }else if(isgroup){ 
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

    $.extend(instance, option);

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
    if(this._plumb){
      this._plumb.repaintEverything();
    }
    
  },

  setTheme: function (theme) {

    this.flowModel.theme = theme || this.flowModel.theme || 'flow_theme_default';
    this._themeObj = flow_themes[this.flowModel.theme];
   
    for (var k in flow_themes) {
      $('#' + this.containerId)
        .find('.andflow')
        .removeClass(k);
    }
    $('#' + this.containerId)
      .find('.andflow')
      .addClass(this.flowModel.theme);
    
    if(this._plumb){
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
    return this._actionInfos[id];
  },
  setActionInfo: function (action) { 
    this._actionInfos[action.id] = action; 
    //渲染
    this.renderAction(action);
  },
  renderAction: function (action) { 
    var $this = this;
    var actionElement = $('#'+this.containerId + ' #' + action.id);
    if(actionElement==0 || !actionElement.length || actionElement.length<=0){
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

    var title =  action.title || action.des || action_meta.title || action_meta.des || '';
    
    var icon = action.icon || action_meta.icon || '';
    var des = action.des || action_meta.des || '';
    var css = action.css || action_meta.css || '';

    var border_color = action.border_color ;
    var header_color = action.header_color;
    var header_text_color=action.header_text_color;
    var body_color = action.body_color;
    var body_text_color = action.body_text_color;

    var actionThemeName = action.theme || action_meta.theme  || '';
 
    var action_themeObj = action_themes[actionThemeName||''] || this._themeObj;

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
    actionElement.find('.action').addClass(css); 
    actionElement.find('.action').attr("title",title);
    actionElement.find('.action').attr("name",name);
    actionElement.find('.action').attr("icon",icon);

    //样式 
    for (var k in action_themes) { 
      actionElement.removeClass(k);
    }   
    actionElement.addClass(actionThemeName||""); 
    
    //图标
    var iconImgPath = '';
    if(icon && icon.length > 0 && icon.indexOf("base64")>=0) {
      iconImgPath = icon;
    } else if (icon && icon.length > 0) {
      iconImgPath = ($this.img_path || '') + icon;
    } else {
      iconImgPath = ($this.img_path || '') + 'node.png'; 
    }
    
    actionElement.find('.action-icon img').attr("src",iconImgPath);
    actionElement.find('.action-header').html(title);
    actionElement.find('.action-header').html(title);
    var bodystyle = '';
    if (this.flowModel.show_action_body == 'false') {
      bodystyle = 'style="visibility: hidden"';
    }
    actionElement.find('.action-body').addClass(bodystyle);

    var contentstyle = '';
    if (this.flowModel.show_action_content == 'false') {
      contentstyle = 'style="visibility: hidden"';
    }
    actionElement.find('.action-content').addClass(contentstyle);

    //color
    if(border_color){
      actionElement.get(0).style.setProperty("--action-border-color", border_color);
    }
    if(header_color){
      actionElement.get(0).style.setProperty("--action-header-color", header_color);
    }
    if(header_text_color){
      actionElement.get(0).style.setProperty("--action-header-text-color", header_text_color);
    }
    if(body_color){
      actionElement.get(0).style.setProperty("--action-body-color", body_color);
    }
    if(body_text_color){
      actionElement.get(0).style.setProperty("--action-body-text-color", body_text_color);
    }

 
    //content
    if(content){
      if(typeof content === 'string'){
        content={ content_type: "msg", content: content};
      } 

      this.setActionContent(action.id, content.content ||'',content.content_type ||'msg' );
    }  

    
    //position
    actionElement.css('position', 'absolute').css('left', left).css('top', top);
    
    //size
    if (width && width.length > 0) {
      actionElement.css("width",width);
      actionElement.find(".action-master").css('width', width);
    }
    if (height && height.length > 0) {
      actionElement.css("height",height);
      actionElement.find(".action-master").css('height', height);
    }

    //body
    if (body_width && body_width.length > 0) {
      actionElement.attr('body_width', body_width);
      actionElement.find('.action-body').css('width', body_width);
    } else {
      actionElement.find('.action-body').css('width', '');
    }
    if (body_height && body_height.length > 0) {
      actionElement.attr('body_height', body_height);
      actionElement.find('.action-body').css('height', body_height);
    } else {
      actionElement.find('.action-body').css('height', '');
    }
  },
  
  delActionInfo: function (id) {
    this._actionInfos[id] = null;
  },
  setActionParam:function(actionId,key,value){
    if(this._actionInfos && this._actionInfos[actionId]){
      if(!this._actionInfos[actionId].params){
        this._actionInfos[actionId].params={};
      }
      this._actionInfos[actionId].params[key]=value;
    } 
  },
  getActionParam:function(actionId,key){
    if(this._actionInfos && this._actionInfos[actionId]){
      if(this._actionInfos[actionId].params){
        return this._actionInfos[actionId].params[key];
      }
    } 
    return null;
  },
  setActionBorderColor: function(actionId, color){
    if(this._actionInfos && this._actionInfos[actionId]){
      this._actionInfos[actionId].border_color = color;
      this.renderAction(this._actionInfos[actionId]);
    } 
  },
  setActionHeaderColor: function(actionId, color){
    if(this._actionInfos && this._actionInfos[actionId]){
      this._actionInfos[actionId].header_color = color;
      this.renderAction(this._actionInfos[actionId]);
    }
  },
  setActionHeaderTextColor: function(actionId, color){
    if(this._actionInfos && this._actionInfos[actionId]){
      this._actionInfos[actionId].header_text_color = color;
      this.renderAction(this._actionInfos[actionId]);
    }
  },
  setActionBodyColor: function(actionId, color){
    if(this._actionInfos && this._actionInfos[actionId]){
      this._actionInfos[actionId].body_color = color;
      this.renderAction(this._actionInfos[actionId]);
    }
  },
  setActionBodyTextColor: function(actionId, color){
    if(this._actionInfos && this._actionInfos[actionId]){
      this._actionInfos[actionId].body_text_color = color;
      this.renderAction(this._actionInfos[actionId]);
    }
  },
  getGroupInfo: function(id){
    return this._groupInfos[id];
  },
  setGroupInfo: function(group){
    this._groupInfos[group.id] = group; 
    //渲染
    this.renderGroup(group);
  },
  renderGroup: function(group){
    var $this = this;
    var groupElement = $('#' + $this.containerId + ' #' +group.id);
    if(!groupElement || !groupElement.length || groupElement.length<=0){
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
      groupElement.removeClass(k);
    }    
    groupElement.addClass(theme);
   
    if(border_color){
      groupElement.get(0).style.setProperty("--group-border-color", border_color);
    }
    if(header_color){
      groupElement.get(0).style.setProperty("--group-header-color", header_color);
    }
    if(header_text_color){
      groupElement.get(0).style.setProperty("--group-header-text-color", header_text_color);
    }
    if(body_color){
      groupElement.get(0).style.setProperty("--group-body-color", body_color);
    }
    if(body_text_color){
      groupElement.get(0).style.setProperty("--group-body-text-color", body_text_color);
    }

    //title\body
    groupElement.find('.group-header').html(group.title || '');
    groupElement.find('.group-body').html(group.des || '');


    //位置
    var padding_top=30;
    var padding_left=10;
    var padding_right=10;
    var padding_bottom=10;

    //left
    if(group.left==null || group.left=="auto"){
      if(members.length>0){
        var minLeft = 9999999999999;
        
        for(var i in members){
          let l = $("#"+members[i]).offset().left - canvasElement.offset().left;
          if(minLeft>l){
            minLeft = l;
          }  
        }
        minLeft = minLeft - padding_left;
        groupElement.css("left",minLeft+"px");
      } 
    }else{
      if((group.left+"").indexOf("px")>=0){
        groupElement.css("left", group.left);
      }else{
        groupElement.css("left", group.left+"px");
      } 
    }

    //top
    if(group.top==null || group.top=="auto"){
      if(members.length>0){
        var minTop = 999999999;

        for(var i in members){
          let t = $("#"+members[i]).offset().top - canvasElement.offset().top;
          if(minTop>t){
            minTop = t;
          }  
        }
        minTop = minTop - padding_top;
        groupElement.css("top",minTop+"px");
      } 
    }else{ 
      if((group.top+"").indexOf("px")>=0){
        groupElement.css("top", group.top);
      }else{
        groupElement.css("top", group.top+"px");
      }
    }

    //width
    if( group.width==null || group.width=="auto"){
      if(members.length>0){
        var maxWidth = 0;

        for(var i in members){

          $("#"+members[i]).find("div").each(function(index,el){
            
            let w = $(el).offset().left+$(el).width();
            w = w - groupElement.position().left - canvasElement.offset().left;

            if(w > maxWidth){
              maxWidth = w;
            }
          }); 
        }
        maxWidth = maxWidth+padding_right;

        groupElement.find(".group-main").width(maxWidth);
      } 
    }else{
      if((group.width+"").indexOf("px")>=0){
        groupElement.find(".group-main").css("width", group.width);
      }else{
        groupElement.find(".group-main").css("width", group.width+"px"); 
      }  
    }

    //height
    if(group.height==null || group.height=="auto"){
      if(members.length>0){
        var maxHeight = 0;

        for(var i in members){

          $("#"+members[i]).find("div").each(function(index,el){
            
            let h = $(el).offset().top+$(el).height();
            h = h - groupElement.position().top - canvasElement.offset().top;

            if(h > maxHeight){
              maxHeight = h;
            }
          }); 
        }
        maxHeight = maxHeight+padding_bottom;

        groupElement.find(".group-main").height(maxHeight);
      } 
    }else{
      if((group.height+"").indexOf("px")>=0){
        groupElement.find(".group-main").css("height", group.height);
      }else{
        groupElement.find(".group-main").css("height", group.height+"px"); 
      }  
    }
 
  },
  getGroupTitle: function(id){
    var group = this._groupInfos[id];
    return group.title;
  },
  setGroupTitle: function(id,title){
    var group = this._groupInfos[id];
    if(group==null){
      return;
    }
    group.title = title;
    this._groupInfos[group.id] = group;
    var groupEl = $('#'+this.containerId + ' #'+group.id);
    groupEl.find('.group-header').html(group.title);
  },
  setGroupBorderColor: function(id, color){
    if(this._groupInfos[id]){
      this._groupInfos[id].border_color=color;
      this.renderGroup(this._groupInfos[id]);
    } 
  },
  setGroupHeaderColor: function(id, color){
    if(this._groupInfos[id]){
      this._groupInfos[id].header_color=color;
      this.renderGroup(this._groupInfos[id]);
    } 
  },
  setGroupHeaderTextColor: function(id, color){
    if(this._groupInfos[id]){
      this._groupInfos[id].header_text_color=color;
      this.renderGroup(this._groupInfos[id]);
    } 
  },
  setGroupBodyColor: function(id, color){
    if(this._groupInfos[id]){
      this._groupInfos[id].body_color=color;
      this.renderGroup(this._groupInfos[id]);
    } 
  },
  setGroupBodyTextColor: function(id, color){
    if(this._groupInfos[id]){
      this._groupInfos[id].body_text_color=color;
      this.renderGroup(this._groupInfos[id]);
    } 
  },
  getListInfo: function(id){
    return this._listInfos[id];
  },
  setListInfo: function(list){
    this._listInfos[list.id] = list; 
    this.renderList(list);
  },
  renderList: function(list){
    var $this = this;

    var listElement = $('#' + $this.containerId+ ' #' + list.id);
    if(!listElement || !listElement.length || listElement.length<=0){
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
      listElement.removeClass(k);
    }    
    listElement.addClass(theme);

    listElement.find(".list-header").html(list.title||'');
    
    if(border_color){
      listElement.get(0).style.setProperty("--list-border-color", border_color);
    }
    if(header_color){
      listElement.get(0).style.setProperty("--list-header-color", header_color);
    }
    if(header_text_color){
      listElement.get(0).style.setProperty("--list-header-text-color", header_text_color);
    }
    if(body_color){
      listElement.get(0).style.setProperty("--list-body-color", body_color);
    }
    if(body_text_color){
      listElement.get(0).style.setProperty("--list-body-text-color", body_text_color);
    }
    if(item_color){
      listElement.get(0).style.setProperty("--list-item-color", item_color);
    }
    if(item_text_color){
      listElement.get(0).style.setProperty("--list-item-text-color", item_text_color);
    }

    //width
    if(list.width!=undefined && list.width!=null){
      if((list.width+"").indexOf("px")>=0){
        listElement.find(".list-main").css("width", list.width);
      }else{
        listElement.find(".list-main").css("width", list.width+"px"); 
      }  
    }

    //height
    if(list.height!=undefined && list.height!=null){
      
      if((list.height+"").indexOf("px")>=0){
        listElement.find(".list-main").css("height", list.height);
      }else{
        listElement.find(".list-main").css("height", list.height+"px"); 
      }  
    }


    //top
    if((top+"").indexOf("px")>=0){
      listElement.css("top", top);
    }else{
      listElement.css("top", top+"px");
    }
    //left
    if((left+"").indexOf("px")>=0){
      listElement.css("left", left);
    }else{
      listElement.css("left", left+"px");
    }
    //items
    $this._setListItems(id,items); 
 
  },
  getListTitle: function(id){
    return (this._listInfos[id]||{}).title;
  },
  setListTitle: function(id, title){
    var list = this._listInfos[id];
    if(list==null){
      return;
    }
    list.title = title;
    this._listInfos[list.id] = list;
    var listEl = $('#'+this.containerId + ' #'+list.id);
    listEl.find('.list-header').html(list.title); 
  },
  getListItems: function(id){
    return (this._listInfos[id]||{}).items;
  },
  setListItems: function(id, items){
    var list = this._listInfos[id];
    if(list==null){
      return;
    }
    list.items = items;
    this._listInfos[id] = list;
    this._setListItems(id, items);
    this.refresh();
  },
  setListBorderColor: function(id, color){
    if(this._listInfos[id]){
      this._listInfos[id].border_color=color;
      this.renderList(this._listInfos[id]);
    }
  },
  setListHeaderColor: function(id, color){
    if(this._listInfos[id]){
      this._listInfos[id].header_color=color;
      this.renderList(this._listInfos[id]);
    }
  },
  setListHeaderTextColor: function(id, color){
    if(this._listInfos[id]){
      this._listInfos[id].header_text_color=color;
      this.renderList(this._listInfos[id]);
    }
  },
  setListBodyColor: function(id, color){
    if(this._listInfos[id]){
      this._listInfos[id].body_color=color;
      this.renderList(this._listInfos[id]);
    }
  },
  setListBodyTextColor: function(id, color){
    if(this._listInfos[id]){
      this._listInfos[id].body_text_color=color;
      this.renderList(this._listInfos[id]);
    }
  },
  setListItemColor: function(id, color){
    if(this._listInfos[id]){
      this._listInfos[id].item_color=color;
      this.renderList(this._listInfos[id]);
    }
  },
  setListItemTextColor: function(id, color){
    if(this._listInfos[id]){
      this._listInfos[id].item_text_color=color;
      this.renderList(this._listInfos[id]);
    }
  },
  getTipInfo: function(id){
    return this._tipInfos[id];
  },
  setTipInfo: function(tip){
    this._tipInfos[tip.id] = tip;
     //渲染
     this.renderTip(tip);
  },
  renderTip:function(tip){
    var tipElement = $('#'+this.containerId + ' #' + tip.id);
    if(tipElement==0 || !tipElement.length || tipElement.length<=0){
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
      tipElement.removeClass(k);
    }    
    tipElement.addClass(theme);

    //位置 
    //left
    if((tip.left+"").indexOf("px")>=0){
      tipElement.css("left", tip.left);
    }else{
      tipElement.css("left", tip.left+"px");
    } 
    //top
    if((tip.top+"").indexOf("px")>=0){
      tipElement.css("top", tip.top);
    }else{
      tipElement.css("top", tip.top+"px");
    }

    //width 
    if((tip.width+"").indexOf("px")>=0){ 
      tipElement.find(".tip-main").css("width", tip.width);
    }else{
      tipElement.find(".tip-main").css("width", tip.width+"px"); 
    }  
    

    //height 
    if((tip.height+"").indexOf("px")>=0){
      tipElement.find(".tip-main").css("height", tip.height);
    }else{
      tipElement.find(".tip-main").css("height", tip.height+"px"); 
    }  

    //color
    if(border_color){
      tipElement.get(0).style.setProperty("--tip-border-color",border_color);
    }
    if(header_color){
      tipElement.get(0).style.setProperty("--tip-header-color",header_color);
    }
    if(header_text_color){
      tipElement.get(0).style.setProperty("--tip-header-text-color",header_text_color);
    }
    if(body_color){
      tipElement.get(0).style.setProperty("--tip-body-color",body_color);
    }
    if(body_text_color){
      tipElement.get(0).style.setProperty("--tip-body-text-color",body_text_color);
    }

    if(content){
      content = content.replaceAll("\n","<br/>");
    }
    

    //title\body
    tipElement.find('.tip-header').html(tip.title || '');
    tipElement.find('.tip-body').html(content||'' );

  },
  getTipTitle: function(id){
    if(this._tipInfos[id]){ 
      return this._tipInfos[id].title; 
    }
    return null;
  },
  setTipTitle: function(id, title){
    if(this._tipInfos[id]){
      var tipElement = $('#'+this.containerId + ' #' + id); 
      this._tipInfos[id].title = title;
      tipElement.find('.tip-header').html(title || '');
    }
  },
  getTipContent: function(id){
    if(this._tipInfos[id]){ 
      return this._tipInfos[id].content; 
    }
    return null;
  },
  setTipContent: function(id, content){
    if(this._tipInfos[id]){
      var tipElement = $('#'+this.containerId + ' #' + id); 
      this._tipInfos[id].content = content;
      tipElement.find('.tip-body').html(content || '');
    }
  },
  setTipBorderColor: function(id, color){
    if(this._tipInfos[id]){
      var tipElement = $('#'+this.containerId + ' #' + id); 
      this._tipInfos[id].border_color = color;
      tipElement.get(0).style.setProperty("--tip-border-color",color);
    }
  },
  setTipBodyColor: function(id, color){
    if(this._tipInfos[id]){
      var tipElement = $('#'+this.containerId + ' #' + id); 
      this._tipInfos[id].body_color = color;
      tipElement.get(0).style.setProperty("--tip-body-color",color);
    }
  },
  setTipBodyTextColor: function(id, color){
    if(this._tipInfos[id]){
      var tipElement = $('#'+this.containerId + ' #' + id); 
      this._tipInfos[id].body_text_color = color;
      tipElement.get(0).style.setProperty("--tip-body-text-color",color);
    }
  },

  getLinkInfo: function (sid, tid) {
    return this._linkInfos[sid + '-' + tid] || {};
  },

  setLinkInfo: function (link) {
    var linkInfo = this._linkInfos[link.source_id + '-' + link.target_id];
    $.extend(linkInfo, link); 
    this._linkInfos[link.source_id + '-' + link.target_id] = linkInfo;

    this.renderLink(linkInfo);
  
  },
  renderLink: function(link){
    var conn = this.getConnection(link.source_id, link.target_id);
    
    if (conn != null) {
      
      this._paintConnection(conn, link);

      this._plumb.repaintEverything();
    }
  },
  delLinkInfo: function (sid, tid) {
    this._linkInfos[sid + '-' + tid] = null;
  },
  getLinkPaintStyle: function(source_id,target_id){
    var link = this._linkInfos[link.source_id + '-' + link.target_id] || {source_id:source_id, target_id:target_id};
    return  link.paintStyle ;
  },
  setLinkPaintStyle: function(source_id,target_id,paintStyle){
    var link = this._linkInfos[link.source_id + '-' + link.target_id] || {source_id:source_id, target_id:target_id};
    link.paintStyle = paintStyle;
    this.setLinkInfo(link);
  },
  setLinkTitle: function(source_id,target_id, title){
    var link = this._linkInfos[link.source_id + '-' + link.target_id] || {source_id:source_id, target_id:target_id};
    link.title = title;
    this.setLinkInfo(link);
  },
  getLinkTitle: function(source_id,target_id){
    var link = this._linkInfos[source_id + '-' + target_id] || {};
    return link.title;
  },
  setLinkLabel: function(source_id,target_id, title){
    this.setLinkTitle(source_id,target_id, title);
  },
  getLinkLabel: function(source_id,target_id){
    return this.sgtLinkTitle(source_id,target_id);
  },
  setLinkSourceLabel: function(source_id,target_id, label){
    var link = this._linkInfos[link.source_id + '-' + link.target_id] || {source_id:source_id, target_id:target_id};
    link.label_source = label;
    this.setLinkInfo(link);
  },
  getLinkSourceLabel: function(source_id,target_id){
    var link = this._linkInfos[source_id + '-' + target_id] || {};
    return link.label_source;
  },
  setLinkTargetLabel: function(source_id,target_id, label){
    var link = this._linkInfos[link.source_id + '-' + link.target_id] || {source_id:source_id, target_id:target_id};
    link.label_target = label;
    this.setLinkInfo(link);
  },
  getLinkTargetLabel: function(source_id,target_id){
    var link = this._linkInfos[source_id + '-' + target_id] || {};
    return link.label_target;
  },
 
  //删除组
  removeGroup: function(groupId, deleteMembers){
    var $this = this; 
    var group = $this._plumb.getGroup(groupId);
    var all = deleteMembers || $this._groupInfos[group.id].delete_all  || false;
    if(all!=true){
      all=false;
    } 
    group.getEl();
    $this._plumb.removeGroup(group,all);
  },
  //删除列表
  removeList: function(id){
    var $this = this;  
    var element = $("#"+$this.containerId+" #"+id);
    
    $this._plumb.remove(element);
    element.remove();
  },

  //删除Tip
  removeTip: function(id){
    var $this = this; 
    
    var element = $("#"+$this.containerId+" #"+id);
    
    $this._plumb.remove(element);
    element.remove();
  },
  //删除节点
  removeAction: function (actionId) {
    var $this = this;
    var element = $('#'+$this.containerId+' #canvas #' + actionId);

    if (element == null) {
      return;
    }

    //remove from group
    var groups = $this._plumb.getGroups();

    for(var i in groups){
      var ms = groups[i].getMembers();
      for(var j in ms){
        if( ms[j].id == actionId ){ 
          groups[i].remove(element.get(0),null,true);
        }
      } 
    }

    //remove from canvas
    $this._plumb.remove(element);
    $(element).remove();

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
    for(var i in conns){
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
    for(var i in conns){
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
      $('#' + this.containerId + ' .andflow').removeClass('state');
    } else {
      $('#' + this.containerId + ' .andflow').addClass('state');
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
    $('.action').parent().each(function (i, e) {
      $this._plumb.remove(e);
      $this._plumb.remove($(e).children());
      $(e).remove();
    });

    $('.group').each(function (i, e) {
      $this._plumb.remove(e);
      $(e).remove();
    });
    $('.tip').each(function (i, e) {
      $this._plumb.remove(e);
      $(e).remove();
    });
    
    $('.list-item').each(function (i, e) {
      $this._plumb.remove(e);
      $(e).remove();
    });

    //删除所有组，和成员节点
    this._plumb.removeAllGroups(true);
    

    //清空画布
    $('#canvas').html('');
    
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
    if(obj && obj.tips){
      for(var k in obj.tips){
        var tip = obj.tips[k]; 
        this._createTip(tip); 
      }
    }

    //建立列表
    if(obj && obj.lists){
      for(var l in obj.lists){
        var list = obj.lists[l]; 
        this._createList(list); 
      }
    }
 
    //建立组
    if (obj && obj.groups) {
      for(var g in obj.groups){
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
    $('#' + this.containerId)
      .find('.action')
      .removeClass('error');
    $('#' + this.containerId)
      .find('.action')
      .removeClass('execute');
    $('#' + this.containerId)
      .find('.action')
      .removeClass('reject');
    $('#' + this.containerId)
      .find('.action')
      .removeClass('success');
  },
  setActionSelected: function (actionId, selected) {
    if (actionId == null || actionId == '' || $('#' + actionId).length == 0) {
      return;
    }
    if (selected) {
      $('#' + actionId).find(".action").addClass('selected');
    } else {
      $('#' + actionId).find(".action").removeClass('selected');
    }
  },
  
  //设置节点图标
  setActionIcon: function (actionId, action_icon) {
    if (action_icon != null && action_icon.length > 0) {
      $('#' + actionId)
        .find('.action-icon img')
        .attr('src', this.img_path + action_icon);
    }
  },
  //设置节点样式状态
  setActionState: function (actionId, state) {
    if (actionId == null || actionId == '') {
      return;
    }

    var element = $('#' + this.containerId).find('#' + actionId).find('.action');

    if (state == null || state == '' || state == 0) {
      element.removeClass('error');
      element.removeClass('execute');
      element.removeClass('reject');
      element.removeClass('success');
      return;
    }
 
    
    if (state == -1 || state == 'error') {
      element.removeClass('error');
      element.removeClass('execute');
      element.removeClass('reject');
      element.removeClass('success');
      
      if (!element.hasClass('error')) {
        element.addClass('error');
      }
    } else if (state == 1 || state == 'success') {
      element.removeClass('error');
      element.removeClass('execute');
      element.removeClass('reject');
      element.removeClass('success');

      if (!element.hasClass('success')) {
        element.addClass('success');
      }
    } else if (state == 0 || state == 'reject') {
      element.removeClass('error');
      element.removeClass('execute');
      element.removeClass('reject');
      element.removeClass('success');

      if (!element.hasClass('reject')) {
        element.addClass('reject');
      }
    }
  },

  //设置节点状态样式
  setActionStates: function (action_states) {
    if (action_states == undefined || action_states == null) {
      action_states = this._action_states;
    }
    this._action_states = action_states;
    var elements = $('#' + this.containerId).find('.action');
    elements.removeClass('success');
    elements.removeClass('error');
    elements.removeClass('execute');

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
  getGroups: function(){
    var $this = this;

    var groups = [];
    var gs = this._plumb.getGroups();
    
    for(var i in gs){
      var item = gs[i];
      var id = item.id;
      var el = $(item.getEl());
      var ms = item.getMembers(); 
      var group = $this._groupInfos[id];
      //children
      group.members = [];
      for(var j in ms){
        let memberid = ms[j].id;  
        group.members.push(memberid);

      }

      if(group.left!="auto"){ 
        let left = el.css("left");
        group.left = left;
      }
      if(group.top!="auto"){ 
        let top = el.css("top");
        group.top = top;
      }
      if(group.width!="auto"){ 
        let w = el.css('width');
        group.width = w;
      }
      if(group.height!="auto"){ 
        let h = el.css('height');
        group.height = h;
      }
    
      groups.push(group);
    }


    return groups;
  },

  getLists: function(){
    var $this = this;

    var lists = [];
    $("#"+$this.containerId + " #canvas").find(".list").each(function( index, e ){ 

      var el = $(e);
      var id = el.attr("id");
      var item = $this._listInfos[id]||{id:el.attr("id"),left:"",top:"",width:"",height:""};
   
      let ingroup = el.parent().hasClass("group-container");

      if(ingroup){
        
        item.left = (el.position().left+el.parent().position().left)+"px";
        item.top = (el.position().top+ el.parent().position().top)+"px";
      }else{ 
        item.left = el.css("left"); 
        item.top = el.css("top"); 
      } 

      item.width = el.css('width'); 
      item.height = el.css('height');
      
      lists.push(item);
    });

    return lists;

  },


  getTips:function(){
    var $this = this;

    var tips = [];
    $("#"+$this.containerId + " #canvas").find(".tip").each(function( index, e ){ 

      var el = $(e);
      var id = el.attr("id");
      var item = $this._tipInfos[id]||{id:el.attr("id"),left:"",top:"",width:"",height:""};
   
      let ingroup = el.parent().hasClass("group-container");

      if(ingroup){
        
        item.left = (el.position().left+el.parent().position().left)+"px";
        item.top = (el.position().top+ el.parent().position().top)+"px";
      }else{ 
        item.left = el.css("left"); 
        item.top = el.css("top"); 
      } 

      item.width = el.css('width'); 
      item.height = el.css('height');
      
      tips.push(item);
    });

    return tips;

  },

  //获取Action节点
  getActions: function () {
    var $this = this;
    var actions = [];
    var canvas = $('#'+this.containerId+' #canvas');

    canvas.find('.action').each(function (index, element) {

        var actionBox = $(element).parent();
        var actionEl = $(element);

        var id = actionBox.attr('id');

        var action = $this._actionInfos[id];
        if (action == null) {
          action = {};
        }
        
        let ingroup = actionBox.parent().hasClass("group-container");


        action['id'] = id;
        action['name'] = actionEl.attr('name')||action.name;
        action['title'] = actionEl.attr('title')||action.title;
        action['icon'] = actionEl.attr('icon')||action.icon;
        action['des'] = actionEl.attr('des')||action.des;
        
       
        if(ingroup){
          action['left'] = (actionBox.position().left + actionBox.parent().position().left)+"px";
          action['top'] = (actionBox.position().top + actionBox.parent().position().top)+"px";
        }else{
          action['left'] = actionBox.position().left+"px";
          action['top'] = actionBox.position().top+"px";
        }

        action['width'] = actionBox.css('width');
        action['height'] = actionBox.css('height');
        action['body_width'] = actionBox.attr('body_width');
        action['body_height'] = actionBox.attr('body_height');
         

        actions.push(action);
      });

    for(var i in actions){
      var id = actions[i].id;
      //set action state\content
    }
      
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

  //获取截图
  getSnapshot: function (callback, opts) {
    if ($('#canvas').is(':hidden')) {
      return;
    }

    var options = { backgroundColor: 'white', ignore_svg:false };

    if (opts) {
      $.extend(options, opts);
    }

    const cardBox = document.querySelector('#canvas');
    const rect = cardBox.getBoundingClientRect();
    const offsetX = $(cardBox).offset().left; 
    const offsetY = $(cardBox).offset().top; 
    const w = cardBox.scrollWidth;
    const h = cardBox.scrollHeight;


    if(!options.ignore_svg){ 
      var nodesToRecover = [];
      var nodesToRemove = [];
      var svgElem = $(cardBox).find('svg'); //divReport为需要截取成图片的dom的id
      svgElem.each(function (index, node) {
        var parentNode = node.parentNode;
        var svg = node.outerHTML.trim();
        var subCanvas = document.createElement('canvas');
        canvg(subCanvas, svg);
        if (node.style.position) {
          subCanvas.style.position = node.style.position;
          subCanvas.style.left = node.style.left;
          subCanvas.style.top = node.style.top;
        }
        nodesToRecover.push({
          parent: parentNode,
          child: node,
        });
        parentNode.removeChild(node);
        nodesToRemove.push({
          parent: parentNode,
          child: subCanvas,
        });
        parentNode.appendChild(subCanvas);
      });

    }
    
    
    let scale = options.scale || 1; 
    let canvas = document.createElement('canvas');
 
    canvas.style.width = w   + 'px';
    canvas.style.height = h    + 'px'; 
  
    html2canvas(cardBox, {
      canvas: canvas,
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
    }).then(function (cvs) {
       
      for (var k in nodesToRemove) {
        var node = nodesToRemove[k];
        node.parent.removeChild(node.child);
      }
      for (var k in nodesToRecover) {
        var node = nodesToRecover[k];
        node.parent.appendChild(node.child);
      } 

      if (callback) {
        callback(cvs);
      }
    });
    $(canvas).remove();
  },

  //截图,并保存为
  snap: function (name) {
    var $this=this;

    name = name || 'andflow';

    var ext = 'jpeg';

    this.getSnapshot(
      function (canvas) {
      
        var url = canvas.toDataURL('image/jpeg'); //生成下载的url

        var triggerDownload = $('<a></a>')
          .attr('href', url)
          .attr('download', name + '.' + ext); // 把url放到我们的a标签中，并得到a标签对象
        triggerDownload[0].click(); //模拟点击一下a标签，即可下载啦！
      },
      { scale: 1, backgroundColor: 'white' ,ignore_svg: false}
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
  getActionTitle:function(action_id){
    var action = this._actionInfos[action_id];
    return action.title;
  },
  setActionTitle:function(action_id, title){
    this._actionInfos[action_id].title = title;
    $('#'+this.containerId+' #canvas').find("#"+action_id).find(".action-header").html(title);
  },
  setActionTheme: function (action_id, theme) {
    this._actionInfos[action_id].theme = theme;
 
    for (var k in flow_themes) {
      $('#' + this.containerId).find("#"+action_id).removeClass(k);
    }
 
    $('#' + this.containerId).find("#"+action_id).addClass(theme);
    
    if(this._plumb){
      this._plumb.repaintEverything();
    }
    
  },
  getActionContent: function(action_id){
    var actioncontent = this._actionContents[action_id];
    return actioncontent;
  },
  setActionContent: function (action_id, content, content_type) {
    if(action_id==undefined || action_id==null || action_id=="" || this._actionInfos[action_id]==null){
      return;
    }
     
    this._actionInfos[action_id].content =  { content_type: content_type, content: content };
    this._actionContents[action_id] = { content_type: content_type, content: content };

    if (
      this.flowModel.show_action_content == false ||
      this.flowModel.show_action_content == 'false'
    ) {
      return;
    }
    
    var element = $('#' + this.containerId).find('#' + action_id + ' .action-content');

    switch (content_type) {
      case 'msg':
        if (this._actionCharts[action_id] != null) {
          this._actionCharts[action_id].dispose();
          this._actionCharts[action_id] = null;
        }

        element.html("<div class='action-msg'>" + content + '</div>');

        break;
      case 'keyvalue':
        var data = JSON.parse(content);
        var grid = $('<table class="action-result-table" style="width:100%"></table>');
        for (var k in data) {
          grid.append(
            '<tr><td class="action-result-label">' +
              k +
              '</td><td class="action-result-value">' +
              data[k] +
              '</td></tr>',
          );
        }
        element.html('');
        element.append(grid);
        element.css('overflow-y', 'auto');
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

        var grid = $('<table class="table" style="width:100%"></table>');

        //header
        var headerEl = $('<tr></tr>');
        for (var j in columns) {
          var title = columns[j].title || columns[j].name;
          var colEl = $('<th>' + title + '</th>');
          headerEl.append(colEl);
        }
        grid.append(headerEl);

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
          var rowEl = $('<tr></tr>');
          for (var j in rowDatas) {
            var val = rowDatas[j];
            if (val instanceof Object) {
              val = JSON.stringify(val);
            }
            var colEl = $('<td>' + val + '</td>');
            rowEl.append(colEl);
          }
          grid.append(rowEl);
        }
        element.html('');
        element.append(grid);
        element.css('overflow-y', 'auto');

        break;
      case 'html':
        if (this._actionCharts[action_id] != null) {
          this._actionCharts[action_id].dispose();
          this._actionCharts[action_id] = null;
        }

        element.html("<div class='action-html'>" + content + '</div>');

        break;
      case 'chart':
        var option = JSON.parse(content);

        var id = 'chart_' + action_id;

        var charDom = element.find('#' + id);
        var actionChart = this._actionCharts[action_id];
        if (actionChart == null || charDom == null || charDom.length == 0) {
          element.html("<div id='" + id + "' class='action-chart'></div>");
          var w = element.width();
          var h = element.height();
          $('#' + id).width(w);
          $('#' + id).height(h);

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

        element.html(
          '<iframe src="' + url + '" style="width:100%;height: 100%;" frameborder="0"></iframe>',
        );

        break;
      case 'web':
        if (this._actionCharts[action_id] != null) {
          this._actionCharts[action_id].dispose();
          this._actionCharts[action_id] = null;
        }
        element.html(
          '<iframe src="' +
            content +
            '" style="width:100%;height: 100%;" frameborder="0"></iframe>',
        );

        break;
      default:
        if (this._actionCharts[action_id] != null) {
          this._actionCharts[action_id].dispose();
          this._actionCharts[action_id] = null;
        }

        element.html( content );

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
      $('#' + this.containerId + ' .action-body').hide();
    } else {
      $('#' + this.containerId + ' .action-body').show();
    }
  },

  setActionContentVisible: function (v) {
    this.flowModel.show_action_content = v ? 'true' : 'false';
    if (this.flowModel.show_action_content == 'false' || this.flowModel.show_action_content==false) {
      $('#' + this.containerId + ' .action-content').hide();
    } else {
      $('#' + this.containerId + ' .action-content').show();
    }
  },
};
