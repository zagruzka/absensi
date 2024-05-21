import { useState } from 'react'
import toast from 'react-hot-toast'

const AddMumi = ({ onClose, onSave, className }) => {
  const [nama, setNama] = useState(null)
  const [gender, setGender] = useState(null)

  const postMumi = () => {
    if (!nama || !gender) {
      toast.error('Nama atau gender tidak boleh kosong')
      return
    }
    onSave(nama, gender)
    onClose()
  }
  return (
    <div className='w-full max-w-96 bg-slate-800 p-5 rounded-xl'>
      <div className='text-center font-bold'>Tambah muda mudi</div>
      <div className='flex flex-col gap-1 mt-5'>
        <div>Nama</div>
        <input id='nama' placeholder='Nama pendek saja' className='rounded-full px-2 text-slate-800 py-1' onChange={e => setNama(e.target.value)} autoFocus />
        <div className='mt-2'>Jenis Kelamin</div>
        <div className='flex bg-slate-600 p-1 rounded-full'>
          <button className={'flex-1 rounded-full ' + (gender == 1 && 'bg-slate-800')} onClick={() => setGender(1)}>Pria</button>
          <button className={'flex-1 rounded-full ' + (gender == 2 && 'bg-slate-800')} onClick={() => setGender(2)}>Wanita</button>
        </div>
      </div>
      <div className='flex gap-2 justify-end mt-5'>
        <button className='px-2 py-1 w-20 rounded-full bg-green-600' onClick={() => postMumi()}>Simpan</button>
        <button className='px-2 py-1 w-20 rounded-full bg-red-500' onClick={() => onClose()}>Batal</button>
      </div>
    </div>
    )
}

export default AddMumi