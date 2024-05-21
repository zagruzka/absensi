import toast from 'react-hot-toast'
import Dialog from './Dialog'
import { useState } from 'react'

const TableMumi = ({ listMumi, onAbsen }) => {
    const [izin, setIzin] = useState({
        id: null,
        prev: null,
        absen: null,
        ket: null
    })

    const [dialog, setDialog] = useState(false)
    const handleAbsen = (id, prev, absen) => {
        if (absen == 2 && prev != absen) {
            setDialog(true)
            setIzin({ id, prev, absen, ket: null })
        } else {
            onAbsen(id, prev, absen, '')
        }
    }
    const handleIzin = () => {
        if (!izin.ket) {
            toast.error('Izin harus ada keterangan')
            return
        }
        onAbsen(izin.id, izin.prev, izin.absen, izin.ket)
        setDialog(false)
    }
    return (
    <>
    <div className='relative w-full'>
        <table className='w-full text-center border'>
            <thead className='border-b'>
                <tr>
                    <th className='border-x w-6' rowSpan={2}>No</th>
                    <th className='border-x' rowSpan={2}>Nama</th>
                    <th className='border-y' colSpan={2}>Absensi</th>
                    <th className='border-x w-16' rowSpan={2}>Ket</th>
                </tr>
                <tr>
                    <th className='border-x w-12'>Hadir</th>
                    <th className='border-x w-12'>Izin</th>
                </tr>
            </thead>
            <tbody>
            {
            listMumi.length ?
            listMumi.map((list, index) => 
            <tr key={list.id} className={'bg-slate-900 ' + (index % 2 == 0 && 'bg-opacity-50')}>
                <td className='py-2 border-x'>{index + 1}</td>
                <td className='py-2 border-x'>{list.nama}</td>
                <td className='py-2 border-x'>
                    <button className={'border w-4 h-4 rounded '+ (list.absen == 1 && 'bg-green-600')}
                    onClick={() => handleAbsen(list.id, list.absen, 1)}></button>
                </td>
                <td className='py-2 border-x'>
                    <button className={'border w-4 h-4 rounded '+ (list.absen == 2 && 'bg-yellow-600')}
                    onClick={() => handleAbsen(list.id, list.absen, 2)}></button>
                </td>
            <td className='py-2'>
                {
                list.ket?.length > 7 ?
                 <a className='text-blue-600' onClick={() => toast(list.ket)}>{list.ket.substring(0, 7)}</a> : list.ket}</td>
            </tr>
            )
            :
            <tr>
                <td colSpan={5}>NO DATA</td>
            </tr>
            }
            </tbody>
        </table>
    </div>
    <Dialog open={dialog}>
        <div className='mx-5'>
            <div className='max-w-96 p-4 bg-slate-800 rounded-xl mx-auto mt-10'>
                <div className='font-bold text-center'>Keterangan izin</div>
                <textarea id='ket' className='text-slate-800 bg-slate-200 w-full p-2 rounded-xl mt-2' rows={2} autoFocus
                onChange={e => setIzin({...izin, ket: e.target.value})} />
                <div className='flex gap-2 justify-end mt-2'>
                    <button className='w-20 py-1 bg-yellow-600 rounded-full' onClick={() => handleIzin()}>Izin</button>
                    <button className='w-20 py-1 bg-slate-600 rounded-full' onClick={() => setDialog(false)}>Batal</button>
                </div>
            </div>
        </div>
    </Dialog>
    </>
    )
}

export default TableMumi