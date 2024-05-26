import calendar from '@/assets/calendar.svg'
import query from '@/db/query'
import dayjs from 'dayjs'
import Image from 'next/image'
import { forwardRef, useState } from 'react'
import ReactDatePicker from 'react-datepicker'

const Calendar = ({ selected, onChange, loading }) => {
    const [exist, setExist] = useState([])

    const getExist = (date) => {
        loading(true)
        setExist([])
        query(`SELECT DISTINCT date FROM absen WHERE date LIKE '${dayjs(date).format("YYYY-MM-")}%'`)
        .then(res => setExist(res.map(i => i.date)))
        .catch(err => console.error(err))
        .finally(() => loading(false))
    }
    const CustomInput = forwardRef(({ value, onClick }, ref) => (
        <button className='flex justify-center items-center w-36 h-9 bg-slate-700 px-2 gap-1 rounded-full' onClick={() => onClick() & getExist(value)} ref={ref}>
          <Image src={calendar} alt='calendar' />{value}
        </button>
      ))
    return (
        <div className='z-10'>
            <ReactDatePicker selected={selected} onChange={onChange} dateFormat={'dd MMM yy'} popperPlacement='bottom-start' onClick={(e) => console.log('e')}
            highlightDates={exist.map(i => new Date(i))}
            customInput={<CustomInput />}
            renderCustomHeader={({
                monthDate,
                decreaseMonth,
                increaseMonth,
                }) => (
                    <>
                    <button className='react-datepicker__navigation react-datepicker__navigation--previous' onClick={() =>decreaseMonth() & getExist(dayjs(monthDate).subtract(1, 'month'))}>
                        <span className='react-datepicker__navigation-icon react-datepicker__navigation-icon--previous'>prev</span>
                    </button>
                    <span className='react-datepicker__current-month'>{monthDate.toLocaleString('en-US', { month: 'long', year: 'numeric' })}</span>
                    <button className='react-datepicker__navigation react-datepicker__navigation--next' onClick={() => increaseMonth() & getExist(dayjs(monthDate).add(1, 'month'))}>
                        <span className='react-datepicker__navigation-icon react-datepicker__navigation-icon--next'>next</span>
                    </button>
                    </>
                )}
            >
                <span className='bg-green-500 px-2 me-1 rounded'></span><span>Ada absensi</span><span className='bg-sky-700 px-2 ms-2 me-1 rounded'></span><span>Tanggal dipilih</span>
            </ReactDatePicker>
        </div>
    )
}

export default Calendar