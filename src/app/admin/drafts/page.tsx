import dynamic from "next/dynamic";
const PostDraftsEntry = dynamic(
  () => import("@/components/Drafts/PostDrafts/PostDraftsEntry"),
  {
    ssr: false,
  }
);
import { flattenQueryDataWithId } from "@/firebase/post-v2";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, orderBy, query } from "firebase/firestore";

const samplePosts = [
  {
    _id: "minerva-post-2",
    timestamp: "2024-07-10T04:50:51.354Z",
    _position: "full-with-creative",
    snippetPosition: "mid-content",
    snippetDesign: "classic-card",
    displayTitle: "Minerva Post 2 asdf a",
    displayContent: "sdf asd asdf asdf asdf",
    _sections: [
      {
        _id: "co5hu8iqv-1720607844499",
        index: 0,
        title: "Scoop",
        icon: "https://pustack-blog.vercel.app/assets/images/svgs/label.svg",
        content:
          '<p>ldksaj flasdf a</p><p>sdf asd</p><p>f a</p><p>sdf</p><p>&nbsp;asdf asdf asdf asd</p><p>f</p><p>as dfa</p><p>sdf asdf<img class="blog-image" src="https://firebasestorage.googleapis.com/v0/b/minerva-0000.appspot.com/o/images%2FScreenshot%202024-06-29%20at%204.28.09%E2%80%AFPM.png?alt=media&amp;token=904dcade-3acf-4382-8506-990b4d683cd0" alt="image"></p>',
      },
    ],
    _snippetData: {
      title: "Minerva Post 2 asdf a",
      content: "sdf asd asdf asdf asdf",
      image:
        "https://firebasestorage.googleapis.com/v0/b/minerva-0000.appspot.com/o/images%2FScreenshot%202024-06-29%20at%204.28.09%E2%80%AFPM.png?alt=media&token=904dcade-3acf-4382-8506-990b4d683cd0",
      author: {
        email: "saurabh@pustack.com",
        photoURL:
          "https://lh3.googleusercontent.com/a-/ALV-UjWJGI3yz0NwSlqLVmXdWGxls3RKWAio_fsfzJ3i7x5JZaJLxv7gJi9MgTsoBrf6DMU1ukM99L7q3DstUjwb7D4ecUxiKFbORxoKqTUSbZ9yoAPg8o4GvWMWdffi0eyD3WtJdu7-HzTCc6bRcFzqjQkw_xswllvfZR9vyS-_LaL9FmtO1-o4Otfp2NXQhNTXIIbyZ0DW_IqY48SuJHNhe0e00YXmEUEYB3GhXtNe_9TwbLAdIhDahM67eFfz3AY6HMmNAwrOCSYMz0vExY83sEpzHO9U-5nLon509rv5GOWQbHf66Zp0EbwVlGQ7Q6xW0xHZc0uQWxkEXsN28C_5BrWPvj_EABdNZ-ueN67TtAG2GZrecYUDKv13faOeqFVxVuaZz2-QUU9lTWlqU1VZ4CngLIkC1JKv3iA-uEJUZlc3vHLuYdTf2CwTh4iaPDMtUgGY3bHlhX5fGpDIr0tGPnD030uQC5-5Sl_8cfRkk9l6Hsk6PoEl-ec33dJ0WBBrJsRjuv3FsoYEGmX59hRfXPrv6ypWI9g5OSi26zgAn10PB2-7Qc-xAlO-piMmM9N8xOK_XmhIOPGrJ1SbhdgKl6ZBekF1tjb7wX85K649wHoUiCBc6Yf0EC-ZwbNCd-6lbqvnJAE_0RZlyJIUE0-8mnFV1emCPok4lyYsbO89V5mQWxDiXXEcK1wh00HCg3TW7gRaTCvIv3xnR45jbb52KMDwFkRm980jZkpdX42ok65PengwGHU5IHFbMHseOTk6ENDpneZvZ4ojwx_CZB7MRJDPckBn828VRdxvDu7hhcxmUMaQ41Mv0cnf9JcNEv3L6YXKj079RFE1DghKszz7ioyR_YOFvnn8TzkGmURw-XIBiBMMg6oNDtPyv-SAe0n_lBFr2cQn-kM6TDMipN-skvgIs9j2SHtaZg7SVINhK0faJAoQuDgzUG-lVjOWM6Y8U3e7za6hc3kzDbo55O3-Cybv=s96-c",
        name: "Saurabh Singh",
      },
      topic: "technology",
    },
    title: "Minerva Post 2",
    author: {
      email: "saurabh@pustack.com",
      photoURL:
        "https://lh3.googleusercontent.com/a-/ALV-UjWJGI3yz0NwSlqLVmXdWGxls3RKWAio_fsfzJ3i7x5JZaJLxv7gJi9MgTsoBrf6DMU1ukM99L7q3DstUjwb7D4ecUxiKFbORxoKqTUSbZ9yoAPg8o4GvWMWdffi0eyD3WtJdu7-HzTCc6bRcFzqjQkw_xswllvfZR9vyS-_LaL9FmtO1-o4Otfp2NXQhNTXIIbyZ0DW_IqY48SuJHNhe0e00YXmEUEYB3GhXtNe_9TwbLAdIhDahM67eFfz3AY6HMmNAwrOCSYMz0vExY83sEpzHO9U-5nLon509rv5GOWQbHf66Zp0EbwVlGQ7Q6xW0xHZc0uQWxkEXsN28C_5BrWPvj_EABdNZ-ueN67TtAG2GZrecYUDKv13faOeqFVxVuaZz2-QUU9lTWlqU1VZ4CngLIkC1JKv3iA-uEJUZlc3vHLuYdTf2CwTh4iaPDMtUgGY3bHlhX5fGpDIr0tGPnD030uQC5-5Sl_8cfRkk9l6Hsk6PoEl-ec33dJ0WBBrJsRjuv3FsoYEGmX59hRfXPrv6ypWI9g5OSi26zgAn10PB2-7Qc-xAlO-piMmM9N8xOK_XmhIOPGrJ1SbhdgKl6ZBekF1tjb7wX85K649wHoUiCBc6Yf0EC-ZwbNCd-6lbqvnJAE_0RZlyJIUE0-8mnFV1emCPok4lyYsbO89V5mQWxDiXXEcK1wh00HCg3TW7gRaTCvIv3xnR45jbb52KMDwFkRm980jZkpdX42ok65PengwGHU5IHFbMHseOTk6ENDpneZvZ4ojwx_CZB7MRJDPckBn828VRdxvDu7hhcxmUMaQ41Mv0cnf9JcNEv3L6YXKj079RFE1DghKszz7ioyR_YOFvnn8TzkGmURw-XIBiBMMg6oNDtPyv-SAe0n_lBFr2cQn-kM6TDMipN-skvgIs9j2SHtaZg7SVINhK0faJAoQuDgzUG-lVjOWM6Y8U3e7za6hc3kzDbo55O3-Cybv=s96-c",
      name: "Saurabh Singh",
    },
    topic: "technology",
    html: {
      location: null,
    },
    images: [
      "https://firebasestorage.googleapis.com/v0/b/minerva-0000.appspot.com/o/images%2FScreenshot%202024-06-29%20at%204.28.09%E2%80%AFPM.png?alt=media&token=904dcade-3acf-4382-8506-990b4d683cd0",
    ],
    quotes: [],
    is_v2: true,
  },
  {
    _id: "minerva-post-test-two",
    timestamp: "2024-07-10T04:33:14.113Z",
    _position: "full-with-creative",
    snippetPosition: "mid-content",
    snippetDesign: "classic-card",
    displayTitle: "Minerva Post Test Two",
    displayContent:
      "On Tuesday, Democracy Now published a minutes-long clip of an interview between host Amy Goodman and left-leaning journalist Jeremy Scahill in which they discussed Scahill’s recent interviews with members of Hamas. In the clip, Scahill laid out his reporting about whether members of the group knew that Israel would respond to the Oct. 7 attack that killed over a thousand Israelis with a months-long bombardment and invasion that has killed tens of thousands of Palestinians.",
    _sections: [
      {
        _id: "td8hpml07-1720607844499",
        index: 0,
        title: "The news",
        icon: "https://pustack-blog.vercel.app/assets/images/furtherreading.png",
        content:
          '<p style="box-sizing: border-box; margin: 0px 0px 9px; color: rgb(30, 27, 21); font-family: FeatureFlatHeadline, &quot;Times New Roman&quot;, Times, serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.2px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(248, 245, 215); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 18px;">Instagram took down several interviews about the war between Hamas and Israel in Gaza that were posted by the longrunning lefty independent media outlet, Democracy Now.</p><p style="box-sizing: border-box; margin: 0px 0px 9px; color: rgb(30, 27, 21); font-family: FeatureFlatHeadline, &quot;Times New Roman&quot;, Times, serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.2px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(248, 245, 215); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 18px;">On Tuesday, Democracy Now published a minutes-long clip of an interview between host Amy Goodman and left-leaning journalist Jeremy Scahill in which they discussed Scahill’s recent interviews with members of Hamas. In the clip, Scahill laid out his reporting about whether members of the group knew that Israel would respond to the Oct. 7 attack that killed over a thousand Israelis with a months-long bombardment and invasion that has killed tens of thousands of Palestinians.</p><p style="box-sizing: border-box; margin: 0px 0px 9px; color: rgb(30, 27, 21); font-family: FeatureFlatHeadline, &quot;Times New Roman&quot;, Times, serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.2px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(248, 245, 215); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 18px;"><img class="blog-image" src="https://img.semafor.com/73a7242415ddad271617b0d2d81c2db9694614bb-1280x854.png?w=750&amp;q=75&amp;auto=format" alt="image" style="display: block; margin-left: auto; margin-right: auto;"></p>',
      },
    ],
    _snippetData: {
      title: "Minerva Post Test Two",
      content:
        "On Tuesday, Democracy Now published a minutes-long clip of an interview between host Amy Goodman and left-leaning journalist Jeremy Scahill in which they discussed Scahill’s recent interviews with members of Hamas. In the clip, Scahill laid out his reporting about whether members of the group knew that Israel would respond to the Oct. 7 attack that killed over a thousand Israelis with a months-long bombardment and invasion that has killed tens of thousands of Palestinians.",
      image:
        "https://img.semafor.com/73a7242415ddad271617b0d2d81c2db9694614bb-1280x854.png?w=750&q=75&auto=format",
      author: {
        name: "Saurabh Singh",
        email: "saurabh@pustack.com",
        photoURL:
          "https://lh3.googleusercontent.com/a-/ALV-UjWJGI3yz0NwSlqLVmXdWGxls3RKWAio_fsfzJ3i7x5JZaJLxv7gJi9MgTsoBrf6DMU1ukM99L7q3DstUjwb7D4ecUxiKFbORxoKqTUSbZ9yoAPg8o4GvWMWdffi0eyD3WtJdu7-HzTCc6bRcFzqjQkw_xswllvfZR9vyS-_LaL9FmtO1-o4Otfp2NXQhNTXIIbyZ0DW_IqY48SuJHNhe0e00YXmEUEYB3GhXtNe_9TwbLAdIhDahM67eFfz3AY6HMmNAwrOCSYMz0vExY83sEpzHO9U-5nLon509rv5GOWQbHf66Zp0EbwVlGQ7Q6xW0xHZc0uQWxkEXsN28C_5BrWPvj_EABdNZ-ueN67TtAG2GZrecYUDKv13faOeqFVxVuaZz2-QUU9lTWlqU1VZ4CngLIkC1JKv3iA-uEJUZlc3vHLuYdTf2CwTh4iaPDMtUgGY3bHlhX5fGpDIr0tGPnD030uQC5-5Sl_8cfRkk9l6Hsk6PoEl-ec33dJ0WBBrJsRjuv3FsoYEGmX59hRfXPrv6ypWI9g5OSi26zgAn10PB2-7Qc-xAlO-piMmM9N8xOK_XmhIOPGrJ1SbhdgKl6ZBekF1tjb7wX85K649wHoUiCBc6Yf0EC-ZwbNCd-6lbqvnJAE_0RZlyJIUE0-8mnFV1emCPok4lyYsbO89V5mQWxDiXXEcK1wh00HCg3TW7gRaTCvIv3xnR45jbb52KMDwFkRm980jZkpdX42ok65PengwGHU5IHFbMHseOTk6ENDpneZvZ4ojwx_CZB7MRJDPckBn828VRdxvDu7hhcxmUMaQ41Mv0cnf9JcNEv3L6YXKj079RFE1DghKszz7ioyR_YOFvnn8TzkGmURw-XIBiBMMg6oNDtPyv-SAe0n_lBFr2cQn-kM6TDMipN-skvgIs9j2SHtaZg7SVINhK0faJAoQuDgzUG-lVjOWM6Y8U3e7za6hc3kzDbo55O3-Cybv=s96-c",
      },
      topic: "africa",
    },
    title: "Minerva Post Test Two",
    author: {
      name: "Saurabh Singh",
      email: "saurabh@pustack.com",
      photoURL:
        "https://lh3.googleusercontent.com/a-/ALV-UjWJGI3yz0NwSlqLVmXdWGxls3RKWAio_fsfzJ3i7x5JZaJLxv7gJi9MgTsoBrf6DMU1ukM99L7q3DstUjwb7D4ecUxiKFbORxoKqTUSbZ9yoAPg8o4GvWMWdffi0eyD3WtJdu7-HzTCc6bRcFzqjQkw_xswllvfZR9vyS-_LaL9FmtO1-o4Otfp2NXQhNTXIIbyZ0DW_IqY48SuJHNhe0e00YXmEUEYB3GhXtNe_9TwbLAdIhDahM67eFfz3AY6HMmNAwrOCSYMz0vExY83sEpzHO9U-5nLon509rv5GOWQbHf66Zp0EbwVlGQ7Q6xW0xHZc0uQWxkEXsN28C_5BrWPvj_EABdNZ-ueN67TtAG2GZrecYUDKv13faOeqFVxVuaZz2-QUU9lTWlqU1VZ4CngLIkC1JKv3iA-uEJUZlc3vHLuYdTf2CwTh4iaPDMtUgGY3bHlhX5fGpDIr0tGPnD030uQC5-5Sl_8cfRkk9l6Hsk6PoEl-ec33dJ0WBBrJsRjuv3FsoYEGmX59hRfXPrv6ypWI9g5OSi26zgAn10PB2-7Qc-xAlO-piMmM9N8xOK_XmhIOPGrJ1SbhdgKl6ZBekF1tjb7wX85K649wHoUiCBc6Yf0EC-ZwbNCd-6lbqvnJAE_0RZlyJIUE0-8mnFV1emCPok4lyYsbO89V5mQWxDiXXEcK1wh00HCg3TW7gRaTCvIv3xnR45jbb52KMDwFkRm980jZkpdX42ok65PengwGHU5IHFbMHseOTk6ENDpneZvZ4ojwx_CZB7MRJDPckBn828VRdxvDu7hhcxmUMaQ41Mv0cnf9JcNEv3L6YXKj079RFE1DghKszz7ioyR_YOFvnn8TzkGmURw-XIBiBMMg6oNDtPyv-SAe0n_lBFr2cQn-kM6TDMipN-skvgIs9j2SHtaZg7SVINhK0faJAoQuDgzUG-lVjOWM6Y8U3e7za6hc3kzDbo55O3-Cybv=s96-c",
    },
    topic: "africa",
    html: {
      location: null,
    },
    images: [
      "https://img.semafor.com/73a7242415ddad271617b0d2d81c2db9694614bb-1280x854.png?w=750&q=75&auto=format",
    ],
    quotes: [],
    is_v2: true,
  },
  {
    _id: "minerva-post-test-in-production",
    timestamp: "2024-07-10T04:06:02.507Z",
    _position: "full-with-creative",
    snippetPosition: "title",
    snippetDesign: "classic-card",
    displayTitle: "Minerva Post Test In Production",
    displayContent:
      "On Tuesday, Democracy Now published a minutes-long clip of an interview between host Amy Goodman and left-leaning journalist Jeremy Scahill in which they discussed Scahill’s recent interviews with members of Hamas. In the clip, Scahill laid out his reporting about whether members of the group knew that Israel would respond to the Oct. 7 attack that killed over a thousand Israelis with a months-long bombardment and invasion that has killed tens of thousands of Palestinians.",
    _sections: [
      {
        _id: "mkbcf11zl-1720607844499",
        index: 0,
        title: "Scoop",
        icon: "https://pustack-blog.vercel.app/assets/images/svgs/problem.svg",
        content:
          '<p style="box-sizing: border-box; margin: 0px 0px 9px; color: rgb(30, 27, 21); font-family: FeatureFlatHeadline, &quot;Times New Roman&quot;, Times, serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.2px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(248, 245, 215); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 18px;">Instagram took down several interviews about the war between Hamas and Israel in Gaza that were posted by the longrunning lefty independent media outlet, Democracy Now.</p><p style="box-sizing: border-box; margin: 0px 0px 9px; color: rgb(30, 27, 21); font-family: FeatureFlatHeadline, &quot;Times New Roman&quot;, Times, serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.2px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(248, 245, 215); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 18px;">On Tuesday, Democracy Now published a minutes-long clip of an interview between host Amy Goodman and left-leaning journalist Jeremy Scahill in which they discussed Scahill’s recent interviews with members of Hamas. In the clip, Scahill laid out his reporting about whether members of the group knew that Israel would respond to the Oct. 7 attack that killed over a thousand Israelis with a months-long bombardment and invasion that has killed tens of thousands of Palestinians.</p><p style="box-sizing: border-box; margin: 0px 0px 9px; color: rgb(30, 27, 21); font-family: FeatureFlatHeadline, &quot;Times New Roman&quot;, Times, serif; font-style: normal; font-variant-ligatures: normal; font-variant-caps: normal; font-weight: 400; letter-spacing: 0.2px; orphans: 2; text-align: start; text-indent: 0px; text-transform: none; widows: 2; word-spacing: 0px; -webkit-text-stroke-width: 0px; white-space: normal; background-color: rgb(248, 245, 215); text-decoration-thickness: initial; text-decoration-style: initial; text-decoration-color: initial; font-size: 18px;"><img class="blog-image" src="https://img.semafor.com/ad9eec2cb967fc3e16d971e45f622452d6f179a6-3000x2001.jpg?w=750&amp;q=75&amp;auto=format" alt="image" style="display: block; margin-left: auto; margin-right: auto;"></p>',
      },
      {
        _id: "3p9d2ne2t-1720607844499",
        index: 1,
        title: "CODE",
        icon: "https://pustack-blog.vercel.app/assets/images/svgs/github.svg",
        content:
          '<pre>const querySnapshot = await firestore       <br>  .collection("newsletters")       <br>  .doc(topic)       <br>  .collection("subscribers")       <br>  .get(); <br><br>const subscribers = querySnapshot.docs.map((doc) =&gt; doc.data());<br></pre><p>This is a sample code.</p>',
      },
      {
        _id: "jnthh7s63-1720607844499",
        index: 2,
        title: "Youtube",
        icon: "https://static.thenounproject.com/png/5288426-200.png",
        content:
          '<p style="text-align: center;">This is some support for the video editor.</p>',
      },
    ],
    _snippetData: {
      title: "Minerva Post Test In Production",
      content:
        "On Tuesday, Democracy Now published a minutes-long clip of an interview between host Amy Goodman and left-leaning journalist Jeremy Scahill in which they discussed Scahill’s recent interviews with members of Hamas. In the clip, Scahill laid out his reporting about whether members of the group knew that Israel would respond to the Oct. 7 attack that killed over a thousand Israelis with a months-long bombardment and invasion that has killed tens of thousands of Palestinians.",
      image:
        "https://img.semafor.com/ad9eec2cb967fc3e16d971e45f622452d6f179a6-3000x2001.jpg?w=750&q=75&auto=format",
      author: {
        photoURL:
          "https://lh3.googleusercontent.com/a-/ALV-UjWJGI3yz0NwSlqLVmXdWGxls3RKWAio_fsfzJ3i7x5JZaJLxv7gJi9MgTsoBrf6DMU1ukM99L7q3DstUjwb7D4ecUxiKFbORxoKqTUSbZ9yoAPg8o4GvWMWdffi0eyD3WtJdu7-HzTCc6bRcFzqjQkw_xswllvfZR9vyS-_LaL9FmtO1-o4Otfp2NXQhNTXIIbyZ0DW_IqY48SuJHNhe0e00YXmEUEYB3GhXtNe_9TwbLAdIhDahM67eFfz3AY6HMmNAwrOCSYMz0vExY83sEpzHO9U-5nLon509rv5GOWQbHf66Zp0EbwVlGQ7Q6xW0xHZc0uQWxkEXsN28C_5BrWPvj_EABdNZ-ueN67TtAG2GZrecYUDKv13faOeqFVxVuaZz2-QUU9lTWlqU1VZ4CngLIkC1JKv3iA-uEJUZlc3vHLuYdTf2CwTh4iaPDMtUgGY3bHlhX5fGpDIr0tGPnD030uQC5-5Sl_8cfRkk9l6Hsk6PoEl-ec33dJ0WBBrJsRjuv3FsoYEGmX59hRfXPrv6ypWI9g5OSi26zgAn10PB2-7Qc-xAlO-piMmM9N8xOK_XmhIOPGrJ1SbhdgKl6ZBekF1tjb7wX85K649wHoUiCBc6Yf0EC-ZwbNCd-6lbqvnJAE_0RZlyJIUE0-8mnFV1emCPok4lyYsbO89V5mQWxDiXXEcK1wh00HCg3TW7gRaTCvIv3xnR45jbb52KMDwFkRm980jZkpdX42ok65PengwGHU5IHFbMHseOTk6ENDpneZvZ4ojwx_CZB7MRJDPckBn828VRdxvDu7hhcxmUMaQ41Mv0cnf9JcNEv3L6YXKj079RFE1DghKszz7ioyR_YOFvnn8TzkGmURw-XIBiBMMg6oNDtPyv-SAe0n_lBFr2cQn-kM6TDMipN-skvgIs9j2SHtaZg7SVINhK0faJAoQuDgzUG-lVjOWM6Y8U3e7za6hc3kzDbo55O3-Cybv=s96-c",
        email: "saurabh@pustack.com",
        name: "Saurabh Singh",
      },
      topic: "technology",
    },
    title: "Minerva Post Test In Production",
    author: {
      photoURL:
        "https://lh3.googleusercontent.com/a-/ALV-UjWJGI3yz0NwSlqLVmXdWGxls3RKWAio_fsfzJ3i7x5JZaJLxv7gJi9MgTsoBrf6DMU1ukM99L7q3DstUjwb7D4ecUxiKFbORxoKqTUSbZ9yoAPg8o4GvWMWdffi0eyD3WtJdu7-HzTCc6bRcFzqjQkw_xswllvfZR9vyS-_LaL9FmtO1-o4Otfp2NXQhNTXIIbyZ0DW_IqY48SuJHNhe0e00YXmEUEYB3GhXtNe_9TwbLAdIhDahM67eFfz3AY6HMmNAwrOCSYMz0vExY83sEpzHO9U-5nLon509rv5GOWQbHf66Zp0EbwVlGQ7Q6xW0xHZc0uQWxkEXsN28C_5BrWPvj_EABdNZ-ueN67TtAG2GZrecYUDKv13faOeqFVxVuaZz2-QUU9lTWlqU1VZ4CngLIkC1JKv3iA-uEJUZlc3vHLuYdTf2CwTh4iaPDMtUgGY3bHlhX5fGpDIr0tGPnD030uQC5-5Sl_8cfRkk9l6Hsk6PoEl-ec33dJ0WBBrJsRjuv3FsoYEGmX59hRfXPrv6ypWI9g5OSi26zgAn10PB2-7Qc-xAlO-piMmM9N8xOK_XmhIOPGrJ1SbhdgKl6ZBekF1tjb7wX85K649wHoUiCBc6Yf0EC-ZwbNCd-6lbqvnJAE_0RZlyJIUE0-8mnFV1emCPok4lyYsbO89V5mQWxDiXXEcK1wh00HCg3TW7gRaTCvIv3xnR45jbb52KMDwFkRm980jZkpdX42ok65PengwGHU5IHFbMHseOTk6ENDpneZvZ4ojwx_CZB7MRJDPckBn828VRdxvDu7hhcxmUMaQ41Mv0cnf9JcNEv3L6YXKj079RFE1DghKszz7ioyR_YOFvnn8TzkGmURw-XIBiBMMg6oNDtPyv-SAe0n_lBFr2cQn-kM6TDMipN-skvgIs9j2SHtaZg7SVINhK0faJAoQuDgzUG-lVjOWM6Y8U3e7za6hc3kzDbo55O3-Cybv=s96-c",
      email: "saurabh@pustack.com",
      name: "Saurabh Singh",
    },
    topic: "technology",
    html: {
      location: null,
    },
    images: [
      "https://img.semafor.com/ad9eec2cb967fc3e16d971e45f622452d6f179a6-3000x2001.jpg?w=750&q=75&auto=format",
    ],
    quotes: [],
    is_v2: true,
  },
  {
    _id: "another-post-with-adjusted-params",
    timestamp: "2024-07-09T12:32:06.036Z",
    _position: "full-with-creative",
    snippetPosition: "right",
    snippetDesign: "classic-card",
    displayTitle: "Another Post with adjusted params Title",
    displayContent: "f Content",
    _sections: [
      {
        _id: "v0gc0fx33-1720607844499",
        index: 0,
        title: "Scoop",
        icon: "https://pustack-blog.vercel.app/assets/images/furtherreading.png",
        content:
          '<p>This dalskfj asdf ajsdf asd</p><p>f&nbsp;</p><p>asd</p><p>f&nbsp;</p><p>asdfa sdfasd fa</p><p><img class="blog-image" src="https://i.ytimg.com/an_webp/ktvBh293SRI/mqdefault_6s.webp?du=3000&amp;sqp=CI61tLQG&amp;rs=AOn4CLAXVvlMVv6ba5vXRI28UjolS_h9gA" alt="image"></p>',
      },
    ],
    _snippetData: {
      title: "Another Post with adjusted params Title",
      content: "f Content",
      image:
        "https://i.ytimg.com/an_webp/ktvBh293SRI/mqdefault_6s.webp?du=3000&sqp=CI61tLQG&rs=AOn4CLAXVvlMVv6ba5vXRI28UjolS_h9gA",
      author: {
        name: "Saurabh Singh",
        email: "saurabh@pustack.com",
        photoURL:
          "https://lh3.googleusercontent.com/a-/ALV-UjWJGI3yz0NwSlqLVmXdWGxls3RKWAio_fsfzJ3i7x5JZaJLxv7gJi9MgTsoBrf6DMU1ukM99L7q3DstUjwb7D4ecUxiKFbORxoKqTUSbZ9yoAPg8o4GvWMWdffi0eyD3WtJdu7-HzTCc6bRcFzqjQkw_xswllvfZR9vyS-_LaL9FmtO1-o4Otfp2NXQhNTXIIbyZ0DW_IqY48SuJHNhe0e00YXmEUEYB3GhXtNe_9TwbLAdIhDahM67eFfz3AY6HMmNAwrOCSYMz0vExY83sEpzHO9U-5nLon509rv5GOWQbHf66Zp0EbwVlGQ7Q6xW0xHZc0uQWxkEXsN28C_5BrWPvj_EABdNZ-ueN67TtAG2GZrecYUDKv13faOeqFVxVuaZz2-QUU9lTWlqU1VZ4CngLIkC1JKv3iA-uEJUZlc3vHLuYdTf2CwTh4iaPDMtUgGY3bHlhX5fGpDIr0tGPnD030uQC5-5Sl_8cfRkk9l6Hsk6PoEl-ec33dJ0WBBrJsRjuv3FsoYEGmX59hRfXPrv6ypWI9g5OSi26zgAn10PB2-7Qc-xAlO-piMmM9N8xOK_XmhIOPGrJ1SbhdgKl6ZBekF1tjb7wX85K649wHoUiCBc6Yf0EC-ZwbNCd-6lbqvnJAE_0RZlyJIUE0-8mnFV1emCPok4lyYsbO89V5mQWxDiXXEcK1wh00HCg3TW7gRaTCvIv3xnR45jbb52KMDwFkRm980jZkpdX42ok65PengwGHU5IHFbMHseOTk6ENDpneZvZ4ojwx_CZB7MRJDPckBn828VRdxvDu7hhcxmUMaQ41Mv0cnf9JcNEv3L6YXKj079RFE1DghKszz7ioyR_YOFvnn8TzkGmURw-XIBiBMMg6oNDtPyv-SAe0n_lBFr2cQn-kM6TDMipN-skvgIs9j2SHtaZg7SVINhK0faJAoQuDgzUG-lVjOWM6Y8U3e7za6hc3kzDbo55O3-Cybv=s96-c",
      },
      topic: "technology",
    },
    title: "Another Post with adjusted params",
    author: {
      name: "Saurabh Singh",
      email: "saurabh@pustack.com",
      photoURL:
        "https://lh3.googleusercontent.com/a-/ALV-UjWJGI3yz0NwSlqLVmXdWGxls3RKWAio_fsfzJ3i7x5JZaJLxv7gJi9MgTsoBrf6DMU1ukM99L7q3DstUjwb7D4ecUxiKFbORxoKqTUSbZ9yoAPg8o4GvWMWdffi0eyD3WtJdu7-HzTCc6bRcFzqjQkw_xswllvfZR9vyS-_LaL9FmtO1-o4Otfp2NXQhNTXIIbyZ0DW_IqY48SuJHNhe0e00YXmEUEYB3GhXtNe_9TwbLAdIhDahM67eFfz3AY6HMmNAwrOCSYMz0vExY83sEpzHO9U-5nLon509rv5GOWQbHf66Zp0EbwVlGQ7Q6xW0xHZc0uQWxkEXsN28C_5BrWPvj_EABdNZ-ueN67TtAG2GZrecYUDKv13faOeqFVxVuaZz2-QUU9lTWlqU1VZ4CngLIkC1JKv3iA-uEJUZlc3vHLuYdTf2CwTh4iaPDMtUgGY3bHlhX5fGpDIr0tGPnD030uQC5-5Sl_8cfRkk9l6Hsk6PoEl-ec33dJ0WBBrJsRjuv3FsoYEGmX59hRfXPrv6ypWI9g5OSi26zgAn10PB2-7Qc-xAlO-piMmM9N8xOK_XmhIOPGrJ1SbhdgKl6ZBekF1tjb7wX85K649wHoUiCBc6Yf0EC-ZwbNCd-6lbqvnJAE_0RZlyJIUE0-8mnFV1emCPok4lyYsbO89V5mQWxDiXXEcK1wh00HCg3TW7gRaTCvIv3xnR45jbb52KMDwFkRm980jZkpdX42ok65PengwGHU5IHFbMHseOTk6ENDpneZvZ4ojwx_CZB7MRJDPckBn828VRdxvDu7hhcxmUMaQ41Mv0cnf9JcNEv3L6YXKj079RFE1DghKszz7ioyR_YOFvnn8TzkGmURw-XIBiBMMg6oNDtPyv-SAe0n_lBFr2cQn-kM6TDMipN-skvgIs9j2SHtaZg7SVINhK0faJAoQuDgzUG-lVjOWM6Y8U3e7za6hc3kzDbo55O3-Cybv=s96-c",
    },
    topic: "technology",
    html: {
      location: null,
    },
    images: [
      "https://i.ytimg.com/an_webp/ktvBh293SRI/mqdefault_6s.webp?du=3000&sqp=CI61tLQG&rs=AOn4CLAXVvlMVv6ba5vXRI28UjolS_h9gA",
    ],
    quotes: [],
    is_v2: true,
  },
  {
    _id: "another-post-test-with-log",
    timestamp: "2024-07-09T12:21:32.756Z",
    _position: "full-with-creative",
    snippetPosition: "mid-content",
    snippetDesign: "classic-card",
    displayTitle: "Another post test with log",
    displayContent: "sdf Content description",
    _sections: [
      {
        _id: "opeqgwa6f-1720607844499",
        index: 0,
        title: "Scoop",
        icon: "https://pustack-blog.vercel.app/assets/images/furtherreading.png",
        content:
          '<p>DSLflasdj flasdjf a</p><p>sdf&nbsp;</p><p>asd</p><p>f asdf asdf&nbsp;</p><p><img class="blog-image" src="https://i.ytimg.com/an_webp/A2zKTJ70xMs/mqdefault_6s.webp?du=3000&amp;sqp=CMa2tLQG&amp;rs=AOn4CLAeLKF37GYFiv9fpxcUpmg1xTD0OQ" alt="image"></p>',
      },
    ],
    _snippetData: {
      title: "Another post test with log",
      content: "sdf Content description",
      image:
        "https://i.ytimg.com/an_webp/A2zKTJ70xMs/mqdefault_6s.webp?du=3000&sqp=CMa2tLQG&rs=AOn4CLAeLKF37GYFiv9fpxcUpmg1xTD0OQ",
      author: {
        photoURL:
          "https://lh3.googleusercontent.com/a-/ALV-UjWJGI3yz0NwSlqLVmXdWGxls3RKWAio_fsfzJ3i7x5JZaJLxv7gJi9MgTsoBrf6DMU1ukM99L7q3DstUjwb7D4ecUxiKFbORxoKqTUSbZ9yoAPg8o4GvWMWdffi0eyD3WtJdu7-HzTCc6bRcFzqjQkw_xswllvfZR9vyS-_LaL9FmtO1-o4Otfp2NXQhNTXIIbyZ0DW_IqY48SuJHNhe0e00YXmEUEYB3GhXtNe_9TwbLAdIhDahM67eFfz3AY6HMmNAwrOCSYMz0vExY83sEpzHO9U-5nLon509rv5GOWQbHf66Zp0EbwVlGQ7Q6xW0xHZc0uQWxkEXsN28C_5BrWPvj_EABdNZ-ueN67TtAG2GZrecYUDKv13faOeqFVxVuaZz2-QUU9lTWlqU1VZ4CngLIkC1JKv3iA-uEJUZlc3vHLuYdTf2CwTh4iaPDMtUgGY3bHlhX5fGpDIr0tGPnD030uQC5-5Sl_8cfRkk9l6Hsk6PoEl-ec33dJ0WBBrJsRjuv3FsoYEGmX59hRfXPrv6ypWI9g5OSi26zgAn10PB2-7Qc-xAlO-piMmM9N8xOK_XmhIOPGrJ1SbhdgKl6ZBekF1tjb7wX85K649wHoUiCBc6Yf0EC-ZwbNCd-6lbqvnJAE_0RZlyJIUE0-8mnFV1emCPok4lyYsbO89V5mQWxDiXXEcK1wh00HCg3TW7gRaTCvIv3xnR45jbb52KMDwFkRm980jZkpdX42ok65PengwGHU5IHFbMHseOTk6ENDpneZvZ4ojwx_CZB7MRJDPckBn828VRdxvDu7hhcxmUMaQ41Mv0cnf9JcNEv3L6YXKj079RFE1DghKszz7ioyR_YOFvnn8TzkGmURw-XIBiBMMg6oNDtPyv-SAe0n_lBFr2cQn-kM6TDMipN-skvgIs9j2SHtaZg7SVINhK0faJAoQuDgzUG-lVjOWM6Y8U3e7za6hc3kzDbo55O3-Cybv=s96-c",
        name: "Saurabh Singh",
        email: "saurabh@pustack.com",
      },
      topic: "technology",
    },
    title: "Another post test with log",
    author: {
      photoURL:
        "https://lh3.googleusercontent.com/a-/ALV-UjWJGI3yz0NwSlqLVmXdWGxls3RKWAio_fsfzJ3i7x5JZaJLxv7gJi9MgTsoBrf6DMU1ukM99L7q3DstUjwb7D4ecUxiKFbORxoKqTUSbZ9yoAPg8o4GvWMWdffi0eyD3WtJdu7-HzTCc6bRcFzqjQkw_xswllvfZR9vyS-_LaL9FmtO1-o4Otfp2NXQhNTXIIbyZ0DW_IqY48SuJHNhe0e00YXmEUEYB3GhXtNe_9TwbLAdIhDahM67eFfz3AY6HMmNAwrOCSYMz0vExY83sEpzHO9U-5nLon509rv5GOWQbHf66Zp0EbwVlGQ7Q6xW0xHZc0uQWxkEXsN28C_5BrWPvj_EABdNZ-ueN67TtAG2GZrecYUDKv13faOeqFVxVuaZz2-QUU9lTWlqU1VZ4CngLIkC1JKv3iA-uEJUZlc3vHLuYdTf2CwTh4iaPDMtUgGY3bHlhX5fGpDIr0tGPnD030uQC5-5Sl_8cfRkk9l6Hsk6PoEl-ec33dJ0WBBrJsRjuv3FsoYEGmX59hRfXPrv6ypWI9g5OSi26zgAn10PB2-7Qc-xAlO-piMmM9N8xOK_XmhIOPGrJ1SbhdgKl6ZBekF1tjb7wX85K649wHoUiCBc6Yf0EC-ZwbNCd-6lbqvnJAE_0RZlyJIUE0-8mnFV1emCPok4lyYsbO89V5mQWxDiXXEcK1wh00HCg3TW7gRaTCvIv3xnR45jbb52KMDwFkRm980jZkpdX42ok65PengwGHU5IHFbMHseOTk6ENDpneZvZ4ojwx_CZB7MRJDPckBn828VRdxvDu7hhcxmUMaQ41Mv0cnf9JcNEv3L6YXKj079RFE1DghKszz7ioyR_YOFvnn8TzkGmURw-XIBiBMMg6oNDtPyv-SAe0n_lBFr2cQn-kM6TDMipN-skvgIs9j2SHtaZg7SVINhK0faJAoQuDgzUG-lVjOWM6Y8U3e7za6hc3kzDbo55O3-Cybv=s96-c",
      name: "Saurabh Singh",
      email: "saurabh@pustack.com",
    },
    topic: "technology",
    html: {
      location: null,
    },
    images: [
      "https://i.ytimg.com/an_webp/A2zKTJ70xMs/mqdefault_6s.webp?du=3000&sqp=CMa2tLQG&rs=AOn4CLAeLKF37GYFiv9fpxcUpmg1xTD0OQ",
    ],
    quotes: [],
    is_v2: true,
  },
];

export default async function PostDrafts() {
  const postsRef = collection(db, "post_drafts");
  let _query = query(postsRef, orderBy("timestamp", "desc"), limit(50));

  const docs = await getDocs(_query);

  const posts = flattenQueryDataWithId(docs).map((doc) => ({
    ...doc,
    timestamp: doc.timestamp.toDate().toISOString(),
    flagged_at: doc.flagged_at?.toDate().toISOString(),
    unflagged_at: doc.unflagged_at?.toDate().toISOString(),
  }));

  return <PostDraftsEntry _serverPosts={posts} />;
}
