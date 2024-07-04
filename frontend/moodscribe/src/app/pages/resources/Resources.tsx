import { FC, useEffect, useState } from 'react';
import {
  RootState,
  useAppDispatch,
  useAppSelector,
} from '../../../redux/store';
import { getArticles, searchArticles } from '../../../redux/articles/features';
import Article from './components/Article';
import { Icon } from '@iconify/react/dist/iconify.js';
import { Modal } from './components/Modal';

const Resources: FC = () => {
  const dispatch = useAppDispatch();
  const [searchValue, setSearchValue] = useState('');
  const [showModal, setShowModal] = useState(false);
  const { articles } = useAppSelector((state: RootState) => state.articles);
  const { articlesSearch, success } = useAppSelector(
    (state: RootState) => state.articlesSearch
  );

  useEffect(() => {
    dispatch(getArticles());
  }, [articlesSearch, dispatch]);

  const handleSearch = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    dispatch(searchArticles(searchValue));
    if (success) {
      setShowModal(true);
    }
  };

  return (
    <>
      <div className='flex justify-end mt-8 mb-8 p-4'>
        <form className='w-full max-w-md mx-1'>
          <label
            htmlFor='default-search'
            className='mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white'
          >
            Search
          </label>
          <div className='relative'>
            <div className='absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none'>
              <Icon icon='material-symbols-light:search' className='w-5 h-5' />
            </div>
            <input
              type='search'
              id='default-search'
              className='block w-full py-3 px-4 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-cyan-400 focus:border-cyan-400 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Search more mental health tips...'
              required
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <button
              type='submit'
              className='text-white absolute end-2.5 bottom-[5px] bg-cyan-600 hover:bg-cyan-800 focus:ring-4 focus:outline-none focus:ring-cyan-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-cyan-600 dark:hover:bg-cyan-800 dark:focus:ring-cyan-800'
              onClick={(e) => handleSearch(e)}
            >
              Search
            </button>
          </div>
        </form>
      </div>
      <div className='container mx-auto max-w-2xl text-white mt-6 mb-10 px-4'>
        <h1 className='font-bold text-2xl text-center'>
          Discover Helpful Articles & Tips
        </h1>
        <p className='py-6'>
          Explore our collection of articles and tips to support your mental
          well-being. Find practical advice, coping strategies, and self-care
          techniques to enhance your mental health. Dive in and empower yourself
          with valuable insights and knowledge.
        </p>
        <div className='sm:grid grid-cols-auto-fit-100 gap-7'>
          {articles.map((article, idx) => (
            <div key={idx} className=''>
              <Article article={article} />
            </div>
          ))}
        </div>
      </div>
      <Modal
        showModal={showModal}
        closeModal={() => {
          setShowModal((prev) => !prev);
        }}
      >
        <div className='sm:grid grid-cols-auto-fit-100 gap-7 text-white'>
          {articlesSearch.map((article, idx) => (
            <div key={idx} className=''>
              <Article article={article} />
            </div>
          ))}
        </div>
      </Modal>
    </>
  );
};

export default Resources;
