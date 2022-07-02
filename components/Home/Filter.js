export default function Filter({
    method,
    isSelected,
    label,
    length,
    onCursor,
}) {
    return (
        <button
            className={`tw-link flex flex-row items-baseline text-base focus:outline-none md:text-lg lg:text-xl ${
                isSelected ? 'filter-btn-on' : ''
            }`}
            type="button"
            onClick={() => method()}
            onMouseEnter={() => onCursor('tw-hovered')}
            onMouseLeave={onCursor}
        >
            {label}
            <span className="tw-transition ml-0.5 text-xs text-black dark:text-white sm:ml-1 md:text-sm">
                ({length})
            </span>
        </button>
    );
}
