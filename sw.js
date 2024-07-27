
// ServiceWorker処理：https://developers.google.com/web/fundamentals/primers/service-workers/?hl=ja

// キャッシュ名とキャッシュファイルの指定
var CACHE_NAME = 'pwa-sample-caches';
var urlsToCache = [
    '/',
    'css/style.css',
    'images/app-icon-192.png'
    'drawer.js'
];

// インストール処理
self.addEventListener('install', function(event) {
	event.waitUntil(
		caches
			.open(CACHE_NAME)
			.then(function(cache) {
				return cache.addAll(urlsToCache);
			})
	);
});

// リソースフェッチ時のキャッシュロード処理
self.addEventListener('fetch', function(event) {
	event.respondWith(
		caches
			.match(event.request)
			.then(function(response) {
				return response ? response : fetch(event.request);
			})
	);
});

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // インストールプロンプトを表示するのを防ぎ、イベントを保存
    e.preventDefault();
    deferredPrompt = e;

    // インストールボタンを表示するなど、ユーザーにアクションを促す
    showInstallButton();
});

function showInstallButton() {
    const installButton = document.createElement('button');
    installButton.innerText = 'アプリをインストール';
    document.body.appendChild(installButton);

    // ボタンクリック時にプロンプトを表示
    installButton.addEventListener('click', (e) => {
        // 以前に保存されたイベントを使用してプロンプトを表示
        if (deferredPrompt) {
            deferredPrompt.prompt();

            // ユーザーの応答を待つ
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('ユーザーがインストールを受け入れました');
                } else {
                    console.log('ユーザーがインストールを拒否しました');
                }
                deferredPrompt = null;
            });
        }
    });
}
