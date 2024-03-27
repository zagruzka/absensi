"use client"

import {useState } from 'react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

const Absensi = ({ mumi }) => {
const [date, setDate] = useState(new Date())

  return (
  <div className="flex flex-col items-center mt-2 max-w-[30rem] mx-auto">
    <div className="flex justify-center gap-2 w-full bg-slate-700 p-1 rounded-full">
      <button className="bg-slate-900 px-2 rounded-full py-1 w-1/2">Pria</button>
      <button className="bg-slate-700 px-2 rounded-full py-1 w-1/2">Wanita</button>
    </div>
    <DatePicker dateFormat="dd MMMM YY" selected={date} onChange={date => setDate(date)} 
    className='text-slate-800 text-center max-w-40 mt-5' />
    <table className="w-full text-center mt-5">
      <thead className="border-b">
        <tr>
          <th>No</th>
          <th>Nama</th>
          <th>Hadir</th>
          <th>Izin</th>
          <th>Ket</th>
        </tr>
      </thead>
      <tbody>
        {
          mumi.map(i => (
            <tr key={i.id}>
              <td className='py-2'>{i.id}</td>
              <td className='py-2'>{i.nama}</td>
              <td className='py-2'><input type="checkbox" name="" id="" /></td>
              <td className='py-2'><input type="checkbox" name="" id="" /></td>
              <td className='py-2'><input type="text" name="" id="" className='max-w-36' /></td>
            </tr>
          ))
        }
      </tbody>
    </table>
  </div>
  )
}

export default Absensi