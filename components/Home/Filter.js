export default function Filter({
    method,
    isSelected,
    label,
    length,
    onCursor,
}) {
    return (
        <button
            className={`flex flex-row items-baseline tw-link text-base md:text-lg lg:text-xl focus:outline-none ${
                isSelected ? 'filter-btn-on' : ''
            }`}
            type="button"
            onClick={() => method()}
            onMouseEnter={() => onCursor('tw-hovered')}
            onMouseLeave={onCursor}
        >
            {label}
            <span className="ml-0.5 sm:ml-1 text-xs md:text-sm text-black dark:text-white tw-transition">
                ({length})
            </span>
        </button>
    );
}
