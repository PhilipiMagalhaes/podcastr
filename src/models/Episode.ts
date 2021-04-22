interface File {
  url: String;
  type: String;
  duration: Number;
}

export default interface Episode {
  id: String;
  title: String;
  members: String;
  published_at: String;
  thumbnail: String;
  description: String;
  file: File;
};
