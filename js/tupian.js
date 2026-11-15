// js/tupian.js

document.addEventListener('DOMContentLoaded', () => {
    initTupian();
});

async function initTupian() {
    try {
        const response = await fetch('https://m1.apifoxmock.com/m1/9046970-8859816-default/api/tupian');
        if (!response.ok) throw new Error('网络请求失败');
        const data = await response.json();

        renderPhotoGroups(data.photoGroups);

    } catch (error) {
        console.error('获取数据失败:', error);
    }
}

// 渲染：园林美景图
function renderPhotoGroups(groups) {
    let str = '';
    
    // 1. 外层循环：遍历每一行 (style3s, style2s, style4s...)
    groups.forEach(group => {
        
        // 开始拼这一行的外层 div，并绑定对应的类名
        str += `<div class="${group.style}">`;
        
        // 2. 内层循环：遍历这一行里的所有图片
        group.images.forEach(imgSrc => {
            str += `<img src="${imgSrc}" alt="">`;
        });
        
        // 结束当前行的 div
        str += `</div>`;
    });

    // 将拼接好的 HTML 塞进容器
    document.getElementById('photoContainer').innerHTML = str;
}

// ============ 图片放大预览逻辑 ============
document.addEventListener('DOMContentLoaded', () => {
    // 获取元素
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = document.getElementById('lightboxImg');
    const closeBtn = document.querySelector('.lightbox-close');

    // 使用事件委托，监听所有美景图的点击
    // (因为图片是动态生成的，直接给img绑事件会失效，所以绑在父级或document上)
    document.body.addEventListener('click', function(e) {
        
        // 1. 如果点击的是美景图区域内的图片
        if (e.target.tagName === 'IMG' && e.target.closest('.page-photo')) {
            lightbox.style.display = 'flex'; // 显示遮罩层
            lightboxImg.src = e.target.src;  // 把点中的图片地址给它
        }
        
        // 2. 如果点击的是遮罩层背景，或者右上角的X，关闭预览
        if (e.target === lightbox || e.target === closeBtn) {
            lightbox.style.display = 'none';
            lightboxImg.src = ''; // 清空地址，防止下次闪一下旧图
        }
    });
});
