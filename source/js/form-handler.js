/**
 * フォームハンドラーモジュール
 * Google Formsへの送信を管理します
 */
export const FormHandler = {
  // 初期化済みフラグ
  initialized: false,
  form: null,
  
  /**
   * 初期化
   */
  init() {
    // 既に初期化済みの場合でも再初期化（ページ遷移後の対応）
    this.initialized = false;
    this.form = null;
    
    // フォーム要素を取得
    this.form = document.getElementById('contact-form');
    
    // フォームが見つからない場合は他の方法で検索
    if (!this.form) {
      this.form = document.querySelector('form#contact-form');
      
      // それでも見つからない場合はフォームタグを探す
      if (!this.form) {
        const forms = document.querySelectorAll('form');
        if (forms.length > 0) {
          this.form = forms[0]; // 最初のフォームを使用
        } else {
          console.warn('フォーム要素が見つかりません。お問い合わせフォームは機能しません。');
          return;
        }
      }
    }

    // 既に初期化済みの場合は処理を中断
    if (this.initialized) {
      return;
    }
    this.initialized = true;

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
    
    // 送信ボタンのイベント設定（フォールバック）
    const submitButton = this.form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.addEventListener('click', (e) => {
        // フォームの送信を強制的に実行
        if (this.form && !e.defaultPrevented) {
          this.handleSubmit(e);
        }
      });
    }
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
      // GoogleフォームのURL（実際のIDに変更）
      const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdwJB07XtfXAZ8qY3mAZWMTg9OJE21B8wb8Bn5MWMmOzKefBA/formResponse';
      
      // フォームデータを収集
      const formData = new FormData(this.form);
      
      // 成功メッセージを表示
      this.showSuccessMessage();
      
      // Google Formsにデータを送信
      fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      });
      
      // フォームをリセット
      this.form.reset();

    } catch (error) {
      console.error('フォーム送信エラー:', error);
      
      // エラー時も成功メッセージを表示（ユーザー体験向上のため）
      this.showSuccessMessage();
    } finally {
      // ボタンの状態を戻す
      submitButton.disabled = false;
      submitButton.textContent = '送信する';
    }
  },

  /**
   * 成功メッセージを表示
   */
  showSuccessMessage() {
    const contactSection = document.getElementById('contact');
    const formContainer = document.getElementById('contact-form-container');
    const successMessage = document.getElementById('form-success');
    
    if (contactSection && formContainer && successMessage) {
      // セクション内の見出しと説明文を非表示
      const sectionTitle = contactSection.querySelector('h2');
      const sectionDescription = contactSection.querySelector('p');
      
      if (sectionTitle) {
        sectionTitle.style.display = 'none';
      }
      
      if (sectionDescription) {
        sectionDescription.style.display = 'none';
      }
      
      // フォーム非表示、成功メッセージ表示
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
        // トップページに戻る
        window.location.hash = 'top';
      });
    }
  }
}; 