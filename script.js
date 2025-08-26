// 组件加载功能
async function loadComponent(componentPath, targetSelector) {
    try {
        const response = await fetch(componentPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        const targetElement = document.querySelector(targetSelector);
        if (targetElement) {
            targetElement.innerHTML = html;
        } else {
            console.error(`Target element not found: ${targetSelector}`);
        }
    } catch (error) {
        console.error(`Error loading component ${componentPath}:`, error);
    }
}

// 页面加载完成后加载所有组件
document.addEventListener('DOMContentLoaded', async function() {
    // 按顺序加载所有组件
    await loadComponent('./components/nav.html', '#nav-placeholder');
    await loadComponent('./components/header.html', '#header-placeholder');
    await loadComponent('./components/overview.html', '#overview-placeholder');
    await loadComponent('./components/itinerary.html', '#itinerary-placeholder');
    await loadComponent('./components/travel-tips.html', '#travel-tips-placeholder');
    await loadComponent('./components/footer.html', '#footer-placeholder');
    
    // 重新绑定打印按钮事件（因为导航栏是动态加载的）
    setTimeout(() => {
        const printButton = document.querySelector('button.bg-white.text-primary');
        if (printButton) {
            printButton.addEventListener('click', function() {
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
        }
        
        // 重新绑定平滑滚动效果
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }, 200); // 延迟200ms确保所有组件加载完成
});