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
import progress from '@/assets/progress.svg'
import Dialog from './Dialog'
import toast, { Toaster } from 'react-hot-toast'

const Absensi = () => {
const [date, setDate] = useState(new Date())
const [tabGender, setTabGender] = useState(null)
const [search, setSerch] = useState('')
const [dialog, setDialog] = useState(false)
const [listMumi, setListMumi] = useState([])
const [isLoading, setIsLoading] = useState(true)

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
  <div className='relative flex flex-col items-center mt-2 max-w-[30rem] mx-auto p-2'>
    {isLoading && <Image src={progress} alt='progress' className='absolute top-4 left-4 animate-spin' />}
    <div className='flex justify-center gap-2 w-64 bg-slate-700 p-1 rounded-full'>
      <button className={'px-2 rounded-full py-1 flex-1 ' + (!tabGender && 'bg-slate-800')} onClick={() => setTabGender(null)}>Semua</button>
      <button className={'px-2 rounded-full py-1 flex-1 ' + (tabGender == 1 && 'bg-slate-800')} onClick={() => setTabGender(1)}>Pria</button>
      <button className={'px-2 rounded-full py-1 flex-1 ' + (tabGender == 2 && 'bg-slate-800')} onClick={() => setTabGender(2)}>Wanita</button>
    </div>
    <div className='flex w-full justify-between mt-5'>
    <div className='flex rounded-full bg-slate-700 overflow-hidden'>
      <button className='px-2' onClick={() => dateStep(-1)}><Image src={left} alt='left' /></button>
      <DatePicker selected={date} onChange={date => setDate(date)}
      customInput={<button className='py-1 w-20'>{dayjs(date).format('DD MMM YY')}</button>}
      />
      <button className='px-2' onClick={() => dateStep(1)}><Image src={right} alt='right' /></button>
    </div>
      <input type='search' placeholder='cari nama...' className='bg-slate-300 text-slate-800 px-3 w-48 rounded-full py-1' onChange={e => setSerch(e.target.value)} />
    </div>
    <TableMumi listMumi={listMumiGender} onAbsen={handleAbsen} />
      <button className='bg-slate-700 px-4 py-1 rounded-full ms-auto mt-2' onClick={() => setDialog(true)}>Tambah</button>
  <Dialog open={dialog}>
    <div className='flex justify-center mx-5 mt-10'>
      <AddMumi onClose={() => setDialog(false)} onSave={addMumi} />
    </div>
  </Dialog>
  <Toaster />
  </div>
  )
}

export default Absensi