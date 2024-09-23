import { useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useModalContext } from '../utils/ModalContext';
import Search from '../icons/Search.svg';
import Close from '../icons/CloseP.svg';
import Default from '../icons/Default.svg';
import { useFetchProducts } from '../utils/Products';
import { useProductContext } from '../utils/ProductContext';

export const AddProductModal = () => {
  const { isModalOpen, setIsModalOpen } = useModalContext();
  const { selectedProducts, setSelectedProducts, updateSelectedProducts } = useProductContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [pageNumber, setPageNumber] = useState(1);

  const { isError, products, hasMore } = useFetchProducts(searchTerm, pageNumber, setPageNumber);

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

  // Fetch more products when reaching the bottom of the scroll
  const fetchMoreData = () => {
    if (hasMore) {
      setPageNumber((prevPageNumber) => prevPageNumber + 1);
    }
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

        <div className="flex items-center gap-2 p-4 px-8">
          <div className="flex items-center border border-slate-200 flex-1 gap-4 px-4">
            <img src={Search} alt="search" />
            <input
              className="bg-transparent border-none text-lg flex-1 outline-none focus:outline-none"
              value={searchTerm}
              type="text"
              placeholder="Search product "
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPageNumber(1);
              }}
            />
          </div>
        </div>

        {/* Product List */}
        <div className="flex-1 overflow-auto py-2" id="scrollableDiv">
          <InfiniteScroll
            dataLength={products.length}
            next={fetchMoreData}
            hasMore={hasMore}
            scrollThreshold={1}
            loader={<div className='flex w-full h-full justify-center items-center py-3'>Loading...</div>}
            endMessage={<div className='flex justify-center items-center py-3'>No more products...</div>}
            scrollableTarget="scrollableDiv"
          >
            {products.map((product) => (
              <div
                className="flex flex-col border-b border-b-slate-200"
                key={product.id}
              >
                <div className="flex items-center gap-2 px-6 py-2">
                  <input
                    type="checkbox"
                    checked={isProductSelected(product?.id)}
                    onChange={() => handleSelection(product.id)}
                  />
                  <div className='flex items-center gap-4 w-full'>
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
                  <div className='flex flex-col items-end '>
                    {product.variants.map((variant) => (
                      <div className='w-full border-b border-b-slate-200 justify-end flex' key={variant.id}>
                        <div className="flex items-center gap-7 mb-2 w-[90%] mt-2 py-2">
                          <input
                            type="checkbox"
                            checked={isVariantSelected(product.id, variant.id)}
                            onChange={() => handleSelection(product.id, variant.id)}
                          />
                          <div className='flex justify-between flex-1 pr-2'>
                            <span>
                              {variant.title} - 
                            </span>
                            <div className='flex gap-8'>
                              <span>{variant?.inventory_quantity > 0 
    ? `${variant.inventory_quantity} available` 
    : "Quantity not mentioned"}

                              </span>
                              <span>
                                ₹{variant.price}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </InfiniteScroll>

          {isError && <div className='flex w-full h-full justify-center items-center'>Error loading products</div>}
        </div>

        {/* Action Buttons */}
        <div className='flex justify-between border-t border-t-slate-200'>
          <div className='flex justify-center items-center px-7'>{selectedProducts.length !== 0 ? selectedProducts.length + " product selected" : ''}</div>
          <div className="flex p-2 gap-4">
            <button
              className="px-8 py-1 rounded-md border shadow-c"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button className="px-8 py-1 text-white rounded-md bg-emerald-700" 
              onClick={() => {updateSelectedProducts(); setIsModalOpen(false); setSelectedProducts([])}}
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
