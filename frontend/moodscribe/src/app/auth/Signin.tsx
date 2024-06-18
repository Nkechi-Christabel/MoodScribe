import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import logo from '../../assets/logo-transparent.png';
import { Link } from 'react-router-dom';
import { SigninValues } from '../../utils/types';
import InputField from '../../components/CustomInputField';

const validationSchema = Yup.object().shape({
  fullName: Yup.string()
    .required('Enter your name')
    .min(3, 'Should contain minimum of 3 characters'),
  password: Yup.string()
    .required('Enter your password')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%?&])[A-Za-z\d@$!%?&]{8,}$/,
      'Password should contain 8 or more characters, at least a symbol, number, uppercase & lower case letters'
    ),
});

const Signin = () => {
  const [showPassword, setShowPassword] = useState(false);

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  const {
    control,
    register,
    reset,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  const onSubmit: SubmitHandler<SigninValues> = (data: SigninValues, e) => {
    e?.preventDefault();
    // dispatch(signinUser(data));
    reset();
  };
  return (
    <div className='fixed right-0 left-0 h-screen bg-bg-100 bg-opacity-60 p-3'>
      <Link to='/'>
        <img className='mt-4 mb-12' src={logo} alt='Moodscribe logo' />
      </Link>

      <div className='container mx-auto max-w-lg max-h-[640px] bg-bg-800 sm:p-14 p-10 m-6 shadow-xl shadow-stone-500 overflow-y-scroll'>
        <h1 className='text-gray-400 text-lg text-center mb-14'>
          Existing ACCOUNT
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
          <InputField
            label='FULL NAME'
            type={'text'}
            control={control}
            registration={{ ...register('fullName') }}
            placeholder='Enter your full name'
            errorMessage={errors.fullName?.message}
            isRequired
            className='bg-transparent border-0 border-b rounded-none mt-2'
          />
          <InputField
            registration={{ ...register('password') }}
            type={showPassword ? 'text' : 'password'}
            control={control}
            label='PASSWORD'
            placeholder='Enter your password'
            valid={getValues('password') && !errors.password ? 'success' : ''}
            errorMessage={errors.password?.message}
            isRequired
            handleShowPassword={handleShowPassword}
            className='bg-transparent border-0 border-b rounded-none mt-2'
          />
          <button
            type='submit'
            className='py-3 mb-5 mt-12 text-[#64eafa] font-semibold bg-slate-300 bg-opacity-50 hover:bg-cyan-500 hover:text-white w-full border rounded-3xl'
          >
            LOGIN
          </button>
        </form>
        <p className='text-gray-400 mt-2'>
          Don't have an account? {'  '}
          <Link
            to='/auth/signup'
            className='text-[#64eafa] hover:text-cyan-400 text-lg italic'
          >
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signin;
