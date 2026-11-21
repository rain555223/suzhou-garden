// js/vr.js

document.addEventListener('DOMContentLoaded', () => {
    initVR();
});

async function initVR() {
    try {
        const response = await fetch('./data/vr.json');
        if (!response.ok) throw new Error('网络请求失败');
        const data = await response.json();

        renderVRList(data.vrList);

    } catch (error) {
        console.error('获取数据失败:', error);
    }
}

// 渲染：VR游园列表
function renderVRList(list) {
    let str = '';
    
    list.forEach(item => {
        // 根据 isEven 字段动态生成不同的左右结构
        if (item.isEven) {
            // 偶数项：文字在左，图片在右
            str += `
                <div class="item">
                    <div class="left content">
                        <h4>${item.title}</h4>
                        <div class="txt">${item.desc}</div>
                    </div>
                    <div class="right">
                        <img src="${item.img}" alt="" />
                    </div>
                </div>
            `;
        } else {
            // 奇数项：图片在左，文字在右
            str += `
                <div class="item">
                    <div class="left">
                        <img src="${item.img}" alt="" />
                    </div>
                    <div class="right content">
                        <h4>${item.title}</h4>
                        <div class="txt">${item.desc}</div>
                    </div>
                </div>
            `;
        }
    });

    document.getElementById('vrContainer').innerHTML = str;
}