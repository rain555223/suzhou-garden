// js/jingdian.js

document.addEventListener('DOMContentLoaded', () => {
    initJingdian();
});

async function initJingdian() {
    try {
        const response = await fetch('https://m1.apifoxmock.com/m1/9046970-8859816-default/api/jingdian');
        if (!response.ok) throw new Error('网络请求失败');
        const data = await response.json();

        // 渲染两个列表
        renderScenic(data.scenicList);
        renderPopular(data.popularList);

    } catch (error) {
        console.error('获取数据失败:', error);
    }
}

// 渲染：园内景点
function renderScenic(list) {
    let str = '';
    list.forEach(item => {
        str += `
            <a href="javascript:;" class="item">
                <div class="box-img">
                    <img src="${item.img}" alt="" />
                </div>
                <div class="content">
                    <h3 class="clamp1">${item.title}</h3>
                    <p class="clamp1">${item.address}</p>
                    <p>游客量<span>${item.visitors}</span></p>
                </div>
            </a>
        `;
    });
    document.getElementById('scenicList').innerHTML = str;
}

// 渲染：热门景点
function renderPopular(list) {
    let str = '';
    list.forEach(item => {
        str += `
            <a href="javascript:;" class="item">
                <img src="${item.img}" alt="" />
                <h4>${item.title}</h4>
            </a>
        `;
    });
    document.getElementById('popularList').innerHTML = str;
}

// ============ 图片放大预览逻辑 ============
document.addEventListener('DOMContentLoaded', () => {
    // 获取元素
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.lightbox-close');

    // 使用事件委托监听点击
    document.body.addEventListener('click', function(e) {
        
        // 1. 判断：点击的是否是 img 标签，且它存在于 ".exhibit-yzcl"（热门景点）容器内部
        if (e.target.tagName === 'IMG' && e.target.closest('.exhibit-yzcl')) {
            lightbox.style.display = 'flex'; // 显示遮罩层
            lightboxImg.src = e.target.src;  // 赋值图片路径
        }
        
        // 2. 判断：点击的是遮罩层背景，或者右上角的 X 按钮
        if (e.target === lightbox || e.target === closeBtn) {
            lightbox.style.display = 'none';
            lightboxImg.src = ''; 
        }
    });
});