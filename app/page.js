"use client"

import {useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import query from '@/db/query'
import { Dialog } from '@headlessui/react'
import { RadioGroup } from '@headlessui/react'

const Absensi = () => {
const [date, setDate] = useState(new Date())
const [mumi, setMumi] = useState([])
const [gender, setGender] = useState(null)

const [dialog, setDialog] = useState(false)

useEffect(() => {
  query('SELECT * FROM mumi')
  .then(result => setMumi(result))
}, [])

  return (
  <div className="flex flex-col items-center mt-2 max-w-[30rem] mx-auto">
    <div className="flex justify-center gap-2 w-full bg-slate-700 p-1 rounded-full">
      <button className="bg-slate-900 px-2 rounded-full py-1 w-1/2">Pria</button>
      <button className="bg-slate-700 px-2 rounded-full py-1 w-1/2">Wanita</button>
    </div>
    <div className='flex flex-wrap w-full justify-center gap-3 md:justify-between md:gap-0 mt-5'>
      <DatePicker dateFormat="dd MMMM YY" selected={date} onChange={date => setDate(date)} 
      className='text-slate-800 text-center max-w-40' />
      <input type='search' placeholder='cari nama...' className='text-slate-800 px-3' />
    </div>
    <table className="w-full text-center mt-2 border">
      <thead className="border-b">
        <tr>
          <th className='border-x' rowSpan={2}>No</th>
          <th className='border-x' rowSpan={2}>Nama</th>
          <th className='border-y' colSpan={2}>Absensi</th>
          <th className='border-x' rowSpan={2}>Ket</th>
        </tr>
        <tr>
        <th className='border-x'>Izin</th>
        <th className='border-x'>Izin</th>
        </tr>
      </thead>
      <tbody>
        {
          mumi.map(i => (
            <tr key={i.id}>
              <td className='py-2 border-x'>{i.id}</td>
              <td className='py-2 border-x'>{i.nama}</td>
              <td className='py-2 border-x'><input type="checkbox" name="" id="" /></td>
              <td className='py-2 border-x'><input type="checkbox" name="" id="" /></td>
              {/* <td className='py-2'><input type="text" name="" id="" className='max-w-36' /></td> */}
            </tr>
          ))
        }
      </tbody>
    </table>
    <button className='bg-slate-700 p-2 mt-2 ms-auto' onClick={() => setDialog(true)}>Tambah</button>
    <Dialog open={dialog} onClose={() => setDialog(false)} className='absolute z-50 w-full h-2/3 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur'>
      <Dialog.Panel className='max-w-96 bg-slate-700 rounded-xl p-4'>
        <div className='text-center font-bold'>Tambah muda mudi</div>
        <div>
          <div>Nama</div>
          <input placeholder='nama' />
          <div>Gender</div>
          <RadioGroup value={gender} onChange={setGender}>
            <RadioGroup.Label>Plan</RadioGroup.Label>
            <RadioGroup.Option value="startup">
              {({ checked }) => (
                <span className={checked ? 'bg-blue-200' : ''}>Startup</span>
              )}
            </RadioGroup.Option>
            <RadioGroup.Option value="business">
              {({ checked }) => (
                <span className={checked ? 'bg-blue-200' : ''}>Business</span>
              )}
            </RadioGroup.Option>
            <RadioGroup.Option value="enterprise">
              {({ checked }) => (
                <span className={checked ? 'bg-blue-200' : ''}>Enterprise</span>
              )}
            </RadioGroup.Option>
          </RadioGroup>
        </div>
        <div className='flex gap-2 justify-center mt-2'>
          <button className='p-2 w-20 rounded-full bg-green-600' onClick={() => setDialog(false)}>Save</button>
          <button className='p-2 w-20 rounded-full bg-red-500' onClick={() => setDialog(false)}>Cancel</button>
        </div>
      </Dialog.Panel>
    </Dialog>
  </div>
  )
}

export default Absensi