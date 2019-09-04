window.addEventListener('load', () => {
    // 重点理解： ul里面有5个孩子，但是css样式中有一个 margin-left： -100%  所以当我们显示索引为0的图片时，实际显示的时第一张图片
    var focus = document.querySelector('.focus');
    var ul = focus.querySelector('ul');
    var ol = focus.querySelector('ol');
    var focusWidth = focus.offsetWidth;
    var num = 0;
    var timer = 0;
    var tranlatex;
    // 如果手指有移动时给flag设置为true 代码优化
    var flag = false;
    var defultTransition = 'all .3s ease-in' // 将字符串给一个变量，可减少内存复制
    for (var i = 0; i < ul.children.length - 2; i++) {
        var li = document.createElement('li');
        ol.appendChild(li);
    }
    ol.children[0].classList.add('current');
    timer = setInterval(() => {
        num++;
        tranlatex = - num * focusWidth;
        // 利用过度效果实现缓动
        ul.style.transition = defultTransition;
        // 利用动画运动
        ul.style.transform = `translateX(${tranlatex}px)`;

    }, 2000);
    ul.addEventListener('transitionend', () => {

        if (num >= 3) {
            num = 0;
            transformX(ul, num);
        } else if (num < 0) {
            num = 2;
            transformX(ul, num);
        }
        // 圆点随着轮播图转变
        /* ol.querySelector('.current').classList.remove('current');
        ol.children[num].classList.add('current'); */
    });
    // 圆点随着轮播图转变
    ul.addEventListener('transitionrun', function () {
        ol.querySelector('li.current').classList.remove('current');
        // console.log(num);
        // num < 0 && (num = 2);
        // 这里这个 +3 是为了防止num = -1 时报错，
        var circle = (num + 3) % ol.children.length; 
        ol.children[circle].classList.add('current');
    });



    //手指滑动轮播图滑动
    var startX;
    var moveX = 0;
    ul.addEventListener('touchstart', e => {
        e.preventDefault();
        clearInterval(timer);
        startX = e.targetTouches[0].pageX;
    });
    ul.addEventListener('touchmove', e => {
        moveX = e.changedTouches[0].pageX - startX;
        transformX(ul, num);
        flag = true; // 移动过来
    });
    ul.addEventListener('touchend', () => {

        timer = setInterval(() => {
            num++;
            // 这里不能直接引用transformX函数，因为有过度效果
            tranlatex = - num * focusWidth;
            // 利用过度效果实现缓动
            ul.style.transition = defultTransition;
            // 利用动画运动
            ul.style.transform = `translateX(${tranlatex}px)`;
        }, 2000);

        // 如果移动距离大于50则翻页
        if (!flag) {
            // 没有移动过直接返回，不用执行下main代码，减少代码执行。优化
            return;
        }
        if (Math.abs(moveX) > 50) {
            moveX > 0 ? num-- : num++;
        }
        moveX = 0;
        transformX(ul, num);
        ul.style.transition = defultTransition;
        flag = false;


    });
    function transformX(obj, num) {
        // 解除过度，不然不能实现无缝滚动（一直会有过度效果）
        obj.style.transition = 'none';
        tranlatex = - num * focusWidth + moveX;
        // 利用动画运动
        obj.style.transform = `translateX(${tranlatex}px)`;
    }







    // 返回顶部
    var goBack = document.querySelector('.goBack');
    var nav = document.querySelector('nav');
    var backTop; 
    window.addEventListener('scroll', backTop = function () {
        goBack.style.display = window.pageYOffset > nav.offsetTop ? 'block' : 'none';
    });
    goBack.addEventListener('click', function () {
        window.scroll(0, 0); 
    });
    backTop();
});