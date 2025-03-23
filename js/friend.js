document.addEventListener('DOMContentLoaded', () => {
    const friends = {
        // 用户提供的原始JSON数据
        "normal": [/*...*/],
        "abnormal": [/*...*/]
    };

    const container = document.querySelector('.links-content');
    if (!container) return;

    // 创建友链容器
    const createFriendContainer = () => {
        const wrapper = document.createElement('div');
        wrapper.className = 'friend-links';
        return wrapper;
    }

    // 生成头像元素
    const generateAvatar = (friend) => {
        const avatarWrapper = document.createElement('div');
        avatarWrapper.className = 'friend-avatar';
        
        if (friend.avatar.startsWith('http')) {
            const img = document.createElement('img');
            img.src = friend.avatar;
            img.alt = friend.name;
            avatarWrapper.appendChild(img);
        } else {
            const textAvatar = document.createElement('div');
            textAvatar.className = 'text-avatar';
            textAvatar.textContent = friend.avatar || friend.name[0];
            textAvatar.style.backgroundColor = `hsl(${Math.random() * 360}, 50%, 50%)`;
            avatarWrapper.appendChild(textAvatar);
        }
        return avatarWrapper;
    }

    // 生成友链信息
    const generateInfo = (friend) => {
        const info = document.createElement('div');
        info.className = 'friend-info';
        
        // 名称和链接
        const title = document.createElement('a');
        title.className = 'friend-name';
        title.href = /^https?:\/\//.test(friend.url) ? friend.url : `https://${friend.url}`;
        title.target = '_blank';
        title.rel = 'noopener noreferrer';
        title.textContent = friend.name;
        
        // 描述
        const desc = document.createElement('p');
        desc.className = 'friend-desc';
        desc.textContent = friend.signature || '这是一个神秘的友链';

        info.append(title, desc);
        return info;
    }

    // 生成附加信息（RSS/状态）
    const generateExtra = (friend) => {
        const extra = document.createElement('div');
        extra.className = 'friend-extra';
        
        if (friend.rss) {
            const rss = document.createElement('a');
            rss.className = 'rss-link';
            rss.href = friend.rss;
            rss.target = '_blank';
            rss.innerHTML = '<i class="ic i-rss"></i> RSS';
            extra.appendChild(rss);
        }
        
        if (friend.status) {
            const status = document.createElement('div');
            status.className = 'friend-status';
            status.innerHTML = `<strong>状态：</strong><span style="color:red">${friend.status}</span>`;
            
            const remark = document.createElement('div');
            remark.className = 'friend-remark';
            remark.textContent = friend.remark;
            
            extra.append(status, remark);
        }
        
        return extra;
    }

    // 生成友链卡片
    const generateFriendCard = (friend) => {
        const card = document.createElement('div');
        card.className = `friend-card ${friend.status ? 'abnormal' : 'normal'}`;
        
        card.append(
            generateAvatar(friend),
            generateInfo(friend),
            generateExtra(friend)
        );
        
        return card;
    }

    // 渲染函数
    const renderFriends = () => {
        const wrapper = createFriendContainer();
        
        // 正常友链
        const normalSection = document.createElement('section');
        normalSection.innerHTML = '<h2 class="friend-section-title">🎉 正常友链</h2>';
        friends.normal.forEach(f => {
            normalSection.appendChild(generateFriendCard(f));
        });
        
        // 异常友链
        const abnormalSection = document.createElement('section');
        abnormalSection.innerHTML = '<h2 class="friend-section-title">⚠️ 异常状态</h2>';
        friends.abnormal.forEach(f => {
            abnormalSection.appendChild(generateFriendCard(f));
        });
        
        wrapper.append(normalSection, abnormalSection);
        container.innerHTML = '';
        container.appendChild(wrapper);
    }

    // 初始化
    renderFriends();
});