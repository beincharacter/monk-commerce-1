import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Varient } from "../components/Varients";
import { Products } from "../components/Products";
import ExpandMore from "../icons/ExpandMore.svg";
import ExpandLess from "../icons/ExpandLess.svg";
import { AddProductModal } from "../components/AddProductModal";
import { useProductContext } from "../utils/ProductContext";
import { useModalContext } from "../utils/ModalContext";

export const HomePage = () => {
    const [draggingItem, setDraggingItem] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [expandedProducts, setExpandedProducts] = useState({});
    const { products, setProducts } = useProductContext();
    const { isModalOpen } = useModalContext();

    const handleOnDragEnd = (result) => {
        setDraggingItem(null);
        const { source, destination, type } = result;
    
        // No destination, meaning dropped outside valid areas
        if (!destination) return;
    
        // If dragging products
        if (type === "products") {
            const reorderedProducts = Array.from(products);
            const [movedProduct] = reorderedProducts.splice(source.index, 1);
            reorderedProducts.splice(destination.index, 0, movedProduct);
            setProducts(reorderedProducts);
        }
    
        // If dragging variants
        if (type === "variants") {
            const productId = source.droppableId.split("-")[1]; 
            const productIndex = products.findIndex(p => p.id === productId); 
            const selectedProduct = products[productIndex];
    
            if (!selectedProduct) return;
    
            const variants = Array.from(selectedProduct.variants);
            const [movedVariant] = variants.splice(source.index, 1);
            variants.splice(destination.index, 0, movedVariant);
    
            const updatedProducts = [...products];
            updatedProducts[productIndex] = { ...selectedProduct, variants };
            setProducts(updatedProducts);
        }
    
        setIsDragging(false);
    };
    

    const handleOnDragStart = (start) => {
        setDraggingItem(start.source.index);
        setIsDragging(true);
    };

    const removeProduct = (id) => {
        const updatedProducts = products.filter((p) => p.id !== id);
        setProducts(updatedProducts);
    };

    const removeVariant = (parentId, variantId) => {
        const updatedProducts = products.reduce((acc, product) => {
            if (product.id === parentId) {
                const updatedVariants = product.variants.filter(variant => variant.id !== variantId);
                if (updatedVariants.length === 0) {
                    return acc;
                }
                return [...acc, { ...product, variants: updatedVariants }];
            }
            return [...acc, product];
        }, []);
    
        setProducts(updatedProducts);
    };
    
    const toggleVariantsView = (productId) => {
        setExpandedProducts((prev) => ({
            ...prev,
            [productId]: !prev[productId],
        }));
    };

    return (
        <>
            <div className="flex flex-col items-start h-full w-2/3 rounded-lg p-4 gap-4 border border-black bg-slate-100">
                <div style={{ fontSize: "24px", fontWeight: "bold", padding: "8px" }}>
                    Add Products 
                </div>

                <div className="flex justify-between w-full">
                    <div className="flex-8 font-bold pl-8">Product</div>
                    <div className="flex-2 font-bold">Discount</div>
                </div>

                <div className="flex items-center text-3xl flex-col w-full p-4 gap-2 overflow-auto rounded-lg" style={{ justifyContent: products.length ? "" : "center", border: isDragging ? "2px dashed black" : "" }}>
                    {products.length ? (
                        <DragDropContext onDragEnd={handleOnDragEnd} onDragStart={handleOnDragStart}>
                            <Droppable droppableId="products" type="products">
                                {(provided) => (
                                    <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-4 w-full">
                                        {products.filter(p => (Array.isArray(p.variants) && p.variants.length > 0) || p.id === 'dummy').map(({ id, name, title, discount, variants, }, index) => (
                                            <Draggable key={id} draggableId={id} index={products.findIndex(p => p.id === id)}>
                                                {(provided) => (
                                                    <>
                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} className="flex flex-col text-base gap-2 items-end rounded-lg justify-between" style={{ ...provided.draggableProps.style }}>
                                                            <Products
                                                                id={id}
                                                                name={title}
                                                                discount={discount}
                                                                remove={removeProduct}
                                                                index={index}
                                                            />
                                                            {/* View Variants toggle */}
                                                            {variants.length > 0 && (
                                                                <span className="flex justify-center text-[#3B82F6] relative gap-1 cursor-pointer hover:text-blue-500" onClick={() => toggleVariantsView(id)}>
                                                                    {expandedProducts[id] ? "Hide variants" : "View variants"} 
                                                                    <img src={expandedProducts[id] ? ExpandLess : ExpandMore} alt="" />
                                                                </span>
                                                            )}

                                                            {/* Variants Drag and Drop, only show if expanded */}
                                                            {expandedProducts[id] && (
                                                                <Droppable droppableId={`variants-${id}`} type="variants">
                                                                    {(provided) => (
                                                                        <div {...provided.droppableProps} ref={provided.innerRef} className="flex flex-col gap-2 pl-5 w-full">
                                                                            {variants.map((v, vIndex) => (
                                                                                <Draggable key={v.id.toString()} draggableId={`${id}-${v.id}`} index={vIndex}>
                                                                                    {(provided) => (
                                                                                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} style={{ display: "flex", gap: "16px", alignItems: "center", justifyContent: 'end', ...provided.draggableProps.style }}>
                                                                                            <Varient
                                                                                                parentId={id}
                                                                                                id={v.id}
                                                                                                type={v.type}
                                                                                                discount={v.discount}
                                                                                                title={v.title}
                                                                                                price={v.price}
                                                                                                remove={removeVariant}
                                                                                            />
                                                                                        </div>
                                                                                    )}
                                                                                </Draggable>
                                                                            ))}
                                                                            {provided.placeholder}
                                                                        </div>
                                                                    )}
                                                                </Droppable>
                                                            )}
                                                        </div>
                                                        <hr />
                                                    </>
                                                )}
                                            </Draggable>
                                        ))}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </DragDropContext>
                    ) : null}
                </div>

                <button className="p-2 px-12 mr-12 self-end border-2 border-emerald-700 bg-white hover:bg-slate-100 font-bold text-emerald-700 rounded-sm"
                    onClick={() => {
                        const newProduct = {
                            id: `dummy`,
                            name: `Product ${products.length + 1}`,
                            discount: 0,
                            variants: []
                        };

                        const exists = products.some(p => p.id === newProduct.id);
                        if (!exists) {
                            setProducts([...products, newProduct]);
                        }
                    }}
                >
                    Add Products
                </button>
            </div>
            {console.log(draggingItem)}

            {isModalOpen && <AddProductModal />}
        </>
    );
};
