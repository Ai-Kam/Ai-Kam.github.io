/**
 * フォームハンドラーモジュール
 * Google Formsへの送信を管理します
 */
export const FormHandler = {
  /**
   * 初期化
   */
  init() {
    this.form = document.getElementById('contact-form');
    if (!this.form) return;

    // フォーム送信イベントの設定
    this.form.addEventListener('submit', this.handleSubmit.bind(this));

    // 入力フィールドのバリデーションイベントを設定
    const inputs = this.form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
      input.addEventListener('input', () => this.validateField(input));
      input.addEventListener('blur', () => this.validateField(input));
    });

    // チェックボックスの変更イベントを設定
    const checkbox = this.form.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.addEventListener('change', () => this.validateField(checkbox));
    }
    
    // 送信完了画面の「戻る」ボタンの設定
    this.setupBackButton();
    
    console.log('Form handler initialized');
  },

  /**
   * フィールドのバリデーション
   * @param {HTMLElement} field - バリデーション対象のフィールド
   */
  validateField(field) {
    const value = field.value.trim();
    const isRequired = field.hasAttribute('required');
    const type = field.type;
    const errorElement = this.getErrorElement(field);

    // 必須チェック
    if (isRequired && !value) {
      this.showError(field, errorElement, 'この項目は必須です');
      return false;
    }

    // メールアドレスの形式チェック
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        this.showError(field, errorElement, '有効なメールアドレスを入力してください');
        return false;
      }
    }

    // チェックボックスの必須チェック
    if (type === 'checkbox' && isRequired && !field.checked) {
      this.showError(field, errorElement, '個人情報の取り扱いについて同意してください');
      return false;
    }

    // エラーをクリア
    this.clearError(field, errorElement);
    return true;
  },

  /**
   * エラーメッセージを表示
   * @param {HTMLElement} field - エラーが発生したフィールド
   * @param {HTMLElement} errorElement - エラーメッセージを表示する要素
   * @param {string} message - エラーメッセージ
   */
  showError(field, errorElement, message) {
    field.classList.add('error');
    errorElement.textContent = message;
    errorElement.style.display = 'block';
  },

  /**
   * エラーをクリア
   * @param {HTMLElement} field - エラーをクリアするフィールド
   * @param {HTMLElement} errorElement - エラーメッセージを表示する要素
   */
  clearError(field, errorElement) {
    field.classList.remove('error');
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  },

  /**
   * エラーメッセージ要素を取得
   * @param {HTMLElement} field - フィールド要素
   * @returns {HTMLElement} エラーメッセージ要素
   */
  getErrorElement(field) {
    let errorElement = field.nextElementSibling;
    if (!errorElement || !errorElement.classList.contains('error-message')) {
      errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      field.parentNode.insertBefore(errorElement, field.nextSibling);
    }
    return errorElement;
  },

  /**
   * フォーム全体のバリデーション
   * @returns {boolean} バリデーション結果
   */
  validateForm() {
    const inputs = this.form.querySelectorAll('input, select, textarea');
    let isValid = true;

    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  },

  /**
   * フォーム送信の処理
   * @param {Event} event - 送信イベント
   */
  async handleSubmit(event) {
    event.preventDefault();

    if (!this.validateForm()) {
      return;
    }

    const submitButton = this.form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';

    try {
      // 成功メッセージを表示
      this.showSuccessMessage();

      // フォームデータを収集
      const formData = new FormData(this.form);
      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      
      // Google FormsのURLを構築
      const formBaseUrl = this.form.action;
      const formUrl = formBaseUrl.replace('/viewform', '/formResponse');
      
      // フォームデータでiframeを作成して送信（バックグラウンド処理）
      const iframe = document.createElement('iframe');
      iframe.style.display = 'none';
      document.body.appendChild(iframe);
      
      // iframe内にフォームを作成して自動送信
      const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
      iframeDoc.open();
      iframeDoc.write(`
        <form id="hidden-form" action="${formUrl}" method="POST">
          ${Object.entries(data).map(([key, value]) => 
            `<input type="hidden" name="${key}" value="${value.replace(/"/g, '&quot;')}">`
          ).join('')}
        </form>
        <script>
          document.getElementById('hidden-form').submit();
        </script>
      `);
      iframeDoc.close();
      
      // 3秒後にiframeを削除
      setTimeout(() => {
        document.body.removeChild(iframe);
      }, 3000);

    } catch (error) {
      console.error('フォーム送信エラー:', error);
      submitButton.disabled = false;
      submitButton.textContent = '送信';
      alert('送信に失敗しました。もう一度お試しください。');
    }
  },

  /**
   * 成功メッセージを表示
   */
  showSuccessMessage() {
    const formContainer = document.getElementById('contact-form-container');
    const successMessage = document.getElementById('form-success');
    
    if (formContainer && successMessage) {
      formContainer.style.display = 'none';
      successMessage.classList.remove('hidden');
    }
  },

  /**
   * 「戻る」ボタンの設定
   */
  setupBackButton() {
    const backButton = document.getElementById('back-button');
    if (backButton) {
      backButton.addEventListener('click', () => {
        window.location.href = '/'; // トップページに戻る
      });
    }
  }
}; 