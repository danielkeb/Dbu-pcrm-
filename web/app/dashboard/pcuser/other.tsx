import axios from "axios";
import { useFormik } from "formik";
import { useCallback, useContext, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from "yup";
import Config from "@/config";
import { AppContext } from "@/components/UserContext";
import Webcam from 'react-webcam';
import React from "react";

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
  endYear: Date;
};

const RegisterPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const { token } = useContext(AppContext);
  const [successMessage, setSuccessMessage] = useState(false);
  const [errMessage, setErrorMessage] = useState(false);
  const [err, setError] = useState(false);
  const [capturing, setCapturing] = useState(false);
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const webcamRef = useRef<Webcam>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      setSelectedFileName(file.name);
      setImageSrc(null); // Clear captured image if a new file is uploaded
    }
  }, []);

  const handleCapture = useCallback(() => {
    setCapturing(true);
  }, []);

  const handleCaptureStop = useCallback(() => {
    if (webcamRef.current) {
      const capturedImageSrc = webcamRef.current.getScreenshot();
      if (capturedImageSrc) {
        setImageSrc(capturedImageSrc);
        setImageFile(null); // Clear uploaded file if a new image is captured
        setSelectedFileName(null); // Clear file name if a new image is captured
      }
    }
    setCapturing(false);
  }, []);

  const dataURLtoBlob = (dataurl: string) => {
    const arr = dataurl.split(',');
    const mime = arr[0]?.match(/:(.*?);/)?.[1]; // Added null check with '?'
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
  };

  const formik = useFormik<FormValues>({
    initialValues: {
      userId: "",
      firstname: "",
      lastname: "",
      serialnumber: "",
      brand: "",
      address: "",
      phonenumber: "",
      gender: "",
      description: "",
      pcowner: "",
      endYear: new Date(), // Initialize endYear with current date
    },
    validationSchema: Yup.object({
      userId: Yup.string().required("User ID is required"),
      firstname: Yup.string().required("First Name is required"),
      lastname: Yup.string().required("Last Name is required"),
      address: Yup.string().required("Address is required"),
      phonenumber: Yup.string().required("Phone number is required"),
      serialnumber: Yup.string().required("Serial Number is required"),
      brand: Yup.string().required("Brand is required"),
      gender: Yup.string().required("Gender is required"),
      description: Yup.string().required("Description is required"),
      pcowner: Yup.string(),
      endYear: Yup.date().required("End Year is required"), // Add validation for endYear
    }),
    onSubmit: async (values) => {
      if (!imageFile && !imageSrc) {
        alert("Please upload or capture an image");
        return;
      }

      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        const formKey = key as keyof FormValues; // Type assertion to keyof FormValues
        if (formKey === 'endYear') {
          formData.append(formKey, values[formKey].toISOString()); // Convert endYear to ISO string
        } else {
          formData.append(formKey, values[formKey] as string);
        }
      });

      if (imageFile) {
        formData.append("image", imageFile);
      } else if (imageSrc) {
        const imageBlob = dataURLtoBlob(imageSrc);
        formData.append("image", imageBlob, "captured-image.jpg");
      }

      try {
        const response = await axios.post(
          `${Config.ROOT_URL}/pcuser/add`,
          formData,
          {
          headers: {
              "Content-Type": "multipart/form-data",
              "Authorization": `Bearer ${token}`,
            },
          }
        );
        if (response.status === 201) {
          setSuccessMessage(true);
          setTimeout(() => setSuccessMessage(false), 1000);
        } else {
          setError(true);
          setTimeout(() => setError(false), 1000);
        }
      } catch (error: any) {
        setErrorMessage(true);
        setTimeout(() => setErrorMessage(false), 1000);
      }
    },
  });

  const handleDateChange = (date: Date | null) => {
    formik.setFieldValue('endYear', date); // Update formik state for endYear
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  return (
    <div className="flex-auto px-4 lg:px-10 py-10 pt-0 align-middle">
      <form onSubmit={formik.handleSubmit}>
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Student Information
        </h6>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="userId"
              >
                User ID
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="User ID"
                name="userId"
                value={formik.values.userId}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.userId && formik.touched.userId && (
                <small className="text-red-500">{formik.errors.userId}</small>
              )}
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="firstname"
              >
                First Name
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="First Name"
                name="firstname"
                value={formik.values.firstname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.firstname && formik.touched.firstname && (
                <small className="text-red-500">
                  {formik.errors.firstname}
                </small>
              )}
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="lastname"
              >
                Last Name
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Last Name"
                name="lastname"
                value={formik.values.lastname}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.lastname && formik.touched.lastname && (
                <small className="text-red-500">{formik.errors.lastname}</small>
              )}
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="gender"
              >
                Gender
              </label>
              <select
                name="gender"
                value={formik.values.gender}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
              >
                <option value="" disabled>
                  Select Gender
                </option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              {formik.errors.gender && formik.touched.gender && (
                <small className="text-red-500">{formik.errors.gender}</small>
              )}
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="endYear"
              >
                End Year
              </label>
              <DatePicker
                selected={formik.values.endYear}
                onChange={handleDateChange}
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholderText="Select End Year"
                dateFormat="yyyy-MM-dd" // Specify the date format for display
                showYearPicker // Display only the year picker
                yearItemNumber={9} // Number of years to show in the year dropdown
              />
              {/* {formik.errors.endYear && formik.touched.endYear && (
                <small className="text-red-500">{formik.errors.endYear}</small>
              )} */}
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="address"
              >
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
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="phonenumber"
              >
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
              {formik.errors.phonenumber && formik.touched.phonenumber && (
                <small className="text-red-500">
                  {formik.errors.phonenumber}
                </small>
              )}
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="serialnumber"
              >
                Serial Number
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Serial Number"
                name="serialnumber"
                value={formik.values.serialnumber}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.serialnumber && formik.touched.serialnumber && (
                <small className="text-red-500">
                  {formik.errors.serialnumber}
                </small>
              )}
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="brand"
              >
                Brand
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Brand"
                name="brand"
                value={formik.values.brand}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.brand && formik.touched.brand && (
                <small className="text-red-500">{formik.errors.brand}</small>
              )}
            </div>
          </div>
          <div className="w-full lg:w-12/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <textarea
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="Description"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.description && formik.touched.description && (
                <small className="text-red-500">
                  {formik.errors.description}
                </small>
              )}
            </div>
          </div>
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="pcowner"
              >
                PC Owner
              </label>
              <input
                type="text"
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
                placeholder="PC Owner"
                name="pcowner"
                value={formik.values.pcowner}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
              />
              {formik.errors.pcowner && formik.touched.pcowner && (
                <small className="text-red-500">{formik.errors.pcowner}</small>
              )}
            </div>
          </div>
        </div>
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Student Picture
        </h6>
        <div className="w-full mb-3">
          <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
            Upload Picture
          </label>
          <div {...getRootProps({ className: "dropzone" })}>
            <input {...getInputProps()} />
            <p className="text-blueGray-500 text-center cursor-pointer">
              Drag 'n' drop a picture here, or click to select one
            </p>
          </div>
          {selectedFileName && (
            <p className="text-green-500 text-center">{selectedFileName}</p>
          )}
        </div>
        <div className="w-full mb-3">
          <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
            Or Capture Picture
          </label>
          {capturing ? (
            <>
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                width="100%"
              />
              <button
                type="button"
                className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
                onClick={handleCaptureStop}
              >
                Capture
              </button>
            </>
          ) : (
            <button
              type="button"
              className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
              onClick={handleCapture}
            >
              Start Capture
            </button>
          )}
          {imageSrc && (
            <div className="mt-3">
              <img
                src={imageSrc}
                alt="Captured"
                className="w-full h-auto rounded-md shadow-md"
              />
            </div>
          )}
        </div>
        <div className="text-center mt-6">
          <button
            className="bg-blue-500 text-white active:bg-blue-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150"
            type="submit"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegisterPage;
