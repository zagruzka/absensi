'use client'

import {useEffect, useMemo, useState } from 'react'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import query from '@/db/query'
import AddMumi from './AddMumi'
import TableMumi from './TableMumi'
import dayjs from 'dayjs'
import Image from 'next/image'
import right from '@/assets/right.svg'
import left from '@/assets/left.svg'
import add from '@/assets/add.svg'
import progress from '@/assets/progress.svg'
import Dialog from './Dialog'
import toast, { Toaster } from 'react-hot-toast'
import Sidebar from './Sidebar'

const Absensi = () => {
const [date, setDate] = useState(new Date())
const [tabGender, setTabGender] = useState(null)
const [search, setSerch] = useState('')
const [dialog, setDialog] = useState(false)
const [listMumi, setListMumi] = useState([])
const [isLoading, setIsLoading] = useState(true)
const [showSidebar, setShowSidebar] = useState(false)

const listMumiGender = useMemo(() => {
 return listMumi.filter(list => (tabGender ? list.gender == tabGender : true) && list.nama.toLowerCase().includes(search.toLowerCase()))
}, [listMumi, tabGender, search])

const getMumi = () => {
  setIsLoading(true)
  query(`SELECT * FROM mumi LEFT JOIN absen ON mumi.id = absen.mumi_id AND absen.date = '${format(date)}' ORDER BY LOWER(nama) ASC`)
  .then(result => setListMumi(result))
  .catch(() => toast.error('Network error'))
  .finally(() => setIsLoading(false))
}

const format = date => dayjs(date).format('YYYY-MM-DD')
const handleAbsen = (id, prev, absen, ket) => {
  setIsLoading(true)
  if (prev == absen) {
    setListMumi(list => list.map(i => i.id == id ? {...i, absen: null} : i))
    query(`DELETE FROM absen WHERE mumi_id = ${id} AND date = '${format(date)}'`)
    .then(() => getMumi())
    .catch(() => toast.error('Network error'))
  } else {
    setListMumi(list => list.map(i => i.id == id ? {...i, absen, ket} : i))
    query(`INSERT OR REPLACE INTO absen (mumi_id, date, absen, ket) VALUES (${id}, '${format(date)}', ${absen}, '${ket}')`)
    .then(() => getMumi())
    .catch(() => toast.error('Network error'))
  }
}

const addMumi = (nama, gender) => {
  query(`INSERT INTO mumi (nama, gender) VALUES ('${nama}', '${gender}')`)
  .then(() => getMumi())
}

const dateStep = (step) => setDate(prev => new Date(prev.setDate(prev.getDate() + step)))

useEffect(() => getMumi(), [date])
  return (
    <div className={ dialog && 'h-screen overflow-hidden'}>
    <div className='flex flex-col items-center max-w-[30rem] mx-auto px-2'>
      <div className='flex flex-col gap-2 pt-3 pb-2 w-full z-10 bg-slate-800 sticky top-0 shadow-lg'>
        <div className='flex justify-around items-center'>
          {/* <div className='w-10' onClick={() => setShowSidebar(!showSidebar)}><Image src={menu} alt='menu' className='ms-auto' /></div> */}
          <div className='w-6'>{isLoading && <Image src={progress} alt='progress' className='animate-spin' />}</div>
          <div className='flex justify-center gap-2 w-64 bg-slate-700 p-1 rounded-full'>
            <button className={'px-2 rounded-full py-1 flex-1 ' + (!tabGender && 'bg-slate-800')} onClick={() => setTabGender(null)}>Semua</button>
            <button className={'px-2 rounded-full py-1 flex-1 ' + (tabGender == 1 && 'bg-slate-800')} onClick={() => setTabGender(1)}>Pria</button>
            <button className={'px-2 rounded-full py-1 flex-1 ' + (tabGender == 2 && 'bg-slate-800')} onClick={() => setTabGender(2)}>Wanita</button>
          </div>
          <button className='bg-slate-700 p-2 rounded-full' onClick={() => setDialog(true)}><Image src={add} alt='add' className='ms-auto' /></button>
        </div>
        <div className='flex w-full justify-between'>
          <div className='flex rounded-full bg-slate-700 overflow-hidden'>
            <button className='px-2' onClick={() => dateStep(-1)}><Image src={left} alt='left' /></button>
            <DatePicker selected={date} onChange={date => setDate(date)} popperPlacement='bottom-start'
            customInput={<button className='py-1 w-20'>{dayjs(date).format('DD MMM YY')}</button>}
            />
            <button className='px-2' onClick={() => dateStep(1)}><Image src={right} alt='right' /></button>
          </div>
            <input type='search' id='search' placeholder='cari nama...' className='bg-slate-200 text-slate-800 px-3 w-48 rounded-full py-1' onChange={e => setSerch(e.target.value)} />
        </div>
      </div>
      <TableMumi listMumi={listMumiGender} onAbsen={handleAbsen} />
    </div>
    <Dialog open={dialog}>
      <div className='flex justify-center mx-5 mt-10'>
        <AddMumi onClose={() => setDialog(false)} onSave={addMumi} />
      </div>
    </Dialog>
    <Toaster />
    {/* <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} /> */}
    </div>
  )
}

export default Absensi