<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe src="https://www.youtube.com/embed/zcftguvAvwQ?autoplay=1&mute=1&rel=0&playsinline=1&controls=0&loop=1&playlist=zcftguvAvwQ" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;" frameborder="0" allow="autoplay" allowfullscreen></iframe>
</div>

| 項目       | 内容                                                    |
| ---------- | ------------------------------------------------------- |
| 制作期間   | 2024年8月5日 → 2024年9月6日                             |
| 制作人数   | 1人                                                     |
| 開発環境   | C# / Unity                                              |
| プレイ動画 | [YouTube](https://www.youtube.com/watch?v=zcftguvAvwQ)  |
| リポジトリ | [GitHub](https://github.com/Shoma1117/BehaviorTree)     |

## 作品概要

Unity上で動作するGraphView機能を利用したBehaviorTreeです。敵(黒いCube)が４つの柱を巡回し、プレイヤー(白いCube)に近づいたら追いかけます。現在はこの機能を組み込んだアクションゲームを開発中です。

## 工夫した点

### ポイント1：GUIで構築できるBehaviorTree

BehaviourTreeと相性の良いGUI上で操作できるようにすることで、簡単に複雑な動作を作成できるようになりました。

![BehaviorTree GUI](/works/behaviorTree-gui.webp)

### ポイント2：Save、Load機能

作成したBehaviorTreeをもとに、NodeとEdgeの情報を持ったScriptableObjectを作成することにより、保存と読み込みの機能を付けました。

![Save/Load機能](/works/behaviorTree-save.webp)

## 苦労した点

GraphViewの使用や使い方の知識が0の状態から始めたので勉強するのに時間がかかった。また、UnityEditorのスクリプトはランタイム上で実行できないため、橋渡しをするためにはどうすればよいか考えるのが大変だった。
