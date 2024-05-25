import Image from 'next/image'
import chart from '@/assets/chart.svg'
import group from '@/assets/group.svg'
import checklist from '@/assets/checklist.svg'
import close from '@/assets/close.svg'
import toast from 'react-hot-toast'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const Sidebar = ({ show, onClose }) => {
    const pathname = usePathname()
    const links = [
        { title: 'Absensi', path: '/absensi', icon: checklist },
        { title: 'Manage List Muda Mudi', path: '/manage', icon: group }
    ]
    return (
    <>
    <div className={'p-4 flex flex-col justify-between fixed inset-0 w-72 z-50 bg-slate-700 transition-transform '+ (show ? 'translate-x-0' : '-translate-x-full')}>
        <div className='flex justify-end'><Image src={close} alt='close' onClick={onClose} /></div>
        <div className='flex flex-col gap-2'>
        {
        links.map((link, index) => (
            <Link href={link.path} className={`flex gap-2 rounded-xl p-3 ${pathname == link.path ? 'bg-slate-500' : ''}`} key={index}>
                <Image src={link.icon} alt='title' /> {link.title}
            </Link>
        ))
        }
            <button className='flex gap-2 p-3' onClick={() => toast(<button onClick={() => toast.dismiss()}>fitur segera hadir, traktir developernya kopi biar semangat ngerjainnya :D</button>)}>
                <Image src={chart} alt='chart' /> Grafik kehadiran
            </button>
        </div>
        <div className='py-20'></div>
    </div>
    <div className={'fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur h-full overflow-hidden w-full ' + (!show && 'hidden')} onClick={onClose}></div>
    </>
    )
}

export default Sidebar