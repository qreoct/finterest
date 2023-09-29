interface StatCardProps {
    stat: string | number;
    description: string | number;
    subtitle?: string;
    size: string;
    selected?: boolean;
}

export const StatCard = ({ stat, description, subtitle, size, selected }: StatCardProps) => {
    return (
        size === 'large' ?
            (
                <div className="flex flex-col justify-center items-center rounded-lg px-8 py-4 space-y-2">
                    <h3 className="font-gupter text-gold-500 font-bold text-6xl">{stat}</h3>
                    <h5 className="text-xs text-neutral-text-gray uppercase tracking-widest text-center text-finterest-solid">{description}</h5>
                </div>
            )
            :
            (
                <div className="flex flex-col justify-top items-center">
                    <div className={`flex-col justify-center items-center ${selected ? 'bg-gold-500' : 'bg-bg-slate-200'} ${selected ? 'border-0' : 'border-2'} rounded-lg h-28 lg:h-36 w-28 px-4 lg:px-2 py-2 lg:py-8 space-y-2`}>
                        <h3 className={`font-gupter text-center self-center text-neutral-headings-black font-bold text-3xl xl:text-4xl ${selected ? 'text-white' : 'text-finterest-solid'}`}>{stat}</h3>
                        <h5 className={`text-xs text-neutral-text-gray uppercase tracking-widest text-center ${selected ? 'text-white' : 'text-finterest-solid'} `}>{description}</h5>

                    </div>
                    {subtitle && <span className="text-xs text-neutral-text-gray uppercase tracking-widest text-center text-finterest-solid">{subtitle}</span>}
                </div>
            )
    )
}