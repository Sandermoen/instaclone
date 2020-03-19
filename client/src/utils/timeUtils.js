import formatDistanceStrict from 'date-fns/formatDistanceStrict';

export const formatDate = endDate => {
  const format = formatDistanceStrict(new Date(), new Date(endDate));
  const duration = format.split(' ');
  duration[1] = duration[1].substring(0, 1);
  if (duration[0] === '0') {
    return 'Just now';
  }
  return duration.join('');
};
