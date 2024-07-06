import Link from 'next/link'
import toast from 'react-hot-toast'

const TableAbsensi = ({ listMumi, onAbsen }) => {
    return (
    <>
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
        <tr key={list.id} className={'bg-slate-900 ' + (index % 2 == 0 ? 'bg-opacity-50' : '')}>
            <td className='py-2 border-x'>{index + 1}</td>
            <td className='py-2 border-x'>{list.fullname}</td>
            <td className='py-2 border-x'>
                {/* absen 1 untuk hadir, 2 untuk izin */}
                <button className={'border w-4 h-4 rounded '+ (list.absen == 1 ? 'bg-green-600' : '')}
                onClick={() => onAbsen(list.id, list.absen, 1)}></button>
            </td>
            <td className='py-2 border-x'>
                <button className={'border w-4 h-4 rounded '+ (list.absen == 2 ? 'bg-yellow-600' : '')}
                onClick={() => onAbsen(list.id, list.absen, 2, list.ket)}></button>
            </td>
            <td className='py-2 w-16 whitespace-nowrap text-ellipsis block overflow-hidden' onClick={() => toast(<button onClick={() => toast.dismiss()}>{list.ket}</button>)}>
                {list.ket}
                {/* {
                list.ket?.length > 7 ?
                    <a className='text-blue-600' onClick={() => toast(<button onClick={() => toast.dismiss()}>{list.ket}</button>)}>{list.ket.substring(0, 7)}</a>
                : list.ket
                } */}
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
    <div className={'text-center py-1 ' +(listMumi.length ? '' : 'hidden')}>Tidak menemukan nama? Daftar atau aktifkan <Link href='/manage' className='border-b'>disini</Link></div>
    </>
    )
}

export default TableAbsensi