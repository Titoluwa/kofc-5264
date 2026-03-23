export default function HeaderSkeleton() {
    return (
        <section className="relative bg-gradient-to-br from-[#071A4D] via-[#0a2a6e] to-[#0451A0] text-white overflow-hidden animate-pulse">
            <div className="absolute inset-0 opacity-[0.04]"
            style={{
                backgroundImage: `linear-gradient(rgba(230, 177, 33) 1px, transparent 1px),
                linear-gradient(90deg, rgba(230, 177, 33) 1px, transparent 1px)`,
                backgroundSize: '40px 40px',
            }}
            />
            <div className="relative max-w-7xl mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-16 lg:py-18 text-center flex flex-col items-center">
                <div className="h-12 w-2/3 bg-white/20 rounded-lg mb-6" />
                <div className="h-6 w-1/2 bg-white/10 rounded-lg" />
            </div>
        </section>
    );
}
