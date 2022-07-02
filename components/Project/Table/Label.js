const Label = ({ children }) => {
    return (
        <h3 className="text-lg md:text-3xl lg:text-3xl font-bold uppercase tracking-widest mb-1 md:mb-2 lg:mb-3 font-serif">
            {children}
        </h3>
    );
};

export default Label;
