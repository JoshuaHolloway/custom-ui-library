import Head from 'next/head';

import Card from '../components/card/card';

import css from '../styles/Home.module.scss';

export default function Home() {
  return (
    <div className={css.div} style={{ height: '200vh' }}>
      Home Page
      <Card />
    </div>
  );
}
