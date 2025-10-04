import { formatDistanceToNow } from 'date-fns';

export const calculateTime = (time: string) => {
  const distance = formatDistanceToNow(new Date(time), { addSuffix: true });

  // Custom mapping to short format
  if (distance.includes('less than a minute')) {
    return distance.replace(' minute', ' min');
  }
  if (distance.includes('minute')) {
    return distance.replace(' minutes', 'm').replace(' minute', ' min');
  }
  if (distance.includes('hour')) {
    return distance.replace(' hours', 'hr').replace(' hour', ' hr');
  }
  if (distance.includes('day')) {
    return distance.replace(' days', 'd').replace(' day', ' d');
  }
  if (distance.includes('month')) {
    return distance.replace(' months', 'mo').replace(' month', ' m');
  }
  if (distance.includes('year')) {
    return distance.replace(' years', 'y').replace(' year', ' y');
  }

  return distance;
};
