import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    Button, Table, Alert, Container, Row, Col, Spinner
} from "react-bootstrap"
import 'bootstrap/dist/css/bootstrap.min.css';
import { toast } from 'react-toastify';

const Prices = (props) => {
    const refreshTime = 30;

    const [itemArray, setItems] = useState([])
    const [latestPriceObject, setLatestPriceObject] = useState({})

    const [hPriceObject, setHPriceObject] = useState({})

    const [refreshInterval, setRefreshInterval] = useState(refreshTime * 1000);

    const [searchFilter, setSearchFilter] = useState("")
    const [hideFilter, setHideFilter] = useState("500")
    const [highlightFilter, setHighlightFilter] = useState("1500")

    const notify = () => toast.info('Refreshing prices...', {
        position: "bottom-center",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        progress: undefined,
        pauseOnFocusLoss: false,
    });

    useEffect(() => {
        if (refreshInterval && refreshInterval > 0) {
            const interval = setInterval(fetchMetrics, refreshInterval);
            return () => clearInterval(interval);
        }
    }, [refreshInterval]);

    const fetchMetrics = () => {
        axios.get("https://prices.runescape.wiki/api/v1/osrs/latest").then(response => {
            setLatestPriceObject(response.data)
            console.log(latestPriceObject.data)
        }).catch(err => {
            console.log(err);
        })

        axios.get("https://prices.runescape.wiki/api/v1/osrs/1h").then(response => {
            setHPriceObject(response.data)
            console.log(hPriceObject.data)
        }).catch(err => {
            console.log(err);
        })

        notify()
    }

    useEffect(() => {
        axios.get("https://prices.runescape.wiki/api/v1/osrs/mapping").then(response => {
            console.log("items: " + response.data)
            setItems(response.data)
        }).catch(err => {
            console.log(err);
        })
    }, [latestPriceObject, hPriceObject]
    )


    useEffect(() => {
        axios.get("https://prices.runescape.wiki/api/v1/osrs/latest").then(response => {
            setLatestPriceObject(response.data)
            console.log(latestPriceObject.data)
        }).catch(err => {
            console.log(err);
        })
    }, []
    )

    useEffect(() => {
        axios.get("https://prices.runescape.wiki/api/v1/osrs/1h").then(response => {
            setHPriceObject(response.data)
            console.log(hPriceObject.data)
        }).catch(err => {
            console.log(err);
        })
    }, []
    )

    const searchSample = (event) => {
        setSearchFilter(event.target.value)
    }

    const searchHide = (event) => {
        setHideFilter(event.target.value)
    }

    const searchHighlight = (event) => {
        setHighlightFilter(event.target.value)
    }

    const filteredItems = itemArray.filter(sample =>
        sample.name.toLowerCase().includes(searchFilter.toLowerCase()));


    if (latestPriceObject.data === undefined || hPriceObject.data === undefined) {
        return (
            <div>
                loading
            </div>
        )
    } else {
        var latestKeyArr = Object.keys(latestPriceObject.data);
        var latestObjArr = Object.values(latestPriceObject.data);
        var latestValArr = latestObjArr.map((obj) => obj.high)

        var hourKeyArr = Object.keys(hPriceObject.data);
        var hourObjArr = Object.values(hPriceObject.data);
        var hourValArr = hourObjArr.map((obj) => obj.avgHighPrice)
        var hourVolArr = hourObjArr.map((obj) => obj.highPriceVolume)

        return (
            <div>
                <div class="container-fluid">
                    <div class="row p-3">
                            <h1>RWT sniper 9000</h1>
                    </div>
                </div>

                <div class="container">
                    <div class="row">
                        <div class="col m-1 p-1">
                            <div class="col">Hide under % diff: </div>
                            <div class="col">
                                <input class="text-center" placeholder="500" type="text" value={hideFilter} onChange={searchHide} />
                            </div>
                        </div>

                        <div class="col m-1 p-4">
                            <input class="text-center" placeholder="Search..." type="text" value={searchFilter} onChange={searchSample} />
                        </div>

                        <div class="col m-1 p-1">
                            <div class="col">Highlight over %: </div>
                            <div class="col">
                                <input class="text-center" placeholder="1000" type="text" value={highlightFilter} onChange={searchHighlight} />
                            </div>
                        </div>
                    </div>
                        
                </div>


                {/*latestValArr.map((key => <div>{key.high}</div>))*/}

                <Table striped bordered hover size="sm">
                    <thead>
                        <tr>
                            <th>Item id</th>
                            <th>Name</th>
                            <th>Price high latest</th>
                            <th>Price high 1h avg</th>
                            <th>% diff</th>
                            <th>Hourly volume (high price)</th>
                            <th>Potential transfer</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredItems.reverse().map(({ examine, id, members, lowalch, limit, value, highalch, icon, name }) => {
                            var latestIndex = latestKeyArr.findIndex((key) => key == id)
                            var hourIndex = hourKeyArr.findIndex((key) => key == id)

                            if (hourValArr[hourIndex] == null) {
                                return "";
                            }

                            if (((parseInt(latestValArr[latestIndex]) / parseInt(hourValArr[hourIndex])) * 100) < parseFloat(hideFilter)) {
                                return "";
                            }

                            if (((parseInt(latestValArr[latestIndex]) / parseInt(hourValArr[hourIndex])) * 100) > parseFloat(highlightFilter)) {
                                return (


                                    <tr key={id} class="text-danger">
                                        <td class="text-danger">{id}</td>
                                        <td class="text-danger">{name}</td>
                                        <td class="text-danger">{latestValArr[latestIndex]}</td>
                                        <td class="text-danger">{hourValArr[hourIndex]}</td>
                                        <td class="text-danger">{((parseInt(latestValArr[latestIndex]) / parseInt(hourValArr[hourIndex])) * 100).toFixed(0)} %</td>
                                        <td class="text-danger">{hourVolArr[hourIndex]}</td>
                                        <td class="text-danger">{parseInt(hourVolArr[hourIndex]) * parseInt(latestValArr[latestIndex])}</td>
                                    </tr>

                                )
                            }

                            



                            return (
                                <tr key={id}>
                                    <td>{id}</td>
                                    <td>{name}</td>
                                    <td>{latestValArr[latestIndex]}</td>
                                    <td>{hourValArr[hourIndex]}</td>
                                    <td>{((parseInt(latestValArr[latestIndex]) / parseInt(hourValArr[hourIndex])) * 100).toFixed(0)} %</td>
                                    <td>{hourVolArr[hourIndex]}</td>
                                    <td>{parseInt(hourVolArr[hourIndex]) * parseInt(latestValArr[latestIndex])}</td>
                                </tr>
                            )
                        }

                        )}
                    </tbody>
                </Table>
            </div>
        );
    }


}

export default Prices;
