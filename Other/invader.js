/* Commands to execute: 
sudo npm i convert-array-to-csv
sudo npm install node-fetch
*/

/* TODO:
- Make sure location is correct
- sort out in chunk of 50
- separate the file in pieces of 50
*/

const fetch = require("node-fetch");
const jsonexport = require("jsonexport");

const RESULT_PER_PAGE = 60;
const START_PAGE = 1; // Typically starts at 1 ends at 70
const FILE_NAME = "output_invader_3";
const URL =
  "https://www.flickr.com/groups/spaceinvaders-paris/pool/map?mode=group";
const APISIG = "7bbe7fa0d8332f40aa965e2b2f7ac124";
const APIKEY = "a6b37b9f10ec9a0cc4ccfb0385db8a9f";
const TYPE_OF_FILE = "csv"; // Can be json or csv
const TYPE_OF_QUERY = "mapstr"; // Can be default or mapstr
const SORTED = true; // Can be true or false, true: remove duplicate and sort by name

let finalArray = new Array();
let nbOfPages = 0;

const writeOutputFile = (type) => {
  if (SORTED) {
    // Remove duplicates
    finalArray.reduceRight((acc, obj, i) => {
      acc[obj.name] ? finalArray.splice(i, 1) : (acc[obj.name] = true);
      return acc;
    }, Object.create(null));
    // Sort by name
    finalArray.sort((a, b) => a.name - b.name);
  }
  if (type === "csv") {
    jsonexport(finalArray, function(err, csv) {
      if (err) return console.error(err);
      require("fs").writeFile("./" + FILE_NAME + ".csv", csv, function(err) {
        if (err) {
          console.error("Crap happens");
        } else {
          console.error("CSV " + FILE_NAME + " saved!");
        }
      });
    });
  } else {
    require("fs").writeFile(
      "./" + FILE_NAME + ".json",
      JSON.stringify(finalArray),
      function(err) {
        if (err) {
          console.error("Crap happens");
        } else {
          console.error("JSON " + FILE_NAME + " saved!");
        }
      }
    );
  }
};

const cleanData = (array) => {
  for (let i = array.length - 1; i >= 0; i--) {
    // Output most of the fields
    if (TYPE_OF_QUERY === "default") {
      let cleanObj = {
        title: array[i].title,
        ownername: array[i].ownername,
        latitude: array[i].latitude,
        longitude: array[i].longitude,
        url:
          "https://www.flickr.com/photos/" + array[i].owner + "/" + array[i].id,
        cover:
          "https://live.staticflickr.com/" +
          array[i].server +
          "/" +
          array[i].id +
          "_" +
          array[i].secret +
          "_m.jpg",
      };
      if (array[i].title.includes("PA_")) {
        if (array[i].title.match(/\((.*)\)/)) {
          cleanObj["name"] = array[i].title
            .match(/\((.*)\)/)
            .pop()
            .includes("PA_")
            ? parseInt(
                array[i].title
                  .match(/\((.*)\)/)
                  .pop()
                  .slice(3)
              )
            : "";
        } else {
          cleanObj["name"] = "";
        }
      } else {
        cleanObj["name"] = "";
      }
      finalArray.push(cleanObj);
    } else {
      // Must include PA_ in parentheses to be added
      if (array[i].title.includes("PA_")) {
        if (array[i].title.match(/\((.*)\)/)) {
          if (
            array[i].title
              .match(/\((.*)\)/)
              .pop()
              .includes("PA_")
          ) {
            const cleanObj = {
              name: parseInt(
                array[i].title
                  .match(/\((.*)\)/)
                  .pop()
                  .slice(3)
              ),
              address: array[i].latitude + ", " + array[i].longitude,
              lat: array[i].latitude,
              lng: array[i].longitude,
              comment:
                array[i].title +
                " https://live.staticflickr.com/" +
                array[i].server +
                "/" +
                array[i].id +
                "_" +
                array[i].secret +
                "_m.jpg",
              website:
                "https://www.flickr.com/photos/" +
                array[i].owner +
                "/" +
                array[i].id,
            };
            finalArray.push(cleanObj);
          }
        }
      }
    }
  }
};

const makeRequest = (pageNb, nbOfPages) => {
  fetch("https://www.flickr.com/services/rest", {
    headers: {
      accept: "*/*",
      "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      "cache-control": "no-cache",
      "content-type": "application/x-www-form-urlencoded",
      pragma: "no-cache",
      "sec-fetch-dest": "empty",
      "sec-fetch-mode": "cors",
      "sec-fetch-site": "same-origin",
    },
    referrer: URL,
    referrerPolicy: "no-referrer-when-downgrade",
    body:
      "api_sig=" +
      APISIG +
      "&page=" +
      pageNb +
      "&per_page=" +
      RESULT_PER_PAGE +
      "&group_id=919144%40N22&has_geo=1&radius=10mi&sort=date-posted-desc&extras=owner_name%2Cgeo%2Cmedia&format=json&nojsoncallback=1&ticket_number=1&min_taken_date=1970-01-01%2000%3A00%3A00&method=flickr.photos.search&src=js&api_key=" +
      APIKEY +
      "&auth_hash=f3d3d693d40a039dafbf8c4c46df978e869778c67f949dfae134316702bb540f&auth_token=&cb=1597683449453",
    method: "POST",
    mode: "cors",
  })
    .then((res) => {
      if (res.status >= 400) {
        throw new Error("Bad response from server");
      }
      return res.json();
    })
    .then((data) => {
      if (data.message) {
        console.log(data.message);
      } else {
        let nbOfPages = data.photos.pages;
        // End of loop
        if (pageNb === nbOfPages) {
          writeOutputFile(TYPE_OF_FILE);
        } else {
          // if (cleanArray(data.photos.photo).length !== 0) {
          //   finalArray.push(cleanArray(data.photos.photo));
          // }
          cleanData(data.photos.photo);
          makeRequest(pageNb + 1);
        }
      }
    })
    .catch((err) => {
      console.error(err);
    });
};

makeRequest(START_PAGE);
