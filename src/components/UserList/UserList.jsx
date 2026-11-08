import './UserList.css'
import { useEffect, useRef } from 'react';

const UserList = ({ users, selectedUser, handleSelectUser, loading, loadingMore, handleLoadMore, hasMore }) => {
    // console.log(users);
    const allColumns = [...new Set(users.flatMap((user) => Object.keys(user)))];

    const columns = ["id", ...allColumns.filter((column) => column !== "id")]; 

    const containerRef = useRef(null);
    const bottomRef = useRef(null);
    const isFetchingRef = useRef(false);

    useEffect(() => {
    isFetchingRef.current = false;
    }, [users.length]);

    useEffect(() => {
        if (users.length === 0 || !hasMore) return;

        const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && !isFetchingRef.current) {
            isFetchingRef.current = true;
            handleLoadMore();
        }
        }, {
            root: containerRef.current,
            threshold: 0.1
        });
        
        if (bottomRef.current) {
            observer.observe(bottomRef.current);
        }
        return () => {
            observer.disconnect();
        }
    }, [users.length, hasMore]);

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

                <div ref={bottomRef} style={{ padding: '10px', textAlign: 'center' }}>
                    {loadingMore && <p>Đang tải thêm 10 user...</p>}
                    {!hasMore && <p>Đã tải hết toàn bộ danh sách!</p>}
                </div>
            </div>)}
        </>
    )
}
export default UserList;