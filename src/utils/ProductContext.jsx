import React, { createContext, useState, useContext } from "react";

const ProductContext = createContext();
export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [selectedProducts, selectedProductsFromContext] = useState();


    const updateProducts = (newProducts) => {
        setProducts(newProducts);
    };

    const setSelectedProducts = (value) => {
        console.log("----------------------------------------------------------------")
        console.log({value})
        console.log("----------------------------------------------------------------")
        selectedProductsFromContext(value)
    }

    const updateSelectedProducts = () => {
        console.log(" <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        console.log({selectedProducts})
        console.log(" <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
        setProducts(selectedProducts);
    }

    // const selectedProductsFromContext = (productId) => {
    //     setSelectedProducts((prevSelected) =>
    //         prevSelected.includes(productId)
    //             ? prevSelected.filter((id) => id !== productId)
    //             : [...prevSelected, productId]
    //     );
    // };

    return (
        <ProductContext.Provider
            value={{
                products,
                selectedProducts,
                setProducts,
                updateProducts,
                setSelectedProducts,
                updateSelectedProducts
                // selectedProductsFromContext,
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
