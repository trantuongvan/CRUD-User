import { useRef } from 'react';
import './UserToolBar.css';

const UserToolBar = ({
    handleAddUser,
    handleDeleteUser,
    selectedUser,
    handleClear,
    handleEditUser,
    onSearch,
    sortBy,
    onSortByChange,
    sortOrder,
    onSortOrderChange
}) => {
    const searchInputRef = useRef(null);

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const keyword = searchInputRef.current ? searchInputRef.current.value : "";
            onSearch(keyword);
        }
    };

    return (
        <div className="toolbar-wrapper">
            <div className="toolbar-filters">
                <div className="search-box">
                    <input
                        ref={searchInputRef}
                        type="text"
                        className="search-input"
                        placeholder="Tìm kiếm theo name"
                        onKeyDown={handleKeyDown}
                    />
                </div>

                <div className="sort-box">
                    <label htmlFor="sort-by">Sắp xếp:</label>
                    <select
                        id="sort-by"
                        className="sort-select"
                        value={sortBy}
                        onChange={(e) => onSortByChange(e.target.value)}
                    >
                        <option value="id">Theo ID</option>
                        <option value="name">Theo Name</option>
                        <option value="createdAt">Theo CreatedAt</option>
                    </select>

                    <select
                        id="sort-order"
                        className="sort-select"
                        value={sortOrder}
                        onChange={(e) => onSortOrderChange(e.target.value)}
                    >
                        <option value="asc">Tăng dần</option>
                        <option value="desc">Giảm dần</option>
                    </select>
                </div>
            </div>

            <div className="toolbar-actions">
                <button type="button" onClick={handleAddUser} className="btn-add">
                    Thêm
                </button>
                <button type="button" onClick={() => handleDeleteUser(selectedUser)} className="btn-delete">
                    Xóa
                </button>
                <button type="button" onClick={() => handleEditUser(selectedUser)} className="btn-edit">
                    Sửa
                </button>
                <button type="button" onClick={handleClear} className="btn-clear">
                    Xóa trắng form
                </button>
            </div>
        </div>
    );
};

export default UserToolBar;
