import Image from 'next/image'
import edit from '@/assets/edit.svg'
import { useState } from 'react'

const TableManage = ({ listMumi, onEdit }) => {

    return (
    <table className='w-full text-center border'>
        <thead className='border-b'>
            <tr>
            <th className='border-x w-6'>No</th>
            <th className='border-x'>Nama</th>
            <th className='border-x w-16'>Gender</th>
            <th className='border-x w-12'>Aktif</th>
            <th className='border-x w-10'>Edit</th>
            </tr>
        </thead>
        <tbody>
        {
        listMumi.length ?
        listMumi.map((list, index) =>
        <tr key={list.id} className={'bg-slate-900 ' + (index % 2 == 0 && 'bg-opacity-50')}>
            <td className='py-2 border-x'>{index + 1}</td>
            <td className='border-x'>{list.fullname}</td>
            <td className='border-x'>{list.gender == 1 ? 'Pria' : 'Wanita'}</td>
            <td className='border-x'>{list.active == 1 ? 'Yes' : 'No'}</td>
            <td className='border-x'>
                <button className='bg-slate-700 rounded' onClick={() => onEdit(list)}>
                    <Image src={edit} alt='edit' />
                </button>
            </td>
        </tr>
        )
        :
        <tr>
            <td colSpan={5}>NO DATA</td>
        </tr>
        }
        </tbody>
    </table>
    )
}

export default TableManage