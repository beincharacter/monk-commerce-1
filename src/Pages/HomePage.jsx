import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { Varient } from "../components/Varients";
import { Products } from "../components/Products";
import { AddProductModal } from "../components/AddProductModal";

export const HomePage = () => {
    const [products, setProducts] = useState([
        { id: "1", name: "Product 1", discount: 20, variants: [] },
        { id: "2", name: "Product 2", discount: 15, variants: [
            { id: '1', type: "Size", value: "M" },
            { id: '2', type: "Color", value: "Red" }
        ]},
        { id: "3", name: "Product 3", discount: 10, variants: [] },
        { id: "4", name: "Product 4", discount: 5, variants: [
            { id: '1', type: "Size", value: "L" }
        ]},
        { id: "5", name: "Product 5", discount: 25, variants: [] }
    ]);
    const [draggingItem, setDraggingItem] = useState(null);
    const [isDragging, setIsDragging] = useState(false);    
    const [isModal, setIsModal] = useState(true);

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
                    className="flex"
                    style={{
                        display: "flex",
                        justifyContent: products.length ? "" : "center",
                        alignItems: "center",
                        fontSize: "32px",
                        flexDirection: "column",
                        flex: 1,
                        background: "lightblue",
                        width: "100%",
                        padding: "16px",
                        gap: "16px",
                        overflow: "auto",
                        borderRadius: "8px",
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
                                            style={{
                                                display: "flex",
                                                flexDirection: "column",
                                                gap: "16px",
                                                width: "100%",
                                            }}
                                        >
                                            {products.map(({ id, name, discount, variants }, index) => (
                                                <Draggable key={id} draggableId={id} index={index}>
                                                    {(provided) => (
                                                        <>
                                                            <div
                                                                ref={provided.innerRef}
                                                                {...provided.draggableProps}
                                                                {...provided.dragHandleProps}
                                                                style={{
                                                                    display: "flex",
                                                                    flexDirection: 'column',
                                                                    gap: "16px",
                                                                    fontSize: "16px",
                                                                    borderRadius: "8px",
                                                                    alignItems: "end",
                                                                    justifyContent: "space-between",
                                                                    border:
                                                                        draggingItem === index
                                                                            ? "2px dashed black"
                                                                            : "none",
                                                                    ...provided.draggableProps.style,
                                                                }}
                                                            >
                                                                <Products
                                                                    key={index}
                                                                    id={id}
                                                                    name={name}
                                                                    discount={discount}
                                                                    remove={removeProduct}
                                                                    updateModalState={setIsModal}
                                                                />

                                                                {/* Variants Drag and Drop */}
                                                                <Droppable droppableId={`variants-${index}`} type="variants">
                                                                    {(provided) => (
                                                                        <div
                                                                            {...provided.droppableProps}
                                                                            ref={provided.innerRef}
                                                                            style={{
                                                                                display: "flex",
                                                                                flexDirection: "column",
                                                                                gap: "8px",
                                                                                paddingLeft: "20px",
                                                                                width: '100%'
                                                                            }}
                                                                        >
                                                                            {variants.map((v, vIndex) => (
                                                                                <Draggable
                                                                                    key={v.id}
                                                                                    draggableId={`${id}-${v.id}`}
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

                <button className="p-2 border border-black px-12 self-end bg-slate-600 hover:bg-slate-500 text-white"
                    onClick={() =>
                        setProducts([
                            ...products,
                            {
                                id: `${products.length + 1}`,
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
