// author by removef
// https://removeif.github.io/
$(function () { // 获取处理友链数据
    $.getJSON("../internal_data/friends.json", function (data) {
        $('.links-content').html("");

        // 处理正常的友链
        if (data.normal.length > 0) {
            $('.links-content').append("<div class='friend-title-item'><br>大佬们<br><br><hr></div>");
            $.each(data.normal, function (i, e) {
                var html = "<div class=\"friend-card-item\">";
                if (!e.avatar) {
                    html += "    <img class=\"ava\" src=\"/img/nopic.jpg\" title=\"图片链接不可用，使用的默认图片\">";
                } else {
                    html += "    <img class=\"ava\" src=\"" + e.avatar + "\">";
                }
                html += "<div class='text-desc' title=\"" + (e.signature || "") + "\">" +
                        "    网址：<a href=\"" + e.url + "\" target=\"_blank\">" + e.name + "</a>" +
                        "<br>签名：" + (e.signature || "无") +
                        (e.rss ? "<br>RSS：<a href='" + e.rss + "' target='_blank'>订阅</a>" : "") +
                        "</div></div>";
                $('.links-content').append(html);
            });
        }

        // 处理异常的友链
        if (data.abnormal.length > 0) {
            $('.links-content').append("<div class='friend-title-item'><br>异常的大佬们<br><br><hr></div>");
            $.each(data.abnormal, function (i, e) {
                var html = "<div class=\"friend-card-item\">";
                html += "    <img class=\"ava\" src=\"/img/nopic.jpg\" title=\"图片链接不可用，使用的默认图片\">";
                html += "<div class='text-desc' title=\"" + (e.remark || "") + "\">" +
                        "    网址：<a href=\"http://" + e.url + "\" target=\"_blank\">" + e.name + "</a>" +
                        "<br>状态：" + e.status +
                        "<br>备注：" + (e.remark || "无") +
                        "</div></div>";
                $('.links-content').append(html);
            });
        }
    });
});

