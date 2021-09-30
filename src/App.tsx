import React, { useEffect, useState } from 'react';
import { Timer } from "./utils/Timer"
import axios from 'axios';
import { Button, Card, Modal } from 'react-bootstrap';
import './App.css';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

function App() {
  const [total, setTotal] = useState(0);
  const [objectIDs, setObjectIDs] = useState([]);
  const [info, setInfo] = useState({ title: "", primaryImage: "", artistDisplayName: "", accessionYear: "", creditLine: "", objectURL: "" });
  const [index, setIndex] = useState(0);
  const [timer, setTimer] = useState(new Timer(() => { setIndex((prevIndex) => (prevIndex + 1)) }, 10000))
  const [show, setShow] = useState(false);

  useEffect(() => {
    axios.get('https://collectionapi.metmuseum.org/public/collection/v1/objects')
      .then(function ({ data }) {
        // console.log(data)
        const { total, objectIDs } = data
        setTotal(total)
        setObjectIDs(objectIDs)
      }).then(() => {
        changeArtwork(1)
        timer.start()
      })
      .catch(function (error) {
        console.log(error);
      })
    return () => timer.pause();
  }, []);

  useEffect(() => {
    if (total) {
      changeArtwork(objectIDs[index % total])
    }
  }, [index]);

  const changeArtwork = (i: number) => {
    axios.get(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${i}`)
      .then(function ({ data }) {
        console.log(data)
        setInfo(data)
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  const handleClose = () => {
    setShow(false)
    timer.resume()

  }
  const handleShow = () => {
    setShow(true)
    timer.pause()
  }

  return (
    <div className="App">
      <div className="frame">
        <img src={info.primaryImage} alt={info.title} onClick={handleShow} />

        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>{info.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Card>
              <Card.Body>
                <Card.Title>{info.artistDisplayName}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{info.accessionYear}</Card.Subtitle>
                <Card.Text>
                  {info.creditLine}
                </Card.Text>
                <a href={info.objectURL}>learn more</a>
              </Card.Body>
            </Card>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

      </div>
    </div>
  );
}

export default App;
