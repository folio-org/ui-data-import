import { SYSTEM_USER_NAME } from './constants';

export const formatUserName = userInfo => {
  const {
    firstName = '',
    lastName = '',
    userName = '',
  } = userInfo;

  if (userName === SYSTEM_USER_NAME) {
    return userName;
  }

  const formattedUserName = userName ? `(@${userName})` : userName;

  return `${firstName} ${lastName} ${formattedUserName}`;
};
