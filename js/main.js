// 统一入口
document.addEventListener('DOMContentLoaded', () => {
    initPage();
    initModal(); // 你原来的弹窗逻辑
});

// 1. 抓取数据并渲染
async function initPage() {
    try {
        document.querySelector('.swiper-wrapper').innerHTML = `
            <div class="swiper-slide loading-slide">
                <div class="loading-spinner">加载中...</div>
            </div>
        `;
        // 发起请求
                // 发起请求
        const response = await fetch('./data/index.json');
        if (!response.ok) throw new Error('网络请求失败');
        const data = await response.json();

        // 分别渲染
        renderBanner(data.banners);
        renderScenicSpots(data.scenicSpots);
        renderVR(data.vrList);
        renderNews(data.newsList);

        //等 Banner 渲染完毕后，再初始化 Swiper
        initSwiper();

    } catch (error) {
        console.error('获取数据失败:', error);
    }
}

// ================= 渲染函数 =================

// 渲染轮播图
function renderBanner(banners) {
    let str = '';
    banners.forEach((item, index) => {
        // 第一张图 eager（立即加载），后面的图 lazy（懒加载，轮播到了才加载）
        const loadingMode = index === 0 ? 'eager' : 'lazy';
        
        str += `
            <div class="swiper-slide">
                <div class="box-img">
                    <a href="${item.link}">
                        <img src="${item.img}" alt="" loading="${loadingMode}" />
                    </a>
                </div>
            </div>
        `;
    });
    document.querySelector('.swiper-wrapper').innerHTML = str;
}

// 渲染热门景区
function renderScenicSpots(spots) {
    let str = '';
    spots.forEach(item => {
        str += `
            <a href="javascript:;" class="item">
                <img src="${item.img}" alt="" />
                <div class="layer">
                    <h4>${item.title}</h4>
                    <p>${item.desc}</p>
                </div>
            </a>
        `;
    });
    document.querySelector('#index-cp .item-all').innerHTML = str;
}

// 渲染 VR游园
function renderVR(vrList) {
    let str = '';
    vrList.forEach(item => {
        str += `
            <a href="./vr.html">
                <div class="item">
                    <img src="${item.img}" alt="" />
                    <div class="layer">
                        <div class="title">
                            <h4>${item.title}</h4>
                            <div class="pro-btn">
                                <i class="iconfont aki-youjiantou"></i>
                            </div>
                        </div>
                    </div>
                </div>
            </a>
        `;
    });
    document.querySelector('#index-dl .products-list').innerHTML = str;
}

// 渲染资讯列表
function renderNews(newsList) {
    let str = '';
    newsList.forEach(item => {
        str += `
            <a href="javascript:;" class="item">
                <div class="item-left">
                    <div class="years">${item.dateYear}</div>
                    <div class="date">${item.dateDay}</div>
                </div>
                <div class="item-right">
                    <div class="title clamp1">${item.title}</div>
                    <div class="txt clamp2">${item.desc}</div>
                </div>
            </a>
        `;
    });
    document.querySelector('#index-news .item-all > .right').innerHTML = str;
}

// ================= 其他初始化逻辑 =================

// 初始化 Swiper
function initSwiper() {
    new Swiper('#index-banner .swiper-container', {
        autoplay: { delay: 4000 },
        speed: 1000,
        autoHeight: true,
        loop: true,
        navigation: {
            nextEl: '#index-banner .swiper-button-next',
            prevEl: '#index-banner .swiper-button-prev',
        },
        pagination: {
            el: '#index-banner .swiper-pagination',
            clickable: true
        }
    });

    // 如果有其他轮播图，也放在这里...
}

// 你原本的票价弹窗逻辑
function initModal() {
    // 阻止 a 标签默认行为
    document.querySelectorAll('.item-all .item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });

    const btnTicket = document.querySelectorAll('.btn-all .btn')[0];
    const modal = document.getElementById('ticketModal');
    const closeBtn = document.querySelector('.close-btn');
    const confirmBtn = document.getElementById('closeBtn');

    if(btnTicket) {
        btnTicket.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'flex';
        });
    }
    
    function closeModal() {
        modal.style.display = 'none';
    }

    if(closeBtn) closeBtn.addEventListener('click', closeModal);
    if(confirmBtn) confirmBtn.addEventListener('click', closeModal);
    
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });
}

