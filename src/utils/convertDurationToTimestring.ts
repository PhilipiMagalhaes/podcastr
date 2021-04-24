export default function convertDurationToTimeString(duration: number){
  // 1 hour = 3600 minutes
  const hours = Math.floor(duration/ (3600));
  const minutes = Math.floor((duration % 3600)/60);
  const seconds = duration % 60;

  const convertedDuration = [hours, minutes, seconds]
  .map(unit => String(unit).padStart(2, '0'))
  .join(':');
  
  return convertedDuration;
}