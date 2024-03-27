"use client"

import {useEffect, useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import query from '@/db/query'

const Absensi = () => {
const [date, setDate] = useState(new Date())
const [mumi, setMumi] = useState([])

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
  </div>
  )
}

export default Absensi