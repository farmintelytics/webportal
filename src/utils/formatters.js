export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
  }).format(amount);
};

export const formatNumber = (num) => {
  return new Intl.NumberFormat().format(num);
};

export const formatWeight = (kg) => {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(2)} t`;
  }
  return `${kg} kg`;
};
