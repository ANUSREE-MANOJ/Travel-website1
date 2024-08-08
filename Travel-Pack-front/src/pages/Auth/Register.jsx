import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";
import { useRegisterMutation } from "../../redux/api/userSlice";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

// Enhanced validation schema
const validationSchema = Yup.object({
  username: Yup.string()
    .required("Name is required")
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name must not exceed 50 characters"),
  email: Yup.string()
    .email("Invalid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/[A-Z]/, "Password must contain at least one uppercase letter")
    .matches(/[a-z]/, "Password must contain at least one lowercase letter")
    .matches(/[0-9]/, "Password must contain at least one number")
    .matches(/[@$!%*?&#]/, "Password must contain at least one special character"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], "Passwords must match")
    .required("Confirm password is required"),
});

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [register, { isLoading }] = useRegisterMutation();
  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (values, { setSubmitting }) => {
    const { username, email, password, confirmPassword } = values;

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await register({ 
          username, 
          email, 
          password 
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        navigate(redirect);
        toast.success("User successfully registered");
      } catch (err) {
        console.log(err);
        toast.error(err.data.message);
      }
    }
    setSubmitting(false);
  };

  return (
    <div className="relative w-full h-screen bg-cover bg-center " style={{ backgroundImage: 'url("../../Register3.jpeg")' }}>
      <div className="absolute inset-0 flex justify-center items-center p-4 sm:p-8 md:p-12 lg:p-16">
        <div className="relative bg-opacity-20 bg-blue-500 mt-10 rounded-lg p-6 sm:p-8 md:p-10 lg:p-12 shadow-lg w-full max-w-md lg:max-w-lg">
          <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-4 text-white text-center">Register</h1>
          <Formik
            initialValues={{ username: "", email: "", password: "", confirmPassword: "" }}
            validationSchema={validationSchema}
            onSubmit={submitHandler}
          >
            {({ isSubmitting }) => (
              <Form>
                <div className="my-4">
                  <Field
                    type="text"
                    id="username"
                    name="username"
                    className="mt-1 p-2 border rounded w-full bg-transparent text-white placeholder-white"
                    placeholder="Enter name"
                  />
                  <ErrorMessage name="username" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="my-4">
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 p-2 border rounded w-full bg-transparent text-white placeholder-white"
                    placeholder="Enter email"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="my-4">
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="mt-1 p-2 border rounded w-full bg-transparent text-white placeholder-white"
                    placeholder="Enter password"
                  />
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="my-4">
                  <Field
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    className="mt-1 p-2 border rounded w-full bg-transparent text-white placeholder-white"
                    placeholder="Confirm password"
                  />
                  <ErrorMessage name="confirmPassword" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <button
                  disabled={isSubmitting || isLoading}
                  type="submit"
                  className="bg-cyan-800 text-white px-4 py-2 rounded cursor-pointer my-4 w-full"
                >
                  {isLoading ? "Registering..." : "Register"}
                </button>

                {isLoading && <Loader />}
              </Form>
            )}
          </Formik>

          <div className="mt-4 text-center">
            <p>
              Already have an account?{" "}
              <Link
                to={redirect ? `/login?redirect=${redirect}` : "/login"}
                className="text-white hover:underline"
              >
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
