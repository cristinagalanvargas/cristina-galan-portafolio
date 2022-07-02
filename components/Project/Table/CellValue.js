const CellValue = ({ children }) => {
    return (
        <p className="tw-transition col-span-2 text-base font-medium capitalize text-neutral-700 dark:text-neutral-300 md:text-lg lg:text-lg">
            {children}
        </p>
    );
};

export default CellValue;
