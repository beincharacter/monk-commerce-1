import React, { createContext, useState, useContext } from "react";
// import { data } from "../assets/sampleData";

const ProductContext = createContext();
export const useProductContext = () => useContext(ProductContext);

export const ProductProvider = ({ children }) => {
    const [products, setProducts] = useState([{
        id: `dummmy`,
        name: `Product ${1}`,
        discount: 0,
        variants: []
    }]);
    const [selectedProducts, selectedProductsFromContext] = useState([]);
    const [clicked, setClicked] = useState();


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
    
        // Find the index of the clicked product in the products array
        const clickedProductIndex = products.findIndex(
            product => product.id.toString() === clicked
        );
    
        if (clickedProductIndex === -1) {
            // If clicked product is not found, return early or handle this case
            console.error("Clicked product not found in the products array");
            return;
        }
    
        // Check if a product already exists in `products` based on ID
        const existingProductIds = new Set(products.map(p => p.id.toString()));
        
        // Add only new products to `updatedSelectedProducts`
        const newProducts = updatedSelectedProducts.filter(product => !existingProductIds.has(product.id) || (product.id === products[clickedProductIndex].id));
    
        // Create a new products array without the clicked product
        const updatedProducts = [...products];
        updatedProducts.splice(clickedProductIndex, 1, ...newProducts);
    
        // Update the products state with the modified products array
        setProducts(updatedProducts);
        setSelectedProducts([]);
    };
    

    return (
        <ProductContext.Provider
            value={{
                products,
                selectedProducts,
                setClicked,
                setProducts,
                updateProducts,
                setSelectedProducts,
                updateSelectedProducts
            }}
        >
            {children}
        </ProductContext.Provider>
    );
};
