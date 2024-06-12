import { CLIENT } from "../production-constants"

const ApplicationVersion = () => {
  return (
    <p className='font-poppins text-color-5 text-sm'>{CLIENT.APPLICATION_VERSION}</p>
  )
}

export default ApplicationVersion