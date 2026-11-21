// js/zixun.js

document.addEventListener('DOMContentLoaded', () => {
    initZixun();
});

async function initZixun() {
    try {
        const response = await fetch('./data/zixun.json');
        if (!response.ok) throw new Error('网络请求失败');
        const data = await response.json();

        renderNewsList(data.newsList);

    } catch (error) {
        console.error('获取数据失败:', error);
    }
}

// 渲染：园林资讯列表
function renderNewsList(list) {
    let str = '';
    
    list.forEach(item => {
        str += `
            <a href="javascript:;">
                <div class="box-img">
                    <span>${item.tag}</span>
                    <img src="${item.img}" alt="">
                </div>
                <div class="content">
                    <h3>${item.title}</h3>
                    <div class="description clamp4">
                        ${item.desc}
                    </div>
                    <div class="userinfo">
                        <div class="author">${item.author}</div>
                        <div class="company">
                            来源：<span>苏州园林官网</span>
                        </div>
                    </div>
                </div>
            </a>
        `;
    });

    document.getElementById('newsContainer').innerHTML = str;
}