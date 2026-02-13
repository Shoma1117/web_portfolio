![サムネイル](/works/thumbnail-portfolio.webp)

| 項目 | 内容 |
| --- | --- |
| 制作期間 | 1週間 |
| 制作人数 | 1人 |
| 開発環境 | TypeScript / Next.js 16 / React 19 / Tailwind CSS 4 |
| リポジトリ | [GitHub](https://github.com/Shoma1117/web_portfolio) |

## 作品概要

日常的に使用しているVS Codeをモチーフにしたポートフォリオサイトです。
サイドバーの目次やダークテーマの配色など、エディタのUIを再現することでエンジニアとしての自分らしさを表現しました。
作品情報をマークダウンで管理することで、内容の追加・編集が容易になるようにしました。

## 工夫した点

### ポイント1：見出しの自動生成によるサイドバー目次

ページ内のh2・h3要素を取得し、サイドバーの目次を自動生成するようにした。
また、現在閲覧中のセクションを検知し、対応する目次項目をハイライトして見やすくした。
これにより、セクションを追加・削除しても目次が自動で追従するためメンテナンスが不要になった。

<details>
<summary>contents.tsx</summary>

```tsx
useEffect(() => {
    //もくじの作成
    const hNodeList = document.querySelectorAll("h2, h3");
    requestAnimationFrame(() => {
        setHeading(Array.from(hNodeList).map(h => (
            {
                id: h.id,
                text: h.textContent,
                level: Number(h.tagName[1])
            })));
        });

    //閲覧中のセクションのもくじを青くする
    const sectionObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if(entry.isIntersecting){
                    setActiveSection(entry.target.id);
                }
            });
        },
        { threshold: 0.5 }
    );

    hNodeList.forEach(hNode => sectionObserver.observe(hNode));

    return () => sectionObserver.disconnect();
}, []);
```

</details>

### ポイント2：マークダウンによる作品管理

各作品の詳細情報を.mdファイルで管理し、Server Componentでビルド時に一括読み込みする構成にした。
作品を追加する際は、マークダウンファイルを1つ作成してworkDataに登録するだけで完了する。
描画にはreact-markdownにremark-gfm（テーブル対応）、rehype-raw（HTML埋め込み対応）、rehype-highlight（コードハイライト）を組み合わせて使用した。

<details>
<summary>LoadWorkContents.tsx</summary>

```tsx
import fs from "fs";
import path from "path";
import { workData } from "./workData";
import type { WorkContents } from "./workData";
import Work from "./work";

export default function LoadWorkContents() {
    const wc: WorkContents = {};

    for(const work of workData){
        const filePath = path.join(process.cwd(), "app/_components/works/contents", `${work.slug}.md`);
        try{
            wc[work.slug] = fs.readFileSync(filePath, "utf-8");
        }catch{
            console.warn(`${work.slug}.mdが見つかりませんでした`);
            wc[work.slug] = "";
        }
    }

    return <Work workContents={wc}/>;
}
```

</details>
