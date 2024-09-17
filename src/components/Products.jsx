import { useState } from 'react';
import DragHandle from '../icons/DragHandle.svg';
import DragHandleActive from '../icons/DragHandleActive.svg';
import Edit from '../icons/Edit.svg';
import EditActive from '../icons/EditActive.svg';
import Close from '../icons/Close.svg';
import CloseActive from '../icons/CloseActive.svg';
import ExpandMore from '../icons/ExpandMoreD.svg';
import ExpandLess from '../icons/ExpandLessD.svg';
import { useModalContext } from '../utils/ModalContext';
import { useProductContext } from '../utils/ProductContext';

export const Products = ({ id, name, index, discount="20", remove }) => {
    const [showDiscount, setShowDiscount] = useState(false);
    const [discountType, setDiscountType] = useState('flat off')
    const [showDiscountValues, setshowDiscountValues] = useState(false)
    const { modalStateTrigger } = useModalContext();
    const [drag, setDrag] = useState(false);
    const { products, setProducts, setClicked } = useProductContext();

    const toggleModalState = (id) => {
        modalStateTrigger(id);
        setClicked(id);
    }

    return (
        <>

            <div className='flex w-full gap-4 h-[40px] items-center' onMouseEnter={() => setDrag(true)} onMouseLeave={() => setDrag(false)}>
                {/* handle */}
                <img src={drag ? DragHandleActive : DragHandle} alt='draghandle' className='h-3/5' />

                <span className='flex items-center'>{index+1}.</span>

                {/* Product Title */}
                <div className='flex h-full items-center justify-between pl-4 pr-4 bg-white custom-border flex-8 rounded-md'>
                    <span>{name || 'Select Product'}</span>
                    <img 
                        src={Edit} 
                        alt="edit" 
                        className="cursor-pointer edit-icon" 
                        onClick={() => toggleModalState(id, true)} 
                        onMouseEnter={(e) => e.target.src = EditActive} 
                        onMouseLeave={(e) => e.target.src = Edit} 
                    />

                </div>

                {/* Discount Input or Display */}
                    <div className='flex-2'>
                        {showDiscount ? (
                            <div className='flex items-center justify-between gap-4 relative'>
                                <input className='w-1/2 p-2 flex-1 outline-none bg-white custom-border pl-4'
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

                                <div className='flex text-center justify-between w-1/2 bg-red p-2 bg-white custom-border' onClick={() => setshowDiscountValues(v => !v)}>
                                    <div className='z-1'>{discountType}</div>
                                    {showDiscountValues ? <img src={ExpandMore} alt="" /> : <img src={ExpandLess} alt="" />}
                                </div>

                                <div className={`absolute top-2/3 bg-slate-50 shadow-md border-slate-500  rounded-md p-1 cursor-pointer right-0 flex flex-col z-50 ${showDiscountValues ? 'flex' : 'hidden'}`}>
                                    <div className='hover:bg-gray-400 hover:text-white p-1' onClick={() => {setDiscountType('flat Off'); setshowDiscountValues(v => !v)}}>flat off</div>
                                    <div className='hover:bg-gray-400 hover:text-white p-1' onClick={() => {setDiscountType('% Off'); setshowDiscountValues(v => !v)}}>% off</div>
                                </div>
                            </div>
                        ) : (
                            <button className='w-full h-[40px] p-2 cursor-pointer text-white font-bold bg-green-700 rounded'
                                onClick={() => setShowDiscount(true)}
                            >
                                Add Discount
                            </button>
                        )}
                    </div>

                {/* close */}
                {/* <img src={Close} alt="Close" className='w-4 h-4 cursor-pointer'
                    onClick={() => remove(id)}
                /> */}


                <img
                    src={Close}
                    alt="edit"
                    className="cursor-pointer w-4 h-4"
                    onClick={() => remove(id)}
                    onMouseEnter={(e) => e.target.src = CloseActive}
                    onMouseLeave={(e) => e.target.src = Close}
                />
            </div>
        </>
    )
}