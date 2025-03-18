import ThemeSwitcher from './theme-switcher.js';
import MenuController from './menu-controller.js';
import ContentLoader from './content-loader.js';

/**
 * アプリケーションのメインクラス
 */
const App = {
  // アプリケーションの初期化
  init() {
    // 各モジュールの初期化
    ThemeSwitcher.init();
    MenuController.init();
    ContentLoader.init();
    
    console.log('Application initialized');
  }
};

// DOMが読み込まれた時にアプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
  App.init();
});

export default App; 