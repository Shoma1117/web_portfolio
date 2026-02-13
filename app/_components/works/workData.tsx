export const CATEGORYS = {
    game: "GAME",
    web: "WEB"
} as const;

export type WorkCategory = "Game" | "Web";

export type WorkItem = {
    name: string;       //作品名
    thumbnail: string;      //サムネイル
    slug: string;       //表示するmdファイル名
    category: WorkCategory;     //GameかWebのカテゴリ
};

const rogueDungeon: WorkItem = {
    name: "Rogue Dungeon",
    thumbnail: "/works/thumbnail-rouge.webp",
    slug: "Rogue_Dungeon",
    category: "Game"
};

const amidaChangeRoute: WorkItem = {
    name: "あみだ Change ルート",
    thumbnail: "/works/thumbnail-amida.webp",
    slug: "amidaChangeRoute",
    category: "Game"
};

const quickGunman: WorkItem = {
    name: "早打ちガンマン",
    thumbnail: "/works/thumbnail-gunman.webp",
    slug: "quickGunman",
    category: "Game"
};

const defenceTreasure: WorkItem = {
    name: "defence treasure!",
    thumbnail: "/works/thumbnail-defence.webp",
    slug: "defenceTreasure",
    category: "Game"
};

const neoJumpCity: WorkItem = {
    name: "ネオジャンプシティ",
    thumbnail: "/works/thumbnail-neoJump.webp",
    slug: "neoJumpCity",
    category: "Game"
};

const anchorGravity: WorkItem = {
    name: "AnchorGravity",
    thumbnail: "/works/thumbnail-anchor.webp",
    slug: "anchorGravity",
    category: "Game"
};

const behaviorTree: WorkItem = {
    name: "BehaviorTree",
    thumbnail: "/works/thumbnail-behavior.webp",
    slug: "behaviorTree",
    category: "Game"
};

const onlineQuiz: WorkItem = {
    name: "OnlineQuiz",
    thumbnail: "/works/thumbnail-min-sider.webp",
    slug: "onlineQuiz",
    category: "Web"
};

const portfolio: WorkItem = {
    name: "Webポートフォリオ",
    thumbnail: "/works/thumbnail-portfolio.webp",
    slug: "portfolio",
    category: "Web"
};

export const workData: WorkItem[] = [
    rogueDungeon,
    amidaChangeRoute,
    quickGunman,
    defenceTreasure,
    neoJumpCity,
    anchorGravity,
    behaviorTree,
    onlineQuiz,
    portfolio
];

//mdファイル名と内容の紐づけ
export type WorkContents = Record<string, string>;