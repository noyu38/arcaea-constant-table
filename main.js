document.addEventListener('DOMContentLoaded', () => {
    fetch("data/arcaea_data.json")
        .then(response => response.json())
        .then(data => {
            // 曲リストを表示するコンテナを取得
            const container = document.getElementById('song-list-container');

            // 楽曲を譜面定数ごとにまとめる
            const groupedByConstant = {};

            data.forEach(song => {
                for (const difficulty in song.charts) {
                    const chart = song.charts[difficulty];
                    const constant = chart.constant;

                    // まだその定数用のグループがなければ、リストを作成
                    if (!groupedByConstant[constant]) {
                        groupedByConstant[constant] = [];
                    }

                    // グループに曲情報を追加
                    groupedByConstant[constant].push({
                        title: song.title_ja,
                        jacket: song.jacket,
                        difficulty: difficulty,
                    });
                }
            });

            const sortedConstants = Object.keys(groupedByConstant).sort((a, b) => b - a);

            sortedConstants.forEach(constant => {
                const groupDiv = document.createElement('div');
                groupDiv.className = 'constant-group';

                let jacketHtml = '';
                groupedByConstant[constant].forEach(chartInfo => {
                    const isBeyond = chartInfo.difficulty === 'Beyond';
                    const isEternal = chartInfo.difficulty === 'Eternal';

                    const defineClass = () => {
                        if (isBeyond) return 'beyond-jacket';
                        if (isEternal) return 'eternal-jacket';
                    }

                    jacketHtml += `<img src="images/${chartInfo.jacket}" alt="${chartInfo.title}" title="${chartInfo.title}" class="${defineClass()}">`;
                });

                groupDiv.innerHTML = `
                    <h2>${parseFloat(constant).toFixed(1)}</h2>
                    <div class="jackets">
                        ${jacketHtml}
                    </div>
                `;

                container.appendChild(groupDiv);
            })
        })
        .catch(e => {
            console.error('データの読み込みに失敗しました。\n', e);
        });

})