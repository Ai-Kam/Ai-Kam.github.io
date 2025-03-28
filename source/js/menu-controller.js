/**
 * メニュー制御を管理するモジュール
 */
const MenuController = {
  // 初期化
  init() {
    this.menuButton = document.getElementById('menuButton');
    this.mainNav = document.getElementById('mainNav');
    this.navLinks = this.mainNav ? this.mainNav.querySelectorAll('a') : [];
    this.subMenuToggles = this.mainNav ? this.mainNav.querySelectorAll('.submenu-toggle') : [];
    this.subMenus = this.mainNav ? this.mainNav.querySelectorAll('.submenu') : [];
    
    if (!this.menuButton || !this.mainNav) return;
    
    // 初期状態ですべてのサブメニューを閉じる
    this.closeAllSubMenus();
    
    // メニューボタンのクリックイベント
    this.menuButton.addEventListener('click', this.toggleMenu.bind(this));
    
    // サブメニュートグルボタンのイベント設定
    this.setupSubMenuToggles();
    
    // メニュー項目のクリックイベント設定
    this.setupMenuItemClicks();
    
    // ページ完全読み込み後にもサブメニューを確実に閉じる
    window.addEventListener('load', () => {
      setTimeout(() => {
        this.closeAllSubMenus();
      }, 100);
    });
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
  
  // サブメニュートグルボタンのセットアップ
  setupSubMenuToggles() {
    this.subMenuToggles.forEach(toggle => {
      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation(); // イベントの伝播を防止
        
        // トグルボタンの状態を切り替え
        toggle.classList.toggle('active');
        
        // 親要素のli（has-submenuクラスを持つ）を取得
        const parentLi = toggle.closest('.has-submenu');
        if (parentLi) {
          parentLi.classList.toggle('active');
          
          // 隣接するサブメニューを取得して表示/非表示を切り替え
          const subMenu = parentLi.querySelector('.submenu');
          if (subMenu) {
            subMenu.classList.toggle('open');
            
            // 同レベルの他のサブメニューを閉じる
            const siblingMenuItems = this.getSiblings(parentLi);
            siblingMenuItems.forEach(sibling => {
              if (sibling.classList.contains('has-submenu')) {
                sibling.classList.remove('active');
                const siblingToggle = sibling.querySelector('.submenu-toggle');
                const siblingSubMenu = sibling.querySelector('.submenu');
                
                if (siblingToggle) siblingToggle.classList.remove('active');
                if (siblingSubMenu) siblingSubMenu.classList.remove('open');
              }
            });
          }
        }
      });
    });
  },
  
  // 同レベルの要素を取得するヘルパー関数
  getSiblings(element) {
    const siblings = [];
    let sibling = element.parentNode.firstChild;
    
    while (sibling) {
      if (sibling.nodeType === 1 && sibling !== element) {
        siblings.push(sibling);
      }
      sibling = sibling.nextSibling;
    }
    
    return siblings;
  },
  
  // メニュー項目のクリックイベント設定
  setupMenuItemClicks() {
    this.navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        // サブメニュートグルボタンのクリックは別処理
        if (link.parentNode.classList.contains('submenu-toggle')) {
          return;
        }
        
        // サブメニューのリンクの場合はメニューを閉じる
        if (!link.classList.contains('has-submenu')) {
          this.closeMenu();
        }
        
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
    });
  },
  
  // すべてのサブメニューを閉じる
  closeAllSubMenus() {
    if (this.subMenus) {
      this.subMenus.forEach(subMenu => {
        subMenu.classList.remove('open');
      });
    }
    
    const activeMenuItems = this.mainNav ? this.mainNav.querySelectorAll('.has-submenu.active') : [];
    activeMenuItems.forEach(item => {
      item.classList.remove('active');
    });
    
    const activeToggles = this.mainNav ? this.mainNav.querySelectorAll('.submenu-toggle.active') : [];
    activeToggles.forEach(toggle => {
      toggle.classList.remove('active');
    });
  }
};

export default MenuController; 