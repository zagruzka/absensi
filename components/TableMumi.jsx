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
            onAbsen(id, prev, absen, null)
        }
    }
    const handleIzin = () => {
        onAbsen(izin.id, izin.prev, izin.absen, izin.ket)
        setDialog(false)
    }
    return (
    <>
    <div className='relative w-full'>
        <table className='w-full text-center mt-2 border'>
            <thead className='border-b'>
                <tr>
                    <th className='border-x w-8' rowSpan={2}>No</th>
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
            <td className='py-2'>-</td>
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
            <div className='w-full max-w-96 p-4 bg-slate-800 rounded-xl mx-auto mt-10'>
                <div>Alasan izin</div>
                <textarea className='text-slate-700 bg-slate-200 w-full p-2 rounded-xl mt-2' rows={2} autoFocus
                onChange={e => setIzin({...izin, ket: e.target.value})} />
                <div className='flex gap-2 justify-end mt-2'>
                    <button className='w-20 py-1 bg-yellow-600 rounded-full' onClick={() => handleIzin()}>Izin</button>
                    <button className='w-20 py-1 bg-slate-600 rounded-full' onClick={() => setDialog(false)}>Cancel</button>
                </div>
            </div>
        </div>
    </Dialog>
    </>
    )
}

export default TableMumi