/**
 * フォームハンドラーモジュール
 * Googleフォームの埋め込みに関する処理を行います
 */
export const FormHandler = {
  // 初期化済みフラグ
  initialized: false,
  
  /**
   * 初期化
   * Googleフォーム埋め込みは自動的に処理されるため、
   * ほとんどの処理は不要になります
   */
  init() {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    
    console.log('Googleフォーム埋め込みモードで初期化しました');
    
    // iframeの読み込み完了時の処理
    this.setupIframeEvents();
  },

  /**
   * iframeのイベント設定
   */
  setupIframeEvents() {
    // iframeが存在するか確認
    const formContainer = document.querySelector('.google-form-container');
    if (!formContainer) {
      return;
    }
    
    const iframe = formContainer.querySelector('iframe');
    if (!iframe) {
      return;
    }
    
    // iframeの読み込み完了時にローディング表示を消す処理などを追加できます
    iframe.addEventListener('load', () => {
      console.log('Googleフォームの読み込みが完了しました');
      // 必要に応じて追加の処理
    });
  }
}; 