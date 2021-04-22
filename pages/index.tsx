import api from '../src/services/api';

export default function Home(props) {
  console.log(props.episodes);
  return (
   <>
   <span>''</span>
   </>
  );
}

export async function getStaticProps() {
   const episodes = await api.get("/episodes");
   console.log(episodes);

   return {
     props: {
       episodes: episodes.data,
     },
     revalidate: 60*60*8,
   }   
}
