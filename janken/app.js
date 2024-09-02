class App {
    constructor() {
        this.ROCK     = 1; // グー
        this.SCISSORS = 2; // チョキ
        this.PAPER    = 3; // パー

        this.playJanken();
    }

    // じゃんけんをする
    playJanken() {
        let humanHand    = this.getHumanHand();
        let computerHand = this.getComputerHand();

        let result = this.judge(humanHand, computerHand);

        switch(humanHand) {
            case this.ROCK: {
                humanHand = 'グー';
                break;
            }

            case this.SCISSORS: {
                humanHand = 'チョキ';
                break;
            }

            case this.PAPER: {
                humanHand = 'パー';
                break;
            }

            default: {
                return false;
            }
        }

        switch(computerHand) {
            case this.ROCK: {
                computerHand = 'グー';
                break;
            }

            case this.SCISSORS: {
                computerHand = 'チョキ';
                break;
            }

            case this.PAPER: {
                computerHand = 'パー';
                break;
            }

            default: {
                return false;
            }
        }

        switch(result) {
            case 0: {
                window.alert('「あいこ」でした。\n\n' + ('あなたが出した手は「' + humanHand + '」、') + '\n' + ('コンピューターが出した手は「' + computerHand + '」でした。'));
                break;
            }

            case 1: {
                window.alert('勝ったぞ、やったね。\n\n' + ('あなたが出した手は「' + humanHand + '」、') + '\n' + ('コンピューターが出した手は「' + computerHand + '」でした。'));
                break;
            }

            case 2: {
                window.alert('負けた、ズコー。\n\n' + ('あなたが出した手は「' + humanHand + '」、') + '\n' + ('コンピューターが出した手は「' + computerHand + '」でした。'));
                break;
            }

            default: {
                return false;
            }
        }

        if(window.confirm('もう一度プレイしますか？')) return this.playJanken();

        return true;
    }

    // ユーザーにじゃんけんの手を出してもらう
    getHumanHand() {
        let hand = '';

        hand = window.prompt('半角数字で1~3の数字を入力し、じゃんけんの手を出してください。\n\n' + (this.ROCK + ': グー') + '\n' + (this.SCISSORS + ': チョキ') + '\n' + (this.PAPER + ': パー'));
        hand = parseInt(hand, 10);
        hand = (hand >= this.ROCK && hand <= this.PAPER) ? hand : false;

        if(!hand) {
            alert('入力値をうまく認識できませんでした。');
            return this.getHumanHand();
        }

        return hand;
    }

    // コンピューターにじゃんけんの手を出してもらう
    getComputerHand() {
        return Math.floor(Math.random() * 3) + 1;
    }

    // どちらが勝ったか判定
    judge(playerA, playerB) {
        if (playerA == playerB) return 0; // あいこ

        if(playerA == this.ROCK) {
            if(playerB == this.SCISSORS) return 1; // playerAの勝ち
            else return 2;                         // playerBの勝ち
        } else if(playerA == this.PAPER) {
            if(playerB == this.ROCK) return 1; // playerAの勝ち
            else return 2;                     // playerBの勝ち
        } else if(playerA == this.SCISSORS) {
            if(playerB == this.PAPER) return 1; // playerAの勝ち
            else return 2;                      // playerBの勝ち
        }
    }
}

const app = new App();