const Label = ({ children }) => {
    return (
        <h3 className="mb-1 font-serif text-lg font-bold uppercase tracking-widest md:mb-2 md:text-3xl lg:mb-3 lg:text-3xl">
            {children}
        </h3>
    );
};

export default Label;
