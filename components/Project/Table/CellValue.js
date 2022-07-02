const CellValue = ({ children }) => {
    return (
        <p className="col-span-2 text-base md:text-lg lg:text-lg text-neutral-700 font-medium dark:text-neutral-300 tw-transition capitalize">
            {children}
        </p>
    );
};

export default CellValue;
