export default function Header({ title, description }: Readonly<{ title: string; description: string }>) {
    
    return (
        
        <section className="relative bg-gradient-to-br from-[#071A4D] via-[#0a2a6e] to-[#0451A0] text-white overflow-hidden">
            <div className="absolute inset-0 opacity-[0.04]"
            style={{
                backgroundImage: `linear-gradient(rgba(230, 177, 33) 1px, transparent 1px),
                linear-gradient(90deg, rgba(230, 177, 33) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
            }}
            />
            <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full bg-[#0451A0]/40 blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-72 h-72 rounded-full bg-[#071A4D]/60 blur-3xl" />

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-18 text-center">
                <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.05] text-balance">
                    {title || 'Title'}
                </h1>
                <p className="text-lg sm:text-xl text-white/75 max-w-3xl mx-auto leading-relaxed">
                    {description || 'Description'}
                </p>
            </div>
        </section>
    )
}