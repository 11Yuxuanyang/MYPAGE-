// AI Assistant functionality
class AIAssistant {
    constructor() {
        this.button = document.getElementById('aiButton');
        this.chatWindow = document.getElementById('aiChatWindow');
        this.chatMessages = document.getElementById('chatMessages');
        this.chatInput = document.getElementById('chatInput');
        this.chatHeader = document.querySelector('.chat-header');
        
        // 拖动相关的状态
        this.isDragging = false;
        this.currentX = 0;
        this.currentY = 0;
        this.initialX = 0;
        this.initialY = 0;
        this.xOffset = 0;
        this.yOffset = 0;
        
        this.init();
    }

    init() {
        // 基本事件监听
        this.button.addEventListener('click', () => this.toggleChat());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
        
        // 拖动事件监听
        this.chatHeader.addEventListener('mousedown', (e) => this.dragStart(e));
        document.addEventListener('mousemove', (e) => this.drag(e));
        document.addEventListener('mouseup', () => this.dragEnd());
        
        // 触摸设备支持
        this.chatHeader.addEventListener('touchstart', (e) => this.dragStart(e), { passive: false });
        document.addEventListener('touchmove', (e) => this.drag(e), { passive: false });
        document.addEventListener('touchend', () => this.dragEnd());
    }

    dragStart(e) {
        if (e.type === 'touchstart') {
            e.preventDefault(); // 防止触摸设备上的滚动
            const touch = e.touches[0];
            this.initialX = touch.clientX - this.xOffset;
            this.initialY = touch.clientY - this.yOffset;
        } else {
            this.initialX = e.clientX - this.xOffset;
            this.initialY = e.clientY - this.yOffset;
        }

        if (e.target === this.chatHeader || e.target.parentNode === this.chatHeader) {
            this.isDragging = true;
            this.chatHeader.style.cursor = 'grabbing';
        }
    }

    drag(e) {
        if (this.isDragging) {
            e.preventDefault();

            if (e.type === 'touchmove') {
                const touch = e.touches[0];
                this.currentX = touch.clientX - this.initialX;
                this.currentY = touch.clientY - this.initialY;
            } else {
                this.currentX = e.clientX - this.initialX;
                this.currentY = e.clientY - this.initialY;
            }

            // 限制在视口范围内
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            const chatWidth = this.chatWindow.offsetWidth;
            const chatHeight = this.chatWindow.offsetHeight;

            // 限制X轴移动范围
            this.currentX = Math.min(Math.max(this.currentX, -chatWidth/2), windowWidth - chatWidth/2);
            // 限制Y轴移动范围
            this.currentY = Math.min(Math.max(this.currentY, 0), windowHeight - chatHeight/2);

            this.xOffset = this.currentX;
            this.yOffset = this.currentY;

            this.setTranslate(this.currentX, this.currentY);
        }
    }

    dragEnd() {
        this.isDragging = false;
        this.chatHeader.style.cursor = 'grab';
    }

    setTranslate(xPos, yPos) {
        this.chatWindow.style.transform = `translate(${xPos}px, ${yPos}px)`;
    }

    toggleChat() {
        const isHidden = this.chatWindow.style.display === 'none';
        this.chatWindow.style.display = isHidden ? 'block' : 'none';
        
        if (isHidden) {
            // 重置位置到右下角
            this.xOffset = 0;
            this.yOffset = 0;
            this.setTranslate(0, 0);
        }
    }

    sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.chatInput.value = '';
        
        setTimeout(() => {
            this.addMessage('This is a sample AI assistant response', 'ai');
        }, 1000);
    }

    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}-message`;
        messageDiv.textContent = text;
        this.chatMessages.appendChild(messageDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    new AIAssistant();
    initializeSkillBars();
    handleNavigation();
});

function initializeSkillBars() {
    const skillBars = document.querySelectorAll('.skill-bar');
    skillBars.forEach(bar => {
        const level = bar.dataset.level;
        bar.style.setProperty('--width', `${level}%`);
    });
}

function handleNavigation() {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    const header = document.querySelector('.header');

    // 滚动监听
    window.addEventListener('scroll', () => {
        // 处理header背景
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // 处理当前section高亮
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        // 更新导航链接状态
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });

    // 平滑滚动
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href').slice(1);
            const targetSection = document.getElementById(targetId);
            targetSection.scrollIntoView({ behavior: 'smooth' });
        });
    });
}