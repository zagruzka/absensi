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
import menu from '@/assets/menu.svg'
import list from '@/assets/list.svg'
import progress from '@/assets/progress.svg'
import Dialog from './Dialog'
import toast, { Toaster } from 'react-hot-toast'
import Sidebar from './Sidebar'
import TextareaAutosize from 'react-textarea-autosize'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'

const Absensi = () => {
const [date, setDate] = useState(new Date())
const [tabGender, setTabGender] = useState(null)
const [search, setSerch] = useState('')
const [note, setNote] = useState('')
const [addDialog, setAddDialog] = useState(false)
const [noteDialog, setNoteDialog] = useState(false)
const [izinDialog, setIzinDialog] = useState(false)
const [listMumi, setListMumi] = useState([])
const [isLoading, setIsLoading] = useState(true)
const [showSidebar, setShowSidebar] = useState(false)

const [izin, setIzin] = useState({
  id: null,
  prev: null,
  absen: null,
  ket: null
})

const handleAbsen = (id, prev, absen) => {
  if (absen == 2 && prev != absen) {
      setIzinDialog(true)
      setIzin({ id, prev, absen, ket: null })
  } else {
      postAbsen(id, prev, absen, '')
  }
}
const handleIzin = () => {
  if (!izin.ket) {
    return toast.error('Izin harus ada keterangan')
  }
  postAbsen(izin.id, izin.prev, izin.absen, izin.ket)
  setIzinDialog(false)
}

const postAbsen = (id, prev, absen, ket) => {
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

const format = date => dayjs(date).format('YYYY-MM-DD')

const listMumiGender = useMemo(() => {
 return listMumi.filter(list => (tabGender ? list.gender == tabGender : true) && list.fullname.toLowerCase().includes(search.toLowerCase()))
}, [listMumi, tabGender, search])

const getMumi = () => {
  setIsLoading(true)
  query(`SELECT * FROM mumi LEFT JOIN absen ON mumi.id = absen.mumi_id AND absen.date = '${format(date)}' ORDER BY LOWER(fullname) ASC`)
  .then(result => setListMumi(result))
  .catch(() => toast.error('Network error'))
  .finally(() => setIsLoading(false))
}

const getNote = () => {
  toast.dismiss()
  query(`SELECT note FROM note WHERE date = '${format(date)}'`)
  .then(result => {
    if (result.length) {
      setNote(result[0].note)
      toast('Note : '+ result[0].note)
    } else {
      setNote('')
    }
  })
  .catch(() => toast.error('Network error'))
}

const handleNote = (action) => {
  setIsLoading(true)
  query(
    action == 'save' ?
    `INSERT OR REPLACE INTO note (date, note) VALUES ('${format(date)}', '${note}')`
    :
    `DELETE FROM note WHERE date = '${format(date)}'`
  )
  .then(() => {
    setNoteDialog(false)
    getNote()
    toast.success(action == 'save' ? 'Berhasil menambahkan note' : 'Berhasil menghapus note')
  })
  .catch(() => toast.error('Network error'))
  .finally(() => setIsLoading(false))
}

const addMumi = (fullname, gender) => {
  query(`INSERT INTO mumi (fullname, gender) VALUES ('${fullname}', '${gender}')`)
  .then(() => {
    toast.success('Berhasil menambahkan '+fullname)
    getMumi()
  })
  .catch(() => toast.error('Network error'))
}

const dateStep = (step) => setDate(prev => new Date(prev.setDate(prev.getDate() + step)))

const [datePulse, setDatePulse] = useState(false)

const datePulseChange = () => {
  setDatePulse(true)
  setTimeout(() => setDatePulse(false), 100)
}

useEffect(() => {
  setListMumi(prev => prev.map(i => ({...i, absen: null, ket: null, mumi_id: null, date: null})))
  getMumi()
  getNote()
  datePulseChange()
}, [date])

  return (
  <>
    <div className='flex flex-col items-center max-w-[30rem] mx-auto px-2 pb-2'>
      <div className='flex flex-col gap-2 pt-3 pb-2 w-full z-10 bg-slate-800 sticky top-0 shadow-lg'>
        <div className='flex justify-around items-center'>
          <div className='w-10' onClick={() => setShowSidebar(!showSidebar)}><Image src={menu} alt='menu' className='ms-auto' /></div>
          <div className='flex justify-center gap-2 w-64 bg-slate-700 p-1 rounded-full'>
            <button className={'px-2 rounded-full py-1 flex-1 ' + (!tabGender && 'bg-slate-800')} onClick={() => setTabGender(null)}>Semua</button>
            <button className={'px-2 rounded-full py-1 flex-1 ' + (tabGender == 1 && 'bg-slate-800')} onClick={() => setTabGender(1)}>Pria</button>
            <button className={'px-2 rounded-full py-1 flex-1 ' + (tabGender == 2 && 'bg-slate-800')} onClick={() => setTabGender(2)}>Wanita</button>
          </div>
          <div className='w-6'>{isLoading && <Image src={progress} alt='progress' className='animate-spin' />}</div>
        </div>
        <div className={'flex rounded-full bg-slate-700 overflow-hidden mx-auto transition-transform '+ (datePulse ? 'scale-110' : '')}>
          <button className='px-2' onClick={() => dateStep(-1)}><Image src={left} alt='left' /></button>
          <DatePicker selected={date} onChange={date => setDate(date)}
          customInput={<button className='py-1 w-24'>{dayjs(date).format('DD MMM YY')}</button>}
          />
          <button className='px-2' onClick={() => dateStep(1)}><Image src={right} alt='right' /></button>
        </div>
      </div>
      <div className='flex w-full justify-between py-2'>
        <input id='search' placeholder='cari nama...'
          type='search'
          value={search}
          className='bg-slate-200 text-slate-800 px-3 w-48 rounded-full py-1'
          onChange={e => setSerch(e.target.value)}
        />
        <button className='flex bg-slate-700 py-1 px-2 gap-1 rounded-full' onClick={() => setNoteDialog(true)}>
          <Image src={list} alt='list' /> Note
        </button>
      </div>
      <Swiper
        slidesPerView={1}
        spaceBetween={30}
        loop={true}
        navigation={true}
        className='w-full'
        // onSlideChangeTransitionStart={() => setListMumi(prev => prev.map(i => ({...i, absen: null, ket: null})))}
        onSlideChangeTransitionStart={e => dateStep(e.swipeDirection == 'next' ? 1 : -1) }
        // onSlideChangeTransitionEnd={e => dateStep(e.swipeDirection == 'next' ? 1 : -1)}
      >
        <SwiperSlide>
          <TableMumi listMumi={listMumiGender} onAbsen={handleAbsen} />
        </SwiperSlide>
        <SwiperSlide>
          <TableMumi listMumi={listMumiGender} onAbsen={handleAbsen} />
        </SwiperSlide>
      </Swiper>
    </div>
    <Dialog open={addDialog}>
      <div className='flex justify-center mx-5 mt-10'>
        <AddMumi onClose={() => setAddDialog(false)} onSave={addMumi} />
      </div>
    </Dialog>
    <Dialog open={noteDialog}>
      <div className='mx-5'>
        <div className='max-w-96 p-4 bg-slate-800 rounded-xl mx-auto mt-10'>
          <div className='font-bold text-center'>Note {dayjs(date).format('DD MMM YYYY')}</div>
          <TextareaAutosize
            id='note'
            minRows={3}
            placeholder='add note...'
            className='text-slate-800 bg-slate-200 w-full p-2 rounded-xl mt-2'
            autoFocus
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <div className='flex w-full justify-between'>
            <div className='flex gap-2'>
              <button className='rounded-full bg-green-600 py-1 px-2' onClick={() => handleNote('save')}>Simpan</button>
              <button className='rounded-full bg-red-500 py-1 px-2' onClick={() => handleNote('delete')}>Hapus</button>
            </div>
            <button className='rounded-full bg-slate-700 py-1 px-2' onClick={() => setNoteDialog(false)}>Tutup</button>
          </div>
        </div>
      </div>
    </Dialog>
    <Dialog open={izinDialog}>
        <div className='mx-5'>
            <div className='max-w-96 p-4 bg-slate-800 rounded-xl mx-auto mt-10'>
                <div className='font-bold text-center'>Keterangan izin</div>
                <textarea id='ket' className='text-slate-800 bg-slate-200 w-full p-2 rounded-xl mt-2' rows={2} autoFocus
                onChange={e => setIzin({...izin, ket: e.target.value})} />
                <div className='flex gap-2 justify-end mt-2'>
                    <button className='w-20 py-1 bg-yellow-600 rounded-full' onClick={() => handleIzin()}>Izin</button>
                    <button className='w-20 py-1 bg-slate-600 rounded-full' onClick={() => setIzinDialog(false)}>Batal</button>
                </div>
            </div>
        </div>
    </Dialog>
    <Toaster />
    <Sidebar show={showSidebar} onClose={() => setShowSidebar(false)} addMumi={() => setAddDialog(true)} />
  </>
  )
}

export default Absensi