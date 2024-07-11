class App {
    constructor() {
        // ページのロードが完了したとき、タイトル画面を描画する関数を実行する
        window.addEventListener('load', () => {
            this.drawTitle();
        });
    }

    // jsonファイルを読み込む
    fetchJSON(filePath = '', callback = () => {}) {
        fetch(filePath)
            .then(response => response.json())
            .then(data     => callback(data))
            .catch(error   => console.error('fetching error: ', error));

        return true;
    }

    // 「1」を「01」にしてくれる関数
    twoDigit(num) {
        if(num < 10) return ('0' + num);
        else return num;
    }

    // タイトル
    drawTitle() {
        let titleElement     = '<div class="title"><h1>タイピングゲーム</h1><button onclick="app.playTypingGame();">ゲーム開始</button></div>';
        let containerElement = '<div class="container">' + titleElement + '</div>';
        let mainElement      = '<main>' + containerElement + '</main>';

        document.querySelector('body').innerHTML = mainElement;

        return true;
    }

    // タイピングゲームを開始
    playTypingGame() {
        // タイピングゲームの出題データがない場合、ファイルをフェッチして自分をコールバックする
        if(!this.typingGame_data) {
            return this.fetchJSON('./res/questionContents.json', (data) => {
                this.typingGame_data = { 'questionContents': data };

                return this.playTypingGame();
            });
        }

        // UIを構築し描画
        let typingGameElement = '<div class="typingGame"><div class="time">00:00.00</div><h2>Enterキーを押すとゲームが始まります。</h2><button onclick="app.drawTitle();">やめる</button></div>';
        let containerElement  = '<div class="container">' + typingGameElement + '</div>';
        let mainElement       = '<main>' + containerElement + '</main>';

        document.querySelector('body').innerHTML = mainElement;

        // イベント追加
        const keydownHandler = event => {
            if(event.key === 'Enter') {
                document.removeEventListener('keydown', keydownHandler);

                this.typingGame_data.time = [ 0, 0, 0 ];

                this.typingGame_data.typingCount = 0;
                this.typingGame_data.missCount   = 0;
                this.typingGame_data.clearCount  = 0;

                this.typingGame_data.interval = [];

                this.typingGame();
            }
        };
        
        document.addEventListener('keydown', keydownHandler);

        return true;
    }

    // タイピングゲーム
    typingGame() {
        // タイマーのインターバルを登録
        this.typingGame_data.interval.push(setInterval(() => {
            this.typingGame_data.time[0]++;
        }, 60 * 1000));

        this.typingGame_data.interval.push(setInterval(() => {
            this.typingGame_data.time[1]++;
            if(this.typingGame_data.time[1] >= 60) this.typingGame_data.time[1] = 0;
        }, 1000));

        this.typingGame_data.interval.push(setInterval(() => {
            this.typingGame_data.time[2]++;
            if(this.typingGame_data.time[2] >= 100) this.typingGame_data.time[2] = 0;
        }, 10));

        this.typingGame_data.interval.push(setInterval(() => {
            document.querySelector('.typingGame .time').innerHTML = this.twoDigit(this.typingGame_data.time[0]) + ':' + this.twoDigit(this.typingGame_data.time[1]) + '.' + this.twoDigit(this.typingGame_data.time[2]);
        }, 10));

        document.querySelector('.typingGame button').setAttribute('onclick', 'app.endTypingGame();');

        return true;
    }

    // タイピングゲームを終了
    endTypingGame() {
        // タイマーのインターバルを解除
        for(let i = 0; i < this.typingGame_data.interval.length; i++) {
            clearInterval(this.typingGame_data.interval[i]);
        }

        document.querySelector('.typingGame button').setAttribute('onclick', 'app.drawTitle();');

        return true;
    }
}

const app = new App();