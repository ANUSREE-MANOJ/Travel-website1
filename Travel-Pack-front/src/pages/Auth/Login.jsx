import React, { useEffect } from "react";
import { useLoginMutation } from "../../redux/api/userSlice";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router";
import Loader from "../../components/Loader";
import { Link } from "react-router-dom";
import { setCredentials } from "../../redux/features/auth/authSlice";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

// Validation schema using Yup
const validationSchema = Yup.object({
  email: Yup.string().email('Invalid email address').required('Email is required'),
  password: Yup.string().required('Password is required')
});

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const redirect = sp.get("redirect") || "/";

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  const submitHandler = async (values) => {
    try {
      const res = await login(values).unwrap();
      toast.success('Signed in successfully');
      dispatch(setCredentials({...res}));
    } catch (error) {
      toast.error(error?.data?.message || error.message);
    }
  };

  return (
    <div className="h-screen w-full bg-blue-200 flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row sm:mt-10 w-full max-w-4xl mx-auto">
        {/* Image Section */}
        <section className="md:w-1/2 relative flex items-center justify-center overflow-hidden">
          <img src="../../Banner.jpg" alt="Login" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-black opacity-20"></div>
          <h1 className="absolute text-white text-center text-2xl font-semibold md:text-2xl lg:text-3xl bottom-4 md:bottom-64 sm:bottom-40 xs:bottom-32 lg:bottom-64 w-full px-4">Start your journey <br /> Explore!</h1>
        </section>

        {/* Login Form Section */}
        <section className="md:w-1/2 bg-white p-6 md:p-8 flex flex-col items-center justify-center">
          <h1 className="text-2xl md:text-4xl font-semibold mb-2 text-center text-blue-400">Welcome</h1>
          <p className="text-xs text-gray-500 text-center mb-4">Login with email</p>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={submitHandler}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-4 w-full max-w-md mx-auto">
                <div>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className="mt-1 p-2 border rounded w-1/2 ml-20"
                    placeholder="Email"
                  />
                  <ErrorMessage name="email" component="p" className="text-red-500 text-sm mt-1 ml-20" />
                </div>

                <div>
                  <Field
                    type="password"
                    id="password"
                    name="password"
                    className="mt-1 p-2 border rounded w-1/2 ml-20"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" component="p" className="text-red-500 text-sm mt-1 ml-20" />
                </div>

                <div className="flex items-center justify-center">
                  <button
                    type="submit"
                    disabled={isSubmitting || isLoading}
                    className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer my-4"
                  >
                    {isLoading ? "Signing In..." : "Sign In"}
                  </button>
                </div>

                {isLoading && <Loader />}
              </Form>
            )}
          </Formik>

          <div className="mt-2 text-center">
            <p className="text-black">
              New Customer?{" "}
              <Link to={redirect ? `/register?redirect=${redirect}` : '/register'} className="text-blue-500 hover:underline">
                Register
              </Link>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Login;
