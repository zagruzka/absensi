import Image from 'next/image'
import chart from '@/assets/chart.svg'
import edit from '@/assets/edit.svg'
import close from '@/assets/close.svg'
import toast from 'react-hot-toast'

const Sidebar = ({ show, onClose }) => {
    return (
    <>
    <div className={'p-4 flex flex-col justify-between fixed inset-0 w-72 z-50 bg-slate-700 transition-transform '+ (show ? 'translate-x-0' : '-translate-x-full')}>
        <div className='flex justify-end'><Image src={close} alt='close' onClick={onClose} /></div>
        <div className='flex flex-col gap-4'>
            <button className='flex gap-2' onClick={() => toast('feature add soon')}>
                <Image src={chart} /> Grafik kehadiran
            </button>
            <button className='flex gap-2' onClick={() => toast('feature add soon')}>
                <Image src={edit} /> Edit user
            </button>
        </div>
        <div className='py-20'></div>
    </div>
    <div className={'fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur h-full overflow-hidden w-full ' + (!show && 'hidden')} onClick={onClose}></div>
    </>
    )
}

export default Sidebar