// export const setCookie = (name: string, token: string, maxAge?: number) => {
//   let cookie = `${name}=${token}; Path=/; SameSite=Lax`;

//   if (maxAge) cookie += `; Max-Age=${maxAge}`;

//   if (process.env.NODE_ENV === 'production') {
//     cookie += '; Domain=DOMAIN FOR BIZ';
//   }

//   document.cookie = cookie;
// };

// export const getCookie = (name: string) => {
//   const cookies = document.cookie.split(';');
//   for (let i = 0; i < cookies.length; i++) {
//     const cookie = cookies[i].trim();
//     if (cookie.startsWith(name)) {
//       return cookie.split('=')[1];
//     }
//   }
//   return '';
// };

export const deleteCookie = (name: string) => {
  document.cookie = `${name}=; Path=/; SameSite=Lax; Expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};

// export const setAuthCookie = (token: string) => {
//   setCookie('token', token, 900);
// };
