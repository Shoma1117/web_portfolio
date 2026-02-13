<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe src="https://www.youtube.com/embed/lEoNBI5Ney0?autoplay=1&mute=1&rel=0&playsinline=1&controls=0&loop=1&playlist=lEoNBI5Ney0" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;" frameborder="0" allow="autoplay" allowfullscreen></iframe>
</div>

| 項目       | 内容                                                         |
| ---------- | ------------------------------------------------------------ |
| 制作期間   | 2024年4月24日 → 2024年6月24日                                |
| 制作人数   | 2人(Enemy、gimmick以外を担当)                                |
| 開発環境   | C# / Unity                                                   |
| 参考資料   | Unityゲーム プログラミング・バイブル 2nd Generation           |
| プレイ動画 | [YouTube](https://www.youtube.com/watch?v=lEoNBI5Ney0)       |
| リポジトリ | [GitHub](https://github.com/Shoma1117/AnchorGravity)         |

## 作品概要

錨を使用し、敵を倒したりギミックを攻略しながらゴールを目指すアクションゲーム。

**神ゲー創造主エボリューション1次審査を突破しました。**

## 工夫した点

### ポイント1：ExtenjectとUniRxを活用した依存性の管理

DIContainerライブラリ「Extenject」を使用し、クラスの結合度を下げました。また、UniRxを使用することで依存性を逆転させました。なるべく疎結合になるよう意識して設計しました。

<details>
<summary>AnchorCore.cs</summary>

```csharp
/// <summary>
/// コンストラクタ
/// </summary>
/// <param name="behaviour"></param>
/// <param name="playerActor"></param>
public AnchorCore(AnchorBehaviour behaviour
    , IPlayerActor playerActor
    , IPlayerInput input
    , ISoundManager soundManager)
{
    this.behaviour = behaviour;

    //初期化処理
    behaviour.Init();

    PlayerBehaviour playerBehaviour = playerActor.GetBehaviour();
    playerTransform = playerBehaviour.transform;
    this.input = input;

    this.soundManager = soundManager;

    //アンカーに触れた際の処理
    behaviour.collectAnchorObservable.Subscribe(_ =>
    {
        //アンカーを投げれる状態にする
        haveAnchor = true;
    });

    //投げる際の処理
    anchorThror.Where(x => x && anchorRady.Value)
        .Subscribe(_ =>
        {
            //効果音を鳴らす
            soundManager.PlaySe(Se_Enum.ANCHORTHROW);

            //アンカーを飛ばす
            behaviour.ThrowAnchor(SpawaAnchorPos(), ThrowVector());

            //手元からなくす
            haveAnchor = false;

            anchorRady.Value = false;
        }
        );

    //重さに変更があった際の処理
    anchorWeight.Where(x => x != 0)     //変更がないなら処理しない
        .Subscribe(x =>
        {
            behaviour.ChangeWeight((int)x);
        });

    //錨が敵にぶつかった際に音を鳴らす
    behaviour.OnCollisionEnter2DAsObservable().Subscribe(collision =>
    {
        if (collision.gameObject.TryGetComponent<IDamegable>(out IDamegable damegable))
        {
            soundManager.PlaySe(Se_Enum.ADDDAMEGE);
        }
    });
}
```

</details>

<details>
<summary>AnchorBehaviour.cs</summary>

```csharp
/// <summary>
/// 初期化処理
/// </summary>
public void Init()
{
    defaultGravityScale = rb.gravityScale;
    gameObject.SetActive(false);

    //錨を回収する時のイベント登録
    collectAnchorObservable.Subscribe(_ =>
    {
        //自身を消す
        gameObject.SetActive(false);

        //何も接触していないことにする
        hitObject = false;

        //重力を適用する
        rb.gravityScale = defaultGravityScale;

    });
}

/// <summary>
/// 錨を投げる
/// </summary>
/// <param name="pos">錨が出現する座標</param>
/// <param name="throwVec">錨を投げるベクトル</param>
public void ThrowAnchor(Vector2 pos, Vector2 throwVec)
{
    transform.position = pos;

    gameObject.SetActive(true);

    rb.AddForce(throwVec * throwPower * (weightLevelMax - currentWeight.Value + 1), ForceMode2D.Impulse);
}

private void OnCollisionEnter2D(Collision2D collision)
{
    //プレイヤーなら回収する
    if (collision.gameObject.TryGetComponent<PlayerBehaviour>(out PlayerBehaviour playerBehaviour))
    {
        CollectAnchor();
    }
    //接触したものがダメージを受けるなら与え、回収する
    else if (collision.gameObject.TryGetComponent<IDamegable>(out IDamegable damegable))
    {
        damegable.AddDamege(currentWeight.Value + 1);

        CollectAnchor();
    }
    //それ以外のオブジェクトに衝突したなら停止する
    else
    {
        hitObject = true;
    }
}
```

</details>

### ポイント2：自動生成されるサウンドenum

Editor拡張機能を利用し、サウンドファイル内のAudioClipの名前を元に、自動でenumが生成されるようにしました。このenumを関数に渡すことにより、対応した音声が再生されます。音声が増えた際の手間が減り、利便性が上がりました。

**該当ファイル**

- Assets/Editor/SoundAssetObserver.cs
- Assets/Editor/EnumCreator.cs

<details>
<summary>SoundAssetObserver.cs</summary>

```csharp
private static void Create()
{
    List<AudioClip> ses = new List<AudioClip>();
    List<AudioClip> bgms = new List<AudioClip>();

    //SE取得
    List<string> seList = new List<string>();
    string[] seNames = Directory.GetFiles("Assets/Resources/Sound/Se/", "*", System.IO.SearchOption.AllDirectories);
    foreach (var name in seNames)
    {
        //拡張子を取り除く
        string capitalName = name.ToUpper();
        if ((capitalName.Contains(".MP3") || capitalName.Contains(".WAV")) && !capitalName.Contains(".META"))
        {
            string newName = capitalName.Substring(name.LastIndexOf("/") + 1).Replace(".WAV", "").Replace(".MP3", "");
            seList.Add(newName);
            ses.Add(AssetDatabase.LoadAssetAtPath<AudioClip>(name));
        }
    }

    //Enum生成
    EnumCreator.Create("Se_Enum", "Assets/Scripts/Sound/Se_Enum.cs", seList);

    //BGM取得
    List<string> bgmList = new List<string>();
    string[] bgmNames = Directory.GetFiles("Assets/Resources/Sound/Bgm/", "*", System.IO.SearchOption.AllDirectories);
    foreach (var name in bgmNames)
    {
        //拡張子を取り除く
        string capitalName = name.ToUpper();
        if ((capitalName.Contains("MP3") || capitalName.Contains("WAV")) && !capitalName.Contains(".META"))
        {
            string newName = capitalName.Substring(name.LastIndexOf("/") + 1).Replace(".WAV", "").Replace(".MP3", "").Replace("LOOP", "").ToUpper();
            bgmList.Add(newName);
            bgms.Add(AssetDatabase.LoadAssetAtPath<AudioClip>(name));
        }
    }

    //Enum生成
    EnumCreator.Create("Bgm_Enum", "Assets/Scripts/Sound/Bgm_Enum.cs", bgmList);
}
```

</details>

<details>
<summary>EnumCreator.cs</summary>

```csharp
namespace Sound
{
    public class EnumCreator
    {
        /// <summary>
        /// 記述するコード
        /// </summary>
        private static string code = "";

        private const string tab = "\t";
        private const string openBrace = "{";
        private const string closeBrace = "}";

        /// <summary>
        /// 初期化処理
        /// </summary>
        /// <param name="enumName"></param>
        private static void Init(string enumName)
        {
            code = "";

            code += "public enum " + enumName + "\n"
                + openBrace + "\n";
        }

        /// <summary>
        /// 書き込み
        /// </summary>
        /// <param name="exportPath"></param>
        /// <param name="enumName"></param>
        private static void Export(string exportPath, string enumName)
        {
            code += "}";

            File.WriteAllText(exportPath, code, Encoding.UTF8);
            AssetDatabase.Refresh(ImportAssetOptions.ImportRecursive);
        }

        /// <summary>
        /// コード生成
        /// </summary>
        /// <param name="enumName"></param>
        /// <param name="exportPath"></param>
        /// <param name="itemNameList"></param>
        public static void Create(string enumName, string exportPath, List<string> itemNameList)
        {
            Init(enumName);

            for (int i = 0; i < itemNameList.Count; ++i)
            {
                code += tab + itemNameList[i] + "," + "\n";
            }

            Export(exportPath, enumName);
        }
    }
}
```

</details>

### ポイント3：UniTask × DOTweenの非同期アニメーション

UniTaskとDOTweenを併用することで非同期でアニメーションやイベント処理を行うようにしました。読みやすいコードになり、可読性と保守性が上がりました。

**該当ファイル**

- Assets/Scripts/GameMain/GameRule/HpZero.cs
- Assets/Scripts/GameMain/GameRule/GameClear.cs
- Assets/Scripts/SceneManager.cs
- Assets/Scripts/FadeManager.cs

<details>
<summary>HpZero.cs</summary>

```csharp
namespace GameRule
{
    public class HpZero : IGameRule
    {
        private readonly PlayerBehaviour player;

        private readonly SceneManager sceneManager;

        private readonly ISoundManager soundManager;

        /// <summary>
        /// コンストラクタ
        /// </summary>
        /// <param name="player"></param>
        public HpZero(PlayerBehaviour player, SceneManager sceneManager, ISoundManager soundManager)
        {
            this.player = player;
            this.sceneManager = sceneManager;
            this.soundManager = soundManager;
        }

        /// <summary>
        /// HPが0になった際の処理を登録する
        /// </summary>
        /// <param name="action"></param>
        public void Init()
        {
            player.Hp.Where(x => x == 0).
                Subscribe(async _ =>
                {
                    Time.timeScale = 0;

                    soundManager.StopBgm();
                    soundManager.PlaySe(Se_Enum.GAMEOVER);

                    await UniTask.Delay(TimeSpan.FromSeconds(3.0f), ignoreTimeScale: true);

                    await sceneManager.LoadScene("Title");

                    Time.timeScale = 1;
                }
                );
        }
    }
}
```

</details>

<details>
<summary>SceneManager.cs</summary>

```csharp
public class SceneManager
{
    private readonly ZenjectSceneLoader sceneLoader;

    private readonly IFadeManager fadeManager;

    public SceneManager(ZenjectSceneLoader sceneLoader, IFadeManager fadeManager)
    {
        this.sceneLoader = sceneLoader;
        this.fadeManager = fadeManager;
    }

    /// <summary>
    /// シーン遷移
    /// </summary>
    /// <param name="nextSceneName"></param>
    public async UniTask LoadScene(string nextSceneName)
    {
        await fadeManager.FadeOut();

        await sceneLoader.LoadSceneAsync("Scenes/" + nextSceneName);

        await fadeManager.FadeIn();
    }

    /// <summary>
    /// シーンを遷移して遷移後のSceneContextに任意のパラメータをBind
    /// </summary>
    /// <typeparam name="T"></typeparam>
    /// <param name="targetSceneName"></param>
    /// <param name="sceneParameter"></param>
    public async UniTask LoadScene<T>(string targetSceneName, T sceneParameter)
    {
        await fadeManager.FadeOut();

        sceneLoader.LoadScene("Scenes/" + targetSceneName, LoadSceneMode.Single,
            (diContainer) =>
            {
                if (sceneParameter != null)
                {
                    diContainer.BindInstance(sceneParameter).AsTransient();
                }
            });

        await fadeManager.FadeIn();
    }
}
```

</details>

<details>
<summary>FadeManager.cs</summary>

```csharp
public class FadeManager : MonoBehaviour, IFadeManager
{
    [SerializeField]
    private Image fadeImage;

    [Header("フェードにかかる時間"), SerializeField]
    private float fadeTime;


    public async UniTask FadeIn()
    {
        await fadeImage.DOFade(0.0f, fadeTime).SetUpdate(UpdateType.Normal, true);
    }

    public async UniTask FadeOut()
    {
        await fadeImage.DOFade(1.0f, fadeTime).SetUpdate(UpdateType.Normal, true);
    }
}
```

</details>

## 苦労した点

初めてグループでGitで使用したが、ブランチの変え忘れや競合の発生など、エラーが多々発生した。解決する中でGitについての理解が深まった。
