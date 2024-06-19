import { useState, useEffect, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { fetchUser, updateUser, User } from "./service";

const UserUpdatePage = () => {
  const router = useRouter();
  const { id } = router.query;

  const [user, setUser] = useState<User>({
    id: 0,
    userId: "",
    firstname: "",
    lastname: "",
    description: "",
    image: "",
    brand: "",
    serialnumber: "",
    createdAT: "",
    updatedAT: ""
  });

  useEffect(() => {
    if (id) {
      fetchUser(Number(id)).then(setUser);
    }
  }, [id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    await updateUser(Number(id), user);
    router.push("/");
  };

  return (
    <div>
      <h1>Update User</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>User Id</label>
          <input name="userId" value={user.userId} onChange={handleChange} />
        </div>
        <div>
          <label>First Name</label>
          <input name="firstname" value={user.firstname} onChange={handleChange} />
        </div>
        <div>
          <label>Last Name</label>
          <input name="lastname" value={user.lastname} onChange={handleChange} />
        </div>
        <div>
          <label>Description</label>
          <input name="description" value={user.description} onChange={handleChange} />
        </div>
        <div>
          <label>Brand</label>
          <input name="brand" value={user.brand} onChange={handleChange} />
        </div>
        <div>
          <label>Serial Number</label>
          <input name="serialnumber" value={user.serialnumber} onChange={handleChange} />
        </div>
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default UserUpdatePage;
