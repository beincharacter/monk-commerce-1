import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Varient } from "../components/Varients";
import { Products } from "../components/Products";
import ExpandMore from "../icons/ExpandMore.svg";
import ExpandLess from "../icons/ExpandLess.svg";
import { AddProductModal } from "../components/AddProductModal";
import { useProductContext } from "../utils/ProductContext";

export const HomePage = () => {
    const [draggingItem, setDraggingItem] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const [expandedProducts, setExpandedProducts] = useState({});  // For toggling variants visibility
    const { products, setProducts } = useProductContext();

    // Function to handle the drag end for both products and variants
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
            const productIndex = source.droppableId.split("-")[1];
            const updatedProducts = [...products];
            const selectedProduct = updatedProducts[productIndex];
            const variants = Array.from(selectedProduct.variants);
            const [movedVariant] = variants.splice(source.index, 1);
            variants.splice(destination.index, 0, movedVariant);
            selectedProduct.variants = variants;
            updatedProducts[productIndex] = selectedProduct;
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

    const removeVarient = (parentId, variantId) => {
        const updatedProducts = products.map(product => {
            if (product.id === parentId) {
                return {
                    ...product,
                    variants: product.variants.filter(variant => variant.id !== variantId),
                };
            }
            return product;
        });
        setProducts(updatedProducts);
    };

    // Toggle view for product variants
    const toggleVariantsView = (index) => {
        setExpandedProducts((prev) => ({
            ...prev,
            [index]: !prev[index],
        }));
    };

    return (
        <>
            <div
                className="flex flex-col items-start h-full w-2/3 border border-black rounded-lg p-4 gap-4"
            >
                <div
                    style={{
                        background: "lightgreen",
                        fontSize: "24px",
                        fontWeight: "bold",
                        padding: "8px"
                    }}
                >
                    Admin Panel
                </div>

                <div
                    className="flex items-center text-3xl flex-col flex-1 w-full p-4 gap-2 overflow-auto rounded-lg"
                    style={{
                        justifyContent: products.length ? "" : "center",
                        border:
                            isDragging
                                ? "2px dashed black"
                                : "1px solid black",
                    }}
                >
                    {products.length ? (
                        <>
                            <DragDropContext
                                onDragEnd={handleOnDragEnd}
                                onDragStart={handleOnDragStart}
                            >
                                <Droppable droppableId="products" type="products">
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className="flex flex-col gap-4 w-full"
                                        >
                                            {products.map(({ id, name, title, discount, variants }, index) => (
                                                <Draggable key={id.toString()} draggableId={id.toString()} index={index}>
                                                    {(provided) => (
                                                        <>
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                className="flex flex-col text-base gap-2 items-end rounded-lg justify-between"
                                                                style={{
                                                                    ...provided.draggableProps.style,
                                                                }}
                                                            >
                                                                <Products
                                                                    key={index}
                                                                    index={index}
                                                                    id={id}
                                                                    name={name || title}
                                                                    discount={discount}
                                                                    remove={removeProduct}
                                                                />
                                                                {/* View Variants toggle */}
                                                                {variants && variants.length > 0 && (
                                                                    <span
                                                                        className="flex justify-center text-[#3B82F6] relative right-10 gap-1 cursor-pointer hover:text-blue-500"
                                                                        onClick={() => toggleVariantsView(index)}
                                                                    >
                                                                        {expandedProducts[index] ? "Hide variants" : "View variants"} 
                                                                        <img src={expandedProducts[index] ? ExpandLess : ExpandMore} alt="" />
                                                                    </span>
                                                                )}

                                                                {/* Variants Drag and Drop, only show if expanded */}
                                                                {expandedProducts[index] && variants && variants.length > 0 && (
                                                                    <Droppable droppableId={`variants-${index}`} type="variants">
                                                                        {(provided) => (
                                                                            <div
                                                                                {...provided.droppableProps}
                                                                                ref={provided.innerRef}
                                                                                className="flex flex-col gap-2 pl-5 w-full"
                                                                            >
                                                                                {variants.map((v, vIndex) => (
                                                                                    <Draggable
                                                                                        key={v.id.toString()}
                                                                                        draggableId={`${id.toString()}-${v.id.toString()}`}
                                                                                        index={vIndex}
                                                                                    >
                                                                                        {(provided) => (
                                                                                            <div
                                                                                                ref={provided.innerRef}
                                                                                                {...provided.draggableProps}
                                                                                                {...provided.dragHandleProps}
                                                                                                style={{
                                                                                                    display: "flex",
                                                                                                    gap: "16px",
                                                                                                    alignItems: "center",
                                                                                                    justifyContent: 'end',
                                                                                                    ...provided.draggableProps.style,
                                                                                                }}
                                                                                            >
                                                                                                <Varient
                                                                                                    parentId={id}
                                                                                                    id={v.id}
                                                                                                    type={v.type}
                                                                                                    value={v.value}
                                                                                                    title={v.title}
                                                                                                    price={v.price}
                                                                                                    remove={removeVarient}
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
                        </>
                    ) : (
                        "No Products have been selected"
                    )}
                </div>

                <button className="p-2 px-12 self-end border-2 border-emerald-700 bg-white hover:bg-slate-100 font-bold text-emerald-700"
                    onClick={() =>
                        setProducts([
                            ...products,
                            {
                                id: `${Date.now()}`, // Use Date.now() as string id
                                name: `Product ${products.length + 1}`,
                                discount: 0,
                                variants: []
                            },
                        ])
                    }
                >
                    Add Products
                </button>
            </div>

            <AddProductModal />
        </>
    );
};
