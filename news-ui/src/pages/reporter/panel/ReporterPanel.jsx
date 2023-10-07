import { Routes, Route } from 'react-router-dom'

import SideMenu from '../../../components/sideMenu/SideMenu'
import Welcome from '../../../components/welcome/Welcome'
import UploadNews from '../uploadNews/UploadNews'
import PendingNews from '../pendingNews/PendingNews'

const ReporterPanel = ({ user }) => {
  return (
    <div className='panel'>
      <div style={{ width: '15%' }}>
        <SideMenu role={user.role} isDisabled = {user.isDisabled} />
      </div>
      <div style={{ width: '85%', display: 'flex', justifyContent: 'center' }} className='my-5'>
        <Routes>
          <Route path="/" element={<Welcome user = {user}/>} />
          {user.isDisabled === false && (
            <>
              <Route path="/uploadNews" element={<UploadNews role={user.role} />} />
              <Route path="/pendingNews" element={<PendingNews />} />
            </>
          )}
        </Routes>
      </div>
    </div>
  )
}

export default ReporterPanel