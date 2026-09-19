import './UserToolBar.css'
const UserToolBar = ({ handleAddUser, handleDeleteUser, selectedUser, handleClear, handleEditUser }) => {

    return (
        <>
            <button onClick={handleAddUser} className='btn-add'>Thêm</button>
            <button onClick={() => handleDeleteUser(selectedUser)} className="btn-delete">Xóa</button>
            <button onClick={() => handleEditUser(selectedUser)} className="btn-edit">Sửa</button>
            <button onClick={handleClear} className="btn-clear">Xóa trắng</button>
        </>
    )
}
export default UserToolBar;