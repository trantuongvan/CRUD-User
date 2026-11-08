import './UserForm.css'

const UserForm = ({ columns, dataForm, setDataForm }) => {
    return (
        <>
            <form
                id='user-form'
                className="form-add-user"
                onSubmit={(e) => e.preventDefault()}
            >
                {columns
                    .filter((column) => column !== "id" && column !== "createdAt")
                    .map((column) => (
                        <div className={`input-${column}`} key={column}>
                            <label htmlFor={column}>{column}:</label>
                            <input
                                id={column}
                                type="text"
                                placeholder={`Nhập ${column}`}
                                required={column === "name" || column === "email"}
                                value={dataForm[column] ?? ""}
                                onChange={(e) => {
                                    setDataForm({
                                        ...dataForm,
                                        [column]: e.target.value
                                    });
                                }}
                            />
                        </div>
                    ))}
            </form>
        </>
    );
};

export default UserForm;
