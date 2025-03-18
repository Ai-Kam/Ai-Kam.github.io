/**
 * メニュー制御を管理するモジュール
 */
const MenuController = {
  // 初期化
  init() {
    this.menuButton = document.getElementById('menuButton');
    this.mainNav = document.getElementById('mainNav');
    this.navLinks = this.mainNav ? this.mainNav.querySelectorAll('a') : [];
    
    if (!this.menuButton || !this.mainNav) return;
    
    // メニューボタンのクリックイベント
    this.menuButton.addEventListener('click', this.toggleMenu.bind(this));
    
    // メニュー項目のクリックイベント設定
    this.setupMenuItemClicks();
  },
  
  // メニュー開閉の切り替え
  toggleMenu() {
    this.menuButton.classList.toggle('menu-open');
    this.mainNav.classList.toggle('open');
  },
  
  // メニューを閉じる
  closeMenu() {
    this.menuButton.classList.remove('menu-open');
    this.mainNav.classList.remove('open');
  },
  
  // メニュー項目のクリックイベント設定
  setupMenuItemClicks() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // メニューを閉じる
        this.closeMenu();
        
        // セクションIDを取得してイベント発火（カスタムイベント）
        const sectionId = link.getAttribute('data-section');
        const event = new CustomEvent('sectionSelected', { 
          detail: { sectionId }
        });
        document.dispatchEvent(event);
        
        // デフォルトの挙動を防止
        e.preventDefault();
      });
    });
  }
};

export default MenuController; 