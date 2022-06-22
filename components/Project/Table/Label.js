const Label = ({ children }) => {
    return (
        <h3 className="text-sm md:text-lg lg:text-lg font-bold uppercase tracking-widest mb-1 md:mb-2 lg:mb-3">
            {children}
        </h3>
    );
};

export default Label;
