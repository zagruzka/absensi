const Dialog = ({ children, open }) => {
    return (
        open &&
        <div className='fixed inset-0 h-full w-full bg-black bg-opacity-50 backdrop-blur'>
            <div className='w-full'>
            { children }
            </div>
        </div>
    )
}

export default Dialog