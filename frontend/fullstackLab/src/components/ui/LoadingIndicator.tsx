

export const LoadingIndicator = () => {
  return (
      <div className='flex space-x-2 justify-center items-center bg-transparent h-screen '>
        <div className='h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]'></div>
        <div className='h-3 w-3 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]'></div>
        <div className='h-3 w-3 bg-primary rounded-full animate-bounce'></div>
      </div>
  )
}