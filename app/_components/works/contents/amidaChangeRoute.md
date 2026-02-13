<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe src="https://www.youtube.com/embed/XR-EHkZOZd0?autoplay=1&mute=1&rel=0&playsinline=1&controls=0&loop=1&playlist=XR-EHkZOZd0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;" frameborder="0" allow="autoplay" allowfullscreen></iframe>
</div>

| 項目 | 内容 |
| --- | --- |
| 制作期間 | 2023年10月12日 → 2023年10月19日 |
| 制作人数 | 1人 |
| 開発環境 | C++ / DxLib |
| プレイ動画 | [YouTube](https://www.youtube.com/watch?v=XR-EHkZOZd0) |
| リポジトリ | [GitHub](https://github.com/Shoma1117/Amida_Change_Route) |

## 作品概要

マウスで線を描き、あみだくじの要領でゴールを目指すゲーム。
学校での課題「一週間制作」で制作した作品です。

## 工夫した点

線の認識方法と、進行方向を管理に配列を活用し、うまくコードに落とし込んだ。また、単調なゲームにならないよう乱数を活用し、毎回異なるあみからスタートするようにした。

<details>
<summary>Ami.cpp</summary>

```cpp
Ami::Ami(GameMain* gameMain) : lineMaxX(SCREEN_WIDTH - 100),
                              lineMinX(100),
                              lineMaxY(SCREEN_HEIGHT - 100),
                              lineMinY(100),
                              besideMax(2),
                              besidelineMinY(100),
                              besidelineMaxY(320)
{
    //縦線の本数(最低5、最大8)
    verLineNum = GetRand(3) + 5;

    //線の間隔
    lineInterval = (SCREEN_WIDTH - lineMinX) / verLineNum;

    //線の長さ
    len = lineMaxY - lineMinY;

    //線の生成
    line = nullptr;
    line = new Line[verLineNum];

    //線の情報登録
    for (int i = 0; i < verLineNum; ++i)
    {
        //位置
        line[i].x = lineMinX + (lineInterval * i);
        line[i].minY = lineMinY;
        line[i].maxY = lineMaxY;

        //スタート、ゴールの初期化
        line[i].isStart = false;
        line[i].isGoal = false;

        //その線から右に何本線が伸びているか
        line[i].besideLineNum = GetRand(besideMax) + 3;

        //進行方向を登録するための配列生成
        line[i].directionInfo = new int[len];

        //0で初期化
        for (int j = 0; j < len; ++j)
        {
            line[i].directionInfo[j] = 0;
        }

        //最後の線以外は右に曲がる位置を登録
        if (i != verLineNum - 1)    //最後の線は右に曲がれないので登録しない
        {
            for (int j = 0; j < line[i].besideLineNum; ++j)
            {
                //線の最初の100pixと最後の100pixには作らない
                line[i].directionInfo[GetRand(besidelineMaxY)  + besidelineMinY] = 1;
            }
        }

        //左の線から受けとって連結
        if (i != 0)        //最初の線は受け取れないので飛ばす
        {
            for (int j = 0; j < len; ++j)
            {
                if (line[i - 1].directionInfo[j] == 1)
                {
                    line[i].directionInfo[j] = 2;
                }
            }
        }
    }

    //スタートの作成
    start = new Start;

    //スタートの位置登録
    start->currentPos = GetRand(verLineNum - 1);
    line[start->currentPos].isStart = true;

    start->x = line[start->currentPos].x;
    start->y = line[start->currentPos].minY - 100;

    start->startHandle = LoadGraph("./res/Start.png");
    if (start->startHandle == -1)
    {
        DxLib_End();
    }

    //ゴールの作成
    goal = new Goal;

    //ゴール位置登録
    goal->goarPos = GetRand(verLineNum - 1);
    line[goal->goarPos].isGoal = true;

    //ゴール位置
    goal->x = line[goal->goarPos].x;
    goal->y = line[goal->goarPos].maxY;

    //ゴール画像
    goal->goalHandle = LoadGraph("./res/Goal.png");
    if (goal->goalHandle == -1)
    {
        DxLib_End();
    }

    this->gameMain = gameMain;
}

void Ami::Update()
{
    //スタート画像を移動
    switch (line[start->currentPos].directionInfo[start->y])
    {
    case (0):
        {
            ++start->y;
            break;
        }
    case (1):
        {
            ++start->x;

            //横移動した際、隣の線まで来たら現在の場所を変える
            if (start->x == line[start->currentPos + 1].x)
            {
                ++start->currentPos;
                ++start->y;
            }
            break;
        }
    case (2):
        {
            --start->x;

            if (start->x == line[start->currentPos -1].x)
            {
                --start->currentPos;
                ++start->y;
            }
            break;
        }
    default:
        --start->y;
    }
}
```

</details>

## 苦労した点

1週間という短い中で、ロジックを考えるのが大変だった。だが、思い描いたことが実現できたときは非常にうれしく、僕にゲーム作りの楽しさを教えてくれた思い出深い作品です。
