import { Github, Mail } from "lucide-react";

export default function About() {
  return (
    <section className="flex flex-col md:flex-row items-center justify-center gap-32 min-h-dvh">
      <div className="flex flex-col items-end md:w-1/2">
        <div>
          <h2 id="Portfolio" className="text-heading heading-section">
            Portfolio Site
          </h2>
          <p className="text-description text-supplement">
            Shomaのポートフォリオ
          </p>
          <h3 id="profile" className="text-subHeading mt-4">
            自己紹介
          </h3>
          <p className="text-description text-primary">
            岡山県出身。専門学校で <br />
            ゲームプログラミングを学んだ後、
            <br />
            ゲーム会社にてマーケティング業務に従事。
            <br />
            SEO/ASO対策、ホームページの
            <br />
            フロントエンド実装等行ってきました。
            <br />
          </p>

          <div>
            <h3 id="contact" className="text-subHeading mt-2">
              Contact
            </h3>
            <address>
              <div className="flex items-center gap-4">
                <Github size={32} className="text-primary" />
                <a
                  className="text-description text-primary"
                  href="https://github.com/Shoma1117"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  https://github.com/Shoma1117
                </a>
              </div>
              <div className="flex items-center gap-4">
                <Mail size={32} className="text-primary" />
                <a
                  className="text-description text-primary"
                  href="mailto:yabukishoma1117@gmail.com"
                  rel="noopener noreferrer"
                >
                  yabukishoma1117@gmail.com
                </a>
              </div>
            </address>
          </div>
        </div>
      </div>

      <div className="flex flex-col items-start md:w-1/2">
        <h3 id="about" className="text-subHeading">
          このサイトについて
        </h3>
        <div className="p-8 bg-bg-accent rounded-xl">
          <p className="text-description text-text">
            履歴書やESだけでは伝えきれない、 <br />
            自分のスキルやものづくりへの姿勢を <br />
            知っていただきたいと思い、 <br />
            このサイトを制作しました。 <br />
            日常的に使用しているVS Codeを <br />
            モチーフにすることで、 <br />
            エンジニアとしての自分らしさを <br />
            表現しています。 <br />
          </p>
        </div>
      </div>
    </section>
  );
}
