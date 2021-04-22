import { GetStaticProps } from "next";
import api from "../src/services/api";
import Episode from '../src/models/Episode';

type HomeProps = {
  episodes: Episode[];
};

export default function Home(props: HomeProps) {
  return (
    <>
      <span>''</span>
    </>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const queryParams = {
    _limit: 12,
    _sort: 'published_at',
    _order: 'desc',
  };
  const episodes = await api.get('/episodes',{
    params:queryParams,
  });
  console.log(episodes);

  return {
    props: {
      episodes: episodes.data
    },
    revalidate: 60 * 60 * 8
  };
}
