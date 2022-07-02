const CellKey = ({ children }) => {
    return (
        <p className="col-span-1 text-xs md:text-sm lg:text-sm text-neutral-500 capitalize">
            {children}
        </p>
    );
};

export default CellKey;
