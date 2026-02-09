import { skillData } from "./skillData";

export default function Skills() {
    return (
        //大見出し
        <section className="px-8 py-16">
            <h2 id="Skills" className="text-heading heading-section">
                Skills
            </h2>
            <p className="text-description text-supplement mb-8">Extensions</p>

            {/*各種スキルの詳細を展開する*/}
            {skillData.map((category) => (
                <div key={category.name} className="mb-8">
                    <h3
                        id={category.name.toLowerCase()}
                        className="flex items-center gap-2 text-supplement uppercase tracking-wider text-label mb-4"
                    >
                        <category.icon size={16} className={category.color} />
                        {category.name}
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {category.items.map((item) => (
                            <div
                                key={item.name}
                                className="bg-bg-accent rounded-lg p-4 border border-transparent hover:border-focus transition-colors"
                            >
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded bg-bg flex items-center justify-center shrink-0">
                                        <category.icon size={20} className={category.color} />
                                    </div>
                                    <p className="text-text font-bold">{item.name}</p>
                                </div>

                                {item.tags.length > 0 && (
                                    <div className="border-t border-border mt-3 pt-3 flex flex-wrap gap-2">
                                        {item.tags.map((tag) => (
                                            <span
                                                key={tag}
                                                className="bg-bg rounded px-2 py-1 text-tag text-text"
                                            >
                                                {tag}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    );
}
