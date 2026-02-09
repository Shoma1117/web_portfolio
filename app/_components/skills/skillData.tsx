import type { LucideIcon } from "lucide-react";
import { Gamepad2, Globe, Blocks } from "lucide-react";

//各スキル
export type SkillItem = {
  name: string;
  tags: string[];
};

//スキルのカテゴリ
export type SkillCategory = {
  name: string;
  icon: LucideIcon;
  color: string;
  items: SkillItem[];
};

//===== ゲーム系 =====

const cpp: SkillItem = {
  name: "C++",
  tags: [
    "各種STL",
    "ラムダ式",
    "template",
    "std::function",
    "マルチスレッド処理",
    "スマートポインタ",
    "名前空間",
    "ファイル操作",
  ],
};

const cs: SkillItem = {
  name: "C#",
  tags: [
    "各種コレクション",
    "パターンマッチ",
    "ラムダ式",
    "デリゲート",
    "非同期処理",
    "プロパティ",
    "ジェネリック",
    "ファイル操作",
  ],
};

const unity: SkillItem = {
  name: "Unity",
  tags: [
    "Extenject (DI Container)",
    "UniTask",
    "UniRx",
    "DOTween",
    "TextMeshPro",
    "Post Processing",
    "エディタ拡張",
  ],
};

//===== Web系 =====

const typeScript: SkillItem = {
  name: "TypeScript",
  tags: ["配列操作", "型定義", "ジェネリクス"],
};

const nextjs: SkillItem = {
  name: "Next.js",
  tags: ["App Router"],
};

const react: SkillItem = {
  name: "React 19",
  tags: ["Server Components", "Client Components"],
};

const tailwind: SkillItem = {
  name: "Tailwind CSS 4",
  tags: ["@theme", "@utility", "デザインシステム"],
};

const devops: SkillItem = {
  name: "CI/CD",
  tags: ["Docker", "docker-compose", "GitHub Actions", "AWS EC2"],
};

//===== その他 =====

const oop: SkillItem = {
  name: "オブジェクト指向",
  tags: ["継承", "ポリモーフィズム", "カプセル化", "SOLID原則"],
};

const designPattern: SkillItem = {
  name: "デザインパターン",
  tags: [
    "State",
    "Observer",
    "Singleton",
    "ServiceLocator",
    "DI",
    "Flyweight",
    "Factory",
    "Prototype",
    "MVP",
  ],
};

//===== カテゴリまとめ =====

const gameDev: SkillCategory = {
  name: "GAME",
  icon: Gamepad2,
  color: "text-syntax-string",
  items: [cpp, cs, unity],
};

const webDev: SkillCategory = {
  name: "WEB",
  icon: Globe,
  color: "text-syntax-comment",
  items: [typeScript, nextjs, react, tailwind, devops],
};

const other: SkillCategory = {
  name: "OTHER",
  icon: Blocks,
  color: "text-syntax-purple",
  items: [oop, designPattern],
};

export const skillData: SkillCategory[] = [gameDev, webDev, other];
