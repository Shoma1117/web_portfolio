<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe src="https://www.youtube.com/embed/ndGce4Gn5pc?autoplay=1&mute=1&rel=0&playsinline=1&controls=0&loop=1&playlist=ndGce4Gn5pc" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;" frameborder="0" allow="autoplay" allowfullscreen></iframe>
</div>

| 項目 | 内容 |
| --- | --- |
| 制作期間 | 2023年10月19日 → 2023年10月26日 |
| 制作人数 | 1人 |
| 開発環境 | C++ / DxLib |
| プレイ動画 | [YouTube](https://www.youtube.com/watch?v=ndGce4Gn5pc) |
| リポジトリ | [GitHub](https://github.com/Shoma1117/Quick_Gunman) |

## 作品概要

合図がでたらボタンを押し、先に押した方が勝ちとなる2人対戦型早押しゲーム。
学校での課題「一週間制作」で制作した作品です。

## 工夫した点

緊張感を持たせたかったため、開始前に上下に黒帯を出すようにした。

![黒帯演出](/works/gunMan-Play.webp)

<details>
<summary>Effect.cpp</summary>

```cpp
void Effect::BlackBelt()
{
    //上の帯描画
    DrawBox(
        blackBelt[up].upMinX,
        blackBelt[up].upMinY,
        blackBelt[up].upMaxX,
        blackBelt[up].upMaxY,
        GetColor(0, 0, 0),
        true);

    //下の帯描画
    DrawBox(
        blackBelt[down].upMinX,
        blackBelt[down].upMinY,
        blackBelt[down].upMaxX,
        blackBelt[down].upMaxY,
        GetColor(0, 0, 0),
        true);


    const int upYMax = 200;
    const int downYMax = SCREEN_HEIGHT - 200;
    switch (phase)
    {
        //帯が出てくる処理
    case 0:
        ++blackBelt[up].upMaxY;
        --blackBelt[down].upMaxY;

        if (blackBelt[up].upMaxY >= upYMax && blackBelt[down].upMaxY >= downYMax)
        {
            phase = 1;
        }
        break;

        //帯が止まる処理
    case 1:
        ++curTime;

        if (curTime == waitTime)
        {
            phase = 2;
        }
        break;

        //帯が戻っていく処理
    case 2:
        --blackBelt[up].upMaxY;
        ++blackBelt[down].upMaxY;

        if (blackBelt[up].upMaxY <= 0 && blackBelt[down].upMaxY >= SCREEN_HEIGHT)
        {
            phase = 3;
        }
        break;

    case 3:
        endBlackBelt = true;
    }
}
```

</details>

また、ボタンを押すまでにかかった時間を計測して表示し、反応の速さを視覚的にわかるようにした。

![反応時間表示](/works/gunman-reaction-time.webp)
