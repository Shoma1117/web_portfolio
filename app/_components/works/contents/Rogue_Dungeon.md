<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden;">
  <iframe src="https://www.youtube.com/embed/n-Iv996xN58?autoplay=1&mute=1&rel=0&playsinline=1&controls=0&loop=1&playlist=n-Iv996xN58" style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border-radius: 8px;" frameborder="0" allow="autoplay" allowfullscreen></iframe>
</div>

| 項目       | 内容                                    |
| ---------- | --------------------------------------- |
| 制作期間   | 2024年6月6日 → 2024年6月20日            |
| 制作人数   | 1人                                     |
| 開発環境   | C++ / DxLib                             |
| プレイ動画 | [YouTube](https://youtu.be/n-Iv996xN58) |
| リポジトリ | [GitHub](https://github.com/Shoma1117/Rogue_Dangion) |

## 作品概要

敵を倒したりアイテムを使いながらゴールを目指すローグライクRPG。

## 工夫した点

### ポイント1：モジュール化された画像/アニメーション管理クラス

**該当ファイル**

- Rogue-Dungeon/header/Texture.h
- Rogue-Dungeon/header/DivTexture.h
- Rogue-Dungeon/header/TextureManager.h
- Rogue-Dungeon/header/Animation.h

フライウェイトパターンを採用し、一度読み込んだ画像はキャッシュしておくことで
メモリ効率をあげました。画像利用クラス全般で活用しました。

<details>
<summary>TextureManager.h</summary>

```cpp
/// <summary>
/// 画像がキャッシュされているか確認して返す
/// </summary>
/// <param name="path"></param>
/// <returns></returns>
std::shared_ptr<Texture> GetTexture(std::string path) override
{
	// ファイル名で画像クラスを検索
	auto it = textureContainer.find(path);

	// コンテナ内にあれば、その画像クラスを返す
	if (it != textureContainer.end())
	{
		return it->second;
	}

	// コンテナ内に無ければ、新しく画像クラスを作成してコンテナに登録
	auto newTexture = createTexture(path);
	textureContainer.insert(std::make_pair(path, newTexture));

	// 作成した画像クラスを返す
	return newTexture;
}
```
</details>

また、作成したTextureManagerを活用し、Animationクラスを作成しました。
アニメーションをマルチスレッドで処理することで利用しやすくしました。
C++でのマルチスレッドは初めてだったので苦戦しましたが、満足が行くものができて良かったです。
キャラクター関連クラスで活用しました。

<details>
<summary>Animation.h</summary>

```cpp
/// <summary>
/// コンストラクタ
/// </summary>
/// <param name="path">画像へのパス</param>
/// <param name="allFrameNum">画像を分割した際の合計</param>
/// <param name="xNum">横方向に何個分割するのか</param>
/// <param name="yNum">縦方向に何個分割するのか</param>
Animation(std::string path, std::shared_ptr<ITextureManager>textureManager)
	:animationSpeed(0)
	,currentAnimationFrame(0)
	,animationFuture(std::async(std::launch::async, &Animation::NextFrame, this))
	,stopAnimation(false)
{
	std::shared_ptr<DivTexture> divTexture = textureManager->GetDivTexture(path);

	handle = divTexture->GetHandle();
}

	/// <summary>
	/// アニメーション登録
	/// </summary>
	/// <param name="animationName"></param>
	/// <param name="startFrame">開始フレーム</param>
	/// <param name="endFrame">終了フレーム</param>
	void RegisterAnimation(std::string animationName, int startFrame, int endFrame)
	{
		animationState[animationName] = std::make_pair(startFrame, endFrame);
		currentAnimationFrame = startFrame;
	}

	/// <summary>
	/// アニメーション変更
	/// </summary>
	/// <param name="nextAnimation">次のアニメーション名</param>
	void ChangeAnimation(std::string nextAnimation)
	{
		currentAnimationName = nextAnimation;
		currentAnimationFrame = animationState[currentAnimationName].first;
	}

	/// <summary>
	/// アニメーションスタート
	/// </summary>
	void StartAnimation()
	{
		StopAnimation();
		stopAnimation = false;
		animationFuture = std::async(std::launch::async, &Animation::NextFrame, this);
	}

	/// <summary>
	/// 次のフレームへ進める
	/// </summary>
	/// <returns>進めるフレーム数</returns>
	void NextFrame()
	{
		while (!stopAnimation)
		{
			//aninmationSpeed分待機してフレームを進める
			std::this_thread::sleep_for(std::chrono::milliseconds(animationSpeed));

			++currentAnimationFrame;
			if (currentAnimationFrame > animationState[currentAnimationName].second)
			{
				currentAnimationFrame = animationState[currentAnimationName].first;
			}
		}
	}
```
</details>

### ポイント2：フィルター機能付きのオブザーバー

**該当ファイル**

- Rogue-Dungeon/header/Observable.h
- Rogue-Dungeon/header/ReactivePropaty.h

UnityでオブザーバーパターンをC利用できるライブラリ「UniRx」のWhereオペレーターが便利だったので
再現してみました。

<details>
<summary>Observable.h</summary>

```cpp
/// <summary>
/// フィルタリング
/// </summary>
template <class Self>
Self& Where(this Self& self, std::function<bool()> func)
{
	self.filter = func;
	return self;
}

/// <summary>
/// 購読する
/// </summary>
std::shared_ptr<Disposable<T>> Subscribe(std::function<void(T value)> function)
{
	std::shared_ptr<Observer<T>> observer = std::make_shared<Observer<T>>(function);

	//重複チェック
	bool isDuplication = false;
	for (const auto& itr : observers)
	{
		if (observer == itr.second)
		{
			isDuplication = true;
			break;
		}
	}

	if (!isDuplication)
	{
		observers.push_back(std::make_pair(&filter, observer));
	}

	filter = defaultFilter;

	return std::make_shared<Disposable<T>>(&observers, &std::make_pair(&filter, observer));
}

/// <summary>
/// イベント発火
/// </summary>
void OnNext(T value)
{
	for (const auto& itr : observers)
	{
		if (itr.first)
		{
			itr.second->OnNext(value);
		}
	}
}

//フィルタリングがされなかった時呼ばれる。常にtrueを返す
std::function<bool()> defaultFilter;

//フィルタリング用の関数
std::function<bool()> filter;

//フィルタリング関数とObserverのペア
std::list<std::pair<std::function<bool()>*, std::shared_ptr<Observer<T>>>> observers;
```

</details>

応用として、値に変化があった際にイベントを発火するReactivePropatyを作成しました。
キャラクターが状態遷移する際の行動完了フラグなどに活用しました。

<details>
<summary>ReactiveProperty.</summary>

```cpp
template<class T>
class ReactiveProperty : public Observable<T>
{
public:
	/// <summary>
	/// 引数なしコンストラクタ
	/// </summary>
	ReactiveProperty() = default;

	/// <summary>
	/// 引数ありコンストラクタ
	/// </summary>
	/// <param name="value"></param>
	ReactiveProperty(T value)
		:value(value)
	{}

	/// <summary>
	/// デストラクタ
	/// </summary>
	~ReactiveProperty() = default;

	/// <summary>
	/// ゲッター
	/// </summary>
	/// <returns></returns>
	T GetValue()
	{
		return value;
	}

	/// <summary>
	/// セッター
	/// </summary>
	/// <param name="value"></param>
	/// <returns></returns>
	void SetValue(T value)
	{
		this->value = value;
	}

	//オペレーターオーバーロード
	T& operator +(const T& value)
	{
		//値に変化があればイベント発火
		if (this->value != (this->value + value))
		{
			this->value += value;
			this->OnNext(this->value);
		}
		return this->value;
	}
	
	・
	・
	・
	
private:
	T value;
};
```
</details>

### ポイント3：シーンごとに中身が変わるサービスロケータ

**該当ファイル**

- Rogue-Dungeon/source/ServiceLocator.h
- Rogue-Dungeon/source/ProjectContext.h
- Rogue-Dungeon/source/SceneContext.h

ゲーム中常に存在するサービスロケータと、シーンごとに中身を切り替えれるサービスロケータを作成しました。
中身を切り替えることで初期化や終了処理を行いやすくしたり、メモリの無駄遣いを防ぎました。

<details>
<summary>ServiceLocator.h</summary>

```cpp
/// <summary>
/// クラスの登録
/// </summary>
/// <typeparam name="T"></typeparam>
template<typename T>
void Bind()
{
    auto creator = []() -> std::shared_ptr<void>
    {
        return std::make_shared<T>();
    };

    creatorContext[typeid(T)] = creator;
}

/// <summary>
/// インターフェイスありver
/// </summary>
/// <typeparam name="DerivativeClass">派生クラス</typeparam>
/// <typeparam name="Interface">インターフェイス</typeparam>
template<typename Interface, typename DerivativeClass>
void Bind()
{
    auto creator = []() -> std::shared_ptr<void>
    {
        return std::make_shared<DerivativeClass>();
    };

    creatorContext[typeid(Interface)] = creator;
}

/// <summary>
/// クラスの取得
/// </summary>
/// <typeparam name="T"></typeparam>
/// <returns></returns>
template<typename T>
std::shared_ptr<T> GetClass()
{
    //すでにキャッシュされているなら同じものを返す
    auto cacheIt = cacheContext.find(typeid(T));
    if (cacheIt != cacheContext.end())
    {
        return std::static_pointer_cast<T>(cacheIt->second);
    }

    //まだ生成されていなければ新しく生成してキャッシュする
    auto creatorIt = creatorContext.find(typeid(T));
    if (creatorIt != creatorContext.end())
    {
        cacheContext[typeid(T)] = creatorIt->second();
        return std::static_pointer_cast<T>(cacheContext[typeid(T)]);
    }
    else
    {
        throw "error : Not Bind\n";
    }
}

/// <summary>
/// Bindされているものをすべて消す
/// </summary>
void Disable()
{
    cacheContext.clear();
    creatorContext.clear();
}

protected:
/// <summary>
/// キャッシュしておくコンテナ
/// </summary>
std::unordered_map<std::type_index, std::shared_ptr<void>> cacheContext;

/// <summary>
/// 新しく作成するコンテナ
/// </summary>
std::unordered_map<std::type_index, std::function<std::shared_ptr<void>()>> creatorContext;
```

</details>

<details>
<summary>ProjectContext.h</summary>

```cpp
/// <summary>
///　プロジェクト内で常に存在するサービスロケータ
/// </summary>
class ProjectContext : public ServiceLocator
{
public:
    //シングルトン
    static ProjectContext& instance() 
    {
        static ProjectContext instance;
        return instance;
    }

    ProjectContext(const ProjectContext&) = delete;
    ProjectContext& operator=(const ProjectContext&) = delete;

private:
    ProjectContext() = default;
};
```

</details>

<details>
<summary>SceneContext.h</summary>

```cpp
/// <summary>
///　シーンごとのサービスロケータ
/// </summary>
class SceneContext : public ServiceLocator
{
public:
    //シングルトン
    static SceneContext& instance() 
    {
        static SceneContext instance;
        return instance;
    }

    SceneContext(const SceneContext&) = delete;
    SceneContext& operator=(const SceneContext&) = delete;

private:
    SceneContext() = default;
};
```
</details>

### ポイント4：ランダムに自動生成されるマップ

**該当ファイル**

- Rogue-Dungeon/source/Map.cpp
- Rogue-Dungeon/source/MapCreator.cpp

区域分割法を活用し、マップをランダムで生成するようにして単調なゲームプレイにならないようにしました。
アルゴリズムをコードとして落とし込むのが大変でした。

[マップが自動生成される様子]
![](/works/mapRandomCreate.gif)

