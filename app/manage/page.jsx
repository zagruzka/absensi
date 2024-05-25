'use client'

import query from '@/db/query'
import { useEffect, useMemo, useState } from 'react'
import toast from 'react-hot-toast'
import TableManage from './TableManage'
import Dialog from '@/components/Dialog'
import SaveMumi from '@/app/manage/SaveMumi'
import Navbar from '@/components/Navbar'
import Image from 'next/image'
import add from '@/assets/add.svg'

const Manage = () => {
    const [tabGender, setTabGender] = useState(null)
    const [search, setSerch] = useState('')
    const [listMumi, setListMumi] = useState([])
    const [isLoading, setIsLoading] = useState(true)
    const [dialog, setDialog] = useState(false)
    const [addDialog, setAddDialog] = useState(false)

    const userInit = {
        id: null,
        fullname: null,
        gender: null,
        active: 1
    }
    const [user, setUser] = useState(userInit)

    const listMumiFilter = useMemo(() => {
        return listMumi.filter(list => (tabGender ? list.gender == tabGender : true) && list.fullname.toLowerCase().includes(search.toLowerCase()))
        }, [listMumi, tabGender, search])

    const getMumi = () => {
        setIsLoading(true)
        query(`SELECT id, fullname, gender, active FROM mumi ORDER BY LOWER(fullname) ASC`)
        .then(result => setListMumi(result))
        .catch(() => toast.error(<button onClick={() => toast.dismiss()}>Network error</button>))
        .finally(() => setIsLoading(false))
      }

    const handleUser = param => {
        setUser(param)
        setDialog(true)
    }

    const saveUser = (save) => {
        query(`INSERT OR REPLACE INTO mumi (id, fullname, gender, active) VALUES (${save.id} ,'${save.fullname}', '${save.gender}', ${save.active})`)
        .then(() => {
            toast.success(<button onClick={() => toast.dismiss()}>berhasil {save.id ? ' merubah ' : ' menambahkan '+ save.fullname}</button>)
            getMumi()
        })
        .catch(err => console.log(err))
    }

    useEffect(() => { getMumi() }, [])

    return (
    <>
    <div className='max-w-[30rem] mx-auto pb-2'>
    <Navbar tabGender={tabGender} loading={isLoading} onGender={gender => setTabGender(gender)} search={search} onSearch={value => setSerch(value)} />
        <button className='flex justify-center items-center gap-2 h-9 w-32 bg-slate-700 rounded-full my-1'onClick={() => setAddDialog(true)}>
            <Image src={add} alt='add' />Tambah
        </button>
        <TableManage listMumi={listMumiFilter} onEdit={edit => handleUser(edit)} />
    </div>
    <Dialog open={dialog}>
        <div className='flex justify-center mt-20'>
            <SaveMumi onSave={saveUser} onClose={() => setDialog(false)} user={user} />
        </div>
    </Dialog>
    <Dialog open={addDialog}>
        <div className='w-full max-w-96 bg-slate-800 p-5 rounded-xl mx-auto mt-20 text-center'>
            <div>Untuk mencegah double user, sebelum menambah user baru pastikan user tidak terdaftar pada tabel dibawah.</div>
            <div>Jika ada, cukup edit "Aktif" menjadi "YES"</div>
            <div className='mt-2'>Yakin user belum terdaftar ?</div>
            <div className='flex gap-2 justify-end mt-5'>
                <button className='px-2 py-1 w-20 rounded-full bg-green-600' onClick={() => handleUser(userInit) & setAddDialog(false)}>Yakin</button>
                <button className='px-2 py-1 w-20 rounded-full bg-red-500' onClick={() => setAddDialog(false)}>Batal</button>
            </div>
        </div>
    </Dialog>
    </>
    )
}

export default Manage