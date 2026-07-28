import Toast from 'react-native-toast-message';

export const showSuccess = (message) => {
  Toast.show({
    type: 'success',
    text1: 'Éxito',
    text2: message,
    position: 'top',
    visibilityTime: 4000,
  });
};

export const showError = (message) => {
  Toast.show({
    type: 'error',
    text1: 'Error',
    text2: message,
    position: 'top',
    visibilityTime: 4000,
  });
};

export const showInfo = (message) => {
  Toast.show({
    type: 'info',
    text1: 'Información',
    text2: message,
    position: 'top',
    visibilityTime: 4000,
  });
};