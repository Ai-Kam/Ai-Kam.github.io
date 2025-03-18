/**
 * テーマ切り替え機能を管理するモジュール
 */
const ThemeSwitcher = {
  // 初期化
  init() {
    this.toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');
    if (!this.toggleSwitch) return;
    
    // テーマスイッチのイベントリスナー
    this.toggleSwitch.addEventListener('change', this.switchTheme.bind(this));
    
    // 初期テーマを設定
    this.setInitialTheme();
  },
  
  // テーマ切り替え関数
  switchTheme(e) {
    if (e.target.checked) {
      // ダークモードに切り替え
      document.documentElement.classList.add('dark-mode');
      document.documentElement.classList.remove('light-mode');
      document.body.classList.add('dark-mode');
      document.body.classList.remove('light-mode');
      localStorage.setItem('theme', 'dark-mode');
    } else {
      // ライトモードに切り替え
      document.documentElement.classList.remove('dark-mode');
      document.documentElement.classList.add('light-mode');
      document.body.classList.remove('dark-mode');
      document.body.classList.add('light-mode');
      localStorage.setItem('theme', 'light-mode');
    }    
  },
  
  // 初期テーマの設定
  setInitialTheme() {
    // ローカルストレージからユーザー設定を確認
    const userTheme = localStorage.getItem('theme');
    
    if (userTheme) {
      // ローカルストレージに保存されたユーザー設定があればそれを優先
      if (userTheme === 'dark-mode') {
        document.documentElement.classList.add('dark-mode');
        document.documentElement.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        document.body.classList.remove('light-mode');
        this.toggleSwitch.checked = true;
      } else {
        document.documentElement.classList.remove('dark-mode');
        document.documentElement.classList.add('light-mode');
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        this.toggleSwitch.checked = false;
      }
    } else {
      // ユーザー設定がない場合はシステム設定を利用
      const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (prefersDarkMode) {
        document.documentElement.classList.add('dark-mode');
        document.body.classList.add('dark-mode');
        this.toggleSwitch.checked = true;
      } else {
        document.documentElement.classList.add('light-mode');
        document.body.classList.add('light-mode');
        this.toggleSwitch.checked = false;
      }
    }
  }
};

export default ThemeSwitcher; 