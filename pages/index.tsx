import { GetStaticProps } from "next";
import Image from "next/image";
import Link from 'next/link';
import { parseISO } from "date-fns";
import ptBR from "date-fns/locale/pt-BR";
import { format } from "date-fns";
import convertDurationToTimeString from "../src/utils/convertDurationToTimestring";
import api from "../src/services/api";
import Episode from "../src/models/Episode";

import styles from "./home.module.scss";

type HomeProps = {
  episodes: Episode[];
  latestEpisodes: Episode[];
};

export default function Home({ latestEpisodes, episodes }: HomeProps) {
  const episodeRedirectUrl = (episode : string)=>{
    return `episodes/${episode}`;
  }
  
  return (
    <div className={styles.homepage}>
      <section className={styles.latestEpisodes}>
        <h2>Últimos lançamentos</h2>
        <ul>
          {latestEpisodes.map(ep => {
            return (
              <li key={ep.id}>
                <Image
                  width={192}
                  height={192}
                  objectFit="cover"
                  src={ep.thumbnail}
                  alt={ep.title}
                />
                <div className={styles.episodeDetails}>
                  <Link href={episodeRedirectUrl(ep.id)}>
                    <a>{ep.title}</a>
                  </Link>
                  <p>{ep.members}</p>
                  <span>{ep.publishedAt}</span>
                  <span>{ep.convertedDuration}</span>
                </div>
                <button type="button">
                  <img src="/play-green.svg" alt="Tocar" />
                </button>
              </li>
            );
          })}
        </ul>
      </section>
      <section className={styles.allEpisodes}>
        <h2>Todos os episódios</h2>

        <table cellSpacing={0}>
          <thead>
            <tr>
              <th></th>
              <th>Podcast</th>
              <th>Integrantes</th>
              <th>Data</th>
              <th>Duração</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {episodes.slice(2, episodes.length).map(ep => {
              return (
                <tr key={ep.id}>
                  <td style={{ width: 72 }}>
                    <Image
                      width={120}
                      height={120}
                      src={ep.thumbnail}
                      alt={ep.title}
                      objectFit="cover"
                    />
                  </td>
                  <td>
                    <Link href={episodeRedirectUrl(ep.id)}>
                      <a>{ep.title}</a>
                    </Link>
                  </td>
                  <td>{ep.members} </td>
                  <td style={{ width: 100 }}>{ep.publishedAt} </td>
                  <td>{ep.convertedDuration}</td>
                  <td>
                    <button type="button">
                      <img src="/play-green.svg" alt="Tocar" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const queryParams = {
    _limit: 12,
    _sort: "published_at",
    _order: "desc"
  };
  const episodes = await api.get("/episodes", {
    params: queryParams
  });
  console.log(episodes);
  const formatedEpisodesData = episodes.data.map(ep => {
    return {
      id: ep.id,
      title: ep.title,
      thumbnail: ep.thumbnail,
      members: ep.members,
      publishedAt: format(parseISO(ep.published_at), "d MMM yy", {
        locale: ptBR
      }),
      duration: Number(ep.file.duration),
      convertedDuration: convertDurationToTimeString(Number(ep.file.duration)),
      description: ep.description,
      url: ep.file.url
    };
  });

  return {
    props: {
      episodes: formatedEpisodesData,
      latestEpisodes: formatedEpisodesData.slice(0, 2)
    },
    revalidate: 60 * 60 * 8
  };
};
