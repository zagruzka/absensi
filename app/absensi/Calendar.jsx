import calendar from '@/assets/calendar2.svg'
import dayjs from 'dayjs'
import Image from 'next/image'
import ReactDatePicker from 'react-datepicker'

const Calendar = ({ selected, onChange }) => {
    return (
        <div className='z-10'>
            <ReactDatePicker selected={selected} onChange={onChange} popperPlacement='bottom-start'
            customInput={<button className='flex justify-center items-center w-36 h-9 bg-slate-700 px-2 gap-1 rounded-full'>
              <Image src={calendar} alt='calendar' /> {dayjs(selected).format('DD MMM YY')}
              </button>}
            />
        </div>
    )
}

export default Calendar