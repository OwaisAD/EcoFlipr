export const formatNumber = (num: number) => {
  return new Intl.NumberFormat("dk-DK").format(num);
};
