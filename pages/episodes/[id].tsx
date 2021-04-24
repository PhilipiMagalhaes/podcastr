import { parseISO } from 'date-fns';
import format from 'date-fns/format';
import ptBR from 'date-fns/locale/pt-BR';
import { GetStaticProps, GetStaticPaths } from 'next';
import Image from 'next/image';
import {useRouter} from 'next/router';
import Episode from '../../src/models/Episode';
import api from '../../src/services/api';
import convertDurationToTimeString from '../../src/utils/convertDurationToTimestring';

import styles from './SelectedEpisode.module.scss';

type EpisodeProps = {
  episode: Episode
}
export default function SelectedEpisode({episode} : EpisodeProps){
  const router = useRouter();
  console.log(episode);

  return (
    <div className={styles.episode}>
      <div className={styles.thumbnailContainer}>
        <button>
          <img src="/arrow-left.svg" alt="voltar" />
        </button>
        <Image
          width={700}
          height={160}
          src={episode.thumbnail}
          objectFit="cover"
        />
        <button type="button">
          <img src="/play.svg" alt="Tocar episódio" />
        </button>
      </div>
      <header>
        <h1>{episode.title}</h1>
        <span>{episode.members}</span>
        <span>{episode.publishedAt}</span>
        <span>{episode.convertedDuration}</span>
      </header>

      <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}}/>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
}
export const getStaticProps: GetStaticProps = async (ctx) => {
  const {id} = ctx.params;

  const episode = await (await api.get(`/episodes/${id}`)).data;
   const formatedEp =  {
     id: episode.id,
     title: episode.title,
     thumbnail: episode.thumbnail,
     members: episode.members,
     publishedAt: format(parseISO(episode.published_at), "d MMM yy", {
       locale: ptBR
     }),
     duration: Number(episode.file.duration),
     convertedDuration: convertDurationToTimeString(Number(episode.file.duration)),
     description: episode.description,
     url: episode.file.url
   };

  return {
    props:{
      episode:formatedEp,
    },
    revalidate: 60 * 60 * 24,
  }
}