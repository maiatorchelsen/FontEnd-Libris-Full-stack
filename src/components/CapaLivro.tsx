type Props = {
    src: string | null | undefined
    alt: string
    className?: string
}

export function CapaLivro({ src, alt, className = "" }: Props) {
    if (!src) {
        return (
            <div
                className={`${className} flex items-center justify-center bg-gradient-to-b from-[#241238] to-[#12091B]`}
                role="img"
                aria-label={alt}
            >
                <svg
                    className="w-10 h-10 text-purple-400/40"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="1.5"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
                </svg>
            </div>
        )
    }

    return <img src={src} alt={alt} className={className} />
}