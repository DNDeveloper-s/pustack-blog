// import { useRouter, usePathname, useSearchParams } from 'next/navigation';
// import { useEffect, useRef } from 'react';

// const useRouteGuard = () => {
//   const router = useRouter();
//   const pathname = usePathname();
//   const searchParams = useSearchParams();
//   const isGuardActive = useRef(true);
//   const previousPathname = useRef(pathname);

//   useEffect(() => {
//     const handleRouteChange = (url: string) => {
//         console.log('url - ', url);
//       if (isGuardActive.current && !window.confirm('Are you sure you want to leave?')) {
//         router.replace(previousPathname.current);
//         throw 'Route change aborted by the user';
//       } else {
//         previousPathname.current = url;
//       }
//     };

//     handleRouteChange(pathname + searchParams.toString());

//     const cleanup = () => {
//       // Any cleanup logic if needed
//     };

//     return cleanup;
//   }, [pathname, searchParams]);

//   const setGuardActive = (active: boolean) => {
//     isGuardActive.current = active;
//   };

//   return { setGuardActive };
// };

// export default useRouteGuard;
