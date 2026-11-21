// js/zhinan.js

document.addEventListener('DOMContentLoaded', () => {
    initZhinan();
});

async function initZhinan() {
    try {
        const response = await fetch('./data/zhinan.json');
        if (!response.ok) throw new Error('网络请求失败');
        const data = await response.json();

        renderGuide(data.guideList);
        renderNotice(data.noticeList);

    } catch (error) {
        console.error('获取数据失败:', error);
    }
}

// 渲染：苏州之旅即刻起航
function renderGuide(list) {
    let str = '';
    list.forEach(item => {
        str += `
            <a href="javascript:;" class="item">
                <img src="${item.img}" alt="" />
                <h4>${item.title}</h4>
                <p>${item.desc}</p>
            </a>
        `;
    });
    // 渲染到刚才清空的容器里
    document.getElementById('guideLeft').innerHTML = str;
}

// 渲染：参观须知
function renderNotice(list) {
    let str = '';
    list.forEach(item => {
        str += `
            <div class="item">
                <div class="left">
                    <img src="${item.img}" alt="" />
                </div>
                <div class="right">
                    <h4>${item.title}</h4>
                    <p>${item.content}</p>
                </div>
            </div>
        `;
    });
    // 渲染到列表容器
    document.getElementById('noticeList').innerHTML = str;
}