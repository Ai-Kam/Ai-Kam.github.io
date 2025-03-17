document.addEventListener('DOMContentLoaded', function() {
  // 要素の取得
  const menuButton = document.getElementById('menuButton');
  const mainNav = document.getElementById('mainNav');
  const navLinks = mainNav.querySelectorAll('a');
  const sections = document.querySelectorAll('section');
  const container = document.querySelector('.container');

  // メニューボタンのクリックイベント
  menuButton.addEventListener('click', function() {
    menuButton.classList.toggle('menu-open');
    mainNav.classList.toggle('open');
  });

  // ナビゲーションリンクのクリックイベント
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // メニューを閉じる
      menuButton.classList.remove('menu-open');
      mainNav.classList.remove('open');
      
      // クリックされたリンクのセクションIDを取得
      const sectionId = this.getAttribute('data-section');
      
      // 現在表示されているすべてのセクションを非表示にする
      sections.forEach(section => {
        section.style.display = 'none';
      });
      
      // 選択されたセクションのみを表示する
      const targetSection = document.getElementById(sectionId);
      if (targetSection) {
        targetSection.style.display = 'block';
      }
      
      // URLのハッシュを更新
      window.location.hash = sectionId;
    });
  });
  
  // ページ読み込み時に、URLのハッシュに基づいてセクションを表示
  function showSectionFromHash() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      // すべてのセクションを非表示
      sections.forEach(section => {
        section.style.display = 'none';
      });
      
      // ハッシュに一致するセクションを表示
      const targetSection = document.getElementById(hash);
      if (targetSection) {
        targetSection.style.display = 'block';
      }
    }
  }
  
  // 初期表示
  showSectionFromHash();
  
  // ハッシュが変更された時も対応
  window.addEventListener('hashchange', showSectionFromHash);
}); 