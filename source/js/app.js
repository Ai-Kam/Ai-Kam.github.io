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
    
    // コンテンツロード後の処理を設定
    const originalOnContentLoaded = ContentLoader.onContentLoaded;
    ContentLoader.onContentLoaded = (path) => {
      // 元のコールバックがあれば実行
      if (typeof originalOnContentLoaded === 'function') {
        originalOnContentLoaded(path);
      }
      
      // コンテンツロード後の処理
      if (path === 'contact.html') {
        // お問い合わせページの場合のみフォームハンドラーを初期化
        this.initFormHandler();
      }
      
      // ページネーションの設定を更新
      setupPagination();
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

/**
 * 拡張ページネーション処理
 * 7ページ以上ある場合は省略表示を適用
 */
// ページネーション設定関数をグローバル化
const setupPagination = () => {
  const pagination = document.querySelector('.pagination');
  if (!pagination) return;

  // すべてのページ番号を取得
  const pageNumbers = pagination.querySelectorAll('.pagination-number');
  const totalPages = pageNumbers.length;
  
  // 7ページ未満の場合は何もしない
  if (totalPages < 7) return;
  
  // 現在のアクティブページを取得
  const activePage = parseInt(pagination.querySelector('.pagination-number.active').textContent);
  
  // すべてのページ番号と省略記号を一旦非表示にする
  pageNumbers.forEach(page => {
    page.style.display = 'none';
  });
  
  // 既存の省略記号を削除
  pagination.querySelectorAll('.pagination-ellipsis').forEach(el => el.remove());
  
  // 常に表示するページ番号の決定と表示
  const firstPage = pageNumbers[0]; // 最初のページ
  const lastPage = pageNumbers[pageNumbers.length - 1]; // 最後のページ
  
  // 最初と最後のページは常に表示
  firstPage.style.display = 'inline-flex';
  lastPage.style.display = 'inline-flex';
  
  // 省略記号を作成する関数
  const createEllipsis = () => {
    const ellipsis = document.createElement('span');
    ellipsis.className = 'pagination-ellipsis';
    ellipsis.textContent = '...';
    return ellipsis;
  };

  // 表示すべきページ番号の決定（現在のページとその前後）
  let pagesToShow = [];
  
  // 現在のページとその前後のページを表示
  for (let i = Math.max(1, activePage - 1); i <= Math.min(totalPages, activePage + 1); i++) {
    pagesToShow.push(i);
  }
  
  // ページ番号の表示を設定
  pageNumbers.forEach(page => {
    const pageNum = parseInt(page.textContent);
    if (pagesToShow.includes(pageNum) || pageNum === 1 || pageNum === totalPages) {
      page.style.display = 'inline-flex';
    }
  });
  
  // 省略記号の追加
  // 最初のページと表示されるページの間に隙間がある場合、省略記号を追加
  if (!pagesToShow.includes(2) && totalPages > 2) {
    const firstEllipsis = createEllipsis();
    pagination.insertBefore(firstEllipsis, pageNumbers[1]);
  }
  
  // 最後のページと表示されるページの間に隙間がある場合、省略記号を追加
  if (!pagesToShow.includes(totalPages - 1) && totalPages > 2) {
    const lastEllipsis = createEllipsis();
    pagination.insertBefore(lastEllipsis, pageNumbers[pageNumbers.length - 1]);
  }
};

// ページネーション初期化関数
function initPagination() {
  // 初期表示でも実行
  setupPagination();
}

// DOMが読み込まれた時にアプリケーションを初期化
document.addEventListener('DOMContentLoaded', () => {
  App.init();
  
  // 拡張ページネーション機能を初期化
  initPagination();
});

// 既にDOMが読み込まれている場合のフォールバック
if (document.readyState === 'complete' || document.readyState === 'interactive') {
  setTimeout(() => {
    App.init();
  }, 100);
}

export default App; 