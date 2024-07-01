/* eslint-disable @typescript-eslint/no-unused-vars */
import { FC } from 'react';
import { useForm, SubmitHandler, Control } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import CustomInputField from '../../../../components/CustomInputField';
import { TextAreaField } from '../../../../components/TextAreaField';
import { InputDateField } from '../../../../components/CustomDateField';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useEffect, useState } from 'react';
import { JournalItem, MoodEmojis } from '../../../../utils/types';
import clsx from 'clsx';
import {
  addJournal,
  clearJournalState,
} from '../../../../redux/journals/features';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../../redux/store';

const validationSchema = Yup.object({
  title: Yup.string()
    .required('A title is required')
    .min(3, 'Should contain minimum of 8 characters')
    .max(100, 'Should contain maximum of 100 characters'),
  content: Yup.string().required("Content can't be blank"),
  date: Yup.date().required('Date is required'),
  mood: Yup.mixed<MoodEmojis>().required('Mood is required'),
});

const mood: MoodEmojis[] = [
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

const NewEntry: FC = () => {
  const dispatch = useAppDispatch();
  const [selectedMood, setSelectedMood] = useState<MoodEmojis | null>(null);
  const { success, loading } = useAppSelector(
    (state: RootState) => state.journal
  );
  const [showMessage, setShowMessage] = useState(false);

  useEffect(() => {
    // Show the message
    success && setShowMessage(true);

    // Hide the message after 2 seconds
    const timer = setTimeout(() => {
      setShowMessage(false);
    }, 3000);

    // Cleanup the timer on component unmount
    return () => clearTimeout(timer);
  }, [success]);

  useEffect(() => {
    return () => {
      dispatch(clearJournalState());
    };
  }, [dispatch]);

  const {
    control,
    register,
    reset,
    watch,
    setValue,
    clearErrors,
    handleSubmit,
    formState: { errors },
  } = useForm<JournalItem>({
    resolver: yupResolver(validationSchema),
    mode: 'onBlur',
  });

  useEffect(() => {
    setValue('mood', selectedMood as MoodEmojis);
    selectedMood && clearErrors('mood');
  }, [selectedMood, setValue, clearErrors]);

  const content = watch('content');
  const onSubmit: SubmitHandler<JournalItem> = (data: JournalItem, e) => {
    e?.preventDefault();
    dispatch(addJournal(data));
    setSelectedMood(null);
    reset();
  };

  const handleMoodClick = (mood: MoodEmojis) => {
    setSelectedMood(mood);
  };

  const handleSave = () => {
    if (success) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
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
            excludeScrollbar={undefined}
          />
        </div>

        <div className='flex justify-between items-center flex-wrap bg-slate-700 bg-opacity-40 pl-4 py-4 mt-6'>
          {mood.map((emoji, idx) => (
            <button
              type='button'
              key={idx}
              className={clsx(
                'flex flex-col items-center space-y-2 my-3 mr-4 hover:scale-125 transition-all duration-700 ease-in-out',
                selectedMood === emoji ? 'shadow-xl shadow-[#facc4c]' : ''
              )}
              onClick={() => handleMoodClick(emoji)}
            >
              <Icon
                icon={emoji.icon}
                style={{ color: emoji.name === 'Angry' ? 'red' : '#facc4c' }}
                className='w-9 h-9'
              />
              <span className='text-sm'>{emoji.name}</span>
            </button>
          ))}
        </div>

        {errors.mood?.message && (
          <p className='mt-1 text-sm text-red-500'>{errors.mood?.message}</p>
        )}

        <CustomInputField
          label='Title'
          labelClass='text-white text-xl mt-6'
          type={'text'}
          control={control}
          registration={{ ...register('title') }}
          errorMessage={errors.title?.message}
          isRequired
          className='bg-slate-700 bg-opacity-40  py-3 px-2 mt-1 text-white'
        />
        <TextAreaField
          id='message'
          placeholder='Say more about the day, how you feel.'
          value={content}
          registration={{ ...register('content') }}
          errorMessage={errors.content?.message}
          hasError={errors.content}
          isRequired
          className='bg-slate-700 bg-opacity-40  px-2 mt-4 placeholder-gray-150'
        />
        <div className='relative'>
          <button
            type='submit'
            className={clsx(
              'py-3 px-20 mb-5 mt-8 text-teal-100 font-semibold bg-slate-300 bg-opacity-50 hover:bg-cyan-500 hover:text-white border rounded-3xl',
              loading ? 'cursor-progress' : ''
            )}
            onClick={handleSave}
          >
            SAVE
          </button>
          <p
            className={clsx(
              'absolute top-3 left-52 z-50 ml-9 py-2 px-16 rounded-lg bg-transparent shadow-md shadow-teal-400 transition-all duration-500 ease-in-out',
              showMessage ? 'opacity-100' : 'opacity-0'
            )}
          >
            New entry saved
          </p>
        </div>
      </form>
    </div>
  );
};

export default NewEntry;
