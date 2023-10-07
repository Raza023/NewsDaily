import React from 'react'
import { Routes, Route } from 'react-router-dom'

import './AdminAndEditorPanel.css'

import SideMenu from '../../../components/sideMenu/SideMenu'
import Welcome from '../../../components/welcome/Welcome'
import AddUser from '../addUser/AddUser'
import EditUser from '../editUser/EditUser'
import SearchUser from '../searchUser/SearchUser'
import ToggleNewsComPendingStatus from '../toggleNewsComPendingStatus/ToggleNewsComPendingStatus'
import ToggleNewsComDisableStatus from '../toggleNewsComDisableStatus/ToggleNewsComDisableStatus'
import Popup from '../../../components/popup/Popup'
import CreateAdd from '../CreateAdd/CreateAdd';


const AdminAndEditorPanel = ({user, target}) => {

  return (
    <div className='panel'>
      <div style={{ width: '15%' }}>
        <SideMenu role={user.role} target = {target}/>
      </div>
      <div style={{ width: '85%', display: 'flex', justifyContent: 'center'}} className='my-5'>
        <Routes>
          <Route path="/" element={<Welcome user = {user} target={target} />} />
          <Route path="/addUser" element={<AddUser role={user.role} target={target} />} />
          <Route path="/editUser/:userId" element={<EditUser role={user.role} target={target} />} />
          <Route path="/searchUser" element={<SearchUser role = {user.role} target={target} />} />
          <Route path="/newscom/pending/:sectionType" element={<ToggleNewsComPendingStatus />} />
          <Route path="/newscom/disable/:sectionType" element={<ToggleNewsComDisableStatus />} />
          <Route path="/newscom/popup/:status/:sectionType/:id" element={<Popup />} />
          <Route path="/createAdd" element={<CreateAdd role={user.role} />} />
        </Routes>
      </div>
    </div>
  )
}

export default AdminAndEditorPanel