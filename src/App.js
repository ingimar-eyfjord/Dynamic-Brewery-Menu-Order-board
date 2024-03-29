import React, { useState, useEffect, useRef } from "react";
import './index.css';
import Rows from "./components/dashBoad/row"
import Queue from "./components/dashBoad/queue"
import DownloadInfo from "./components/dashBoad/downloadInfo"

function App() {
  const URL = "https://finalfoobarapp.herokuapp.com/"
  const Beers = "https://finalfoobarapp.herokuapp.com/beertypes"
  const bartendersArray = []
  const [bartenders, setBartenders] = useState(bartendersArray)
  const queueArray = []
  const [queue, setQueue] = useState(queueArray)
  const servingArray = []
  const [serving, setServing] = useState(servingArray)
  const storageArray = []
  const [storage, setStorage] = useState(storageArray)
  const tapsArray = []
  const [taps, setTaps] = useState(tapsArray)
  const beersArray = []
  const [beers, setBeers] = useState(beersArray)

  function Counter() {

    useInterval(() => {
      fetch(URL, {
        method: "get",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      }).then(res => res.json()).then(data => setData(data));
      function setData(data) {
        setBartenders(data.bartenders)
        setServing(data.serving)
        setStorage(data.storage)
        setTaps(data.taps)
        setQueue(data.queue)
      }
    }, 10000);
  }

  function useInterval(callback, delay) {
    const savedCallback = useRef();

    // Remember the latest function.
    useEffect(() => {
      savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
      function tick() {
        savedCallback.current();
      }
      if (delay !== null) {
        let id = setInterval(tick, delay);
        return () => clearInterval(id);
      }
    }, [delay]);
  }
  Counter()

  let thisPop = []
  useEffect(() => {
    fetch(Beers, {
      method: "get",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }).then(res => res.json()).then(data => setBeers(data));
  }, [])

  let popularArr = []
  const [popular, setpopular] = useState(popularArr)

  let pupularListArr = []
  const [pupularList, setpopularList] = useState(pupularListArr)
  pupularList.sort(function (a, b) {
    const textA = a.Ordered;
    const textB = b.Ordered;
    return (textA > textB) ? -1 : (textA < textB) ? 1 : 0;
  });
  useEffect(() => {
    if (popular.length != 0 && queue.length != 0) {

      const q = [...queue];
      const p = [...popular];
      const arr = p.concat(q)
      const seen = new Set();
      const filteredArr = arr.filter(el => {
        const duplicate = seen.has(el.id);
        seen.add(el.id);
        return !duplicate;
      });
      setpopular(filteredArr)
    } else if (popular.length == 0) {
      setpopular(popular.concat(queue))
    }
  }, [queue])


  useEffect(() => {
    const populars = [...popular]
    if (populars.length > 0) {
      let orders = []
      populars.forEach(e => {
        orders.push(e.order)
      })
      let counts = {};
      const merged = orders.flat(1)
      merged.forEach(function (x) { counts[x] = (counts[x] || 0) + 1; });
      const beerNames = Object.keys(counts)
      const howManay = Object.values(counts)
      let array = []
      for (let i = 0; i < beerNames.length; i++) {
        let order = {
          Name: beerNames[i],
          Ordered: howManay[i]
        }
        array.push(order)
      }
      setpopularList(array)
    }

  }, [popular])

  const [popPlace, setpopPlace] = useState(storageArray)
  useEffect(() => {
    for (let i = 0; i < 3; i++) {
      thisPop.push(pupularList[i])
    }
    if (thisPop.length === 3 && thisPop[0] != undefined || thisPop.length === 3 && !thisPop[1] === undefined) {
      if (thisPop[2] !== undefined) {
        function makeJSON(arr2) {
          let arr = [
            {
              name: arr2[0].Name,
              place: 1,
            },
            {
              name: arr2[1].Name,
              place: 2
            },
            {
              name: arr2[2].Name,
              place: 3,
            }
          ]
          postData(arr)
          setpopPlace(arr)
        }
        makeJSON(thisPop)
      }
    }

    function postData(string) {
      fetch("https://foobarorders-577e.restdb.io/rest/popular", {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
          "x-apikey": "5ecd2b70ae488b280ef33345",
          "cache-control": "no-cache"
        }
      }).then(res => res.json().then(data => deleteData(data)))

      function deleteData(data) {
        let array = []
        data.forEach(e => {
          array.push(e._id)
        })

        console.log(string)
        for (let i = 0; i <= 2; i++) {


          fetch(`https://foobarorders-577e.restdb.io/rest/popular/` + array[i] + ``, {
            method: "put",
            headers: {
              "Content-Type": "application/json; charset=utf-8",
              "x-apikey": "5ecd2b70ae488b280ef33345",
              "cache-control": "no-cache"
            },
            body: JSON.stringify(string[i])
          }).then(res => res.json().then(data => console.log(data)))
        }
      }
    }
  }, [queue])




  return (
    <div className="App">
      <Rows popPlace={popPlace} popular={popular} pupularList={pupularList} beers={beers} taps={taps} />
      <Queue serving={serving} bartenders={bartenders} queue={queue} />
      {/* <DownloadInfo /> */}
    </div>
  );
}

export default App;
