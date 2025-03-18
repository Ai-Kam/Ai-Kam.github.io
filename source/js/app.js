import ThemeSwitcher from './theme-switcher.js';
import MenuController from './menu-controller.js';
import ContentLoader from './content-loader.js';
import { FormHandler } from './form-handler.js';

/**
 * アプリケーションのメインクラス
 */
const App = {
  // 初期化済みフラグ
  initialized: false,
  
  // アプリケーションの初期化
  init() {
    // 重複初期化を防止
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    
    // 各モジュールの初期化
    ThemeSwitcher.init();
    MenuController.init();
    
    // コンテンツロード後にフォームハンドラーを初期化するようにする
    ContentLoader.onContentLoaded = (path) => {
      // コンテンツロード後の処理
      if (path === 'contact.html') {
        // お問い合わせページの場合のみフォームハンドラーを初期化
        this.initFormHandler();
      }
    };
    
    // コンテンツローダーを初期化
    ContentLoader.init();
    
    // 初期表示時にお問い合わせページであればフォームハンドラーを初期化
    if (window.location.hash === '#contact' || (document.getElementById('contact') && document.getElementById('contact-form'))) {
      this.initFormHandler();
    }
    
    // 初期化完了後、確実にサブメニューを閉じる
    setTimeout(() => {
      if (MenuController && typeof MenuController.closeAllSubMenus === 'function') {
        MenuController.closeAllSubMenus();
      }
    }, 200);
  },
  
  // フォームハンドラーの初期化を実行
  initFormHandler() {
    // フォーム要素があるか確認
    if (document.getElementById('contact-form')) {
      // 少し遅延して実行（コンテンツが読み込まれるのを待つ）
      setTimeout(() => {
        try {
          FormHandler.init();
        } catch (e) {
          console.error('フォームハンドラー初期化エラー:', e);
          
          // 失敗した場合は再試行（1回のみ）
          if (!FormHandler.form) {
            setTimeout(() => {
              try {
                FormHandler.init();
              } catch (e) {
                console.error('フォームハンドラー最終試行エラー:', e);
              }
            }, 1500);
          }
        }
      }, 500);
    }
  }
};

// DOMが読み込まれた時にアプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

// 既にDOMが読み込まれている場合のフォールバック
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    App.init();
  }, 100);
}

export default App; 