'use client'

import {useEffect, useMemo, useState } from 'react'
import query from '@/db/query'
import TableMumi from './TableAbsensi'
import dayjs from 'dayjs'
import Image from 'next/image'
import list from '@/assets/list.svg'
import listDark from '@/assets/listDark.svg'
import Dialog from '../../components/Dialog'
import toast from 'react-hot-toast'
import TextareaAutosize from 'react-textarea-autosize'
import { Swiper, SwiperSlide } from 'swiper/react'
import Navbar from '@/components/Navbar'
import Calendar from './Calendar'
import 'react-datepicker/dist/react-datepicker.css'
import 'swiper/css'

const Absensi = () => {
  const [date, setDate] = useState(new Date(new Date().setHours(0, 0, 0, 0)))
  const [tabGender, setTabGender] = useState(null)
  const [search, setSerch] = useState('')
  const [note, setNote] = useState('')
  const [noteDialog, setNoteDialog] = useState(false)
  const [izinDialog, setIzinDialog] = useState(false)
  const [listMumi, setListMumi] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const [izin, setIzin] = useState({
    id: null,
    prev: null,
    absen: null,
    ket: null
  })

  const listMumiFilter = useMemo(() => {
    return listMumi.filter(list => (tabGender ? list.gender == tabGender : true) && list.fullname.toLowerCase().includes(search.toLowerCase()))
    }, [listMumi, tabGender, search])

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

  const getMumi = () => {
    setIsLoading(true)
    query(`SELECT mumi.id, mumi.fullname, mumi.gender, absen.absen, absen.ket
    FROM mumi
    LEFT JOIN absen ON mumi.id = absen.mumi_id AND absen.date = '${format(date)}'
    WHERE mumi.active = 1
    ORDER BY LOWER(fullname) ASC`)
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
        toast((t) => (<button className='flex gap-2' onClick={() => toast.dismiss(t.id)}><Image src={listDark} alt='listDark' /> {result[0].note}</button>))
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

  const dateStep = (step) => setDate(prev => new Date(prev.setDate(prev.getDate() + step)))

  useEffect(() => {
    setListMumi(prev => prev.map(i => ({...i, absen: null, ket: null, mumi_id: null, date: null})))
    getMumi()
    getNote()
  }, [date])

  return (
  <>
  <div className='flex flex-col items-center max-w-[30rem] mx-auto px-2 pb-2'>
    <Navbar tabGender={tabGender} loading={isLoading} onGender={gender => setTabGender(gender)} search={search} onSearch={value => setSerch(value)} />
    <div className='flex w-full justify-between py-1'>
      <Calendar selected={date} onChange={date => setDate(date)} />
      <button className='flex justify-center items-center w-32 h-9 bg-slate-700 px-2 gap-1 rounded-full' onClick={() => setNoteDialog(true)}>
        <Image src={list} alt='list' /> Day Note
      </button>
    </div>
    <Swiper
      slidesPerView={1}
      spaceBetween={30}
      loop={true}
      navigation={true}
      className='w-full z-10'
      onSlideChangeTransitionStart={e => dateStep(e.swipeDirection == 'next' ? 1 : -1) }
    >
      <SwiperSlide>
        <TableMumi listMumi={listMumiFilter} onAbsen={handleAbsen} />
      </SwiperSlide>
      <SwiperSlide>
        <TableMumi listMumi={listMumiFilter} onAbsen={handleAbsen} />
      </SwiperSlide>
    </Swiper>
  </div>
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
  </>
  )
}

export default Absensi