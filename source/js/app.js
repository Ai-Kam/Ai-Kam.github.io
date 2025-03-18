import ThemeSwitcher from './theme-switcher.js';
import MenuController from './menu-controller.js';
import ContentLoader from './content-loader.js';
import { FormHandler } from './form-handler.js';

/**
 * アプリケーションのメインクラス
 */
const App = {
  // アプリケーションの初期化
  init() {
    // 各モジュールの初期化
    console.log('アプリケーションの初期化を開始');
    ThemeSwitcher.init();
    MenuController.init();
    ContentLoader.init();
    
    // DOMの読み込み完了を確認してからフォームハンドラーを初期化
    console.log('フォームハンドラーの初期化を準備');
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
      // DOMがすでに読み込まれている場合
      console.log('DOMは既に読み込まれています');
      setTimeout(() => {
        FormHandler.init();
      }, 100);
    } else {
      // DOMの読み込みを待つ
      console.log('DOMの読み込みを待機します');
      document.addEventListener('DOMContentLoaded', () => {
        setTimeout(() => {
          FormHandler.init();
        }, 100);
      });
    }
    
    // 初期化完了後、確実にサブメニューを閉じる
    setTimeout(() => {
      if (MenuController && typeof MenuController.closeAllSubMenus === 'function') {
        MenuController.closeAllSubMenus();
      }
    }, 200);
    
    console.log('Application initialized');
  }
};

// DOMが読み込まれた時にアプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded イベント発生');
  App.init();
});

// 既にDOMが読み込まれている場合のフォールバック
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  console.log('DOM既に読み込み済み - 直接初期化');
  setTimeout(() => {
    App.init();
  }, 10);
}

export default App; 