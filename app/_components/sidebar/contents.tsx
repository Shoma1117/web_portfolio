"use client"
import { useState } from "react";
import { useEffect } from "react";
import { ChevronDown } from "lucide-react";

//見出しの型
type Heading = {
    id: string;     //sectionのid。クリック時のジャンプ先
    text: string;   //見出し名
    level: number;  //見出しサイズによってインデントを変える用
};

export default function SidebarContents(){
    //レンダリング済みのHTMLから見出し要素を取得し、もくじを作成する
    //マークダウンとtsxで書く部分が混在しそうなのでremarkは不採用
    const [heading, setHeading] = useState<Heading[]>([]);
    const [activeSection, setActiveSection] = useState("");

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
    
    return (
    <nav className="flex flex-col">
        {heading.map(h => (
            <a 
                key={h.id}
                href={`#${h.id}`}
                onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(h.id)?.scrollIntoView({behavior: "smooth"});
                }}
                className={`
                    flex mt-1
                    ${h.level === 3 ? "ml-16" : "ml-4"}
                    ${activeSection === h.id ? "bg-selection border border-focus" : ""}`}   
            >
                <div className="flex">
                    {h.level === 2 ? <ChevronDown size={24} /> : ""}
                    {h.text}
                </div>
            </a>
        ))}
    </nav>
    )
};