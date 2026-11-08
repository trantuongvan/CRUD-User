import { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';
import UserList from './components/UserList/UserList.jsx';
import UserForm from './components/UserForm/UserForm.jsx';
import UserToolBar from './components/UserToolBar/UserToolBar.jsx';

const API_URL = 'https://671891927fc4c5ff8f49fcac.mockapi.io/v2';
const LIMIT = 10;

function App() {
  const [users, setUsers] = useState([]);
  const [savedColumns, setSavedColumns] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dataForm, setDataForm] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("id");
  const [sortOrder, setSortOrder] = useState("asc");

  const currentColumns = [...new Set(users.flatMap((user) => Object.keys(user)))];
  const columns = currentColumns.length > 0 ? currentColumns : savedColumns;

  useEffect(() => {
    const controller = new AbortController();

    const fetchUsers = async () => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }
      setError("");

      try {
        const url = new URL(API_URL);
        url.searchParams.set('page', page);
        url.searchParams.set('limit', LIMIT);

        const res = await fetch(url.toString(), { signal: controller.signal });

        if (res.status === 404) {
          setHasMore(false);
          return;
        }

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const data = await res.json();
        const safeData = Array.isArray(data) ? data : [];

        if (safeData.length > 0) {
          const cols = [...new Set(safeData.flatMap((u) => Object.keys(u)))];
          setSavedColumns((prev) => (cols.length > prev.length ? cols : prev));
        }

        if (safeData.length < LIMIT) {
          setHasMore(false);
        } else {
          setHasMore(true);
        }

        if (page === 1) {
          setUsers(safeData);
        } else {
          setUsers((prevUsers) => {
            const existingIds = new Set(prevUsers.map((u) => u.id));
            const newUniqueUsers = safeData.filter((u) => !existingIds.has(u.id));
            return [...prevUsers, ...newUniqueUsers];
          });
        }
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err.message);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    };

    fetchUsers();

    return () => controller.abort();
  }, [page]);

  const displayedUsers = useMemo(() => {
    let result = [...users];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase().trim();
      result = result.filter((u) => String(u.name || "").toLowerCase().includes(term));
    }

    if (sortBy) {
      result.sort((a, b) => {
        const valA = a[sortBy];
        const valB = b[sortBy];

        if (sortBy === 'id') {
          const numA = Number(valA) || 0;
          const numB = Number(valB) || 0;
          return sortOrder === 'asc' ? numA - numB : numB - numA;
        }

        if (sortBy === 'createdAt') {
          const timeA = new Date(valA).getTime() || 0;
          const timeB = new Date(valB).getTime() || 0;
          return sortOrder === 'asc' ? timeA - timeB : timeB - timeA;
        }

        if (sortBy === 'name') {
          const strA = String(valA || "").toLowerCase();
          const strB = String(valB || "").toLowerCase();
          return sortOrder === 'asc'
            ? strA.localeCompare(strB, 'vi')
            : strB.localeCompare(strA, 'vi');
        }

        return 0;
      });
    }

    return result;
  }, [users, searchTerm, sortBy, sortOrder]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      setLoadingMore(true);
      setPage((prev) => prev + 1);
    }
  }, [hasMore, loadingMore, loading]);

  const handleSearch = (keyword) => {
    setSearchTerm(keyword);
  };

  const handleSortByChange = (newSortBy) => {
    setSortBy(newSortBy);
  };

  const handleSortOrderChange = (newOrder) => {
    setSortOrder(newOrder);
  };

  const handleSelectUser = (user) => {
    setSelectedUser(user.id);
    setDataForm({ ...user });
  };

  const handleClear = () => {
    setSelectedUser(null);
    setDataForm({});
  };

  const handleAddUser = async () => {
    if (!dataForm.name?.trim() || !dataForm.email?.trim()) {
      alert("Nhập đầy đủ thông tin bắt buộc: name và email!");
      return;
    }

    try {
      const payload = { ...dataForm };
      delete payload.id;

      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const newUser = await res.json();
      setUsers((prev) => [newUser, ...prev]);
      setSelectedUser(null);
      setDataForm({});

      alert("Thêm thành công!");
    } catch (err) {
      alert(`Thêm thất bại! ${err.message}`);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!userId) {
      alert("Chọn một user trước khi bấm Xoá!");
      return;
    }

    const targetUser = users.find((u) => u.id === userId);
    const confirmMessage = targetUser?.name
      ? `Bạn có chắc chắn muốn xoá user id: ${userId}) không?`
      : `Bạn có chắc chắn muốn xoá user id: ${userId} không?`;

    if (!window.confirm(confirmMessage)) {
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${userId}`, {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json'
        }
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      setUsers((prev) => prev.filter((user) => user.id !== userId));
      setSelectedUser(null);
      setDataForm({});

      alert("Xoá thành công!");
    } catch (err) {
      alert(`Xoá thất bại! ${err.message}`);
    }
  };

  const handleEditUser = async (userId) => {
    if (!userId) {
      alert("Chọn một user trước khi bấm Sửa!");
      return;
    }

    if (!dataForm.name?.trim() || !dataForm.email?.trim()) {
      alert("Trường name và email không được để trống!");
      return;
    }

    try {
      const res = await fetch(`${API_URL}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-type': 'application/json'
        },
        body: JSON.stringify(dataForm)
      });

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      const updatedUser = await res.json();
      setUsers((prev) => prev.map((user) => (user.id === userId ? updatedUser : user)));
      setSelectedUser(null);
      setDataForm({});

      alert("Sửa thành công!");
    } catch (err) {
      alert(`Sửa thất bại! ${err.message}`);
    }
  };

  return (
    <>
      <div className='app'>
        <div className="top">
          <UserForm
            columns={columns}
            dataForm={dataForm}
            setDataForm={setDataForm}
          />
          <div className='home-btns'>
            <UserToolBar
              handleAddUser={handleAddUser}
              handleDeleteUser={handleDeleteUser}
              selectedUser={selectedUser}
              handleClear={handleClear}
              handleEditUser={handleEditUser}
              onSearch={handleSearch}
              sortBy={sortBy}
              onSortByChange={handleSortByChange}
              sortOrder={sortOrder}
              onSortOrderChange={handleSortOrderChange}
            />
          </div>
        </div>

        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        <div style={{ padding: '0 10px', color: '#555', fontSize: '13px' }}>
          Đã nạp: <strong>{users.length}</strong> users
        </div>

        <UserList
          users={displayedUsers}
          allColumns={columns}
          handleSelectUser={handleSelectUser}
          selectedUser={selectedUser}
          loading={loading}
          loadingMore={loadingMore}
          handleLoadMore={handleLoadMore}
          hasMore={hasMore}
        />
      </div>
    </>
  );
}

export default App;
