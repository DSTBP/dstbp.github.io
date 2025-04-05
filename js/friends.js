document.addEventListener('DOMContentLoaded', () => {
    const loader = document.getElementById('loader')
    const friendsContainer = document.getElementById('friends-list')

    fetch('/data/friends/friends.json')
        .then(response => response.json())
        .then(data => {
            friendsContainer.innerHTML = '' // 清空列表
            data.forEach(friend => {
                const friendDiv = document.createElement('div')
                friendDiv.classList.add('friend')

                let avatarHtml = friend.avatar
                    ? `<div class="friend-avatar" style="background-image: url('${friend.avatar}')"></div>`
                    : `<div class="friend-avatar">${friend.name[0]}</div>`

                let rssHtml = friend.rss
                    ? `<a class="has-text-grey" target="_blank" href="${friend.rss}"><i class="fas fa-rss" title="支持 RSS"></i></a>`
                    : ''

                let popHtml = friend.description
                    ? `<div class="friend-pop"><div>签名: ${friend.description}</div></div>`
                    : ''

                friendDiv.innerHTML = `
            ${avatarHtml}
            <div class="friend-detail">
              <div>${friend.name}&nbsp;${rssHtml}</div>
              <div><a target="_blank" href="${friend.link}">${friend.link}</a></div>
            </div>
            ${popHtml}
          `
                friendsContainer.appendChild(friendDiv)
            })
        })
        .catch(error => {
            friendsContainer.innerHTML = '<div style="width: 90%; max-width: 800px; margin: 2rem auto; padding: 1.5rem; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);"><p style="text-align:center; color:#dc3545; font-size:1.1em; margin:0; line-height:1.5;">加载友链失败，请稍后重试。</p></div>'
            console.error('加载友链失败:', error)
        })
        .finally(() => {
            loader.style.display = 'none' // 隐藏加载动画
        })
})
