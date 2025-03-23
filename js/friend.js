// // author by removef
// // https://removeif.github.io/
// $(function () { // 获取处理友链数据
//     $.getJSON("../internal_data/friends.json", function (data) {
//         $('.links-content').html("");

//         // 处理正常的友链
//         if (data.normal.length > 0) {
//             $('.links-content').append("<div class='friend-title-item'><br>大佬们<br><br><hr></div>");
//             $.each(data.normal, function (i, e) {
//                 var html = "<div class=\"friend-card-item\">";
//                 if (!e.avatar) {
//                     html += "    <img class=\"ava\" src=\"/img/nopic.jpg\" title=\"图片链接不可用，使用的默认图片\">";
//                 } else {
//                     html += "    <img class=\"ava\" src=\"" + e.avatar + "\">";
//                 }
//                 html += "<div class='text-desc' title=\"" + (e.signature || "") + "\">" +
//                         "    网址：<a href=\"" + e.url + "\" target=\"_blank\">" + e.name + "</a>" +
//                         "<br>签名：" + (e.signature || "无") +
//                         (e.rss ? "<br>RSS：<a href='" + e.rss + "' target='_blank'>订阅</a>" : "") +
//                         "</div></div>";
//                 $('.links-content').append(html);
//             });
//         }

//         // 处理异常的友链
//         if (data.abnormal.length > 0) {
//             $('.links-content').append("<div class='friend-title-item'><br>异常的大佬们<br><br><hr></div>");
//             $.each(data.abnormal, function (i, e) {
//                 var html = "<div class=\"friend-card-item\">";
//                 html += "    <img class=\"ava\" src=\"/img/nopic.jpg\" title=\"图片链接不可用，使用的默认图片\">";
//                 html += "<div class='text-desc' title=\"" + (e.remark || "") + "\">" +
//                         "    网址：<a href=\"http://" + e.url + "\" target=\"_blank\">" + e.name + "</a>" +
//                         "<br>状态：" + e.status +
//                         "<br>备注：" + (e.remark || "无") +
//                         "</div></div>";
//                 $('.links-content').append(html);
//             });
//         }
//     });
// });




function renderFriends() {
    const data = {"../internal_data/friends.json"};
    const friendsContainer = document.querySelector('.friends');
    
    // 渲染正常友链
    data.normal.forEach(friend => {
        const friendDiv = document.createElement('div');
        friendDiv.className = 'friend';
        
        // 头像处理
        const avatar = document.createElement('div');
        avatar.className = 'friend-avatar';
        if (friend.avatar.startsWith('http')) {
            avatar.style.backgroundImage = `url(${friend.avatar})`;
        } else {
            avatar.textContent = friend.avatar;
        }
        
        // 详细信息
        const detail = document.createElement('div');
        detail.className = 'friend-detail';
        
        const nameLine = document.createElement('div');
        nameLine.innerHTML = `${friend.name}${friend.rss ? 
            `&nbsp;<a class="has-text-grey" target="_blank" href="${friend.rss}">
                <i class="fas fa-rss" title="支持 RSS"></i></a>` : ''}`;
        
        const urlLine = document.createElement('div');
        urlLine.innerHTML = `<a target="_blank" href="${friend.url}">${new URL(friend.url).host}</a>`;
        
        detail.append(nameLine, urlLine);
        
        // 悬浮提示
        const pop = document.createElement('div');
        pop.className = 'friend-pop';
        pop.innerHTML = `<div>${friend.signature}</div>`;
        
        friendDiv.append(avatar, detail, pop);
        friendsContainer.appendChild(friendDiv);
    });

    // 渲染异常友链
    const abnormalContainer = document.querySelector('.friends:last-child');
    data.abnormal.forEach(friend => {
        const friendDiv = document.createElement('div');
        friendDiv.className = 'friend';
        
        const avatar = document.createElement('div');
        avatar.className = 'friend-avatar';
        avatar.textContent = friend.avatar || friend.name[0];
        
        const detail = document.createElement('div');
        detail.className = 'friend-detail';
        
        const nameLine = document.createElement('div');
        nameLine.innerHTML = `${friend.name}&nbsp;<span class="tag is-warning">${friend.status}</span>`;
        
        const urlLine = document.createElement('div');
        urlLine.textContent = friend.url;
        
        const pop = document.createElement('div');
        pop.className = 'friend-pop';
        pop.innerHTML = `<div>${friend.signature || ''}<br>备注: ${friend.remark}</div>`;
        
        detail.append(nameLine, urlLine);
        friendDiv.append(avatar, detail, pop);
        abnormalContainer.appendChild(friendDiv);
    });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', renderFriends);