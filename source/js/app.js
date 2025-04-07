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
  
  // 前後のページ矢印を取得
  const prevArrow = pagination.querySelector('.pagination-arrow:first-child');
  const nextArrow = pagination.querySelector('.pagination-arrow:last-child');
  
  // 一度すべてのページ番号を非表示
  pageNumbers.forEach(page => {
    page.style.display = 'none';
  });
  
  // 常に表示するページ番号を決定
  const firstPage = pageNumbers[0];
  const lastPage = pageNumbers[pageNumbers.length - 1];
  
  // 常に最初と最後のページは表示
  firstPage.style.display = 'inline-flex';
  lastPage.style.display = 'inline-flex';
  
  // 省略記号の要素を作成
  const createEllipsis = () => {
    const ellipsis = document.createElement('span');
    ellipsis.className = 'pagination-ellipsis';
    ellipsis.textContent = '...';
    return ellipsis;
  };
  
  // 既存の省略記号を削除
  pagination.querySelectorAll('.pagination-ellipsis').forEach(el => el.remove());
  
  // 表示するページ番号を決定
  let pagesToShow = [1, totalPages];
  
  if (activePage > 3) {
    pagesToShow.push(activePage - 1);
  }
  
  pagesToShow.push(activePage);
  
  if (activePage < totalPages - 2) {
    pagesToShow.push(activePage + 1);
  }
  
  // 表示するページを設定
  pageNumbers.forEach(page => {
    const pageNum = parseInt(page.textContent);
    if (pagesToShow.includes(pageNum)) {
      page.style.display = 'inline-flex';
    }
  });
  
  // 省略記号の追加
  if (activePage > 4) {
    // 最初のページの後に省略記号
    const firstEllipsis = createEllipsis();
    pagination.insertBefore(firstEllipsis, pageNumbers[1].nextSibling);
  }
  
  if (activePage < totalPages - 3) {
    // 最後のページの前に省略記号
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