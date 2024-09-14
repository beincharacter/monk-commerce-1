import { useState } from 'react';
import DragHandle from '../icons/DragHandle.svg';
import Edit from '../icons/Edit.svg';
import Close from '../icons/Close.svg';
import { useModalContext } from '../utils/ModalContext';
import { useProductContext } from '../utils/ProductContext';

export const Products = ({ id, name, index, discount="20", remove }) => {
    const [showDiscount, setShowDiscount] = useState(false);
    const [discountType, setDiscountType] = useState('flat off')
    const [showDiscountValues, setshowDiscountValues] = useState(false)
    const { modalStateTrigger } = useModalContext();
    const { products, setProducts } = useProductContext();

    return (
        <>

            <div className='flex w-full gap-4 h-[40px]'>
                {/* handle */}
                <img src={DragHandle} />

                <span className='flex items-center'>{index+1}.</span>

                {/* Product Title */}
                <div className='flex h-full items-center justify-between pl-4 pr-4 bg-white shadow-c border border-c flex-8 rounded-md'>
                    <span>{name || 'Select Product'}</span>
                    <img src={Edit} alt="edit" className='cursor-pointer' onClick={() => modalStateTrigger(id, true)} />
                </div>

                {/* Discount Input or Display */}
                    <div className='flex-2'>
                        {showDiscount ? (
                            <div className='flex items-center justify-between gap-4 relative'>
                                <input className='w-1/2 p-1 flex-1 border-t outline-none bg-white shadow-md border border-t-c  pl-4'
                                    min={0}
                                    max={100}
                                    type="number"
                                    value={discount}
                                    onChange={(e) => {
                                        const updatedProducts = products.map(
                                            (product) =>
                                                product.id == id
                                                    ? {
                                                        ...product,
                                                        discount: e.target.value,
                                                    }
                                                    : product
                                        );
                                        setProducts(updatedProducts);
                                    }}
                                />

                                <div className='flex text-center justify-center w-1/2 bg-red border-black p-2 bg-white shadow-c border border-c'>
                                    <div className='z-1' onClick={() => setshowDiscountValues(v => !v)}>{discountType}</div>
                                </div>

                                <div className={`absolute top-2/3 bg-slate-50 shadow-md border-slate-500  rounded-md p-1 cursor-pointer right-0 flex flex-col z-50 ${showDiscountValues ? 'flex' : 'hidden'}`}>
                                    <div className='hover:bg-gray-400 hover:text-white p-1' onClick={() => {setDiscountType('flat off'); setshowDiscountValues(v => !v)}}>flat off</div>
                                    <div className='hover:bg-gray-400 hover:text-white p-1' onClick={() => {setDiscountType('% off'); setshowDiscountValues(v => !v)}}>% off</div>
                                </div>
                            </div>
                        ) : (
                            <button className='w-full h-[40px] p-2 cursor-pointer text-white font-bold bg-green-700'
                                onClick={() => setShowDiscount(true)}
                            >
                                Add Discount
                            </button>
                        )}
                    </div>

                {/* close */}
                <img src={Close} alt="Close" className='w-6 h-6 cursor-pointer'
                    onClick={() => remove(id)}
                />
            </div>
        </>
    )
}