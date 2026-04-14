type Tab = 'details' | 'register' | 'volunteer'

interface TabDef {
    key: Tab
    label: string
}

interface EventTabsProps {
    tabs: TabDef[]
    activeTab: Tab
    onTabChange: (tab: Tab) => void
}

export default function EventTabs({ tabs, activeTab, onTabChange }: Readonly<EventTabsProps>) {
    return (
        <div className="flex gap-1 border-b border-border">
            {tabs.map((tab) => (
                <button key={tab.key} onClick={() => onTabChange(tab.key)}
                    className={`px-5 py-2.5 text-sm font-semibold transition-colors border-b-2 -mb-px 
                        ${activeTab === tab.key
                            ? 'border-accent text-accent'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                        }`}
                >
                    {tab.label}
                </button>
            ))}
        </div>
    )   
}