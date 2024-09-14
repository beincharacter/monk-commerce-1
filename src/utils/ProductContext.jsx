import React, { createContext, useState, useContext } from "react";
import { data } from "../assets/sampleData";

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
        console.log({ selectedProducts });
        console.log(" <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<");
    
        // Convert IDs to strings
        const updatedSelectedProducts = selectedProducts.map(product => ({
            ...product,
            id: product.id.toString(),
        }));
    
        // Check if a product already exists in `products` based on ID
        const existingProductIds = new Set(products.map(p => p.id.toString()));
        
        // Add only new products to `products`
        const newProducts = updatedSelectedProducts.filter(product => !existingProductIds.has(product.id));
    
        // Update the `products` state with new products
        setProducts([...products, ...newProducts]);
    };
    

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
