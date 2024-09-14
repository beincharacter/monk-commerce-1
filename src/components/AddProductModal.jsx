import { useState, useRef, useCallback } from 'react';
import { useModalContext } from '../utils/ModalContext';
import Search from '../icons/Search.svg';
import Close from '../icons/Close.svg';
import Default from '../icons/Default.svg';
import { useFetchProducts } from '../utils/Products';
import { useProductContext } from '../utils/ProductContext';

export const AddProductModal = () => {
  const { isModalOpen, setIsModalOpen } = useModalContext();
  const { selectedProducts, setSelectedProducts, updateSelectedProducts } = useProductContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const { isLoading, isError, products, hasMore } = useFetchProducts(searchTerm, pageNumber, setPageNumber);

  // Infinite scrolling logic
  const observer = useRef();
  const lastProductElementRef = useCallback(
    (node) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  // Handle product/variant selection
  const handleSelection = (productId, variantId = null) => {
    const updatedSelection = structuredClone(selectedProducts || []);
    const productIndex = updatedSelection.findIndex((p) => p.id === productId);

    if (productIndex === -1) {
      // Product not in selection, add it
      const productToAdd = { ...products.find((p) => p.id === productId) };
      if (variantId) {
        productToAdd.variants = productToAdd.variants.filter((v) => v.id === variantId);
      }
      updatedSelection.push(productToAdd);
    } else {
      // Product already in selection
      if (variantId === null) {
        // Clicked on product checkbox, remove the entire product
        updatedSelection.splice(productIndex, 1);
      } else {
        // Clicked on variant checkbox
        const variantIndex = updatedSelection[productIndex].variants.findIndex((v) => v.id === variantId);
        if (variantIndex === -1) {
          // Variant not in selection, add it
          const variantToAdd = products.find((p) => p.id === productId).variants.find((v) => v.id === variantId);
          updatedSelection[productIndex].variants.push(variantToAdd);
        } else {
          // Variant in selection, remove it
          updatedSelection[productIndex].variants.splice(variantIndex, 1);
          if (updatedSelection[productIndex].variants.length === 0) {
            updatedSelection.splice(productIndex, 1);
          }
        }
      }
    }

    setSelectedProducts(updatedSelection);
  };

  const isProductSelected = (productId) => {
    return selectedProducts?.some((p) => p.id === productId) ?? false;
  };

  const isVariantSelected = (productId, variantId) => {
    const product = selectedProducts?.find((p) => p.id === productId);
    return product?.variants?.some((v) => v.id === variantId) ?? false;
  };

  return (
    <div
      className={`flex justify-center items-center absolute top-0 left-0 h-screen w-screen bg-[#000000cc] ${
        isModalOpen ? 'flex' : 'hidden'
      }`}
    >
      <div className="flex flex-col w-[600px] h-4/5 bg-white rounded-lg overflow-auto">
        <div className="flex justify-between items-center p-4 border-b border-b-slate-500">
          <span>Add Products</span>
          <img src={Close} alt="close" onClick={() => setIsModalOpen(false)} />
        </div>

        <div className="flex items-center gap-2 p-4">
          <div className="flex items-center border border-slate-500 flex-1 gap-2 rounded-lg">
            <img src={Search} alt="search" />
            <input
              className="bg-transparent border-none text-lg flex-1 outline-none focus:outline-none"
              value={searchTerm}
              type="text"
              placeholder="search"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Product List */}
        <div className="p-4 flex-1 overflow-auto">
          {products.length === 0 && !isLoading && <div>No products found</div>}
          {products.map((product, index) => {
            const isLastProduct = products.length === index + 1;
            return (
              <div
                className="pb-4 mb-4 flex flex-col border border-slate-400"
                key={product.id}
                ref={isLastProduct ? lastProductElementRef : null}
              >
                <div className="flex items-center gap-2 p-2">
                  <input
                    type="checkbox"
                    checked={isProductSelected(product?.id)}
                    onChange={() => handleSelection(product.id)}
                  />
                  <div className='flex justify-between w-full'>
                    <img
                      className="w-[40px] h-[40px]"
                      src={product.image?.src || Default}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = Default;
                      }}
                      alt={product.title || 'Default Product'}
                    />

                    <h4>{product.title}</h4>
                  </div>
                </div>
                <hr />

                {/* Variants */}
                {product?.variants?.length > 0 && (
                  <div className='flex flex-col items-end'>
                    {product.variants.map((variant) => (
                      <div className="flex items-center gap-2 mb-2 w-11/12 mt-4" key={variant.id}>
                        <input
                          type="checkbox"
                          checked={isVariantSelected(product.id, variant.id)}
                          onChange={() => handleSelection(product.id, variant.id)}
                        />
                        <div className='flex justify-between flex-1 pr-2'>
                          <span>
                            {variant.title} - 
                          </span>
                          <span>₹{variant.price}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {isLoading && <div className='flex w-full h-full justify-center items-center'>Loading...</div>}
          {isError && <div className='flex w-full h-full justify-center items-center'>Error loading products</div>}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between p-2 gap-4 border-t border-t-slate-500">
          <button
            className="px-4 py-2 border-none bg-red-600 text-white rounded-lg hover:bg-red-700"
            onClick={() => setIsModalOpen(false)}
          >
            Cancel
          </button>
          <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" 
            onClick={() => {updateSelectedProducts(); setIsModalOpen(false)}}
          >
            Add Products
          </button>
        </div>
      </div>
    </div>
  );
};
