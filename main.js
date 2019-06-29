var isAccountShowing = false

window.onload = function (e) {
    //タブ情報取得
    chrome.tabs.getSelected(tab => {
        let title = tab.title;
        let url = tab.url;
        document.getElementById('status_input').value = title + " " + url;
    });

    //アカウント設定表示、非表示
    document.getElementById('account_button').onclick = function () {
        if (!isAccountShowing) {
            //非表示
            isAccountShowing = true;
            let html = `
            <div class="input-field col s6">
               <input placeholder="インスタンス名" id="instance_input" type="text" class="validate">
            </div>
            <div class="input-field col s6">
                <input placeholder="アクセストークン" id="token_input" type="password" class="validate">
            </div>
            <div id="instance_info"></div>
            <div id="token_info"></div>
            <a class="waves-effect waves-light btn" id="set_account_button"><i class="material-icons left">done</i>登録</a>
            `;
            //HTML代入
            document.getElementById('account_div').innerHTML = html;
            //アカウント保存
            document.getElementById('set_account_button').onclick = function () {
                chrome.storage.local.set({ 'instance': document.getElementById('instance_input').value }, function () {
                    document.getElementById('instance_info').innerText = "インスタンス名設定完了"
                });
                chrome.storage.local.set({ 'token': document.getElementById('token_input').value }, function () {
                    document.getElementById('token_info').innerText = "アクセストークン設定完了"
                });
            }
        } else {
            //表示
            isAccountShowing = false;
            document.getElementById('account_div').innerHTML = '';
        }
    }

    //投稿ボタン
    document.getElementById('post_button').onclick = function () {
        share();
    }

}


//API POST
function share() {
    //データ取得
    chrome.storage.local.get(["instance", "token"], function (value) {
        //リクエスト
        var xmlHttpRequest = new XMLHttpRequest();
        xmlHttpRequest.addEventListener("load", function (event) {
            //レスポンス
            document.getElementById('post_button').innerHTML = '<i class="material-icons left">send</i>投稿しました'
        }, false);
        xmlHttpRequest.responseType = "json";
        xmlHttpRequest.open("POST", `https://${value.instance}/api/v1/statuses?access_token=${value.token}`);
        xmlHttpRequest.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
        xmlHttpRequest.send("status=" + encodeURIComponent(document.getElementById('status_input').value) + `&visibility=${document.getElementById('visibility_select').value}`);
    });
}