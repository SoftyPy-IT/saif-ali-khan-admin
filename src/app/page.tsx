/* eslint-disable @typescript-eslint/no-explicit-any */
'use client'
import apiClient from '@/axios/axiosInstant';
import Cookies from 'js-cookie';
import { useState } from 'react';

const LoginForm = () => {
  const [errorMessage, setErrorMessage] = useState('');

  const handleLogin = async (e: { preventDefault: () => void; target: any; }) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    console.log(email, password);

    try {
      const result = await apiClient.post('/auth/login', { email, password });
      console.log(result);
      Cookies.set('accessToken', result.data.data.accessToken, { expires: 1 });
      window.location.href = '/dashboard'; // Redirect after login
      setErrorMessage('');
      form.clear();
      console.log(result.data);
      window.location.href = '/';
    } catch (error: any) {
      if (error.response) {
        setErrorMessage(error.response.data.message || 'Login Failed');
        console.error('Error response:', error.response.data);
      } else if (error.request) {
        // setErrorMessage('No response received from server');
        console.error('Error request:', error.request);
      } else {
        // setErrorMessage('Error: ' + error.message);
        console.error('Error message:', error.message);
      }
    }
  }
  return (
    <div className='flex justify-center item-center bg-black min-h-screen bg-center bg-no-repeat bg-cover'>
      <section
        className="py-6 h-[260px] w-[300px] md:w-[350px] bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg text-white mt-32 2xl:mt-44">

        <form onSubmit={handleLogin} className="flex flex-col py-6 space-y-6 md:py-0 md:px-6">

          <label className="block">
            <span className="mb-2">Email address</span>
            <input name='email' type="email" placeholder="Email" className="block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-75 focus:dark:ring-violet-600  pl-3 py-1 bg-white text-gray-600" />
          </label>
          <label className="block">
            <span className="mb-2">Password</span>
            <input name='password' type="password" placeholder="Password" className="block w-full rounded-md shadow-sm focus:ring focus:ring-opacity-75 focus:dark:ring-violet-600  pl-3 py-1 bg-white text-gray-600" />
          </label>

          <input type="submit" value="Login" className=" bg-[#3D93C1] py-2 rounded-md" />
        </form>
        {errorMessage && (
          <div className="mt-4 text-red-500 text-center">
            <strong>{errorMessage}</strong>
          </div>
        )}
      </section>
    </div>
  );
};

export default LoginForm;