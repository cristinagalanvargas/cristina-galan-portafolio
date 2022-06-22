const CellContainer = ({ children }) => {
    return (
        <div className="grid grid-cols-3 gap-x-1 md:gap-x-2 lg:gap-x-3 py-1">
            {children}
        </div>
    );
};

export default CellContainer;
