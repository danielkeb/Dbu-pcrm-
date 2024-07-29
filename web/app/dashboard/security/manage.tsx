import axios from "axios";
import React, { useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Define the interface for the security data
interface SecurityData {
  id: string;
  email: string;
  role: string;
  name: string;
  last_name: string;
  gender: string;
  address: string;
  status: string;
  password: string;
  phonenumer: string;
  token: string | null;
}

function Manage() {
  const [data, setData] = useState<SecurityData[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<SecurityData | null>(null);
  const [successMessage, setSuccessMessage]= useState(false);
  const [errorMessage, setErrorMessage]= useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:3333/auth/getAllSecurity")
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  const updateItem = (item: SecurityData) => {
    setSelectedItem(item);
    setIsOpen(true);
  };

  const deleteItem = async (item: SecurityData) => {
    // Ask for confirmation before proceeding
    const isConfirmed = window.confirm(
      `Are you sure you want to delete ${item.name} ${item.last_name}?`
    );

    if (!isConfirmed) {
      return; // Exit if user cancels the action
    }

    try {
      await axios.delete(`http://localhost:3333/auth/user/delete?id=${item.id}`);
      
      // Re-fetch the updated data
      const reFetch = await axios.get("http://localhost:3333/auth/getAllSecurity");
      setData(reFetch.data);
      
      // Show success message
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 2000); // Message will disappear after 2 seconds
    } catch (error) {
      console.error("Error deleting item:", error);

      // Show error message
      setErrorMessage(true);
      setTimeout(() => setErrorMessage(false), 2000); // Message will disappear after 2 seconds
    }
  };

  const handleSubmit = async (values: SecurityData) => {
    try {
      const res = await axios.patch(
        `http://localhost:3333/auth/update?id=${values.id}`,
        values
      );
      const reFetch = await axios.get(
        "http://localhost:3333/auth/getAllSecurity"
      );
      setData(reFetch.data);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 1000);
    } catch (error) {
      setErrorMessage(true);
      setTimeout(() => setErrorMessage(false), 1000);
    }
    // Handle the update logic here, for example, send the data to the server
    console.log("Updated values:", values);
    // Close the dialog
    setIsOpen(false);
  };

  const validationSchema = Yup.object({
    id: Yup.string().required("Required"),
    name: Yup.string().required("Required"),
    last_name: Yup.string().required("Required"),
    email: Yup.string().email("Invalid email address").required("Required"),
    gender: Yup.string().required("Required"),
    role:Yup.string().required("Required"),
    phonenumer:Yup.string().required("Required"),
    status: Yup.string().required("Required"),

  });

  return (
    <div>
      <section className="py-1 bg-blueGray-50">
   
        <div className="w-full xl:w-8/12 mb-12 xl:mb-0 px-4 mx-auto mt-24">
          <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
            <div className="rounded-t mb-0 px-4 py-3 border-0">
              <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                  <h3 className="font-semibold text-base text-blueGray-700">
                    Visit
                  </h3>
                </div>
              </div>
            </div>

            <div className="block  overflow-x-auto">
  <table className="items-center bg-transparent w-full border-collapse">
    <thead>
      <tr>
        <th className="px-2 md:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs md:text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
          ID
        </th>
        <th className="px-2 md:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs md:text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
          Name
        </th>
        <th className="px-2 md:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs md:text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
          Last Name
        </th>
        <th className="px-2 md:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs md:text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
          Phone No
        </th>
        <th className="px-2 md:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs md:text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
          Email
        </th>
        <th className="px-2 md:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs md:text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
          Gender
        </th>
        <th className="px-2 md:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs md:text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
          Status
        </th>
        <th className="px-2 md:px-6 bg-blueGray-50 text-blueGray-500 align-middle border border-solid border-blueGray-100 py-3 text-xs md:text-sm uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left">
          Action
        </th>
      </tr>
    </thead>

    <tbody>
      {data?.map((item) => (
        <tr key={item?.id}>
          <td className="border-t-0 px-2 py-2 md:px-6 align-middle border-l-0 border-r-0 text-xs md:text-sm whitespace-nowrap text-left text-blueGray-700">
            {item.id}
          </td>
          <td className="border-t-0 px-2 py-2 md:px-6 align-middle border-l-0 border-r-0 text-xs md:text-sm whitespace-nowrap text-left text-blueGray-700">
            {item.name}
          </td>
          <td className="border-t-0 px-2 py-2 md:px-6 align-middle border-l-0 border-r-0 text-xs md:text-sm whitespace-nowrap text-left text-blueGray-700">
            {item.last_name}
          </td>
          <td className="border-t-0 px-2 py-2 md:px-6 align-middle border-l-0 border-r-0 text-xs md:text-sm text-left whitespace-nowrap text-blueGray-700">
            {item.phonenumer}
          </td>
          <td className="border-t-0 px-2 py-2 md:px-6 align-middle border-l-0 border-r-0 text-xs md:text-sm text-left whitespace-nowrap text-blueGray-700">
            {item.email}
          </td>
          <td className="border-t-0 px-2 py-2 md:px-6 align-middle border-l-0 border-r-0 text-xs md:text-sm text-left whitespace-nowrap text-blueGray-700">
            {item.gender}
          </td>
          <td className="border-t-0 px-2 py-2 md:px-6 align-middle border-l-0 border-r-0 text-xs md:text-sm text-left whitespace-nowrap text-blueGray-700">
            {item.status}
          </td>
          <td className="border-t-0 px-2 py-2 md:px-6 align-middle border-l-0 border-r-0 text-xs md:text-sm text-left whitespace-nowrap text-blueGray-700">
            <button
              className="bg-green-500 text-white active:bg-indigo-600 text-xs md:text-sm font-bold uppercase px-2 md:px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
              type="button"
              onClick={() => updateItem(item)}>
              Update
            </button>
          </td>
          <td className="border-t-0 px-2 py-2 md:px-6 align-middle border-l-0 border-r-0 text-xs md:text-sm text-left whitespace-nowrap text-blueGray-700">
            <button
              className="bg-red-500 text-white active:bg-indigo-600 text-xs md:text-sm font-bold uppercase px-2 md:px-3 py-1 rounded outline-none focus:outline-none ease-linear transition-all duration-150"
              type="button"
              onClick={() => deleteItem(item)}>
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
</div>
        </div>
        <div>
            {successMessage && (
          <small className="text-red-500">security updated successfully</small>
        )}
        {errorMessage && (
          <small className="text-red-500">security update failed</small>
        )}</div>
      </section>
      <Transition show={isOpen} as={React.Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsOpen(false)}>
          <Transition.Child
            as={React.Fragment}
            enter="ease-out duration-3000"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-3000"
            leaveFrom="opacity-100"
            leaveTo="opacity-0">
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={React.Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900">
                    Update Security Data
                  </Dialog.Title>
                  <div className="mt-2">
                    {selectedItem && (
                      <Formik
                        initialValues={selectedItem}
                        validationSchema={validationSchema}
                        onSubmit={handleSubmit}>
                        {({ isSubmitting }) => (
                          <Form>
                            <div className="mb-4">
                    <label
                      className="block text-gray-700 text-sm font-bold mb-2"
                      htmlFor="id">
                      User Id
                    </label>
                    <Field
                      name="id"
                      type="text"
                      className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      readOnly
                    />
                    <ErrorMessage
                      name="id"
                      component="div"
                      className="text-red-500 text-xs italic"
                    />
                  </div>

                            <div className="mb-4">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="name">
                                Name
                              </label>
                              <Field
                                name="name"
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                              <ErrorMessage
                                name="name"
                                component="div"
                                className="text-red-500 text-xs italic"
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="last_name">
                                Last Name
                              </label>
                              <Field
                                name="last_name"
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                              <ErrorMessage
                                name="last_name"
                                component="div"
                                className="text-red-500 text-xs italic"
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="email">
                                Email
                              </label>
                              <Field
                                name="email"
                                type="email"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="text-red-500 text-xs italic"
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="phonenumer">
                                Phone Number
                              </label>
                              <Field
                                name="phonenumer"
                                type="text"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                              <ErrorMessage
                                name="phonenumer"
                                component="div"
                                className="text-red-500 text-xs italic"
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="gender">
                                Gender
                              </label>
                              <Field
                                name="gender"
                                as="select"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                              </Field>
                              <ErrorMessage
                                name="gender"
                                component="div"
                                className="text-red-500 text-xs italic"
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="gender">
                                Role
                              </label>
                              <Field
                                name="role"
                                as="select"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                readOnly
                              >
                                <option value="security">Security</option>
                                <option value="admin">Admin</option>
                              </Field>
                              <ErrorMessage
                                name="gender"
                                component="div"
                                className="text-red-500 text-xs italic"
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="status">
                                Status
                              </label>
                              <Field
                                name="status"
                                as="select"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                              </Field>
                              <ErrorMessage
                                name="status"
                                component="div"
                                className="text-red-500 text-xs italic"
                              />
                            </div>
                            <div className="mb-4">
                              <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="password">
                                Password
                              </label>
                              <Field
                                name="password"
                                type="password"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              />
                              <ErrorMessage
                                name="password"
                                component="div"
                                className="text-red-500 text-xs italic"
                              />
                            </div>
                            
                            <div className="flex items-center justify-center space-x-2">
  <button
    type="submit"
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
    disabled={isSubmitting}>
    Update
  </button>
  <button
    type="button"
    className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-red-500"
    onClick={() => setIsOpen(false)}>
    Cancel
  </button>
</div>

                          </Form>
                        )}
                      </Formik>
                    )}
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}

export default Manage;
