import "./mainBox.css";
import { Prayers } from "./Prayers";
import moment from "moment";
import axios from "axios";
import { useState, useEffect } from "react";

export function MainBox() {

    const [city, setCity] = useState("الموصل");
    const [nextPrayer, setNextPrayer] = useState("...");
    const [nextPrayerTime, setNextPrayerTime] = useState("...");
    const [hijriDate, setHijriDate] = useState("...");
    const [gregorianDate, setGregorianDate] = useState("...");
    const [timings, setTimings] = useState({
        "Fajr": "...",
        "Dhuhr": "...",
        "Asr": "...",
        "Maghrib": "...",
        "Isha": "...",
    });

    const thePrayers = [
        {
            "imageP": "/public/mosque5.jpg",
            "nameP": "الفجر",
            "timeP": timings.Fajr
        },
        {
            "imageP": "/public/mosque3.jpg",
            "nameP": "الظهر",
            "timeP": timings.Dhuhr
        },
        {
            "imageP": "/public/mosque4.jpg",
            "nameP": "العصر",
            "timeP": timings.Asr
        },
        {
            "imageP": "/public/mosque2.jpg",
            "nameP": "المغرب",
            "timeP": timings.Maghrib
        },
        {
            "imageP": "/public/mosque1.jpg",
            "nameP": "العشاء",
            "timeP": timings.Isha
        },
    ];
    const thePrayersList = thePrayers.map((p, i) => {
        return <Prayers key={i} image={p.imageP} prayer={p.nameP} time={p.timeP}/>
    });

    const cities = [
        {
            "arName": "الموصل",
            "egName": "Mosul"
        },
        {
            "arName": "بغداد",
            "egName": "Baghdad"
        },
        {
            "arName": "البصرة",
            "egName": "Basrah"
        }
    ];
    const arNameList = cities.map((c, i) => {
        return <option key={i}>{c.arName}</option>
    });

    let theCity = "Mosul";
    
    for (const value of cities) {
        city == value.arName ? theCity = value.egName : null;
    };

    useEffect(() => {

        axios.get(`https://api.aladhan.com/v1/timingsByCity?city=${theCity}&country=Iraq&method=8`)
        .then(function (response) {
            // handle success
            let prayersTimes = response.data.data.timings;
            setTimings(prayersTimes);
            setHijriDate(response.data.data.date.hijri.date);
            setGregorianDate(response.data.data.date.gregorian.date);
        })
        .catch(function (error) {
            // handle error
            console.log(error);
        })
        // .finally(function () {
        //     // always executed
        // });

    }, [theCity]);

    // useEffect(() => { // تحتاج إلى فهم وتركيز في التعامل timer مسألة ال

    //     let interval = setInterval(() => {
    //         setTimer((decrease) => {
    //             return decrease - 1;
    //         });
    //     }, 1000);

    //     return () => { // لتنضيف ثم الاكمال في العد التنازلي، تجنباً لسلوكيات غريبة cleanUp هنا يتم عمل
    //         clearInterval(interval);
    //     };

    // }, []);

    useEffect(() => {

        let interval = setInterval(() => {
            nextPrayerCounter();
        }, 1000);

        return () => {
            clearInterval(interval);
        };

    }, [timings]);

    function nextPrayerCounter() {

        let momentNow = moment();

        let midnight = moment("00:00:00", "hh:mm:ss");

        let fajrTime = moment(timings.Fajr, "hh:mm");
        let dhuhrTime = moment(timings.Dhuhr, "hh:mm");
        let asrTime = moment(timings.Asr, "hh:mm");
        let maghribTime = moment(timings.Maghrib, "hh:mm");
        let ishaTime = moment(timings.Isha, "hh:mm");

        let remainingTime = null;

        switch (true) {
            case (momentNow.isAfter(ishaTime) || momentNow.isBetween(midnight, fajrTime)):
                setNextPrayer("الفجر")

                let lastSecondInTheDay = moment("23:59:59", "hh:mm:ss").diff(momentNow); // هنا تم جلب فرق وقت آخر ثانية في اليوم إلى الوقت الحالي
                let firstSecondInTheDay = moment(fajrTime).diff(midnight); // هنا تم جلب فرق وقت صلاة الفجر إلى وقت متصف الليل
                let theTotal = lastSecondInTheDay + firstSecondInTheDay; // هنا تم جلب إجمالي الوقتان

                remainingTime = theTotal;
                break;

            case (momentNow.isBetween(fajrTime, dhuhrTime)):
                setNextPrayer("الظهر")
                remainingTime =  moment(dhuhrTime).diff(momentNow);
                break;

            case (momentNow.isBetween(dhuhrTime, asrTime)):
                setNextPrayer("العصر")
                remainingTime =  moment(asrTime).diff(momentNow);
                break;

            case (momentNow.isBetween(asrTime, maghribTime)):
                setNextPrayer("المغرب")
                remainingTime =  moment(maghribTime).diff(momentNow);
                break;

            case (momentNow.isBetween(maghribTime, ishaTime)):
                setNextPrayer("العشاء")
                remainingTime =  moment(ishaTime).diff(momentNow);
                break;
        };

        let remainingHours = moment.duration(remainingTime).hours();
        let remainingMinutes = moment.duration(remainingTime).minutes();
        let remainingSeconds = moment.duration(remainingTime).seconds();

        let remainingHMS = `${remainingHours}:${remainingMinutes}:${remainingSeconds}`;

        setNextPrayerTime(remainingHMS);
        
    };

    return (
        <div className="mainBox">
            <header>
                <h1>مدينة {city}</h1>
                
                <div className="box one">
                    <h3>التاريخ الميلادي</h3>
                    <b>{gregorianDate}</b>
                </div>

                <div className="box two">
                    <h3>التاريخ الهجري</h3>
                    <b>{hijriDate}</b>
                </div>
            </header>

            <section className="sec-1">
                <div className="box">
                    <h2 dir="rtl">المتبقي حتى صلاة {nextPrayer}</h2>
                    <b>{nextPrayerTime}</b>
                </div>

                <div className="cards">
                    {thePrayersList}
                </div>
            </section>

            <section className="sec-2">
                <select value={city} onChange={(e) => {setCity(e.target.value)}} title="تغير المدينة">
                    {arNameList}
                </select>

                <img className="compass" src="/public/compass.png" alt="Compass" title="Select the location"/>
            </section>

            <footer>
                <a href="https://github.com/AhmadAlhadidi95" target="_blank" rel="noopener noreferrer" title="Visit my Github">
                    <i className="fa-brands fa-github"/>
                </a>

                <a href="https://alhadidi95.netlify.app/#contact-me" target="_blank" rel="noopener noreferrer" title="Visit my website">
                    <img src="/public/My-sign.png" alt="My-sign"/>
                </a>

                <a href="https://twitter.com/AhmadAlhadidi95" target="_blank" rel="noopener noreferrer" title="Visit my X">
                    <i className="fa-brands fa-x-twitter"/>
                </a>
            </footer>
        </div>
    )
};