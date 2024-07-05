import html2canvas from 'html2canvas'
import { forwardRef, useImperativeHandle, useState } from 'react'
import Image from 'next/image'
import calendar from '@/assets/calendar.svg'

const Screenshoot = forwardRef(({ listMumi, date, note }, ref) => {

    const [hidden, setHidden] = useState(true)

    const capture = () => {
        setHidden(false)
        setTimeout(() => {
            html2canvas(document.getElementById('capture')).then(canvas => {
                const image = canvas.toDataURL('image/jpeg', 0.5)
                const link = document.createElement('a')
                link.href = image
                link.download = 'absensi '+date
                link.click()
                setHidden(true)
            })
        }, 0)
    }

    useImperativeHandle(ref, () => ({
        capture
      }))

    return (
    <div className='flex justify-center overflow-hidden' style={{display: hidden ? 'none' : '' }}>
        <div id='capture' className='min-w-max bg-slate-900 pb-5 font-sans'>
            <div className='flex gap-2 justify-center items-center py-2 scale-125'>
                <Image src={calendar} alt='calendar' /><span className='pb-4'>{ date }</span>
            </div>
            {note && <div className='bg-slate-800 p-1 pb-4 mx-auto mb-2 rounded-md max-w-[25rem] text-center'>"{ note }"</div>}
            <table className='text-center border'>
                <thead className='border-b'>
                    <tr>
                        <th className='border-x w-6' rowSpan={2}>No</th>
                        <th className='border-x' rowSpan={2}>Nama</th>
                        <th className='border-y pb-4' colSpan={2}>Absensi</th>
                        <th className='border-x' rowSpan={2}>Ket</th>
                    </tr>
                    <tr>
                        <th className='border-x w-12 pb-4'>Hadir</th>
                        <th className='border-x w-12 pb-4'>Izin</th>
                    </tr>
                </thead>
                <tbody>
                {
                listMumi.map((list, index) => 
                <tr key={list.id} className={(index % 2 == 0 ? 'bg-slate-950 bg-opacity-50' : '')}>
                    <td className='pb-4 px-2 border-x'>{index + 1}</td>
                    <td className='pb-4 px-2 border-x'>{list.fullname}</td>
                    <td className='p-2 border-x'>
                        <div className={'border w-4 h-4 rounded mx-auto '+ (list.absen == 1 ? 'bg-green-600' : '')}></div>
                    </td>
                    <td className='p-2 border-x'>
                        <div className={'border w-4 h-4 rounded mx-auto '+ (list.absen == 2 ? 'bg-yellow-600' : '')}></div>
                    </td>
                    <td className='pb-4 px-2 min-w-20 max-w-60'>{list.ket}</td>
                </tr>
                )}
                </tbody>
            </table>
            <div className='text-center italic'>dicetak dari web <span className='underline'>arjow.my.id</span></div>
        </div>
    </div>
    )
})

export default Screenshoot