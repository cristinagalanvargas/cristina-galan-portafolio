const CellValue = ({ children }) => {
    return (
        <p className="col-span-2 text-sm md:text-base lg:text-lg text-gray-700 dark:text-gray-300 tw-transition">
            {children}
        </p>
    );
};

export default CellValue;
