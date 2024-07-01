import axios from "axios";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import * as Yup from "yup";
import Config from "@/config";
import { AppContext } from "@/components/UserContext";
import SuccessMessage from "../validationmessage/success";
import ErrorMessage from "../validationmessage/useralready";
import FailedOperation from "../validationmessage/error";
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
  endYear: Date; // Add endYear to FormValues
};

const RegisterPage = () => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const {token}= useContext(AppContext);
  const [successMessage, setSuccessMessage]=useState(false);
  const [errMessage, setErrorMessage]= useState(false);
  const [err, setError]= useState(false);

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
      if (!imageFile) {
        alert("Please upload an image");
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
      formData.append("image", imageFile);
    
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

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setImageFile(file);
      setSelectedFileName(file.name);
    }
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
                  Select an option
                </option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
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
                className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white                rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
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
          <div className="w-full lg:w-6/12 px-4">
            <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="description"
        >
          Description
        </label>
        <select
          className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
          name="description"
          value={formik.values.description}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        >
          <option value="">Select Description</option>
          <option value="Staff">Staff</option>
          <option value="Student">Student</option>
          <option value="Guest">Guest</option>
        </select>
        {formik.errors.description && formik.touched.description && (
          <small className="text-red-500">
            {formik.errors.description}
          </small>
        )}
      </div>
          </div>
          {formik.values.description === "Staff" && (
             <div className="w-full lg:w-6/12 px-4">
             <div className="relative w-full mb-3">
         <label
           className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
           htmlFor="description"
         >
           Description
         </label>
         <select
           className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none w-full focus:border-2 focus:border-gray-400"
           name="pcowner"
            value={formik.values.pcowner}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
         >
           <option value="">Select Pc owner</option>
           <option value="DBU">Dbu</option>
           <option value="Personal">personal</option>
         </select>
         {formik.errors.pcowner && formik.touched.pcowner && (
            <small className="text-red-500">
              {formik.errors.pcowner}
            </small>
          )}
       </div>
        </div>
      )}
        </div>
  <div className="w-full lg:w-6/12 px-4">
      <div className="relative w-full mb-3">
        <label
          className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
          htmlFor="brand"
        >
          Select End Year
        </label>
        <DatePicker
          className="border border-gray-300 rounded px-3 py-2 w-full"
          selected={formik.values.endYear}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          id="endYear"
        />
        {formik.errors.endYear && formik.touched.endYear && (
          <small className="text-red-500">{formik.errors.endYear && ''}</small>
        )}
      </div>
</div>

        <hr className="mt-6 border-b-1 border-blueGray-300" />
        <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
          Photo
        </h6>
        <div className="flex flex-wrap">
          <div className="w-full lg:w-12/12 px-4">
            <div className="relative w-full mb-3">
              <label
                className="block uppercase text-blueGray-600 text-xs font-bold mb-2"
                htmlFor="photo"
              >
                Upload Image
              </label>
              <div
                {...getRootProps()}
                className="w-full bg-white p-5 flex justify-center items-center border border-gray-400 rounded cursor-pointer"
              >
                <input {...getInputProps()} name="photo" />
                {selectedFileName ? (
                  <span className="text-green-700">{selectedFileName}</span>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m13.35-.622 1.757-1.757a4.5 4.5 0 0 0-6.364-6.364l-4.5 4.5a4.5 4.5 0 0 0 1.242 7.244"
                    />
                  </svg>
                )}
              </div>
            </div>
          </div>
        </div>
        <br />
        <button
          type="submit"
          className="bg-blue-500 border-0 text-white w-full p-3 rounded-md"
        >
          Submit
        </button>

      </form>
      {/* status code 201 */}
     <SuccessMessage success={successMessage} />
     {/*status code 403*/}
     <ErrorMessage error={errMessage} />

     {/*other failed operation or other status code */}
     <FailedOperation failed={err} />
    </div>
  );
};

export default RegisterPage;
