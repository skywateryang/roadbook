// 添加平滑滚动效果
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// 打印功能
document.addEventListener('DOMContentLoaded', function() {
    // 使用更精确的选择器来选择打印按钮
    document.querySelector('button.bg-white.text-primary').addEventListener('click', function() {
        // 创建一个临时容器，只包含需要打印的内容
        const printContent = document.createElement('div');
        
        // 复制header和所有section的内容（不包括导航栏和页脚）
        const header = document.querySelector('header');
        const sections = document.querySelectorAll('section');
        
        if (header) {
            printContent.appendChild(header.cloneNode(true));
        }
        
        sections.forEach(section => {
            printContent.appendChild(section.cloneNode(true));
        });
        
        // 应用基本样式
        printContent.style.backgroundColor = 'white';
        printContent.style.fontFamily = '"Inter", sans-serif';
        printContent.style.color = 'black';
        
        // 配置选项
        const opt = {
            margin: [10, 10, 10, 10], // 上右下左边距，单位mm
            filename: '中亚之旅路书.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2,
                useCORS: true,
                logging: false,
                letterRendering: true,
                allowTaint: true
            },
            jsPDF: { 
                unit: 'mm', 
                format: 'a4', 
                orientation: 'portrait',
                compress: true
            },
            pagebreak: { mode: 'avoid-all', before: '.page-break-before', after: '.page-break-after' }
        };
        
        // 生成PDF
        html2pdf()
            .from(printContent)
            .set(opt)
            .toPdf()
            .get('pdf')
            .then((pdf) => {
                // 确保所有页面都被正确处理
                pdf.setProperties({
                    title: '中亚之旅路书',
                    subject: '行程安排',
                    author: '旅行者专属定制',
                    keywords: '中亚,旅行,路书',
                    creator: '旅行者专属定制'
                });
                return pdf;
            })
            .save();
    });
});