/* eslint-disable no-lone-blocks */
import React, {useState} from 'react'
import {CaretDown, CaretUp} from "grommet-icons";
import {render} from 'react-dom'
import SockJsClient from 'react-stomp'
import 'bootstrap/dist/css/bootstrap.min.css'
import Col from 'react-bootstrap/Col'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'


import {Box, Button, Select} from 'grommet'
import './App.css'

export function WelcomeContainer() {
    const [floorsNumber, setFloorsNumber] = useState('2')
    const [elevatorsNumber, setElevatorsNumber] = useState('1')
    const [inicialized, setIfinicialized] = useState(0)
    const [positions, setPositions] = useState(0)
    const [A, setA] = useState(0)
    const [B, setB] = useState(0)
    const [C, setC] = useState(0)
    const [D, setD] = useState(0)
    const [E, setE] = useState(0)


    function InstallElevators() {
        document.getElementById('Lifts').style.display = 'block'
        document.getElementById('Select').style.display = 'none'

        fetch('http://localhost:8080/api/rest/v1/install?numberOfElevators=' + elevatorsNumber
            + '&numberOfFloors=' + floorsNumber, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });

        setTimeout(function () {
            setIfinicialized(true);
        }, 1000);


    }


    function reply_click_onFloor(clicked_id) {

        var array = clicked_id.split(" ")
        var Direction = array[0]
        var Floor = parseInt(array[1])

        fetch('http://localhost:8080/api/rest/v1/call?floor=' + Floor
            + '&direction=' + Direction, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });

        {
            ;[...Array(parseInt(elevatorsNumber))].map((e, x) => {
            return [...Array(parseInt(floorsNumber))].map((e, i) => {
                return (document.getElementById(
                    `e${x}${floorsNumber - i - 1}`
                ).style.backgroundColor = 'white')
            })
        })
        }

    }


    function reply_click_inElevator(clicked_id) {

        var array = clicked_id.split(" ")
        var ElevatorId = array[0]
        var Floor = parseInt(array[1])

        fetch('http://localhost:8080/api/rest/v1/adress-elevator?elevatorId=' + ElevatorId
            + '&floor=' + Floor, {
            method: "POST",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json"
            }
        });


        {
            ;[...Array(parseInt(elevatorsNumber))].map((e, x) => {
            return [...Array(parseInt(floorsNumber))].map((e, i) => {
                return (document.getElementById(
                    `e${x}${floorsNumber - i - 1}`
                ).style.backgroundColor = 'white')
            })
        })
        }

    }

    return (

        <>
            <div>

                <SockJsClient url='http://localhost:8080/mywebsockets' topics={['/topic/positions']}
                              onMessage={(msg) => {
                                  setPositions(msg);
                                  setA(`e0${positions[0]}`);
                                  setB(`e1${positions[1]}`);
                                  setC(`e2${positions[2]}`);
                                  setD(`e3${positions[3]}`);
                                  setE(`e4${positions[4]}`);


                                  {
                                      ;[...Array(parseInt(elevatorsNumber))].map((e, x) => {
                                      return [...Array(parseInt(floorsNumber))].map((e, i) => {
                                          return (document.getElementById(
                                              `e${x}${floorsNumber - i - 1}`
                                          ).style.backgroundColor = 'white')
                                      })
                                  })
                                  }

                                  if (inicialized === true) {
                                      var elevators = [A, B, C, D, E]
                                      var slicedElevator = elevators.slice(0, elevatorsNumber)
                                      console.log(slicedElevator)

                                      for (const element of slicedElevator) {
                                          console.log(element)
                                          document.getElementById(element).style.backgroundColor = 'grey';
                                      }


                                  }


                              }}


                />
            </div>
            <div id="Select">
                <Row>
                    <Col>
                        <h1>Number of floors</h1>


                        <Select
                            key='1'
                            options={['2', '3', '4', '5', '6']}
                            value={floorsNumber}
                            size="medium"
                            onChange={({option}) => setFloorsNumber(option)}
                        />
                    </Col>
                    <Col>
                        <h1>Number of lifts</h1>


                        <Select
                            size="medium"
                            key='2'
                            options={['1', '2', '3', '4', '5']}
                            value={elevatorsNumber}
                            onChange={({option}) => setElevatorsNumber(option)}
                        />
                    </Col>
                    <Col>
                        <Button
                            label="Install Elevators"
                            onClick={() => {
                                InstallElevators()
                            }}
                        />
                    </Col>
                </Row>
            </div>
            <div id="Lifts">

                <Container>

                    <Row xs={12} md={12} lg={6}>
                        {[...Array(parseInt(elevatorsNumber))].map((e, x) => {
                            return (
                                <Col key={`col${x}`}>
                                    <Container>
                                        {[...Array(parseInt(floorsNumber))].map((e, i) => {
                                            return (
                                                <Box
                                                    key={`e${x}${floorsNumber - i - 1}`}
                                                    id={`e${x}${floorsNumber - i - 1}`}
                                                    width="1/4"
                                                    height="1/4"
                                                    border={{color: 'grey', size: 'small'}}
                                                    pad="xx
                          small"
                                                />
                                            )
                                        })}
                                        {[...Array(parseInt(floorsNumber))].map((e, i) => {
                                            return (
                                                <Button

                                                    key={`${x} ${floorsNumber - i - 1}`}
                                                    color="mediumspringgreen"
                                                    id={`${x} ${floorsNumber - i - 1}`}
                                                    size="medium"
                                                    label={`${floorsNumber - i - 1}`}
                                                    href="#"
                                                    onClick={(event) => {
                                                        reply_click_inElevator(event.target.id)
                                                    }}
                                                />
                                            )
                                        })}
                                    </Container>
                                </Col>
                            )
                        })}

                        <Col>

                            <Container>
                                {[...Array(parseInt(floorsNumber))].map((e, i) => {
                                    return (
                                        <Box
                                            key={i}
                                            width="1/2"
                                            height="1/2"
                                            border={{color: 'grey', size: 'small'}}
                                            pad="xxsmall"
                                        >
                                            <Button
                                                className='buttonsUpDown'
                                                key={`UP ${floorsNumber - i - 1}`}
                                                id={`UP ${floorsNumber - i - 1}`}
                                                size="small"
                                                round="full"
                                                icon={<CaretUp/>}

                                                href="#"
                                                onClick={(event) => {
                                                    reply_click_onFloor(event.target.id)
                                                }}
                                            />{' '}
                                            <Button
                                                className='buttonsUpDown'
                                                key={`DOWN ${floorsNumber - i - 1}`}
                                                id={`DOWN ${floorsNumber - i - 1}`}
                                                round="full"
                                                size="small"
                                                icon={<CaretDown/>}

                                                href="#"
                                                onClick={(event) => {
                                                    reply_click_onFloor(event.target.id)
                                                }}
                                            />
                                        </Box>
                                    )
                                })}
                            </Container>
                        </Col>
                    </Row>
                </Container>
            </div>
        </>
    )
}

export default WelcomeContainer
const rootElement = document.getElementById('root')
render(<WelcomeContainer/>, rootElement)
