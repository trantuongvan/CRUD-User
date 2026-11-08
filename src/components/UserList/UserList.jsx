import './UserList.css';
import { useEffect, useRef } from 'react';

const UserList = ({
    users,
    allColumns: propColumns,
    selectedUser,
    handleSelectUser,
    loading,
    loadingMore,
    handleLoadMore,
    hasMore
}) => {
    const derivedColumns = [...new Set(users.flatMap((user) => Object.keys(user)))];
    const baseColumns = propColumns && propColumns.length > 0 ? propColumns : derivedColumns;
    const columns = ["id", ...baseColumns.filter((column) => column !== "id")];

    const containerRef = useRef(null);
    const bottomRef = useRef(null);
    const isFetchingRef = useRef(false);

    useEffect(() => {
        if (!loading && !loadingMore) {
            isFetchingRef.current = false;
        }
    }, [loading, loadingMore, users]);

    useEffect(() => {
        if (users.length === 0 || !hasMore || loading) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && !isFetchingRef.current) {
                    isFetchingRef.current = true;
                    handleLoadMore();
                }
            },
            {
                root: containerRef.current,
                threshold: 0.1
            }
        );

        if (bottomRef.current) {
            observer.observe(bottomRef.current);
        }
        return () => {
            observer.disconnect();
        };
    }, [users.length, hasMore, loading, handleLoadMore]);

    return (
        <>
            {!loading && (
                <div className="container-user-list" ref={containerRef}>
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
                            {users.length === 0 ? (
                                <tr>
                                    <td colSpan={columns.length + 1} style={{ textAlign: 'center', padding: '20px', color: '#666' }}>
                                        Không tìm thấy user nào phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user.id} style={{ backgroundColor: user.color }}>
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
                                                {column === "avatar"
                                                    ? <img src={user[column]} alt="avatar" className='img-avt' />
                                                    : column === "createdAt" || column === "dob"
                                                        ? new Date(user[column]).toLocaleString("vi-VN")
                                                        : typeof user[column] === "object"
                                                            ? JSON.stringify(user[column])
                                                            : user[column]
                                                }
                                            </td>
                                        ))}
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    <div ref={bottomRef} style={{ padding: '10px', textAlign: 'center' }}>
                        {loadingMore && <p>Đang tải thêm</p>}
                        {!hasMore && users.length > 0 && <p>Đã tải xong.</p>}
                    </div>
                </div>
            )}
        </>
    );
};

export default UserList;
