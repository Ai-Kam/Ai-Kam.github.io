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
    if (!this.form) {
      console.error('contact-formが見つかりません');
      return;
    }
    console.log('フォームを初期化します', this.form);

    // フォーム送信イベントの設定
    this.form.addEventListener('submit', this.handleSubmit.bind(this));
    console.log('送信イベントリスナーを設定しました');

    // 入力フィールドのバリデーションイベントを設定
    const inputs = this.form.querySelectorAll('input, select, textarea');
    console.log(`${inputs.length}個の入力フィールドを検出`);
    
    inputs.forEach(input => {
      input.addEventListener('input', () => this.validateField(input));
      input.addEventListener('blur', () => this.validateField(input));
    });

    // チェックボックスの変更イベントを設定
    const checkbox = this.form.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.addEventListener('change', () => this.validateField(checkbox));
      console.log('チェックボックスイベントを設定しました');
    }
    
    // 送信完了画面の「戻る」ボタンの設定
    this.setupBackButton();
    
    // 初期化完了時にテスト用の送信ボタンイベントを手動で追加
    const submitButton = this.form.querySelector('button[type="submit"]');
    if (submitButton) {
      submitButton.addEventListener('click', () => {
        console.log('送信ボタンがクリックされました');
      });
    }
    
    console.log('Form handler initialized');
    
    // 初期化完了チェック
    setTimeout(() => {
      console.log('フォームハンドラーの初期化状態を確認:',
        'フォーム要素:', !!this.form,
        '送信ボタン:', !!submitButton
      );
    }, 1000);
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
    console.log('フォーム送信処理を開始');

    if (!this.validateForm()) {
      console.log('バリデーションエラー: 送信を中止');
      return;
    }

    const submitButton = this.form.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    submitButton.textContent = '送信中...';
    console.log('送信ボタンを無効化');

    try {
      console.log('Google Formsへの送信を準備');
      // GoogleフォームのURL（実際のIDに変更）
      const googleFormUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSdwJB07XtfXAZ8qY3mAZWMTg9OJE21B8wb8Bn5MWMmOzKefBA/formResponse';
      
      // フォームデータを収集
      const formData = new FormData(this.form);
      console.log('フォームデータを収集', [...formData.entries()]);
      
      // 直接fetchを使用して送信（シンプルに戻す）
      console.log('成功メッセージを表示');
      this.showSuccessMessage();
      
      console.log('Google Formsにデータを送信');
      fetch(googleFormUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: formData
      })
      .then(() => {
        console.log('送信完了（レスポンスは取得できません）');
      })
      .catch(error => {
        console.error('Fetch送信エラー:', error);
      });
      
      // フォームをリセット
      this.form.reset();
      console.log('フォームをリセット');

    } catch (error) {
      console.error('フォーム送信エラー:', error);
      
      // エラー時も成功メッセージを表示（ユーザー体験向上のため）
      this.showSuccessMessage();
      
      // エラーログはコンソールにのみ出力
      console.warn('エラーが発生しましたが、フォームの送信は完了した可能性があります');
    } finally {
      // ボタンの状態を戻す
      submitButton.disabled = false;
      submitButton.textContent = '送信する';
      console.log('送信処理完了');
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