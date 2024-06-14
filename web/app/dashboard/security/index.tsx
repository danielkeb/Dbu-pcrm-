import React from 'react';
import { useFormik } from 'formik';
import * as yup from 'yup'; // Import Yup for validation

const validationSchema = yup.object({
  email: yup.string().email('Invalid email address').required('Email is required'),
  password: yup.string().required('Password is required'),
  name: yup.string().required('Name is required'),
  role: yup.string().required('Role is required'),
  status: yup.string().required('Status is required'),
  address: yup.string().required('Address is required'),
  gender: yup.string().required('Gender is required'),
  phonenumber: yup.string().required('Phone Number is required'),
});

const Security = () => {
  const formik = useFormik({
    initialValues: {
      email: '',
      password: '12345678',
      name: '',
      role: '', // Admin or Security
      status: 'active', // Active or Inactive
      address: '',
      gender: '', // Male or Female
      phonenumber: '',
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      try {
        const response = await fetch('http://localhost:3333/auth/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(values),
        });
        const data = await response.json();
        console.log('Form submitted:', data);
        // Reset form values or handle success state
      } catch (error) {
        console.error('Error submitting form:', error);
        // Handle error state or feedback to user
      }
    },
  });

  return (
    <div className="flex-auto px-4 lg:px-10 py-10 pt-0 align-middle">
      <form onSubmit={formik.handleSubmit}>
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          User Information
        </h6>
        <div className="flex flex-wrap">
          {/* Email */}
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.email && formik.touched.email && (
                <small className="text-red-500">{formik.errors.email}</small>
              )}
            </div>
          </div>
          {/* Password */}
          {/* <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Password"
                name="password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.password && formik.touched.password && (
                <small className="text-red-500">{formik.errors.password}</small>
              )}
            </div>
          </div> */}
          {/* Name */}
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.name && formik.touched.name && (
                <small className="text-red-500">{formik.errors.name}</small>
              )}
            </div>
          </div>
          {/* Role (Dropdown) */}
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="role">
                Role
              </label>
              <select
                name="role"
                value={formik.values.role}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
              >
                <option value="" disabled>Select Role</option>
                <option value="admin">Admin</option>
                <option value="security">Security</option>
              </select>
              {formik.errors.role && formik.touched.role && (
                <small className="text-red-500">{formik.errors.role}</small>
              )}
            </div>
          </div>
          {/* Status (Dropdown) */}
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="status">
                Status
              </label>
              <select
                name="status"
                value={formik.values.status}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              {formik.errors.status && formik.touched.status && (
                <small className="text-red-500">{formik.errors.status}</small>
              )}
            </div>
          </div>
          {/* Address */}
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="address">
                Address
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Address"
                name="address"
                value={formik.values.address}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.address && formik.touched.address && (
                <small className="text-red-500">{formik.errors.address}</small>
              )}
            </div>
          </div>
          {/* Gender */}
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="gender">
                Gender
              </label>
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
              >
                <option value="" disabled>Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              {formik.errors.gender && formik.touched.gender && (
                <small className="text-red-500">{formik.errors.gender}</small>
              )}
            </div>
          </div>
          {/* Phone Number */}
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="phonenumber">
                Phone Number
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Phone Number"
                name="phonenumber"
                value={formik.values.phonenumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.phonenumber && formik.touched.phonenumber}
                  {/* Submit Button */}
                  </div>
                  </div>
            <div className="w-full px-4">
            <button
                type="submit"
                className="bg-green-600 border-0 text-white w-full p-3 rounded-md"
            >
                Submit
            </button>
            </div>
            </div>
        </form>
        </div>
    );
};
export default Security;