import { useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import right from '@/assets/right.svg'
import left from '@/assets/left.svg'
import menu from '@/assets/menu.svg'
import progress from '@/assets/progress.svg'
import dayjs from 'dayjs'
import Image from 'next/image'
import Sidebar from './Sidebar'
import { Toaster } from 'react-hot-toast'

const Navbar = ({ loading, tabGender, onGender, date, onDate, search, onSearch }) => {
  const [pulse, setPulse] = useState(false)
  const [showSidebar, setShowSidebar] = useState(false)

  const dateStep = (step) => onDate(prev => new Date(prev.setDate(prev.getDate() + step)))

  useEffect(() => {
    setPulse(true)
    setTimeout(() => setPulse(false), 100)
  }, [date])

  return (
  <>
  <div className='flex flex-col gap-2 pt-3 pb-2 w-full z-20 bg-slate-800 sticky top-0 shadow-lg'>
    <div className='flex justify-around items-center'>
      <div className='w-10' onClick={() => setShowSidebar(!showSidebar)}><Image src={menu} alt='menu' className='ms-auto' /></div>
      <div className='flex justify-center gap-2 w-64 bg-slate-700 p-1 rounded-full'>
        <button className={'px-2 rounded-full py-1 flex-1 ' + (!tabGender && 'bg-slate-800')} onClick={() => onGender(null)}>Semua</button>
        <button className={'px-2 rounded-full py-1 flex-1 ' + (tabGender == 1 && 'bg-slate-800')} onClick={() => onGender(1)}>Pria</button>
        <button className={'px-2 rounded-full py-1 flex-1 ' + (tabGender == 2 && 'bg-slate-800')} onClick={() => onGender(2)}>Wanita</button>
      </div>
      <div className='w-6'>{loading && <Image src={progress} alt='progress' className='animate-spin' />}</div>
    </div>
    {/* <div className={'flex rounded-full bg-slate-700 overflow-hidden mx-auto transition-transform '+ (pulse ? 'scale-110' : '')}>
      <button className='px-2' onClick={() => dateStep(-1)}><Image src={left} alt='left' /></button>
      <DatePicker selected={date} onChange={date => onDate(date)}
      customInput={<button className='py-1 w-24'>{dayjs(date).format('DD MMM YY')}</button>}
      />
      <button className='px-2' onClick={() => dateStep(1)}><Image src={right} alt='right' /></button>
    </div> */}
    <input id='search' placeholder='cari nama...'
      type='search'
      value={search}
      className='bg-slate-200 text-slate-800 px-3 w-48 mx-auto rounded-full py-1'
      onChange={e => onSearch(e.target.value)}
    />
  </div>
  <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} />
  <Toaster />
  </>
  )
}

export default Navbar