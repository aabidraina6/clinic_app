import React, { useEffect, useState } from "react";
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from "mdb-react-ui-kit";
import "./App.css";
import useWebSocket from "react-use-websocket";
const WS_URL = "ws://localhost:4001";

export default function Dashboard() {
  const ws = new WebSocket("ws://localhost:4001");

  ws.onopen = () => {
    console.log("WebSocket connection established.");
  };

  ws.onmessage = (message) =>{
    // console.log("message ", message)
  }
  const sendMessage = (data) => {
    // console.log('sending datqa')
    ws.send(JSON.stringify(data))
  }

  const [patientData, setPatientData] = useState({});

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

 

  const fetchData = async () => {
    const res = await fetch("/api/get_all", {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      credentials: "include",
    });
    const data = await (await res).json();
    setPatientData(data);
    // console.log(data);
    
    // console.log(data)
  };

  const generateToken = async () => {
    console.log("generate pressed");
    const res = await fetch("/api/add_patient", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        phone,
      }),
    });
    // const status = res.status;
    // console.log(status)
    if (res.status === 200) window.location.reload();
  };

  const nextToken = async () => {
    const res = await fetch("api/change_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (res.status === 203) {
      alert("no patients left");

      window.location.reload();
    } else {
      // alert("token changed");
      const data = await res.json();
      console.log(typeof data, data);
      // ws.send(data)
      await sendMessage(data)
      // triggerEvent(data);
      window.location.reload()
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  // console.log(patientData);
  const listItems = Object.keys(patientData).map((itr, key) => {
    // console.log(item)
    const item = patientData[itr];
    return (
      <tr
        key={item.id}
        style={{ backgroundColor: item.isactive ? "lightgreen" : "" }}
      >
        <th scope="row">{key + 1}</th>
        <td style={{ textAlign: "center" }}>{item.name}</td>
        <td style={{ textAlign: "center" }}>{item.phone}</td>
        <td style={{ textAlign: "center" }}>{item.token}</td>
      </tr>
    );
  });

  // console.log(listItems);

  return (
    <div>
      <div className="App">
        <h1 className="App">Token Dashboard for Doctor's Clinic</h1>
        <div className="table-container">
          <MDBTable
            style={{
              backgroundColor: "lightblue",
            }}
          >
            <MDBTableHead dark className="sticky-header">
              <tr>
                <th scope="col">S. No</th>
                <th scope="col">NAME</th>
                <th scope="col">PHONE</th>
                <th scope="col">TOKEN</th>
              </tr>
            </MDBTableHead>
            <MDBTableBody>{listItems}</MDBTableBody>
          </MDBTable>
        </div>
        <br></br>
        <MDBBtn color="success" onClick={nextToken}>
          NEXT TOKEN
        </MDBBtn>
        <br></br>
        <br></br>
      </div>
      <div className="App">
        <h2>Add Patient</h2>
      </div>

      <div
        className="App"
        style={{
          display: "flex",
          maxWidth: "60%",
          margin: "0 auto",
          justifyContent: "center",
        }}
      >
        <input
          type="text"
          placeholder="Patient's Name"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
          style={{ marginRight: "10px" }}
        />
        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
          }}
          style={{ marginRight: "10px" }}
        />
        <MDBBtn
          onClick={() => {
            if (name.length > 0 && phone.length > 0) generateToken();
          }}
        >
          Generate Token
        </MDBBtn>
      </div>
    </div>
  );
}
