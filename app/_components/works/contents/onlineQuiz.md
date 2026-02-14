![サムネイル](/works/thumbnail-min-sider.webp)

| 項目       | 内容                                                                                           |
| ---------- | ---------------------------------------------------------------------------------------------- |
| 制作期間   | 2か月                                                                                          |
| 制作人数   | 1人                                                                                            |
| サーバ開発環境   | C++ / Boost.Beast / Docker                                                      |
| クライアント開発環境 | TypeScript / Next.js 15 / Cloudflare Pages  / Claude Code                |
| サーバリポジトリ | [GitHub](https://github.com/Shoma1117/online_quiz_sv.git)                                 |
| クライアントリポジトリ | [GitHub](https://github.com/Shoma1117/online_quiz_cl.git)                           |

## 作品概要

インサイダーゲーム（人狼系推理ゲーム）をオンラインで遊べるWebアプリ。
LLM（Gemini）がゲームマスターを務め、お題の決定・質問への回答・正解判定をすべて自動で行う。
サーバは人間、**クライアントはClaudeを使用しバイブコーディングで実装**しました。

## システム構成

![システム構成図](/works/quize-architecture.drawio.png)
![CI/CD構成図](/works/CICD-architecture.drawio.png)

## 工夫した点


### サーバ側

#### ポイント1：Boost.Asio Coroutineによる非同期通信

co_awaitを使ったコルーチンで非同期に実行し、サーバーがブロッキングしない設計にした。
マルチスレッドも検討したが、EC2の無料枠のインスタンスはメモリが少ないため、省メモリの非同期を採用した。

<details>
<summary>GameManager.cpp</summary>

```cpp
//LLMにカテゴリの中からお題を決めてもらう（非同期）
boost::asio::co_spawn(
    firstSession->GetExecutor(),
    [this]() -> boost::asio::awaitable<void> {
        LLMGameMaster::GameInitResult result = co_await m_llmGameMaster->InitializeGameAsync(m_category);
        if (!result.success) {
            std::cout << "Failed to initialize game: " << result.topic << std::endl;
            co_return;
        }
        m_currentTopic = result.topic;

        //レスポンス作成：インサイダーにのみお題を知らせる
        for (auto& player : m_players) {
            if (auto session = player->GetSession().lock()) {
                boost::json::object message;
                message[Field::TYPE] = ServerMessage::ROLE_ASSIGNED;
                message[Field::ROLE] = (player->GetRole() == Role::INSIDER) ? "INSIDER" : "CITIZEN";

                if (player->GetRole() == Role::INSIDER) {
                    message[Field::TOPIC] = m_currentTopic;
                }
                session->Send(message);
            }
        }

        m_phaseManager->ChangePhase(GamePhase::QUESTIONING);

        //質問フェーズタイマー開始
        StartPhaseTimer(m_roomSettings->GetQuestioningTimeLimit(), [this]() {
            HandleQuestioningTimeout();
        });
    },
    boost::asio::detached
);
```

</details>

#### ポイント2：凝集度の高い設計

モジュール分離を意識して可動性・保守性が高くなるよう設計した。
通信層・ルーティング層・ドメイン層・外部連携層に分け、各モジュール内の凝集度を高めた。

### クライアント側

#### ポイント1：仕様書駆動 × issue駆動 × テスト駆動開発
SpecKitを使用し、仕様書を作成することでAIとの認識の齟齬を防いだ。
また、仕様からタスクリストをissueに起こし、細分化することでコンテキストの精度が劣化しないようにした。
実装の際にはテストから作成させることで作成物のクオリティを一定に保った。

## 苦労した点
Boostライブラリを初めて使ったため、WebSocket通信（Boost.Beast）や非同期処理（Boost.Asio）の学習コストが高かった。
特にコルーチン（co_await、co_spaw`）の仕組みを理解するまでに時間がかかった。
また、インフラ周りも初めての経験だった。
サーバーのDocker化とEC2へのデプロイ、クライアントのCloudflare Pagesへのデプロイなど、両方のインフラ構築を一から学びながら進めた。
