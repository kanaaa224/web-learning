class App {
    constructor() {
        window.addEventListener('load', () => {
            this.initialize();

            let number = (new URL(window.location.href)).searchParams.get('number'); // URL引数が指定されていた場合、取得する（「abc/?DEF=XXX」のXXXの部分）

            if(number) {
                this.generateCard(number);
            } else {
                let maximumItemNum = 250;                  // 最大カード数
                let selectRange    = { min: 1, max: 500 }; // 選定範囲
                let selectedItems  = [];                   // 選定済みカード

                for(let i = 0; i < maximumItemNum; i++) {
                    let itemNum = 0;

                    // 選定範囲の中からランダムでカードの番号を出し、
                    // 既に出されたものでなければその番号のカードを生成
                    do {
                        itemNum = (Math.floor(Math.random() * (selectRange.max - selectRange.min + 1)) + selectRange.min);
                    } while(selectedItems.includes(itemNum));

                    selectedItems.push(itemNum);

                    this.generateCard(itemNum);
                }
            }
        });
    }

    initialize() {
        if(document.querySelector('header')) document.querySelector('header').remove();
        if(document.querySelector('main'))   document.querySelector('main')  .remove();
        if(document.querySelector('footer')) document.querySelector('footer').remove();

        document.querySelector('body').innerHTML += `<header></header><main><div class="container"><div class="cards"></div></div></main><footer><div class="container"><p>&copy; 2023 <a href="//github.com/kanaaa224/"><u>kanaaa224</u></a>.</p></div></footer>`;
    }

    generateCard(number = 0) {
        let callback = (d) => {
            const typeColors = {
                normal:   '#95afc0',
                fire:     '#f0932b',
                water:    '#0190ff',
                electric: '#fed330',
                grass:    '#00b894',
                ice:      '#74b9ff',
                fighting: '#ff4d4d',
                poison:   '#6c5ce7',
                ground:   '#efb549',
                flying:   '#81ecec',
                psychic:  '#a29bfe',
                bug:      '#26de81',
                rock:     '#2d3436',
                ghost:    '#a55eea',
                dragon:   '#ffc200',
                dark:     '#30336b',
                steel:    '#aeaeae',
                fairy:    '#ff0069',
            };

            let img_src = d.sprites.other.dream_world.front_default;

            let name = d.name[0].toUpperCase() + d.name.slice(1);

            let hp      = d.stats[0].base_stat;
            let attack  = d.stats[1].base_stat;
            let defence = d.stats[2].base_stat;
            let speed   = d.stats[5].base_stat;

            let typeColor = typeColors[d.types[0].type.name];

            let element = `
                <div class="card" style="background: radial-gradient( circle at 50% 0%, ${typeColor} 36%, #ffffff 36%);" onclick="window.open('./?number=${number}');">
                    <div class="badges">
                        <div class="badge"><span>No.</span>${number}</div>
                        <div class="badge"><span>HP</span>${hp}</div>
                    </div>
                    <img src=${img_src}>
                    <h2 class="name">${name}</h2>
                    <div class="types">
            `;

            d.types.forEach((item) => {
                element += `<span style="background-color: ${typeColor};">${item.type.name.toUpperCase()}</span>`;
            });

            element += `
                    </div>
                    <div class="stats">
                        <div>
                            <h3>${attack}</h3>
                            <p>Attack</p>
                        </div>
                        <div>
                            <h3>${defence}</h3>
                            <p>Defense</p>
                        </div>
                        <div>
                            <h3>${speed}</h3>
                            <p>Speed</p>
                        </div>
                    </div>
                </div>
            `;

            document.querySelector('main .container .cards').innerHTML += element;
        }

        fetch('//pokeapi.co/api/v2/pokemon/' + number)
            .then(response => response.json())
            .then(data => callback(data))
    }
}

let app = new App();