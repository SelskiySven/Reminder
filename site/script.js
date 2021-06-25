function start() {
    document.getElementById("start2").style.display = "block"
    document.getElementById("start3").style.display = "none"
    addevents()
}
    let lines = document.querySelectorAll(".event")
    let maxeventname = 0
    let audio = new Audio("alert.mp3")
    audio.loop = "true"
    let now, year, mounth, day, fulldate, normaldate, hour, minute, fulltime, newdatetime, newdate, newtime
    let tomorrowcreated = false, yesterdaycreated = false, musicplay = false

    function dateupdate(updateitems = false, newdate = 0 * 6e4) {
        now1 = new Date
        now = new Date(+now1 + newdate)
        year = now.getFullYear()
        mounth = now.getMonth() + 1
        mounth = mounth.toString()
        if (mounth.length == 1) {
            mounth = 0 + mounth
        }
        day = now.getDate().toString()
        if (day.length == 1) {
            day = 0 + day
        }
        fulldate = year + "-" + mounth + "-" + day
        normaldate = day + "." + mounth + "." + year
        hour = now.getHours().toString()
        if (hour.length == 1) {
            hour = 0 + hour
        }
        minute = now.getMinutes().toString()
        if (minute.length == 1) {
            minute = 0 + minute
        }
        fulltime = hour + ":" + minute
        if (updateitems) {
            document.getElementById("date").value = fulldate
            document.getElementById("time").value = fulltime
        }
        let datetime = document.getElementsByClassName("datetime")
        for (let i = 0; i < datetime.length; i++) {
            if (fulldate.replaceAll("-", "") + fulltime.replaceAll(":", "") > datetime[i].innerText | fulldate.replaceAll("-", "") + fulltime.replaceAll(":", "") == datetime[i].innerText) {
                datetime[i].parentNode.classList.add('alertcolor')
                datetime[i].previousSibling.previousSibling.style.display = ""
            } else {
                datetime[i].parentNode.classList.remove("alertcolor")
            }
        }
        setTimeout(() => {
            if (document.getElementsByClassName("alertcolor").length > 0 & !musicplay) {
                musicplay = true
                //Включаем музыку
                audio.play()
            }
            if (document.getElementsByClassName("alertcolor").length == 0 & musicplay) {
                musicplay = false
                //Выключаем музыку
                audio.pause()
            }
        }, 100);
        return [parseInt(fulldate.replaceAll("-", "") + fulltime.replaceAll(":", "")), fulldate, fulltime]
    }
    dateupdate(true)
    let updatedate = setInterval(dateupdate, 60000)


    function addevents() {
        for (let i = document.querySelectorAll(".event").length - 1; i >= 0; i--) {
            document.querySelectorAll(".event")[i].remove()
        }
        if (localStorage.getItem("numevents") == null) {
            localStorage.setItem("numevents", 0)
            numevents = 0
        } else {
            numevents = parseInt(localStorage.getItem("numevents"))
        }
        lines = document.querySelectorAll(".event")
        for (let i = 0; i < numevents; i++) {
            add(localStorage.getItem("eventname" + i), localStorage.getItem("eventtime" + i), localStorage.getItem("eventdate" + i), true, i)
        }
        let tables = document.querySelectorAll("tbody")
        for(let i=tables.length-1;i>=0;i--){
            if(tables[i].childNodes.length == 1){
                tables[i].parentNode.remove()
            }
        }
    }
    dateupdate(true)

    function add(event = document.getElementById("event").value, time = document.getElementById("time").value, date = document.getElementById("date").value, addfromls = false, lsnum) {
        event =  document.getElementById("event").value
        if(addfromls){
            event=localStorage.getItem("eventname" + lsnum)
        }
        let error = false
        if (!addfromls) {
            if (time == "") {
                alert("Введите время")
                error = true
            }
            if (date < fulldate) {
                alert("Введите корректную дату")
                error = true
            }
            if (date == fulldate & time < fulltime & error == false) {
                alert("Введите корректное время")
                error = true
            }
        }
        if (error == false) {
            if (!addfromls) {
                localStorage.setItem("eventname" + numevents, event)
                localStorage.setItem("eventdate" + numevents, date)
                localStorage.setItem("eventtime" + numevents, time)
                numevents++
                localStorage.removeItem("numevents")
                localStorage.setItem("numevents", numevents)
            }
            let letgo = true
            let table
            if (date == fulldate) {
                table = document.getElementById("today")
                letgo = false
            }
            if (year == date.slice(0, 4) & mounth == date.slice(5, 7) & parseInt(day) + 1 == parseInt(date.slice(8, 10))) {
                if (document.getElementById("tomorrow") == null) {
                    let newtable = document.createElement("table")
                    newtable.id = "table.tomorrow"
                    if (document.querySelectorAll("#table table").length == 1) {
                        document.getElementById("table").append(newtable)
                    } else {
                        document.getElementById("table").insertBefore(newtable, document.getElementById("today").parentNode.nextSibling)
                    }
                    let tbody = document.createElement("tbody")
                    tbody.id = "tomorrow"
                    tbody.className = "eventtable"
                    document.getElementById("table.tomorrow").append(tbody)
                    let tr = document.createElement("tr")
                    tr.id = "trtomorrow"
                    document.getElementById("tomorrow").append(tr)
                    let td = document.createElement("td")
                    td.innerText = "Завтра"
                    document.getElementById("trtomorrow").append(td)
                }
                table = document.getElementById("tomorrow")
                letgo = false
                tomorrowcreated = true
            }
            if (year == date.slice(0, 4) & mounth == date.slice(5, 7) & parseInt(day) - 1 == parseInt(date.slice(8, 10))) {
                if (document.getElementById("yesterday") == null) {
                    let newtable = document.createElement("table")
                    newtable.id = "table.yesterday"
                    document.getElementById("table").insertBefore(newtable, document.getElementById("today").parentNode)
                    let tbody = document.createElement("tbody")
                    tbody.id = "yesterday"
                    tbody.className = "eventtable"
                    document.getElementById("table.yesterday").append(tbody)
                    let tr = document.createElement("tr")
                    tr.id = "tryesterday"
                    document.getElementById("yesterday").append(tr)
                    let td = document.createElement("td")
                    td.innerText = "Вчера"
                    document.getElementById("tryesterday").append(td)
                }
                table = document.getElementById("yesterday")
                letgo = false
                yesterdaycreated = true
            }
            if (letgo) {
                if (document.getElementById("date" + date.replaceAll("-", "")) == null) {
                    let newtable = document.createElement("table")
                    newtable.id = "tabledate" + date.replaceAll("-", "")
                    let addnewtable = true
                    let dates = document.getElementById("table").children
                    let k = 0
                    for (let i = 0; i < dates.length; i++) {
                        if (dates[i].id == "table.today") {
                            k = i
                            break
                        }
                    }
                    if (date.replaceAll("-", "") < year + mounth + day) {
                        if (yesterdaycreated) {
                            k--
                        }
                        for (let i = 0; i < k; i++) {
                            if (newtable.id < dates[i].id) {
                                document.getElementById("table").insertBefore(newtable, dates[i])
                                addnewtable = false
                                break
                            }
                        }
                        if (addnewtable) {
                            if (yesterdaycreated) {
                                document.getElementById("table").insertBefore(newtable, document.getElementById("table.yesterday"))
                            } else {
                                document.getElementById("table").insertBefore(newtable, document.getElementById("table.today"))
                            }
                        }
                    } else {
                        if (tomorrowcreated) {
                            k++
                        }
                        for (let i = k; i < dates.length; i++) {
                            if (newtable.id < dates[i].id) {
                                addnewtable = false
                                document.getElementById("table").insertBefore(newtable, document.getElementById(dates[i].id))
                                break
                            }
                        }
                        if (addnewtable) {
                            document.getElementById("table").append(newtable)
                        }
                    }
                    let tbody = document.createElement("tbody")
                    tbody.id = "date" + date.replaceAll("-", "")
                    tbody.className = "eventtable"
                    document.getElementById("tabledate" + date.replaceAll("-", "")).append(tbody)
                    let tr = document.createElement("tr")
                    tr.id = "trdate" + date.replaceAll("-", "")
                    document.getElementById("date" + date.replaceAll("-", "")).append(tr)
                    let td = document.createElement("td")
                    td.innerText = date.slice(8, 10) + "." + date.slice(5, 7) + "." + date.slice(0, 4)
                    document.getElementById("trdate" + date.replaceAll("-", "")).append(td)
                }
                table = document.getElementById("date" + date.replaceAll("-", ""))
            }
            let liness = document.querySelectorAll("#" + table.id + " tr")
            let newline = document.createElement("tr")
            newline.id = "line" + lines.length
            newline.className = "event"
            if (liness.length == 1) {
                table.append(newline)
            } else {
                let i = 1
                let notmax = true
                while (time > liness[i].childNodes[1].innerText & notmax) {
                    i++
                    if (i == liness.length) {
                        notmax = false
                        break
                    }
                }
                if (notmax == false) {
                    table.append(newline)
                } else {
                    table.insertBefore(newline, liness[i])
                }
            }
            newline = document.getElementById("line" + lines.length)
            let newevent = document.createElement("td")
            let newtime = document.createElement("td")
            let close = document.createElement("button")
            let postpone = document.createElement("select")
            let numberofevent = document.createElement("div")
            let datetime = document.createElement("div")
            newevent.innerText = event
            newevent.className = "evname"
            newtime.innerText = time
            close.id = "close" + lines.length
            close.innerText = "x"
            close.onclick = function () {
                numevents--
                localStorage.removeItem("numevents")
                localStorage.setItem("numevents", numevents)
                let numevent = parseInt(this.nextSibling.nextSibling.innerText)
                for (let i = numevent + 1; i < numevents + 1; i++) {
                    localStorage.removeItem("eventname" + parseInt(i - 1))
                    localStorage.removeItem("eventdate" + parseInt(i - 1))
                    localStorage.removeItem("eventtime" + parseInt(i - 1))
                    localStorage.setItem("eventname" + parseInt(i - 1), localStorage.getItem("eventname" + i))
                    localStorage.setItem("eventdate" + parseInt(i - 1), localStorage.getItem("eventdate" + i))
                    localStorage.setItem("eventtime" + parseInt(i - 1), localStorage.getItem("eventtime" + i))
                }
                localStorage.removeItem("eventname" + numevents)
                localStorage.removeItem("eventdate" + numevents)
                localStorage.removeItem("eventtime" + numevents)
                lines = document.querySelectorAll(".event")
                if (this.parentNode.parentNode.childNodes.length == 2) {
                    this.parentNode.parentNode.parentNode.remove()
                } else {
                    document.getElementById(this.id).parentElement.remove()
                }
                dateupdate()
            }
            if (addfromls) {
                numberofevent.innerText = lsnum
            } else {
                numberofevent.innerText = numevents - 1
            }
            postpone.innerHTML = "<option selected>Отложить на</option><option value='1'>10 минут</option><option value='2'>30 минут</option><option value='3'>1 час</option><option value='4'>4 часа</option>"
            postpone.style.display = "none"
            postpone.onchange = function () {
                switch (this.value) {
                    case '1':
                        newdatetime = dateupdate(false, 10 * 6e4)
                        break
                    case '2':
                        newdatetime = dateupdate(false, 30 * 6e4)
                        break
                    case '3':
                        newdatetime = dateupdate(false, 60 * 6e4)
                        break
                    case '4':
                        newdatetime = dateupdate(false, 240 * 6e4)
                        break
                }
                newdate = newdatetime[1]
                        newtime = newdatetime[2]
                        localStorage.removeItem("eventdate" + this.nextSibling.innerText)
                        localStorage.setItem("eventdate" + this.nextSibling.innerText, newdate)
                        localStorage.removeItem("eventtime" + this.nextSibling.innerText)
                        localStorage.setItem("eventtime" + this.nextSibling.innerText, newtime)
                        this.style.display = "none"
                        addevents()
                        dateupdate()
            }
            numberofevent.style.display = "none"
            datetime.innerText = date.replaceAll("-", "") + time.replaceAll(":", "")
            datetime.className = "datetime"
            datetime.style.display = "none"
            let empty = document.createElement("td")
            empty.className = "lastchild"
            newline.append(newevent, newtime, close, postpone, numberofevent, datetime, empty)
            if (document.getElementsByClassName("evname")[document.getElementsByClassName("evname").length-1].offsetWidth > maxeventname) {
                maxeventname = document.getElementsByClassName("evname")[lines.length].offsetWidth
            }
            let evnames = document.getElementsByClassName("evname")
            for (let i = 0; i < evnames.length; i++) {
                evnames[i].style.width = maxeventname + "px"
            }
            document.getElementById("event").value = ""
            lines = document.querySelectorAll(".event")
        }
        dateupdate()
    }

    document.getElementById("start").onclick=start
    document.getElementById("add").onclick=add