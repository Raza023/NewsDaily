import { Routes, Route } from 'react-router-dom'

import SideMenu from '../../../components/sideMenu/SideMenu'
import Welcome from '../../../components/welcome/Welcome'
import NewsList from '../newsList/NewsList'
import PendingComments from '../pendingComments/PendingComments'
import CommentPopup from '../../../components/commentPopup/CommentPopup'

const UserPanel = ({user}) => {
  return (
    <div className='panel'>
      <div style={{ width: '15%' }}>
        <SideMenu role={user.role} />
      </div>
      <div style={{ width: '85%', display: 'flex', justifyContent: 'center'}} className='my-5'>
        <Routes>
          <Route path="/" element={<Welcome user = {user} />} />
          <Route path="/showNews" element={<NewsList />} />
          <Route path="/pendingComments" element={<PendingComments />} />
          <Route path = "/commentsPopup/:newsId" element = {<CommentPopup />} />
        </Routes>
      </div>
    </div>
  )
}

export default UserPanel