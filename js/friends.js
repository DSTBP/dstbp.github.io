$(function () { // 获取并处理友链数据
    $.getJSON("../internal_data/friends.json", function (data) {
        $('.links-content').html(""); // 清空容器

        // 处理正常友链
        if (data.normal && data.normal.length > 0) {
            // 随机排序
            let normalData = data.normal.sort(() => Math.random() - 0.5);
            // 添加标题
            $('.links-content').append("<div class='friend-title-item'><br>大佬们<br><br><hr></div>");
            // 分块生成行
            chunkArray(normalData, 3).forEach(chunk => {
                let rowHtml = '<div class="friend-row">';
                chunk.forEach(e => rowHtml += generateNormalCard(e));
                $('.links-content').append(rowHtml + '</div>');
            });
        }

        // 处理异常友链
        if (data.abnormal && data.abnormal.length > 0) {
            $('.links-content').append("<div class='friend-title-item'><br>异常的大佬们<br><br><hr></div>");
            chunkArray(data.abnormal, 3).forEach(chunk => {
                let rowHtml = '<div class="friend-row">';
                chunk.forEach(e => rowHtml += generateAbnormalCard(e));
                $('.links-content').append(rowHtml + '</div>');
            });
        }
    });

    // 分块辅助函数
    function chunkArray(arr, size) {
        return arr.reduce((acc, _, i) => 
            (i % size) ? acc : [...acc, arr.slice(i, i + size)], []);
    }

    // 生成正常卡片
    function generateNormalCard(e) {
        return `<div class="friend-card-item">
            <img class="ava" src="${e.avatar || '/img/links/nopic.jpg'}" 
                 onerror="this.src='/img/links/nopic.jpg'" 
                 title="${e.avatar ? '' : '使用默认图片'}">
            <div class="text-desc">
                名称：<a href="${e.url}" target="_blank">${e.name}</a><br>
                ${e.rss ? `RSS：<a href="${e.rss}" target="_blank">订阅</a><br>` : ''}
                简介：${e.signature || '暂无简介'}
            </div>
        </div>`;
    }

    // 生成异常卡片
    function generateAbnormalCard(e) {
        return `<div class="friend-card-item">
            <img class="ava" src="/img/links/nopic.jpg" title="链接异常">
            <div class="text-desc">
                名称：<a href="${e.url}" target="_blank">${e.name}</a><br>
                状态：${e.status || '未知'}<br>
                异常时间：${e.remark || '暂无记录'}
            </div>
        </div>`;
    }
});