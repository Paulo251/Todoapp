import type { NextPage } from 'next';
import Head from 'next/head';
import TaskList from '../../components/TaskList';

const Home: NextPage = () => {
  return (
    <div>
      <main>
        <TaskList />
      </main>
    </div>
  );
};

export default Home;