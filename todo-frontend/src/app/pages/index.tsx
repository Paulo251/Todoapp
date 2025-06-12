import type { NextPage } from 'next';
import Head from 'next/head';
import TaskList from '../../components/TaskList';

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>Todo App</title>
        <meta name="description" content="Todo app with Next.js and Rails" />
      </Head>

      <main>
        <TaskList />
      </main>
    </div>
  );
};

export default Home;