document.addEventListener('DOMContentLoaded', function() {
  // 要素の取得
  const menuButton = document.getElementById('menuButton');
  const mainNav = document.getElementById('mainNav');
  const navLinks = mainNav.querySelectorAll('a');
  const contentContainer = document.getElementById('contentContainer');
  const loadingIndicator = document.getElementById('loading');
  const toggleSwitch = document.querySelector('.theme-switch input[type="checkbox"]');

  // ローカルストレージからテーマ設定を取得
  const currentTheme = localStorage.getItem('theme') ? localStorage.getItem('theme') : null;

  // 保存されたテーマがあれば適用
  if (currentTheme) {
    document.documentElement.setAttribute('class', currentTheme);
    document.body.setAttribute('class', currentTheme);
    
    // ダークモードの場合はスイッチをONにする
    if (currentTheme === 'dark-mode') {
      toggleSwitch.checked = true;
    }
  } else {
    // システム設定のダークモードを検出
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
      toggleSwitch.checked = true;
    }
  }

  // テーマスイッチのイベントリスナー
  toggleSwitch.addEventListener('change', switchTheme, false);

  // テーマ切り替え関数
  function switchTheme(e) {
    if (e.target.checked) {
      document.documentElement.classList.add('dark-mode');
      document.body.classList.add('dark-mode');
      localStorage.setItem('theme', 'dark-mode');
    } else {
      document.documentElement.classList.remove('dark-mode');
      document.body.classList.remove('dark-mode');
      localStorage.setItem('theme', 'light-mode');
    }    
  }

  // メニューボタンのクリックイベント
  menuButton.addEventListener('click', function() {
    menuButton.classList.toggle('menu-open');
    mainNav.classList.toggle('open');
  });

  // デフォルトのセクションを読み込む
  loadSection('top');

  // ナビゲーションリンクのクリックイベント
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // メニューを閉じる
      menuButton.classList.remove('menu-open');
      mainNav.classList.remove('open');
      
      // クリックされたリンクのセクションIDを取得
      const sectionId = this.getAttribute('data-section');
      
      // セクションを読み込む
      loadSection(sectionId);
      
      // URLのハッシュを更新
      window.location.hash = sectionId;
    });
  });
  
  // セクションファイルを読み込む関数
  function loadSection(sectionId) {
    // 読み込み中表示
    loadingIndicator.style.display = 'block';
    
    // ファイルを非同期に読み込む
    fetch(`source/${sectionId}.html`)
      .then(response => {
        if (!response.ok) {
          throw new Error('ファイルの読み込みに失敗しました');
        }
        return response.text();
      })
      .then(html => {
        // セクションのHTML以外の要素を削除
        while (contentContainer.firstChild) {
          if (contentContainer.firstChild.id === 'loading') {
            break;
          }
          contentContainer.removeChild(contentContainer.firstChild);
        }
        
        // 新しいコンテンツを挿入
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        contentContainer.insertBefore(tempDiv.firstChild, loadingIndicator);
        
        // 読み込み中表示を非表示に
        loadingIndicator.style.display = 'none';
      })
      .catch(error => {
        console.error('エラー:', error);
        contentContainer.innerHTML = `<div class="error-message"><p>コンテンツの読み込みに失敗しました: ${error.message}</p></div>`;
        loadingIndicator.style.display = 'none';
      });
  }
  
  // ページ読み込み時に、URLのハッシュに基づいてセクションを表示
  function loadSectionFromHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      loadSection(hash);
    } else {
      // ハッシュがない場合はデフォルトセクションを読み込む
      loadSection('top');
    }
  }
  
  // URLハッシュが変更されたとき
  window.addEventListener('hashchange', loadSectionFromHash);
  
  // 初期表示時
  loadSectionFromHash();
}); 