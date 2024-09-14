import { useState } from 'react';
import DragHandle from '../icons/DragHandle.svg';
import Edit from '../icons/Edit.svg';
import Close from '../icons/Close.svg';
import { useModalContext } from '../utils/ModalContext';

export const Products = ({ id, name, discount, remove }) => {
    const [showDiscount, setShowDiscount] = useState(false);
    const [discountType, setDiscountType] = useState('Flat OFF')
    const [showDiscountValues, setshowDiscountValues] = useState(false)
    const { modalStateTrigger } = useModalContext();

    return (
        <>

            <div className='flex w-full gap-4 h-[40px]'>
                {/* handle */}
                <img src={DragHandle} />

                {/* Product Title */}
                <div className='flex h-full items-center justify-between pl-4 pr-4 bg-blue-400 flex-8'>
                    <span>{name}</span>
                    <img src={Edit} alt="edit" className='cursor-pointer' onClick={() => modalStateTrigger(id, true)} />
                </div>

                {/* Discount Input or Display */}
                    <div className='flex-2'>
                        {showDiscount ? (
                            <div className='flex items-center justify-between gap-4 relative'>
                                <input className='w-1/2 p-1 flex-1 border-none outline-none'
                                    min={0}
                                    max={100}
                                    type="number"
                                    value={discount}
                                    onChange={(e) => {
                                        const updatedProducts = products.map(
                                            (product) =>
                                                product.id === id
                                                    ? {
                                                        ...product,
                                                        discount: e.target.value,
                                                    }
                                                    : product
                                        );
                                        setProducts(updatedProducts);
                                    }}
                                />

                                <div className='flex text-center w-1/2 bg-red  border border-black p-2'>
                                    <div className='z-1' onClick={() => setshowDiscountValues(v => !v)}>{discountType}</div>
                                </div>

                                <div className={`absolute top-2/3 bg-white rounded-md p-1 cursor-pointer right-0 flex flex-col z-50 ${showDiscountValues ? 'flex' : 'hidden'}`}>
                                    <div className='hover:bg-gray-400 p-1' onClick={() => {setDiscountType('Flat OFF'); setshowDiscountValues(v => !v)}}>flat off</div>
                                    <div className='hover:bg-gray-400 p-1' onClick={() => {setDiscountType('% OFF'); setshowDiscountValues(v => !v)}}>% off</div>
                                </div>
                            </div>
                        ) : (
                            <button className='w-full h-[40px] border border-black p-2 cursor-pointer'
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