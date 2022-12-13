const axios = require("axios");
const fs = require("fs/promises");
const path = require("path");

const options = {
  method: "GET",
  url: "https://deezerdevs-deezer.p.rapidapi.com/search",
  params: { q: "tuan hung" },
  headers: {
    "X-RapidAPI-Key": "31c960e190msh53eac10e2323889p18e501jsn42f213ff05fe",
    "X-RapidAPI-Host": "deezerdevs-deezer.p.rapidapi.com",
  },
};

//5400939: son tung mtp
//10803980: blackpink
// ablum: [108710042, 147221692, 234168882]

async function main(artistIdSearch, albumIdSearch) {
  try {
    const response = await axios.request(options);
    if (response.data.error) {
      console.log("Loi roi");
      return;
    }
    let newData = response.data.data
      .map((el) => {
        return {
          id: el.id,
          title: el.title,
          titleShort: el.title_short,
          time: el.duration,
          src: el.preview,
          image: `https://e-cdns-images.dzcdn.net/images/cover/${el.md5_image}/250x250-000000-80-0-0.jpg`,
          rank: el.rank,
          artistId: el.artist.id,
          albumId: el.album.id,
        };
      })
      .filter((el) => {
        if (!artistIdSearch && !albumIdSearch) return true;
        else if (!albumIdSearch) {
          return el.artistId === artistIdSearch;
        } else {
          return (
            el.artistId === artistIdSearch && albumIdSearch.includes(el.albumId)
          );
        }
        //return true;
      });
    let urlNext = response.data.next;
    while (urlNext) {
      console.log(urlNext);
      let dataFakeRes = await axios.request({
        method: "GET",
        url: urlNext,
      });
      newData.push(
        ...dataFakeRes.data.data
          .map((el) => {
            return {
              id: el.id,
              title: el.title,
              titleShort: el.title_short,
              time: el.duration,
              src: el.preview,
              image: `https://e-cdns-images.dzcdn.net/images/cover/${el.md5_image}/250x250-000000-80-0-0.jpg`,
              rank: el.rank,
              artistId: el.artist.id,
              albumId: el.album.id,
            };
          })
          .filter((el) => {
            if (!artistIdSearch && !albumIdSearch) return true;
            else if (!albumIdSearch) {
              return el.artistId === artistIdSearch;
            } else {
              return (
                el.artistId === artistIdSearch &&
                albumIdSearch.includes(el.albumId)
              );
            }
          })
      );
      if (dataFakeRes.data.next) {
        urlNext = dataFakeRes.data.next;
      } else {
        urlNext = null;
      }
    }
    newData = uniq(newData);
    let albumIdList = newData.map((el) => el.albumId);
    console.log(oof(foo(albumIdList)));

    const pathFile = path.join(__dirname, "dataSong.json");
    await fs.writeFile(pathFile, JSON.stringify(newData));
    console.log("Length: ", newData.length);
  } catch (error) {
    console.error(error);
  }
}

main(2352221, [44903291, 44903361]);

function tranformData(data) {
  return data.map((el) => {
    return {
      title: el.title,
      duration: el.duration,
      src: el.preview,
      image: `https://e-cdns-images.dzcdn.net/images/cover/${el.md5_image}/250x250-000000-80-0-0.jpg`,
    };
  });
}

function requestRetry() {}

function foo(array) {
  let a = [],
    b = [],
    arr = [...array], // clone array so we don't change the original when using .sort()
    prev;

  arr.sort();
  for (let element of arr) {
    if (element !== prev) {
      a.push(element);
      b.push(1);
    } else ++b[b.length - 1];
    prev = element;
  }
  return [a, b];
}

function oof([a, b]) {
  let obj = {};
  a.forEach((el, index) => {
    if (b[index] >= 10) {
      obj[`${el}`] = b[index];
    }
  });
  return obj;
}

function uniq(a) {
  var seen = {};
  return a.filter(function (item) {
    return seen.hasOwnProperty(item.id) ? false : (seen[item.id] = true);
  });
}

// {
//   '114508662': 4,
//   '147221692': 12,
//   '233193502': 3,
//   '233193682': 2,
//   '233193992': 4,
//   '234169512': 13,
//   '301640567': 8,
//   '357000577': 7,
//   '357017397': 8
// }[108710042, 147221692, 234168882]
// { '108710042': 14, '147221692': 12, '234168882': 13 }
// { '62869222': 11, '153280322': 8, '363410117': 4 }

//getDataAlbum([62869222, 153280322, 363410117, 108710042, 147221692, 234168882]);
