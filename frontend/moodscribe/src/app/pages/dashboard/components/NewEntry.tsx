import { useForm, SubmitHandler, Control } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInputField from '../../../../components/CustomInputField';
import { TextAreaField } from '../../../../components/TextAreaField';
import { InputDateField } from '../../../../components/CustomDateField';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useState } from 'react';
import { Mood, MoodSmileys } from '../../../../utils/types';
import clsx from 'clsx';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('A title is required')
    .min(3, 'Should contain minimum of 8 characters')
    .max(100, 'Should contain maximum of 100 characters'),
  content: Yup.string().required("Content can't be blank"),
  date: Yup.date().required('Date is required'),
  moodSmiley: Yup.mixed<MoodSmileys>().required('Mood is required'),
});

const moodSmileys: MoodSmileys[] = [
  {
    icon: 'icomoon-free:happy2',
    name: 'Happy',
    value: 7,
  },
  { icon: 'fluent-mdl2:sad-solid', name: 'Sad', value: 1 },
  { icon: 'fa-solid:angry', name: 'Angry', value: 2 },
  { icon: 'emojione-v1:anxious-face-with-sweat', name: 'Anxious', value: 3 },
  { icon: 'twemoji:neutral-face', name: 'Neutral', value: 5 },
  { icon: 'emojione-v1:confused-face', name: 'Confused', value: 4 },
  { icon: 'icomoon-free:shocked2', name: 'Shocked', value: 6 },
];

const NewEntry = () => {
  const [selectedMood, setSelectedMood] = useState<MoodSmileys | null>(null);

  const {
    control,
    register,
    reset,
    watch,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<Mood>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    setValue('moodSmiley', selectedMood as MoodSmileys);
    selectedMood && clearErrors('moodSmiley');
  }, [selectedMood, setValue, clearErrors]);

  const content = watch('content');
  const onSubmit: SubmitHandler<Mood> = (data: Mood, e) => {
    e?.preventDefault();
    // dispatch(signupUser(data));
    console.log(data);
    reset();
  };

  const handleMoodClick = (mood: MoodSmileys) => {
    setSelectedMood(mood);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className='w-full'>
        <div className='sm:flex justify-between items-center mt-4'>
          <p className='flex-1'>How are you feeling this day?</p>
          <InputDateField
            name='date'
            placeholder='Select a date'
            control={control as unknown as Control}
            hasError={errors.date}
            errorMessage={errors.date?.message}
            isRequired
          />
        </div>

        <div className='flex justify-between items-center flex-wrap bg-slate-700 bg-opacity-40 pl-4 py-4 mt-6'>
          {moodSmileys.map((smiley, idx) => (
            <button
              type='button'
              key={idx}
              className={clsx(
                'flex flex-col items-center space-y-2 my-3 mr-4 transition-all duration-700 ease-in-out',
                selectedMood === smiley ? 'shadow-xl shadow-[#facc4c]' : ''
              )}
              onClick={() => handleMoodClick(smiley)}
            >
              <Icon
                icon={smiley.icon}
                style={{ color: smiley.name === 'Angry' ? 'red' : '#facc4c' }}
                className='w-9 h-9'
              />
              <span className='text-sm'>{smiley.name}</span>
            </button>
          ))}
        </div>

        {errors.moodSmiley?.message && (
          <p className='mt-1 text-sm text-red-500'>
            {errors.moodSmiley?.message}
          </p>
        )}

        <CustomInputField
          label='Title'
          labelClass='text-white text-xl mt-6'
          type={'text'}
          control={control}
          registration={{ ...register('title') }}
          placeholder='Enter your full name'
          errorMessage={errors.title?.message}
          isRequired
          className='bg-slate-700 bg-opacity-40 py-3 px-2 mt-1'
        />
        <TextAreaField
          id='message'
          placeholder='Say more about the day, how you felt or feel.'
          value={content}
          registration={{ ...register('content') }}
          errorMessage={errors.content?.message}
          hasError={errors.content}
          isRequired
          className='bg-slate-700 bg-opacity-40 px-2 mt-4 placeholder-gray-150'
        />

        <button
          type='submit'
          className='py-3 px-20 mb-5 mt-8 text-teal-100 font-semibold bg-slate-300 bg-opacity-50 hover:bg-cyan-500 hover:text-white border rounded-3xl'
        >
          SAVE
        </button>
      </form>
    </div>
  );
};

export default NewEntry;
