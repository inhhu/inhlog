---
title: "Discord上のチャットをテキストファイルにする"
date: 2026-06-17T23:15:47+09:00
draft: false

# Aphelis流 出典項目
author: ""
book_title: ""
publisher: ""
year: 
page: ""
url: ""

# カテゴリ・タグ
categories: [備忘録]
tags: []
---
![image-title](https://collectionapi.metmuseum.org/api/collection/v1/iiif/290386/615440/main-image)
<small>（Roger Fenton, *Photographic Facsimiles of the Remains of the Epistles of Clement of Rome. Made from the Unique Copy Preserved in the Codex Alexandrinus.*, 1856, Lisence: Open Access）</small>

- サークルの仕事で、Discord上に記録されたサークルの活動記録を、OB・OG向けの冊子に載せる作業をする必要があった。
- 冊子の作成にはIndesignを使うことになるので、Discordに残っている活動記録はテキストファイルで扱えるのが一番便利だ。しかし、手作業でコピペを繰り返すのは骨が折れる。
- 最終的にDiscordChatExporterというオープンソースのソフトウェアを使ってこの作業をかなり楽に行うことができた。日本語でもこのソフトの使い方についての情報はかなりたくさんあるのだが、自分のための備忘録として、ここにいくつかの注意点を残しておく。

### DiscordChatExporterの導入

- githubからDiscordChatExporterを導入する。 https://github.com/tyrrrz/discordchatexporter
- Stable releaseを見ると、それぞれの環境用の.zipファイルをダウンロードできる。各アーキテクチャ向けのCLI(コマンドラインインタフェース)版リリースがたくさん並んでいるが、慣れていなければGUI(グラフィカルユーザーインターフェース)版をダウンロードするのが無難だろう。ファイル名に"Cli"と入っていないのがGUI版だ。任意の.zipをダウンロードして、解凍する。
- windows環境であれば解凍したフォルダの中にある"DiscordChatExporter.exe"を実行することでソフトウェアを開くことができる。GUI版を利用する場合、<u>mac環境では、追加の手順が必要になる。macの場合は.zipを解凍するとそのままアプリケーションが表示されるが、すぐにそれを実行することはできない。コマンドライン上で、アプリケーションがあるフォルダ内で、以下のようなコマンドを実行し、ファイルのQuarantine状態を解くことができたら、ソフトウェアが実行可能になる。</u>
``` xattr -rd com.apple.quarantine 〔ダウンロード・解凍したソフトウェアの名前 e.g. DiscordChatExporter.app〕```

### Discord Botの作成・導入

- DiscordChatExporterは、それぞれのDiscordアカウントの「トークン」を入力することで、使用することができる。
- 日本語で見つけることができるこのソフトウェアの使用法についての記事では、ブラウザでDiscordにログインし、ブラウザのデベロッパーツールを使うことで、自分のアカウントのトークンを特定する方法が紹介されているが、この方法を避けるべき理由がある。
> ⚠️ **IMPORTANT**
> Discordはユーザー規約で、アカウントをプログラムで自動操作することを禁じている[^1]。自分が普段使っているアカウントのトークンを使う方法は、ユーザー規約に抵触しているため、アカウントの一時停止や永久BANのリスクをはらんでいる。実際にこの方法に沿って作業をしてBANをされたケースがあるのかは知らないが、ラクをするための作業で無駄なリスクを負ってしまうことは避けるのが無難だろう。 
- 代替策として、Discordが提供するサービスの範囲内で、ボットアカウントを作成し、自分が普段使っているアカウントのトークンではなく、ボットアカウントに発行されたそれを使ってDiscordChatExporterを利用するという方法がある。
- ボットアカウントは[Discord Developer Portal](https://discord.com/developers/applications)で、(英語表示ならば)"New Application"ボタンから作成することができる。
- "New Application"を作成したら、Developer Portalの左の欄から"Bot"を選択し、"Reset Token"でトークンのリセットを行う。ここでボットアカウントに発行されるトークンを確認することができる。<u>作成時にしかトークンを確認することはできない</u>ので、安全なところにメモしておく必要がある。
- 同じ"Bot"画面で、"Privileged Gateway Intents"のうち、"Presence Intent", "Server Members Intent", "Message Content Intent"を全て有効化し、変更を保存する。
- "Bot"画面から"OAuth2"に移り、"URL Generator"をクリックする。"SCOPES"という一覧が出るので、"bot"を選択し、"BOT PERMISSION"の一覧から、"Read Message History"と"View Channels"を選択して権限を付与する。
- 画面下に生成されるURLをブラウザで開いて、テキストファイル化したいチャンネルがあるDiscordサーバーにボットアカウントを追加する。

### DiscordChatExporterの実行
- DiscordChatExporterを起動し、メモしておいたボットアカウントのトークンを入力する。
- ボットが参加しているサーバーが表示されるので、任意のサーバー、サーバー内のチャンネルを選択し、ファイルの出力先と出力形式を選択して実行する。ここで、GUI版であれば"More"のボタンから、出力するチャットを時期によって限定したり、任意の単語を含むチャットだけを指定したりすることもできる。<u> なお、取り込みたいチャットがあるチャンネルを閲覧できるロールが、サーバー内で指定されている場合、ボットアカウントにもそのロールを付与しないとチャットを取り込むことはできない。</u>


---

[![CC BY 4.0](https://mirrors.creativecommons.org/presskit/buttons/88x31/svg/by.svg)](https://creativecommons.org/licenses/by/4.0/deed.ja)

<small>このコンテンツは [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/deed.ja) の下でライセンスされています。(クレジット表記: inhhh)</small>




[^1]: https://discord.com/guidelines 第14項。