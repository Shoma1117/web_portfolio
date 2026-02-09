"use client"
import { useState } from "react";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

export default function NavigationLayout({ children }: { children: React.ReactNode }) {
    const [ isOpen, setIsOpen ] = useState(false);
    return(
        //PCはサイドバー、スマホはトグルボタンを設置し、押したら出てくるように
        <aside className={`fixed left-0 lg:static lg:translate-x-0 z-40 transition-transform duration-400 inset-y-0 w-[18rem] ease-in-out bg-bg-sub border-r border-border pt-8
            ${isOpen ? "translate-x-0" : "-translate-x-full"}`}>
            <button 
                className="lg:hidden absolute right-0 translate-x-full bottom-8 bg-bg-sub border-y-3 border-r-3 border-border"
                onClick={() => { setIsOpen(!isOpen)} }>
                    {isOpen ? <ChevronLeft size={42} /> : <ChevronRight size={42} />}
            </ button>
            {children}
        </aside>
    );
}