// ================= 留言板功能 =================
document.addEventListener('DOMContentLoaded', () => {
    const openBtn = document.getElementById('openMessageBoard');
    const closeBtn = document.getElementById('closeMessageBoard');
    const modal = document.getElementById('messageModal');
    const input = document.getElementById('commentInput');
    const submitBtn = document.getElementById('submitBtn');
    const wordCount = document.getElementById('wordCount');
    const commentList = document.getElementById('commentList');
    const confirmModal = document.getElementById('confirmModal');
    const cancelDeleteBtn = document.getElementById('cancelDelete');
    const confirmDeleteBtn = document.getElementById('confirmDelete');
    const customToast = document.getElementById('customToast');
    const toastMessage = document.getElementById('toastMessage');



    let commentsData = [];
    let toastTimer = null;
    let currentDeleteId = null; // 用于暂存要删除的评论ID

    // 1. 打开/关闭弹窗
    if(openBtn) openBtn.addEventListener('click', () => modal.style.display = 'flex');
    if(closeBtn) closeBtn.addEventListener('click', () => modal.style.display = 'none');
    window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

    function showToast(msg) {
        toastMessage.innerText = msg;
        customToast.classList.add('show');
        
        // 如果连续点击，先清除之前的定时器
        if (toastTimer) clearTimeout(toastTimer);
        
        // 1.5 秒后自动消失
        toastTimer = setTimeout(() => {
            customToast.classList.remove('show');
        }, 1500);
    }
    // 2. 字数统计
    input.addEventListener('input', () => {
        wordCount.innerHTML = `${input.value.length}/200字`;
    });
    if(cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', () => {
            confirmModal.style.display = 'none'; // 关闭弹窗
            currentDeleteId = null; // 清空暂存ID
        });
    }

    if(confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', () => {
            if (currentDeleteId !== null) {
                // 执行删除
                commentsData = commentsData.filter(c => c.id !== currentDeleteId);
                localStorage.setItem('garden_comments', JSON.stringify(commentsData));
                renderComments();
                
                // 恢复初始状态
                confirmModal.style.display = 'none';
                currentDeleteId = null;

                showToast('删除成功！');
            }
        });
    }

    // 3. 渲染评论
    function renderComments() {
        let str = '';
        commentsData.sort((a, b) => b.timestamp - a.timestamp).forEach(item => {
            // 如果是自己发的，渲染图片垃圾桶
            const deleteBtnHtml = item.isMine 
                ? `<img src="./images/remove.png" class="action-icon delete-btn-img delete-btn" data-id="${item.id}" title="删除">` 
                : '';
            
            // 点赞状态判断
            const likeClass = item.isLiked ? 'liked' : '';
            const likeIcon = item.isLiked ? '♥' : '♡'; 

            str += `
                <div class="comment-item">
                    <div class="comment-left">
                        <div class="comment-user">${item.username}</div>
                        <div class="comment-text">${item.content}</div>
                        <div class="comment-time">${item.time}</div>
                    </div>
                    <div class="comment-actions">
                        <!-- 点赞按钮 -->
                        <span class="action-icon like-btn ${likeClass}" data-id="${item.id}">${likeIcon}</span>
                        <!-- 删除按钮（使用本地图片） -->
                        ${deleteBtnHtml}
                    </div>
                </div>
            `;
        });
        commentList.innerHTML = str;
        
        // 重新绑定事件
        bindActionEvents();
    }

    // 4. 初始化数据（本地存储优先，否则请求 Mock）
    async function initData() {
        const localData = localStorage.getItem('garden_comments');
        if (localData) {
            commentsData = JSON.parse(localData);
            renderComments();
        } else {
            try {
                const res = await fetch('./data/comments.json');
                const json = await res.json();
                commentsData = json.data || []; 
                
                // 给初始 Mock 数据补全字段
                commentsData = commentsData.map(c => ({
                    ...c, 
                    timestamp: new Date(c.time).getTime(),
                    isMine: false, // 初始数据不是自己发的
                    isLiked: false // 初始默认未点赞
                }));
                
                localStorage.setItem('garden_comments', JSON.stringify(commentsData));
                renderComments();
            } catch (error) {
                console.error('请求 Mock 评论失败:', error);
                commentList.innerHTML = '<p style="text-align:center;color:#999;">暂无评论数据</p>';
            }
        }
    }

    // 5. 发布评论
    function postComment() {
        const text = input.value.trim();
        if (!text) return;

        const now = new Date();
        // 补零函数
        const pad = (n) => String(n).padStart(2,'0');
        const timeStr = `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

        const newComment = {
            id: Date.now(),
            username: "你",
            content: text,
            time: timeStr,
            timestamp: now.getTime(),
            isMine: true, // 标记是自己发的，用于显示垃圾桶
            isLiked: false
        };

        commentsData.unshift(newComment);
        localStorage.setItem('garden_comments', JSON.stringify(commentsData));
        renderComments();
        
        input.value = '';
        wordCount.innerHTML = `0/200字`;

        showToast('发布成功！');
    }

    // 6. 绑定点赞和删除事件
        function bindActionEvents() {
        // 点赞/取消点赞
        document.querySelectorAll('.like-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = Number(this.getAttribute('data-id'));
                const comment = commentsData.find(c => c.id === id);
                
                if (comment) {
                    comment.isLiked = !comment.isLiked; 
                    localStorage.setItem('garden_comments', JSON.stringify(commentsData)); 
                    renderComments(); 
                }
            });
        });

        // 删除评论
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const id = Number(this.getAttribute('data-id'));
                currentDeleteId = id; // 把要删除的ID存起来
                confirmModal.style.display = 'flex'; // 显示确认弹窗
            });
        });
    }

    // 绑定发布按钮和回车键
    if(submitBtn) submitBtn.addEventListener('click', postComment);
    if(input) {
        input.addEventListener('keyup', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                postComment();
            }
        });
    }

    // 启动加载
    initData();
});
// 移动端导航栏切换 (你原本的jQuery代码)
$(function () {
    $('#header .moblie-nav-show').click(function () {
        $('#header .fir-menu').slideToggle('300');
    });
});