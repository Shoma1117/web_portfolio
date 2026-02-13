<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe src="https://www.youtube.com/embed/WsmHXE7sc7A?autoplay=1&mute=1&rel=0&playsinline=1&controls=0&loop=1&playlist=WsmHXE7sc7A" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;" frameborder="0" allow="autoplay" allowfullscreen></iframe>
</div>

| 項目 | 内容 |
| --- | --- |
| 制作期間 | 2024年1月18日 → 2024年3月28日 |
| 制作人数 | 1人 |
| 開発環境 | C# / Unity |
| プレイ動画 | [YouTube](https://www.youtube.com/watch?v=WsmHXE7sc7A) |
| リポジトリ | [GitHub](https://github.com/Shoma1117/NeoJump_City) |

## 作品概要

2段ジャンプや壁走りを利用し、敵を倒してスコアを稼ぐ近未来FPS。

## 工夫した点

スピーディで気持ちよくプレイできるよう、壁走りの挙動に力を入れた。敵や壁走りにステートパターンを活用し、保守性、可読性の高いコードを書くようにした。また、DOTweenを使用し、簡易的なアニメーションを自作した。

**該当ファイル**

- Assets/Scripts/Character/Player/WallRun/PlayerWallRun.cs
- Assets/Scripts/Character/Player/WallRun/PlayerWallRunStateStart.cs
- Assets/Scripts/Character/Player/WallRun/PlayerWallRunStateNow.cs
- Assets/Scripts/Character/Player/WallRun/PlayerWallRunStateEnd.cs

<details>
<summary>PlayerWallRun.cs</summary>

```csharp
public class PlayerWallRun : MonoBehaviour
{
    private IWallRunState wallRunState;
    //状態一覧
    public PlayerWallRunStateStart wallRunStart;
    public PlayerWallRunStateNow wallRunNow;
    public PlayerWallRunStateEnd wallRunExit;

    private void Start()
    {
        wallRunState = wallRunStart;
    }

    private void FixedUpdate()
    {
        wallRunState.RunUpdate();
    }

    public void ChangeState(IWallRunState nextState)
    {
        wallRunState = nextState;
    }
}

//インターフェイス
public interface IWallRunState
{
    public void RunUpdate();
}
```

</details>

<details>
<summary>PlayerWallRunStateStart.cs</summary>

```csharp
//開始処理。壁の判定をとる
public class PlayerWallRunStateStart : MonoBehaviour, IWallRunState
{
    public void RunUpdate()
    {
        //角度を傾け壁走り状態に移行
        if (checkWall.CheckLeftWall() && !checkGround.CheckGroundStatus())
        {
            //左壁
            whichWall = WhichWall.left;
            RunStart();
        }
        if (checkWall.CheckRightWall() && !checkGround.CheckGroundStatus())
        {
            //右壁
            whichWall = WhichWall.right;
            RunStart();
        }
    }

    private void RunStart()
    {
        if (whichWall == WhichWall.left)
        {
            transform.DOLocalRotateQuaternion(Quaternion.AngleAxis(-angle, transform.forward) * transform.localRotation, 0.15f).Play().SetLink(gameObject);
        }
        else if (whichWall == WhichWall.right)
        {
            transform.DOLocalRotateQuaternion(Quaternion.AngleAxis(angle, transform.forward) * transform.localRotation, 0.15f).Play().SetLink(gameObject);
        }

        rb.useGravity = false;

        //壁に張り付いたら下に落ちないようにする
        rb.velocity = new Vector3(rb.velocity.x, 0, rb.velocity.z);

        playerWallRun.ChangeState(playerWallRun.wallRunNow);
    }
}
```

</details>

<details>
<summary>PlayerWallRunStateNow.cs</summary>

```csharp
//走る処理
public class PlayerWallRunStateNow : MonoBehaviour, IWallRunState
    public void RunUpdate()
    {
        //走らせる。壁から離れたら終了処理へ
        if (checkWall.CheckLeftWall())
        {
            rb.AddForce(new Vector3(-checkWall.wallNormal.z, 0, checkWall.wallNormal.x) * wallRunSpeed, ForceMode.Force);
        }
        else if (checkWall.CheckRightWall())
        {
            rb.AddForce(new Vector3(checkWall.wallNormal.z, 0, -checkWall.wallNormal.x) * wallRunSpeed, ForceMode.Force);
        }

        //足音を鳴らす
        PlayFootsteps();

        if (!(checkWall.CheckLeftWall() || checkWall.CheckRightWall()))
        {
            playerWallRun.ChangeState(playerWallRun.wallRunExit);
        }
    }

    private void PlayFootsteps()
    {
        if (isDelayTime) return;

        while (true)
        {
            //ランダムな種類の足音を鳴らす
            randomIndex = Random.Range(0, wallRunFootsteps.Length);

            //前回と違う足音なら鳴らす
            if (randomIndex != prevIndex)
            {
                break;
            }
        }

        audioSource.PlayOneShot(wallRunFootsteps[randomIndex]);

        //今回鳴らした音を記憶しておく
        prevIndex = randomIndex;

        //ディレイを入れる
        StartCoroutine(nameof(FootstepsDelay));
    }


    IEnumerator FootstepsDelay()
    {
        isDelayTime = true;
        yield return new WaitForSeconds(wallRunFootstepsDelayTime);
        isDelayTime = false;
    }
}
```

</details>

<details>
<summary>PlayerWallRunStateEnd.cs</summary>

```csharp
//終了処理
public class PlayerWallRunStateEnd : MonoBehaviour, IWallRunState
{
    public void RunUpdate()
    {
        //角度と重力をもとに戻す
        float angle = 0 - transform.eulerAngles.z;
        transform.DOLocalRotateQuaternion(Quaternion.AngleAxis(angle, transform.forward) * transform.localRotation, 0.15f).Play().SetLink(gameObject);

        rb.useGravity = true;

        playerWallRun.ChangeState(playerWallRun.wallRunStart);
    }
}
```

</details>

## 苦労した点

「気持ちがいい操作性とは何か」という答えがないものを突き詰めていくのが大変だった。
また、連続して壁走りをつなげれるようマップにもこだわった。ProBuilderを使用し、一から作成したが、作業量が多く苦労した。
