/**
 * メニュー制御を管理するモジュール
 */
const MenuController = {
  // 初期化
  init() {
    this.menuButton = document.getElementById('menuButton');
    this.mainNav = document.getElementById('mainNav');
    this.navLinks = this.mainNav ? this.mainNav.querySelectorAll('a') : [];
    this.subMenuTriggers = this.mainNav ? this.mainNav.querySelectorAll('.has-submenu') : [];
    this.subMenus = this.mainNav ? this.mainNav.querySelectorAll('.submenu') : [];
    
    if (!this.menuButton || !this.mainNav) return;
    
    // 初期状態ですべてのサブメニューを閉じる
    this.closeAllSubMenus();
    
    // メニューボタンのクリックイベント
    this.menuButton.addEventListener('click', this.toggleMenu.bind(this));
    
    // サブメニュートリガーのイベント設定
    this.setupSubMenus();
    
    // メニュー項目のクリックイベント設定
    this.setupMenuItemClicks();
  },
  
  // メニュー開閉の切り替え
  toggleMenu() {
    this.menuButton.classList.toggle('menu-open');
    this.mainNav.classList.toggle('open');
    
    // メインメニューを開くときは全サブメニューを閉じてリセット
    if (this.mainNav.classList.contains('open')) {
      this.closeAllSubMenus();
    }
  },
  
  // メニューを閉じる
  closeMenu() {
    this.menuButton.classList.remove('menu-open');
    this.mainNav.classList.remove('open');
  },
  
  // サブメニューのセットアップ
  setupSubMenus() {
    this.subMenuTriggers.forEach(trigger => {
      trigger.addEventListener('click', (e) => {
        e.preventDefault();
        
        // クリックされたトリガーの状態を切り替え
        trigger.classList.toggle('active');
        
        // 隣接するサブメニューを取得して表示/非表示を切り替え
        const subMenu = trigger.nextElementSibling;
        if (subMenu && subMenu.classList.contains('submenu')) {
          subMenu.classList.toggle('open');
        }
      });
    });
  },
  
  // メニュー項目のクリックイベント設定
  setupMenuItemClicks() {
    this.navLinks.forEach(link => {
      // サブメニュートリガーではない通常のリンクのみに適用
      if (!link.classList.contains('has-submenu')) {
        link.addEventListener('click', (e) => {
          // メニューを閉じる
          this.closeMenu();
          
          // セクションIDを持つリンクのみイベント発火
          const sectionId = link.getAttribute('data-section');
          if (sectionId) {
            const event = new CustomEvent('sectionSelected', { 
              detail: { sectionId }
            });
            document.dispatchEvent(event);
            
            // デフォルトの挙動を防止
            e.preventDefault();
          }
        });
      }
    });
  },
  
  // すべてのサブメニューを閉じる
  closeAllSubMenus() {
    if (this.subMenus) {
      this.subMenus.forEach(subMenu => {
        subMenu.classList.remove('open');
      });
    }
    
    if (this.subMenuTriggers) {
      this.subMenuTriggers.forEach(trigger => {
        trigger.classList.remove('active');
      });
    }
  }
};

export default MenuController; 