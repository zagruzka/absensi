import { useEffect } from 'react'

const Dialog = ({ children, open }) => {

    useEffect(() => {
        if (open) {
            document.body.classList.add('overflow-hidden')
        } else {
            document.body.classList.remove('overflow-hidden')
        }
        return(() => {
            document.body.classList.remove('overflow-hidden')
        })
    }, [open])

    return (
        open &&
        <div className='fixed inset-0 h-full w-full z-50 bg-black bg-opacity-50 backdrop-blur'>
            <div className='w-full'>
            { children }
            </div>
        </div>
    )
}

export default Dialog