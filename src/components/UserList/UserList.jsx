import './UserList.css'

const UserList = ({ users, selectedUser, handleSelectUser, loading }) => {
    // console.log(users);
    const allColumns = [...new Set(users.flatMap((user) => Object.keys(user)))];

    const columns = ["id", ...allColumns.filter((column) => column !== "id")]; 
return (
        <>
            {!loading && 
            (<div className="container-user-list">
                <table border={1}>
                    <thead>
                        <tr>
                            <th>Select</th>
                            {columns.map((column) => (
                                <th key={column}>
                                    {column}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{backgroundColor: user.color}}>
                                <td>
                                    <input
                                    type="radio"
                                    name="selectedUser"
                                    checked={selectedUser === user.id}
                                    onChange={() => handleSelectUser(user)}
                                />
                                </td>
                                {columns.map((column) => (
                                    <td key={column}>
                                        { column === "avatar" 
                                            ? <img src={user[column]} alt="avatar" className='img-avt'/>
                                            : column === "createdAt" || column === "dob"
                                                ? new Date(user[column]).toLocaleString("vi-VN")
                                                : typeof user[column] === "object"
                                                    ? JSON.stringify(user[column])
                                                    : user[column]
                                        }
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>)}
        </>
    )
}
export default UserList;