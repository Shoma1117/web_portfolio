//あんまり意味なさそうだけど一応ServerComponentに切り出しておく
export default function SidebarWrapper({ children }: { children: React.ReactNode }) {
    return(
        <aside className="w-72 bg-bg-sub border-r border-border pt-8">
            {children}
        </aside>
    );
}