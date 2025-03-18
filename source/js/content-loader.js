/**
 * コンテンツの動的読み込み機能を管理するモジュール
 */
const ContentLoader = {
  // 初期化
  init() {
    this.contentContainer = document.getElementById('contentContainer');
    this.loadingIndicator = document.getElementById('loading');
    
    if (!this.contentContainer || !this.loadingIndicator) return;
    
    // URLハッシュ変更イベントの監視
    window.addEventListener('hashchange', this.handleHashChange.bind(this));
    
    // セクション選択イベントの監視（メニューからの選択）
    document.addEventListener('sectionSelected', (e) => {
      const sectionId = e.detail.sectionId;
      this.loadSection(sectionId);
      window.location.hash = sectionId;
    });
    
    // 初期表示
    this.handleHashChange();
  },
  
  // URLハッシュ変更時の処理
  handleHashChange() {
    const hash = window.location.hash.substring(1);
    if (hash) {
      this.loadSection(hash);
    } else {
      // ハッシュがない場合はデフォルトセクションを読み込む
      this.loadSection('top');
    }
  },
  
  // セクションIDからファイルパスを解決する
  resolveFilePath(sectionId) {
    // セクションIDに基づいて適切なファイルパスを返す
    const pathMap = {
      // トップレベル
      'top': 'top.html',
      'contact': 'contact.html',
      
      // プロフィール関連
      'about': 'about/index.html',
      'about-introduction': 'about/introduction.html',
      'career': 'about/career.html',
      
      // 作品・活動関連
      'portfolio': 'portfolio/index.html',
      'portfolio-detail': 'portfolio/detail.html',
      'projects': 'portfolio/projects.html',
      
      // 資料・備忘録関連
      'notes': 'notes/index.html',
      'notes-xx': 'notes/xx/index.html',
      'notes-xx-1': 'notes/xx/part1.html',
      'notes-xx-2': 'notes/xx/part2.html',
      'notes-yy': 'notes/yy/index.html',
      'notes-yy-1': 'notes/yy/part1.html',
      'notes-yy-2': 'notes/yy/part2.html'
    };
    
    return pathMap[sectionId] || `${sectionId}.html`;
  },
  
  // セクション読み込み関数
  loadSection(sectionId) {
    // 読み込み中表示
    this.loadingIndicator.style.display = 'block';
    
    // ファイルパスを解決
    const filePath = this.resolveFilePath(sectionId);
    
    // ファイルを非同期に読み込む
    fetch(`source/html/${filePath}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('ファイルの読み込みに失敗しました');
        }
        return response.text();
      })
      .then(html => {
        // セクションのHTML以外の要素を削除
        while (this.contentContainer.firstChild) {
          if (this.contentContainer.firstChild.id === 'loading') {
            break;
          }
          this.contentContainer.removeChild(this.contentContainer.firstChild);
        }
        
        // 新しいコンテンツを挿入
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        this.contentContainer.insertBefore(tempDiv.firstChild, this.loadingIndicator);
        
        // 読み込み中表示を非表示に
        this.loadingIndicator.style.display = 'none';
      })
      .catch(error => {
        console.error('エラー:', error);
        this.contentContainer.innerHTML = `<div class="error-message"><p>コンテンツの読み込みに失敗しました: ${error.message}</p></div>`;
        this.loadingIndicator.style.display = 'none';
      });
  }
};

export default ContentLoader; 