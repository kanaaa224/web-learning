// プレイリストを取得
var listitems = document.querySelectorAll('li');

for(let i = 0; i < listitems.length; i++) {
    // clickイベントを設定
    listitems[i].addEventListener('click',
        (e) => {
            let li = e.target;
            
            playMusic(li);
        }
    );
}

function playMusic(li) {
    let file = li.getAttribute('data-file');
    let audio = document.querySelector('audio');

    audio.setAttribute('src', file);
    audio.play();

    // activeな項目を変更
    let activeli = document.querySelector('.active');
    activeli.className = '';
    li.className = 'active';
}

// 再生中と停止中でイラストを切り替える
let audio = document.querySelector('audio');

audio.addEventListener('play',
    (e) => {
        let img = document.querySelector('img');
        img.setAttribute('src', 'pict_play.png');
    }
);

audio.addEventListener('pause',
    (e) => {
        let img = document.querySelector('img');
        img.setAttribute('src', 'pict_stop.png');
    }
);

// 曲を最後まで再生したとき
audio.addEventListener('ended',
    (e) => {
        let img = document.querySelector('img');
        img.setAttribute('src', 'pict_stop.png');

        // 次の曲へ
        let activeli = document.querySelector('.active');
        let nextli = activeli.nextElementSibling;

        if(nextli != null) {
            playMusic(nextli);
        }

        console.log('active ' + activeli + activeli.getAttribute('data-file'));
        console.log('next ' + nextli + nextli.getAttribute('data-file'));
    }
);

// ランダム選曲機能
let random = document.querySelector('#random');
random.addEventListener('click',
    (e) => {
        e.preventDefault();
        
        let listitems = document.querySelectorAll('li');
        let len = listitems.length;
        let rnd = Math.floor(Math.random() * len);
        
        playMusic(listitems[rnd]);
    }
)