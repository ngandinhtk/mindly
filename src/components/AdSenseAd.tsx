// import { useEffect } from "react";
// import { Adsense } from "@ctrl/react-adsense";
// declare global {
//   interface Window {
//     adsbygoogle?: unknown[];
//   }
// }

// const AdsenseAd = () => {
//   useEffect(() => {
//     try {
//       (window.adsbygoogle = window.adsbygoogle || []).push({});
//     } catch (e: any) {
//       if (
//         e.message &&
//         e.message.includes(
//           "All 'ins' elements in the DOM with class=adsbygoogle already have ads in them"
//         )
//       ) {
//         return;
//       }
//       console.error(e);
//     }
//   }, []);

//   return (
//     <ins
//       className="adsbygoogle"
//       style={{ display: "block" }}
//       data-ad-client="ca-pub-4404927344023593"
//       // Thay số 1234567890 bên dưới bằng ID thật bạn vừa lấy được
//       data-ad-slot="6993777932"
//       data-ad-format="autorelaxed"
//       data-full-width-responsive="true"
//     ></ins>
//   );
// };

// export default AdsenseAd;


import { Adsense } from '@ctrl/react-adsense';
import { useEffect } from "react";
declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

export default function MyAd() {
    useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch (e: any) {
      if (
        e.message &&
        e.message.includes(
          "All 'ins' elements in the DOM with class=adsbygoogle already have ads in them"
        )
      ) {
        return;
      }
      console.error(e);
    }
  }, []);
  return (
    <div style={{ textAlign: 'center', margin: '20px 0' }}>
      <Adsense
        client="ca-pub-4404927344023593"
        slot="6993777932"
        style={{ display: 'block' }}
        format="auto"
        responsive="true"
      />
    </div>
  );
}