import React, { useState } from 'react';
import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';

type FormValues = {
  userId: string;
  firstname: string;
  lastname: string;
  serialnumber: string;
  brand: string;
  address: string;
  phonenumber: string;
  gender: string;
  description: string;
  pcowner: string;
};

const RegisterPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);

  const formik = useFormik<FormValues>({
    initialValues: {
      userId: '',
      firstname: '',
      lastname: '',
      serialnumber: '',
      brand: '',
      address: '',
      phonenumber: '',
      gender: '',
      description: '',
      pcowner: ''
    },
    validationSchema: Yup.object({
      userId: Yup.string().required('User ID is required'),
      firstname: Yup.string().required('First Name is required'),
      lastname: Yup.string().required('Last Name is required'),
      address: Yup.string().required('Address is required'),
      phonenumber: Yup.string().required('Phone number is required'),
      serialnumber: Yup.string().required('Serial Number is required'),
      brand: Yup.string().required('Brand is required'),
      gender: Yup.string().required('Gender is required'),
      description: Yup.string().required('Description is required'),
      pcowner: Yup.string().when('description', {
        is: (value: string) => value === 'Staff',
        then: Yup.string().required('PC Owner is required'),
        otherwise: Yup.string().notRequired(),
      }),
    }),
    onSubmit: async (values) => {
      if (!imageFile) {
        alert('Please upload an image');
        return;
      }

      const formData = new FormData();
      (Object.keys(values) as (keyof FormValues)[]).forEach(key => formData.append(key, values[key]));
      formData.append('image', imageFile);

      try {
        const response = await axios.post('http://10.18.51.50:3333/pcuser/add', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        if (response.status === 201) {
          alert('Registration successful!');
        } else {
          alert('Registration failed!');
        }
      } catch (error) {
        alert(`Unable to connect to the internet: ${error.message}`);
      }
    }
  });

  const onDrop = (acceptedFiles: File[]) => {
    setImageFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-md rounded-md">
      <h1 className="text-2xl font-bold text-center text-blue-600 mb-6">Register User</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <input
            name="userId"
            placeholder="User ID"
            value={formik.values.userId}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.touched.userId && formik.errors.userId ? (
            <div className="text-red-500 text-sm">{formik.errors.userId}</div>
          ) : null}
        </div>
        <div>
          <input
            name="firstname"
            placeholder="First Name"
            value={formik.values.firstname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.touched.firstname && formik.errors.firstname ? (
            <div className="text-red-500 text-sm">{formik.errors.firstname}</div>
          ) : null}
        </div>
        <div>
          <input
            name="lastname"
            placeholder="Last Name"
            value={formik.values.lastname}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.touched.lastname && formik.errors.lastname ? (
            <div className="text-red-500 text-sm">{formik.errors.lastname}</div>
          ) : null}
        </div>
        <div>
          <input
            name="address"
            placeholder="Address"
            value={formik.values.address}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.touched.address && formik.errors.address ? (
            <div className="text-red-500 text-sm">{formik.errors.address}</div>
          ) : null}
        </div>
        <div>
          <input
            name="phonenumber"
            placeholder="Phone Number"
            value={formik.values.phonenumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.touched.phonenumber && formik.errors.phonenumber ? (
            <div className="text-red-500 text-sm">{formik.errors.phonenumber}</div>
          ) : null}
        </div>
        <div>
          <input
            name="serialnumber"
            placeholder="Serial Number"
            value={formik.values.serialnumber}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.touched.serialnumber && formik.errors.serialnumber ? (
            <div className="text-red-500 text-sm">{formik.errors.serialnumber}</div>
          ) : null}
        </div>
        <div>
          <input
            name="brand"
            placeholder="Brand"
            value={formik.values.brand}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.touched.brand && formik.errors.brand ? (
            <div className="text-red-500 text-sm">{formik.errors.brand}</div>
          ) : null}
        </div>
        <div>
          <select
            name="gender"
            value={formik.values.gender}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="" label="Select gender" />
            <option value="Male" label="Male" />
            <option value="Female" label="Female" />
          </select>
          {formik.touched.gender && formik.errors.gender ? (
            <div className="text-red-500 text-sm">{formik.errors.gender}</div>
          ) : null}
        </div>
        <div>
          <input
            name="description"
            placeholder="Description"
            value={formik.values.description}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
          {formik.touched.description && formik.errors.description ? (
            <div className="text-red-500 text-sm">{formik.errors.description}</div>
          ) : null}
        </div>
        {formik.values.description === 'Staff' && (
          <div>
            <input
              name="pcowner"
              placeholder="PC Owner"
              value={formik.values.pcowner}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            {formik.touched.pcowner && formik.errors.pcowner ? (
              <div className="text-red-500 text-sm">{formik.errors.pcowner}</div>
            ) : null}
          </div>
        )}
        <div {...getRootProps()} className="border-dashed border-2 border-gray-300 p-4 text-center cursor-pointer rounded-md">
          <input {...getInputProps()} />
          {imageFile ? (
            <Image src={URL.createObjectURL(imageFile)} alt="Preview" className="mx-auto mb-4 w-24 h-24 object-cover rounded-md" />
          ) : (
            <p className="text-gray-600">Drag & drop an image, or click to select one</p>
          )}
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded-md font-bold hover:bg-blue-700">Register</button>
      </form>
    </div>
  );
};

export default RegisterPage;
