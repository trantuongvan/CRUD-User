import './UserForm.css'
const UserForm = ({ columns, dataForm, setDataForm}) => {

// const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("Du lieu chuan bi POST: ", dataForm);
//     try {
//         const res = await fetch(
//         "https://671891927fc4c5ff8f49fcac.mockapi.io/v2",
//         {
//             method: 'POST',
//             headers: {
//                 'Content-type': 'application/json'
//             },
//             body: JSON.stringify(dataForm)
//         });
        
//         const newUser = await res.json();
//         console.log("Du lieu API tra ve: ", newUser);
//         setUsers([...users, newUser]);
//     } catch (err) {
//         console.log(err);
//     }
// }

    return (
        <>
            <form id='user-form' className="form-add-user">
                {columns.filter((column) => column !== "id" && column !== "createdAt")
                .map((column) => (
                    <div className={`input-${column}`} key={column}>
                        <label htmlFor={column}>{column}:</label> 
                        <input id={column} 
                                type="text" 
                                placeholder={`Nhập ${column}`} 
                                required={column === "name" || column === "email"}
                                value={dataForm[column] ?? ""}
                                onChange={(e) => {
                                    setDataForm({
                                        ...dataForm,
                                        [column]: e.target.value
                                    })
                                }}
                        />
                    </div>
                ))}
                
            </form>
            
            {/* <div className='container-btn'>
                <button onClick={() => setShowForm(false)} className='btn-cancel'>Hủy</button>
                <button type='submit' form='user-form' className='btn-add'>Thêm</button>
            </div> */}
        </>
    )
}

export default UserForm;