import toast from 'react-hot-toast';

export const notify = (message, type = 'success') => {
  const options = { position: 'top-center', duration: 3000 };
  
  if (type === 'success') toast.success(message, options);
  else if (type === 'error') toast.error(message, options);
  else toast(message, options);
};
