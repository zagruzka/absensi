import { useState } from 'react'
import toast from 'react-hot-toast'

const saveMumi = ({ onClose, onSave, user }) => {

  const [save, setSave] = useState(user)

  const postMumi = () => {
    if (!(save.fullname && save.gender && save.active)) {
      return toast.error('Data yang diinput tidak lengkap')
    }
    onSave(save)
    onClose()
  }
  return (
  <div className='w-full max-w-96 bg-slate-800 p-5 rounded-xl'>
    <div className='text-center font-bold'>Tambah muda mudi</div>
    <div className='flex flex-col gap-1 mt-5'>
      <div>Nama</div>
      <input id='nama' placeholder='Nama Lengkap' className='rounded-full px-2 text-slate-800 py-1' onChange={e => setSave(prev => ({...prev, fullname: e.target.value}))} value={save.fullname} autoFocus />
      <div className='mt-2'>Jenis Kelamin</div>
      <div className='flex bg-slate-600 p-1 rounded-full'>
        <button className={'flex-1 rounded-full ' + (save.gender == 1 && 'bg-slate-800')} onClick={() => setSave(prev => ({...prev, gender: 1}))}>Pria</button>
        <button className={'flex-1 rounded-full ' + (save.gender == 2 && 'bg-slate-800')} onClick={() => setSave(prev => ({...prev, gender: 2}))}>Wanita</button>
      </div>
      <div className='mt-2'>Aktif</div>
      <div className='flex bg-slate-600 p-1 rounded-full'>
        <button className={'flex-1 rounded-full ' + (save.active == 1 && 'bg-slate-800')} onClick={() => setSave(prev => ({...prev, active: 1}))}>Yes</button>
        <button className={'flex-1 rounded-full ' + (save.active == 2 && 'bg-slate-800')} onClick={() => setSave(prev => ({...prev, active: 2}))}>No</button>
      </div>
    </div>
    <div className='flex gap-2 justify-end mt-5'>
      <button className='px-2 py-1 w-20 rounded-full bg-green-600' onClick={() => postMumi()}>Simpan</button>
      <button className='px-2 py-1 w-20 rounded-full bg-red-500' onClick={() => onClose()}>Batal</button>
    </div>
  </div>
  )
}

export default saveMumi