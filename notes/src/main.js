/*
    メモ帳 アプリケーションクラス

    作成者: 島袋 叶望
    作成日: 24/08/28

    必要な外部ライブラリ: なし

    内容: localStorageを使ったメモ帳
*/

class App {
    constructor() {
        window.addEventListener('load', this.initialize.bind(this)); // ページのロードが完了したとき、initializeを実行
    }

    // 日時 | ISO形式の日時を返す
    getDateTime() {
        return ((new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' })).replace(' ', 'T')).replaceAll('/', '-');
    }

    // ロード | localStorageのデータを読み込む
    load() {
        let appData = localStorage.getItem(location.href);

        if(!appData) return false;

        try {
            appData = JSON.parse(appData);
        } catch(e) {
            return false
        }

        return appData;
    }

    // セーブ | localStorageにデータを書き込む
    save(appData = {}) {
        if(Object.prototype.toString.call(appData) != '[object Object]') return false;

        return localStorage.setItem(location.href, JSON.stringify(appData));
    }

    // リセット | localStorageのデータを消す
    reset() {
        return localStorage.setItem(location.href, '');
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // 初期化 | UIを構築しlocalStorageにデータがない場合、新しく作成する
    initialize() {
        if(document.querySelector('main')) document.querySelector('main').remove();

        // UI構築
        let contentElement   = `<div class="notes">読み込み中...</div><span class="button addNote">+</span>`;
        let containerElement = `<div class="container">${contentElement}</div>`;
        let mainElement      = `<main>${containerElement}</main>`;

        document.querySelector('body').innerHTML = mainElement;

        // localStorageにデータがない場合、新しく作成する
        if(!this.load()) {
            this.save({
                created: this.getDateTime(), // 作成日時
                updated: this.getDateTime(), // 更新日時
                notes: [] // メモのデータ
            });
        }

        return this.update();
    }

    update() {
        let appData = this.load();

        if(!appData || !'notes' in appData || !Array.isArray(appData.notes)) {
            if(confirm('データが破損しています。\n新しく作成し直しますか？')) {
                this.reset();
                this.initialize();
                return alert('データを新しく作成しました。');
            } else {
                document.querySelector('main .container .notes').innerHTML = 'データが破損しています';
            }

            return false;
        }

        if(appData.notes.length) {
            for(let i = 0; i < appData.notes.length; i++) {}
        } else {
            document.querySelector('main .container .notes').innerHTML = 'メモはまだありません';
        }

        return true;
    }

    edit() {}
}

const app = new App();