const setFont = function () {
    // 获取html元素
    var html = document.documentElement;
    // var html = document.querySelector('html');
    // 获取宽度
    var width = html.clientWidth;
    // 如果小于1024，那么就按1024
    if (width < 1024){
        width = 1024; 
    }
    // 如果大于1920，那么就按1920
    if (width > 1920) {
        width = 1920;
    }
    // 计算
    var fontSize = width / 80 + 'px';
    // 设置给html
    html.style.fontSize = fontSize;
}

