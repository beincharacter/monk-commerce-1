import { useState } from 'react';
import DragHandle from '../icons/DragHandle.svg';
import Close from '../icons/Close.svg';
import { useProductContext } from '../utils/ProductContext';

export const Varient = ({ parentId, id, discount='20', remove, title }) => {
    const [showDiscount, setShowDiscount] = useState(false);
    const [discountType, setDiscountType] = useState('flat off')
    const [showDiscountValues, setshowDiscountValues] = useState(false)
    // const [discount, setDiscount] = useState(20);
    const { products, setProducts } = useProductContext();

    return (
        <>

            <div className='flex gap-4 w-5/6 h-[40px] rounded-full'>
                <div className='flex gap-4 w-full h-full items-center'>

                    {/* handle */}
                    <img src={DragHandle} alt='draghandle' className='h-3/5' />

                    {/* Product Title */} 
                    <div className='flex flex-5-8 h-full items-center justify-between pl-4 pr-4 bg-white shadow-c border border-c rounded-full'>
                        <span>{title || 'No title'}</span>
                    </div>

                    {/* Discount Input or Display */}
                    <div className='flex-2'>
                        {showDiscount ? (
                            <div className='flex items-center justify-between gap-4 relative'>
                                <input className='w-1/2 p-1 flex-1 border-t outline-none bg-white shadow-md border border-t-c  pl-4 rounded-full'
                                    min={0}
                                    max={100}
                                    type="number"
                                    value={discount}
                                    onChange={(e) => {
                                        const updatedProducts = products.map(product => ({
                                            ...product,
                                            variants: product.variants.map(variant =>
                                              variant.id === id
                                                ? { ...variant, discount: e.target.value }
                                                : variant
                                            )
                                          }));
                                          
                                          setProducts(updatedProducts);
                                    }}
                                />

                                <div className='flex text-center justify-center w-1/2 bg-red border-black p-2 bg-white shadow-c border border-c text-slate-900 rounded-full'>
                                    <div className='z-1' onClick={() => setshowDiscountValues(v => !v)}>{discountType}</div>
                                </div>

                                <div className={`absolute top-2/3 bg-white rounded-md p-1 cursor-pointer right-0 flex flex-col z-50 ${showDiscountValues ? 'flex' : 'hidden'}`}>
                                    <div className='hover:bg-gray-400 p-1' onClick={() => {setDiscountType('falt off'); setshowDiscountValues(v => !v)}}>flat off</div>
                                    <div className='hover:bg-gray-400 p-1' onClick={() => {setDiscountType('% off'); setshowDiscountValues(v => !v)}}>% off</div>
                                </div>
                            </div>
                        ) : (
                            <button className='w-full h-[40px] text-white font-bold bg-green-700 p-2 cursor-pointer'
                                onClick={() => setShowDiscount(true)}
                            >
                                Add Discount
                            </button>
                        )}
                    </div>

                    {/* close */}
                    <img src={Close} alt="Close" style={{
                            width: '24px',
                            height: '24px',
                            cursor: 'pointer'
                        }}  
                        onClick={() => remove(parentId, id)}
                    />
                </div>
            </div>
        </>
    )
}