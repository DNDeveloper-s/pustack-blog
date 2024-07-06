// app/api/nounproject/route.js
import OAuth from "oauth";
import { NextResponse } from "next/server";

const SampleNounProjectIconResponse = {
  generated_at: "2024-07-04 07:56:16.257574",
  icons: [
    {
      attribution: "Flag by Win Ningsih from Noun Project",
      collections: [
        {
          creator: {
            name: "Win Ningsih",
            permalink: "/win76",
            username: "win76",
          },
          id: "234150",
          name: "Geography - Glyph",
          permalink: "/win76/collection/geography-glyph",
        },
      ],
      creator: {
        name: "Win Ningsih",
        permalink: "/win76",
        username: "win76",
      },
      id: "6993859",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6993859",
      tags: [
        "flag",
        "country",
        "maps-and-flags",
        "maps-and-location",
        "nation",
        "symbol",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6993859-200.png",
    },
    {
      attribution: "Flag by Marco Galtarossa from Noun Project",
      collections: [
        {
          creator: {
            name: "Marco Galtarossa",
            permalink: "/marcogaltarossa",
            username: "marcogaltarossa",
          },
          id: "234203",
          name: "Simple Neutral · Fill",
          permalink: "/marcogaltarossa/collection/simple-neutral-fill",
        },
      ],
      creator: {
        name: "Marco Galtarossa",
        permalink: "/marcogaltarossa",
        username: "marcogaltarossa",
      },
      id: "6995488",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6995488",
      tags: ["flag"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6995488-200.png",
    },
    {
      attribution: "Flag by Asep Jangkar from Noun Project",
      collections: [
        {
          creator: {
            name: "Asep Jangkar",
            permalink: "/asepjangkar11",
            username: "asepjangkar11",
          },
          id: "234290",
          name: "Event",
          permalink: "/asepjangkar11/collection/event",
        },
      ],
      creator: {
        name: "Asep Jangkar",
        permalink: "/asepjangkar11",
        username: "asepjangkar11",
      },
      id: "6998789",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6998789",
      tags: [
        "flag",
        "discount",
        "discount-offer",
        "event",
        "festival",
        "store",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6998789-200.png",
    },
    {
      attribution: "Flag by Asep Jangkar from Noun Project",
      collections: [
        {
          creator: {
            name: "Asep Jangkar",
            permalink: "/asepjangkar11",
            username: "asepjangkar11",
          },
          id: "234292",
          name: "Festival",
          permalink: "/asepjangkar11/collection/festival",
        },
      ],
      creator: {
        name: "Asep Jangkar",
        permalink: "/asepjangkar11",
        username: "asepjangkar11",
      },
      id: "6998758",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6998758",
      tags: [
        "flag",
        "discount",
        "discount-offer",
        "event",
        "festival",
        "store",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6998758-200.png",
    },
    {
      attribution: "Flag by Metami Septiana from Noun Project",
      collections: [],
      creator: {
        name: "Metami Septiana",
        permalink: "/metamis579",
        username: "metamis579",
      },
      id: "6998428",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6998428",
      tags: ["flag", "flags", "nation", "peace", "symbol"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6998428-200.png",
    },
    {
      attribution: "Flag by Satria Arnata from Noun Project",
      collections: [
        {
          creator: {
            name: "Satria Arnata",
            permalink: "/satria04",
            username: "satria04",
          },
          id: "234263",
          name: "Independence Day ( Outline )",
          permalink: "/satria04/collection/independence-day-outline",
        },
      ],
      creator: {
        name: "Satria Arnata",
        permalink: "/satria04",
        username: "satria04",
      },
      id: "6997521",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6997521",
      tags: [
        "flag",
        "anniversary",
        "celebration",
        "country",
        "independence",
        "vector",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6997521-200.png",
    },
    {
      attribution: "Flag by Satria Arnata from Noun Project",
      collections: [
        {
          creator: {
            name: "Satria Arnata",
            permalink: "/satria04",
            username: "satria04",
          },
          id: "234264",
          name: "Independence Day ( Solid )",
          permalink: "/satria04/collection/independence-day-solid",
        },
      ],
      creator: {
        name: "Satria Arnata",
        permalink: "/satria04",
        username: "satria04",
      },
      id: "6997509",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6997509",
      tags: [
        "flag",
        "anniversary",
        "celebration",
        "country",
        "independence",
        "vector",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6997509-200.png",
    },
    {
      attribution: "Flag by SUBAIDA from Noun Project",
      collections: [],
      creator: {
        name: "SUBAIDA",
        permalink: "/subaida",
        username: "subaida",
      },
      id: "6994157",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6994157",
      tags: ["flag", "banner", "location", "mark", "pin"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6994157-200.png",
    },
    {
      attribution: "Flag by Win Ningsih from Noun Project",
      collections: [
        {
          creator: {
            name: "Win Ningsih",
            permalink: "/win76",
            username: "win76",
          },
          id: "234150",
          name: "Geography - Glyph",
          permalink: "/win76/collection/geography-glyph",
        },
      ],
      creator: {
        name: "Win Ningsih",
        permalink: "/win76",
        username: "win76",
      },
      id: "6993877",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6993877",
      tags: [
        "flag",
        "country",
        "maps-and-flags",
        "maps-and-location",
        "nation",
        "symbol",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6993877-200.png",
    },
    {
      attribution: "Flag by Win Ningsih from Noun Project",
      collections: [
        {
          creator: {
            name: "Win Ningsih",
            permalink: "/win76",
            username: "win76",
          },
          id: "234150",
          name: "Geography - Glyph",
          permalink: "/win76/collection/geography-glyph",
        },
      ],
      creator: {
        name: "Win Ningsih",
        permalink: "/win76",
        username: "win76",
      },
      id: "6993870",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6993870",
      tags: [
        "flag",
        "country",
        "maps-and-flags",
        "maps-and-location",
        "nation",
        "symbol",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6993870-200.png",
    },
    {
      attribution: "Flag by Win Ningsih from Noun Project",
      collections: [
        {
          creator: {
            name: "Win Ningsih",
            permalink: "/win76",
            username: "win76",
          },
          id: "234155",
          name: "Geography - Outline",
          permalink: "/win76/collection/geography-outline",
        },
      ],
      creator: {
        name: "Win Ningsih",
        permalink: "/win76",
        username: "win76",
      },
      id: "6993843",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6993843",
      tags: [
        "flag",
        "country",
        "maps-and-flags",
        "maps-and-location",
        "nation",
        "symbol",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6993843-200.png",
    },
    {
      attribution: "Flag by Win Ningsih from Noun Project",
      collections: [
        {
          creator: {
            name: "Win Ningsih",
            permalink: "/win76",
            username: "win76",
          },
          id: "234150",
          name: "Geography - Glyph",
          permalink: "/win76/collection/geography-glyph",
        },
      ],
      creator: {
        name: "Win Ningsih",
        permalink: "/win76",
        username: "win76",
      },
      id: "6993837",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6993837",
      tags: [
        "flag",
        "country",
        "maps-and-flags",
        "maps-and-location",
        "nation",
        "symbol",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6993837-200.png",
    },
    {
      attribution: "Flag by Win Ningsih from Noun Project",
      collections: [
        {
          creator: {
            name: "Win Ningsih",
            permalink: "/win76",
            username: "win76",
          },
          id: "234150",
          name: "Geography - Glyph",
          permalink: "/win76/collection/geography-glyph",
        },
      ],
      creator: {
        name: "Win Ningsih",
        permalink: "/win76",
        username: "win76",
      },
      id: "6993833",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6993833",
      tags: [
        "flag",
        "country",
        "maps-and-flags",
        "maps-and-location",
        "nation",
        "symbol",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6993833-200.png",
    },
    {
      attribution: "Flag by Win Ningsih from Noun Project",
      collections: [
        {
          creator: {
            name: "Win Ningsih",
            permalink: "/win76",
            username: "win76",
          },
          id: "234155",
          name: "Geography - Outline",
          permalink: "/win76/collection/geography-outline",
        },
      ],
      creator: {
        name: "Win Ningsih",
        permalink: "/win76",
        username: "win76",
      },
      id: "6993817",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6993817",
      tags: [
        "flag",
        "country",
        "maps-and-flags",
        "maps-and-location",
        "nation",
        "symbol",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6993817-200.png",
    },
    {
      attribution: "Flag by Win Ningsih from Noun Project",
      collections: [
        {
          creator: {
            name: "Win Ningsih",
            permalink: "/win76",
            username: "win76",
          },
          id: "234155",
          name: "Geography - Outline",
          permalink: "/win76/collection/geography-outline",
        },
      ],
      creator: {
        name: "Win Ningsih",
        permalink: "/win76",
        username: "win76",
      },
      id: "6993812",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6993812",
      tags: [
        "flag",
        "country",
        "maps-and-flags",
        "maps-and-location",
        "nation",
        "symbol",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6993812-200.png",
    },
    {
      attribution: "Flag by Win Ningsih from Noun Project",
      collections: [
        {
          creator: {
            name: "Win Ningsih",
            permalink: "/win76",
            username: "win76",
          },
          id: "234155",
          name: "Geography - Outline",
          permalink: "/win76/collection/geography-outline",
        },
      ],
      creator: {
        name: "Win Ningsih",
        permalink: "/win76",
        username: "win76",
      },
      id: "6993796",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6993796",
      tags: [
        "flag",
        "country",
        "maps-and-flags",
        "maps-and-location",
        "nation",
        "symbol",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6993796-200.png",
    },
    {
      attribution: "Flag by Win Ningsih from Noun Project",
      collections: [
        {
          creator: {
            name: "Win Ningsih",
            permalink: "/win76",
            username: "win76",
          },
          id: "234155",
          name: "Geography - Outline",
          permalink: "/win76/collection/geography-outline",
        },
      ],
      creator: {
        name: "Win Ningsih",
        permalink: "/win76",
        username: "win76",
      },
      id: "6993795",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6993795",
      tags: [
        "flag",
        "country",
        "maps-and-flags",
        "maps-and-location",
        "nation",
        "symbol",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6993795-200.png",
    },
    {
      attribution: "Flag by gravisio from Noun Project",
      collections: [
        {
          creator: {
            name: "gravisio",
            permalink: "/creator/gravisio",
            username: "gravisio",
          },
          id: "234043",
          name: "Juneteenth",
        },
      ],
      creator: {
        name: "gravisio",
        permalink: "/gravisio",
        username: "gravisio",
      },
      id: "6991896",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6991896",
      tags: ["flag", "banner", "identity", "national", "patriotism", "pride"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6991896-200.png",
    },
    {
      attribution: "Flag by Eucalyp from Noun Project",
      collections: [
        {
          creator: {
            name: "Eucalyp",
            permalink: "/eucalyp",
            username: "eucalyp",
          },
          id: "154692",
          name: "American Football Glyph 00261",
          permalink: "/eucalyp/collection/american-football-glyph-00261",
        },
      ],
      creator: {
        name: "Eucalyp",
        permalink: "/eucalyp",
        username: "eucalyp",
      },
      id: "4687931",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/4687931",
      tags: ["flag", "american", "football", "penalty", "throwing"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/4687931-200.png",
    },
    {
      attribution: "Flag by Kangrif from Noun Project",
      collections: [
        {
          creator: {
            name: "Kangrif",
            permalink: "/kangrif86",
            username: "kangrif86",
          },
          id: "42907",
          name: "Flags",
          permalink: "/kangrif86/collection/flags",
        },
      ],
      creator: {
        name: "Kangrif",
        permalink: "/kangrif86",
        username: "kangrif86",
      },
      id: "1423986",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/1423986",
      tags: ["flag", "flags", "checkered-flag", "finish-flag", "race-flag"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/1423986-200.png",
    },
    {
      attribution: "Flag by iconsmind.com from Noun Project",
      collections: [
        {
          creator: {
            name: "iconsmind.com",
            permalink: "/creator/imicons",
            username: "imicons",
          },
          id: "1084",
          name: "Flags - Solid",
        },
      ],
      creator: {
        name: "iconsmind.com",
        permalink: "/imicons",
        username: "imicons",
      },
      id: "71846",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/71846",
      tags: [
        "flag",
        "country",
        "design",
        "government",
        "illustration",
        "nation",
        "shape",
        "sign",
        "solid-icon",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/71846-200.png",
    },
    {
      attribution: "Flag by Uswa KDT from Noun Project",
      collections: [
        {
          creator: {
            name: "Uswa KDT",
            permalink: "/captainbuggy0",
            username: "captainbuggy0",
          },
          id: "118278",
          name: "User Interface",
          permalink: "/captainbuggy0/collection/user-interface",
        },
      ],
      creator: {
        name: "Uswa KDT",
        permalink: "/captainbuggy0",
        username: "captainbuggy0",
      },
      id: "6991241",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6991241",
      tags: ["flag", "location", "mark", "nation", "pin"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6991241-200.png",
    },
    {
      attribution: "Flag by Uswa KDT from Noun Project",
      collections: [
        {
          creator: {
            name: "Uswa KDT",
            permalink: "/captainbuggy0",
            username: "captainbuggy0",
          },
          id: "164458",
          name: "UI/UX",
          permalink: "/captainbuggy0/collection/uiux",
        },
      ],
      creator: {
        name: "Uswa KDT",
        permalink: "/captainbuggy0",
        username: "captainbuggy0",
      },
      id: "6991143",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6991143",
      tags: ["flag", "location", "mark", "nation", "pin"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6991143-200.png",
    },
    {
      attribution: "Flag by AB Designs from Noun Project",
      collections: [
        {
          creator: {
            name: "AB Designs",
            permalink: "/ABdesings",
            username: "ABdesings",
          },
          id: "234040",
          name: "Location - Solid",
          permalink: "/ABdesings/collection/location-solid",
        },
      ],
      creator: {
        name: "AB Designs",
        permalink: "/ABdesings",
        username: "ABdesings",
      },
      id: "6990946",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6990946",
      tags: ["flag", "location", "map", "navigation", "pin", "roadmap"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6990946-200.png",
    },
    {
      attribution: "Flag by ProSymbols from Noun Project",
      collections: [
        {
          creator: {
            name: "ProSymbols",
            permalink: "/prosymbols",
            username: "prosymbols",
          },
          id: "26551",
          name: "Web and UI Icons",
          permalink: "/prosymbols/collection/web-and-ui-icons",
        },
      ],
      creator: {
        name: "ProSymbols",
        permalink: "/prosymbols",
        username: "prosymbols",
      },
      id: "798250",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/798250",
      tags: ["flag", "banner", "location-flag", "point-flag", "waving-flag"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/798250-200.png",
    },
    {
      attribution: "Flag by Oksana Latysheva from Noun Project",
      collections: [
        {
          creator: {
            name: "Oksana Latysheva",
            permalink: "/latyshevaoksana",
            username: "latyshevaoksana",
          },
          id: "26296",
          name: "Flags",
          permalink: "/latyshevaoksana/collection/flags",
        },
      ],
      creator: {
        name: "Oksana Latysheva",
        permalink: "/latyshevaoksana",
        username: "latyshevaoksana",
      },
      id: "782355",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/782355",
      tags: [
        "flag",
        "flag-pole",
        "flagged",
        "flagging",
        "outline",
        "waving-flag",
      ],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/782355-200.png",
    },
    {
      attribution: "Flag by Aeliz from Noun Project",
      collections: [],
      creator: {
        name: "Aeliz",
        permalink: "/aeliz",
        username: "aeliz",
      },
      id: "6990336",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6990336",
      tags: ["flag", "country", "wave", "where", "win"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6990336-200.png",
    },
    {
      attribution: "Flag by BEARicons from Noun Project",
      collections: [
        {
          creator: {
            name: "BEARicons",
            permalink: "/bearicons",
            username: "bearicons",
          },
          id: "232154",
          name: "Full Body User",
          permalink: "/bearicons/collection/full-body-user",
        },
      ],
      creator: {
        name: "BEARicons",
        permalink: "/bearicons",
        username: "bearicons",
      },
      id: "6989907",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6989907",
      tags: ["flag", "full-body", "location", "pin", "user"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6989907-200.png",
    },
    {
      attribution: "Flag by Vectorstall from Noun Project",
      collections: [
        {
          creator: {
            name: "Vectorstall",
            permalink: "/vectorstall",
            username: "vectorstall",
          },
          id: "59673",
          name: "Sports",
          permalink: "/vectorstall/collection/sports",
        },
      ],
      creator: {
        name: "Vectorstall",
        permalink: "/vectorstall",
        username: "vectorstall",
      },
      id: "1976258",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/1976258",
      tags: ["flag", "golf-flag", "sports-flag"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/1976258-200.png",
    },
    {
      attribution: "Flag by Saeful Muslim from Noun Project",
      collections: [
        {
          creator: {
            name: "Saeful Muslim",
            permalink: "/rebelsaeful",
            username: "rebelsaeful",
          },
          id: "35187",
          name: "User Interface",
          permalink: "/rebelsaeful/collection/user-interface",
        },
      ],
      creator: {
        name: "Saeful Muslim",
        permalink: "/rebelsaeful",
        username: "rebelsaeful",
      },
      id: "1124759",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/1124759",
      tags: ["flag", "flag-location", "flag-pin"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/1124759-200.png",
    },
    {
      attribution: "Flag by ProSymbols from Noun Project",
      collections: [
        {
          creator: {
            name: "ProSymbols",
            permalink: "/prosymbols",
            username: "prosymbols",
          },
          id: "26059",
          name: "Sports and Games",
          permalink: "/prosymbols/collection/sports-and-games",
        },
      ],
      creator: {
        name: "ProSymbols",
        permalink: "/prosymbols",
        username: "prosymbols",
      },
      id: "774504",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/774504",
      tags: ["flag", "destination-flag", "location-flag", "sports-flag"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/774504-200.png",
    },
    {
      attribution: "national flag by HoMil from Noun Project",
      collections: [],
      creator: {
        name: "HoMil",
        permalink: "/ghrud0710",
        username: "ghrud0710",
      },
      id: "6997487",
      license_description: "creative-commons-attribution",
      permalink: "/term/national-flag/6997487",
      tags: ["national-flag", "korea", "korean", "patriotism", "south-korea"],
      term: "national flag",
      thumbnail_url: "https://static.thenounproject.com/png/6997487-200.png",
    },
    {
      attribution: "goal flag by agus raharjo from Noun Project",
      collections: [
        {
          creator: {
            name: "agus raharjo",
            permalink: "/agusrahar",
            username: "agusrahar",
          },
          id: "234351",
          name: "Success",
          permalink: "/agusrahar/collection/success",
        },
      ],
      creator: {
        name: "agus raharjo",
        permalink: "/agusrahar",
        username: "agusrahar",
      },
      id: "6996698",
      license_description: "creative-commons-attribution",
      permalink: "/term/goal-flag/6996698",
      tags: ["goal-flag", "flag", "goal", "holding", "man", "standing"],
      term: "goal flag",
      thumbnail_url: "https://static.thenounproject.com/png/6996698-200.png",
    },
    {
      attribution: "Flag by studio creations from Noun Project",
      collections: [
        {
          creator: {
            name: "studio creations",
            permalink: "/creator/ipeenam1",
            username: "ipeenam1",
          },
          id: "233889",
          name: "leadership",
        },
      ],
      creator: {
        name: "studio creations",
        permalink: "/ipeenam1",
        username: "ipeenam1",
      },
      id: "6987203",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6987203",
      tags: ["flag", "country", "flag-variant", "free", "independent", "win"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6987203-200.png",
    },
    {
      attribution: "Flag by Eklip Studio from Noun Project",
      collections: [
        {
          creator: {
            name: "Eklip Studio",
            permalink: "/eklip",
            username: "eklip",
          },
          id: "233912",
          name: "France",
          permalink: "/eklip/collection/france",
        },
      ],
      creator: {
        name: "Eklip Studio",
        permalink: "/eklip",
        username: "eklip",
      },
      id: "6987130",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6987130",
      tags: ["flag", "bastille-day", "france", "french", "paris"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6987130-200.png",
    },
    {
      attribution: "Flag by Eklip Studio from Noun Project",
      collections: [
        {
          creator: {
            name: "Eklip Studio",
            permalink: "/eklip",
            username: "eklip",
          },
          id: "233912",
          name: "France",
          permalink: "/eklip/collection/france",
        },
      ],
      creator: {
        name: "Eklip Studio",
        permalink: "/eklip",
        username: "eklip",
      },
      id: "6987043",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6987043",
      tags: ["flag", "bastille-day", "france", "french", "paris"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6987043-200.png",
    },
    {
      attribution: "Flag by Lula Sugiantoro from Noun Project",
      collections: [
        {
          creator: {
            name: "Lula Sugiantoro",
            permalink: "/lulasugito09",
            username: "lulasugito09",
          },
          id: "234685",
          name: "Summer and Holiday",
          permalink: "/lulasugito09/collection/summer-and-holiday",
        },
      ],
      creator: {
        name: "Lula Sugiantoro",
        permalink: "/lulasugito09",
        username: "lulasugito09",
      },
      id: "6985877",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985877",
      tags: ["flag", "banner", "emblem", "freedom", "national", "ribbon"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985877-200.png",
    },
    {
      attribution: "Flag by Lula Sugiantoro from Noun Project",
      collections: [
        {
          creator: {
            name: "Lula Sugiantoro",
            permalink: "/lulasugito09",
            username: "lulasugito09",
          },
          id: "234685",
          name: "Summer and Holiday",
          permalink: "/lulasugito09/collection/summer-and-holiday",
        },
      ],
      creator: {
        name: "Lula Sugiantoro",
        permalink: "/lulasugito09",
        username: "lulasugito09",
      },
      id: "6985851",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985851",
      tags: ["flag", "banner", "emblem", "freedom", "national", "ribbon"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985851-200.png",
    },
    {
      attribution: "Flag by Hermawan from Noun Project",
      collections: [
        {
          creator: {
            name: "Hermawan",
            permalink: "/hermawan280502",
            username: "hermawan280502",
          },
          id: "233838",
          name: "Maps Location",
          permalink: "/hermawan280502/collection/maps-location",
        },
      ],
      creator: {
        name: "Hermawan",
        permalink: "/hermawan280502",
        username: "hermawan280502",
      },
      id: "6985708",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985708",
      tags: ["flag", "location", "mark", "navigation", "pointer"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985708-200.png",
    },
    {
      attribution: "Flag by Hermawan from Noun Project",
      collections: [
        {
          creator: {
            name: "Hermawan",
            permalink: "/hermawan280502",
            username: "hermawan280502",
          },
          id: "233838",
          name: "Maps Location",
          permalink: "/hermawan280502/collection/maps-location",
        },
      ],
      creator: {
        name: "Hermawan",
        permalink: "/hermawan280502",
        username: "hermawan280502",
      },
      id: "6985694",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985694",
      tags: ["flag", "location", "mark", "navigation", "pointer"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985694-200.png",
    },
    {
      attribution: "Flag by Hermawan from Noun Project",
      collections: [
        {
          creator: {
            name: "Hermawan",
            permalink: "/creator/hermawan280502",
            username: "hermawan280502",
          },
          id: "233838",
          name: "Maps Location",
        },
      ],
      creator: {
        name: "Hermawan",
        permalink: "/hermawan280502",
        username: "hermawan280502",
      },
      id: "6985674",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985674",
      tags: ["flag", "location", "mark", "navigation", "pointer"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985674-200.png",
    },
    {
      attribution: "Flag by Hermawan from Noun Project",
      collections: [
        {
          creator: {
            name: "Hermawan",
            permalink: "/creator/hermawan280502",
            username: "hermawan280502",
          },
          id: "233838",
          name: "Maps Location",
        },
      ],
      creator: {
        name: "Hermawan",
        permalink: "/hermawan280502",
        username: "hermawan280502",
      },
      id: "6985670",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985670",
      tags: ["flag", "location", "mark", "navigation", "pointer"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985670-200.png",
    },
    {
      attribution: "Flag by ahmad sabani from Noun Project",
      collections: [],
      creator: {
        name: "ahmad sabani",
        permalink: "/ahmad3211",
        username: "ahmad3211",
      },
      id: "6985434",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985434",
      tags: ["flag", "banner", "country", "finish", "location", "mark"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985434-200.png",
    },
    {
      attribution: "Flag by ahmad sabani from Noun Project",
      collections: [],
      creator: {
        name: "ahmad sabani",
        permalink: "/ahmad3211",
        username: "ahmad3211",
      },
      id: "6985417",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985417",
      tags: ["flag", "banner", "country", "finish", "location", "mark"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985417-200.png",
    },
    {
      attribution: "Flag by ahmad sabani from Noun Project",
      collections: [],
      creator: {
        name: "ahmad sabani",
        permalink: "/ahmad3211",
        username: "ahmad3211",
      },
      id: "6985402",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985402",
      tags: ["flag", "banner", "country", "finish", "location", "mark"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985402-200.png",
    },
    {
      attribution: "Flag by ahmad sabani from Noun Project",
      collections: [],
      creator: {
        name: "ahmad sabani",
        permalink: "/ahmad3211",
        username: "ahmad3211",
      },
      id: "6985400",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985400",
      tags: ["flag", "banner", "country", "finish", "location", "mark"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985400-200.png",
    },
    {
      attribution: "Flag by Kim Sun Young from Noun Project",
      collections: [
        {
          creator: {
            name: "Kim Sun Young",
            permalink: "/hookeeak",
            username: "hookeeak",
          },
          id: "215870",
          name: "weather",
          permalink: "/hookeeak/collection/weather",
        },
      ],
      creator: {
        name: "Kim Sun Young",
        permalink: "/hookeeak",
        username: "hookeeak",
      },
      id: "6985392",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985392",
      tags: ["flag", "sign", "target", "weather", "wind"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985392-200.png",
    },
    {
      attribution: "Flag by Kim Sun Young from Noun Project",
      collections: [
        {
          creator: {
            name: "Kim Sun Young",
            permalink: "/hookeeak",
            username: "hookeeak",
          },
          id: "215870",
          name: "weather",
          permalink: "/hookeeak/collection/weather",
        },
      ],
      creator: {
        name: "Kim Sun Young",
        permalink: "/hookeeak",
        username: "hookeeak",
      },
      id: "6985387",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985387",
      tags: ["flag", "sign", "target", "weather", "wind"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985387-200.png",
    },
    {
      attribution: "Flag by Kim Sun Young from Noun Project",
      collections: [
        {
          creator: {
            name: "Kim Sun Young",
            permalink: "/hookeeak",
            username: "hookeeak",
          },
          id: "215870",
          name: "weather",
          permalink: "/hookeeak/collection/weather",
        },
      ],
      creator: {
        name: "Kim Sun Young",
        permalink: "/hookeeak",
        username: "hookeeak",
      },
      id: "6985380",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985380",
      tags: ["flag", "sign", "target", "weather", "wind"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985380-200.png",
    },
    {
      attribution: "Flag by Kim Sun Young from Noun Project",
      collections: [
        {
          creator: {
            name: "Kim Sun Young",
            permalink: "/creator/hookeeak",
            username: "hookeeak",
          },
          id: "215870",
          name: "weather",
        },
      ],
      creator: {
        name: "Kim Sun Young",
        permalink: "/hookeeak",
        username: "hookeeak",
      },
      id: "6985379",
      license_description: "creative-commons-attribution",
      permalink: "/term/flag/6985379",
      tags: ["flag", "sign", "target", "weather", "wind"],
      term: "Flag",
      thumbnail_url: "https://static.thenounproject.com/png/6985379-200.png",
    },
  ],
  next_page: "31302E302C36393835333739",
  total: 35849,
  usage_limits: {
    monthly: {
      limit: 5000,
      usage: 2,
    },
  },
};

export interface TheNounProjectIcon {
  attribution: string;
  collections: {
    creator: {
      name: string;
      permalink: string;
      username: string;
    };
    id: string;
    name: string;
    permalink: string;
  }[];
  creator: {
    name: string;
    permalink: string;
    username: string;
  };
  id: string;
  license_description: string;
  permalink: string;
  tags: string[];
  term: string;
  thumbnail_url: string;
}

export interface TheNounProjectIconResponse {
  icons: TheNounProjectIcon[];
  next_page: string;
  total: number;
  usage_limits: {
    monthly: {
      limit: number;
      usage: number;
    };
  };
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get("query") || "";

  const KEY = "f3d360de8ea44d73bb2af5c00569dc45";
  const SECRET = "9e8e44f3b0c24d52b2c97d88d5b3f57e";

  return new Promise((resolve, reject) => {
    const oauth = new OAuth.OAuth(
      "https://api.thenounproject.com",
      "https://api.thenounproject.com",
      KEY,
      SECRET,
      "1.0",
      null,
      "HMAC-SHA1"
    );

    oauth.get(
      "https://api.thenounproject.com/v2/icon?query=" + query,
      "",
      "",
      function (e, data, response) {
        if (e) {
          console.error(e);
          resolve(
            NextResponse.json(
              { error: "Failed to fetch data" },
              { status: 500 }
            )
          );
        } else {
          resolve(NextResponse.json(JSON.parse(data as string)));
        }
      }
    );
  }) as Promise<Response>;
}
