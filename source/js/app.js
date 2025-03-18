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
    
    // フォームハンドラーの初期化は遅延して実行
    this.initFormHandler();
    
    // 初期化完了後、確実にサブメニューを閉じる
    setTimeout(() => {
      if (MenuController && typeof MenuController.closeAllSubMenus === 'function') {
        MenuController.closeAllSubMenus();
      }
    }, 200);
    
    console.log('Application initialized');
  },
  
  // フォームハンドラーの初期化を複数回試行する
  initFormHandler() {
    console.log('フォームハンドラーの初期化を準備');
    
    // まず1回目の試行
    setTimeout(() => {
      console.log('フォームハンドラー初期化: 1回目試行');
      try {
        FormHandler.init();
      } catch (e) {
        console.error('フォームハンドラー初期化エラー(1回目):', e);
      }
      
      // フォームが見つからない場合は2回目を試行
      if (!FormHandler.form) {
        setTimeout(() => {
          console.log('フォームハンドラー初期化: 2回目試行');
          try {
            FormHandler.init();
          } catch (e) {
            console.error('フォームハンドラー初期化エラー(2回目):', e);
          }
          
          // 最後の試行
          if (!FormHandler.form) {
            setTimeout(() => {
              console.log('フォームハンドラー初期化: 最終試行');
              try {
                FormHandler.init();
              } catch (e) {
                console.error('フォームハンドラー初期化エラー(最終):', e);
                console.warn('お問い合わせフォームの初期化に失敗しました。ページを再読み込みしてください。');
              }
            }, 2000);
          }
        }, 1000);
      }
    }, 500);
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
  }, 100);
}

export default App; 