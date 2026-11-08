import { useState, useEffect } from 'react'
import './App.css'
import UserList from './components/UserList/UserList.jsx';
import UserForm from './components/UserForm/UserForm.jsx';
import UserToolBar from './components/UserToolBar/UserToolBar.jsx';

function App() {

  const [ users, setUsers ] = useState([]);

  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState("");

  const [ dataForm, setDataForm ] = useState({});
  const [ selectedUser, setSelectedUser ] = useState(null);


  const columns = [...new Set(users.flatMap(user => Object.keys(user)))];

  const LIMIT = 10;
  const [ page, setPage ] = useState(1);
  const [ loadingMore, setLoadingMore ] = useState(false);
  const [ hasMore, setHasMore ] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      if (page === 1) {
        setLoading(true);
      } else {
        setLoadingMore(true);
      }

      try {
        const res = await fetch(`https://671891927fc4c5ff8f49fcac.mockapi.io/v2?page=${page}&limit=${LIMIT}`);
        if (!res.ok) {
          throw new Error(res.status);
        }
        const data = await res.json();

        if (data.length < LIMIT) {
          setHasMore(false);
        }

        if (page === 1) {
          setUsers(data);
        } else {
          setUsers(prevUsers => [...prevUsers, ...data]);
        }
      } catch(err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };
    fetchUsers();
  }, [page]);

  const handleLoadMore = () => {
    if (hasMore && !loadingMore && !loading) {
      setLoadingMore(true);
      setPage(prev => prev + 1);
    }
  }

  const handleSelectUser = (user) => {
    setSelectedUser(user.id);
    setDataForm({...user});
  }

  const handleAddUser = async () => {
    try {
      const res = await fetch('https://671891927fc4c5ff8f49fcac.mockapi.io/v2',
        {
          method: 'POST',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(dataForm)
        });
        
        const newUser = await res.json();
        setUsers([...users, newUser]);
        setSelectedUser(null);
        setDataForm({});

        alert("Thêm thành công!");
    } catch (err) {
        alert("Thêm thất bại!", err);
    }
  }

  const handleDeleteUser = async (userId) => {
    try {
        await fetch(`https://671891927fc4c5ff8f49fcac.mockapi.io/v2/${userId}`,
        {
          method: 'DELETE',
          headers: {
            'Content-type': 'application/json'
          },
        });
        
        setUsers(users.filter(user => user.id !== userId));
        setSelectedUser(null);
        setDataForm({});

        alert("Xoá thành công!");
    } catch (err) {
        alert("Xoá thất bại!", err);
    }
  }

  const handleClear = () => {
    setSelectedUser(null);
    setDataForm({});
  }

  const handleEditUser = async (userId) => {
    try {
        const res = await fetch(`https://671891927fc4c5ff8f49fcac.mockapi.io/v2/${userId}`,
        {
          method: 'PUT',
          headers: {
            'Content-type': 'application/json'
          },
          body: JSON.stringify(dataForm)
        });
        
        const newUser = await res.json();
        setUsers(users.map(user => user.id === userId ? newUser : user));
        setSelectedUser(null);
        setDataForm({});

        alert("Sửa thành công!");
    } catch (err) {
        alert("Sửa thất bại!", err);
    }
  }

  return (
    <>
      <div className='app'>
        <div className="top">
          <UserForm columns={columns}
                    dataForm={dataForm}
                    setDataForm={setDataForm}  
                    // users={users}
                    // setUsers={setUsers}
            />
          <div className='home-btns'>
            <UserToolBar handleAddUser={handleAddUser}
                          handleDeleteUser={handleDeleteUser}
                          selectedUser={selectedUser}
                          handleClear={handleClear}
                          handleEditUser={handleEditUser}
            />
          </div>
        </div>
        
        {/* {showForm && (
          <div className="modal-overlay">
            <div className="modal">
              <h2 className='title-add-user'>Thêm User</h2>
              <UserForm/>
            </div>
          </div>
        )} */}
        {loading && <p>Loading...</p>}
        {error && <p>Error: {error}</p>}

        <UserList users={users} 
                  handleSelectUser={handleSelectUser}
                  selectedUser={selectedUser}
                  loading={loading}
                  loadingMore={loadingMore}
                  handleLoadMore={handleLoadMore}
                  hasMore={hasMore}
        />
      </div>
    </>
  )
}

export default App;
