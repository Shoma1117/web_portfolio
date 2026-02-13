<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe src="https://www.youtube.com/embed/ohcf6UrrGFg?autoplay=1&mute=1&rel=0&playsinline=1&controls=0&loop=1&playlist=ohcf6UrrGFg" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;" frameborder="0" allow="autoplay" allowfullscreen></iframe>
</div>

| 項目 | 内容 |
| --- | --- |
| 制作期間 | 2023年11月2日 → 2023年11月9日 |
| 制作人数 | 1人 |
| 開発環境 | C++ / DxLib |
| プレイ動画 | [YouTube](https://www.youtube.com/watch?v=ohcf6UrrGFg) |
| リポジトリ | [GitHub](https://github.com/Shoma1117/Defence_Treasure) |

## 作品概要

デュアルスティックの左右でそれぞれの剣を操作し、お宝を守るタワーディフェンス型ゲーム。
学校での課題「一週間制作」で制作した作品です。

## 工夫した点

操作入力の関数をコールバックで渡してあげることにより、左右の剣を同じクラスから作成できるようにした。

<details>
<summary>GameMain.cpp</summary>

```cpp
void GameMain::Init()
{
    leftSword = make_shared<Sword>(GetJoypadAnalogInput);
    rightSword = make_shared<Sword>(GetJoypadAnalogInputRight);
}
```

</details>

<details>
<summary>Sword.cpp</summary>

```cpp
Sword::Sword(std::function <int(int*, int*, int)> inputCallback)
    : inputCallback(inputCallback)
{

}

void Sword::Move()
{
    //入力受付
    int provisionalX = 0, provisionalY = 0;

    inputCallback(&provisionalX, &provisionalY, DX_INPUT_KEY_PAD1)
}
```

</details>

## 苦労した点

std::functionを初めて使用したので仕様を把握するのに時間がかかった。また、剣の画像を移動方向に向ける際に、数学の知識が必要になってきて大変だった。時間経過で敵の数を増やすようにし、単調にならないようにした。
