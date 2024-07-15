/*
    タイピングゲーム アプリケーションクラス

    作成者: 島袋 叶望
    作成日: 24/07/11

    必要な外部ライブラリ: なし

    内容: タイピングゲーム（問題はjsonファイルから読みこむ）
*/

class App {
    // コンストラクター
    constructor() {
        this.eventHandlers = []; // イベントハンドラー管理用
        this.intervals     = []; // インターバル管理用

        // ページのロードが完了したとき、タイトル画面を描画する関数を実行する
        window.addEventListener('load', () => {
            this.title();
        });
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // jsonファイルを読み込む
    fetchJSON(filePath = '', callback = () => {}) {
        fetch(filePath)
            .then(response => response.json())
            .then(data => callback(data))
            .catch(error => console.error('fetching error: ', error));

        return true;
    }

    // 「1」を「01」にしてくれる関数
    twoDigit(num) {
        return num < 10 ? '0' + num : num.toString();
    }

    ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

    // タイトル
    title() {
        // 全てのイベントハンドラーを解除（この関数の前に実行された関数でリスナーされたイベントのハンドラーは全て不要なため）
        if(this.eventHandlers.length) {
            for(let i = 0; i < this.eventHandlers.length; i++) {
                if(this.eventHandlers[i]) document.removeEventListener(this.eventHandlers[i].typeName, this.eventHandlers[i].callback);
            }

            this.eventHandlers = [];
        }

        // UIを構築し描画
        let titleElement     = '<div class="title"><h1>タイピングゲーム</h1><button onclick="app.playTypingGame();">ゲーム開始</button></div>';
        let containerElement = '<div class="container">' + titleElement + '</div>';
        let mainElement      = '<main>' + containerElement + '</main>';

        document.querySelector('body').innerHTML = mainElement;

        return true;
    }

    // タイピングゲームを準備
    playTypingGame() {
        // タイピングゲームのデータがない場合、出題データファイルをフェッチして自分をコールバックする
        if(!this.typingGame_data) {
            return this.fetchJSON('./res/questionContents.json', (data) => {
                this.typingGame_data = { 'questionContents': data };

                this.playTypingGame();
            });
        }

        // UIを構築し描画
        let typingGameElement = '<div class="typingGame"><div class="time">00:00.00</div><h2>Enterキーを押すとゲームが始まります。</h2><p></p><button onclick="app.title();">やめる</button></div>';
        let containerElement  = '<div class="container">' + typingGameElement + '</div>';
        let mainElement       = '<main>' + containerElement + '</main>';

        document.querySelector('body').innerHTML = mainElement;

        // キー入力イベントを追加
        let eventHandler = {
            'typeName': 'keydown',
            'callback': event => {
                if(event.key === 'Enter') {
                    this.typingGame_data.time = [ 0, 0, 0 ];

                    this.typingGame_data.typingCount = 0;
                    this.typingGame_data.missCount   = 0;
                    this.typingGame_data.clearCount  = 0;

                    this.typingGame_data.currentQuestionIndex = 0;

                    this.typingGame_data.mustEnteredKeys = [];

                    this.startTypingGame();
                }
            }
        };

        this.eventHandlers[0] = eventHandler;

        document.addEventListener(eventHandler.typeName, eventHandler.callback);

        return true;
    }

    // タイピングゲームを開始
    startTypingGame() {
        // 全てのイベントハンドラーを解除（この関数の前に実行された関数でリスナーされたイベントのハンドラーは全て不要なため）
        if(this.eventHandlers.length) {
            for(let i = 0; i < this.eventHandlers.length; i++) {
                document.removeEventListener(this.eventHandlers[i].typeName, this.eventHandlers[i].callback);
            }

            this.eventHandlers = [];
        }

        // 問題認識関数（問題から入力しなければならないキーを生成し保存）
        let generateMustEnteredKeys = () => {
            if(!this.typingGame_data.questionContents) return false;

            let questionContent = this.typingGame_data.questionContents[this.typingGame_data.currentQuestionIndex].characters;
            if(!questionContent) return false;

            this.typingGame_data.mustEnteredKeys = [];

            for(let i = 0; i < questionContent.length; i++) {
                let romajiArray = questionContent[i].romaji.split(''); // 'waga' -> [ 'w', 'a', 'g', 'a' ]

                for(let j = 0; j < romajiArray.length; j++) {
                    this.typingGame_data.mustEnteredKeys.push(romajiArray[j]); // 配列の末尾に要素を追加
                }
            }
        }

        // 問題表示関数
        let renderingQuestion = () => {
            if(!this.typingGame_data.questionContents) return false;

            let questionContent = this.typingGame_data.questionContents[this.typingGame_data.currentQuestionIndex].characters;
            if(!questionContent) return false;

            let textString   = ''; // 表示する問題文（例: 吾輩は猫である）
            let romajiString = ''; // 表示するローマ文字列（例: wagahaihanekodearu）

            let state = 0; // 解答状態（1: 正解 / 2: 未回答 / 3: ミス）

            let checkedEnterdKeyIndex = 0; // 入力済みキーのチェック済みインデックス

            for(let i = 0; i < questionContent.length; i++) {
                if(state <= 1) {
                    let romajiArray = questionContent[i].romaji.split(''); // 'waga' -> [ 'w', 'a', 'g', 'a' ]

                    for(let j = 0; j < romajiArray.length; j++) {
                        if(!this.typingGame_data.enteredKeys[checkedEnterdKeyIndex]) {
                            state = 2;
                        } else if(romajiArray[j] == this.typingGame_data.enteredKeys[checkedEnterdKeyIndex]) {
                            checkedEnterdKeyIndex++;
                            state = 1;
                        } else {
                            state = 3;
                        }
                    }
                }

                console.log(state);

                let option_begin = '';
                let option_end   = '';
                option_begin = state == 2 ? '<span class="opacity05">' : option_begin;
                option_end   = state == 2 ? '</span>' : option_end;
                option_begin = state == 3 ? '<span class="colorRed">' : option_begin;
                option_end   = state == 3 ? '</span>' : option_end;

                textString   += option_begin + questionContent[i].text + option_end;
                romajiString += option_begin + questionContent[i].romaji + option_end;

                if(state == 3) state = 2;
            }

            document.querySelector('.typingGame h2').innerHTML = textString;
            document.querySelector('.typingGame p') .innerHTML = romajiString;
        };

        // ゲームの状況に応じて関数実行
        if(!this.typingGame_data.mustEnteredKeys.length) {
            renderingQuestion();
            generateMustEnteredKeys();
        }

        // キー入力イベントを追加
        let eventHandler = {
            'typeName': 'keydown',
            'callback': event => {
                if(event.key === 'Escape') return this.endTypingGame();
                console.log(event.key);
                //console.log('error: 出題データがありません');
            }
        };

        this.eventHandlers[1] = eventHandler;

        document.addEventListener(eventHandler.typeName, eventHandler.callback);

        // タイムを表示するため更新と表示のインターバルを登録
        this.intervals.push(setInterval(() => {
            this.typingGame_data.time[0]++;
        }, 60 * 1000));

        this.intervals.push(setInterval(() => {
            this.typingGame_data.time[1]++;
            if(this.typingGame_data.time[1] >= 60) this.typingGame_data.time[1] = 0;
        }, 1000));

        this.intervals.push(setInterval(() => {
            this.typingGame_data.time[2]++;
            if(this.typingGame_data.time[2] >= 100) this.typingGame_data.time[2] = 0;

            document.querySelector('.typingGame .time').innerHTML = this.twoDigit(this.typingGame_data.time[0]) + ':' + this.twoDigit(this.typingGame_data.time[1]) + '.' + this.twoDigit(this.typingGame_data.time[2]);
        }, 10));

        // UIを更新
        document.querySelector('.typingGame button').setAttribute('onclick', 'app.endTypingGame();');
        document.querySelector('.typingGame button').innerHTML = '終わる(Escapeキーでも終了できます)';

        return true;
    }

    // タイピングゲームを終了
    endTypingGame() {
        // 全てのイベントハンドラーを解除（この関数の前に実行された関数でリスナーされたイベントのハンドラーは全て不要なため）
        if(this.eventHandlers.length) {
            for(let i = 0; i < this.eventHandlers.length; i++) {
                if(this.eventHandlers[i]) document.removeEventListener(this.eventHandlers[i].typeName, this.eventHandlers[i].callback);
            }

            this.eventHandlers = [];
        }

        // タイマーのインターバルを解除
        if(this.intervals.length) {
            for(let i = 0; i < this.intervals.length; i++) {
                clearInterval(this.intervals[i]);
            }

            this.intervals = [];
        }

        // UIを更新
        document.querySelector('.typingGame h2').innerHTML = 'クリア数: ' + this.typingGame_data.currentQuestionIndex + '/' + this.typingGame_data.questionContents.length;
        document.querySelector('.typingGame p') .innerHTML = ('総タイプ数: ' + this.typingGame_data.typingCount) + '<br>' + ('ミス数: ' + this.typingGame_data.missCount) + '<br>' + ('当たり数: ' + this.typingGame_data.clearCount);

        document.querySelector('.typingGame button').setAttribute('onclick', 'app.title();');
        document.querySelector('.typingGame button').innerHTML = 'タイトルへ';

        return true;
    }
}

const app = new App();